import { NextResponse } from 'next/server';
import { getCachedProperties, setCachedProperties } from '@/utils/propertyCache';

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

interface OwnerRezPropertiesResponse {
  count: number;
  items: Property[];
  limit: number;
  offset: number;
  next_page_url?: string;
}

async function fetchAllProperties(): Promise<Property[]> {
  const username = process.env.NEXT_PUBLIC_OWNERREZ_USERNAME || "info@premierestaysmiami.com";
  const password = process.env.NEXT_PUBLIC_OWNERREZ_ACCESS_TOKEN || "pt_1xj6mw0db483n2arxln6rg2zd8xockw2";
  const baseUrl = process.env.NEXT_PUBLIC_OWNERREZ_API_V2 || "https://api.ownerrez.com/v2";

  if (!username || !password) {
    throw new Error('API credentials not configured');
  }

  const auth = Buffer.from(`${username}:${password}`).toString('base64');
  const headers = { 
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json'
  };

  const allProperties: Property[] = [];
  let offset = 0;
  const limit = 1000;

  console.log('Starting to fetch properties from OwnerRez API...');

  while (true) {
    const apiUrl = new URL(`${baseUrl}/properties`);
    apiUrl.searchParams.append('include_tags', 'True');
    apiUrl.searchParams.append('include_fields', 'True');
    apiUrl.searchParams.append('include_listing_numbers', 'True');
    apiUrl.searchParams.append('limit', limit.toString());
    apiUrl.searchParams.append('offset', offset.toString());

    console.log(`Fetching properties with offset: ${offset}, limit: ${limit}`);

    const res = await fetch(apiUrl.toString(), { headers });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(`OwnerRez API error: ${res.status} - ${error.message || 'Unknown error'}`);
    }

    const data: OwnerRezPropertiesResponse = await res.json();
    allProperties.push(...data.items);
    
    console.log(`Fetched ${data.items.length} properties. Total so far: ${allProperties.length}`);
    
    if (data.items.length < limit) break;
    offset += limit;
  }

  console.log(`Total properties fetched: ${allProperties.length}`);
  return allProperties;
}

export async function GET() {
  try {
    console.log('Cache API called. Environment:', process.env.NODE_ENV);
    console.log('Vercel environment:', process.env.VERCEL);

    // Check if cache is valid
    const cachedProperties = getCachedProperties();
    
    if (cachedProperties) {
      console.log(`Returning ${cachedProperties.length} properties from cache`);
      return NextResponse.json({
        success: true,
        message: 'Properties retrieved from cache',
        totalProperties: cachedProperties.length,
        properties: cachedProperties,
        source: 'cache',
        environment: process.env.NODE_ENV,
        isVercel: process.env.VERCEL === '1'
      });
    }

    console.log('No valid cache found, fetching from API...');
    const properties = await fetchAllProperties();
    
    // Store in cache
    console.log('Storing properties in cache...');
    const cacheSuccess = setCachedProperties(properties);

    if (!cacheSuccess) {
      console.warn('Failed to cache properties, but returning them anyway');
    }

    return NextResponse.json({
      success: true,
      message: cacheSuccess ? 'Properties fetched from API and cached' : 'Properties fetched from API but caching failed',
      totalProperties: properties.length,
      properties: properties,
      source: 'api',
      cacheSuccess,
      environment: process.env.NODE_ENV,
      isVercel: process.env.VERCEL === '1'
    });

  } catch (error) {
    console.error('Properties cache API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch properties', 
        details: error instanceof Error ? error.message : 'Unknown error',
        environment: process.env.NODE_ENV,
        isVercel: process.env.VERCEL === '1'
      },
      { status: 500 }
    );
  }
} 