
import Breadcrumb from '@/components/common/Breadcrumb'
import DefaultLayout from '@/components/layout/DefaultLayout'
import MainSection from '@/components/booknow/MainSection'
import AboutSection from '@/components/booknow/AboutSection'
import React from 'react'
import AvailabilitySection from '@/components/booknow/AvailabilitySection'
import MapSection from '@/components/booknow/MapSection'
import ReviewsSection from '@/components/booknow/ReviewsSection'
import Properties from '@/components/booknow/Properties'

export default function Page({ params, searchParams }: { params: { id: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
  const { id } = params;
  const searchId = searchParams?.id as string | undefined;
  
  return (
    <DefaultLayout>
      <MainSection id={id} searchId={searchId} />
      <AboutSection />
      <AvailabilitySection/>
      <MapSection/>
      <ReviewsSection/>
      <Properties/>
    </DefaultLayout>
  );
}
