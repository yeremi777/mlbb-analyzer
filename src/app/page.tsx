import { Navbar } from '@/components/navbar'
import { CounterAnalyzer } from '@/components/counter-analyzer'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Hero Counter Analyzer
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Analyze enemy hero weaknesses and reveal the strongest counter picks.
          </p>
        </div>

        {/* Main Analyzer */}
        <CounterAnalyzer />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          MLBB Counter Analyzer is not affiliated with Moonton
        </div>
      </footer>
    </div>
  )
}
