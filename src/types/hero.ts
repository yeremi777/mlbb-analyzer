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
  uid: string;
  mlid: string;
  name: string;
  images: {
    head: string;
    smallmap?: string;
  };
  roles: HeroRole[];
  lanes: HeroLane[];
  sourceRefs?: string[];
};
