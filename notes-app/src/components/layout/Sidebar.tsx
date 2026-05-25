'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Star, Pin, Trash2, BarChart2, CheckSquare,
  Plus, ChevronRight, ChevronDown, Hash, FolderOpen,
  Search, Settings, LogOut, Command, Zap, Bell, Archive,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { Avatar } from '@/components/ui/Avatar'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const {
    user, notes, folders, tags, activeView, setActiveView,
    activeFolderId, setActiveFolder, activeTagId, setActiveTag,
    sidebarOpen, setSidebarOpen, setCommandPaletteOpen,
    createNote, createFolder, logout
  } = useAppStore()

  const [foldersExpanded, setFoldersExpanded] = useState(true)
  const [tagsExpanded, setTagsExpanded] = useState(true)
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  const starredCount = notes.filter((n) => n.isStarred && !n.isTrashed).length
  const pinnedCount = notes.filter((n) => n.isPinned && !n.isTrashed).length
  const trashCount = notes.filter((n) => n.isTrashed).length

  const navItems = [
    {
      id: 'all', label: 'All Notes', icon: FileText, count: notes.filter((n) => !n.isTrashed).length,
      action: () => { setActiveView('all'); router.push('/notes') }
    },
    {
      id: 'starred', label: 'Starred', icon: Star, count: starredCount,
      action: () => { setActiveView('starred'); router.push('/notes') }
    },
    {
      id: 'pinned', label: 'Pinned', icon: Pin, count: pinnedCount,
      action: () => { setActiveView('pinned'); router.push('/notes') }
    },
    {
      id: 'archive', label: 'Archive', icon: Archive, count: 0,
      action: () => { setActiveView('all'); router.push('/notes') }
    },
  ]

  const handleNewFolder = (e: React.FormEvent) => {
    e.preventDefault()
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim(), '#6366f1', '📁')
      setNewFolderName('')
      setShowNewFolder(false)
    }
  }

  const handleNewNote = () => {
    createNote()
    setActiveView('all')
    router.push('/notes')
  }

  if (!sidebarOpen) {
    return (
      <motion.div
        initial={{ width: 240 }}
        animate={{ width: 56 }}
        className="h-full flex flex-col items-center py-4 gap-2 border-r border-[var(--border)] bg-[var(--sidebar-bg)]"
      >
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-9 h-9 rounded-xl hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
        >
          <PanelLeftOpen size={18} />
        </button>
        <div className="w-8 h-px bg-[var(--border)] my-1" />
        {navItems.map(({ id, icon: Icon, action }) => (
          <button
            key={id}
            onClick={action}
            className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center transition-all',
              activeView === id
                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
            )}
          >
            <Icon size={16} />
          </button>
        ))}
      </motion.div>
    )
  }

  return (
    <motion.aside
      initial={{ width: 0 }}
      animate={{ width: 260 }}
      className="h-full flex flex-col bg-[var(--sidebar-bg)] border-r border-[var(--border)] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-brand flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fillOpacity="0.9"/>
            </svg>
          </div>
          <span className="font-bold text-sm gradient-text">Noteflow</span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="w-7 h-7 rounded-lg hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] transition-all"
        >
          <PanelLeftClose size={15} />
        </button>
      </div>

      {/* Search + New Note */}
      <div className="px-3 pb-3 space-y-1.5 flex-shrink-0">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center gap-2.5 h-9 px-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-[var(--text-muted)] hover:border-indigo-400/50 transition-all group"
        >
          <Search size={14} />
          <span className="flex-1 text-left text-xs">Search...</span>
          <div className="flex items-center gap-0.5 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
            <Command size={10} />
            <span>K</span>
          </div>
        </button>
        <button
          onClick={handleNewNote}
          className="w-full flex items-center gap-2 h-9 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all shadow-brand"
        >
          <Plus size={15} />
          New Note
        </button>
      </div>

      {/* Scrollable nav */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
        {/* Main nav */}
        <div className="space-y-0.5 mb-3">
          {navItems.map(({ id, label, icon: Icon, count, action }) => (
            <button
              key={id}
              onClick={action}
              className={cn('nav-item w-full', activeView === id && pathname === '/notes' && 'active')}
            >
              <Icon size={16} />
              <span className="flex-1 text-left">{label}</span>
              {count > 0 && (
                <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded-full">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Pages nav */}
        <div className="space-y-0.5 mb-3 pt-2 border-t border-[var(--border)]">
          <button
            onClick={() => router.push('/tasks')}
            className={cn('nav-item w-full', pathname === '/tasks' && 'active')}
          >
            <CheckSquare size={16} />
            <span className="flex-1 text-left">Tasks</span>
            <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded-full">
              {useAppStore.getState().tasks.filter(t => t.status !== 'done').length}
            </span>
          </button>
          <button
            onClick={() => router.push('/analytics')}
            className={cn('nav-item w-full', pathname === '/analytics' && 'active')}
          >
            <BarChart2 size={16} />
            <span className="flex-1 text-left">Analytics</span>
          </button>
          <button className="nav-item w-full">
            <Bell size={16} />
            <span className="flex-1 text-left">Reminders</span>
            <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">2</span>
          </button>
          <button
            onClick={() => { setActiveView('trash'); router.push('/notes') }}
            className={cn('nav-item w-full', activeView === 'trash' && 'active')}
          >
            <Trash2 size={16} />
            <span className="flex-1 text-left">Trash</span>
            {trashCount > 0 && (
              <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded-full">
                {trashCount}
              </span>
            )}
          </button>
        </div>

        {/* Folders */}
        <div className="pt-2 border-t border-[var(--border)]">
          <div className="flex items-center justify-between px-3 py-1.5 mb-1">
            <button
              onClick={() => setFoldersExpanded(!foldersExpanded)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hover:text-[var(--text-secondary)] transition-colors"
            >
              {foldersExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              Folders
            </button>
            <button
              onClick={() => setShowNewFolder(true)}
              className="w-5 h-5 rounded hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
            >
              <Plus size={12} />
            </button>
          </div>

          <AnimatePresence>
            {foldersExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-0.5"
              >
                {showNewFolder && (
                  <form onSubmit={handleNewFolder} className="px-1 mb-1">
                    <input
                      autoFocus
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onBlur={() => { setShowNewFolder(false); setNewFolderName('') }}
                      placeholder="Folder name..."
                      className="w-full h-8 px-3 rounded-xl bg-[var(--bg-card)] border border-indigo-500/50 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
                    />
                  </form>
                )}
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setActiveFolder(folder.id)}
                    className={cn(
                      'nav-item w-full',
                      activeFolderId === folder.id && 'active'
                    )}
                  >
                    <span className="text-base leading-none">{folder.icon}</span>
                    <span className="flex-1 text-left truncate">{folder.name}</span>
                    <span className="text-xs text-[var(--text-muted)]">{folder.noteCount}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tags */}
        <div className="pt-2 border-t border-[var(--border)] mt-2">
          <button
            onClick={() => setTagsExpanded(!tagsExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 mb-1 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hover:text-[var(--text-secondary)] transition-colors w-full"
          >
            {tagsExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            Tags
          </button>
          <AnimatePresence>
            {tagsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-1.5 px-2 pb-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => setActiveTag(tag.id)}
                      className={cn(
                        'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all',
                        activeTagId === tag.id
                          ? 'text-white shadow-sm scale-105'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:scale-105'
                      )}
                      style={
                        activeTagId === tag.id
                          ? { backgroundColor: tag.color }
                          : undefined
                      }
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-3 pb-3 pt-2 border-t border-[var(--border)] space-y-1">
        <ThemeToggle compact />
        <button className="nav-item w-full">
          <Settings size={16} />
          <span>Settings</span>
        </button>
        <button
          onClick={() => { logout(); router.push('/login') }}
          className="nav-item w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>

        {/* User */}
        <div className="flex items-center gap-2.5 mt-2 p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
          <Avatar src={user?.avatar} name={user?.name || 'User'} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{user?.name}</p>
            <p className="text-xs text-[var(--text-muted)] truncate">{user?.plan} plan</p>
          </div>
          <span className="text-xs bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-1.5 py-0.5 rounded-full font-medium">
            PRO
          </span>
        </div>
      </div>
    </motion.aside>
  )
}
