import { readFileSync } from "node:fs";
import { basename, resolve } from "node:path";

type HeroRecord = {
  uid?: unknown;
};

type CounterRecord = {
  targetHeroId?: unknown;
  counterHeroId?: unknown;
  reasons?: unknown;
  proof?: unknown;
};

const PROOF_CATEGORIES = new Set([
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
]);

const PROOF_PRIORITIES = new Set(["primary", "secondary", "condition"]);
const PROOF_IMPACTS = new Set(["low", "medium", "high"]);

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

function hasOnlyNonEmptyStrings(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string" && item.trim() !== "");
}

function validateProofEntry(value: unknown, label: string, proofIndex: number): string[] {
  const errors: string[] = [];
  const proofLabel = `${label} proof entry #${proofIndex + 1}`;

  if (!isRecord(value)) {
    return [`${proofLabel} must be an object`];
  }

  if (typeof value.id !== "string" || value.id.trim() === "") {
    errors.push(`${proofLabel} must have a non-empty string id`);
  }

  if (typeof value.category !== "string" || !PROOF_CATEGORIES.has(value.category)) {
    errors.push(`${proofLabel} category must be one of ${Array.from(PROOF_CATEGORIES).join(", ")}`);
  }

  if (typeof value.priority !== "string" || !PROOF_PRIORITIES.has(value.priority)) {
    errors.push(`${proofLabel} priority must be one of primary, secondary, condition`);
  }

  if (typeof value.impact !== "string" || !PROOF_IMPACTS.has(value.impact)) {
    errors.push(`${proofLabel} impact must be one of low, medium, high`);
  }

  if (typeof value.summary !== "string" || value.summary.trim() === "") {
    errors.push(`${proofLabel} must have a non-empty string summary`);
  }

  if (value.worksBestWhen !== undefined && !hasOnlyNonEmptyStrings(value.worksBestWhen)) {
    errors.push(`${proofLabel} worksBestWhen must contain only non-empty strings when present`);
  }

  if (value.failureCases !== undefined && !hasOnlyNonEmptyStrings(value.failureCases)) {
    errors.push(`${proofLabel} failureCases must contain only non-empty strings when present`);
  }

  if ("scoreHint" in value) {
    errors.push(`${proofLabel} must not include scoreHint; scoring is produced by the analyzer`);
  }

  return errors;
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
    if (!isRecord(hero) || typeof hero.uid !== "string" || hero.uid.trim() === "") {
      errors.push(`hero entry #${index + 1} must have a non-empty string uid`);
      return;
    }

    heroIds.add(hero.uid);
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

    if ("score" in counter) {
      errors.push(`${label} must not include score; scoring is produced by the analyzer`);
    }

    if (!Array.isArray(counter.reasons) || counter.reasons.length === 0) {
      errors.push(`${label} reasons must be present and non-empty`);
    } else if (counter.reasons.some((reason) => typeof reason !== "string" || reason.trim() === "")) {
      errors.push(`${label} reasons must contain only non-empty strings`);
    }

    if (counter.proof !== undefined) {
      if (!Array.isArray(counter.proof) || counter.proof.length === 0) {
        errors.push(`${label} proof must be a non-empty array when present`);
      } else {
        const seenProofIds = new Set<string>();

        counter.proof.forEach((proof: unknown, proofIndex: number) => {
          errors.push(...validateProofEntry(proof, label, proofIndex));

          if (isRecord(proof) && typeof proof.id === "string" && proof.id.trim() !== "") {
            if (seenProofIds.has(proof.id)) {
              errors.push(`${label} proof entry #${proofIndex + 1} has duplicate id "${proof.id}"`);
            } else {
              seenProofIds.add(proof.id);
            }
          }
        });
      }
    }
  });

  return { valid: errors.length === 0, errors };
}

function readJsonFile(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8"));
}

type CounterDatasetReadResult = {
  counters: unknown;
  errors: string[];
};

function readCountersDataset(projectRoot: string): CounterDatasetReadResult {
  const countersPath = resolve(projectRoot, "public/data/counters.json");
  const countersIndex = readJsonFile(countersPath);

  if (Array.isArray(countersIndex)) {
    return { counters: countersIndex, errors: [] };
  }

  if (!isRecord(countersIndex) || !Array.isArray(countersIndex.files)) {
    return { counters: countersIndex, errors: ["counter dataset index must be an array or an object with a files array"] };
  }

  const errors: string[] = [];
  const counters = countersIndex.files.flatMap((file) => {
    if (typeof file !== "string" || file.trim() === "") {
      errors.push("counter dataset index files must contain only non-empty strings");
      return [];
    }

    const filePath = resolve(projectRoot, "public/data", file);
    const fileCounters = readJsonFile(filePath);
    const expectedTargetHeroId = basename(file, ".json");

    if (!Array.isArray(fileCounters)) {
      errors.push(`counter dataset file ${file} must contain an array`);
      return [];
    }

    fileCounters.forEach((counter, index) => {
      if (isRecord(counter) && counter.targetHeroId !== expectedTargetHeroId) {
        errors.push(
          `counter dataset file ${file} entry #${index + 1} targetHeroId must match "${expectedTargetHeroId}"`,
        );
      }
    });

    return fileCounters;
  });

  return { counters, errors };
}

export function validateProjectCounters(projectRoot = process.cwd()): ValidationResult {
  const heroesPath = resolve(projectRoot, "public/data/heroes.json");
  const counterDataset = readCountersDataset(projectRoot);
  const result = validateCountersData({
    heroes: readJsonFile(heroesPath),
    counters: counterDataset.counters,
  });

  return {
    valid: result.valid && counterDataset.errors.length === 0,
    errors: [...counterDataset.errors, ...result.errors],
  };
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
