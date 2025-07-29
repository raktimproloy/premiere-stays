import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('authToken')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const result = await authService.verifyToken(token);

    if (result.valid && result.user) {
      // Remove password from user object
      const { password, ...userWithoutPassword } = result.user;
      // Ensure bookingIds is always present as an array
      if (!userWithoutPassword.bookingIds) userWithoutPassword.bookingIds = [];
      return NextResponse.json({
        success: true,
        user: userWithoutPassword
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Me API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 