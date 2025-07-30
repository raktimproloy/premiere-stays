'use client'

import React, { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useAuth } from '@/components/common/AuthContext';

interface GoogleLoginButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  className = "",
  children
}) => {
  const { loginWithGoogle, signup } = useAuth();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [processingAuth, setProcessingAuth] = useState(false);

  // Split full name into first and last name
  const splitName = (fullName: string) => {
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length === 1) {
      return { firstName: nameParts[0], lastName: '' };
    } else {
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      return { firstName, lastName };
    }
  };

  // Handle authentication when session changes
  useEffect(() => {
    if (session?.user && !processingAuth) {
      console.log('=== NEXT AUTH SESSION DATA ===');
      console.log('Session Status:', status);
      console.log('Session Data:', session);
      console.log('User Data:', session?.user);
      console.log('================================');
      
      handleGoogleAuthentication();
    }
  }, [session, status]);

  const handleGoogleAuthentication = async () => {
    if (processingAuth) return;
    
    try {
      setProcessingAuth(true);
      console.log('Processing Google authentication...');

      // Split the name into first and last name
      const fullName = session?.user?.name || 'Google User';
      const { firstName, lastName } = splitName(fullName);
      
      // Use the existing signup API with Google data
      const signupData = {
        fullName: fullName,
        email: session?.user?.email || '',
        phone: '555-000-0000', // Valid phone format for Google users
        dob: '1990-01-01', // Valid date format for Google users
        password: '', // No password for Google users
        profileImage: session?.user?.image || '',
        registerType: 'google' // Add register type
      };

      console.log('Signup data:', signupData);
      console.log('Split name - First:', firstName, 'Last:', lastName);
      
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData)
      });

      const signupResult = await signupResponse.json();
      console.log('Signup response:', signupResult);

      if (signupResult.success) {
        console.log('Google user signup successful:', signupResult.user);
        console.log('JWT token:', signupResult.token);
        
        // Update auth context
        if (loginWithGoogle) {
          await loginWithGoogle(signupResult.user, signupResult.token);
        }
      } else {
        // If signup fails because user already exists, we need to handle this differently
        if (signupResult.message?.includes('already exists') || signupResult.message?.includes('duplicate')) {
          console.log('User already exists, creating a special login flow for Google user...');
          
          // For existing Google users, we need to create a special login flow
          // Since we can't use the regular login API, we'll create a special endpoint or handle it differently
          
          // For now, let's try to get the user data and create a token manually
          try {
            // Call a special endpoint to get Google user data and create token
            const googleLoginResponse = await fetch('/api/auth/google-login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: session?.user?.email,
                name: session?.user?.name,
                image: session?.user?.image
              })
            });

            const googleLoginResult = await googleLoginResponse.json();
            
            if (googleLoginResult.success) {
              console.log('Google login successful for existing user:', googleLoginResult.user);
              console.log('JWT token:', googleLoginResult.token);
              
              // Update auth context
              if (loginWithGoogle) {
                await loginWithGoogle(googleLoginResult.user, googleLoginResult.token);
              }
            } else {
              console.error('Failed to login existing Google user:', googleLoginResult.message);
              // alert('Login failed: ' + googleLoginResult.message);
            }
          } catch (error) {
            console.error('Error in Google login flow:', error);
            // alert('Authentication failed. Please try again.');
          }
        } else {
          console.error('Google signup failed:', signupResult.message);
          // alert('Google signup failed: ' + signupResult.message);
        }
      }
    } catch (error) {
      console.error('Error during Google authentication:', error);
      // alert('Error during Google authentication. Please try again.');
    } finally {
      setProcessingAuth(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      console.log('Starting Google login...');
      const result = await signIn('google');
      if (result?.ok) {
        console.log('Google login successful!');
        console.log('User data:', session?.user);
        
      } else {
        console.error('Google login failed:', result?.error);
        // alert('Google login failed. Please try again.');
      }
    } catch (error) {
      console.error('Google login error:', error);
      // alert('Google login error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading || processingAuth}
        className={`w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${className} ${(loading || processingAuth) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Processing...
          </div>
        ) : processingAuth ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
            Authenticating...
          </div>
        ) : (
          children || (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </>
          )
        )}
      </button>

      {/* Display session data if available */}
      {session && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">NextAuth Session Data:</h3>
          <div className="text-xs text-gray-600">
            <p><strong>Status:</strong> {status}</p>
            <p><strong>User:</strong> {session.user?.name} ({session.user?.email})</p>
            <p><strong>Image:</strong> {session.user?.image ? 'Available' : 'Not available'}</p>
            <details className="mt-2">
              <summary className="cursor-pointer text-blue-600">View Full Session Data</summary>
              <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-40 text-xs">
                {JSON.stringify(session, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton; 