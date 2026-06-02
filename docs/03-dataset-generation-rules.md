# Dataset Generation Rules

The dataset may be manually curated first and later generated or assisted by scripts. Whether data is written manually or generated, it must follow consistent rules.

## Hero IDs

Create hero IDs from the official English hero name:

- Convert to lowercase.
- Replace spaces with hyphens.
- Remove punctuation unless needed for clarity.
- Keep IDs stable after release.

Examples:

```txt
Tigreal -> tigreal
Joy -> joy
Luo Yi -> luo-yi
```

## Roles

Assign roles using stable lowercase labels. Prefer official or commonly accepted Mobile Legends roles.

Examples:

```txt
tank
fighter
assassin
mage
marksman
support
```

Heroes may have more than one role when the secondary role is meaningful.

## Lanes

Assign lanes based on common use, not every theoretical possibility.

Examples:

```txt
roam
exp
gold
mid
jungle
```

## Raw-to-Normalized Review Rules

Generated or fetched source snapshots are not app-ready data. Use this path when future tasks introduce official-source snapshots:

```txt
public/data/raw/official-heroes/*.json  -> review -> public/data/heroes.json
```

Rules:

- Keep raw source snapshots under `public/data/raw/`; do not import them from UI or analyzer code.
- Keep normalized app data under `public/data/`, especially `public/data/heroes.json`.
- Preserve `sourceRefs` so every normalized record points back to reviewed evidence or an internal manual-curation reference.
- Normalize only fields whose meaning is understood and allowed by the source audit.
- Leave `mlid`, `images.head`, `images.smallmap`, or `lanes` empty when the raw source is missing, ambiguous, or not manually reviewed.
- Do not infer lane assignments from role alone.
- Do not infer matchup scores, counter reasons, or tags from official hero identity data.
- Review generated output before use, then run the relevant validation command.

## Tags

Tags describe gameplay behavior and matchup interactions. Use lowercase kebab-case.

Tag examples:

```txt
cc-heavy
anti-cc
dash
anti-dash
burst
sustain
poke
shield
heal
tank-shred
pickoff
split-push
teamfight
late-game
early-game
high-mobility
immobile
engage
disengage
protect
frontline
backline
```

Avoid vague tags that cannot be used by analyzer rules.

## Counter Scoring

Static counter records must not include numeric scores. Scores are produced later by the AI analyzer from reviewed context such as reasons, counter types, proof categories, proof priority, proof impact, works-best conditions, and failure cases.

More and better-reviewed context can support a stronger AI-produced score, but the dataset should store the evidence rather than the result.

## Human-Readable Reasons

Each matchup must include at least one reason. Good reasons explain the interaction:

- What the target hero wants to do.
- What the counter hero prevents, punishes, or outvalues.
- Whether the counter depends on timing, lane, teamfight, or composition.

Avoid generic reasons such as "This hero is strong" or "Good counter".

## AI Analysis Assistant Later

AI may later help draft tags, matchup notes, first-pass scores, analyst recommendations, or summary explanations. Do not make this part of the first foundation step.

Review checklist:

- Hero IDs are valid.
- Roles and lanes are realistic.
- Tags match the hero's actual gameplay.
- Counter records do not include static scores.
- Reasons are specific and readable.
- Data does not copy proprietary rankings from another website.

## Dataset Consistency Validation

Future validation scripts should check:

- Every `targetHeroId` exists in `heroes.json`.
- Every `counterHeroId` exists in `heroes.json`.
- Scores are numbers from 0 to 100.
- Reasons are non-empty arrays.
- Tags use lowercase kebab-case.
- Counter rules reference known tags.
- Duplicate matchup entries are rejected or flagged.
