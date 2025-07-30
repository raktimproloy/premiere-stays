'use client'

import React, { useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

import { useAuth } from '@/components/common/AuthContext';

export default function TestLoginPage() {
  const { data: session, status } = useSession();
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    console.log('=== NEXT AUTH SESSION DATA ===');
    console.log('Session Status:', status);
    console.log('Session Data:', session);
    console.log('User Data:', session?.user);
    console.log('Access Token:', (session as any)?.accessToken);
    console.log('================================');
  }, [session, status]);

  const handleGoogleLogin = async () => {
    try {
      console.log('Starting Google login...');
      const result = await signIn('google', {
        callbackUrl: '/',
        redirect: false
      });

      console.log('Google login result:', result);

      if (result?.ok) {
        const session = await getSession();
        console.log('User session after Google login:', session);
        console.log('Google login successful!');
        console.log('User data:', session?.user);
        window.location.href = '/';
      } else {
        console.error('Google login failed:', result?.error);
      }
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/test-login' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const testGoogleAuthAPI = async () => {
    if (!session?.user) {
      alert('Please login with Google first to test the API');
      return;
    }

    try {
      console.log('Testing Google auth API with session data:', session.user);
      
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
          image: session.user.image
        })
      });

      const data = await response.json();
      console.log('Google auth API response:', data);

      if (data.success) {
        console.log('Google auth API test successful!');
        console.log('User data:', data.user);
        console.log('JWT token:', data.token);
        
        // Test the loginWithGoogle function
        if (loginWithGoogle) {
          await loginWithGoogle(data.user, data.token);
          alert('Google auth API test successful! User logged in and redirected.');
        } else {
          alert('Google auth API test successful! Check console for details.');
        }
      } else {
        alert('Google auth API test failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error testing Google auth API:', error);
      alert('Error testing Google auth API. Check console for details.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Test Login Page
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Test Google authentication and session management
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {/* Session Status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Session Status</h3>
              <p className="text-sm text-gray-600">
                Status: <span className="font-medium">{status}</span>
              </p>
              {session?.user && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    User: <span className="font-medium">{session.user.name}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: <span className="font-medium">{session.user.email}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {status === 'unauthenticated' ? (
                <>
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Test Google Login (Direct)
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={testGoogleAuthAPI}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Test Google Auth API
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Instructions</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Click "Continue with Google" to login with Google</li>
                <li>• Check browser console for session data</li>
                <li>• After login, test the Google Auth API</li>
                <li>• Check console for API response details</li>
                <li>• User should be redirected to home page after successful auth</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 