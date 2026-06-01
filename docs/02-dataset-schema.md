# Dataset Schema

The MVP should begin with static JSON files and TypeScript types. These schemas can evolve as analyzer rules become more advanced.

## Planned Data Files

```txt
public/data/heroes.json
public/data/counters.json
public/data/rules.json
```

## TypeScript Types

```ts
export const HERO_ROLES = [
  "tank",
  "fighter",
  "assassin",
  "mage",
  "marksman",
  "support",
] as const;

export const HERO_LANES = ["exp", "gold", "mid", "roam", "jungle"] as const;

export type HeroRole = (typeof HERO_ROLES)[number];
export type HeroLane = (typeof HERO_LANES)[number];

export type Hero = {
  id: string;
  officialId: string;
  name: string;
  imageUrl: string;
  roles: HeroRole[];
  lanes: HeroLane[];
  sourceRefs: string[];
  updatedAt: string;
};

export type CounterMatchup = {
  targetHeroId: string;
  counterHeroId: string;
  score: number;
  reasons: string[];
  counterTypes: string[];
  patchVersion?: string;
};

export type CounterRule = {
  id: string;
  targetTag: string;
  counterTag: string;
  bonus: number;
  reason: string;
};
```

## Hero Fields

- `id`: stable project ID in lowercase kebab-case, used by UI and analyzer links.
- `officialId`: official MLBB hero ID when it has been manually verified, otherwise an empty string.
- `name`: display name shown in the selector and result cards.
- `imageUrl`: verified official display image URL when available, otherwise an empty string.
- `roles`: one or more allowed role IDs; the primary role must be first. Allowed values: `tank`, `fighter`, `assassin`, `mage`, `marksman`, and `support`.
- `lanes`: zero or more project lane IDs. Allowed values: `exp`, `gold`, `mid`, `roam`, and `jungle`.
- `sourceRefs`: reviewed source references used for the record. Use a URL for external sources or an internal reference such as `manual-curation:starter-v1` for project-created starter data. It must not be empty.
- `updatedAt`: last manual update date in `YYYY-MM-DD` format.

## Hero Examples

```json
{
  "id": "tigreal",
  "officialId": "6",
  "name": "Tigreal",
  "imageUrl": "",
  "roles": ["tank"],
  "lanes": ["roam"],
  "sourceRefs": [
    "https://www.mobilelegends.com/hero/detail?channelid=2678742&heroid=6"
  ],
  "updatedAt": "2026-06-01"
}
```

```json
{
  "id": "diggie",
  "officialId": "",
  "name": "Diggie",
  "imageUrl": "",
  "roles": ["support"],
  "lanes": ["roam"],
  "sourceRefs": ["manual-curation:starter-v1"],
  "updatedAt": "2026-06-01"
}
```

## Counter Matchup Example

```json
{
  "targetHeroId": "tigreal",
  "counterHeroId": "diggie",
  "score": 92,
  "reasons": [
    "Diggie can reduce the impact of Tigreal's crowd control setup.",
    "Diggie's teamfight protection helps allies survive Tigreal's engage."
  ],
  "counterTypes": ["anti-cc", "disengage", "teamfight"],
  "patchVersion": "manual-v1"
}
```

## Counter Rule Example

```json
{
  "id": "anti-cc-vs-cc-heavy",
  "targetTag": "cc-heavy",
  "counterTag": "anti-cc",
  "bonus": 15,
  "reason": "Anti-CC tools reduce the value of crowd-control-heavy enemy heroes."
}
```

## Hero Dataset Validation

Run hero validation with:

```bash
npm run validate:heroes
```

The hero validator checks that:

- the dataset is a JSON array of hero objects;
- required string fields are present (`id`, `officialId`, `name`, `imageUrl`, and `updatedAt`), with `officialId` and `imageUrl` allowed to be empty while unknown;
- `id` is unique and uses lowercase kebab-case;
- `roles` is a non-empty array of allowed role IDs;
- `lanes` is an array containing only allowed lane IDs;
- `sourceRefs` is a non-empty array of non-empty strings;
- `updatedAt` is a valid ISO date string in `YYYY-MM-DD` format.

The script prints all validation errors and exits non-zero when the dataset is invalid.

## Naming Rules

- Hero IDs use lowercase kebab-case.
- `officialId` should match the official MLBB hero ID when verified, or stay empty while unknown.
- `imageUrl` should use the verified official display image URL when available, or stay empty while unknown.
- `roles` should list the primary role first.
- `lanes` should use project lane IDs such as `exp`, `gold`, `mid`, `roam`, and `jungle`.
- `sourceRefs` must not be empty and should list reviewed source references for the record.
- `updatedAt` uses `YYYY-MM-DD`.
- Scores use a 0-100 range.
- Every matchup needs at least one human-readable reason.
- Reasons should explain the interaction, not only state that one hero is good.
- `counterTypes` should reference meaningful interaction categories such as `anti-cc`, `anti-dash`, `burst`, or `protect`.
- `patchVersion` is optional during early manual curation, but should be added when patch-specific data becomes important.
