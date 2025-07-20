import React from 'react'
import CreateProperty from '@/components/properties/create'
import AdminLayout from '@/components/layout/AdminLayout'

export default function page() {
  return (
    <AdminLayout>
        <CreateProperty />
    </AdminLayout>
  )
}
