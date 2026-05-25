'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ]

  if (compact) {
    const current = themes.find((t) => t.value === theme) || themes[2]
    const Icon = current.icon
    return (
      <button
        onClick={() => {
          const idx = themes.findIndex((t) => t.value === theme)
          setTheme(themes[(idx + 1) % themes.length].value)
        }}
        className="nav-item"
        title={`Theme: ${current.label}`}
      >
        <Icon size={16} />
        <span>{current.label} Mode</span>
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={label}
          className={cn(
            'relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
            theme === value
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          )}
        >
          {theme === value && (
            <motion.div
              layoutId="theme-indicator"
              className="absolute inset-0 bg-white dark:bg-indigo-500/20 rounded-lg shadow-sm"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <Icon size={14} className="relative z-10" />
          <span className="relative z-10">{label}</span>
        </button>
      ))}
    </div>
  )
}
