# Dataset Schema

The MVP should begin with static JSON files and TypeScript types. These schemas can evolve as analyzer rules become more advanced.

## Planned Data Files

```txt
src/data/heroes.json
src/data/counters.json
src/data/rules.json
```

## TypeScript Types

```ts
export type Hero = {
  id: string;
  name: string;
  roles: string[];
  lanes: string[];
  tags: string[];
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

## Hero Examples

```json
{
  "id": "tigreal",
  "name": "Tigreal",
  "roles": ["tank"],
  "lanes": ["roam"],
  "tags": ["cc-heavy", "engage", "frontline", "teamfight"]
}
```

```json
{
  "id": "diggie",
  "name": "Diggie",
  "roles": ["support"],
  "lanes": ["roam"],
  "tags": ["anti-cc", "disengage", "protect", "teamfight"]
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

## Naming Rules

- Hero IDs use lowercase kebab-case.
- Tags use lowercase kebab-case.
- Scores use a 0-100 range.
- Every matchup needs at least one human-readable reason.
- Reasons should explain the interaction, not only state that one hero is good.
- `counterTypes` should reference meaningful interaction categories such as `anti-cc`, `anti-dash`, `burst`, or `protect`.
- `patchVersion` is optional during early manual curation, but should be added when patch-specific data becomes important.
