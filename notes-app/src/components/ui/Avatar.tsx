'use client'

import Image from 'next/image'
import { cn, getInitials } from '@/lib/utils'

interface AvatarProps {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
  xl: 'w-14 h-14 text-lg',
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const initials = getInitials(name)

  return (
    <div
      className={cn(
        'relative rounded-full flex items-center justify-center font-semibold overflow-hidden flex-shrink-0',
        'bg-gradient-to-br from-indigo-400 to-violet-600 text-white ring-2 ring-white/20',
        sizeMap[size],
        className
      )}
    >
      {src ? (
        <Image src={src} alt={name} fill className="object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}
