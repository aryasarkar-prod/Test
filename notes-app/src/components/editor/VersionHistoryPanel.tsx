'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { History, X, RotateCcw, Eye, ChevronRight } from 'lucide-react'
import { Note } from '@/types'
import { formatDate, formatRelativeDate } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'

interface VersionPanelProps {
  note: Note
  onClose: () => void
}

const mockVersions = [
  { id: 'v5', label: 'Current version', date: new Date(), author: 'Alex Johnson', words: 245, changes: '+12 words' },
  { id: 'v4', label: 'Added code examples', date: new Date(Date.now() - 3600000), author: 'Alex Johnson', words: 233, changes: '+45 words' },
  { id: 'v3', label: 'Restructured sections', date: new Date(Date.now() - 86400000), author: 'Sarah Lin', words: 188, changes: 'Reorganized' },
  { id: 'v2', label: 'Initial draft', date: new Date(Date.now() - 172800000), author: 'Alex Johnson', words: 120, changes: 'First version' },
  { id: 'v1', label: 'Created', date: new Date(Date.now() - 259200000), author: 'Alex Johnson', words: 0, changes: 'Note created' },
]

export function VersionHistoryPanel({ note, onClose }: VersionPanelProps) {
  const [selectedVersion, setSelectedVersion] = useState(mockVersions[0].id)

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
          <History size={16} className="text-indigo-500" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">Version History</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] transition-all">
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-xs text-[var(--text-muted)] mb-3">
          {mockVersions.length} versions saved automatically
        </p>

        <div className="space-y-2">
          {mockVersions.map((version, i) => (
            <motion.button
              key={version.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedVersion(version.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                selectedVersion === version.id
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200/60 dark:border-indigo-500/30'
                  : 'bg-[var(--bg-secondary)] border-transparent hover:border-[var(--border)]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {i === 0 && (
                      <span className="text-[10px] bg-green-100 dark:bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded-full font-medium">
                        Current
                      </span>
                    )}
                    <p className="text-xs font-medium text-[var(--text-primary)]">{version.label}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar name={version.author} size="sm" className="w-4 h-4 text-[8px]" />
                    <p className="text-[10px] text-[var(--text-muted)]">{version.author}</p>
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">
                    {formatRelativeDate(version.date)} · {version.words} words
                  </p>
                </div>
                <div className="text-[10px] text-[var(--text-muted)] whitespace-nowrap">{version.changes}</div>
              </div>

              {selectedVersion === version.id && (
                <div className="flex gap-2 mt-2 pt-2 border-t border-[var(--border)]">
                  <button className="flex items-center gap-1 text-[10px] text-indigo-500 hover:text-indigo-600">
                    <Eye size={10} />
                    Preview
                  </button>
                  {i !== 0 && (
                    <button className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
                      <RotateCcw size={10} />
                      Restore
                    </button>
                  )}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
