import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  color?: string
  variant?: 'solid' | 'soft' | 'outline'
  className?: string
}

export function Badge({ children, color, variant = 'soft', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        !color && variant === 'soft' && 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
        className
      )}
      style={
        color
          ? {
              backgroundColor: `${color}20`,
              color: color,
              border: variant === 'outline' ? `1px solid ${color}40` : undefined,
            }
          : undefined
      }
    >
      {children}
    </span>
  )
}
