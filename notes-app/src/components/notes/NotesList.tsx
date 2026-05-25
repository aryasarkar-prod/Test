'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, SlidersHorizontal, Grid3x3, List, ArrowUpDown } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { NoteCard } from './NoteCard'
import { cn } from '@/lib/utils'

type SortBy = 'updatedAt' | 'createdAt' | 'title' | 'wordCount'
type Layout = 'list' | 'grid'

export function NotesList() {
  const {
    notes, activeView, activeFolderId, activeTagId,
    activeNoteId, setActiveNote, createNote, searchQuery, setSearchQuery
  } = useAppStore()

  const [sortBy, setSortBy] = useState<SortBy>('updatedAt')
  const [layout, setLayout] = useState<Layout>('list')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let result = notes

    // View filter
    if (activeView === 'starred') result = result.filter((n) => n.isStarred)
    else if (activeView === 'pinned') result = result.filter((n) => n.isPinned)
    else if (activeView === 'trash') result = result.filter((n) => n.isTrashed)
    else if (activeView === 'folder' && activeFolderId)
      result = result.filter((n) => n.folderId === activeFolderId)
    else if (activeView === 'tag' && activeTagId)
      result = result.filter((n) => n.tags.some((t) => t.id === activeTagId))
    else result = result.filter((n) => !n.isTrashed)

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.name.toLowerCase().includes(q))
      )
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'wordCount') return b.wordCount - a.wordCount
      if (sortBy === 'createdAt')
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })

    // Pinned notes always on top
    const pinned = result.filter((n) => n.isPinned)
    const rest = result.filter((n) => !n.isPinned)
    return [...pinned, ...rest]
  }, [notes, activeView, activeFolderId, activeTagId, searchQuery, sortBy])

  const viewTitle = {
    all: 'All Notes',
    starred: 'Starred',
    pinned: 'Pinned',
    trash: 'Trash',
    folder: 'Folder',
    tag: 'Tagged',
    tasks: 'Tasks',
    analytics: 'Analytics',
  }[activeView] || 'Notes'

  return (
    <div className="w-[300px] min-w-[300px] flex flex-col border-r border-[var(--border)] bg-[var(--bg-primary)]">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base text-[var(--text-primary)]">{viewTitle}</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLayout(layout === 'list' ? 'grid' : 'list')}
              className="w-7 h-7 rounded-lg hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] transition-all"
              title="Toggle layout"
            >
              {layout === 'list' ? <Grid3x3 size={14} /> : <List size={14} />}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center transition-all',
                showFilters
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500'
                  : 'hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]'
              )}
            >
              <SlidersHorizontal size={14} />
            </button>
            <button
              onClick={() => createNote()}
              className="w-7 h-7 rounded-lg bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition-all"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-2">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full h-8 pl-8 pr-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
        </div>

        {/* Sort options */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex gap-1 pb-2 flex-wrap">
                {(['updatedAt', 'createdAt', 'title', 'wordCount'] as SortBy[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSortBy(s)}
                    className={cn(
                      'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all',
                      sortBy === s
                        ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                    )}
                  >
                    <ArrowUpDown size={10} />
                    {{ updatedAt: 'Modified', createdAt: 'Created', title: 'Title', wordCount: 'Length' }[s]}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-xs text-[var(--text-muted)]">{filtered.length} notes</p>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center mb-3">
              <Search size={20} className="text-[var(--text-muted)]" />
            </div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">No notes found</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {searchQuery ? 'Try a different search' : 'Create your first note'}
            </p>
          </div>
        ) : (
          <div className={cn('space-y-2', layout === 'grid' && 'grid grid-cols-1 gap-2 space-y-0')}>
            <AnimatePresence mode="popLayout">
              {filtered.map((note, i) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isActive={activeNoteId === note.id}
                  onClick={() => setActiveNote(note.id)}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
