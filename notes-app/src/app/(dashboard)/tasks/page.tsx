'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { KanbanBoard } from '@/components/tasks/KanbanBoard'

export default function TasksPage() {
  return (
    <DashboardLayout>
      <KanbanBoard />
    </DashboardLayout>
  )
}
