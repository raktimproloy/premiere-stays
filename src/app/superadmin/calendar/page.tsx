import SuperAdminLayout from '@/components/layout/SuperAdminLayout'
import Calendar from '@/components/superadmin/calendar'
import React from 'react'

export default function page() {
  return (
    <SuperAdminLayout>
        <Calendar />
    </SuperAdminLayout>
  )
}
