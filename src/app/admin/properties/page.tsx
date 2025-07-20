import React from 'react'
import PropertyPage from "@/components/properties"
import AdminLayout from '@/components/layout/AdminLayout'

export default function page() {
  return (
    <AdminLayout>
      <PropertyPage/>
    </AdminLayout>
  )
}
