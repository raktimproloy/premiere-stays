import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { email, name, picture, facebookId } = await request.json();

    // Validate required fields
    if (!name || !facebookId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('premiere-stays');
    const usersCollection = db.collection('users');

    // Check if user already exists by Facebook ID or email
    let user = await usersCollection.findOne({
      $or: [
        { 'socialLogin.facebookId': facebookId },
        ...(email ? [{ email: email.toLowerCase() }] : [])
      ]
    });

    if (user) {
      // User exists, update social login info
      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            'socialLogin.facebook': true,
            'socialLogin.facebookId': facebookId,
            lastLogin: new Date(),
            updatedAt: new Date()
          }
        }
      );

      // Update user object
      user.socialLogin.facebook = true;
      user.socialLogin.facebookId = facebookId;
      user.lastLogin = new Date();
    } else {
      // Create new user
      const newUser = {
        fullName: name,
        email: email ? email.toLowerCase() : null,
        phone: null,
        dob: null,
        password: null, // No password for social login
        profileImage: picture,
        role: 'user' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        emailVerified: !!email, // Facebook emails are verified if provided
        lastLogin: new Date(),
        socialLogin: {
          google: false,
          facebook: true,
          facebookId: facebookId,
          apple: false
        }
      };

      const result = await usersCollection.insertOne(newUser);
      user = { ...newUser, _id: result.insertedId };
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email || `fb_${facebookId}@facebook.com`, // Fallback email for Facebook users
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
      message: 'Facebook authentication successful',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Facebook auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 