"use client";

import { useMemo, useState } from "react";
import { getCounterRecommendations } from "@/lib/analyzer/counters";
import type { CounterMatchup } from "@/types/counter";
import type { Hero } from "@/types/hero";

type HeroPickerCardProps = {
  heroes: Hero[];
  counters: CounterMatchup[];
};

export function HeroPickerCard({ heroes, counters }: HeroPickerCardProps) {
  const [selectedHeroId, setSelectedHeroId] = useState(heroes[0]?.id ?? "");
  const [analyzedHeroId, setAnalyzedHeroId] = useState<string | null>(null);

  const selectedHero = useMemo(
    () => heroes.find((hero) => hero.id === selectedHeroId) ?? heroes[0],
    [heroes, selectedHeroId],
  );

  const recommendations = useMemo(() => {
    if (!analyzedHeroId) {
      return [];
    }

    return getCounterRecommendations({
      targetHeroId: analyzedHeroId,
      heroes,
      counters,
      limit: 3,
    });
  }, [analyzedHeroId, counters, heroes]);

  const analyzedHero = useMemo(
    () => heroes.find((hero) => hero.id === analyzedHeroId),
    [analyzedHeroId, heroes],
  );

  return (
    <section className="mx-auto w-full max-w-2xl rounded-[2rem] border border-white/15 bg-slate-950/75 p-5 shadow-2xl shadow-cyan-950/40 backdrop-blur md:p-7">
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
          Analyze Target
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
          Pick enemy hero
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Pilih hero lawan, lalu tampilkan top counter dari starter dataset.
        </p>
      </div>

      <label className="block text-sm font-medium text-slate-200" htmlFor="hero-picker">
        Enemy hero
      </label>
      <select
        id="hero-picker"
        value={selectedHeroId}
        onChange={(event) => {
          setSelectedHeroId(event.target.value);
          setAnalyzedHeroId(null);
        }}
        className="mt-2 w-full rounded-2xl border border-cyan-300/20 bg-slate-900 px-4 py-3 text-base font-semibold text-white outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/15"
      >
        {heroes.map((hero) => (
          <option key={hero.id} value={hero.id}>
            {hero.name}
          </option>
        ))}
      </select>

      {selectedHero ? (
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-400/15 via-blue-500/10 to-fuchsia-500/10 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Selected enemy
              </p>
              <h3 className="mt-2 text-4xl font-black tracking-tight text-white">
                {selectedHero.name}
              </h3>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-2xl font-black text-cyan-200">
              {selectedHero.name.slice(0, 2).toUpperCase()}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {[...selectedHero.roles, ...selectedHero.lanes].map((label) => (
              <span
                key={label}
                className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-100"
              >
                {label}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {selectedHero.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setAnalyzedHeroId(selectedHero?.id ?? null)}
        className="mt-6 w-full rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black uppercase tracking-[0.25em] text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 active:scale-[0.99]"
      >
        Analyze Hero
      </button>

      {analyzedHero ? (
        <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-left">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
                Counter Result
              </p>
              <h3 className="mt-2 text-2xl font-black text-white">
                Top counter vs {analyzedHero.name}
              </h3>
            </div>
            <span className="rounded-full bg-slate-950/80 px-3 py-1 text-sm font-bold text-cyan-200">
              {recommendations.length} picks
            </span>
          </div>

          {recommendations.length > 0 ? (
            <ol className="mt-5 space-y-3">
              {recommendations.map((recommendation) => (
                <li
                  key={`${recommendation.targetHeroId}-${recommendation.counterHeroId}`}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Rank #{recommendation.rank}
                      </p>
                      <h4 className="mt-1 text-xl font-black text-white">
                        {recommendation.counterHero.name}
                      </h4>
                    </div>
                    <div className="rounded-2xl bg-cyan-300 px-3 py-2 text-center text-slate-950">
                      <p className="text-[10px] font-black uppercase tracking-widest">
                        Score
                      </p>
                      <p className="text-xl font-black">{recommendation.score}</p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {recommendation.reasons[0]}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {recommendation.counterTypes.map((type) => (
                      <span
                        key={type}
                        className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
              Belum ada counter data untuk hero ini. Nanti masuk ke data
              gathering.
            </p>
          )}
        </div>
      ) : null}
    </section>
  );
}
