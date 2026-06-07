'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import type { Hero, SynergyHero } from '@/lib/hero-data'
import {
  analyzeSynergyDetail,
  analyzeSynergyScores,
  AnalyzerError,
  fetchHero,
  fetchHeroes,
  fetchHeroSynergies,
  type AnalyzeSynergyDetailResponse,
} from '@/lib/analyzer-api'
import { errorMessageKey } from '@/i18n/error-messages'
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion'
import { HeroSelector } from './hero-selector'
import { HeroPortrait } from './hero-portrait'
import { CounterCard } from './counter-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Handshake, Search, Users, Loader2 } from 'lucide-react'

type AnalysisState = 'idle' | 'analyzing' | 'revealing' | 'complete'
type HeroesState = 'loading' | 'ready' | 'error'
type DetailState = 'idle' | 'loading' | 'ready' | 'error'

export function SynergyAnalyzer() {
  const t = useTranslations('synergyAnalyzer')
  const tErrors = useTranslations('errors')
  const locale = useLocale()
  const prefersReducedMotion = usePrefersReducedMotion()

  const localizeError = useCallback(
    (error: unknown): string => {
      if (error instanceof AnalyzerError) {
        return tErrors(errorMessageKey(error.code, error.status))
      }

      return tErrors('unknown')
    },
    [tErrors],
  )

  const [selectorOpen, setSelectorOpen] = useState(false)
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [heroesState, setHeroesState] = useState<HeroesState>('loading')
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null)
  const [synergies, setSynergies] = useState<SynergyHero[]>([])
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle')
  const [scoresReady, setScoresReady] = useState(false)
  const [revealedRanks, setRevealedRanks] = useState<number[]>([])
  const [displayScores, setDisplayScores] = useState<Record<string, number>>({})
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [activeSynergyId, setActiveSynergyId] = useState<string | null>(null)
  const [detailState, setDetailState] = useState<DetailState>('idle')
  const [detail, setDetail] = useState<AnalyzeSynergyDetailResponse | null>(null)
  const [detailError, setDetailError] = useState<string | null>(null)
  const scoreTickerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const finalScoreAnimationRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const displayScoresRef = useRef<Record<string, number>>({})
  const resultsSectionRef = useRef<HTMLDivElement | null>(null)
  const detailCardRef = useRef<HTMLDivElement | null>(null)
  const pendingDetailFocusRef = useRef<string | null>(null)
  const analysisRequestRef = useRef(0)
  const hasFocusedResultsRef = useRef(false)

  useEffect(() => {
    let active = true

    async function loadHeroes() {
      setHeroesState('loading')

      try {
        const loadedHeroes = await fetchHeroes()

        if (!active) {
          return
        }

        setHeroes(loadedHeroes)
        setHeroesState('ready')
      } catch {
        if (!active) {
          return
        }

        setHeroes([])
        setHeroesState('error')
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
      synergies.length === 0 ||
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
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    })

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [analysisError, analysisState, prefersReducedMotion, scoresReady, synergies.length])

  useEffect(() => {
    if (!activeSynergyId || pendingDetailFocusRef.current !== activeSynergyId) {
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
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    })

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [activeSynergyId, detailState, prefersReducedMotion])

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

  const animateScoresToFinal = useCallback((rankedSynergies: SynergyHero[]) => {
    stopScoreTicker()
    stopFinalScoreAnimation()

    const startScores = rankedSynergies.reduce<Record<string, number>>((scores, synergy) => {
      scores[synergy.id] = displayScoresRef.current[synergy.id] ?? 0
      return scores
    }, {})
    const finalScores = rankedSynergies.reduce<Record<string, number>>((scores, synergy) => {
      scores[synergy.id] = synergy.score
      return scores
    }, {})
    const startedAt = Date.now()
    const duration = 700

    finalScoreAnimationRef.current = setInterval(() => {
      const progress = Math.min((Date.now() - startedAt) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setDisplayScores(
        Object.fromEntries(
          rankedSynergies.map((synergy) => {
            const start = startScores[synergy.id] ?? 0
            const end = finalScores[synergy.id] ?? 0

            return [synergy.id, Math.round(start + (end - start) * eased)]
          }),
        ),
      )

      if (progress >= 1) {
        stopFinalScoreAnimation()
      }
    }, 50)
  }, [stopFinalScoreAnimation, stopScoreTicker])

  const handleSelectHero = async (hero: Hero) => {
    const requestId = analysisRequestRef.current + 1
    analysisRequestRef.current = requestId
    const isActiveRequest = () => analysisRequestRef.current === requestId
    let anchorHero = hero

    try {
      anchorHero = await fetchHero(hero.id)
    } catch {
      anchorHero = hero
    }

    if (!isActiveRequest()) {
      return
    }

    setSelectedHero(anchorHero)
    setAnalysisState('analyzing')
    setScoresReady(false)
    setRevealedRanks([])
    setSynergies([])
    setDisplayScores({})
    setAnalysisError(null)
    setActiveSynergyId(null)
    setDetailState('idle')
    setDetail(null)
    setDetailError(null)
    hasFocusedResultsRef.current = false
    pendingDetailFocusRef.current = null
    stopScoreTicker()
    stopFinalScoreAnimation()

    try {
      const synergyData = await fetchHeroSynergies(anchorHero.id)

      if (!isActiveRequest()) {
        return
      }

      setSynergies(synergyData)
      setDisplayScores(
        Object.fromEntries(synergyData.map((synergy) => [synergy.id, 0])),
      )

      try {
        const scoreData = await analyzeSynergyScores(anchorHero.id, locale)

        if (!isActiveRequest()) {
          return
        }

        const scoreByHeroId = new Map(
          scoreData.recommendations.map((recommendation) => [
            recommendation.synergyHeroId,
            recommendation,
          ]),
        )

        const missingScore = synergyData.find((synergy) => !scoreByHeroId.has(synergy.id))

        if (missingScore) {
          throw new Error(`AI synergy score response omitted ${missingScore.name}`)
        }

        const rankedSynergies = synergyData
          .map((synergy) => {
            const recommendation = scoreByHeroId.get(synergy.id)!

            return {
              ...synergy,
              rank: recommendation.rank,
              score: recommendation.score,
              confidence: recommendation.confidence,
            }
          })
          .sort((a, b) => a.rank - b.rank)

        setSynergies(rankedSynergies)

        if (prefersReducedMotion) {
          setDisplayScores(
            Object.fromEntries(rankedSynergies.map((synergy) => [synergy.id, synergy.score])),
          )
          setRevealedRanks(rankedSynergies.map((synergy) => synergy.rank))
          setScoresReady(true)
          setAnalysisState('complete')
        } else {
          setDisplayScores(
            Object.fromEntries(
              rankedSynergies.map((synergy) => [
                synergy.id,
                synergy.rank > 3 ? synergy.score : 0,
              ]),
            ),
          )
          setScoresReady(true)
          setAnalysisState('revealing')
        }
      } catch (error) {
        if (!isActiveRequest()) {
          return
        }

        stopScoreTicker()
        stopFinalScoreAnimation()
        setAnalysisError(localizeError(error))
        setDisplayScores(
          Object.fromEntries(synergyData.map((synergy) => [synergy.id, 0])),
        )
        setScoresReady(false)
        setAnalysisState('complete')
      }
    } catch (error) {
      if (!isActiveRequest()) {
        return
      }

      setSynergies([])
      setAnalysisError(localizeError(error))
      setScoresReady(false)
      setAnalysisState('complete')
    }
  }

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
          const newRanks = ranksToReveal.filter((rank) => !prev.includes(rank))
          if (newRanks.length > 0) {
            return [...prev, ...newRanks]
          }
          return prev
        })
        const synergiesToAnimate = synergies.filter((synergy) =>
          synergy.rank <= 3 && ranksToReveal.includes(synergy.rank),
        )

        if (synergiesToAnimate.length > 0) {
          scoreAnimationTimeouts.push(
            setTimeout(() => {
              animateScoresToFinal(synergiesToAnimate)
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
  }, [analysisState, animateScoresToFinal, synergies])

  const detailRequestRef = useRef(0)
  const detailCacheRef = useRef<Map<string, AnalyzeSynergyDetailResponse>>(new Map())

  const loadDetail = useCallback(
    async (synergyId: string, detailLocale: string) => {
      if (!selectedHero) {
        return
      }

      const cacheKey = `${selectedHero.id}:${synergyId}:${detailLocale}`
      const requestId = detailRequestRef.current + 1
      detailRequestRef.current = requestId

      const cached = detailCacheRef.current.get(cacheKey)
      if (cached) {
        setDetail(cached)
        setDetailError(null)
        setDetailState('ready')
        return
      }

      setDetailState('loading')
      setDetailError(null)

      try {
        const detailData = await analyzeSynergyDetail(selectedHero.id, synergyId, detailLocale)

        if (detailRequestRef.current !== requestId) {
          return
        }

        detailCacheRef.current.set(cacheKey, detailData)
        setDetail(detailData)
        setDetailState('ready')
      } catch (error) {
        if (detailRequestRef.current !== requestId) {
          return
        }

        setDetailState('error')
        setDetailError(localizeError(error))
      }
    },
    [selectedHero, localizeError],
  )

  const handleOpenSynergy = (synergy: SynergyHero) => {
    if (!selectedHero) {
      return
    }

    pendingDetailFocusRef.current = synergy.id
    setActiveSynergyId(synergy.id)
    setDetail(null)
    void loadDetail(synergy.id, locale)
  }

  const initialLocaleRef = useRef(locale)
  useEffect(() => {
    if (locale === initialLocaleRef.current) {
      return
    }
    initialLocaleRef.current = locale

    if (activeSynergyId) {
      void loadDetail(activeSynergyId, locale)
    }
  }, [locale, activeSynergyId, loadDetail])

  const rank1 = synergies.find((synergy) => synergy.rank === 1)
  const rank2 = synergies.find((synergy) => synergy.rank === 2)
  const rank3 = synergies.find((synergy) => synergy.rank === 3)
  const remainingSynergies = synergies.filter((synergy) => synergy.rank > 3)
  const activeSynergy = synergies.find((synergy) => synergy.id === activeSynergyId) ?? null
  const isSynergyVisible = (rank: number) => revealedRanks.includes(rank)

  return (
    <div className="flex flex-col items-center gap-8">
      {!selectedHero ? (
        <Card
          className={cn(
            'relative w-full max-w-md p-8 flex flex-col items-center gap-4',
            heroesState === 'ready' && 'cursor-pointer',
            'border-dashed border-2 border-border hover:border-primary/50 transition-all',
            'bg-card hover:bg-muted/50',
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
              <Handshake className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-foreground mb-1">
              {heroesState === 'loading' ? t('loadingHeroes') : t('selectAnchorHero')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {heroesState === 'error'
                ? tErrors('unavailable')
                : heroesState === 'loading'
                  ? t('fetchingHeroData')
                  : t('clickToChoose')}
            </p>
          </div>
        </Card>
      ) : (
        <Card className="relative w-full max-w-md p-6 bg-card border-border">
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectorOpen(true)}
              disabled={heroesState !== 'ready'}
              className="text-muted-foreground hover:text-foreground"
            >
              <Search className="w-4 h-4 mr-1" />
              {t('change')}
            </Button>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Users className="w-3.5 h-3.5" />
              {t('anchorHeroLocked')}
            </div>

            <HeroPortrait
              hero={selectedHero}
              size="xl"
              showName
              showRole
              glow
              glowColor="gold"
            />
          </div>
        </Card>
      )}

      {analysisState === 'analyzing' && (
        <div className="flex flex-col items-center gap-3 py-8">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">{t('analyzingSynergyPicks')}</p>
        </div>
      )}

      {analysisError && (
        <Card className="w-full max-w-2xl border-destructive/40 bg-destructive/10 p-4 text-center">
          <h2 className="text-sm font-bold text-destructive">{t('analyzerApiError')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{analysisError}</p>
        </Card>
      )}

      {scoresReady && (analysisState === 'revealing' || analysisState === 'complete') && synergies.length > 0 && (
        <div
          ref={resultsSectionRef}
          tabIndex={-1}
          className="w-full max-w-3xl scroll-mt-8 space-y-8 outline-none"
        >
          <div className="text-center mb-2">
            <h2 className="text-lg font-bold text-foreground mb-1">{t('synergyRecommendations')}</h2>
            <p className="text-sm text-muted-foreground pb-1">
              {t('bestAlliesWith', { name: selectedHero?.name ?? '' })}
            </p>
          </div>

          <div className="flex justify-center pt-4 sm:pt-6">
            <div className="flex items-end gap-2 sm:gap-4">
              {rank3 && (
                <div
                  className={cn(
                    'flex flex-col items-center transition-all duration-500',
                    isSynergyVisible(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
                  )}
                >
                  <CounterCard
                    counter={rank3}
                    displayScore={displayScores[rank3.id]}
                    isRevealing={isSynergyVisible(3)}
                    delay={0}
                    selected={activeSynergyId === rank3.id}
                    onClick={() => handleOpenSynergy(rank3)}
                  />
                </div>
              )}

              {rank1 && (
                <div
                  className={cn(
                    'flex flex-col items-center transition-all duration-500 -translate-y-6 sm:-translate-y-8',
                    isSynergyVisible(1) ? 'opacity-100' : 'opacity-0 pointer-events-none',
                  )}
                >
                  <CounterCard
                    counter={rank1}
                    displayScore={displayScores[rank1.id]}
                    isRevealing={isSynergyVisible(1)}
                    delay={0}
                    selected={activeSynergyId === rank1.id}
                    onClick={() => handleOpenSynergy(rank1)}
                  />
                </div>
              )}

              {rank2 && (
                <div
                  className={cn(
                    'flex flex-col items-center transition-all duration-500',
                    isSynergyVisible(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
                  )}
                >
                  <CounterCard
                    counter={rank2}
                    displayScore={displayScores[rank2.id]}
                    isRevealing={isSynergyVisible(2)}
                    delay={0}
                    selected={activeSynergyId === rank2.id}
                    onClick={() => handleOpenSynergy(rank2)}
                  />
                </div>
              )}
            </div>
          </div>

          {remainingSynergies.length > 0 && (
            <div className={cn(
              'space-y-4 transition-all duration-500',
              revealedRanks.includes(4) ? 'opacity-100' : 'opacity-0 pointer-events-none',
            )}>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center">
                {t('otherSynergyPicks')}
              </h3>
              <div className="flex justify-center gap-8 sm:gap-12">
                {remainingSynergies.map((synergy) => (
                  <CounterCard
                    key={synergy.id}
                    counter={synergy}
                    displayScore={displayScores[synergy.id]}
                    isRevealing={isSynergyVisible(synergy.rank)}
                    delay={0}
                    selected={activeSynergyId === synergy.id}
                    onClick={() => handleOpenSynergy(synergy)}
                  />
                ))}
              </div>
            </div>
          )}

          {activeSynergy && (
            <Card
              ref={detailCardRef}
              tabIndex={-1}
              aria-labelledby="synergy-analysis-title"
              className="scroll-mt-8 border-border bg-card p-5 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 id="synergy-analysis-title" className="text-base font-bold text-foreground">
                    {t('matchupTitle', { anchor: selectedHero?.name ?? '', synergy: activeSynergy.name })}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {typeof activeSynergy.confidence === 'number'
                      ? t('scoreWithConfidence', {
                          score: Math.round(displayScores[activeSynergy.id] ?? activeSynergy.score),
                          confidence: activeSynergy.confidence,
                        })
                      : t('scoreLine', {
                          score: Math.round(displayScores[activeSynergy.id] ?? activeSynergy.score),
                        })}
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

                  <DetailList title={t('strengths')} items={detail.strengths} />
                  <DetailList title={t('conditions')} items={detail.conditions} />
                  <DetailList title={t('failureCases')} items={detail.failureCases} />
                </div>
              )}
            </Card>
          )}
        </div>
      )}

      {analysisState === 'complete' && selectedHero && synergies.length === 0 && (
        <Card className="w-full max-w-md border-border bg-card p-6 text-center">
          <h2 className="text-base font-bold text-foreground">{t('noSynergiesTitle')}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('noSynergiesBody', { name: selectedHero.name })}
          </p>
        </Card>
      )}

      <HeroSelector
        open={selectorOpen}
        heroes={heroes}
        title={t('selectorTitle')}
        searchPlaceholder={t('searchPlaceholder')}
        noHeroesFound={t('noHeroesFound')}
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
