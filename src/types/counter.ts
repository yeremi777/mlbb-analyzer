export type CounterMatchup = {
  targetHeroId: string;
  counterHeroId: string;
  score: number;
  reasons: string[];
  counterTypes: string[];
  patchVersion?: string;
};

export type CounterRule = {
  id: string;
  targetTag: string;
  counterTag: string;
  bonus: number;
  reason: string;
};
