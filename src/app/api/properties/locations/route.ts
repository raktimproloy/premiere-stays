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
    console.log('Locations API called. Environment:', process.env.NODE_ENV);
    console.log('Vercel environment:', process.env.VERCEL);

    // Get properties from cache
    const allProperties = getCachedProperties();
    
    console.log(`Retrieved ${allProperties?.length || 0} properties from cache`);
    
    if (!allProperties || allProperties.length === 0) {
      console.log('No cached properties available for locations');
      // If no cached properties, return empty result
      return NextResponse.json({
        success: true,
        message: 'No cached properties available. Please call /api/properties/cache first.',
        totalLocations: 0,
        locations: [],
        environment: process.env.NODE_ENV,
        isVercel: process.env.VERCEL === '1'
      });
    }

    const locationMap = new Map<string, LocationData>();

    console.log('Processing properties to extract locations...');

    allProperties.forEach((property: Property) => {
      const city = property.address?.city?.trim() || '';
      const country = property.address?.country?.trim() || '';
      
      if (!city || !country) {
        console.log(`Skipping property ${property.id} - missing city or country: city="${city}", country="${country}"`);
        return;
      }

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

    console.log(`Found ${uniqueLocations.length} unique locations`);

    return NextResponse.json({
      success: true,
      message: 'Locations retrieved from cached properties',
      totalLocations: uniqueLocations.length,
      locations: uniqueLocations,
      source: 'cache',
      environment: process.env.NODE_ENV,
      isVercel: process.env.VERCEL === '1'
    });

  } catch (error) {
    console.error('Locations API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch locations', 
        details: error instanceof Error ? error.message : 'Unknown error',
        environment: process.env.NODE_ENV,
        isVercel: process.env.VERCEL === '1'
      },
      { status: 500 }
    );
  }
} 