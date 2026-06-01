import type { CounterMatchup } from "@/types/counter";
import countersData from "../../public/data/counters.json";

export const counters = countersData as CounterMatchup[];

export function getCountersByTargetHeroId(targetHeroId: string): CounterMatchup[] {
  return counters.filter((counter) => counter.targetHeroId === targetHeroId);
}
