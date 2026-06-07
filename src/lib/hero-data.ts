import type { Hero as DatasetHero } from "@/types/hero";

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
  reason: string;
  tags: string[];
  score: number;
  confidence?: number;
}

export interface SynergyHero extends Hero {
  rank: number;
  reason: string;
  tags: string[];
  score: number;
  confidence?: number;
}

export const HERO_ROLES: HeroRole[] = [
  "Tank",
  "Fighter",
  "Assassin",
  "Mage",
  "Marksman",
  "Support",
];
