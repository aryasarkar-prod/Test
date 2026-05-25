'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard'

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <AnalyticsDashboard />
    </DashboardLayout>
  )
}
