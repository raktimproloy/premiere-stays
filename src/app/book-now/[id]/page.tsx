
import Breadcrumb from '@/components/common/Breadcrumb'
import DefaultLayout from '@/components/layout/DefaultLayout'
import MainSection from '@/components/booknow/MainSection'
import AboutSection from '@/components/booknow/AboutSection'
import React from 'react'
import AvailabilitySection from '@/components/booknow/AvailabilitySection'
import MapSection from '@/components/booknow/MapSection'
import ReviewsSection from '@/components/booknow/ReviewsSection'
import Properties from '@/components/booknow/Properties'

export default function page() {


  return (
    <DefaultLayout>
      <Breadcrumb bgImage={"/images/booknow_breadcrumb.jpg"} path={["Home", "Property Details"]} title="Property Details" description="" />
      <MainSection />
      <AboutSection />
      <AvailabilitySection/>
      <MapSection/>
      <ReviewsSection/>
      <Properties/>
    </DefaultLayout>
  );
}
