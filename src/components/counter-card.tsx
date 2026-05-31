'use client'

import { cn } from '@/lib/utils'
import type { CounterHero } from '@/lib/hero-data'
import { HeroPortrait } from './hero-portrait'
import { Badge } from '@/components/ui/badge'
import { Crown, Medal, Award } from 'lucide-react'

interface CounterCardProps {
  counter: CounterHero
  isRevealing?: boolean
  delay?: number
}

const rankConfig = {
  1: {
    icon: Crown,
    label: '#1 BEST',
    size: 'xl' as const,
    glow: true,
    glowColor: 'gold' as const,
    borderClass: 'ring-4 ring-primary/60 ring-offset-4 ring-offset-background',
    textClass: 'text-primary',
    scoreClass: 'text-primary font-bold',
  },
  2: {
    icon: Medal,
    label: '#2',
    size: 'lg' as const,
    glow: true,
    glowColor: 'silver' as const,
    borderClass: 'ring-2 ring-silver/50 ring-offset-2 ring-offset-background',
    textClass: 'text-silver',
    scoreClass: 'text-silver font-semibold',
  },
  3: {
    icon: Award,
    label: '#3',
    size: 'lg' as const,
    glow: true,
    glowColor: 'bronze' as const,
    borderClass: 'ring-2 ring-bronze/50 ring-offset-2 ring-offset-background',
    textClass: 'text-bronze',
    scoreClass: 'text-bronze font-semibold',
  },
}

// Circular card for top 3 ranks
export function CounterCard({ counter, isRevealing = false, delay = 0 }: CounterCardProps) {
  const isTopThree = counter.rank <= 3
  const config = rankConfig[counter.rank as 1 | 2 | 3]
  
  if (isTopThree && config) {
    const Icon = config.icon
    
    return (
      <div
        className={cn(
          'flex flex-col items-center text-center transition-all',
          isRevealing && 'animate-reveal'
        )}
        style={{ animationDelay: isRevealing ? `${delay}ms` : '0ms' }}
      >
        {/* Rank Badge */}
        <div className={cn('flex items-center gap-1 mb-3', config.textClass)}>
          <Icon className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider">
            {config.label}
          </span>
        </div>
        
        {/* Circular Portrait with ring */}
        <div className={cn('rounded-full', config.borderClass)}>
          <HeroPortrait
            hero={counter}
            size={config.size}
            glow={config.glow}
            glowColor={config.glowColor}
          />
        </div>
        
        {/* Hero Name */}
        <h3 className={cn(
          'font-bold text-foreground mt-3',
          counter.rank === 1 ? 'text-lg' : 'text-base'
        )}>
          {counter.name}
        </h3>
        
        {/* Role */}
        <p className="text-xs text-muted-foreground">{counter.role}</p>
        
        {/* Score */}
        <div className={cn('mt-1', config.scoreClass)}>
          <span className="text-sm">{counter.counterScore}%</span>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-1 mt-2">
          {counter.tags.slice(0, 2).map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-[10px] px-1.5 py-0 bg-muted text-muted-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    )
  }
  
  // Rank 4-5 compact circular cards
  return (
    <div
      className={cn(
        'flex flex-col items-center text-center transition-all',
        isRevealing && 'animate-reveal'
      )}
      style={{ animationDelay: isRevealing ? `${delay}ms` : '0ms' }}
    >
      {/* Rank Number */}
      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-[10px] font-bold text-muted-foreground mb-2">
        {counter.rank}
      </div>
      
      {/* Circular Portrait */}
      <div className="rounded-full ring-1 ring-border ring-offset-1 ring-offset-background">
        <HeroPortrait hero={counter} size="md" />
      </div>
      
      {/* Hero Name */}
      <h4 className="font-semibold text-foreground text-sm mt-2 truncate max-w-[80px]">
        {counter.name}
      </h4>
      
      {/* Role */}
      <p className="text-[10px] text-muted-foreground">{counter.role}</p>
      
      {/* Score */}
      <span className="text-xs font-medium text-muted-foreground mt-1">
        {counter.counterScore}%
      </span>
    </div>
  )
}
