import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
  }

  const username = process.env.NEXT_PUBLIC_OWNERREZ_USERNAME || "info@premierestaysmiami.com";
  const password = process.env.NEXT_PUBLIC_OWNERREZ_ACCESS_TOKEN || "pt_1xj6mw0db483n2arxln6rg2zd8xockw2";
  const baseUrl = process.env.NEXT_PUBLIC_OWNERREZ_API_V2 || "https://api.ownerrez.com/v2";

  if (!username || !password || !baseUrl) {
    return NextResponse.json({ error: 'API credentials not configured' }, { status: 500 });
  }

  const auth = Buffer.from(`${username}:${password}`).toString('base64');
  const url = `${baseUrl}/properties/${id}`;

  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = `OwnerRez API error: ${res.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage += ` - ${errorJson.message || 'Unknown error'}`;
      } catch {
        errorMessage += ` - ${errorText || 'Unknown error'}`;
      }
      return NextResponse.json({ error: errorMessage }, { status: res.status });
    }

    const property = await res.json();
    return NextResponse.json({ success: true, property });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch property', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 