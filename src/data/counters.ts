import type { CounterMatchup } from "@/types/counter";
import aliceCounters from "../../public/data/counters/alice.json";
import alucardCounters from "../../public/data/counters/alucard.json";
import balmondCounters from "../../public/data/counters/balmond.json";
import miyaCounters from "../../public/data/counters/miya.json";
import nanaCounters from "../../public/data/counters/nana.json";
import saberCounters from "../../public/data/counters/saber.json";
import tigrealCounters from "../../public/data/counters/tigreal.json";

export const counters = [
  ...aliceCounters,
  ...alucardCounters,
  ...balmondCounters,
  ...miyaCounters,
  ...nanaCounters,
  ...saberCounters,
  ...tigrealCounters,
] as CounterMatchup[];

export function getCountersByTargetHeroId(targetHeroId: string): CounterMatchup[] {
  return counters.filter((counter) => counter.targetHeroId === targetHeroId);
}
