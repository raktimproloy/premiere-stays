'use client'

// components/SignUpForm.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AuthLayout from '../layout/AuthLayout';
// import Logo from "/images/logo.png"
const Logo = "/images/logo.png"
const SideImage = "/images/signup.png"
const GoogleIcon = 'images/icons/google.svg'
const FacebookIcon = 'images/icons/facebook.svg'

// Type definitions for form data
type FormData = {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  password: string;
  confirmPassword: string;
  rememberMe: boolean;
};

// Type definitions for form errors
type FormErrors = {
  fullName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  password?: string;
  confirmPassword?: string;
};

const SignUpForm = () => {
  // State for form data
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  });

  // State for form errors
  const [errors, setErrors] = useState<FormErrors>({});

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  // Handle date changes
  const handleDateChange = (date: Date | null) => {
    setFormData({
      ...formData,
      dob: date ? date.toISOString().split('T')[0] : '',
    });

    // Clear error if any
    if (errors.dob) {
      setErrors({
        ...errors,
        dob: undefined,
      });
    }
  };

  // Validate form function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // Date of birth validation
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      const minAgeDate = new Date(
        today.getFullYear() - 13,
        today.getMonth(),
        today.getDate()
      );
      
      if (dobDate > minAgeDate) {
        newErrors.dob = 'You must be at least 13 years old';
      }
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, you would send this data to your backend
      alert('Form submitted successfully! Check console for data.');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <AuthLayout headingName='signup' title='Create an account'>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className='grid md:grid-cols-2 grid-cols-1 gap-2 md:gap-4 mb-4'>
          {/* Full Name */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5007 10C12.8018 10 14.6673 8.13454 14.6673 5.83335C14.6673 3.53217 12.8018 1.66669 10.5007 1.66669C8.19946 1.66669 6.33398 3.53217 6.33398 5.83335C6.33398 8.13454 8.19946 10 10.5007 10Z" stroke="#4E5258" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.6585 18.3333C17.6585 15.1083 14.4501 12.5 10.5001 12.5C6.55013 12.5 3.3418 15.1083 3.3418 18.3333" stroke="#4E5258" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                  errors.fullName 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                }`}
                placeholder="Full name"
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>
          
          {/* Email */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.166 17.0834H5.83268C3.33268 17.0834 1.66602 15.8334 1.66602 12.9167V7.08335C1.66602 4.16669 3.33268 2.91669 5.83268 2.91669H14.166C16.666 2.91669 18.3327 4.16669 18.3327 7.08335V12.9167C18.3327 15.8334 16.666 17.0834 14.166 17.0834Z" stroke="#4E5258" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14.1673 7.5L11.559 9.58333C10.7006 10.2667 9.29231 10.2667 8.43398 9.58333L5.83398 7.5" stroke="#4E5258" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        <div className='grid md:grid-cols-2 grid-cols-1 gap-2 md:gap-4 mb-4'>
          {/* Phone Number */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 1H2.75C2.15326 1 1.58097 1.20319 1.15901 1.56487C0.737053 1.92654 0.5 2.41708 0.5 2.92857V17.0714C0.5 17.5829 0.737053 18.0735 1.15901 18.4351C1.58097 18.7968 2.15326 19 2.75 19H10.25C10.8467 19 11.419 18.7968 11.841 18.4351C12.2629 18.0735 12.5 17.5829 12.5 17.0714V2.92857C12.5 2.41708 12.2629 1.92654 11.841 1.56487C11.419 1.20319 10.8467 1 10.25 1H8M5 1V2.28571H8V1M5 1H8M5 17.0714H8" stroke="#4E5258" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                  errors.phone 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                }`}
                placeholder="Phone number"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
          
          {/* Date of Birth */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.66602 1.66669V4.16669" stroke="#4E5258" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.334 1.66669V4.16669" stroke="#4E5258" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.91602 7.57501H17.0827" stroke="#4E5258" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.5 7.08335V14.1667C17.5 16.6667 16.25 18.3334 13.3333 18.3334H6.66667C3.75 18.3334 2.5 16.6667 2.5 14.1667V7.08335C2.5 4.58335 3.75 2.91669 6.66667 2.91669H13.3333C16.25 2.91669 17.5 4.58335 17.5 7.08335Z" stroke="#4E5258" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.0781 11.4167H13.0856" stroke="#4E5258" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.0781 13.9167H13.0856" stroke="#4E5258" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.99607 11.4167H10.0036" stroke="#4E5258" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.99607 13.9167H10.0036" stroke="#4E5258" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.91209 11.4167H6.91957" stroke="#4E5258" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.91209 13.9167H6.91957" stroke="#4E5258" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <DatePicker
                selected={formData.dob ? new Date(formData.dob) : null}
                onChange={handleDateChange}
                placeholderText="Date of birth"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                  errors.dob 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                }`}
                dateFormat="yyyy-MM-dd"
              />
            </div>
            {errors.dob && (
              <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
            )}
          </div>
        </div>
        
        {/* Password */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 8.95866C15.1583 8.95866 14.875 8.67533 14.875 8.33366V6.66699C14.875 4.04199 14.1333 2.29199 10.5 2.29199C6.86667 2.29199 6.125 4.04199 6.125 6.66699V8.33366C6.125 8.67533 5.84167 8.95866 5.5 8.95866C5.15833 8.95866 4.875 8.67533 4.875 8.33366V6.66699C4.875 4.25033 5.45833 1.04199 10.5 1.04199C15.5417 1.04199 16.125 4.25033 16.125 6.66699V8.33366C16.125 8.67533 15.8417 8.95866 15.5 8.95866Z" fill="#4E5258"/>
              <path d="M10.5013 16.0417C9.00964 16.0417 7.79297 14.825 7.79297 13.3333C7.79297 11.8417 9.00964 10.625 10.5013 10.625C11.993 10.625 13.2096 11.8417 13.2096 13.3333C13.2096 14.825 11.993 16.0417 10.5013 16.0417ZM10.5013 11.875C9.7013 11.875 9.04297 12.5333 9.04297 13.3333C9.04297 14.1333 9.7013 14.7917 10.5013 14.7917C11.3013 14.7917 11.9596 14.1333 11.9596 13.3333C11.9596 12.5333 11.3013 11.875 10.5013 11.875Z" fill="#4E5258"/>
              <path d="M14.666 18.958H6.33268C2.65768 18.958 1.54102 17.8413 1.54102 14.1663V12.4997C1.54102 8.82467 2.65768 7.70801 6.33268 7.70801H14.666C18.341 7.70801 19.4577 8.82467 19.4577 12.4997V14.1663C19.4577 17.8413 18.341 18.958 14.666 18.958ZM6.33268 8.95801C3.34935 8.95801 2.79102 9.52467 2.79102 12.4997V14.1663C2.79102 17.1413 3.34935 17.708 6.33268 17.708H14.666C17.6493 17.708 18.2077 17.1413 18.2077 14.1663V12.4997C18.2077 9.52467 17.6493 8.95801 14.666 8.95801H6.33268Z" fill="#4E5258"/>
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                errors.password 
                  ? 'border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
        
        {/* Confirm Password */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 8.95866C15.1583 8.95866 14.875 8.67533 14.875 8.33366V6.66699C14.875 4.04199 14.1333 2.29199 10.5 2.29199C6.86667 2.29199 6.125 4.04199 6.125 6.66699V8.33366C6.125 8.67533 5.84167 8.95866 5.5 8.95866C5.15833 8.95866 4.875 8.67533 4.875 8.33366V6.66699C4.875 4.25033 5.45833 1.04199 10.5 1.04199C15.5417 1.04199 16.125 4.25033 16.125 6.66699V8.33366C16.125 8.67533 15.8417 8.95866 15.5 8.95866Z" fill="#4E5258"/>
              <path d="M10.5013 16.0417C9.00964 16.0417 7.79297 14.825 7.79297 13.3333C7.79297 11.8417 9.00964 10.625 10.5013 10.625C11.993 10.625 13.2096 11.8417 13.2096 13.3333C13.2096 14.825 11.993 16.0417 10.5013 16.0417ZM10.5013 11.875C9.7013 11.875 9.04297 12.5333 9.04297 13.3333C9.04297 14.1333 9.7013 14.7917 10.5013 14.7917C11.3013 14.7917 11.9596 14.1333 11.9596 13.3333C11.9596 12.5333 11.3013 11.875 10.5013 11.875Z" fill="#4E5258"/>
              <path d="M14.666 18.958H6.33268C2.65768 18.958 1.54102 17.8413 1.54102 14.1663V12.4997C1.54102 8.82467 2.65768 7.70801 6.33268 7.70801H14.666C18.341 7.70801 19.4577 8.82467 19.4577 12.4997V14.1663C19.4577 17.8413 18.341 18.958 14.666 18.958ZM6.33268 8.95801C3.34935 8.95801 2.79102 9.52467 2.79102 12.4997V14.1663C2.79102 17.1413 3.34935 17.708 6.33268 17.708H14.666C17.6493 17.708 18.2077 17.1413 18.2077 14.1663V12.4997C18.2077 9.52467 17.6493 8.95801 14.666 8.95801H6.33268Z" fill="#4E5258"/>
              </svg>
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                errors.confirmPassword 
                  ? 'border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>
        
        {/* Remember Me */}
        <div className="flex items-center">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
            Remember Me
          </label>
        </div>
        
        {/* Sign Up Button */}
        <button
          type="submit"
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-black bg-[#F7B730] hover:bg-[#e6a820] cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
        >
          Sign Up
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </form>
    </AuthLayout>
  );
};

export default SignUpForm;