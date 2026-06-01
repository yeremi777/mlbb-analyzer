import type { Hero } from "@/types/hero";
import heroesData from "../../public/data/heroes.json";

export const heroes = heroesData as Hero[];

export const heroById = new Map<string, Hero>(
  heroes.map((hero) => [hero.uid, hero]),
);

export function getHeroById(heroId: string): Hero | undefined {
  return heroById.get(heroId);
}
