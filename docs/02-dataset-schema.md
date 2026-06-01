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
  uid: string;
  mlid: string;
  name: string;
  images: {
    head: string;
    smallmap?: string;
  };
  roles: HeroRole[];
  lanes: HeroLane[];
  sourceRefs?: string[];
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

- `uid`: stable hero UID from the provided hero meta dataset, used by UI and analyzer links.
- `mlid`: official MLBB hero ID from the provided hero meta dataset.
- `name`: display name shown in the selector and result cards.
- `images.head`: portrait URL from the provided `portrait` field.
- `images.smallmap`: optional verified official small-map or alternate display image URL.
- `roles`: one or more allowed role IDs; the primary role must be first. Allowed values: `tank`, `fighter`, `assassin`, `mage`, `marksman`, and `support`.
- `lanes`: zero or more project lane IDs. Allowed values: `exp`, `gold`, `mid`, `roam`, and `jungle`.
- `sourceRefs`: optional reviewed source references. It can be filled manually later.

## Hero Examples

```json
{
  "uid": "tigreal",
  "mlid": "6",
  "name": "Tigreal",
  "images": {
    "head": "https://akmweb.youngjoygame.com/web/svnres/img/mlbb/homepage/100_8b30576754be1a4f8bebd09df8d6bec7.png",
    "smallmap": "https://akmweb.youngjoygame.com/web/svnres/img/mlbb/homepage/100_4e0005dbfb1376beaccc54ef7aa39375.png"
  },
  "roles": ["tank"],
  "lanes": ["roam"],
  "sourceRefs": [
    "https://www.mobilelegends.com/hero/detail?channelid=2678742&heroid=6"
  ]
}
```

```json
{
  "uid": "diggie",
  "mlid": "48",
  "name": "Diggie",
  "images": {
    "head": "https://example.com/diggie.png"
  },
  "roles": ["support"],
  "lanes": ["roam"],
  "sourceRefs": ["manual-curation:starter-v1"]
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
- required string fields are present (`uid`, `mlid`, and `name`);
- `images` is an object with a string `head` field and optional string `smallmap` field;
- `uid` is unique and uses lowercase UID format;
- `roles` is a non-empty array of allowed role IDs;
- `lanes` is an array containing only allowed lane IDs;
- `sourceRefs`, when present, is an array of non-empty strings;

The script prints all validation errors and exits non-zero when the dataset is invalid.

## Naming Rules

- Hero `uid` values use lowercase UID format and may include dots for official-style names such as `x.borg`.
- `mlid` should match the official MLBB hero ID from the hero meta source.
- `images.head` should use the provided portrait URL when available.
- `images.smallmap` should use the verified official small-map or alternate display image URL when available.
- `roles` should list the primary role first.
- `lanes` should use project lane IDs such as `exp`, `gold`, `mid`, `roam`, and `jungle`.
- `sourceRefs` is optional while references are being filled manually, but should list reviewed source references when known.
- Scores use a 0-100 range.
- Every matchup needs at least one human-readable reason.
- Reasons should explain the interaction, not only state that one hero is good.
- `counterTypes` should reference meaningful interaction categories such as `anti-cc`, `anti-dash`, `burst`, or `protect`.
- `patchVersion` is optional during early manual curation, but should be added when patch-specific data becomes important.
