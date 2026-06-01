import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type HeroRecord = {
  id?: unknown;
};

type CounterRecord = {
  targetHeroId?: unknown;
  counterHeroId?: unknown;
  score?: unknown;
  reasons?: unknown;
};

export type ValidateCountersInput = {
  heroes: unknown;
  counters: unknown;
};

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function describePair(counter: CounterRecord, index: number): string {
  return `counter entry #${index + 1} (${String(counter.targetHeroId)} -> ${String(counter.counterHeroId)})`;
}

export function validateCountersData(input: ValidateCountersInput): ValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(input.heroes)) {
    errors.push("heroes dataset must be an array");
    return { valid: false, errors };
  }

  if (!Array.isArray(input.counters)) {
    errors.push("counters dataset must be an array");
    return { valid: false, errors };
  }

  const heroIds = new Set<string>();
  input.heroes.forEach((hero: HeroRecord, index: number) => {
    if (!isRecord(hero) || typeof hero.id !== "string" || hero.id.trim() === "") {
      errors.push(`hero entry #${index + 1} must have a non-empty string id`);
      return;
    }

    heroIds.add(hero.id);
  });

  const seenPairs = new Set<string>();

  input.counters.forEach((value: unknown, index: number) => {
    if (!isRecord(value)) {
      errors.push(`counter entry #${index + 1} must be an object`);
      return;
    }

    const counter = value as CounterRecord;
    const label = describePair(counter, index);
    const targetHeroId = counter.targetHeroId;
    const counterHeroId = counter.counterHeroId;

    if (typeof targetHeroId !== "string" || targetHeroId.trim() === "") {
      errors.push(`${label} must have a non-empty string targetHeroId`);
    } else if (!heroIds.has(targetHeroId)) {
      errors.push(`${label} has unknown targetHeroId "${targetHeroId}"`);
    }

    if (typeof counterHeroId !== "string" || counterHeroId.trim() === "") {
      errors.push(`${label} must have a non-empty string counterHeroId`);
    } else if (!heroIds.has(counterHeroId)) {
      errors.push(`${label} has unknown counterHeroId "${counterHeroId}"`);
    }

    if (typeof targetHeroId === "string" && typeof counterHeroId === "string") {
      if (targetHeroId === counterHeroId) {
        errors.push(`${label} is a self-counter; targetHeroId and counterHeroId must be different`);
      }

      const pairKey = `${targetHeroId}\u0000${counterHeroId}`;
      if (seenPairs.has(pairKey)) {
        errors.push(`${label} is a duplicate target/counter pair for ${targetHeroId} -> ${counterHeroId}`);
      } else {
        seenPairs.add(pairKey);
      }
    }

    if (typeof counter.score !== "number" || Number.isNaN(counter.score)) {
      errors.push(`${label} score must be numeric`);
    } else if (counter.score < 0 || counter.score > 100) {
      errors.push(`${label} score must be within 0-100 inclusive`);
    }

    if (!Array.isArray(counter.reasons) || counter.reasons.length === 0) {
      errors.push(`${label} reasons must be present and non-empty`);
    } else if (counter.reasons.some((reason) => typeof reason !== "string" || reason.trim() === "")) {
      errors.push(`${label} reasons must contain only non-empty strings`);
    }
  });

  return { valid: errors.length === 0, errors };
}

function readJsonFile(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function validateProjectCounters(projectRoot = process.cwd()): ValidationResult {
  const heroesPath = resolve(projectRoot, "public/data/heroes.json");
  const countersPath = resolve(projectRoot, "public/data/counters.json");

  return validateCountersData({
    heroes: readJsonFile(heroesPath),
    counters: readJsonFile(countersPath),
  });
}

function runCli(): void {
  const result = validateProjectCounters();

  if (result.valid) {
    console.log("Counter dataset validation passed");
    return;
  }

  console.error("Counter dataset validation failed:");
  for (const error of result.errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
}

if (process.argv[1]?.endsWith("validate-counters.ts")) {
  runCli();
}
