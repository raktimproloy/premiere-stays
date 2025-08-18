'use client'
import Breadcrumb from '@/components/common/Breadcrumb'
import PropertyCard from '@/components/common/card/PropertyCard';
import DefaultLayout from '@/components/layout/DefaultLayout'
import React, { useState, useEffect } from 'react'
import { getSearchSession, SearchSession } from '@/utils/cookies';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const propertyImage1 = '/images/property.png';

interface Property {
  id: number;
  title: string;
  location: string;
  image: string;
  beds: number;
  bathrooms: number;
  guestType: string;
  persons: number;
  roomType: string;
  facilities: string[];
  price: number;
  discountPrice: number;
  badge: string;
  rating: number;
  reviews: number;
  // Add pricing state
  pricing?: any;
  pricingLoading?: boolean;
  pricingError?: string | null;
}

const ROOM_TYPES = ['Private Room', 'Shared Room', 'Entire Unit'];
const BED_TYPES = ['Single Bed', 'Double Bed'];
const BATHROOMS = ['Single Bathroom', 'Double Bathroom'];
const GUESTS = ['Adult', 'Youth', 'Children'];
const PERSONS = ['One Person', 'Two Person', 'Four Person'];
const FACILITIES = ['Wi-Fi', 'Pet-Friendly', 'AC', 'Laundry', 'Kitchen Access', 'Private Bathroom', 'Parking', 'Furnished'];

const PROPERTIES_PER_PAGE = 9;

