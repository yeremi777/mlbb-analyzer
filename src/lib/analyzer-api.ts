import type { Hero as DatasetHero, HeroRole as DatasetHeroRole } from "@/types/hero";
import type { CounterHero, Hero } from "@/lib/hero-data";
import type { CounterProof } from "@/types/counter";

type HeroesResponse = {
  items: DatasetHero[];
  page: number;
  size: number;
  total: number;
  pages: number;
};

type HeroCounterResponse = {
  targetHeroId: string;
  counterHero: DatasetHero;
  reasons: string[];
  counterTypes: string[];
  proof?: CounterProof[];
  patchVersion?: string;
};

const roleLabelById: Record<DatasetHeroRole, Hero["role"]> = {
  tank: "Tank",
  fighter: "Fighter",
  assassin: "Assassin",
  mage: "Mage",
  marksman: "Marksman",
  support: "Support",
};

function getAnalyzerApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_ANALYZER_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_ANALYZER_API_URL is not configured");
  }

  return apiUrl.replace(/\/$/, "");
}

function toUiHero(hero: DatasetHero): Hero {
  return {
    id: hero.uid,
    name: hero.name,
    role: roleLabelById[hero.roles[0]] ?? "Fighter",
    portrait: hero.images.head,
    roles: hero.roles,
    lanes: hero.lanes,
  };
}

export async function fetchHero(heroId: string): Promise<Hero> {
  const response = await fetch(`${getAnalyzerApiUrl()}/api/heroes/${encodeURIComponent(heroId)}`);

  if (!response.ok) {
    let detail = "";

    try {
      detail = JSON.stringify(await response.json());
    } catch {
      detail = await response.text();
    }

    throw new Error(`Failed to fetch hero ${heroId}: ${response.status}${detail ? ` ${detail}` : ""}`);
  }

  return toUiHero((await response.json()) as DatasetHero);
}

export async function fetchHeroCounters(heroId: string): Promise<CounterHero[]> {
  const response = await fetch(`${getAnalyzerApiUrl()}/api/heroes/${encodeURIComponent(heroId)}/counters`);

  if (!response.ok) {
    let detail = "";

    try {
      detail = JSON.stringify(await response.json());
    } catch {
      detail = await response.text();
    }

    throw new Error(`Failed to fetch counters for ${heroId}: ${response.status}${detail ? ` ${detail}` : ""}`);
  }

  const data = (await response.json()) as HeroCounterResponse[];

  if (!Array.isArray(data)) {
    throw new Error("Invalid hero counters response: expected an array");
  }

  return data.map((matchup, index) => {
    const counterHero = toUiHero(matchup.counterHero);

    return {
      ...counterHero,
      rank: index + 1,
      reason: matchup.reasons[0] ?? "",
      tags: matchup.counterTypes,
    };
  });
}

export async function fetchHeroes(): Promise<Hero[]> {
  const pageSize = 100;
  const firstPage = await fetchHeroesPage(1, pageSize);

  if (firstPage.pages <= 1) {
    return firstPage.items.map(toUiHero);
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.pages - 1 }, (_, index) =>
      fetchHeroesPage(index + 2, pageSize),
    ),
  );

  return [firstPage, ...remainingPages].flatMap((page) => page.items.map(toUiHero));
}

async function fetchHeroesPage(page: number, size: number): Promise<HeroesResponse> {
  const url = new URL(`${getAnalyzerApiUrl()}/api/heroes`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("size", String(size));

  const response = await fetch(url.toString());

  if (!response.ok) {
    let detail = "";

    try {
      detail = JSON.stringify(await response.json());
    } catch {
      detail = await response.text();
    }

    throw new Error(`Failed to fetch heroes: ${response.status}${detail ? ` ${detail}` : ""}`);
  }

  const data = (await response.json()) as HeroesResponse;

  if (!Array.isArray(data.items)) {
    throw new Error("Invalid heroes response: items must be an array");
  }

  return data;
}
