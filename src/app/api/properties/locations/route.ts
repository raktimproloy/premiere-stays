import { NextResponse } from 'next/server';
import { getCachedProperties } from '@/utils/propertyCache';

interface Property {
  id: number;
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
  [key: string]: any;
}

interface LocationData {
  city: string;
  country: string;
  propertyIds: number[];
}

export async function GET() {
  try {
    // Get properties from cache
    const allProperties = getCachedProperties();
    
    if (!allProperties || allProperties.length === 0) {
      // If no cached properties, return empty result
      return NextResponse.json({
        success: true,
        message: 'No cached properties available. Please call /api/properties/cache first.',
        totalLocations: 0,
        locations: []
      });
    }

    const locationMap = new Map<string, LocationData>();

    allProperties.forEach((property: Property) => {
      const city = property.address?.city?.trim() || '';
      const country = property.address?.country?.trim() || '';
      
      if (!city || !country) return;

      const locationKey = `${city}-${country}`;
      
      if (locationMap.has(locationKey)) {
        const existing = locationMap.get(locationKey)!;
        if (!existing.propertyIds.includes(property.id)) {
          existing.propertyIds.push(property.id);
        }
      } else {
        locationMap.set(locationKey, {
          city,
          country,
          propertyIds: [property.id]
        });
      }
    });

    const uniqueLocations = Array.from(locationMap.values()).sort((a, b) => 
      a.city.localeCompare(b.city)
    );

    return NextResponse.json({
      success: true,
      message: 'Locations retrieved from cached properties',
      totalLocations: uniqueLocations.length,
      locations: uniqueLocations,
      source: 'cache'
    });

  } catch (error) {
    console.error('Locations API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch locations', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 