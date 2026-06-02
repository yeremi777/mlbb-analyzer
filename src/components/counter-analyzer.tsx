'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { Hero, CounterHero } from '@/lib/hero-data'
import { fetchHero, fetchHeroCounters, fetchHeroes } from '@/lib/analyzer-api'
import { HeroSelector } from './hero-selector'
import { HeroPortrait } from './hero-portrait'
import { CounterCard } from './counter-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Target, RotateCcw, Crosshair, Loader2 } from 'lucide-react'

type AnalysisState = 'idle' | 'analyzing' | 'revealing' | 'complete'
type HeroesState = 'loading' | 'ready' | 'error'

export function CounterAnalyzer() {
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [heroesState, setHeroesState] = useState<HeroesState>('loading')
  const [heroesError, setHeroesError] = useState<string | null>(null)
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null)
  const [counters, setCounters] = useState<CounterHero[]>([])
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle')
  const [revealedRanks, setRevealedRanks] = useState<number[]>([])

  useEffect(() => {
    let active = true;

    async function loadHeroes() {
      setHeroesState('loading')
      setHeroesError(null)

      try {
        const loadedHeroes = await fetchHeroes()

        if (!active) {
          return
        }

        setHeroes(loadedHeroes)
        setHeroesState('ready')
      } catch (error) {
        if (!active) {
          return
        }

        setHeroes([])
        setHeroesState('error')
        setHeroesError(error instanceof Error ? error.message : 'Failed to load heroes')
      }
    }

    loadHeroes()

    return () => {
      active = false
    }
  }, [])

  const handleSelectHero = async (hero: Hero) => {
    let targetHero = hero

    try {
      targetHero = await fetchHero(hero.id)
    } catch {
      targetHero = hero
    }

    setSelectedHero(targetHero)
    setAnalysisState('analyzing')
    setRevealedRanks([])
    setCounters([])

    try {
      const counterData = await fetchHeroCounters(targetHero.id)
      setCounters(counterData)
    } catch {
      setCounters([])
    } finally {
      setAnalysisState('revealing')
    }
  }

  // Reveal sequence: 3 → 2 → 1 → (4 & 5 together)
  useEffect(() => {
    if (analysisState !== 'revealing') return

    const revealSequence: number[][] = [[3], [2], [1], [4, 5]]
    let currentIndex = 0

    const interval = setInterval(() => {
      if (currentIndex < revealSequence.length) {
        const ranksToReveal = revealSequence[currentIndex]
        setRevealedRanks((prev) => {
          const newRanks = ranksToReveal.filter((r) => !prev.includes(r))
          if (newRanks.length > 0) {
            return [...prev, ...newRanks]
          }
          return prev
        })
        currentIndex++
      } else {
        clearInterval(interval)
        setAnalysisState('complete')
      }
    }, 800)

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
            'relative w-full max-w-md p-8 flex flex-col items-center gap-4',
            heroesState === 'ready' && 'cursor-pointer',
            'border-dashed border-2 border-border hover:border-primary/50 transition-all',
            'bg-card hover:bg-muted/50'
          )}
          onClick={() => {
            if (heroesState === 'ready') {
              setSelectorOpen(true)
            }
          }}
        >
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center">
            {heroesState === 'loading' ? (
              <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
            ) : (
              <Target className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-foreground mb-1">
              {heroesState === 'loading' ? 'Loading Heroes' : 'Select Enemy Hero'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {heroesState === 'error'
                ? heroesError ?? 'Analyzer API is unavailable'
                : heroesState === 'loading'
                  ? 'Fetching hero data from the analyzer API'
                  : 'Click to choose an enemy hero to analyze'}
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
          <div className="text-center mb-2">
            <h2 className="text-lg font-bold text-foreground mb-1">Counter Recommendations</h2>
            <p className="text-sm text-muted-foreground pb-1">
              Best picks against {selectedHero?.name}
            </p>
          </div>

          {/* Podium Layout: 3 Left, 1 Middle (elevated), 2 Right */}
          <div className="flex justify-center pt-4 sm:pt-6">
            <div className="flex items-end gap-2 sm:gap-4">
              {/* Rank 3 - Left */}
              {rank3 && (
                <div
                  className={cn(
                    'flex flex-col items-center transition-all duration-500',
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
                    'flex flex-col items-center transition-all duration-500 -translate-y-6 sm:-translate-y-8',
                    revealedRanks.includes(1) ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
                    'flex flex-col items-center transition-all duration-500',
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

      {analysisState === 'complete' && selectedHero && counters.length === 0 && (
        <Card className="w-full max-w-md border-border bg-card p-6 text-center">
          <h2 className="text-base font-bold text-foreground">No counters available yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The analyzer API returned no counter matchups for {selectedHero.name} yet.
          </p>
        </Card>
      )}

      {/* Hero Selector Modal */}
      <HeroSelector
        open={selectorOpen}
        heroes={heroes}
        onOpenChange={setSelectorOpen}
        onSelectHero={handleSelectHero}
      />
    </div>
  )
}
