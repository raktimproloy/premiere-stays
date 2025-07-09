// app/api/bookings/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const username = process.env.NEXT_PUBLIC_OWNERREZ_USERNAME;
    const password = process.env.NEXT_PUBLIC_OWNERREZ_ACCESS_TOKEN;
    const v2Url = process.env.NEXT_PUBLIC_OWNERREZ_API_V2;
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const start_date = searchParams.get('start_date') || '';
    const end_date = searchParams.get('end_date') || '';
    const status = searchParams.get('status') || '';
    const since_utc = searchParams.get('since_utc') || '2025-01-01T00:00:00Z';

    if (!username || !password) {
      return NextResponse.json(
        { error: 'API credentials not configured' },
        { status: 500 }
      );
    }

    // Build API URL with parameters
    let url = `${v2Url}/bookings?since_utc=${encodeURIComponent(since_utc)}`;
    
    if (start_date && end_date) {
      url += `&start_date=${start_date}&end_date=${end_date}`;
    }
    
    if (status) {
      url += `&status=${status}`;
    }
    
    // Increase limit to ensure we get all bookings for the month
    url += `&limit=1000`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching booking data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}