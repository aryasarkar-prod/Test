'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, Github, Chrome, Zap, Shield, Globe } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function LoginPage() {
  const router = useRouter()
  const login = useAppStore((s) => s.login)
  const [email, setEmail] = useState('alex@example.com')
  const [password, setPassword] = useState('password')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    login(email, password)
    router.push('/notes')
  }

  const features = [
    { icon: Zap, text: 'AI-powered search & summarization' },
    { icon: Shield, text: 'End-to-end encrypted notes' },
    { icon: Globe, text: 'Real-time collaboration' },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-[52%] relative overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-700 to-purple-800" />
        
        {/* Animated blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-56 h-56 bg-cyan-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        {/* Geometric grid */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fillOpacity="0.9"/>
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Noteflow</span>
          </div>

          {/* Main content */}
          <div className="space-y-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl font-bold text-white leading-tight"
              >
                Your ideas,
                <br />
                <span className="text-indigo-200">beautifully</span>
                <br />
                organized.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-indigo-200 text-lg leading-relaxed"
              >
                The notes app that thinks like you do. Powered by AI, built for deep work.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-indigo-100">
                  <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                    <Icon size={15} />
                  </div>
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <p className="text-white/90 text-sm italic leading-relaxed">
              "Noteflow changed how I think and write. It's the only app I use every single day."
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                SL
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Sarah Lin</p>
                <p className="text-indigo-300 text-xs">Product Designer at Figma</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel — Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[var(--bg-primary)] p-6">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-brand">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" />
              </svg>
            </div>
            <span className="font-bold text-xl gradient-text">Noteflow</span>
          </div>

          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Welcome back</h2>
          <p className="text-[var(--text-secondary)] text-sm mb-8">
            Sign in to continue to your workspace
          </p>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex items-center justify-center gap-2 h-10 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] transition-colors text-sm font-medium text-[var(--text-primary)]">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 h-10 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] transition-colors text-sm font-medium text-[var(--text-primary)]">
              <Github size={16} />
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[var(--bg-primary)] text-[var(--text-muted)]">
                or continue with email
              </span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Password</label>
                <button type="button" className="text-xs text-indigo-500 hover:text-indigo-600 font-medium">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 pl-10 pr-10 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Don't have an account?{' '}
            <Link href="/signup" className="text-indigo-500 hover:text-indigo-600 font-semibold">
              Sign up free
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
            By signing in, you agree to our{' '}
            <span className="text-indigo-500 cursor-pointer">Terms</span> and{' '}
            <span className="text-indigo-500 cursor-pointer">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
