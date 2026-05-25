'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'

export function useKeyboardShortcuts() {
  const router = useRouter()
  const {
    setCommandPaletteOpen,
    createNote,
    setActiveView,
    setEditorMode,
  } = useAppStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey

      // Command palette
      if (mod && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
        return
      }

      // New note
      if (mod && e.key === 'n') {
        e.preventDefault()
        createNote()
        router.push('/notes')
        return
      }

      // Navigate to notes
      if (mod && e.key === '1') {
        e.preventDefault()
        setActiveView('all')
        router.push('/notes')
        return
      }

      // Navigate to tasks
      if (mod && e.key === '3') {
        e.preventDefault()
        router.push('/tasks')
        return
      }

      // Navigate to analytics
      if (mod && e.key === '4') {
        e.preventDefault()
        router.push('/analytics')
        return
      }

      // Editor modes
      if (mod && e.key === 'e') {
        e.preventDefault()
        setEditorMode('edit')
        return
      }
      if (mod && e.shiftKey && e.key === 'P') {
        e.preventDefault()
        setEditorMode('preview')
        return
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [router, setCommandPaletteOpen, createNote, setActiveView, setEditorMode])
}
