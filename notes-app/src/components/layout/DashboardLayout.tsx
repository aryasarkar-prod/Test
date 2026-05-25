'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { CommandPalette } from '@/components/command/CommandPalette'
import { useAppStore } from '@/store/useAppStore'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setCommandPaletteOpen } = useAppStore()

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setCommandPaletteOpen])

  return (
    <div className="h-screen flex overflow-hidden bg-[var(--bg-primary)]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <motion.main
        layout
        className="flex-1 min-w-0 overflow-hidden flex flex-col"
      >
        {children}
      </motion.main>

      {/* Command Palette */}
      <CommandPalette />
    </div>
  )
}
