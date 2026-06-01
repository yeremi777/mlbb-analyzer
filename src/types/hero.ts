export const HERO_ROLES = [
  "tank",
  "fighter",
  "assassin",
  "mage",
  "marksman",
  "support",
] as const;

export const HERO_LANES = ["exp", "gold", "mid", "roam", "jungle"] as const;

export type HeroRole = (typeof HERO_ROLES)[number];
export type HeroLane = (typeof HERO_LANES)[number];

export type Hero = {
  id: string;
  officialId: string;
  name: string;
  imageUrl: string;
  roles: HeroRole[];
  lanes: HeroLane[];
  sourceRefs: string[];
  updatedAt: string;
};
