import MainSection from '@/components/checkout/MainSection'
import DefaultLayout from '@/components/layout/DefaultLayout'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import React from 'react'

export default function Page() {
  return (
    <ProtectedRoute>
      <DefaultLayout>
        <MainSection />
      </DefaultLayout>
    </ProtectedRoute>
  )
}
