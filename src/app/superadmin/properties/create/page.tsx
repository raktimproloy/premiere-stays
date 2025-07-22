import React from 'react'
import CreateProperty from '@/components/superadmin/properties/create'
import SuperAdminLayout from '@/components/layout/SuperAdminLayout'

export default function page() {
  return (
    <SuperAdminLayout>
        <CreateProperty />
    </SuperAdminLayout>
  )
}
