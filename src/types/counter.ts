export const COUNTER_PROOF_CATEGORIES = [
  "skill-interaction",
  "crowd-control-counter",
  "damage-type-advantage",
  "item-power-spike",
  "mobility-advantage",
  "range-advantage",
  "kiting",
  "sustain-anti-sustain",
  "positioning-requirement",
  "cooldown-window",
  "vision-awareness",
  "teamfight-role-counter",
  "game-phase",
  "execution-difficulty",
] as const;

export const COUNTER_PROOF_PRIORITIES = ["primary", "secondary", "condition"] as const;

export const COUNTER_PROOF_IMPACTS = ["low", "medium", "high"] as const;

export type CounterProofCategory = (typeof COUNTER_PROOF_CATEGORIES)[number];
export type CounterProofPriority = (typeof COUNTER_PROOF_PRIORITIES)[number];
export type CounterProofImpact = (typeof COUNTER_PROOF_IMPACTS)[number];

export type CounterProof = {
  id: string;
  category: CounterProofCategory;
  priority: CounterProofPriority;
  impact: CounterProofImpact;
  summary: string;
  worksBestWhen?: string[];
  failureCases?: string[];
};

export type CounterMatchup = {
  targetHeroId: string;
  counterHeroId: string;
  reasons: string[];
  counterTypes: string[];
  proof?: CounterProof[];
  patchVersion?: string;
};

export type CounterRule = {
  id: string;
  targetTag: string;
  counterTag: string;
  bonus: number;
  reason: string;
};
