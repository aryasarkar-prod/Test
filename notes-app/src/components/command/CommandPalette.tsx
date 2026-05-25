'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Search, FileText, Plus, Star, Pin, Trash2, BarChart2,
  CheckSquare, Settings, LogOut, Moon, Sun, Folder,
  Hash, Zap, ArrowRight, Command
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

interface CommandItem {
  id: string
  label: string
  subtitle?: string
  icon: React.ReactNode
  shortcut?: string
  action: () => void
  category: string
}

export function CommandPalette() {
  const router = useRouter()
  const {
    commandPaletteOpen, setCommandPaletteOpen,
    notes, createNote, setActiveView, setActiveNote, logout
  } = useAppStore()

  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const allCommands: CommandItem[] = [
    {
      id: 'new-note', label: 'New Note', subtitle: 'Create a blank note',
      icon: <Plus size={16} />, shortcut: '⌘N', category: 'Actions',
      action: () => { createNote(); setActiveView('all'); router.push('/notes') }
    },
    {
      id: 'all-notes', label: 'All Notes',
      icon: <FileText size={16} />, shortcut: '⌘1', category: 'Navigate',
      action: () => { setActiveView('all'); router.push('/notes') }
    },
    {
      id: 'starred', label: 'Starred Notes',
      icon: <Star size={16} />, shortcut: '⌘2', category: 'Navigate',
      action: () => { setActiveView('starred'); router.push('/notes') }
    },
    {
      id: 'pinned', label: 'Pinned Notes',
      icon: <Pin size={16} />, category: 'Navigate',
      action: () => { setActiveView('pinned'); router.push('/notes') }
    },
    {
      id: 'tasks', label: 'Tasks / Kanban',
      icon: <CheckSquare size={16} />, shortcut: '⌘3', category: 'Navigate',
      action: () => { router.push('/tasks') }
    },
    {
      id: 'analytics', label: 'Analytics Dashboard',
      icon: <BarChart2 size={16} />, shortcut: '⌘4', category: 'Navigate',
      action: () => { router.push('/analytics') }
    },
    {
      id: 'trash', label: 'Trash',
      icon: <Trash2 size={16} />, category: 'Navigate',
      action: () => { setActiveView('trash'); router.push('/notes') }
    },
    {
      id: 'ai-search', label: 'AI Search',
      subtitle: 'Search with natural language',
      icon: <Zap size={16} />, shortcut: '⌘K', category: 'AI',
      action: () => {}
    },
    {
      id: 'logout', label: 'Sign Out',
      icon: <LogOut size={16} />, category: 'Account',
      action: () => { logout(); router.push('/login') }
    },
    ...notes.slice(0, 5).map((note) => ({
      id: `note-${note.id}`,
      label: note.title,
      subtitle: note.excerpt,
      icon: <FileText size={16} />,
      category: 'Recent Notes',
      action: () => { setActiveNote(note.id); router.push('/notes') }
    })),
  ]

  const filtered = query
    ? allCommands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : allCommands

  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {} as Record<string, CommandItem[]>)

  const flatFiltered = Object.values(grouped).flat()

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setSelectedIdx(0)
    }
  }, [commandPaletteOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
      }
      if (!commandPaletteOpen) return
      if (e.key === 'Escape') setCommandPaletteOpen(false)
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIdx((i) => Math.min(i + 1, flatFiltered.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIdx((i) => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        flatFiltered[selectedIdx]?.action()
        setCommandPaletteOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [commandPaletteOpen, flatFiltered, selectedIdx, setCommandPaletteOpen])

  useEffect(() => { setSelectedIdx(0) }, [query])

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setCommandPaletteOpen(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full max-w-[560px] mx-4"
          >
            <div className="glass-strong rounded-2xl shadow-2xl border border-[var(--glass-border)] overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)]">
                <Search size={18} className="text-[var(--text-muted)] flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search notes, commands, actions..."
                  className="flex-1 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm outline-none"
                />
                <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-1 rounded-lg">
                  <Command size={11} />
                  <span>K</span>
                </div>
              </div>

              {/* Results */}
              <div className="max-h-[360px] overflow-y-auto p-2">
                {flatFiltered.length === 0 ? (
                  <div className="text-center py-10 text-[var(--text-muted)] text-sm">
                    No results for "{query}"
                  </div>
                ) : (
                  Object.entries(grouped).map(([category, items]) => (
                    <div key={category} className="mb-2">
                      <div className="px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                        {category}
                      </div>
                      {items.map((item) => {
                        const globalIdx = flatFiltered.indexOf(item)
                        return (
                          <button
                            key={item.id}
                            onClick={() => { item.action(); setCommandPaletteOpen(false) }}
                            onMouseEnter={() => setSelectedIdx(globalIdx)}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-100',
                              selectedIdx === globalIdx
                                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                            )}
                          >
                            <span className="flex-shrink-0 opacity-70">{item.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{item.label}</div>
                              {item.subtitle && (
                                <div className="text-xs text-[var(--text-muted)] truncate mt-0.5">{item.subtitle}</div>
                              )}
                            </div>
                            {item.shortcut && (
                              <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded font-mono flex-shrink-0">
                                {item.shortcut}
                              </span>
                            )}
                            {selectedIdx === globalIdx && (
                              <ArrowRight size={14} className="flex-shrink-0 opacity-50" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-[var(--border)] flex items-center gap-4 text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1"><kbd className="font-mono">↑↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="font-mono">↵</kbd> select</span>
                <span className="flex items-center gap-1"><kbd className="font-mono">esc</kbd> close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
