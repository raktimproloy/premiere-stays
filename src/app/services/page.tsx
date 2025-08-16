import DefaultLayout from '@/components/layout/DefaultLayout'
import Breadcrumb from '@/components/common/Breadcrumb'
import React from 'react'
import CardOne from '@/components/common/card/CardOne';
import WorkRating from '@/components/common/WorkRating';



export default function page() {
  const serviceImage1 = '/images/service1.png';
  const serviceImage2 = '/images/service2.png';
  const serviceImage3 = '/images/service3.png';
  const services = [
    {
      id: 1,
      number: '18',
      title: 'Housekeeping & Turnover Coordination',
      image: serviceImage3,
      imageBg: "#A020F0",
      description: 'We prioritize cleanliness and guest satisfaction with our meticulous housekeeping. Each turnover is managed with a detailed checklist to ensure a hotel-standard experience.',
      stat: '99%',
      statLabel: 'Customer Satisfaction'
    },
    {
      id: 2,
      number: '99%',
      title: 'Legal & Compliance Assistance',
      image: serviceImage2,
      imageBg: "#F86E04",
      description: 'Navigating local laws and regulations in the short-term rental market can be complex, especially in places like Miami. We stay up-to-date on all relevant legal requirements.',
      stat: '06Y',
      statLabel: 'Years Experience'
    },
    {
      id: 3,
      number: '06Y',
      title: 'Guest Communication & Booking Management',
      image: serviceImage1,
      imageBg: "#38C6F9",
      description: 'Our team is available to handle all aspects of guest communication, from initial inquiries to post-checkout feedback. We ensure timely, professional responses to all',
      stat: '35+',
      statLabel: 'Amazing team members'
    },
    {
      id: 4,
      number: '99%',
      title: 'Legal & Compliance Assistance',
      image: serviceImage2,
      imageBg: "#F86E04",
      description: 'Navigating local laws and regulations in the short-term rental market can be complex, especially in places like Miami. We stay up-to-date on all relevant legal requirements.',
      stat: '06Y',
      statLabel: 'Years Experience'
    },
    {
      id: 5,
      number: '06Y',
      title: 'Guest Communication & Booking Management',
      image: serviceImage1,
      imageBg: "#38C6F9",
      description: 'Our team is available to handle all aspects of guest communication, from initial inquiries to post-checkout feedback. We ensure timely, professional responses to all',
      stat: '35+',
      statLabel: 'Amazing team members'
    }
  ];
  console.log(services)
  return (
    <DefaultLayout>
        <Breadcrumb bgImage={"/images/service_breadcrumb.jpg"} path={["Home", "Services"]} title="Find Your Perfect Stay - Book with Confidence" description="Explore a wide range of rental properties tailored to your needs. Whether it’s short-term or long-term, we make booking easy, secure, and hassle-free." />
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 text-sm font-semibold text-indigo-600 mb-4">
                Services
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                We Provide Services for You.
              </h2>
              <p className="max-w-3xl mx-auto text-xl text-gray-600">
                Explore our comprehensive services, meticulously crafted to enhance property value and streamline management.
              </p>
            </div>

            {/* First row: 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.slice(0, 3).map((service, index) => (
                <CardOne 
                  key={index}
                  service={service}
                />
              ))}
            </div>
            {/* Second row: 2 cards centered using flexbox and width constraint */}
            <div className="flex flex-col md:flex-row justify-center gap-8 mt-6 md:w-2/3 mx-auto">
              {services.slice(3).map((service, index) => (
                <CardOne 
                  key={index + 3}
                  service={service}
                />
              ))}
            </div>
          </div>
        </section>
        <WorkRating />
    </DefaultLayout>
  )
}
