import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const HERO_ROLES = ["tank", "fighter", "assassin", "mage", "marksman", "support"] as const;
const HERO_LANES = ["exp", "gold", "mid", "roam", "jungle"] as const;

const HERO_ROLE_SET = new Set<string>(HERO_ROLES);
const HERO_LANE_SET = new Set<string>(HERO_LANES);
const HERO_UID_PATTERN = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

type HeroRecord = {
  uid?: unknown;
  mlid?: unknown;
  name?: unknown;
  images?: unknown;
  roles?: unknown;
  lanes?: unknown;
  sourceRefs?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function describeHero(hero: HeroRecord, index: number): string {
  const uid = typeof hero.uid === "string" && hero.uid.trim() !== "" ? hero.uid : `#${index + 1}`;
  return `hero entry #${index + 1} (${uid})`;
}

function validateStringField(
  hero: HeroRecord,
  label: string,
  field: keyof Pick<HeroRecord, "uid" | "mlid" | "name">,
): string[] {
  const value = hero[field];

  if (typeof value !== "string") {
    return [`${label} ${field} must be a string`];
  }

  if (value.trim() === "") {
    return [`${label} ${field} must be a non-empty string`];
  }

  return [];
}

function validateImages(value: unknown, label: string): string[] {
  const errors: string[] = [];

  if (!isRecord(value)) {
    return [`${label} images must be an object`];
  }

  if (typeof value.head !== "string") {
    errors.push(`${label} images.head must be a string`);
  }

  if ("smallmap" in value && typeof value.smallmap !== "string") {
    errors.push(`${label} images.smallmap must be a string when present`);
  }

  return errors;
}

function validateStringArray(
  value: unknown,
  label: string,
  field: "roles" | "lanes" | "sourceRefs",
  options: { requireNonEmpty: boolean; allowedValues?: Set<string>; allowedLabel?: string },
): string[] {
  const errors: string[] = [];

  if (!Array.isArray(value)) {
    return [`${label} ${field} must be an array`];
  }

  if (options.requireNonEmpty && value.length === 0) {
    errors.push(`${label} ${field} must be non-empty`);
  }

  const invalidEntries = value.filter((entry) => typeof entry !== "string" || entry.trim() === "");
  if (invalidEntries.length > 0) {
    errors.push(`${label} ${field} must contain only non-empty strings`);
  }

  if (options.allowedValues) {
    const unknownValues = value.filter((entry): entry is string => typeof entry === "string" && !options.allowedValues?.has(entry));
    if (unknownValues.length > 0) {
      errors.push(`${label} ${field} must use allowed ${options.allowedLabel}: ${unknownValues.join(", ")}`);
    }
  }

  return errors;
}

export function validateHeroesData(heroes: unknown): ValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(heroes)) {
    return { valid: false, errors: ["heroes dataset must be an array"] };
  }

  const seenHeroUids = new Set<string>();

  heroes.forEach((value: unknown, index: number) => {
    if (!isRecord(value)) {
      errors.push(`hero entry #${index + 1} must be an object`);
      return;
    }

    const hero = value as HeroRecord;
    const label = describeHero(hero, index);

    errors.push(...validateStringField(hero, label, "uid"));
    errors.push(...validateStringField(hero, label, "mlid"));
    errors.push(...validateStringField(hero, label, "name"));
    errors.push(...validateImages(hero.images, label));

    if (typeof hero.uid === "string") {
      if (!HERO_UID_PATTERN.test(hero.uid)) {
        errors.push(`${label} uid must use lowercase uid format`);
      }

      if (seenHeroUids.has(hero.uid)) {
        errors.push(`${label} has duplicate hero uid "${hero.uid}"`);
      } else {
        seenHeroUids.add(hero.uid);
      }
    }

    errors.push(
      ...validateStringArray(hero.roles, label, "roles", {
        requireNonEmpty: true,
        allowedValues: HERO_ROLE_SET,
        allowedLabel: "roles",
      }),
    );
    errors.push(
      ...validateStringArray(hero.lanes, label, "lanes", {
        requireNonEmpty: false,
        allowedValues: HERO_LANE_SET,
        allowedLabel: "lanes",
      }),
    );

    if (hero.sourceRefs !== undefined) {
      errors.push(...validateStringArray(hero.sourceRefs, label, "sourceRefs", { requireNonEmpty: false }));
    }
  });

  return { valid: errors.length === 0, errors };
}

function readJsonFile(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function validateProjectHeroes(projectRoot = process.cwd()): ValidationResult {
  const heroesPath = resolve(projectRoot, "public/data/heroes.json");
  return validateHeroesData(readJsonFile(heroesPath));
}

function runCli(): void {
  const result = validateProjectHeroes();

  if (result.valid) {
    console.log("Hero dataset validation passed");
    return;
  }

  console.error("Hero dataset validation failed:");
  for (const error of result.errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
}

if (process.argv[1]?.endsWith("validate-heroes.ts")) {
  runCli();
}
