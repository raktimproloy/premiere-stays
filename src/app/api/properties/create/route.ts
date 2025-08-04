import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const username = process.env.NEXT_PUBLIC_OWNERREZ_USERNAME || "info@premierestaysmiami.com";
    const password = process.env.NEXT_PUBLIC_OWNERREZ_ACCESS_TOKEN || "pt_1xj6mw0db483n2arxln6rg2zd8xockw2";
    const baseUrl = process.env.NEXT_PUBLIC_OWNERREZ_API_V1 || "https://api.ownerrez.com/v1";

    if (!username || !password) {
      return NextResponse.json({ error: 'API credentials not configured' }, { status: 500 });
    }

    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    const headers = {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    };

    const res = await fetch(`${baseUrl}/properties`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message || 'Failed to create property', details: data }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create property', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}