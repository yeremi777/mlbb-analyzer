'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Crosshair, Gamepad2, Database, BarChart3 } from 'lucide-react'

const navItems = [
  { label: 'Counter Analyzer', href: '/', icon: Crosshair, active: true },
  { label: 'Draft Simulator', href: '#', icon: Gamepad2, disabled: true },
  { label: 'Hero Database', href: '#', icon: Database, disabled: true },
  { label: 'Tier List', href: '#', icon: BarChart3, disabled: true },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Crosshair className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">
              MLBB Analyzer
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    item.active && 'bg-primary/10 text-primary',
                    item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                    !item.active && !item.disabled && 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
