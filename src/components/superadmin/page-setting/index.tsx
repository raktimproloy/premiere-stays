'use client'
import React, { useState } from 'react';
import { Plus, Star, Edit2, Trash2 } from 'lucide-react';
import Service from './Service';
import About from './About';
import Testimonial from './Testimonial';




const PageSetting: React.FC = () => {
  const [activeTab, setActiveTab] = useState('about');








  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-xl font-medium text-gray-800">Page Settings</h1>
          <Edit2 className="w-5 h-5 text-gray-400" />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'about', label: 'About' },
                { id: 'services', label: 'Services' },
                { id: 'testimonials', label: 'Testimonials' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* About Tab */}
          {activeTab === 'about' && (
            <About />
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <Service/>
          )}

          {/* Testimonials Tab */}
          {activeTab === 'testimonials' && (
            <Testimonial/>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageSetting;
