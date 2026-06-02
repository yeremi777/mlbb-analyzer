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

const proofPriorityWeight = {
  primary: 3,
  secondary: 2,
  condition: 1,
} as const;

const proofImpactWeight = {
  high: 3,
  medium: 2,
  low: 1,
} as const;

function getEvidenceWeight(counter: CounterMatchup): number {
  const reasonWeight = counter.reasons.length;
  const counterTypeWeight = counter.counterTypes.length;
  const proofWeight =
    counter.proof?.reduce((total, proof) => {
      return total + proofPriorityWeight[proof.priority] + proofImpactWeight[proof.impact];
    }, 0) ?? 0;

  return proofWeight + counterTypeWeight + reasonWeight;
}

export function getCounterRecommendations({
  targetHeroId,
  heroes,
  counters,
  limit,
}: GetCounterRecommendationsInput): CounterRecommendation[] {
  const heroById = new Map(heroes.map((hero) => [hero.uid, hero]));

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
    .sort((a, b) => {
      const evidenceDifference = getEvidenceWeight(b) - getEvidenceWeight(a);

      if (evidenceDifference !== 0) {
        return evidenceDifference;
      }

      const reasonDifference = b.reasons.length - a.reasons.length;

      if (reasonDifference !== 0) {
        return reasonDifference;
      }

      const nameDifference = a.counterHero.name.localeCompare(b.counterHero.name);

      if (nameDifference !== 0) {
        return nameDifference;
      }

      return a.counterHeroId.localeCompare(b.counterHeroId);
    })
    .map((counter, index) => ({
      ...counter,
      rank: index + 1,
    }));

  return typeof limit === "number"
    ? recommendations.slice(0, limit)
    : recommendations;
}
