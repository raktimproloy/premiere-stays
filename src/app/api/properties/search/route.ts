import { NextResponse } from 'next/server';
import { getCachedProperties, getPropertiesByIds } from '@/utils/propertyCache';

interface Property {
  id: number;
  active: boolean;
  address: {
    city: string;
    country: string;
    id: number;
    is_default: boolean;
    postal_code: string;
    state: string;
    street1: string;
    street2: string;
  };
  bathrooms: number;
  bathrooms_full: number;
  bathrooms_half: number;
  bedrooms: number;
  check_in: string;
  check_out: string;
  currency_code: string;
  key: string;
  latitude: number;
  longitude: number;
  max_guests: number;
  max_pets: number;
  name: string;
  property_type: string;
  thumbnail_url: string;
  thumbnail_url_large: string;
  thumbnail_url_medium: string;
  [key: string]: any;
}

interface SearchFilters {
  ids?: string;
  rateFrom?: number;
  rateTo?: number;
  bedroomsFrom?: number;
  bedroomsTo?: number;
  allowsPets?: boolean;
  allowsChildren?: boolean;
  availabilityFrom?: string;
  availabilityTo?: string;
  bathroomsFullFrom?: number;
  bathroomsFullTo?: number;
  bathroomsHalfFrom?: number;
  bathroomsHalfTo?: number;
  guestsFrom?: number;
  guestsTo?: number;
  evaluateAvailabilityRules?: boolean;
  active?: boolean;
  includedTagIds?: string;
  excludedTagIds?: string;
  page?: number;
  pageSize?: number;
}

interface OwnerRezSearchResponse {
  count: number;
  items: Array<{
    id: number;
    key: string;
    name: string;
  }>;
  limit: number;
  offset: number;
  next_page_url?: string;
}

