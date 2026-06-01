"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getCounterRecommendations } from "@/lib/analyzer/counters";
import type { CounterMatchup } from "@/types/counter";
import type { Hero, HeroRole } from "@/types/hero";

type HeroPickerCardProps = {
  heroes: Hero[];
  counters: CounterMatchup[];
};

type RevealState = "idle" | "analyzing" | "revealing" | "complete";

const revealOrder = [3, 2, 1, 4];

function getHeroTone(name: string): string {
  const tones = [
    "from-amber-500/50 to-orange-950",
    "from-sky-500/45 to-blue-950",
    "from-emerald-500/45 to-emerald-950",
    "from-rose-500/45 to-rose-950",
    "from-violet-500/45 to-violet-950",
    "from-cyan-500/45 to-cyan-950",
  ];

  const value = name
    .split("")
    .reduce((total, character) => total + character.charCodeAt(0), 0);

  return tones[value % tones.length];
}

function formatLabel(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function HeroMark({
  hero,
  size = "md",
  glow = false,
}: {
  hero: Hero;
  size?: "sm" | "md" | "lg" | "xl";
  glow?: boolean;
}) {
  const sizeClass = {
    sm: "h-10 w-10 text-xs",
    md: "h-14 w-14 text-sm",
    lg: "h-20 w-20 text-base",
    xl: "h-28 w-28 text-2xl",
  }[size];
  const imageSizes = {
    sm: "40px",
    md: "56px",
    lg: "80px",
    xl: "112px",
  }[size];

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ${getHeroTone(
        hero.name,
      )} ${sizeClass} border border-white/15 font-black text-white shadow-inner ${
        glow ? "ring-2 ring-amber-300 shadow-[0_0_36px_rgba(245,158,11,0.3)]" : ""
      }`}
    >
      {hero.images.head ? (
        <Image
          src={hero.images.head}
          alt={hero.name}
          fill
          sizes={imageSizes}
          className="object-cover"
        />
      ) : (
        hero.name.slice(0, 2).toUpperCase()
      )}
    </div>
  );
}

export function HeroPickerCard({ heroes, counters }: HeroPickerCardProps) {
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<HeroRole | "all">("all");
  const [revealState, setRevealState] = useState<RevealState>("idle");
  const [revealedRanks, setRevealedRanks] = useState<number[]>([]);

  const roles = useMemo(
    () => Array.from(new Set(heroes.flatMap((hero) => hero.roles))).sort(),
    [heroes],
  );

  const filteredHeroes = useMemo(() => {
    return heroes.filter((hero) => {
      const matchesSearch = hero.name.toLowerCase().includes(search.toLowerCase());
      const matchesRole =
        selectedRole === "all" || hero.roles.includes(selectedRole);

      return matchesSearch && matchesRole;
    });
  }, [heroes, search, selectedRole]);

  const selectedHero = useMemo(
    () => heroes.find((hero) => hero.uid === selectedHeroId) ?? null,
    [heroes, selectedHeroId],
  );

  const recommendations = useMemo(() => {
    if (!selectedHeroId) {
      return [];
    }

    return getCounterRecommendations({
      targetHeroId: selectedHeroId,
      heroes,
      counters,
    });
  }, [selectedHeroId, counters, heroes]);

  const topThreeCounters = useMemo(
    () =>
      recommendations
        .filter((recommendation) => recommendation.rank <= 3)
        .sort(
          (first, second) =>
            revealOrder.indexOf(first.rank) - revealOrder.indexOf(second.rank),
        ),
    [recommendations],
  );

  const remainingCounters = recommendations.filter(
    (recommendation) => recommendation.rank > 3,
  );

  useEffect(() => {
    if (revealState !== "analyzing") {
      return;
    }

    const timeout = window.setTimeout(() => {
      setRevealState("revealing");
    }, 550);

    return () => window.clearTimeout(timeout);
  }, [revealState]);

  useEffect(() => {
    if (revealState !== "revealing") {
      return;
    }

    const timers = revealOrder.map((rank, index) =>
      window.setTimeout(() => {
        setRevealedRanks((currentRanks) => [...currentRanks, rank]);

        if (rank === revealOrder[revealOrder.length - 1]) {
          setRevealState("complete");
        }
      }, index * 520),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [revealState]);

  function chooseHero(heroId: string) {
    setSelectedHeroId(heroId);
    setRevealState("idle");
    setRevealedRanks([]);
  }

  function analyzeHero() {
    if (!selectedHero) {
      return;
    }

    setRevealState("analyzing");
    setRevealedRanks([]);
  }

  return (
    <div className="grid flex-1 gap-6 py-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="rounded-xl border border-white/10 bg-zinc-900/80 p-4 shadow-2xl shadow-black/30">
        <div className="mb-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber-300">
            Enemy Hero
          </p>
          <h2 className="mt-2 text-lg font-black tracking-tight text-white">
            Select target
          </h2>
        </div>

        <label className="sr-only" htmlFor="hero-search">
          Search heroes
        </label>
        <input
          id="hero-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search heroes..."
          className="h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm font-medium text-white outline-none transition placeholder:text-zinc-500 focus:border-amber-300/70 focus:ring-4 focus:ring-amber-300/10"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedRole("all")}
            className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wide transition ${
              selectedRole === "all"
                ? "bg-amber-300 text-zinc-950"
                : "bg-white/5 text-zinc-300 hover:bg-white/10"
            }`}
          >
            All
          </button>
          {roles.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelectedRole(role)}
              className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wide transition ${
                selectedRole === role
                  ? "bg-amber-300 text-zinc-950"
                  : "bg-white/5 text-zinc-300 hover:bg-white/10"
              }`}
            >
              {formatLabel(role)}
            </button>
          ))}
        </div>

        <div className="mt-4 grid max-h-[420px] gap-2 overflow-y-auto pr-1">
          {filteredHeroes.map((hero) => (
            <button
              key={hero.uid}
              type="button"
              onClick={() => chooseHero(hero.uid)}
              className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                selectedHeroId === hero.uid
                  ? "border-amber-300/80 bg-amber-300/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
              }`}
            >
              <HeroMark hero={hero} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-white">
                  {hero.name}
                </span>
                <span className="block truncate text-xs text-zinc-400">
                  {[...hero.roles, ...hero.lanes].map(formatLabel).join(" / ")}
                </span>
              </span>
            </button>
          ))}
        </div>
      </aside>

      <section className="flex flex-col gap-6">
        <div className="rounded-xl border border-white/10 bg-zinc-900/70 p-5 shadow-2xl shadow-black/30">
          {selectedHero ? (
            <div className="flex flex-col items-center text-center">
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-red-300">
                Enemy Target Locked
              </div>

              <div className="mt-5">
                <HeroMark hero={selectedHero} size="xl" glow />
              </div>

              <h3 className="mt-4 text-4xl font-black tracking-tight text-white">
                {selectedHero.name}
              </h3>

              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {[...selectedHero.roles, ...selectedHero.lanes].map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-100"
                  >
                    {formatLabel(label)}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={analyzeHero}
                disabled={revealState === "analyzing" || revealState === "revealing"}
                className="mt-6 h-12 rounded-lg bg-amber-300 px-6 font-mono text-xs font-black uppercase tracking-[0.22em] text-zinc-950 shadow-[0_0_28px_rgba(245,158,11,0.18)] transition hover:bg-amber-200 disabled:cursor-wait disabled:opacity-70"
              >
                {revealState === "analyzing" ? "Analyzing..." : "Analyze Counter"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                const firstHero = filteredHeroes[0] ?? heroes[0];
                if (firstHero) {
                  chooseHero(firstHero.uid);
                }
              }}
              className="flex min-h-[320px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-black/15 p-8 text-center transition hover:border-amber-300/50 hover:bg-amber-300/5"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-zinc-600 text-3xl font-black text-zinc-500">
                ?
              </div>
              <h3 className="mt-4 text-xl font-black text-white">
                Select enemy hero
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-400">
                Choose one enemy hero from the list to prepare the counter reveal.
              </p>
            </button>
          )}
        </div>

        {revealState === "analyzing" ? (
          <div className="rounded-xl border border-white/10 bg-zinc-900/70 p-8 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-amber-300 border-t-transparent" />
            <p className="mt-4 text-sm font-medium text-zinc-300">
              Reading matchup scores from the static dataset...
            </p>
          </div>
        ) : null}

        {(revealState === "revealing" || revealState === "complete") &&
        selectedHero ? (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-xl font-black tracking-tight text-white">
                Counter Recommendations
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Best deterministic picks against {selectedHero.name}
              </p>
            </div>

            {recommendations.length > 0 ? (
              <>
                <div className="grid gap-4">
                  {topThreeCounters.map((recommendation) => (
                    <CounterResultCard
                      key={`${recommendation.targetHeroId}-${recommendation.counterHeroId}`}
                      recommendation={recommendation}
                      revealed={revealedRanks.includes(recommendation.rank)}
                    />
                  ))}
                </div>

                <div
                  className={`transition duration-500 ${
                    revealedRanks.includes(4)
                      ? "opacity-100"
                      : "pointer-events-none opacity-0"
                  }`}
                >
                  <h3 className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                    Remaining Ranked List
                  </h3>

                  {remainingCounters.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {remainingCounters.map((recommendation) => (
                        <CompactCounterRow
                          key={`${recommendation.targetHeroId}-${recommendation.counterHeroId}`}
                          recommendation={recommendation}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-white/10 bg-zinc-900/70 p-4 text-sm text-zinc-400">
                      No additional ranked counters are available in the starter
                      dataset yet.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-white/10 bg-zinc-900/70 p-5 text-center">
                <h3 className="font-bold text-white">No counter data yet</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  This hero exists in the selector, but the static dataset does not
                  include matchup recommendations for it yet.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
}

function CounterResultCard({
  recommendation,
  revealed,
}: {
  recommendation: ReturnType<typeof getCounterRecommendations>[number];
  revealed: boolean;
}) {
  const rankStyles = {
    1: {
      label: "#1 Best Counter",
      border: "border-amber-300/60",
      background: "bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-300/10",
      score: "text-amber-300",
      size: "xl" as const,
    },
    2: {
      label: "#2",
      border: "border-zinc-300/30",
      background: "bg-zinc-900/80",
      score: "text-zinc-200",
      size: "lg" as const,
    },
    3: {
      label: "#3",
      border: "border-orange-300/30",
      background: "bg-zinc-900/80",
      score: "text-orange-300",
      size: "lg" as const,
    },
  }[recommendation.rank as 1 | 2 | 3];

  if (!rankStyles) {
    return null;
  }

  return (
    <article
      className={`relative overflow-hidden rounded-xl border p-4 transition duration-500 ${
        rankStyles.border
      } ${rankStyles.background} ${
        recommendation.rank === 1 ? "sm:p-6" : ""
      } ${revealed ? "animate-reveal opacity-100" : "pointer-events-none opacity-0"}`}
    >
      {recommendation.rank === 1 ? (
        <div className="pointer-events-none absolute inset-0 animate-shimmer" />
      ) : null}

      <div
        className={`relative flex gap-4 ${
          recommendation.rank === 1
            ? "flex-col items-center text-center sm:flex-row sm:text-left"
            : "items-start"
        }`}
      >
        <HeroMark
          hero={recommendation.counterHero}
          size={rankStyles.size}
          glow={recommendation.rank === 1}
        />

        <div className="min-w-0 flex-1">
          <p
            className={`font-mono text-xs font-black uppercase tracking-[0.2em] ${rankStyles.score}`}
          >
            {rankStyles.label}
          </p>
          <h3
            className={`mt-1 font-black tracking-tight text-white ${
              recommendation.rank === 1 ? "text-2xl" : "text-xl"
            }`}
          >
            {recommendation.counterHero.name}
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            {recommendation.counterHero.roles.map(formatLabel).join(" / ")}
          </p>
          <p className={`mt-2 text-sm font-black ${rankStyles.score}`}>
            {recommendation.score}% effective
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-300">
            {recommendation.reasons[0]}
          </p>

          <div
            className={`mt-3 flex flex-wrap gap-2 ${
              recommendation.rank === 1 ? "justify-center sm:justify-start" : ""
            }`}
          >
            {recommendation.counterTypes.map((type) => (
              <span
                key={type}
                className="rounded-full bg-white/[0.07] px-2.5 py-1 text-xs font-medium text-zinc-300"
              >
                {formatLabel(type)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function CompactCounterRow({
  recommendation,
}: {
  recommendation: ReturnType<typeof getCounterRecommendations>[number];
}) {
  return (
    <article className="rounded-xl border border-white/10 bg-zinc-900/70 p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-xs font-black text-zinc-400">
          {recommendation.rank}
        </div>
        <HeroMark hero={recommendation.counterHero} size="sm" />
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-bold text-white">
            {recommendation.counterHero.name}
          </h4>
          <p className="truncate text-xs text-zinc-500">
            {recommendation.counterTypes.map(formatLabel).join(" / ")}
          </p>
        </div>
        <p className="font-mono text-sm font-black text-zinc-300">
          {recommendation.score}
        </p>
      </div>
      <p className="mt-3 line-clamp-2 text-xs leading-5 text-zinc-400">
        {recommendation.reasons[0]}
      </p>
    </article>
  );
}
