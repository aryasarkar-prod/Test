'use client'

import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, CartesianGrid
} from 'recharts'
import { FileText, Flame, TrendingUp, Zap, Target, Award, BookOpen, Clock } from 'lucide-react'
import { mockAnalytics, mockNotes, mockTasks } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#22c55e', '#3b82f6']

const weeklyData = [
  { day: 'Mon', notes: 3, words: 450 },
  { day: 'Tue', notes: 7, words: 1200 },
  { day: 'Wed', notes: 2, words: 320 },
  { day: 'Thu', notes: 5, words: 890 },
  { day: 'Fri', notes: 4, words: 650 },
  { day: 'Sat', notes: 1, words: 180 },
  { day: 'Sun', notes: 3, words: 520 },
]

const monthlyData = Array.from({ length: 30 }, (_, i) => ({
  date: `${i + 1}`,
  notes: Math.floor(Math.random() * 8) + 1,
  words: Math.floor(Math.random() * 1200) + 200,
}))

const stats = [
  {
    label: 'Total Notes',
    value: '47',
    change: '+6 this week',
    icon: FileText,
    color: 'from-indigo-500 to-indigo-600',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    text: 'text-indigo-600 dark:text-indigo-400',
    trend: '+14%',
    positive: true,
  },
  {
    label: 'Writing Streak',
    value: '12',
    change: 'days in a row',
    icon: Flame,
    color: 'from-orange-400 to-red-500',
    bg: 'bg-orange-50 dark:bg-orange-500/10',
    text: 'text-orange-600 dark:text-orange-400',
    trend: 'Personal best!',
    positive: true,
  },
  {
    label: 'Total Words',
    value: '12.4K',
    change: '+1.2K this week',
    icon: BookOpen,
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 dark:bg-violet-500/10',
    text: 'text-violet-600 dark:text-violet-400',
    trend: '+11%',
    positive: true,
  },
  {
    label: 'Avg Read Time',
    value: '4.2',
    change: 'min per note',
    icon: Clock,
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    trend: '-0.3 min',
    positive: false,
  },
]

export function AnalyticsDashboard() {
  const completedTasks = mockTasks.filter((t) => t.status === 'done').length
  const taskProgress = Math.round((completedTasks / mockTasks.length) * 100)
  const wordProgress = Math.round((mockAnalytics.writingGoal.current / mockAnalytics.writingGoal.target) * 100)

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 glass border-b border-[var(--border)] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Analytics</h1>
            <p className="text-sm text-[var(--text-muted)]">Your writing insights & productivity metrics</p>
          </div>
          <div className="flex gap-2">
            {['7D', '30D', '90D', '1Y'].map((period) => (
              <button
                key={period}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
                  period === '7D'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                )}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-4 hover:shadow-card-hover transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center', stat.bg)}>
                    <Icon size={18} className={stat.text} />
                  </div>
                  <span className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    stat.positive
                      ? 'text-green-600 bg-green-50 dark:bg-green-500/10'
                      : 'text-[var(--text-muted)] bg-[var(--bg-secondary)]'
                  )}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                <p className="text-xs font-medium text-[var(--text-secondary)] mt-0.5">{stat.label}</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{stat.change}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Activity chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Writing Activity</h3>
                <p className="text-xs text-[var(--text-muted)]">Notes created per day this week</p>
              </div>
              <TrendingUp size={16} className="text-indigo-500" />
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={weeklyData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="notesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Area type="monotone" dataKey="notes" stroke="#6366f1" strokeWidth={2.5} fill="url(#notesGrad)" dot={{ fill: '#6366f1', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Tag distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-5"
          >
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Top Tags</h3>
            <p className="text-xs text-[var(--text-muted)] mb-4">Notes by category</p>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie
                  data={mockAnalytics.topTags}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={3}
                >
                  {mockAnalytics.topTags.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5">
              {mockAnalytics.topTags.slice(0, 4).map((tag, i) => (
                <div key={tag.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-[var(--text-secondary)]">#{tag.name}</span>
                  </div>
                  <span className="text-[var(--text-muted)]">{tag.count} notes</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Goals + Heatmap row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Goals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Target size={16} className="text-indigo-500" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Goals Progress</h3>
            </div>

            <div className="space-y-4">
              {/* Writing goal */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">Monthly Writing Goal</span>
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    {mockAnalytics.writingGoal.current.toLocaleString()} / {mockAnalytics.writingGoal.target.toLocaleString()} words
                  </span>
                </div>
                <div className="w-full h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${wordProgress}%` }}
                    transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                  />
                </div>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">{wordProgress}% of monthly goal</p>
              </div>

              {/* Task goal */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">Tasks Completed</span>
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    {completedTasks} / {mockTasks.length}
                  </span>
                </div>
                <div className="w-full h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${taskProgress}%` }}
                    transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  />
                </div>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">{taskProgress}% completion rate</p>
              </div>

              {/* Notes goal */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">Daily Note Streak</span>
                  <span className="text-xs font-bold text-[var(--text-primary)]">12 / 30 days</span>
                </div>
                <div className="w-full h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '40%' }}
                    transition={{ duration: 1.2, delay: 0.7, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                  />
                </div>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">On a 12-day streak 🔥</p>
              </div>
            </div>
          </motion.div>

          {/* Monthly words bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Words Written</h3>
                <p className="text-xs text-[var(--text-muted)]">Last 30 days</p>
              </div>
              <BookOpen size={16} className="text-violet-500" />
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyData.slice(-14)} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Bar dataKey="words" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Award size={16} className="text-amber-500" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Achievements</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { emoji: '✍️', label: 'First Note', earned: true },
              { emoji: '🔥', label: '7-Day Streak', earned: true },
              { emoji: '📚', label: '10K Words', earned: true },
              { emoji: '🏆', label: '30-Day Streak', earned: false },
              { emoji: '🚀', label: '100 Notes', earned: false },
              { emoji: '💎', label: 'Power User', earned: false },
            ].map((achievement) => (
              <div
                key={achievement.label}
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-2xl border text-center transition-all',
                  achievement.earned
                    ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200/60 dark:border-amber-500/20'
                    : 'bg-[var(--bg-secondary)] border-transparent opacity-50 grayscale'
                )}
              >
                <span className="text-2xl">{achievement.emoji}</span>
                <span className="text-[10px] font-medium text-[var(--text-secondary)]">{achievement.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-5"
        >
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'Created note', item: 'Building a Modern SaaS Product', time: '2 hours ago', icon: '📝' },
              { action: 'Completed task', item: 'Set up monitoring & alerts', time: '5 hours ago', icon: '✅' },
              { action: 'Updated note', item: 'Weekly Review — May 2024', time: 'Yesterday', icon: '✏️' },
              { action: 'Added to folder', item: 'Product Roadmap Q3 2024', time: '2 days ago', icon: '📁' },
              { action: 'Starred note', item: 'Reading Notes: Atomic Habits', time: '3 days ago', icon: '⭐' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-[var(--border)] last:border-0">
                <span className="text-lg w-8 text-center flex-shrink-0">{item.icon}</span>
                <div className="flex-1">
                  <span className="text-xs text-[var(--text-muted)]">{item.action} </span>
                  <span className="text-xs font-medium text-[var(--text-secondary)]">"{item.item}"</span>
                </div>
                <span className="text-[10px] text-[var(--text-muted)] whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
