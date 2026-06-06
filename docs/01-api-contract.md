# Analyzer API Contract (frontend)

What this frontend sends to and receives from the **analyzer API**. This is the
client-side contract only. Dataset authoring, storage, validation, sorting, and
AI scoring live in the analyzer API service and are documented in the backend
repo, not here.

Source of truth for the exact shapes is the code: `src/types/` and
`src/lib/analyzer-api.ts`. The tables below summarize what the UI relies on.

Configure the base URL with `NEXT_PUBLIC_ANALYZER_API_URL` (no trailing slash).

## Endpoints used by the frontend

| Method | Endpoint | Body | Response | Used for |
| --- | --- | --- | --- | --- |
| GET | `/api/heroes?page=&size=` | - | `{ items: Hero[], page, size, total, pages }` | Hero selector list (paginated) |
| GET | `/api/heroes/:uid` | - | `Hero` | Single target hero |
| GET | `/api/heroes/:uid/counters` | - | `HeroCounterResponse[]` | Static matchup context for a target |
| POST | `/api/counters/analyze-score` | `{ targetHeroId, language }` | `AnalyzeScoresResponse` | AI rank/score/confidence |
| POST | `/api/counters/analyze-detail` | `{ targetHeroId, counterHeroId, language }` | `AnalyzeDetailResponse` | AI matchup explanation |

`language` is `"en"` or `"id"` (defaults to `"en"`). The POST calls use
`credentials: "include"` so the rate-limit cookie is stored/sent. Only the
AI-prose fields come back localized; see `docs/05-frontend-design-conventions.md`
and the localization notes.

## Response types

```ts
// src/types/hero.ts
export type Hero = {
  uid: string;
  mlid: string;
  name: string;
  images: { head: string; smallmap?: string };
  roles: HeroRole[]; // "tank" | "fighter" | "assassin" | "mage" | "marksman" | "support"
  lanes: HeroLane[]; // "exp" | "gold" | "mid" | "roam" | "jungle"
  sourceRefs?: string[];
};

// GET /api/heroes/:uid/counters → array of:
type HeroCounterResponse = {
  targetHeroId: string;
  counterHero: Hero;
  reasons: string[];
  counterTypes: string[];
  proof?: CounterProof[];
  patchVersion?: string;
};

// POST /api/counters/analyze-score
type AnalyzeScoresResponse = {
  targetHeroId: string;
  source: "ai";
  recommendations: Array<{
    rank: number;
    counterHeroId: string;
    score: number;       // 0-100, produced by the API
    confidence: number;  // 0-100
  }>;
};

// POST /api/counters/analyze-detail
type AnalyzeDetailResponse = {
  targetHeroId: string;
  counterHeroId: string;
  source: "ai";
  score: number;
  confidence: number;
  summary: string;        // localized prose
  strengths: string[];    // localized prose
  conditions: string[];   // localized prose
  failureCases: string[]; // localized prose
  evidenceIds: string[];
};
```

`CounterProof` (`src/types/counter.ts`) is part of the counters response shape
but is not currently rendered by the UI; the displayed explanation comes from
`analyze-detail`.

## Hero field meanings

- `uid`: stable hero id used by UI and analyzer links (lowercase; may contain dots, e.g. `x.borg`).
- `mlid`: official MLBB hero id.
- `name`: display name in the selector and result cards.
- `images.head`: portrait URL (used by the round portrait UI).
- `images.smallmap`: optional alternate image URL.
- `roles`: one or more role ids, primary role first.
- `lanes`: zero or more lane ids.
- `sourceRefs`: optional reviewed source references.

## Hero example

```json
{
  "uid": "tigreal",
  "mlid": "6",
  "name": "Tigreal",
  "images": {
    "head": "https://akmweb.youngjoygame.com/web/svnres/img/mlbb/homepage/100_8b30576754be1a4f8bebd09df8d6bec7.png"
  },
  "roles": ["tank"],
  "lanes": ["roam"]
}
```

## Error envelope

Failed responses use:

```json
{ "error": { "code": "target_hero_not_found", "message": "..." } }
```

The frontend maps `error.code` (or HTTP status) to localized copy in
`src/i18n/error-messages.ts`; the raw English `message` is never shown to users.
Known codes: `target_hero_not_found`, `counter_hero_not_found`,
`counter_matchup_not_found`, `counter_data_not_found`. Status-based fallbacks
cover 429 (rate limited) and 501/502/504 (AI unavailable).
