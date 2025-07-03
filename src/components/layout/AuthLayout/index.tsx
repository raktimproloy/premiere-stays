'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from 'next/link';
// import Logo from "/images/logo.png"
const Logo = "/images/logo.png"
const SideImage = "/images/signup.png"
const GoogleIcon = 'images/icons/google.svg'
const FacebookIcon = 'images/icons/facebook.svg'

interface AuthLayoutProps {
    headingName: string;
    title: string;
    description?: string;
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ headingName, title, description, children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
    {/* Left Section - Hidden on mobile, visible on desktop */}
    <div className="hidden md:flex md:w-1/2">
      <div className="w-full h-full flex items-center justify-center py-12">
        <Image src={SideImage} alt='logo' width={500} height={500} objectFit="contain" className='rounded-[20px]'/>
      </div>
      
    </div>
    
    {/* Right Section - Form */}
    <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center">
            {/* <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" /> */}
            <Image src={Logo} alt='logo' width={146} height={64} objectFit="contain"/>
          </div>
          <h1 className="mt-1 text-3xl font-semibold text-gray-900">{title}</h1>
          <p className="mt-2 text-gray-600">Welcome Back! Please Enter Your Details.</p>
        </div>
        
        {children}
        
        {/* Divider */}
        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">Or, Sign up with</span>
          </div>
        </div>
        
        {/* Social Sign Up */}
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            className="inline-flex py-2 text-sm font-medium"
          >
            
          <svg width="57" height="56" viewBox="0 0 57 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="28.8965" cy="28" r="27.5" fill="#F9FAFB" stroke="#EDF1FC"/>
          <g clipPath="url(#clip0_33228_6671)">
          <path d="M34.8016 12.25C33.1223 12.3662 31.1594 13.4411 30.0156 14.8409C28.9722 16.1107 28.1138 17.9967 28.4485 19.8296C30.2833 19.8867 32.1792 18.7862 33.2778 17.3628C34.3055 16.0379 35.0831 14.1636 34.8016 12.25Z" fill="black"/>
          <path d="M41.4378 22.819C39.8254 20.7971 37.5594 19.6238 35.4194 19.6238C32.5943 19.6238 31.3992 20.9763 29.4364 20.9763C27.4126 20.9763 25.875 19.6277 23.4318 19.6277C21.0319 19.6277 18.4764 21.0944 16.8562 23.6026C14.5783 27.1345 14.9682 33.7751 18.6595 39.4313C19.9806 41.4551 21.7446 43.731 24.0519 43.7507C26.1053 43.7704 26.6841 42.4336 29.4659 42.4198C32.2478 42.4041 32.7754 43.7684 34.8249 43.7467C37.1342 43.729 38.9946 41.2071 40.3157 39.1832C41.2626 37.7322 41.615 37.0018 42.3494 35.3638C37.0082 33.3301 36.1518 25.7347 41.4378 22.819Z" fill="black"/>
          </g>
          <defs>
          <clipPath id="clip0_33228_6671">
          <rect width="31.5" height="31.5" fill="white" transform="translate(13.1465 12.25)"/>
          </clipPath>
          </defs>
          </svg>

          </button>
          
          <button
            type="button"
            className="inline-flex py-2 text-sm font-medium"
          >
            <Image src={GoogleIcon} alt='google' width={56} height={56} />
          </button>
          
          <button
            type="button"
            className="inline-flex  py-2 text-sm font-medium"
          >
            <Image src={FacebookIcon} alt='facebook' width={56} height={56} />
          </button>
        </div>
        
        {/* Login Link */}
        <div className="mt-2 text-center">
            {
                headingName === "signup" ?
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                    Login
                    </Link>
                </p>
                :
                <p className="text-sm text-gray-600">
                    Don't have account?{' '}
                    <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                    Signup
                    </Link>
                </p>

            }
        </div>
      </div>
    </div>
  </div>
  )
}


export default AuthLayout