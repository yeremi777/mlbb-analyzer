'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search } from 'lucide-react'
import { HERO_ROLES, type Hero, type HeroRole } from '@/lib/hero-data'
import { HeroPortrait } from './hero-portrait'

interface HeroSelectorProps {
  open: boolean
  heroes: Hero[]
  title?: string
  searchPlaceholder?: string
  noHeroesFound?: string
  onOpenChange: (open: boolean) => void
  onSelectHero: (hero: Hero) => void
}

export function HeroSelector({
  open,
  heroes,
  title,
  searchPlaceholder,
  noHeroesFound,
  onOpenChange,
  onSelectHero,
}: HeroSelectorProps) {
  const t = useTranslations('heroSelector')
  const tRoles = useTranslations('roles')
  const [search, setSearch] = useState('')
  const [selectedRole, setSelectedRole] = useState<HeroRole | 'All'>('All')
  
  const filteredHeroes = useMemo(() => {
    return heroes.filter(hero => {
      const matchesSearch = hero.name.toLowerCase().includes(search.toLowerCase())
      const matchesRole = selectedRole === 'All' || hero.role === selectedRole
      return matchesSearch && matchesRole
    })
  }, [heroes, search, selectedRole])

  const handleSelectHero = (hero: Hero) => {
    onSelectHero(hero)
    onOpenChange(false)
    setSearch('')
    setSelectedRole('All')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {title ?? t('title')}
          </DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder ?? t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Role Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedRole === 'All' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setSelectedRole('All')}
            className={selectedRole === 'All' ? 'bg-primary text-primary-foreground' : ''}
          >
            {t('all')}
          </Button>
          {HERO_ROLES.map(role => (
            <Button
              key={role}
              variant={selectedRole === role ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setSelectedRole(role)}
              className={selectedRole === role ? 'bg-primary text-primary-foreground' : ''}
            >
              {tRoles(role.toLowerCase())}
            </Button>
          ))}
        </div>

        {/* Hero Grid - Clean circular portraits without card borders */}
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-4">
            {filteredHeroes.map(hero => (
              <button
                key={hero.id}
                onClick={() => handleSelectHero(hero)}
                className="group flex flex-col items-center gap-1.5 transition-transform hover:scale-105"
              >
                <HeroPortrait
                  hero={hero}
                  size="md"
                  className="group-hover:ring-2 group-hover:ring-primary group-hover:ring-offset-2 group-hover:ring-offset-background transition-all"
                />
                <span className="text-[10px] text-muted-foreground group-hover:text-foreground truncate w-full text-center leading-tight">
                  {hero.name}
                </span>
              </button>
            ))}
          </div>
          {filteredHeroes.length === 0 && (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              {noHeroesFound ?? t('noHeroesFound')}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
