'use client'

import { useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { locales, type Locale } from '@/i18n/config'
import { setUserLocale } from '@/i18n/locale'

export function LanguageToggle() {
  const t = useTranslations('language')
  const activeLocale = useLocale()
  const [isPending, startTransition] = useTransition()

  const onSelect = (locale: Locale) => {
    if (locale === activeLocale) {
      return
    }

    // Setting the cookie in a server action triggers Next.js to re-render the
    // server tree, so the provider picks up the new locale + messages.
    startTransition(() => {
      setUserLocale(locale)
    })
  }

  return (
    <div
      role="group"
      aria-label={t('label')}
      className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5"
    >
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => onSelect(locale)}
          disabled={isPending}
          aria-pressed={locale === activeLocale}
          className={cn(
            'rounded-md px-2 py-1 text-xs font-semibold uppercase transition-colors disabled:opacity-60',
            locale === activeLocale
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {t(locale)}
        </button>
      ))}
    </div>
  )
}