async function callOwnerRezSearchAPI(filters: SearchFilters): Promise<OwnerRezSearchResponse> {
  const username = process.env.NEXT_PUBLIC_OWNERREZ_USERNAME || "info@premierestaysmiami.com";
  const password = process.env.NEXT_PUBLIC_OWNERREZ_ACCESS_TOKEN || "pt_1xj6mw0db483n2arxln6rg2zd8xockw2";
  const baseUrl = process.env.NEXT_PUBLIC_OWNERREZ_API_V1 || "https://api.ownerrez.com/v1";

  if (!username || !password) {
    throw new Error('API credentials not configured');
  }

  const auth = Buffer.from(`${username}:${password}`).toString('base64');
  const headers = { 
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json'
  };

  // Build search URL with all parameters
  const searchUrl = new URL(`${baseUrl}/properties/search`);
  
  // Add all optional parameters if they exist
  if (filters.ids) searchUrl.searchParams.append('ids', filters.ids);
  // if (filters.guestsFrom) searchUrl.searchParams.append('guestsFrom', filters.guestsFrom.toString());
  // if (filters.guestsTo) searchUrl.searchParams.append('guestsTo', filters.guestsTo.toString());
  if (filters.rateFrom) searchUrl.searchParams.append('rateFrom', filters.rateFrom.toString());
  if (filters.rateTo) searchUrl.searchParams.append('rateTo', filters.rateTo.toString());
  if (filters.bedroomsFrom) searchUrl.searchParams.append('bedroomsFrom', filters.bedroomsFrom.toString());
  if (filters.bedroomsTo) searchUrl.searchParams.append('bedroomsTo', filters.bedroomsTo.toString());
  if (filters.allowsPets !== undefined) searchUrl.searchParams.append('allowsPets', filters.allowsPets.toString());
  if (filters.allowsChildren !== undefined) searchUrl.searchParams.append('allowsChildren', filters.allowsChildren.toString());
  if (filters.evaluateAvailabilityRules !== undefined) searchUrl.searchParams.append('evaluateAvailabilityRules', filters.evaluateAvailabilityRules.toString());
  if (filters.active !== undefined) searchUrl.searchParams.append('active', filters.active.toString());
  if (filters.includedTagIds) searchUrl.searchParams.append('includedTagIds', filters.includedTagIds);
  if (filters.excludedTagIds) searchUrl.searchParams.append('excludedTagIds', filters.excludedTagIds);
  if (filters.availabilityFrom) searchUrl.searchParams.append('availabilityFrom', filters.availabilityFrom);
  if (filters.availabilityTo) searchUrl.searchParams.append('availabilityTo', filters.availabilityTo);

  // Add pagination
  const limit = filters.pageSize || 10;
  const offset = ((filters.page || 1) - 1) * limit;
  searchUrl.searchParams.append('limit', limit.toString());
  searchUrl.searchParams.append('offset', offset.toString());


  const res = await fetch(searchUrl.toString(), { headers });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`OwnerRez API error: ${res.status} - ${error.message || 'Unknown error'}`);
  }

  return await res.json();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters: SearchFilters = {
      ids: searchParams.get('ids') || undefined,
      rateFrom: searchParams.get('rateFrom') ? Number(searchParams.get('rateFrom')) : undefined,
      rateTo: searchParams.get('rateTo') ? Number(searchParams.get('rateTo')) : undefined,
      bedroomsFrom: searchParams.get('bedroomsFrom') ? Number(searchParams.get('bedroomsFrom')) : undefined,
      bedroomsTo: searchParams.get('bedroomsTo') ? Number(searchParams.get('bedroomsTo')) : undefined,
      allowsPets: searchParams.get('allowsPets') ? searchParams.get('allowsPets') === 'true' : undefined,
      allowsChildren: searchParams.get('allowsChildren') ? searchParams.get('allowsChildren') === 'true' : undefined,
      availabilityFrom: searchParams.get('availabilityFrom') || undefined,
      availabilityTo: searchParams.get('availabilityTo') || undefined,
      bathroomsFullFrom: searchParams.get('bathroomsFullFrom') ? Number(searchParams.get('bathroomsFullFrom')) : undefined,
      bathroomsFullTo: searchParams.get('bathroomsFullTo') ? Number(searchParams.get('bathroomsFullTo')) : undefined,
      bathroomsHalfFrom: searchParams.get('bathroomsHalfFrom') ? Number(searchParams.get('bathroomsHalfFrom')) : undefined,
      bathroomsHalfTo: searchParams.get('bathroomsHalfTo') ? Number(searchParams.get('bathroomsHalfTo')) : undefined,
      guestsFrom: searchParams.get('guestsFrom') ? Number(searchParams.get('guestsFrom')) : undefined,
      guestsTo: searchParams.get('guestsTo') ? Number(searchParams.get('guestsTo')) : undefined,
      evaluateAvailabilityRules: searchParams.get('evaluateAvailabilityRules') ? searchParams.get('evaluateAvailabilityRules') === 'true' : undefined,
      active: searchParams.get('active') ? searchParams.get('active') === 'true' : undefined,
      includedTagIds: searchParams.get('includedTagIds') || undefined,
      excludedTagIds: searchParams.get('excludedTagIds') || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 10
    };

    // Validate pagination parameters
    if (filters.page && (isNaN(filters.page) || filters.page < 1)) {
      return NextResponse.json(
        { error: 'Invalid page number. Must be greater than 0' },
        { status: 400 }
      );
    }

    if (filters.pageSize && (isNaN(filters.pageSize) || filters.pageSize < 1 || filters.pageSize > 100)) {
      return NextResponse.json(
        { error: 'Invalid page size. Must be between 1 and 100' },
        { status: 400 }
      );
    }

    const searchResponse = await callOwnerRezSearchAPI(filters);
    
    if (!searchResponse.items || searchResponse.items.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No properties found matching search criteria',
        data: {
          properties: [],
          pagination: {
            currentPage: filters.page || 1,
            totalPages: 0,
            totalCount: 0,
            pageSize: filters.pageSize || 10,
            hasNextPage: false,
            hasPreviousPage: false
          }
        },
        filters: filters,
        source: 'ownerrez_search'
      });
    }

    // Extract property IDs from search response
    const propertyIds = searchResponse.items.map(item => item.id);

    const cachedProperties = getCachedProperties();
    
    if (!cachedProperties || cachedProperties.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No cached properties available. Please call /api/properties/cache first.',
        data: {
          properties: [],
          pagination: {
            currentPage: filters.page || 1,
            totalPages: 0,
            totalCount: 0,
            pageSize: filters.pageSize || 10,
            hasNextPage: false,
            hasPreviousPage: false
          }
        },
        filters: filters
      });
    }

    // Get full property details for the found IDs
    const fullProperties = getPropertiesByIds(propertyIds);

    // Step 3: Apply additional filters that aren't supported by OwnerRez search API
    let filteredProperties = fullProperties;
    
    // Filter by bathrooms_full (custom filter)
    if (filters.bathroomsFullFrom !== undefined || filters.bathroomsFullTo !== undefined) {
      filteredProperties = filteredProperties.filter((property: Property) => {
        const bathroomsFull = property.bathrooms_full || 0;
        if (filters.bathroomsFullFrom !== undefined && bathroomsFull < filters.bathroomsFullFrom) return false;
        if (filters.bathroomsFullTo !== undefined && bathroomsFull > filters.bathroomsFullTo) return false;
        return true;
      });
    }

    // Filter by bathrooms_half (custom filter)
    if (filters.bathroomsHalfFrom !== undefined || filters.bathroomsHalfTo !== undefined) {
      filteredProperties = filteredProperties.filter((property: Property) => {
        const bathroomsHalf = property.bathrooms_half || 0;
        if (filters.bathroomsHalfFrom !== undefined && bathroomsHalf < filters.bathroomsHalfFrom) return false;
        if (filters.bathroomsHalfTo !== undefined && bathroomsHalf > filters.bathroomsHalfTo) return false;
        return true;
      });
    }

    // Apply pagination
    const limit = filters.pageSize || 10;
    const offset = ((filters.page || 1) - 1) * limit;
    const totalCount = searchResponse.count || filteredProperties.length;
    const paginatedProperties = filteredProperties.slice(offset, offset + limit);
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = filters.page || 1;


    return NextResponse.json({
      success: true,
      message: 'Properties retrieved from OwnerRez search and cached details',
      data: {
        properties: paginatedProperties,
        pagination: {
          currentPage,
          totalPages,
          totalCount,
          pageSize: limit,
          hasNextPage: currentPage < totalPages,
          hasPreviousPage: currentPage > 1
        }
      },
      filters: filters,
      source: 'ownerrez_search_with_cache',
      searchStats: {
        ownerRezResults: searchResponse.items.length,
        cachedPropertiesFound: fullProperties.length,
        finalResults: paginatedProperties.length
      }
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search properties', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 