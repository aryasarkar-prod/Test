'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, X, Sparkles, Search, FileText, Tag, Wand2, ChevronRight, Loader2 } from 'lucide-react'
import { Note } from '@/types'
import { cn } from '@/lib/utils'

interface AIPanelProps {
  note: Note
  onClose: () => void
}

type AIAction = 'summarize' | 'improve' | 'tags' | 'search' | 'expand'

const suggestions = [
  { id: 'summarize', icon: FileText, label: 'Summarize', desc: 'Get a concise summary of this note' },
  { id: 'improve', icon: Wand2, label: 'Improve Writing', desc: 'Polish grammar and style' },
  { id: 'tags', icon: Tag, label: 'Suggest Tags', desc: 'AI-generated tags for this note' },
  { id: 'expand', icon: Sparkles, label: 'Expand Ideas', desc: 'Elaborate on key points' },
  { id: 'search', icon: Search, label: 'Semantic Search', desc: 'Find related notes by meaning' },
]

const mockResults: Record<AIAction, string> = {
  summarize: `**Summary**\n\nThis note covers the fundamentals of building modern SaaS products, focusing on user-centric design principles, scalable technical architecture (microservices, event-driven systems), and growth strategies centered around product-led growth. It includes a practical implementation checklist for teams starting new ventures.`,
  improve: `Your writing is clear and well-structured. Here are a few suggestions:\n\n1. **Opening** — Consider starting with a compelling hook or statistic\n2. **Code example** — Add more context around the JavaScript snippet\n3. **Conclusion** — Add a strong call-to-action or next steps section\n4. **Active voice** — Replace "It is recommended that" with direct instructions`,
  tags: `Suggested tags based on content analysis:\n\n• **saas** — Product development methodology\n• **architecture** — Technical system design\n• **startup** — Entrepreneurial focus\n• **growth** — Product-led growth strategy\n• **checklist** — Actionable framework`,
  expand: `Here are expanded ideas for each section:\n\n**User-Centric Design** — Consider incorporating Jobs-to-be-Done framework alongside traditional user research. Interview at least 20 potential customers before writing a single line of code.\n\n**Technical Architecture** — For the microservices approach, start with a modular monolith and extract services only when you hit clear scaling boundaries. Premature extraction creates unnecessary complexity.`,
  search: `**Related Notes Found:**\n\n1. "Design System Notes" — 87% match (color theory, typography)\n2. "Product Roadmap Q3 2024" — 82% match (technical initiatives)\n3. "AI & Machine Learning Research" — 71% match (scaling architecture)`,
}

export function AIPanel({ note, onClose }: AIPanelProps) {
  const [activeAction, setActiveAction] = useState<AIAction | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const handleAction = async (action: AIAction) => {
    setActiveAction(action)
    setLoading(true)
    setResult(null)
    await new Promise((r) => setTimeout(r, 1500))
    setResult(mockResults[action])
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-80 border-l border-[var(--border)] bg-[var(--bg-primary)] flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">AI Assistant</p>
            <p className="text-xs text-[var(--text-muted)]">Powered by GPT-4</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] transition-all"
        >
          <X size={14} />
        </button>
      </div>

      {/* Ask AI */}
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about this note..."
            className="flex-1 h-9 px-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all"
          />
          <button
            onClick={() => query && handleAction('search')}
            className="w-9 h-9 rounded-xl bg-violet-600 hover:bg-violet-500 flex items-center justify-center text-white transition-all flex-shrink-0"
          >
            <Search size={14} />
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-4 py-3 flex-shrink-0">
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Quick Actions</p>
        <div className="space-y-1">
          {suggestions.map(({ id, icon: Icon, label, desc }) => (
            <button
              key={id}
              onClick={() => handleAction(id as AIAction)}
              className={cn(
                'w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all',
                activeAction === id
                  ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300'
                  : 'hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
              )}
            >
              <div className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
                activeAction === id
                  ? 'bg-violet-500 text-white'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
              )}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">{label}</p>
                <p className="text-[10px] text-[var(--text-muted)] truncate">{desc}</p>
              </div>
              <ChevronRight size={12} className="text-[var(--text-muted)]" />
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {loading && (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center animate-pulse">
              <Zap size={18} className="text-white" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[var(--text-secondary)]">Processing...</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Analyzing your note with AI</p>
            </div>
            <div className="flex gap-1 mt-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--bg-secondary)] rounded-2xl p-4 border border-[var(--border)]"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-violet-500" />
              <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                {suggestions.find((s) => s.id === activeAction)?.label}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
              {result}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
