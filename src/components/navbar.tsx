'use client'

import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Crosshair, Handshake, Gamepad2, Database, BarChart3, Swords } from 'lucide-react'
import { LanguageToggle } from './language-toggle'

const navItems = [
  { key: 'counterAnalyzer', href: '/counters', icon: Crosshair },
  { key: 'synergyAnalyzer', href: '/synergies', icon: Handshake },
  { key: 'draftSimulator', href: '#', icon: Gamepad2, disabled: true },
  { key: 'heroDatabase', href: '#', icon: Database, disabled: true },
  { key: 'tierList', href: '#', icon: BarChart3, disabled: true },
]

export function Navbar() {
  const t = useTranslations('nav')
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Swords className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">
              {t('brand')}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon
              const active = item.href !== '#' && pathname.startsWith(item.href)

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    active && 'bg-primary/10 text-primary',
                    item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                    !active && !item.disabled && 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{t(item.key)}</span>
                </Link>
              )
            })}
          </nav>

          {/* Language Toggle */}
          <LanguageToggle />
        </div>
      </div>
    </header>
  )
}
