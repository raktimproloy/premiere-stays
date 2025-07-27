'use client';

import MainPage from '@/components/booknow/MainPage';
import Breadcrumb from '@/components/common/Breadcrumb'
import DefaultLayout from '@/components/layout/DefaultLayout'
import React from 'react'
import { useSearchParams } from 'next/navigation';

export default function page() {
  const searchParams = useSearchParams();
  const searchId = searchParams.get('id');

  return (
    <DefaultLayout>
      <Breadcrumb bgImage={"/images/booknow_breadcrumb.jpg"} path={["Home", "Listing Page"]} title="Book now from Luxury Miami Listings" description="Immerse yourself in sophistication with our finest upscale properties—reserve now for an unforgettable experience." />
      <MainPage searchId={searchId} />
    </DefaultLayout>
  );
}
