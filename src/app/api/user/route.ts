// app/api/user/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const username = process.env.NEXT_PUBLIC_OWNERREZ_USERNAME;
    const password = process.env.NEXT_PUBLIC_OQNERREZ_ACCESS_TOKEN;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'API credentials not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.ownerrez.com/v2/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}