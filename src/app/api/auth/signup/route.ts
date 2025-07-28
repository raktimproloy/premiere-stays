import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone, dob, password, profileImage } = await request.json();

    // Validate required fields
    if (!fullName || !email || !phone || !dob || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('premiere-stays');
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user object
    const user = {
      fullName,
      email: email.toLowerCase(),
      phone,
      dob: new Date(dob),
      password: hashedPassword,
      profileImage: profileImage || null,
      role: 'user' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      emailVerified: false,
      registerType: 'manual', // <-- add this line
      socialLogin: {
        google: false,
        facebook: false,
        apple: false
      }
    };

    // Insert user into database
    const result = await usersCollection.insertOne(user);

    // Generate JWT token
    const token = generateToken({
      userId: result.insertedId.toString(),
      email: user.email,
      role: user.role
    });

    // Return user data (without password) and token
    const userResponse = {
      id: result.insertedId.toString(),
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      dob: user.dob,
      profileImage: user.profileImage,
      role: user.role,
      createdAt: user.createdAt,
      emailVerified: user.emailVerified
    };

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: userResponse,
      token
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 