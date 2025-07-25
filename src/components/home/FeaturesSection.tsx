import React from "react";
import { FeatureIcon1, FeatureIcon2, FeatureIcon3, FeatureIcon4, FeatureIcon5 } from "../../../public/images/svg";
import Image from "next/image";

const features = [
  {
    icon: (
      <span className="bg-[#586DF7] w-10 h-10 text-black rounded-full p-2 inline-flex items-center justify-center">
        {/* Home icon */}
        <FeatureIcon1 />
      </span>
    ),
    title: "Direct Booking with No Service Fees",
    desc: "Encourages guests to book directly through the website and avoid third-party platform fees",
  },
  {
    icon: (
      <span className="bg-[#F86E04]  w-10 h-10 text-black rounded-full p-2 inline-flex items-center justify-center">
        {/* Star icon */}
        <FeatureIcon2 />
      </span>
    ),
    title: "Luxury, Fully-Furnished Vacation Rentals",
    desc: "Encourages guests to book directly through the website and avoid third-party platform fees",
  },
  {
    icon: (
      <span className="bg-[#38C6F9] w-10 h-10 text-black rounded-full p-2 inline-flex items-center justify-center">
        {/* Lock icon */}
        <FeatureIcon3 />
      </span>
    ),
    title: "Self Check-In with Smart Lock Technology",
    desc: "Easy, contactless access to all properties through keyless entry, ensuring convenience and security.",
  },
  {
    icon: (
      <span className="bg-[#A020F0] w-10 h-10 text-black rounded-full p-2 inline-flex items-center justify-center">
        {/* Lightning bolt icon */}
        <FeatureIcon4 />
      </span>
    ),
    title: "Transparent Pricing & Instant Booking",
    desc: "Guests can view detailed pricing breakdowns with taxes and cleaning fees included, and instantly reserve.",
  },
];

export default function FeaturesSection() {
    const FeatureImage = "/images/feature_section.png"
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
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-2 border border-gray-100"
              >
                {f.icon}
                <div className="font-semibold text-gray-900 mt-2 mb-1 leading-tight">
                  {f.title}
                </div>
                <div className="text-gray-500 text-sm leading-snug">
                  {f.desc}
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
