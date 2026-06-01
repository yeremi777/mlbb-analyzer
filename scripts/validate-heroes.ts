import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const HERO_ROLES = ["tank", "fighter", "assassin", "mage", "marksman", "support"] as const;
const HERO_LANES = ["exp", "gold", "mid", "roam", "jungle"] as const;

const HERO_ROLE_SET = new Set<string>(HERO_ROLES);
const HERO_LANE_SET = new Set<string>(HERO_LANES);
const HERO_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

type HeroRecord = {
  id?: unknown;
  officialId?: unknown;
  name?: unknown;
  imageUrl?: unknown;
  roles?: unknown;
  lanes?: unknown;
  sourceRefs?: unknown;
  updatedAt?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function describeHero(hero: HeroRecord, index: number): string {
  const id = typeof hero.id === "string" && hero.id.trim() !== "" ? hero.id : `#${index + 1}`;
  return `hero entry #${index + 1} (${id})`;
}

function isValidIsoDateString(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validateStringField(
  hero: HeroRecord,
  label: string,
  field: keyof Pick<HeroRecord, "id" | "officialId" | "name" | "imageUrl" | "updatedAt">,
  options: { allowEmpty?: boolean } = {},
): string[] {
  const value = hero[field];

  if (typeof value !== "string") {
    return [`${label} ${field} must be a string`];
  }

  if (!options.allowEmpty && value.trim() === "") {
    return [`${label} ${field} must be a non-empty string`];
  }

  return [];
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

  const seenHeroIds = new Set<string>();

  heroes.forEach((value: unknown, index: number) => {
    if (!isRecord(value)) {
      errors.push(`hero entry #${index + 1} must be an object`);
      return;
    }

    const hero = value as HeroRecord;
    const label = describeHero(hero, index);

    errors.push(...validateStringField(hero, label, "id"));
    errors.push(...validateStringField(hero, label, "officialId", { allowEmpty: true }));
    errors.push(...validateStringField(hero, label, "name"));
    errors.push(...validateStringField(hero, label, "imageUrl", { allowEmpty: true }));
    errors.push(...validateStringField(hero, label, "updatedAt"));

    if (typeof hero.id === "string") {
      if (!HERO_ID_PATTERN.test(hero.id)) {
        errors.push(`${label} id must be lowercase kebab-case`);
      }

      if (seenHeroIds.has(hero.id)) {
        errors.push(`${label} has duplicate hero id "${hero.id}"`);
      } else {
        seenHeroIds.add(hero.id);
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
    errors.push(...validateStringArray(hero.sourceRefs, label, "sourceRefs", { requireNonEmpty: true }));

    if (typeof hero.updatedAt === "string" && !isValidIsoDateString(hero.updatedAt)) {
      errors.push(`${label} updatedAt must be an ISO date string in YYYY-MM-DD format`);
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
