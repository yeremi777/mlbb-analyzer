'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { Hero, CounterHero } from '@/lib/hero-data'
import {
  analyzeCounterDetail,
  analyzeCounterScores,
  fetchHero,
  fetchHeroCounters,
  fetchHeroes,
  type AnalyzeDetailResponse,
} from '@/lib/analyzer-api'
import { HeroSelector } from './hero-selector'
import { HeroPortrait } from './hero-portrait'
import { CounterCard } from './counter-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Target, RotateCcw, Crosshair, Loader2 } from 'lucide-react'

type AnalysisState = 'idle' | 'analyzing' | 'revealing' | 'complete'
type HeroesState = 'loading' | 'ready' | 'error'
type DetailState = 'idle' | 'loading' | 'ready' | 'error'

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

export function CounterAnalyzer() {
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [heroesState, setHeroesState] = useState<HeroesState>('loading')
  const [heroesError, setHeroesError] = useState<string | null>(null)
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null)
  const [counters, setCounters] = useState<CounterHero[]>([])
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle')
  const [scoresReady, setScoresReady] = useState(false)
  const [revealedRanks, setRevealedRanks] = useState<number[]>([])
  const [displayScores, setDisplayScores] = useState<Record<string, number>>({})
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [activeCounterId, setActiveCounterId] = useState<string | null>(null)
  const [detailState, setDetailState] = useState<DetailState>('idle')
  const [detail, setDetail] = useState<AnalyzeDetailResponse | null>(null)
  const [detailError, setDetailError] = useState<string | null>(null)
  const scoreTickerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const finalScoreAnimationRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const displayScoresRef = useRef<Record<string, number>>({})
  const resultsSectionRef = useRef<HTMLDivElement | null>(null)
  const detailCardRef = useRef<HTMLDivElement | null>(null)
  const pendingDetailFocusRef = useRef<string | null>(null)
  const hasFocusedResultsRef = useRef(false)

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

  useEffect(() => {
    displayScoresRef.current = displayScores
  }, [displayScores])

  useEffect(() => {
    if (
      !scoresReady ||
      (analysisState !== 'revealing' && analysisState !== 'complete') ||
      counters.length === 0 ||
      analysisError ||
      hasFocusedResultsRef.current
    ) {
      return
    }

    const frameId = requestAnimationFrame(() => {
      const resultsSection = resultsSectionRef.current

      if (!resultsSection) {
        return
      }

      hasFocusedResultsRef.current = true
      resultsSection.focus({ preventScroll: true })
      resultsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [analysisError, analysisState, counters.length, scoresReady])

  useEffect(() => {
    if (!activeCounterId || pendingDetailFocusRef.current !== activeCounterId) {
      return
    }

    const frameId = requestAnimationFrame(() => {
      const detailCard = detailCardRef.current

      if (!detailCard) {
        return
      }

      pendingDetailFocusRef.current = null
      detailCard.focus({ preventScroll: true })
      detailCard.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [activeCounterId, detailState])

  const stopScoreTicker = useCallback(() => {
    if (scoreTickerRef.current) {
      clearInterval(scoreTickerRef.current)
      scoreTickerRef.current = null
    }
  }, [])

  const stopFinalScoreAnimation = useCallback(() => {
    if (finalScoreAnimationRef.current) {
      clearInterval(finalScoreAnimationRef.current)
      finalScoreAnimationRef.current = null
    }
  }, [])

  const animateScoresToFinal = useCallback((rankedCounters: CounterHero[]) => {
    stopScoreTicker()
    stopFinalScoreAnimation()

    const startScores = rankedCounters.reduce<Record<string, number>>((scores, counter) => {
      scores[counter.id] = displayScoresRef.current[counter.id] ?? 0
      return scores
    }, {})
    const finalScores = rankedCounters.reduce<Record<string, number>>((scores, counter) => {
      scores[counter.id] = counter.score
      return scores
    }, {})
    const startedAt = Date.now()
    const duration = 700

    finalScoreAnimationRef.current = setInterval(() => {
      const progress = Math.min((Date.now() - startedAt) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setDisplayScores(
        Object.fromEntries(
          rankedCounters.map((counter) => {
            const start = startScores[counter.id] ?? 0
            const end = finalScores[counter.id] ?? 0

            return [counter.id, Math.round(start + (end - start) * eased)]
          }),
        ),
      )

      if (progress >= 1) {
        stopFinalScoreAnimation()
      }
    }, 50)
  }, [stopFinalScoreAnimation, stopScoreTicker])

  const handleSelectHero = async (hero: Hero) => {
    let targetHero = hero

    try {
      targetHero = await fetchHero(hero.id)
    } catch {
      targetHero = hero
    }

    setSelectedHero(targetHero)
    setAnalysisState('analyzing')
    setScoresReady(false)
    setRevealedRanks([])
    setCounters([])
    setDisplayScores({})
    setAnalysisError(null)
    setActiveCounterId(null)
    setDetailState('idle')
    setDetail(null)
    setDetailError(null)
    hasFocusedResultsRef.current = false
    pendingDetailFocusRef.current = null
    stopScoreTicker()
    stopFinalScoreAnimation()

    try {
      const counterData = await fetchHeroCounters(targetHero.id)
      setCounters(counterData)
      setDisplayScores(
        Object.fromEntries(counterData.map((counter) => [counter.id, 0])),
      )

      try {
        const scoreData = await analyzeCounterScores(targetHero.id)
        const scoreByHeroId = new Map(
          scoreData.recommendations.map((recommendation) => [
            recommendation.counterHeroId,
            recommendation,
          ]),
        )

        const missingScore = counterData.find((counter) => !scoreByHeroId.has(counter.id))

        if (missingScore) {
          throw new Error(`AI score response omitted ${missingScore.name}`)
        }

        const rankedCounters = counterData
          .map((counter) => {
            const recommendation = scoreByHeroId.get(counter.id)!

            return {
              ...counter,
              rank: recommendation.rank,
              score: recommendation.score,
              confidence: recommendation.confidence,
            }
          })
          .sort((a, b) => a.rank - b.rank)

        setCounters(rankedCounters)
        setDisplayScores(
          Object.fromEntries(
            rankedCounters.map((counter) => [
              counter.id,
              counter.rank > 3 ? counter.score : 0,
            ]),
          ),
        )
        setScoresReady(true)
        setAnalysisState('revealing')
      } catch (error) {
        stopScoreTicker()
        stopFinalScoreAnimation()
        setAnalysisError(getErrorMessage(error, 'Failed to analyze counter scores'))
        setDisplayScores(
          Object.fromEntries(counterData.map((counter) => [counter.id, 0])),
        )
        setScoresReady(false)
        setAnalysisState('complete')
      }
    } catch (error) {
      setCounters([])
      setAnalysisError(getErrorMessage(error, 'Failed to load counter matchups'))
      setScoresReady(false)
      setAnalysisState('complete')
    }
  }

  // Reveal sequence: 3 → 2 → 1 → (4 & 5 together)
  useEffect(() => {
    if (analysisState !== 'revealing') return

    const revealSequence: number[][] = [[3], [2], [1], [4, 5]]
    const scoreAnimationDelay = 500
    const scoreAnimationTimeouts: Array<ReturnType<typeof setTimeout>> = []
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
        const countersToAnimate = counters.filter((counter) =>
          counter.rank <= 3 && ranksToReveal.includes(counter.rank),
        )

        if (countersToAnimate.length > 0) {
          scoreAnimationTimeouts.push(
            setTimeout(() => {
              animateScoresToFinal(countersToAnimate)
            }, scoreAnimationDelay),
          )
        }

        currentIndex++
      } else {
        clearInterval(interval)
        setAnalysisState('complete')
      }
    }, 800)

    return () => {
      clearInterval(interval)
      scoreAnimationTimeouts.forEach(clearTimeout)
    }
  }, [analysisState, animateScoresToFinal, counters])

  const handleReset = () => {
    stopScoreTicker()
    stopFinalScoreAnimation()
    setSelectedHero(null)
    setCounters([])
    setAnalysisState('idle')
    setScoresReady(false)
    setRevealedRanks([])
    setDisplayScores({})
    setAnalysisError(null)
    setActiveCounterId(null)
    setDetailState('idle')
    setDetail(null)
    setDetailError(null)
    hasFocusedResultsRef.current = false
    pendingDetailFocusRef.current = null
  }

  const handleOpenCounter = async (counter: CounterHero) => {
    if (!selectedHero) {
      return
    }

    pendingDetailFocusRef.current = counter.id
    setActiveCounterId(counter.id)
    setDetailState('loading')
    setDetail(null)
    setDetailError(null)

    try {
      const detailData = await analyzeCounterDetail(selectedHero.id, counter.id)
      setDetail(detailData)
      setDetailState('ready')
    } catch (error) {
      setDetailState('error')
      setDetailError(getErrorMessage(error, 'Failed to analyze counter detail'))
    }
  }

  // Get counters by rank
  const rank1 = counters.find(c => c.rank === 1)
  const rank2 = counters.find(c => c.rank === 2)
  const rank3 = counters.find(c => c.rank === 3)
  const remainingCounters = counters.filter(c => c.rank > 3)
  const activeCounter = counters.find((counter) => counter.id === activeCounterId) ?? null
  const isCounterVisible = (rank: number) =>
    revealedRanks.includes(rank)

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

      {analysisError && (
        <Card className="w-full max-w-2xl border-destructive/40 bg-destructive/10 p-4 text-center">
          <h2 className="text-sm font-bold text-destructive">Analyzer API Error</h2>
          <p className="mt-1 text-sm text-muted-foreground">{analysisError}</p>
        </Card>
      )}

      {/* Counter Results */}
      {scoresReady && (analysisState === 'revealing' || analysisState === 'complete') && counters.length > 0 && (
        <div
          ref={resultsSectionRef}
          tabIndex={-1}
          className="w-full max-w-3xl scroll-mt-8 space-y-8 outline-none"
        >
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
                    isCounterVisible(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                  )}
                >
                  <CounterCard
                    counter={rank3}
                    displayScore={displayScores[rank3.id]}
                    isRevealing={isCounterVisible(3)}
                    delay={0}
                    selected={activeCounterId === rank3.id}
                    onClick={() => handleOpenCounter(rank3)}
                  />
                </div>
              )}

              {/* Rank 1 - Middle (elevated) */}
              {rank1 && (
                <div
                  className={cn(
                    'flex flex-col items-center transition-all duration-500 -translate-y-6 sm:-translate-y-8',
                    isCounterVisible(1) ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  )}
                >
                  <CounterCard
                    counter={rank1}
                    displayScore={displayScores[rank1.id]}
                    isRevealing={isCounterVisible(1)}
                    delay={0}
                    selected={activeCounterId === rank1.id}
                    onClick={() => handleOpenCounter(rank1)}
                  />
                </div>
              )}

              {/* Rank 2 - Right */}
              {rank2 && (
                <div
                  className={cn(
                    'flex flex-col items-center transition-all duration-500',
                    isCounterVisible(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                  )}
                >
                  <CounterCard
                    counter={rank2}
                    displayScore={displayScores[rank2.id]}
                    isRevealing={isCounterVisible(2)}
                    delay={0}
                    selected={activeCounterId === rank2.id}
                    onClick={() => handleOpenCounter(rank2)}
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
                    displayScore={displayScores[counter.id]}
                    isRevealing={isCounterVisible(counter.rank)}
                    delay={0}
                    selected={activeCounterId === counter.id}
                    onClick={() => handleOpenCounter(counter)}
                  />
                ))}
              </div>
            </div>
          )}

          {activeCounter && (
            <Card
              ref={detailCardRef}
              tabIndex={-1}
              aria-labelledby="counter-analysis-title"
              className="scroll-mt-8 border-border bg-card p-5 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 id="counter-analysis-title" className="text-base font-bold text-foreground">
                    {activeCounter.name} vs {selectedHero?.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Score {Math.round(displayScores[activeCounter.id] ?? activeCounter.score)}
                    {typeof activeCounter.confidence === 'number' && ` / ${activeCounter.confidence}% confidence`}
                  </p>
                </div>
                {detailState === 'loading' && (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                )}
              </div>

              {detailState === 'error' && (
                <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-muted-foreground">
                  {detailError}
                </p>
              )}

              {detailState === 'ready' && detail && (
                <div className="mt-4 space-y-4">
                  <p className="text-sm leading-6 text-foreground">{detail.summary}</p>

                  <DetailList title="Strengths" items={detail.strengths} />
                  <DetailList title="Conditions" items={detail.conditions} />
                  <DetailList title="Failure Cases" items={detail.failureCases} />
                </div>
              )}
            </Card>
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

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) {
    return null
  }

  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {title}
      </h4>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-md bg-muted/40 px-3 py-2 text-sm text-foreground">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
