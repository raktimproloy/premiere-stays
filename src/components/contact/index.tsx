'use client'
import Image from 'next/image';
import React, { useState } from 'react'
import { FaArrowRight } from 'react-icons/fa';

export default function Index() {
    const contactImage = '/images/contact.jpg';
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      property: '',
      message: ''
    });
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Form submitted:', formData);
      alert('Form submitted! Check console for details.');
    };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 mb-6">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4md text-[#586DF7] mb-4">Contact Us</h1>
        <p className="text-4xl font-bold text-gray-600 mb-6">Get in Touch With Us</p>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-gray-600">
            Have questions, need support, or want to know more about our property listings? Our
            team is here to help you every step of the way. Fill out the form below or reach us
            directly—we'd love to hear from you!
          </p>
        </div>
      </div>

      <div className="">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left side - Image */}
          <div className="lg:w-1/2">
            <div className="h-full flex items-center justify-center">
              <div className="text-white text-center">
                <Image src={contactImage} alt="contact" width={1500} height={1500} className='w-full h-full object-cover rounded-lg' />
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="lg:w-1/2 px-4 py-6 bg-white rounded-xl shadow-md">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Write your message..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-[#586DF7] text-white font-semibold py-3 px-10 rounded-full shadow-md hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 px-10"
              >
                Submit Info
                <FaArrowRight/>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