export default function MainPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchId = searchParams.get('id');
    const [properties, setProperties] = useState<Property[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
    const [searchSession, setSearchSession] = useState<SearchSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
    const [selectedBeds, setSelectedBeds] = useState<string[]>([]);
    const [selectedBathrooms, setSelectedBathrooms] = useState<string[]>([]);
    const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
    const [selectedPersons, setSelectedPersons] = useState<string[]>([]);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 400]);

    // Fetch pricing for a specific property
    const fetchPropertyPricing = async (propertyId: number, checkInDate: string, checkOutDate: string) => {
        if (!checkInDate || !checkOutDate) return;

        try {
            console.log(`🔄 Fetching pricing for property ${propertyId}...`);
            
            // Update property to show pricing loading state
            setProperties(prev => prev.map(prop => 
                prop.id === propertyId 
                    ? { ...prop, pricingLoading: true, pricingError: null }
                    : prop
            ));

            const response = await fetch(`/api/properties/${propertyId}/pricing?start=${checkInDate}&end=${checkOutDate}`);
            const data = await response.json();

            if (data.success) {
                console.log(`✅ Pricing loaded for property ${propertyId}`);
                // Update property with pricing data
                setProperties(prev => prev.map(prop => 
                    prop.id === propertyId 
                        ? { 
                            ...prop, 
                            pricing: data.pricing, 
                            pricingLoading: false, 
                            pricingError: null,
                            price: data.pricing.summary.totalAmount || prop.price
                        }
                        : prop
                ));
            } else {
                console.log(`❌ Pricing failed for property ${propertyId}:`, data.error);
                // Update property with pricing error
                setProperties(prev => prev.map(prop => 
                    prop.id === propertyId 
                        ? { 
                            ...prop, 
                            pricing: null, 
                            pricingLoading: false, 
                            pricingError: data.error || 'Failed to fetch pricing'
                        }
                        : prop
                ));
            }
        } catch (error) {
            console.error(`❌ Pricing error for property ${propertyId}:`, error);
            // Update property with pricing error
            setProperties(prev => prev.map(prop => 
                prop.id === propertyId 
                    ? { 
                        ...prop, 
                        pricing: null, 
                        pricingLoading: false, 
                        pricingError: 'Failed to fetch pricing'
                    }
                    : prop
            ));
        }
    };

    // Fetch search session and properties on component mount
    useEffect(() => {
        const initializeSearch = async () => {
            setIsLoading(true);
            setIsInitialLoad(true);
            
            try {
                // Check if searchId exists
                if (!searchId) {
                    console.log('No search ID provided, redirecting to home page');
                    router.push('/');
                    return;
                }

                // Get search session from cookie
                const session = getSearchSession(searchId);
                if (!session) {
                    console.log('No valid search session found, redirecting to home page');
                    router.push('/');
                    return;
                }

                setSearchSession(session);
                
                // Build search parameters
                const searchParams = new URLSearchParams();
                if (session.propertyIds.length > 0) {
                    searchParams.append('ids', session.propertyIds.join(','));
                }
                if (session.checkInDate) {
                    searchParams.append('availabilityFrom', session.checkInDate);
                }
                if (session.checkOutDate) {
                    searchParams.append('availabilityTo', session.checkOutDate);
                }
                if (session.guests) {
                    searchParams.append('guestsFrom', session.guests.toString());
                    searchParams.append('guestsTo', session.guests.toString());
                }
                
                // First, ensure properties are cached
                console.log('🔄 Step 1: Fetching properties cache...');
                const cacheResponse = await fetch('/api/properties/cache');
                if (!cacheResponse.ok) {
                    console.error('Failed to cache properties:', cacheResponse.status, cacheResponse.statusText);
                    // Continue anyway - the search API might still work
                } else {
                    const cacheData = await cacheResponse.json();
                    console.log('Cache response:', cacheData);
                }

                // Then fetch properties from search API
                console.log('🔄 Step 1: Fetching properties from search API...');
                const response = await fetch(`/api/properties/search?${searchParams.toString()}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data.properties) {
                        // Transform API data to match Property interface
                        const transformedProperties = data.data.properties.map((prop: any) => ({
                            id: prop.id,
                            title: prop.name,
                            location: `${prop.address?.city}, ${prop.address?.state}, ${prop.address?.country}`,
                            image: prop.thumbnail_url_medium || propertyImage1,
                            beds: prop.bedrooms || 1,
                            bathrooms: prop.bathrooms || 1,
                            guestType: 'Adult', // Default value
                            persons: prop.max_guests || 2,
                            roomType: prop.property_type || 'Entire Unit',
                            facilities: ['Wi-Fi', 'Parking'], // Default facilities
                            price: 0, // Will be updated with real pricing
                            discountPrice: 180,
                            badge: "FOR RENT",
                            rating: 4.8,
                            reviews: 28,
                            // Initialize pricing state
                            pricing: null,
                            pricingLoading: false,
                            pricingError: null
                        }));
                        console.log(`✅ Step 1 Complete: Successfully loaded ${transformedProperties.length} properties`);
                        setProperties(transformedProperties);
                        setFilteredProperties(transformedProperties);

                        // Step 2: Fetch pricing for each property if we have dates
                        if (session.checkInDate && session.checkOutDate) {
                            console.log('🔄 Step 2: Fetching pricing for all properties...');
                            // Fetch pricing for each property with a small delay to show properties first
                            transformedProperties.forEach((property: Property, index: number) => {
                                setTimeout(() => {
                                    fetchPropertyPricing(property.id, session.checkInDate!, session.checkOutDate!);
                                }, index * 200); // Stagger pricing requests
                            });
                        }
                    } else {
                        console.error('No properties found in search response');
                        // Don't clear properties if we already have some
                        if (properties.length === 0) {
                            setProperties([]);
                            setFilteredProperties([]);
                        }
                    }
                } else {
                    console.error('Failed to fetch properties from search API');
                    // Don't clear properties if we already have some
                    if (properties.length === 0) {
                        setProperties([]);
                        setFilteredProperties([]);
                    }
                }
            } catch (error) {
                console.error('Error initializing search:', error);
                // Don't clear properties if we already have some
                if (properties.length === 0) {
                    setProperties([]);
                    setFilteredProperties([]);
                }
            } finally {
                console.log('Initial load complete. Properties count:', properties.length, 'Filtered count:', filteredProperties.length);
                setIsLoading(false);
                setIsInitialLoad(false);
            }
        };

        initializeSearch();
    }, [searchId, router]);

    // Apply filters to properties
    useEffect(() => {
        // Skip filter application during initial load or if no search session
        if (isInitialLoad || !searchSession || properties.length === 0) {
            return;
        }

        // Check if any filters are actually selected
        const hasActiveFilters = selectedRoomTypes.length > 0 || 
                               selectedBeds.length > 0 || 
                               selectedBathrooms.length > 0 || 
                               selectedGuests.length > 0 || 
                               selectedPersons.length > 0 || 
                               selectedFacilities.length > 0 || 
                               priceRange[0] > 0 || 
                               priceRange[1] < 400;

        // If no filters are active, just use the original properties
        if (!hasActiveFilters) {
            setFilteredProperties(properties);
            setCurrentPage(1);
            return;
        }

        // If we have active filters, we need to make an API call
        // But first, let's check if we actually have properties to filter
        if (properties.length === 0) {
            return;
        }

        // Build search parameters for API
        const fetchFilteredProperties = async () => {
            // Only show loading if we're actually making an API call
            if (hasActiveFilters) {
                setIsLoading(true);
            }
            try {
                const searchParams = new URLSearchParams();
                // Room Type
                if (selectedRoomTypes.length > 0) {
                    searchParams.append('property_type', selectedRoomTypes.join(','));
                }
                // Beds
                if (selectedBeds.length > 0) {
                    // Map to numbers
                    const beds = selectedBeds.map(b => b === 'Single Bed' ? 1 : 2);
                    searchParams.append('bedroomsFrom', Math.min(...beds).toString());
                    searchParams.append('bedroomsTo', Math.max(...beds).toString());
                }
                // Bathrooms
                if (selectedBathrooms.length > 0) {
                    const baths = selectedBathrooms.map(b => b === 'Single Bathroom' ? 1 : 2);
                    searchParams.append('bathroomsFullFrom', Math.min(...baths).toString());
                    searchParams.append('bathroomsFullTo', Math.max(...baths).toString());
                }
                // Guests
                if (selectedGuests.length > 0) {
                    // Not clear how to map guestType, so skip unless API supports
                }
                // Persons (max_guests)
                if (selectedPersons.length > 0) {
                    const persons = selectedPersons.map(p => {
                        if (p === 'One Person') return 1;
                        if (p === 'Two Person') return 2;
                        if (p === 'Four Person') return 4;
                        return 1;
                    });
                    searchParams.append('guestsFrom', Math.min(...persons).toString());
                    searchParams.append('guestsTo', Math.max(...persons).toString());
                }
                // Facilities (if API supports tags)
                // if (selectedFacilities.length > 0) {
                //     searchParams.append('includedTagIds', selectedFacilities.join(','));
                // }
                // Price Range
                if (priceRange[0] > 0) {
                    searchParams.append('rateFrom', priceRange[0].toString());
                }
                if (priceRange[1] < 400) {
                    searchParams.append('rateTo', priceRange[1].toString());
                }
                // Always include propertyIds from searchSession if available
                if (searchSession && searchSession.propertyIds.length > 0) {
                    searchParams.append('ids', searchSession.propertyIds.join(','));
                }
                // Dates
                if (searchSession && searchSession.checkInDate) {
                    searchParams.append('availabilityFrom', searchSession.checkInDate);
                }
                if (searchSession && searchSession.checkOutDate) {
                    searchParams.append('availabilityTo', searchSession.checkOutDate);
                }
                // Guests
                if (searchSession && searchSession.guests) {
                    searchParams.append('guestsFrom', searchSession.guests.toString());
                    searchParams.append('guestsTo', searchSession.guests.toString());
                }
                // Fetch from API
                const response = await fetch(`/api/properties/search?${searchParams.toString()}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data.properties) {
                        const transformedProperties = data.data.properties.map((prop: any) => ({
                            id: prop.id,
                            title: prop.name,
                            location: `${prop.address?.city}, ${prop.address?.state}, ${prop.address?.country}`,
                            image: prop.thumbnail_url_medium || propertyImage1,
                            beds: prop.bedrooms || 1,
                            bathrooms: prop.bathrooms || 1,
                            guestType: 'Adult', // Default value
                            persons: prop.max_guests || 2,
                            roomType: prop.property_type || 'Entire Unit',
                            facilities: ['Wi-Fi', 'Parking'], // Default facilities
                            price: 0, // Will be updated with real pricing
                            discountPrice: 180,
                            badge: "FOR RENT",
                            rating: 4.8,
                            reviews: 28,
                            // Initialize pricing state
                            pricing: null,
                            pricingLoading: false,
                            pricingError: null
                        }));
                        setFilteredProperties(transformedProperties);

                        // Fetch pricing for filtered properties if we have dates
                        if (searchSession && searchSession.checkInDate && searchSession.checkOutDate) {
                            console.log('🔄 Fetching pricing for filtered properties...');
                            transformedProperties.forEach((property: Property, index: number) => {
                                setTimeout(() => {
                                    fetchPropertyPricing(property.id, searchSession.checkInDate!, searchSession.checkOutDate!);
                                }, index * 200); // Stagger pricing requests
                            });
                        }
                    } else {
                        // If no properties found in filter, keep the original properties
                        setFilteredProperties(properties);
                    }
                } else {
                    // If API call failed, keep the original properties
                    setFilteredProperties(properties);
                }
            } catch (error) {
                console.error('Error applying filters:', error);
                // If there's an error, keep the original properties
                setFilteredProperties(properties);
            } finally {
                // Only hide loading if we were actually loading
                if (hasActiveFilters) {
                    setIsLoading(false);
                }
            }
        };
        
        // Only fetch if we have active filters
        if (hasActiveFilters) {
            fetchFilteredProperties();
        }
        setCurrentPage(1); // Reset to first page when filters change
    }, [selectedRoomTypes, selectedBeds, selectedBathrooms, selectedGuests, selectedPersons, selectedFacilities, priceRange, searchSession, isInitialLoad, properties, filteredProperties]);

    const totalPages = Math.ceil(filteredProperties.length / PROPERTIES_PER_PAGE);
    const paginatedProperties = filteredProperties.slice(
        (currentPage - 1) * PROPERTIES_PER_PAGE,
        currentPage * PROPERTIES_PER_PAGE
    );

    // Handlers for checkboxes
    const handleCheckbox = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter((prev) =>
            e.target.checked ? [...prev, value] : prev.filter((v) => v !== value)
        );
    };

    // Handler for price range
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const val = Number(e.target.value);
        setPriceRange((prev) => idx === 0 ? [val, prev[1]] : [prev[0], val]);
    };

    // Clear all filters
    const clearAll = () => {
        setSelectedRoomTypes([]);
        setSelectedBeds([]);
        setSelectedBathrooms([]);
        setSelectedGuests([]);
        setSelectedPersons([]);
        setSelectedFacilities([]);
        setPriceRange([0, 400]);
    };

    // Close filter on mobile when clicking outside
    const handleFilterClose = () => {
        if (window.innerWidth < 768) {
            setShowFilters(false);
        }
    };

    // Show loading state during initial load or when loading and no properties yet
    if (isInitialLoad || (isLoading && properties.length === 0)) {
        return (
            <div className="w-full text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading properties...</p>
            </div>
        );
    }

    return (
        <>
            {/* Properties Header Section */}
            {!isLoading && !isInitialLoad && properties.length > 0 && (
                <div className="flex flex-col max-w-6xl mx-auto lg:flex-row justify-between items-center mt-4 sm:mt-6 md:mt-8 mb-4 sm:mb-6 gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8">
                    <div className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 text-center lg:text-left">
                        <span className="font-semibold">{(currentPage - 1) * PROPERTIES_PER_PAGE + 1}</span> - <span className="font-semibold">{Math.min(currentPage * PROPERTIES_PER_PAGE, filteredProperties.length)}</span> of <span className="font-semibold">{filteredProperties.length}</span> Properties
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs sm:text-sm">Sort By:</span>
                        <button
                            className="ml-2 border border-gray-300 rounded-full px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition flex items-center"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            More Filters
                            <svg className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row">
                {/* Mobile Filter Modal Overlay */}
                {showFilters && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden" onClick={handleFilterClose}></div>
                )}

                {/* Mobile Filter Modal */}
                {showFilters && (
                    <div className="fixed inset-0 z-50 lg:hidden flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out">
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 rounded-t-xl">
                                <div className="flex justify-between items-center">
                                    <div className="font-semibold text-lg">Filter by</div>
                                    <div className="flex items-center gap-2">
                                        <button className="text-blue-500 text-sm" onClick={clearAll}>Clear all</button>
                                        <button className="text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowFilters(false)}>&times;</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 space-y-4">
                                {/* Room Type */}
                                <div>
                                    <div className="font-semibold text-sm mb-2">Room Type</div>
                                    {ROOM_TYPES.map((type) => (
                                        <div key={type} className="flex items-center mb-1">
                                            <input type="checkbox" checked={selectedRoomTypes.includes(type)} onChange={handleCheckbox(setSelectedRoomTypes, type)} className="mr-2" />
                                            <span className="text-sm">{type}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Beds */}
                                <div>
                                    <div className="font-semibold text-sm mb-2">Beds</div>
                                    {BED_TYPES.map((type) => (
                                        <div key={type} className="flex items-center mb-1">
                                            <input type="checkbox" checked={selectedBeds.includes(type)} onChange={handleCheckbox(setSelectedBeds, type)} className="mr-2" />
                                            <span className="text-sm">{type}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Bathrooms */}
                                <div>
                                    <div className="font-semibold text-sm mb-2">Bathrooms</div>
                                    {BATHROOMS.map((type) => (
                                        <div key={type} className="flex items-center mb-1">
                                            <input type="checkbox" checked={selectedBathrooms.includes(type)} onChange={handleCheckbox(setSelectedBathrooms, type)} className="mr-2" />
                                            <span className="text-sm">{type}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Guest */}
                                <div>
                                    <div className="font-semibold text-sm mb-2">Guest</div>
                                    {GUESTS.map((type) => (
                                        <div key={type} className="flex items-center mb-1">
                                            <input type="checkbox" checked={selectedGuests.includes(type)} onChange={handleCheckbox(setSelectedGuests, type)} className="mr-2" />
                                            <span className="text-sm">{type}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Persons */}
                                <div>
                                    <div className="font-semibold text-sm mb-2">Persons</div>
                                    {PERSONS.map((type) => (
                                        <div key={type} className="flex items-center mb-1">
                                            <input type="checkbox" checked={selectedPersons.includes(type)} onChange={handleCheckbox(setSelectedPersons, type)} className="mr-2" />
                                            <span className="text-sm">{type}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Facilities */}
                                <div>
                                    <div className="font-semibold text-sm mb-2">Facilities</div>
                                    {FACILITIES.map((type) => (
                                        <div key={type} className="flex items-center mb-1">
                                            <input type="checkbox" checked={selectedFacilities.includes(type)} onChange={handleCheckbox(setSelectedFacilities, type)} className="mr-2" />
                                            <span className="text-sm">{type}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Price Range */}
                                <div>
                                    <div className="font-semibold text-sm mb-2">Price range</div>
                                    <div className="flex flex-col sm:flex-row items-center justify-between mb-2 gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">Min</span>
                                            <input
                                                type="number"
                                                min={0}
                                                max={priceRange[1]}
                                                value={priceRange[0]}
                                                onChange={e => {
                                                    const val = Math.min(Number(e.target.value), priceRange[1]);
                                                    setPriceRange([val, priceRange[1]]);
                                                }}
                                                className="w-16 px-2 py-1 border border-gray-200 rounded text-xs text-center focus:ring-2 focus:ring-yellow-400"
                                            />
                                        </div>
                                        <span className="mx-2 text-gray-400 hidden sm:inline">—</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">Max</span>
                                            <input
                                                type="number"
                                                min={priceRange[0]}
                                                max={400}
                                                value={priceRange[1]}
                                                onChange={e => {
                                                    const val = Math.max(Number(e.target.value), priceRange[0]);
                                                    setPriceRange([priceRange[0], val]);
                                                }}
                                                className="w-16 px-2 py-1 border border-gray-200 rounded text-xs text-center focus:ring-2 focus:ring-yellow-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="relative flex items-center">
                                        {/* Min slider */}
                                        <input
                                            type="range"
                                            min={0}
                                            max={priceRange[1]}
                                            value={priceRange[0]}
                                            onChange={e => {
                                                const val = Math.min(Number(e.target.value), priceRange[1]);
                                                setPriceRange([val, priceRange[1]]);
                                            }}
                                            className="w-full accent-yellow-400"
                                            style={{ zIndex: priceRange[0] > 0 ? 2 : 1 }}
                                        />
                                        {/* Max slider */}
                                        <input
                                            type="range"
                                            min={priceRange[0]}
                                            max={400}
                                            value={priceRange[1]}
                                            onChange={e => {
                                                const val = Math.max(Number(e.target.value), priceRange[0]);
                                                setPriceRange([priceRange[0], val]);
                                            }}
                                            className="w-full accent-yellow-400 absolute left-0 top-0"
                                            style={{ zIndex: 1 }}
                                            tabIndex={-1}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                                        <span>$0</span>
                                        <span>$400</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Desktop Sidebar Filter Panel */}
                {showFilters && !isLoading && !isInitialLoad && properties.length > 0 && (
                    <div className="hidden lg:block lg:relative lg:w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-6 mr-8 relative z-20">
                        <div className="flex justify-between items-center mb-4">
                            <div className="font-semibold text-lg">Filter by</div>
                            <button className="text-blue-500 text-sm" onClick={clearAll}>Clear all</button>
                        </div>
                        
                        {/* Room Type */}
                        <div className="mb-4">
                            <div className="font-semibold text-sm mb-2">Room Type</div>
                            {ROOM_TYPES.map((type) => (
                                <div key={type} className="flex items-center mb-1">
                                    <input type="checkbox" checked={selectedRoomTypes.includes(type)} onChange={handleCheckbox(setSelectedRoomTypes, type)} className="mr-2" />
                                    <span className="text-sm">{type}</span>
                                </div>
                            ))}
                        </div>
                        
                        {/* Beds */}
                        <div className="mb-4">
                            <div className="font-semibold text-sm mb-2">Beds</div>
                            {BED_TYPES.map((type) => (
                                <div key={type} className="flex items-center mb-1">
                                    <input type="checkbox" checked={selectedBeds.includes(type)} onChange={handleCheckbox(setSelectedBeds, type)} className="mr-2" />
                                    <span className="text-sm">{type}</span>
                                </div>
                            ))}
                        </div>
                        
                        {/* Bathrooms */}
                        <div className="mb-4">
                            <div className="font-semibold text-sm mb-2">Bathrooms</div>
                            {BATHROOMS.map((type) => (
                                <div key={type} className="flex items-center mb-1">
                                    <input type="checkbox" checked={selectedBathrooms.includes(type)} onChange={handleCheckbox(setSelectedBathrooms, type)} className="mr-2" />
                                    <span className="text-sm">{type}</span>
                                </div>
                            ))}
                        </div>
                        
                        {/* Guest */}
                        <div className="mb-4">
                            <div className="font-semibold text-sm mb-2">Guest</div>
                            {GUESTS.map((type) => (
                                <div key={type} className="flex items-center mb-1">
                                    <input type="checkbox" checked={selectedGuests.includes(type)} onChange={handleCheckbox(setSelectedGuests, type)} className="mr-2" />
                                    <span className="text-sm">{type}</span>
                                </div>
                            ))}
                        </div>
                        
                        {/* Persons */}
                        <div className="mb-4">
                            <div className="font-semibold text-sm mb-2">Persons</div>
                            {PERSONS.map((type) => (
                                <div key={type} className="flex items-center mb-1">
                                    <input type="checkbox" checked={selectedPersons.includes(type)} onChange={handleCheckbox(setSelectedPersons, type)} className="mr-2" />
                                    <span className="text-sm">{type}</span>
                                </div>
                            ))}
                        </div>
                        
                        {/* Facilities */}
                        <div className="mb-4">
                            <div className="font-semibold text-sm mb-2">Facilities</div>
                            {FACILITIES.map((type) => (
                                <div key={type} className="flex items-center mb-1">
                                    <input type="checkbox" checked={selectedFacilities.includes(type)} onChange={handleCheckbox(setSelectedFacilities, type)} className="mr-2" />
                                    <span className="text-sm">{type}</span>
                                </div>
                            ))}
                        </div>
                        
                        {/* Price Range */}
                        <div className="mb-4">
                            <div className="font-semibold text-sm mb-2">Price range</div>
                            <div className="flex flex-col sm:flex-row items-center justify-between mb-2 gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">Min</span>
                                    <input
                                        type="number"
                                        min={0}
                                        max={priceRange[1]}
                                        value={priceRange[0]}
                                        onChange={e => {
                                            const val = Math.min(Number(e.target.value), priceRange[1]);
                                            setPriceRange([val, priceRange[1]]);
                                        }}
                                        className="w-16 px-2 py-1 border border-gray-200 rounded text-xs text-center focus:ring-2 focus:ring-yellow-400"
                                    />
                                </div>
                                <span className="mx-2 text-gray-400 hidden sm:inline">—</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">Max</span>
                                    <input
                                        type="number"
                                        min={priceRange[0]}
                                        max={400}
                                        value={priceRange[1]}
                                        onChange={e => {
                                            const val = Math.max(Number(e.target.value), priceRange[0]);
                                            setPriceRange([priceRange[0], val]);
                                        }}
                                        className="w-16 px-2 py-1 border border-gray-200 rounded text-xs text-center focus:ring-2 focus:ring-yellow-400"
                                    />
                                </div>
                            </div>
                            <div className="relative flex items-center">
                                {/* Min slider */}
                                <input
                                    type="range"
                                    min={0}
                                    max={priceRange[1]}
                                    value={priceRange[0]}
                                    onChange={e => {
                                        const val = Math.min(Number(e.target.value), priceRange[1]);
                                        setPriceRange([val, priceRange[1]]);
                                    }}
                                    className="w-full accent-yellow-400"
                                    style={{ zIndex: priceRange[0] > 0 ? 2 : 1 }}
                                />
                                {/* Max slider */}
                                <input
                                    type="range"
                                    min={priceRange[0]}
                                    max={400}
                                    value={priceRange[1]}
                                    onChange={e => {
                                        const val = Math.max(Number(e.target.value), priceRange[0]);
                                        setPriceRange([priceRange[0], val]);
                                    }}
                                    className="w-full accent-yellow-400 absolute left-0 top-0"
                                    style={{ zIndex: 1 }}
                                    tabIndex={-1}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>$0</span>
                                <span>$400</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Property Grid */}
                <div className={`flex-1 transition-all duration-300 ${showFilters ? 'lg:w-2/3' : 'w-full'}`}>
                    {isLoading ? (
                        <div className="w-full text-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading properties...</p>
                        </div>
                    ) : !isInitialLoad && !isLoading && properties.length === 0 ? (
                        <div className="w-full text-center py-16">
                            <div className="mb-4">
                                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties available</h3>
                            <p className="text-gray-500">No properties found matching your search criteria.</p>
                        </div>
                    ) : filteredProperties.length > 0 ? (
                        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 ${showFilters ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
                            {paginatedProperties.map((property) => (
                                <PropertyCard key={property.id} property={property} searchId={searchId} />
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Pagination */}
            {!isLoading && !isInitialLoad && properties.length > 0 && totalPages > 1 && (
                <div className="flex justify-center my-16 mb-20 sm:my-16 lg:my-20 px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-2 sm:gap-4">
                        {/* Left Arrow */}
                        <button
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border text-sm sm:text-base ${currentPage === 1 ? 'border-blue-100 text-blue-200 cursor-not-allowed' : 'border-blue-100 text-blue-500 hover:bg-blue-50'}`}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            &larr;
                        </button>
                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-blue-100 text-blue-500 font-semibold text-xs sm:text-sm ${currentPage === page ? 'bg-yellow-400 text-white' : 'bg-white hover:bg-blue-50'}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page.toString().padStart(2, '0')}
                            </button>
                        ))}
                        {/* Right Arrow */}
                        <button
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border text-sm sm:text-base ${currentPage === totalPages ? 'border-blue-100 text-blue-200 cursor-not-allowed' : 'border-blue-100 text-blue-500 hover:bg-blue-50'}`}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            &rarr;
                        </button>
                    </nav>
                </div>
            )}
        </>
    )
}
