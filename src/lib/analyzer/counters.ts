import type { CounterMatchup } from "@/types/counter";
import type { Hero } from "@/types/hero";

export type CounterRecommendation = CounterMatchup & {
  rank: number;
  counterHero: Hero;
};

type GetCounterRecommendationsInput = {
  targetHeroId: string;
  heroes: Hero[];
  counters: CounterMatchup[];
  limit?: number;
};

export function getCounterRecommendations({
  targetHeroId,
  heroes,
  counters,
  limit,
}: GetCounterRecommendationsInput): CounterRecommendation[] {
  const heroById = new Map(heroes.map((hero) => [hero.id, hero]));

  const recommendations = counters
    .filter((counter) => counter.targetHeroId === targetHeroId)
    .filter((counter) => counter.counterHeroId !== targetHeroId)
    .map((counter) => {
      const counterHero = heroById.get(counter.counterHeroId);

      if (!counterHero) {
        return null;
      }

      return {
        ...counter,
        counterHero,
      };
    })
    .filter((counter): counter is CounterMatchup & { counterHero: Hero } =>
      Boolean(counter),
    )
    .sort((a, b) => b.score - a.score)
    .map((counter, index) => ({
      ...counter,
      rank: index + 1,
    }));

  return typeof limit === "number"
    ? recommendations.slice(0, limit)
    : recommendations;
}
