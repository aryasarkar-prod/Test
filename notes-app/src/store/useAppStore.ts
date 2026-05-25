'use client'

import { create } from 'zustand'
import { Note, Folder, Tag, Task, User } from '@/types'
import {
  mockNotes, mockFolders, mockTags, mockTasks, mockUser
} from '@/lib/mockData'
import { generateId, getWordCount, getReadTime, generateExcerpt } from '@/lib/utils'

interface AppState {
  // Auth
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => void
  logout: () => void

  // Notes
  notes: Note[]
  activeNoteId: string | null
  setActiveNote: (id: string | null) => void
  createNote: (folderId?: string) => Note
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  pinNote: (id: string) => void
  starNote: (id: string) => void
  trashNote: (id: string) => void

  // Folders
  folders: Folder[]
  activeFolderId: string | null
  setActiveFolder: (id: string | null) => void
  createFolder: (name: string, color: string, icon: string) => void
  deleteFolder: (id: string) => void

  // Tags
  tags: Tag[]
  activeTagId: string | null
  setActiveTag: (id: string | null) => void

  // Tasks
  tasks: Task[]
  updateTask: (id: string, updates: Partial<Task>) => void
  createTask: (data: Partial<Task>) => void
  deleteTask: (id: string) => void

  // UI State
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  activeView: 'all' | 'starred' | 'pinned' | 'trash' | 'folder' | 'tag' | 'tasks' | 'analytics'
  setActiveView: (view: AppState['activeView']) => void
  editorMode: 'edit' | 'preview' | 'split'
  setEditorMode: (mode: AppState['editorMode']) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  // Auth
  user: mockUser,
  isAuthenticated: true,
  login: (email, password) => {
    set({ user: mockUser, isAuthenticated: true })
  },
  logout: () => set({ user: null, isAuthenticated: false }),

  // Notes
  notes: mockNotes,
  activeNoteId: mockNotes[0].id,
  setActiveNote: (id) => set({ activeNoteId: id }),
  createNote: (folderId) => {
    const newNote: Note = {
      id: generateId(),
      title: 'Untitled Note',
      content: '# Untitled Note\n\nStart writing...',
      excerpt: 'Start writing...',
      folderId,
      tags: [],
      isPinned: false,
      isStarred: false,
      isTrashed: false,
      isArchived: false,
      color: '',
      collaborators: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: 0,
      readTime: 1,
      versions: [],
    }
    set((state) => ({
      notes: [newNote, ...state.notes],
      activeNoteId: newNote.id,
    }))
    return newNote
  },
  updateNote: (id, updates) => {
    set((state) => ({
      notes: state.notes.map((n) => {
        if (n.id !== id) return n
        const content = updates.content ?? n.content
        const wordCount = getWordCount(content)
        return {
          ...n,
          ...updates,
          wordCount,
          readTime: getReadTime(wordCount),
          excerpt: generateExcerpt(content),
          updatedAt: new Date(),
        }
      }),
    }))
  },
  deleteNote: (id) => {
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
      activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
    }))
  },
  pinNote: (id) => {
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, isPinned: !n.isPinned } : n
      ),
    }))
  },
  starNote: (id) => {
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, isStarred: !n.isStarred } : n
      ),
    }))
  },
  trashNote: (id) => {
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, isTrashed: !n.isTrashed } : n
      ),
    }))
  },

  // Folders
  folders: mockFolders,
  activeFolderId: null,
  setActiveFolder: (id) => set({ activeFolderId: id, activeView: 'folder', activeTagId: null }),
  createFolder: (name, color, icon) => {
    const folder: Folder = {
      id: generateId(),
      name,
      color,
      icon,
      noteCount: 0,
      createdAt: new Date(),
    }
    set((state) => ({ folders: [...state.folders, folder] }))
  },
  deleteFolder: (id) => {
    set((state) => ({
      folders: state.folders.filter((f) => f.id !== id),
    }))
  },

  // Tags
  tags: mockTags,
  activeTagId: null,
  setActiveTag: (id) => set({ activeTagId: id, activeView: 'tag', activeFolderId: null }),

  // Tasks
  tasks: mockTasks,
  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
      ),
    }))
  },
  createTask: (data) => {
    const task: Task = {
      id: generateId(),
      title: data.title || 'New Task',
      description: data.description,
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      dueDate: data.dueDate,
      tags: data.tags || [],
      subtasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    set((state) => ({ tasks: [task, ...state.tasks] }))
  },
  deleteTask: (id) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }))
  },

  // UI
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  activeView: 'all',
  setActiveView: (view) => set({ activeView: view }),
  editorMode: 'edit',
  setEditorMode: (mode) => set({ editorMode: mode }),
}))
