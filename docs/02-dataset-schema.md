# Dataset Schema

These schemas describe the **analyzer API** payloads and the TypeScript types in `src/types/`. The frontend does not load JSON from `public/data/`; it fetches heroes and counters over HTTP.

## API Surfaces (frontend)

| Endpoint | Purpose |
| --- | --- |
| `GET /api/heroes?page=&size=` | Paginated hero list for the selector |
| `GET /api/heroes/:uid` | Single hero record |
| `GET /api/heroes/:uid/counters` | Ranked counter matchups for one target hero |

Configure the API base URL with `NEXT_PUBLIC_ANALYZER_API_URL`.

## Backend Dataset Layout (analyzer API)

The API service may store reviewed data however it prefers (database, object storage, or split JSON files). A common split-file layout on the **API side** is:

```txt
heroes.json
counters.json          # optional index listing per-target files
counters/<target-hero-id>.json
rules.json             # future rule-based scoring
```

When using a split index, `counters.json` lists paths such as `counters/miya.json`. Each file contains an array of `CounterMatchup` records for that target hero.

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
  reasons: string[];
  counterTypes: string[];
  proof?: CounterProof[];
  patchVersion?: string;
};

export type CounterProof = {
  id: string;
  category:
    | "skill-interaction"
    | "crowd-control-counter"
    | "damage-type-advantage"
    | "item-power-spike"
    | "mobility-advantage"
    | "range-advantage"
    | "kiting"
    | "sustain-anti-sustain"
    | "positioning-requirement"
    | "cooldown-window"
    | "vision-awareness"
    | "teamfight-role-counter"
    | "game-phase"
    | "execution-difficulty";
  priority: "primary" | "secondary" | "condition";
  impact: "low" | "medium" | "high";
  summary: string;
  worksBestWhen?: string[];
  failureCases?: string[];
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
  "reasons": [
    "Diggie can reduce the impact of Tigreal's crowd control setup.",
    "Diggie's teamfight protection helps allies survive Tigreal's engage."
  ],
  "counterTypes": ["anti-cc", "disengage", "teamfight"],
  "proof": [
    {
      "id": "diggie-time-journey-vs-tigreal-engage",
      "category": "skill-interaction",
      "priority": "primary",
      "impact": "high",
      "summary": "Tigreal's main threat is an AoE crowd-control engage, while Diggie's ultimate gives nearby allies cleanse and control immunity during the engage window.",
      "worksBestWhen": [
        "Diggie saves ultimate for Tigreal's real engage.",
        "Diggie stays close enough to protect the teammates Tigreal wants to catch."
      ],
      "failureCases": [
        "Tigreal baits Diggie's ultimate before committing.",
        "Tigreal catches Diggie out of position.",
        "Tigreal engages while Diggie's ultimate is on cooldown."
      ]
    }
  ],
  "patchVersion": "manual-v1"
}
```

## Counter Index Example

```json
{
  "files": [
    "counters/miya.json",
    "counters/tigreal.json"
  ]
}
```

Each file listed in the index must contain an array of `CounterMatchup` records where `targetHeroId` matches the file name. For example, `counters/miya.json` should contain Miya counter records.

## Counter Proof Fields

Counter proof entries are optional reviewed evidence records that explain why a matchup works. They are meant to answer:

```txt
What does the target hero want to do, what does the counter hero do to stop or punish it, and under what condition does it work?
```

- `id`: unique proof ID within the matchup, using readable kebab-case.
- `category`: the evidence category. Use `skill-interaction` for direct skill answers, `crowd-control-counter` for cleanse or immunity, `damage-type-advantage` for true damage or burst, `item-power-spike` for item-dependent matchups, and the other allowed values for conditions or matchup context.
- `priority`: `primary` for hero design and skill proof, `secondary` for supporting factors such as item timing, and `condition` for requirements such as positioning, cooldown, vision, game phase, or execution.
- `impact`: reviewer estimate of the proof's matchup importance: `low`, `medium`, or `high`.
- `summary`: concrete interaction summary. It should state the target hero's threat and the counter hero's answer.
- `worksBestWhen`: optional conditions that make the proof reliable.
- `failureCases`: optional cases where the counter can fail. Add these whenever timing, cooldown, positioning, or item dependency matters.

Proof priority rules:

- Hero design and skill interaction is the strongest proof. Example: Diggie's ultimate directly answers Tigreal's AoE crowd-control engage.
- Item power spikes are secondary proof. Example: Karrie's attack-speed and on-hit item timing improves her ability to melt Tigreal, but she still needs safe positioning.
- AI scoring and explanations must use supplied proof, reasons, and counter types only. AI must not invent interactions, item requirements, or failure cases.

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

Validation runs against datasets maintained by the **analyzer API** (not this frontend repo). If you keep a copy of the validation scripts here, point them at the API’s dataset paths.

The hero validator checks that:

- the dataset is a JSON array of hero objects;
- required string fields are present (`uid`, `mlid`, and `name`);
- `images` is an object with a string `head` field and optional string `smallmap` field;
- `uid` is unique and uses lowercase UID format;
- `roles` is a non-empty array of allowed role IDs;
- `lanes` is an array containing only allowed lane IDs;
- `sourceRefs`, when present, is an array of non-empty strings;

The script prints all validation errors and exits non-zero when the dataset is invalid.

## Counter Dataset Validation

Counter validation runs on the analyzer API’s counter store. If the API uses a `files` index in `counters.json`, the validator loads and checks every referenced split counter file.

The counter validator checks that:

- the hero dataset and resolved counter records are JSON arrays;
- every `targetHeroId` and `counterHeroId` references an existing hero `uid`;
- target and counter IDs are different;
- duplicate target/counter pairs are rejected;
- `score` is not present in static counter records;
- `reasons` is a non-empty array of non-empty strings;
- `proof`, when present, is a non-empty array;
- proof entries have non-empty `id` and `summary` fields;
- proof `category`, `priority`, and `impact` use the allowed values;
- proof `worksBestWhen` and `failureCases`, when present, contain only non-empty strings;
- proof `scoreHint` is not present in static proof records;
- duplicate proof IDs inside the same matchup are rejected.

## Naming Rules

- Hero `uid` values use lowercase UID format and may include dots for official-style names such as `x.borg`.
- `mlid` should match the official MLBB hero ID from the hero meta source.
- `images.head` should use the provided portrait URL when available.
- `images.smallmap` should use the verified official small-map or alternate display image URL when available.
- `roles` should list the primary role first.
- `lanes` should use project lane IDs such as `exp`, `gold`, `mid`, `roam`, and `jungle`.
- `sourceRefs` is optional while references are being filled manually, but should list reviewed source references when known.
- Every matchup needs at least one human-readable reason.
- Reasons should explain the interaction, not only state that one hero is good.
- `counterTypes` should reference meaningful interaction categories such as `anti-cc`, `anti-dash`, `burst`, or `protect`.
- `proof.id` should use readable kebab-case and be unique within its matchup.
- `proof.summary` should explain why the counter works, not only restate that the matchup is favorable.
- `proof.priority` should keep direct hero design and skill interactions as `primary`, item timing as `secondary`, and positioning, cooldown, vision, game phase, or execution requirements as `condition`.
- Static counter records must not include `score` or `proof.scoreHint`; the future AI analyzer produces scores from reviewed context.
- `patchVersion` is optional during early manual curation, but should be added when patch-specific data becomes important.
