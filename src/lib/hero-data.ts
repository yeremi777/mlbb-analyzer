import { getCounterRecommendations } from "@/lib/analyzer/counters";
import { counters } from "@/data/counters";
import { heroes } from "@/data/heroes";
import type { Hero as DatasetHero, HeroRole as DatasetHeroRole } from "@/types/hero";

export type HeroRole = "Tank" | "Fighter" | "Assassin" | "Mage" | "Marksman" | "Support";

export interface Hero {
  id: string;
  name: string;
  role: HeroRole;
  portrait: string;
  roles: DatasetHero["roles"];
  lanes: DatasetHero["lanes"];
}

export interface CounterHero extends Hero {
  rank: number;
  counterScore: number;
  reason: string;
  tags: string[];
}

export const HERO_ROLES: HeroRole[] = [
  "Tank",
  "Fighter",
  "Assassin",
  "Mage",
  "Marksman",
  "Support",
];

const roleLabelById: Record<DatasetHeroRole, HeroRole> = {
  tank: "Tank",
  fighter: "Fighter",
  assassin: "Assassin",
  mage: "Mage",
  marksman: "Marksman",
  support: "Support",
};

function toUiHero(hero: DatasetHero): Hero {
  return {
    id: hero.id,
    name: hero.name,
    role: roleLabelById[hero.roles[0]] ?? "Fighter",
    portrait: hero.imageUrl,
    roles: hero.roles,
    lanes: hero.lanes,
  };
}

export const HEROES: Hero[] = heroes.map(toUiHero);

export function getCountersForHero(heroId: string): CounterHero[] {
  return getCounterRecommendations({
    targetHeroId: heroId,
    heroes,
    counters,
  }).map((recommendation) => {
    const counterHero = toUiHero(recommendation.counterHero);

    return {
      ...counterHero,
      rank: recommendation.rank,
      counterScore: recommendation.score,
      reason: recommendation.reasons[0] ?? "",
      tags: recommendation.counterTypes,
    };
  });
}
