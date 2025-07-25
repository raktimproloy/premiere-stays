// components/TrustedPartners.tsx
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';

const TrustedPartners = () => {
  const partners = [
    { id: 1, image: '/images/partner1.png'},
    { id: 2, image: '/images/partner2.png'},
    { id: 3, image: '/images/partner3.png'},
    { id: 4, image: '/images/partner4.png'},
    { id: 5, image: '/images/partner1.png'}
  ];

  return (
    <section className="py-10 sm:py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between mb-8 md:mb-14 gap-4 md:gap-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4 text-center md:text-left">
            Our Trusted Partners
          </h2>
          <p className="text-sm sm:text-md text-gray-600 max-w-md text-center md:text-left mx-auto md:mx-0">
            We proudly partner with leading booking platforms to ensure maximum visibility for our properties. Check out the platforms where you can find us!
          </p>
        </div>

        <div className="relative">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              480: { slidesPerView: 2, spaceBetween: 16 },
              640: { slidesPerView: 3, spaceBetween: 20 },
              900: { slidesPerView: 4, spaceBetween: 24 },
              1200: { slidesPerView: 5, spaceBetween: 30 },
            }}
            pagination={{ clickable: true }}
            loop={true}
            className="mySwiper"
          >
            {partners.map((partner) => (
              <SwiperSlide key={partner.id}>
                <div className="flex items-center justify-center h-24 sm:h-32 md:h-40 lg:h-48">
                  <Image 
                    src={partner.image} 
                    alt="partner" 
                    width={160} 
                    height={160} 
                    className="w-24 h-16 sm:w-32 sm:h-24 md:w-40 md:h-32 lg:w-48 lg:h-40 object-contain"
                    sizes="(max-width: 640px) 96px, (max-width: 900px) 128px, (max-width: 1200px) 160px, 192px"
                    priority
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default TrustedPartners;