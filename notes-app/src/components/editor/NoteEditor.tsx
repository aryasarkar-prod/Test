'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bold, Italic, Underline, Code, Link2, List, ListOrdered,
  Quote, Heading1, Heading2, Heading3, Eye, Edit3, Columns,
  Star, Pin, Tag, Users, Clock, Hash, MoreHorizontal,
  Download, Share2, Trash2, History, Zap, Bell, Save,
  ChevronDown, Image, CheckSquare, Minus
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { formatDate, cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CollaborationPanel } from './CollaborationPanel'
import { VersionHistoryPanel } from './VersionHistoryPanel'
import { AIPanel } from './AIPanel'

export function NoteEditor() {
  const {
    notes, activeNoteId, updateNote, starNote, pinNote, trashNote,
    editorMode, setEditorMode, tags
  } = useAppStore()

  const note = notes.find((n) => n.id === activeNoteId)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saved, setSaved] = useState(true)
  const [showCollabPanel, setShowCollabPanel] = useState(false)
  const [showVersionPanel, setShowVersionPanel] = useState(false)
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [showTagPicker, setShowTagPicker] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout>()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
      setSaved(true)
    }
  }, [note?.id])

  const handleContentChange = useCallback(
    (value: string) => {
      setContent(value)
      setSaved(false)
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => {
        if (activeNoteId) {
          updateNote(activeNoteId, { content: value })
          setSaved(true)
        }
      }, 800)
    },
    [activeNoteId, updateNote]
  )

  const handleTitleChange = useCallback(
    (value: string) => {
      setTitle(value)
      setSaved(false)
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => {
        if (activeNoteId) {
          updateNote(activeNoteId, { title: value })
          setSaved(true)
        }
      }, 600)
    },
    [activeNoteId, updateNote]
  )

  // Insert markdown syntax
  const insertMarkdown = (before: string, after = '', placeholder = '') => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.slice(start, end) || placeholder
    const newContent =
      content.slice(0, start) + before + selected + after + content.slice(end)
    handleContentChange(newContent)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
      )
    }, 0)
  }

  const toolbarActions = [
    { icon: Heading1, label: 'Heading 1', action: () => insertMarkdown('# ', '', 'Heading') },
    { icon: Heading2, label: 'Heading 2', action: () => insertMarkdown('## ', '', 'Heading') },
    { icon: Heading3, label: 'Heading 3', action: () => insertMarkdown('### ', '', 'Heading') },
    { type: 'divider' },
    { icon: Bold, label: 'Bold', action: () => insertMarkdown('**', '**', 'bold text'), shortcut: '⌘B' },
    { icon: Italic, label: 'Italic', action: () => insertMarkdown('*', '*', 'italic text'), shortcut: '⌘I' },
    { icon: Underline, label: 'Strikethrough', action: () => insertMarkdown('~~', '~~', 'text') },
    { icon: Code, label: 'Code', action: () => insertMarkdown('`', '`', 'code') },
    { type: 'divider' },
    { icon: Quote, label: 'Quote', action: () => insertMarkdown('> ', '', 'quote') },
    { icon: List, label: 'Bullet list', action: () => insertMarkdown('- ', '', 'item') },
    { icon: ListOrdered, label: 'Numbered list', action: () => insertMarkdown('1. ', '', 'item') },
    { icon: CheckSquare, label: 'Task list', action: () => insertMarkdown('- [ ] ', '', 'task') },
    { type: 'divider' },
    { icon: Minus, label: 'Divider', action: () => handleContentChange(content + '\n---\n') },
    { icon: Link2, label: 'Link', action: () => insertMarkdown('[', '](url)', 'link text') },
    { icon: Image, label: 'Image', action: () => insertMarkdown('![', '](url)', 'alt text') },
  ] as const

  // Render markdown preview
  const renderMarkdown = (md: string) => {
    return md
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/~~(.+?)~~/g, '<del>$1</del>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      .replace(/^- \[ \] (.+)$/gm, '<div class="flex gap-2 items-start"><input type="checkbox" class="mt-1 rounded" /><span>$1</span></div>')
      .replace(/^- \[x\] (.+)$/gm, '<div class="flex gap-2 items-start"><input type="checkbox" checked class="mt-1 rounded" /><span class="line-through opacity-60">$1</span></div>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/^---$/gm, '<hr class="my-4 border-[var(--border)]" />')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-indigo-500 underline" target="_blank">$1</a>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[hblicodpd])(.+)$/gm, '<p>$1</p>')
  }

  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-500/10 dark:to-violet-500/10 flex items-center justify-center"
        >
          <Edit3 size={32} className="text-indigo-400" />
        </motion.div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Select a note</h3>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Choose a note from the list or create a new one
          </p>
        </div>
        <Button variant="primary" onClick={() => useAppStore.getState().createNote()}>
          <Edit3 size={14} /> New Note
        </Button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] flex-shrink-0">
        {/* Editor mode tabs */}
        <div className="flex items-center gap-1 bg-[var(--bg-secondary)] p-1 rounded-xl">
          {([
            { mode: 'edit', icon: Edit3, label: 'Edit' },
            { mode: 'preview', icon: Eye, label: 'Preview' },
            { mode: 'split', icon: Columns, label: 'Split' },
          ] as const).map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => setEditorMode(mode)}
              className={cn(
                'relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                editorMode === mode
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              )}
            >
              {editorMode === mode && (
                <motion.div
                  layoutId="editor-mode"
                  className="absolute inset-0 bg-white dark:bg-indigo-500/20 rounded-lg shadow-sm"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Icon size={13} className="relative z-10" />
              <span className="relative z-10">{label}</span>
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Save indicator */}
          <div className={cn(
            'flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all',
            saved
              ? 'text-green-600 dark:text-green-400'
              : 'text-[var(--text-muted)]'
          )}>
            <Save size={12} />
            <span>{saved ? 'Saved' : 'Saving...'}</span>
          </div>

          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all',
              showAIPanel
                ? 'bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400'
                : 'hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]'
            )}
          >
            <Zap size={13} />
            AI
          </button>
          <button
            onClick={() => setShowCollabPanel(!showCollabPanel)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all',
              showCollabPanel
                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600'
                : 'hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]'
            )}
          >
            <Users size={13} />
            Share
          </button>
          <button
            onClick={() => setShowVersionPanel(!showVersionPanel)}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] transition-all"
            title="Version history"
          >
            <History size={14} />
          </button>
          <button
            onClick={() => starNote(note.id)}
            className={cn(
              'p-1.5 rounded-lg transition-all',
              note.isStarred
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-500/10'
                : 'hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]'
            )}
          >
            <Star size={14} fill={note.isStarred ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => pinNote(note.id)}
            className={cn(
              'p-1.5 rounded-lg transition-all',
              note.isPinned
                ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                : 'hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]'
            )}
          >
            <Pin size={14} fill={note.isPinned ? 'currentColor' : 'none'} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] transition-all">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* Markdown toolbar */}
      {(editorMode === 'edit' || editorMode === 'split') && (
        <div className="flex items-center gap-0.5 px-4 py-2 border-b border-[var(--border)] flex-shrink-0 overflow-x-auto">
          {toolbarActions.map((action, i) => {
            if ('type' in action && action.type === 'divider') {
              return <div key={i} className="w-px h-5 bg-[var(--border)] mx-1 flex-shrink-0" />
            }
            const { icon: Icon, label, action: fn } = action as any
            return (
              <button
                key={i}
                onClick={fn}
                title={label}
                className="flex-shrink-0 w-7 h-7 rounded-lg hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
              >
                <Icon size={14} />
              </button>
            )
          })}
        </div>
      )}

      {/* Main editor area */}
      <div className="flex-1 flex min-h-0">
        {/* Editor pane */}
        {(editorMode === 'edit' || editorMode === 'split') && (
          <div className={cn(
            'flex flex-col overflow-hidden',
            editorMode === 'split' ? 'flex-1 border-r border-[var(--border)]' : 'flex-1'
          )}>
            {/* Title */}
            <div className="px-8 pt-8 pb-2">
              <input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Untitled Note"
                className="w-full text-3xl font-bold text-[var(--text-primary)] bg-transparent outline-none placeholder:text-[var(--text-muted)]/40"
              />

              {/* Meta row */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                  <Clock size={11} />
                  <span>Updated {formatDate(note.updatedAt)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                  <span>{note.wordCount} words · {note.readTime} min read</span>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1 flex-wrap">
                  {note.tags.map((tag) => (
                    <Badge key={tag.id} color={tag.color} className="text-[10px]">
                      #{tag.name}
                    </Badge>
                  ))}
                  <button
                    onClick={() => setShowTagPicker(!showTagPicker)}
                    className="flex items-center gap-0.5 text-[10px] text-[var(--text-muted)] hover:text-indigo-500 transition-colors px-1.5 py-0.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                  >
                    <Hash size={10} />
                    Add tag
                  </button>
                </div>

                {/* Color indicator */}
                {note.color && (
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: note.color }} />
                )}
              </div>

              {/* Tag picker */}
              <AnimatePresence>
                {showTagPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-2 flex flex-wrap gap-1.5"
                  >
                    {tags.map((tag) => {
                      const isActive = note.tags.some((t) => t.id === tag.id)
                      return (
                        <button
                          key={tag.id}
                          onClick={() => {
                            const newTags = isActive
                              ? note.tags.filter((t) => t.id !== tag.id)
                              : [...note.tags, tag]
                            updateNote(note.id, { tags: newTags })
                          }}
                          className={cn(
                            'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all',
                            isActive ? 'text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                          )}
                          style={isActive ? { backgroundColor: tag.color } : undefined}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isActive ? 'white' : tag.color }} />
                          {tag.name}
                        </button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-4 border-t border-[var(--border)]" />
            </div>

            {/* Content textarea */}
            <div className="flex-1 overflow-y-auto px-8 pb-8">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Start writing... (Markdown supported)"
                className="w-full h-full min-h-[400px] bg-transparent text-[var(--text-primary)] text-sm leading-relaxed font-mono outline-none resize-none placeholder:text-[var(--text-muted)]/40 pt-4"
                style={{ fontFamily: 'var(--font-jetbrains)' }}
                spellCheck={false}
              />
            </div>
          </div>
        )}

        {/* Preview pane */}
        {(editorMode === 'preview' || editorMode === 'split') && (
          <div className={cn(
            'flex flex-col overflow-hidden',
            editorMode === 'split' ? 'flex-1' : 'flex-1'
          )}>
            <div className="flex-1 overflow-y-auto px-8 pt-8 pb-8">
              {editorMode === 'preview' && (
                <>
                  <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">{title}</h1>
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[var(--border)]">
                    <span className="text-xs text-[var(--text-muted)]">{formatDate(note.updatedAt)}</span>
                    <span className="text-xs text-[var(--text-muted)]">{note.wordCount} words</span>
                    {note.tags.map((tag) => (
                      <Badge key={tag.id} color={tag.color} className="text-[10px]">#{tag.name}</Badge>
                    ))}
                  </div>
                </>
              )}
              <div
                className="editor-content prose prose-sm dark:prose-invert max-w-none text-[var(--text-primary)]"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            </div>
          </div>
        )}

        {/* AI Panel */}
        <AnimatePresence>
          {showAIPanel && <AIPanel note={note} onClose={() => setShowAIPanel(false)} />}
        </AnimatePresence>

        {/* Collab Panel */}
        <AnimatePresence>
          {showCollabPanel && <CollaborationPanel note={note} onClose={() => setShowCollabPanel(false)} />}
        </AnimatePresence>

        {/* Version Panel */}
        <AnimatePresence>
          {showVersionPanel && <VersionHistoryPanel note={note} onClose={() => setShowVersionPanel(false)} />}
        </AnimatePresence>
      </div>
    </div>
  )
}
