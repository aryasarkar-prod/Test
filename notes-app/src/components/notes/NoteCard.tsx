'use client'

import { motion } from 'framer-motion'
import { Star, Pin, MoreHorizontal, Trash2, Clock } from 'lucide-react'
import { Note } from '@/types'
import { useAppStore } from '@/store/useAppStore'
import { formatRelativeDate, cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { useState } from 'react'

interface NoteCardProps {
  note: Note
  isActive: boolean
  onClick: () => void
  index: number
}

export function NoteCard({ note, isActive, onClick, index }: NoteCardProps) {
  const { pinNote, starNote, trashNote } = useAppStore()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={onClick}
      className={cn(
        'note-card group relative cursor-pointer',
        isActive && 'active'
      )}
      style={note.color ? { borderLeftColor: note.color, borderLeftWidth: 3 } : undefined}
    >
      {/* Pin indicator */}
      {note.isPinned && (
        <div className="absolute top-3 right-3">
          <Pin size={12} className="text-indigo-500 fill-indigo-500" />
        </div>
      )}

      {/* Title */}
      <h3 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-1 pr-6">
        {note.title}
      </h3>

      {/* Excerpt */}
      <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2 leading-relaxed">
        {note.excerpt}
      </p>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {note.tags.slice(0, 3).map((tag) => (
            <Badge key={tag.id} color={tag.color} className="text-[10px] px-2 py-0.5">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[var(--border)]">
        <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
          <Clock size={10} />
          {formatRelativeDate(note.updatedAt)}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
          <span>{note.wordCount} words</span>
          <span>·</span>
          <span>{note.readTime} min</span>
        </div>
      </div>

      {/* Hover actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
        <button
          onClick={(e) => { e.stopPropagation(); starNote(note.id) }}
          className={cn(
            'w-6 h-6 rounded-lg flex items-center justify-center transition-all',
            note.isStarred
              ? 'text-amber-500'
              : 'text-[var(--text-muted)] hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'
          )}
        >
          <Star size={12} fill={note.isStarred ? 'currentColor' : 'none'} />
        </button>
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-all"
          >
            <MoreHorizontal size={12} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-7 w-36 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-card-hover z-20 py-1 overflow-hidden">
              <button
                onClick={(e) => { e.stopPropagation(); pinNote(note.id); setShowMenu(false) }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <Pin size={12} />
                {note.isPinned ? 'Unpin' : 'Pin note'}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); starNote(note.id); setShowMenu(false) }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <Star size={12} />
                {note.isStarred ? 'Unstar' : 'Star note'}
              </button>
              <div className="h-px bg-[var(--border)] my-1" />
              <button
                onClick={(e) => { e.stopPropagation(); trashNote(note.id); setShowMenu(false) }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={12} />
                Move to trash
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
