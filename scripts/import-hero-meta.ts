import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Hero, HeroLane, HeroRole } from "../src/types/hero";

type RawHeroMetaFile = {
  title?: string;
  revdate?: string;
  author?: string;
  source?: string;
  data?: RawHeroMetaRecord[];
};

type RawHeroMetaRecord = {
  uid?: unknown;
  mlid?: unknown;
  hero_name?: unknown;
  class?: unknown;
  laning?: unknown;
  portrait?: unknown;
};

const ROLE_MAP: Record<string, HeroRole> = {
  tank: "tank",
  fighter: "fighter",
  assassin: "assassin",
  mage: "mage",
  marksman: "marksman",
  support: "support",
};

const LANE_MAP: Record<string, HeroLane> = {
  "exp lane": "exp",
  exp: "exp",
  "gold lane": "gold",
  gold: "gold",
  "mid lane": "mid",
  mid: "mid",
  roam: "roam",
  jungle: "jungle",
};

function parseArgs(argv: string[]): { input: string; output: string } {
  let input = "";
  let output = "public/data/heroes.json";

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--input") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("--input requires a JSON file path");
      }
      input = value;
      index += 1;
      continue;
    }

    if (arg === "--output") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("--output requires a JSON file path");
      }
      output = value;
      index += 1;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!input) {
    throw new Error("--input is required");
  }

  return { input, output };
}

function printUsage(): void {
  console.log(`Usage:
  npm run import:hero-meta -- --input /path/to/hero-meta-final.json

Options:
  --input <file>   Raw hero meta JSON file with a top-level data array.
  --output <file>  Normalized output path. Defaults to public/data/heroes.json.

Mapping:
  uid -> uid
  mlid -> mlid
  hero_name -> name
  class -> roles
  laning -> lanes
  portrait -> images.head
`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asCleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function splitCommaValues(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap(splitCommaValues);
  }

  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function normalizeRoles(value: unknown, label: string): HeroRole[] {
  const roles = splitCommaValues(value).map((entry) => ROLE_MAP[entry.toLowerCase()]);
  const unknownRoles = splitCommaValues(value).filter((entry) => !ROLE_MAP[entry.toLowerCase()]);

  if (unknownRoles.length > 0) {
    throw new Error(`${label} has unknown role values: ${unknownRoles.join(", ")}`);
  }

  return unique(roles.filter((role): role is HeroRole => Boolean(role)));
}

function normalizeLanes(value: unknown, label: string): HeroLane[] {
  const lanes = splitCommaValues(value).map((entry) => LANE_MAP[entry.toLowerCase()]);
  const unknownLanes = splitCommaValues(value).filter((entry) => !LANE_MAP[entry.toLowerCase()]);

  if (unknownLanes.length > 0) {
    throw new Error(`${label} has unknown lane values: ${unknownLanes.join(", ")}`);
  }

  return unique(lanes.filter((lane): lane is HeroLane => Boolean(lane)));
}

function normalizeHero(record: RawHeroMetaRecord, index: number): Hero | null {
  const uid = asCleanString(record.uid);
  const mlid = asCleanString(record.mlid);
  const name = asCleanString(record.hero_name);
  const head = asCleanString(record.portrait);
  const label = `raw hero meta entry #${index + 1} (${uid || name || "unknown"})`;

  // The provided file includes a placeholder "None" row; skip it rather than treating it as a hero.
  if (!uid || uid === "null" || !mlid || !name || name.toLowerCase() === "none") {
    return null;
  }

  const roles = normalizeRoles(record.class, label);
  if (roles.length === 0) {
    throw new Error(`${label} has no usable roles`);
  }

  const hero: Hero = {
    uid,
    mlid,
    name,
    roles,
    lanes: normalizeLanes(record.laning, label),
    images: {
      head,
    },
  };

  return hero;
}

function loadRawHeroMeta(path: string): RawHeroMetaRecord[] {
  const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));

  if (!isRecord(parsed) || !Array.isArray((parsed as RawHeroMetaFile).data)) {
    throw new Error("input must be a JSON object with a data array");
  }

  return (parsed as RawHeroMetaFile).data ?? [];
}

function main(): void {
  const { input, output } = parseArgs(process.argv.slice(2));
  const records = loadRawHeroMeta(resolve(process.cwd(), input));
  const heroes = records
    .map((record, index) => normalizeHero(record, index))
    .filter((hero): hero is Hero => hero !== null);

  writeFileSync(resolve(process.cwd(), output), `${JSON.stringify(heroes, null, 2)}\n`);
  console.log(`Imported ${heroes.length} heroes from ${input} into ${output}`);
}

main();
