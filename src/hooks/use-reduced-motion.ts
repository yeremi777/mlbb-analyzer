'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(callback: () => void): () => void {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

/**
 * Tracks the user's `prefers-reduced-motion` setting. SSR-safe (server snapshot
 * is `false`) and reactive to changes. Use it to skip non-essential motion such
 * as the score count-up, the staged reveal, and smooth scrolling.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
}
