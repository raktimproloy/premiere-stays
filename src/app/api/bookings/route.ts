// app/api/bookings/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const username = process.env.NEXT_PUBLIC_OWNERREZ_USERNAME;
    const password = process.env.NEXT_PUBLIC_OQNERREZ_ACCESS_TOKEN;
    const { searchParams } = new URL(request.url);
    const since = searchParams.get('since') || '2025-01-01T00:00:00Z';
    const limit = searchParams.get('limit') || '50';

    if (!username || !password) {
      return NextResponse.json(
        { error: 'API credentials not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.ownerrez.com/v2/bookings?since_utc=${since}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching booking data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking data' },
      { status: 500 }
    );
  }
}