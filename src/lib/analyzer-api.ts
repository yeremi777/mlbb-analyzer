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

export type AnalyzerApiError = {
  error: {
    code: string;
    message: string;
  };
};

/**
 * Error thrown by the analyze endpoints. Carries the stable `error.code` (when
 * the backend provides one) and the HTTP `status` so callers can map to
 * localized copy via @/i18n/error-messages. `message` stays the raw English
 * backend message and should not be shown to users directly.
 */
export class AnalyzerError extends Error {
  code?: string;
  status: number;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "AnalyzerError";
    this.status = status;
    this.code = code;
  }
}

async function toAnalyzerError(response: Response): Promise<AnalyzerError> {
  let code: string | undefined;
  let message = response.statusText;

  try {
    const data = (await response.json()) as Partial<AnalyzerApiError>;

    if (data.error?.code) {
      code = data.error.code;
    }

    if (data.error?.message) {
      message = data.error.message;
    }
  } catch {
    // Non-JSON body — fall back to status text.
  }

  return new AnalyzerError(message, response.status, code);
}

export type AnalyzeScoresResponse = {
  targetHeroId: string;
  source: "ai";
  recommendations: Array<{
    rank: number;
    counterHeroId: string;
    score: number;
    confidence: number;
  }>;
};

export type AnalyzeDetailResponse = {
  targetHeroId: string;
  counterHeroId: string;
  source: "ai";
  score: number;
  confidence: number;
  summary: string;
  strengths: string[];
  conditions: string[];
  failureCases: string[];
  evidenceIds: string[];
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

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as Partial<AnalyzerApiError>;

    if (data.error?.message) {
      return data.error.message;
    }

    return JSON.stringify(data);
  } catch {
    return response.text();
  }
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
    const detail = await getErrorMessage(response);

    throw new Error(`Failed to fetch hero ${heroId}: ${response.status}${detail ? ` ${detail}` : ""}`);
  }

  return toUiHero((await response.json()) as DatasetHero);
}

export async function fetchHeroCounters(heroId: string): Promise<CounterHero[]> {
  const response = await fetch(`${getAnalyzerApiUrl()}/api/heroes/${encodeURIComponent(heroId)}/counters`);

  if (!response.ok) {
    const detail = await getErrorMessage(response);

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
      score: 0,
    };
  });
}

export async function analyzeCounterScores(
  targetHeroId: string,
  language = "en",
): Promise<AnalyzeScoresResponse> {
  const response = await fetch(`${getAnalyzerApiUrl()}/api/counters/analyze-score`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ targetHeroId, language }),
  });

  if (!response.ok) {
    throw await toAnalyzerError(response);
  }

  const data = (await response.json()) as AnalyzeScoresResponse;

  if (!Array.isArray(data.recommendations)) {
    throw new Error("Invalid analyze-score response: recommendations must be an array");
  }

  return data;
}

export async function analyzeCounterDetail(
  targetHeroId: string,
  counterHeroId: string,
  language = "en",
): Promise<AnalyzeDetailResponse> {
  const response = await fetch(`${getAnalyzerApiUrl()}/api/counters/analyze-detail`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ targetHeroId, counterHeroId, language }),
  });

  if (!response.ok) {
    throw await toAnalyzerError(response);
  }

  return (await response.json()) as AnalyzeDetailResponse;
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
    const detail = await getErrorMessage(response);

    throw new Error(`Failed to fetch heroes: ${response.status}${detail ? ` ${detail}` : ""}`);
  }

  const data = (await response.json()) as HeroesResponse;

  if (!Array.isArray(data.items)) {
    throw new Error("Invalid heroes response: items must be an array");
  }

  return data;
}
