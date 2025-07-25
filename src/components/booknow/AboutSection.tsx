'use client'
import React, { useState } from 'react';

const AboutSection = () => {
  const [activeTab, setActiveTab] = useState('about');
  
  const tabs = [
    { id: 'about', label: 'ABOUT THIS LISTING' },
    { id: 'details', label: 'DETAILS' },
    { id: 'features', label: 'FEATURES' },
    { id: 'terms', label: 'TERMS & RULES' },
    { id: 'contact', label: 'CONTACT THE HOST' },
  ];

  return (
    <section className="max-w-7xl mx-auto p-4 md:p-8 my-10">
      {/* Tab Navigation */}
      <div className="flex space-x-2 justify-evenly items-center mb-8 relative">
        {tabs.map((tab) => (
          <div key={tab.id} className="relative flex flex-col items-center">
            <button
              className={`px-8 py-4 rounded-full font-semibold text-sm md:text-base transition-colors duration-200 focus:outline-none cursor-pointer
                ${activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}
              `}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
            {activeTab === tab.id && (
              <span className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-600 absolute top-full"></span>
            )}
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300">
        {activeTab === 'about' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-4">About this listing</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">About this space</h3>
            <div className="space-y-4 text-gray-700">
              <p>
                Enjoy a stylish experience at this centrally-located place in Miami's Design District/Wynwood. 
                Each side has 3B/2.5BA (6 bedrooms, 4 baths, 2 half baths) with an amazing heated pool. 
                Ideal for large gatherings. Pick your feel. Located just a short walk away from the Design 
                District Shops, Wynwood and Midtown.
              </p>
              <p>
                Feel Free to Come and Go as you please. We have 2 awesome Grills to throw a BBQ and will 
                provide any assistance to help you have the Miami Vacation of your dreams.
              </p>
              
              <div className=" pt-4 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Smoking Policy</h3>
                <p>
                  Smoking is allowed outside only. Smoking of any substance is not allowed in the apartment. 
                  Guest will be held responsible for all damage caused by smoking including, but not limited to, 
                  stains, burns, odors, and removal of debris. Guest acknowledges that in order to remove odor 
                  caused by smoking, the Host may need to replace blinds, drapes and paint the interior walls 
                  regardless of when these items were last cleaned, replaced, or repainted.
                </p>
              </div>
              
              <div className=" pt-4 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Guest access</h3>
                <p>
                  Upon request: Outside guests are more than welcome to come join you to enjoy the property, 
                  backyard/pool area for small get togethers.
                </p>
                <p className="mt-2">
                  Upon checkout: please leave gate key/opener on the glass table at the entryway. 
                  Failure to do so will result in a $100 replacement fee.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'details' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex">
                    <span className="font-medium w-32">Property Type:</span>
                    <span>Private Room / Apartment</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium w-32">Accommodates:</span>
                    <span>16+ Guests</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium w-32">Bedrooms:</span>
                    <span>6 Bedrooms</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium w-32">Beds:</span>
                    <span>8 Beds</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium w-32">Bathrooms:</span>
                    <span>4 Full, 1 Half Baths</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Amenities</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-5 h-5 mr-2 text-green-500">✓</div>
                    <span>Heated Pool</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 mr-2 text-green-500">✓</div>
                    <span>BBQ Grills (2)</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 mr-2 text-green-500">✓</div>
                    <span>Central Location</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 mr-2 text-green-500">✓</div>
                    <span>Design District Access</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 mr-2 text-green-500">✓</div>
                    <span>Keyless Entry</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'features' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                "Heated Swimming Pool",
                "BBQ Grill Area",
                "Designer Furniture",
                "Smart Home System",
                "High-Speed WiFi",
                "Air Conditioning",
                "Fully Equipped Kitchen",
                "Luxury Bathrooms",
                "Spacious Living Areas",
                "Private Balcony",
                "Secure Parking",
                "Laundry Facilities"
              ].map((feature, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-5 h-5 mr-3 text-blue-600">✓</div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'terms' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms & Rules</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Check-in/Check-out</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Check-in: After 3:00 PM</li>
                  <li>Check-out: Before 11:00 AM</li>
                  <li>Early check-in/late check-out may be available upon request</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Cancellation Policy</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Free cancellation up to 30 days before check-in</li>
                  <li>50% refund if canceled between 15-30 days before check-in</li>
                  <li>No refund if canceled less than 15 days before check-in</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">House Rules</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>No parties or events without prior approval</li>
                  <li>No smoking inside the property</li>
                  <li>Pets allowed with prior approval (additional fee applies)</li>
                  <li>Quiet hours from 10:00 PM to 8:00 AM</li>
                  <li>Maximum occupancy must not exceed the number of booked guests</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'contact' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact the Host</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-6">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                  <h3 className="font-bold text-lg">Michael Johnson</h3>
                  <p className="text-gray-600">Superhost · 4.98 ⭐ (128 reviews)</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                I'm available 24/7 to ensure you have a perfect stay. Feel free to reach out with any questions 
                about the property, neighborhood, or your upcoming visit.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your message here"
                  ></textarea>
                </div>
                
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;