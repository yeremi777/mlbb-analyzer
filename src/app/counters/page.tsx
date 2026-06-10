import { getTranslations } from 'next-intl/server'
import { Navbar } from '@/components/navbar'
import { CounterAnalyzer } from '@/components/counter-analyzer'

export default async function CounterPage() {
  const t = await getTranslations('counter')

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {t('title')}
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <CounterAnalyzer />
      </main>

      <footer className="border-t border-border py-4">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          {t('footer')}
        </div>
      </footer>
    </div>
  )
}
