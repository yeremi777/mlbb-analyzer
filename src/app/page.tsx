import { HeroPickerCard } from "@/components/hero/HeroPickerCard";
import { counters } from "@/data/counters";
import { heroes } from "@/data/heroes";

export default function Home() {
  return (
    <main className="min-h-[100dvh] overflow-hidden bg-slate-950 px-6 py-8 text-slate-50">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,#155e75_0,#0f172a_42%,#020617_100%)]" />
      <div className="pointer-events-none fixed left-1/2 top-12 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />

      <section className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col items-center justify-center gap-10 text-center">
        <div className="max-w-3xl space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.45em] text-cyan-300">
            MLBB Analyzer
          </p>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
            Temukan counter hero sebelum draft jadi masalah.
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Pilih hero lawan, lalu analyzer membantu membaca ancaman, counter,
            dan alasan rekomendasi pick.
          </p>
        </div>

        <HeroPickerCard heroes={heroes} counters={counters} />
      </section>
    </main>
  );
}
