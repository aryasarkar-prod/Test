export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: 'free' | 'pro' | 'team'
  createdAt: Date
}

export interface Note {
  id: string
  title: string
  content: string
  excerpt: string
  folderId?: string
  tags: Tag[]
  isPinned: boolean
  isStarred: boolean
  isTrashed: boolean
  isArchived: boolean
  color?: string
  coverImage?: string
  collaborators: Collaborator[]
  reminder?: Date
  createdAt: Date
  updatedAt: Date
  wordCount: number
  readTime: number
  versions: NoteVersion[]
}

export interface Folder {
  id: string
  name: string
  color: string
  icon: string
  parentId?: string
  noteCount: number
  createdAt: Date
}

export interface Tag {
  id: string
  name: string
  color: string
  noteCount: number
}

export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: Date
  tags: string[]
  noteId?: string
  assignee?: string
  subtasks: SubTask[]
  createdAt: Date
  updatedAt: Date
}

export interface SubTask {
  id: string
  title: string
  completed: boolean
}

export interface Collaborator {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'viewer' | 'editor' | 'admin'
}

export interface NoteVersion {
  id: string
  content: string
  title: string
  createdAt: Date
  author: string
}

export interface Analytics {
  totalNotes: number
  totalWords: number
  notesThisWeek: number
  streakDays: number
  mostActiveDay: string
  topTags: { name: string; count: number }[]
  activityData: { date: string; count: number }[]
  writingGoal: { current: number; target: number }
}

export type Theme = 'light' | 'dark' | 'system'

export interface CommandItem {
  id: string
  title: string
  subtitle?: string
  icon: string
  action: () => void
  shortcut?: string
  category: 'notes' | 'navigation' | 'actions' | 'settings'
}
