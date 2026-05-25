'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { NotesList } from '@/components/notes/NotesList'
import { NoteEditor } from '@/components/editor/NoteEditor'

export default function NotesPage() {
  return (
    <DashboardLayout>
      <div className="flex h-full">
        <NotesList />
        <div className="flex-1 flex overflow-hidden">
          <NoteEditor />
        </div>
      </div>
    </DashboardLayout>
  )
}
