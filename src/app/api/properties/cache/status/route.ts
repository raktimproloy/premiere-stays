import { NextResponse } from 'next/server';
import { getCachedProperties, isCacheValid } from '@/utils/propertyCache';

export async function GET() {
  try {
    const cachedProperties = getCachedProperties();
    const isValid = isCacheValid();

    return NextResponse.json({
      success: true,
      cacheValid: isValid,
      totalProperties: cachedProperties ? cachedProperties.length : 0,
      hasCache: cachedProperties !== null,
      timestamp: cachedProperties ? new Date().toISOString() : null
    });

  } catch (error) {
    console.error('Cache status API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check cache status', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 