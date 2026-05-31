'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { Hero, CounterHero } from '@/lib/hero-data'
import { getCountersForHero } from '@/lib/hero-data'
import { HeroSelector } from './hero-selector'
import { HeroPortrait } from './hero-portrait'
import { CounterCard } from './counter-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Target, RotateCcw, Crosshair, Loader2 } from 'lucide-react'

type AnalysisState = 'idle' | 'analyzing' | 'revealing' | 'complete'

export function CounterAnalyzer() {
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null)
  const [counters, setCounters] = useState<CounterHero[]>([])
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle')
  const [revealedRanks, setRevealedRanks] = useState<number[]>([])

  const handleSelectHero = (hero: Hero) => {
    setSelectedHero(hero)
    setAnalysisState('analyzing')
    setRevealedRanks([])
    setCounters([])
    
    // Simulate analysis delay
    setTimeout(() => {
      const counterData = getCountersForHero(hero.id)
      setCounters(counterData)
      setAnalysisState('revealing')
    }, 1000)
  }

  // Reveal sequence: 3 → 2 → 1 → rest
  useEffect(() => {
    if (analysisState !== 'revealing') return
    
    const revealSequence = [3, 2, 1, 4, 5]
    let index = 0
    
    const interval = setInterval(() => {
      if (index < revealSequence.length) {
        setRevealedRanks(prev => [...prev, revealSequence[index]])
        index++
      } else {
        clearInterval(interval)
        setAnalysisState('complete')
      }
    }, 400)
    
    return () => clearInterval(interval)
  }, [analysisState])

  const handleReset = () => {
    setSelectedHero(null)
    setCounters([])
    setAnalysisState('idle')
    setRevealedRanks([])
  }

  // Get counters by rank
  const rank1 = counters.find(c => c.rank === 1)
  const rank2 = counters.find(c => c.rank === 2)
  const rank3 = counters.find(c => c.rank === 3)
  const remainingCounters = counters.filter(c => c.rank > 3)

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Target Hero Card */}
      {!selectedHero ? (
        <Card
          className={cn(
            'relative w-full max-w-md p-8 flex flex-col items-center gap-4 cursor-pointer',
            'border-dashed border-2 border-border hover:border-primary/50 transition-all',
            'bg-card hover:bg-muted/50'
          )}
          onClick={() => setSelectorOpen(true)}
        >
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center">
            <Target className="w-10 h-10 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-foreground mb-1">Select Enemy Hero</h3>
            <p className="text-sm text-muted-foreground">
              Click to choose an enemy hero to analyze
            </p>
          </div>
        </Card>
      ) : (
        <Card className="relative w-full max-w-md p-6 bg-card border-border">
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Change
            </Button>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-destructive">
              <Crosshair className="w-3.5 h-3.5" />
              Enemy Target Locked
            </div>
            
            <HeroPortrait
              hero={selectedHero}
              size="xl"
              showName
              showRole
              glow
              glowColor="bronze"
            />
          </div>
        </Card>
      )}

      {/* Analysis Loading State */}
      {analysisState === 'analyzing' && (
        <div className="flex flex-col items-center gap-3 py-8">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Analyzing counter picks...</p>
        </div>
      )}

      {/* Counter Results */}
      {(analysisState === 'revealing' || analysisState === 'complete') && counters.length > 0 && (
        <div className="w-full max-w-3xl space-y-8">
          {/* Section Header */}
          <div className="text-center">
            <h2 className="text-lg font-bold text-foreground mb-1">Counter Recommendations</h2>
            <p className="text-sm text-muted-foreground">
              Best picks against {selectedHero?.name}
            </p>
          </div>

          {/* Podium Layout: 3 Left, 1 Middle, 2 Right */}
          <div className="flex items-end justify-center gap-6 sm:gap-10">
            {/* Rank 3 - Left */}
            {rank3 && (
              <div
                className={cn(
                  'transition-all duration-500',
                  revealedRanks.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                )}
              >
                <CounterCard
                  counter={rank3}
                  isRevealing={revealedRanks.includes(3)}
                  delay={0}
                />
              </div>
            )}
            
            {/* Rank 1 - Middle (elevated) */}
            {rank1 && (
              <div
                className={cn(
                  'transition-all duration-500 -mt-6',
                  revealedRanks.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                )}
              >
                <CounterCard
                  counter={rank1}
                  isRevealing={revealedRanks.includes(1)}
                  delay={0}
                />
              </div>
            )}
            
            {/* Rank 2 - Right */}
            {rank2 && (
              <div
                className={cn(
                  'transition-all duration-500',
                  revealedRanks.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                )}
              >
                <CounterCard
                  counter={rank2}
                  isRevealing={revealedRanks.includes(2)}
                  delay={0}
                />
              </div>
            )}
          </div>

          {/* Remaining Counters - Grid below podium */}
          {remainingCounters.length > 0 && (
            <div className={cn(
              'space-y-4 transition-all duration-500',
              revealedRanks.includes(4) ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center">
                Other Strong Picks
              </h3>
              <div className="flex justify-center gap-8 sm:gap-12">
                {remainingCounters.map(counter => (
                  <CounterCard
                    key={counter.id}
                    counter={counter}
                    isRevealing={revealedRanks.includes(counter.rank)}
                    delay={0}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hero Selector Modal */}
      <HeroSelector
        open={selectorOpen}
        onOpenChange={setSelectorOpen}
        onSelectHero={handleSelectHero}
      />
    </div>
  )
}
