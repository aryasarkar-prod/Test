'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, CheckSquare, Clock, AlertTriangle, CheckCircle2,
  MoreHorizontal, Calendar, Tag, Trash2, Edit3, Flag, X
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { Task } from '@/types'
import { formatDate, cn } from '@/lib/utils'

type Column = {
  id: Task['status']
  label: string
  color: string
  icon: React.ReactNode
  bg: string
}

const COLUMNS: Column[] = [
  { id: 'todo', label: 'To Do', color: 'text-slate-500', icon: <Clock size={14} />, bg: 'bg-slate-100 dark:bg-slate-500/10' },
  { id: 'in-progress', label: 'In Progress', icon: <Edit3 size={14} />, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-500/10' },
  { id: 'review', label: 'Review', icon: <AlertTriangle size={14} />, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-500/10' },
  { id: 'done', label: 'Done', icon: <CheckCircle2 size={14} />, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-500/10' },
]

const PRIORITY_CONFIG = {
  urgent: { label: 'Urgent', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-500/10', icon: '🔥' },
  high: { label: 'High', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10', icon: '⬆️' },
  medium: { label: 'Medium', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10', icon: '➡️' },
  low: { label: 'Low', color: 'text-slate-400', bg: 'bg-slate-50 dark:bg-slate-500/10', icon: '⬇️' },
}

export function KanbanBoard() {
  const { tasks, updateTask, createTask, deleteTask } = useAppStore()
  const [showNewTask, setShowNewTask] = useState<Task['status'] | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<Task['status'] | null>(null)
  const [expandedTask, setExpandedTask] = useState<string | null>(null)

  const getColumnTasks = (status: Task['status']) =>
    tasks.filter((t) => t.status === status)

  const handleDragStart = (taskId: string) => setDraggedTask(taskId)
  const handleDragOver = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault()
    setDragOverColumn(status)
  }
  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault()
    if (draggedTask) {
      updateTask(draggedTask, { status })
    }
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  const handleCreateTask = (status: Task['status']) => {
    if (newTaskTitle.trim()) {
      createTask({ title: newTaskTitle.trim(), status })
      setNewTaskTitle('')
      setShowNewTask(null)
    }
  }

  const totalTasks = tasks.length
  const doneTasks = tasks.filter((t) => t.status === 'done').length
  const progress = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--border)] flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Tasks</h1>
            <p className="text-sm text-[var(--text-muted)]">
              {doneTasks}/{totalTasks} tasks completed · {progress}% done
            </p>
          </div>
          <button
            onClick={() => { setShowNewTask('todo'); }}
            className="flex items-center gap-2 h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all shadow-brand"
          >
            <Plus size={15} />
            New Task
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
          />
        </div>
      </div>

      {/* Kanban columns */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 h-full min-w-max">
          {COLUMNS.map((col) => {
            const colTasks = getColumnTasks(col.id)
            const isOver = dragOverColumn === col.id

            return (
              <div
                key={col.id}
                className={cn(
                  'w-[280px] flex flex-col rounded-2xl transition-all duration-200',
                  isOver ? 'bg-indigo-50/50 dark:bg-indigo-500/5 ring-2 ring-indigo-400/30' : 'bg-[var(--bg-secondary)]'
                )}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Column header */}
                <div className="flex items-center justify-between p-3 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', col.bg, col.color)}>
                      {col.icon}
                      {col.label}
                    </div>
                    <span className="text-xs text-[var(--text-muted)] font-medium bg-[var(--bg-card)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                      {colTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNewTask(col.id)}
                    className="w-6 h-6 rounded-lg hover:bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-muted)] transition-all"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Tasks */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[200px]">
                  <AnimatePresence>
                    {colTasks.map((task, i) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        index={i}
                        isExpanded={expandedTask === task.id}
                        onToggleExpand={() =>
                          setExpandedTask(expandedTask === task.id ? null : task.id)
                        }
                        onDragStart={() => handleDragStart(task.id)}
                        onStatusChange={(status) => updateTask(task.id, { status })}
                        onDelete={() => deleteTask(task.id)}
                      />
                    ))}
                  </AnimatePresence>

                  {/* New task input */}
                  <AnimatePresence>
                    {showNewTask === col.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="bg-[var(--bg-card)] rounded-xl border border-indigo-400/50 p-2"
                      >
                        <input
                          autoFocus
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreateTask(col.id)
                            if (e.key === 'Escape') { setShowNewTask(null); setNewTaskTitle('') }
                          }}
                          placeholder="Task title..."
                          className="w-full bg-transparent text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
                        />
                        <div className="flex gap-1.5 mt-2">
                          <button
                            onClick={() => handleCreateTask(col.id)}
                            className="flex-1 h-7 rounded-lg bg-indigo-600 text-white text-xs font-medium transition-all hover:bg-indigo-500"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => { setShowNewTask(null); setNewTaskTitle('') }}
                            className="w-7 h-7 rounded-lg hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] transition-all"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {colTasks.length === 0 && showNewTask !== col.id && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center mb-2', col.bg)}>
                        <span className={col.color}>{col.icon}</span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)]">No tasks here</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function TaskCard({
  task, index, isExpanded, onToggleExpand, onDragStart, onStatusChange, onDelete
}: {
  task: Task
  index: number
  isExpanded: boolean
  onToggleExpand: () => void
  onDragStart: () => void
  onStatusChange: (s: Task['status']) => void
  onDelete: () => void
}) {
  const priority = PRIORITY_CONFIG[task.priority]
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.04 }}
      draggable
      onDragStart={onDragStart}
      className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-3 cursor-grab active:cursor-grabbing hover:shadow-card transition-all group"
    >
      {/* Priority + actions */}
      <div className="flex items-start justify-between gap-2">
        <span className={cn('inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full', priority.bg, priority.color)}>
          {priority.icon} {priority.label}
        </span>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onToggleExpand} className="w-5 h-5 rounded hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] transition-all">
            <MoreHorizontal size={11} />
          </button>
          <button onClick={onDelete} className="w-5 h-5 rounded hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 transition-all">
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Title */}
      <p className="text-xs font-semibold text-[var(--text-primary)] mt-2 leading-snug">{task.title}</p>

      {/* Description preview */}
      {task.description && (
        <p className="text-[10px] text-[var(--text-muted)] mt-1 line-clamp-2">{task.description}</p>
      )}

      {/* Subtasks progress */}
      {task.subtasks.length > 0 && (
        <div className="mt-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-[var(--text-muted)]">Subtasks</span>
            <span className="text-[10px] text-[var(--text-muted)]">{completedSubtasks}/{task.subtasks.length}</span>
          </div>
          <div className="w-full h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedSubtasks / task.subtasks.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[var(--border)]">
        <div className="flex gap-1 flex-wrap">
          {task.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[9px] bg-[var(--bg-secondary)] text-[var(--text-muted)] px-1.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        {task.dueDate && (
          <div className={cn(
            'flex items-center gap-1 text-[10px]',
            new Date(task.dueDate) < new Date()
              ? 'text-red-500'
              : 'text-[var(--text-muted)]'
          )}>
            <Calendar size={9} />
            {formatDate(task.dueDate)}
          </div>
        )}
      </div>

      {/* Expanded: subtasks */}
      <AnimatePresence>
        {isExpanded && task.subtasks.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-2 pt-2 border-t border-[var(--border)]"
          >
            <div className="space-y-1.5">
              {task.subtasks.map((sub) => (
                <div key={sub.id} className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)]">
                  <CheckCircle2 size={10} className={sub.completed ? 'text-green-500' : 'text-[var(--text-muted)]'} />
                  <span className={sub.completed ? 'line-through opacity-60' : ''}>{sub.title}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
