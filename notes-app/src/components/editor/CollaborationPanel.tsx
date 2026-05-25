'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, X, Mail, Link2, Check, Crown, Eye, Edit3, Copy } from 'lucide-react'
import { Note } from '@/types'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

interface CollabPanelProps {
  note: Note
  onClose: () => void
}

const mockCollaborators = [
  { id: '1', name: 'Sarah Lin', email: 'sarah@figma.com', role: 'editor' as const, avatar: '', online: true },
  { id: '2', name: 'Marcus Chen', email: 'marcus@stripe.com', role: 'viewer' as const, avatar: '', online: false },
]

export function CollaborationPanel({ note, onClose }: CollabPanelProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'viewer' | 'editor'>('editor')
  const [copied, setCopied] = useState(false)
  const [invited, setInvited] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://noteflow.app/share/${note.id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setInvited(true)
    setEmail('')
    setTimeout(() => setInvited(false), 2000)
  }

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-72 border-l border-[var(--border)] bg-[var(--bg-primary)] flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-indigo-500" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">Collaboration</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] transition-all">
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Share link */}
        <div>
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Share Link</p>
          <div className="flex gap-2">
            <div className="flex-1 h-9 px-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center">
              <span className="text-xs text-[var(--text-muted)] truncate">noteflow.app/share/{note.id.slice(0, 8)}</span>
            </div>
            <button
              onClick={handleCopyLink}
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0',
                copied ? 'bg-green-500 text-white' : 'bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              )}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* Invite */}
        <div>
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Invite People</p>
          <form onSubmit={handleInvite} className="space-y-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter email address..."
              className="w-full h-9 px-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
            />
            <div className="flex gap-2">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'viewer' | 'editor')}
                className="flex-1 h-9 px-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs text-[var(--text-secondary)] focus:outline-none"
              >
                <option value="editor">Can edit</option>
                <option value="viewer">Can view</option>
              </select>
              <button
                type="submit"
                className={cn(
                  'px-3 h-9 rounded-xl text-xs font-medium transition-all',
                  invited
                    ? 'bg-green-500 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                )}
              >
                {invited ? <Check size={14} /> : 'Invite'}
              </button>
            </div>
          </form>
        </div>

        {/* Active collaborators */}
        <div>
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            People with access
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--bg-secondary)]">
              <Avatar name="Alex Johnson" size="sm" />
              <div className="flex-1">
                <p className="text-xs font-medium text-[var(--text-primary)]">You (Alex Johnson)</p>
                <p className="text-[10px] text-[var(--text-muted)]">alex@example.com</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full">
                <Crown size={10} />
                Owner
              </div>
            </div>

            {mockCollaborators.map((collab) => (
              <div key={collab.id} className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors">
                <div className="relative">
                  <Avatar name={collab.name} size="sm" />
                  <div className={cn(
                    'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--bg-primary)]',
                    collab.online ? 'bg-green-500' : 'bg-[var(--text-muted)]'
                  )} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-[var(--text-primary)]">{collab.name}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">{collab.email}</p>
                </div>
                <div className={cn(
                  'flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full',
                  collab.role === 'editor'
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                )}>
                  {collab.role === 'editor' ? <Edit3 size={9} /> : <Eye size={9} />}
                  {collab.role}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time status */}
        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200/50 dark:border-green-500/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-xs text-green-700 dark:text-green-400 font-medium">Live sync active</p>
          </div>
          <p className="text-[10px] text-green-600 dark:text-green-500 mt-1">All changes sync in real-time via WebSockets</p>
        </div>
      </div>
    </motion.div>
  )
}
