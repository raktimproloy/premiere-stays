import DefaultLayout from '@/components/layout/DefaultLayout'
import Image from 'next/image';
import React from 'react'
import { DoubleTickIcon } from '../../../public/images/svg';
const features = [
  "Exceptional Stays, Every Time.",
  "Hands-Off Property Management",
  "Maximized Visibility",
  "Luxury+Level Guest Experience",
  "Performance-Driven Approach"
];

export default function page() {
  const AboutVideo = "/images/about_page.mp4"
  const AboutImage1 = "/images/about_page1.jpg"
  const AboutImage2 = "/images/about_page2.jpg"
  const AboutImage3 = "/images/about_page3.jpg"
  return (
    <DefaultLayout>
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Content */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative rounded-2xl w-full h-[400px] overflow-hidden shadow-xl aspect-[4/5]">
              <video src={AboutVideo} autoPlay muted loop className="w-full h-full object-cover" />
            </div>
            <div className="flex mt-4 justify-center items-center -space-x-5">
              <Image src={AboutImage1} alt="About" width={500} height={500} className="rounded-2xl w-[170px] h-[200px] object-cover shadow-lg rotate-[5deg] z-10" />
              <Image src={AboutImage3} alt="About" width={500} height={500} className="rounded-2xl w-[170px] h-[200px] object-cover shadow-lg z-20" />
              <Image src={AboutImage2} alt="About" width={500} height={500} className="rounded-2xl w-[170px] h-[200px] object-cover shadow-lg rotate-[-5deg] z-30" />
            </div>
          </div>
          <div>
            <div className="mb-8">
              <span className="inline-block text-[#A020F0] font-bold tracking-wider mb-3">
                ABOUT US
              </span>
              <h1 className="text-2xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                We offer Unique Places
                <br />
                Suitable for your Comfort
              </h1>
            </div>
            
            <div className="space-y-6 mb-10">
              <p className="text-lg text-gray-600 leading-relaxed">
                At Premierestays Miami, our mission is to deliver exceptional property management services that exceed guest expectations through Careful attention to detail and unwavering commitment to quality. We strive to maintain the highest standards in the industry, ensuring every property we manage is not only maintained but elevated, creating seamless and memorable guest experiences that reflect our dedication to excellence.
              </p>
            </div>
            
            {/* Features List */}
            <div className="">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Exceptional Stays, Every Time.</h2>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <DoubleTickIcon />
                    <span className="text-gray-800 font-medium text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Right Column - Image */}

        </div>
      </div>
    </section>
    </DefaultLayout>
  )
}
