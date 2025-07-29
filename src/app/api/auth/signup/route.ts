import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth';

async function createGuestInOwnerRez(fullName: string, email: string, phone: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fullName,
        email,
        phone
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Guest creation failed: ${error.message || 'Unknown error'}`);
    }

    const result = await response.json();
    return result.guest;
  } catch (error) {
    console.error('Guest creation error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone, dob, password, profileImage } = await request.json();

    // Validate required fields
    if (!fullName || !email || !phone || !dob || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // First, create guest in OwnerRez
    let guestData;
    try {
      guestData = await createGuestInOwnerRez(fullName, email, phone);
    } catch (error) {
      console.error('Failed to create guest in OwnerRez:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to create guest profile. Please try again.' },
        { status: 500 }
      );
    }

    // Then create user in our database with the guest ID
    const result = await authService.signup({
      fullName,
      email,
      phone,
      dob,
      password,
      profileImage,
      guestId: guestData.id // Add guest ID to the signup data
    });

    if (result.success) {
      const response = NextResponse.json(result, { status: 201 });
      
      // Set HTTP-only cookie with the token
      response.cookies.set('authToken', result.token!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/'
      });

      return response;
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 