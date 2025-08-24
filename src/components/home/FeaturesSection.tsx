'use client';

import React, { useState, useEffect } from "react";
import { FeatureIcon1, FeatureIcon2, FeatureIcon3, FeatureIcon4, FeatureIcon5 } from "../../../public/images/svg";
import Image from "next/image";

// Define the interface for features data
interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export default function FeaturesSection() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch features data on component mount
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await fetch('/api/page-settings/home');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data.features) {
            setFeatures(result.data.features);
          } else {
            // Use default features if API doesn't return data
            setFeatures([
              {
                id: '1',
                icon: 'home',
                title: 'Direct Booking with No Service Fees',
                description: 'Encourages guests to book directly through the website and avoid third-party platform fees',
              },
              {
                id: '2',
                icon: 'star',
                title: 'Luxury, Fully-Furnished Vacation Rentals',
                description: 'Encourages guests to book directly through the website and avoid third-party platform fees',
              },
              {
                id: '3',
                icon: 'lock',
                title: 'Self Check-In with Smart Lock Technology',
                description: 'Easy, contactless access to all properties through keyless entry, ensuring convenience and security.',
              },
              {
                id: '4',
                icon: 'lightning',
                title: 'Transparent Pricing & Instant Booking',
                description: 'Guests can view detailed pricing breakdowns with taxes and cleaning fees included, and instantly reserve.',
              },
            ]);
          }
        } else {
          // Use default features if API fails
          setFeatures([
            {
              id: '1',
              icon: 'home',
              title: 'Direct Booking with No Service Fees',
              description: 'Encourages guests to book directly through the website and avoid third-party platform fees',
            },
            {
              id: '2',
              icon: 'star',
              title: 'Luxury, Fully-Furnished Vacation Rentals',
              description: 'Encourages guests to book directly through the website and avoid third-party platform fees',
            },
            {
              id: '3',
              icon: 'lock',
              title: 'Self Check-In with Smart Lock Technology',
              description: 'Easy, contactless access to all properties through keyless entry, ensuring convenience and security.',
            },
            {
              id: '4',
              icon: 'lightning',
              title: 'Transparent Pricing & Instant Booking',
              description: 'Guests can view detailed pricing breakdowns with taxes and cleaning fees included, and instantly reserve.',
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching features:', error);
        // Use default features if fetch fails
        setFeatures([
          {
            id: '1',
            icon: 'home',
            title: 'Direct Booking with No Service Fees',
            description: 'Encourages guests to book directly through the website and avoid third-party platform fees',
          },
          {
            id: '2',
            icon: 'star',
            title: 'Luxury, Fully-Furnished Vacation Rentals',
            description: 'Encourages guests to book directly through the website and avoid third-party platform fees',
          },
          {
            id: '3',
            icon: 'lock',
            title: 'Self Check-In with Smart Lock Technology',
            description: 'Easy, contactless access to all properties through keyless entry, ensuring convenience and security.',
          },
          {
            id: '4',
            icon: 'lightning',
            title: 'Transparent Pricing & Instant Booking',
            description: 'Guests can view detailed pricing breakdowns with taxes and cleaning fees included, and instantly reserve.',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  // Helper function to get icon component based on icon string
  function getIconComponent(icon: string) {
    const iconMap: { [key: string]: React.ReactNode } = {
      'home': (
        <span className="bg-[#586DF7] w-10 h-10 text-black rounded-full p-2 inline-flex items-center justify-center">
          <FeatureIcon1 />
        </span>
      ),
      'star': (
        <span className="bg-[#F86E04] w-10 h-10 text-black rounded-full p-2 inline-flex items-center justify-center">
          <FeatureIcon2 />
        </span>
      ),
      'lock': (
        <span className="bg-[#38C6F9] w-10 h-10 text-black rounded-full p-2 inline-flex items-center justify-center">
          <FeatureIcon3 />
        </span>
      ),
      'lightning': (
        <span className="bg-[#A020F0] w-10 h-10 text-black rounded-full p-2 inline-flex items-center justify-center">
          <FeatureIcon4 />
        </span>
      ),
      'default': (
        <span className="bg-[#586DF7] w-10 h-10 text-black rounded-full p-2 inline-flex items-center justify-center">
          <FeatureIcon1 />
        </span>
      ),
    };

    return iconMap[icon] || iconMap['default'];
  }

  const FeatureImage = "/images/feature_section.png";

  if (loading) {
    return (
      <section className="bg-[#fafafd] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="text-[#9B5CFF] font-medium mb-2">Our Feature</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Our Featured Properties</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="md:col-span-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-2 border border-gray-100 animate-pulse">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                </div>
              ))}
            </div>
            <div className="hidden lg:flex md:col-span-1 justify-center items-center relative h-full">
              <div className="w-96 h-96 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#fafafd] py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="text-[#9B5CFF] font-medium mb-2">Our Feature</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Our Featured Properties</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Feature cards */}
          <div className="md:col-span-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-2 border border-gray-100"
              >
                {getIconComponent(feature.icon)}
                <div className="font-semibold text-gray-900 mt-2 mb-1 leading-tight">
                  {feature.title}
                </div>
                <div className="text-gray-500 text-sm leading-snug">
                  {feature.description}
                </div>
              </div>
            ))}
          </div>
          {/* Illustration */}
          <div className="hidden lg:flex md:col-span-1 justify-center items-center relative h-full">
            <div className="">
              {/* Placeholder illustration */}
              <Image src={FeatureImage} alt="Feature" width={500} height={500} className="w-full h-full object-contain" />
              {/* Overlay card */}
              <div className="absolute -bottom-4 right-6 bg-white rounded-xl shadow-md px-6 py-6 flex items-center gap-3 min-w-[300px] border border-gray-100">
                <div>
                    <div className="font-semibold text-gray-900 leading-tight">Find the best deal</div>
                    <div className="text-gray-500 text-xs">Browse thousands of properties</div>
                </div>
                <div className="relative">
                    <div className="absolute bottom-6 -right-16  bg-[#586DF7]  w-10 h-10 text-black rounded-full p-2 inline-flex items-center justify-center">
                        <span className="bg-[#586DF7] w-12 h-12 text-black rounded-full p-3 inline-flex items-center justify-center">
                        <FeatureIcon5 />
                        </span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
