import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { email, name, picture, appleId } = await request.json();

    // Validate required fields
    if (!appleId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('premiere-stays');
    const usersCollection = db.collection('users');

    // Check if user already exists by Apple ID or email
    let user = await usersCollection.findOne({
      $or: [
        { 'socialLogin.appleId': appleId },
        ...(email ? [{ email: email.toLowerCase() }] : [])
      ]
    });

    if (user) {
      // User exists, update social login info
      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            'socialLogin.apple': true,
            'socialLogin.appleId': appleId,
            lastLogin: new Date(),
            updatedAt: new Date()
          }
        }
      );

      // Update user object
      user.socialLogin.apple = true;
      user.socialLogin.appleId = appleId;
      user.lastLogin = new Date();
    } else {
      // Create new user
      const newUser = {
        fullName: name || `Apple User ${appleId.slice(-4)}`,
        email: email ? email.toLowerCase() : null,
        phone: null,
        dob: null,
        password: null, // No password for social login
        profileImage: picture,
        role: 'user' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        emailVerified: !!email, // Apple emails are verified if provided
        lastLogin: new Date(),
        socialLogin: {
          google: false,
          facebook: false,
          apple: true,
          appleId: appleId
        }
      };

      const result = await usersCollection.insertOne(newUser);
      user = { ...newUser, _id: result.insertedId };
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email || `apple_${appleId}@apple.com`, // Fallback email for Apple users
      role: user.role
    });

    // Return user data and token
    const userResponse = {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      dob: user.dob,
      profileImage: user.profileImage,
      role: user.role,
      createdAt: user.createdAt,
      emailVerified: user.emailVerified,
      lastLogin: user.lastLogin
    };

    return NextResponse.json({
      success: true,
      message: 'Apple authentication successful',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Apple auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 