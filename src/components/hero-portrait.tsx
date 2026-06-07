'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import type { Hero } from '@/lib/hero-data'

interface HeroPortraitProps {
  hero: Hero
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showName?: boolean
  showRole?: boolean
  glow?: boolean
  glowColor?: 'gold' | 'silver' | 'bronze' | 'red' | 'green'
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
  xl: 'w-28 h-28',
}

const glowClasses = {
  gold: 'ring-2 ring-primary shadow-[0_0_20px_var(--glow-gold)]',
  silver: 'ring-2 ring-silver shadow-[0_0_15px_rgba(180,180,180,0.3)]',
  bronze: 'ring-2 ring-bronze shadow-[0_0_12px_rgba(205,127,50,0.3)]',
  red: 'ring-2 ring-destructive shadow-[0_0_16px_rgba(220,60,40,0.35)]',
  green: 'ring-2 ring-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.35)]',
}

// Generate a consistent color based on hero name for the placeholder
function getHeroColor(name: string): string {
  const colors = [
    'bg-amber-800',
    'bg-blue-800', 
    'bg-emerald-800',
    'bg-rose-800',
    'bg-violet-800',
    'bg-cyan-800',
    'bg-orange-800',
    'bg-teal-800',
  ]
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

export function HeroPortrait({ 
  hero, 
  size = 'md', 
  className,
  showName = false,
  showRole = false,
  glow = false,
  glowColor = 'gold'
}: HeroPortraitProps) {
  const tRoles = useTranslations('roles')
  const initials = hero.name.slice(0, 2).toUpperCase()
  const bgColor = getHeroColor(hero.name)
  const imageSizes = {
    sm: '40px',
    md: '56px',
    lg: '80px',
    xl: '112px',
  }[size]
  
  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div 
        className={cn(
          'relative rounded-full overflow-hidden flex items-center justify-center transition-all',
          sizeClasses[size],
          bgColor,
          glow && glowClasses[glowColor],
          glow && glowColor === 'gold' && 'animate-glow'
        )}
      >
        {hero.portrait ? (
          <Image
            src={hero.portrait}
            alt={hero.name}
            fill
            sizes={imageSizes}
            className="object-cover"
          />
        ) : (
          <span className={cn(
            'font-bold text-foreground',
            size === 'sm' && 'text-xs',
            size === 'md' && 'text-sm',
            size === 'lg' && 'text-base',
            size === 'xl' && 'text-xl',
          )}>
            {initials}
          </span>
        )}
      </div>
      {showName && (
        <span className={cn(
          'font-medium text-foreground truncate max-w-full',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          size === 'lg' && 'text-base',
          size === 'xl' && 'text-lg',
        )}>
          {hero.name}
        </span>
      )}
      {showRole && (
        <span className="text-xs text-muted-foreground">{tRoles(hero.role.toLowerCase())}</span>
      )}
    </div>
  )
}
