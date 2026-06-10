import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  ChevronRight,
  GitBranch,
  Handshake,
  Layers3,
  Package,
  Shield,
  Sparkles,
  Swords,
  Target,
} from 'lucide-react'

export default async function HomePage() {
  const t = await getTranslations('landing')

  const features = [
    {
      icon: Swords,
      title: t('features.counter.title'),
      body: t('features.counter.body'),
      href: '/counters',
      cta: t('features.counter.cta'),
      muted: false,
    },
    {
      icon: Handshake,
      title: t('features.synergy.title'),
      body: t('features.synergy.body'),
      href: '/synergies',
      cta: t('features.synergy.cta'),
      muted: false,
    },
    {
      icon: Layers3,
      title: t('features.draft.title'),
      body: t('features.draft.body'),
      href: '#future-direction',
      cta: t('features.draft.cta'),
      muted: true,
    },
  ]

  const benefits = [
    {
      icon: Target,
      title: t('benefits.threats.title'),
      body: t('benefits.threats.body'),
    },
    {
      icon: Shield,
      title: t('benefits.saferPicks.title'),
      body: t('benefits.saferPicks.body'),
    },
    {
      icon: Handshake,
      title: t('benefits.composition.title'),
      body: t('benefits.composition.body'),
    },
    {
      icon: BookOpen,
      title: t('benefits.decisions.title'),
      body: t('benefits.decisions.body'),
    },
  ]

  const roadmap = [
    {
      icon: Swords,
      title: t('roadmap.draft.title'),
      body: t('roadmap.draft.body'),
    },
    {
      icon: Shield,
      title: t('roadmap.roles.title'),
      body: t('roadmap.roles.body'),
    },
    {
      icon: Package,
      title: t('roadmap.items.title'),
      body: t('roadmap.items.body'),
    },
    {
      icon: GitBranch,
      title: t('roadmap.patch.title'),
      body: t('roadmap.patch.body'),
    },
    {
      icon: Sparkles,
      title: t('roadmap.explanations.title'),
      body: t('roadmap.explanations.body'),
    },
  ]

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute left-1/2 top-0 -z-10 h-[34rem] w-[54rem] -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-background to-transparent" />

          <div className="container mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-7xl items-center px-4 py-16 sm:py-20">
            <div className="mx-auto max-w-5xl text-center">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="size-3.5" />
                {t('eyebrow')}
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl [font-family:var(--font-display)]">
                {t('hero.titleLead')}{' '}
                <span className="text-primary">{t('hero.titleAccent')}</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {t('hero.subtitle')}
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-md px-6 text-sm font-semibold">
                  <Link href="/counters">
                    <Swords className="size-4" />
                    {t('hero.primaryCta')}
                    <ChevronRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 rounded-md px-6 text-sm font-semibold">
                  <Link href="/synergies">
                    <Handshake className="size-4" />
                    {t('hero.secondaryCta')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="container mx-auto max-w-7xl px-4 py-16 sm:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl [font-family:var(--font-display)]">
                {t('features.title')}
              </h2>
              <p className="mt-3 text-muted-foreground">
                {t('features.subtitle')}
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {features.map((item) => {
                const Icon = item.icon

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={item.muted
                      ? 'group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:bg-muted'
                      : 'group flex flex-col rounded-xl border border-primary/20 bg-card p-6 shadow-[0_0_24px_oklch(0.78_0.16_75/0.08)] transition-colors hover:bg-muted'
                    }
                  >
                    <div className="flex size-10 items-center justify-center rounded-md bg-secondary text-primary">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-card-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-primary group-hover:underline">
                      {item.cta}
                      <ChevronRight className="size-3.5" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="container mx-auto max-w-7xl px-4 py-16 sm:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl [font-family:var(--font-display)]">
                {t('benefits.title')}
              </h2>
              <p className="mt-3 text-muted-foreground">
                {t('benefits.subtitle')}
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((item) => {
                const Icon = item.icon

                return (
                  <article key={item.title} className="rounded-xl border border-border bg-card p-6">
                    <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section id="future-direction" className="border-b border-border">
          <div className="container mx-auto max-w-5xl px-4 py-16 sm:py-20">
            <div className="rounded-xl border border-border bg-card p-6 sm:p-10">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl [font-family:var(--font-display)]">
                  {t('roadmap.title')}
                </h2>
                <p className="mt-3 text-muted-foreground">
                  {t('roadmap.subtitle')}
                </p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {roadmap.map((item) => {
                  const Icon = item.icon

                  return (
                    <article key={item.title} className="flex gap-4 rounded-lg border border-border bg-background p-4">
                      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">{item.title}</h3>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.body}</p>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-border py-4">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          {t('footer')}
        </div>
      </footer>
    </div>
  )
}
