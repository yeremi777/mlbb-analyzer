# Data Gathering Plan

This project should start with a small, reviewable dataset before building a larger data pipeline.

## Immediate Goal

Prepare enough data to support the first counter reveal MVP:

- 5-10 starter heroes.
- A small set of counter matchups.
- Clear reasons for each counter.
- Source notes for hero facts and matchup evidence.

## Suggested Starter Sources

- Official Mobile Legends pages for hero names, roles, and basic hero facts.
- Community wiki pages for cross-checking skills and hero behavior, only after license/attribution review.
- Manual player knowledge for early matchup reasoning.

Do not copy proprietary tier lists, rankings, or matchup scores directly from third-party sites.

## First Dataset Fields

Start with the existing planned schema:

- `heroes.json` for hero identity, role, lane, and source references.
- `counters.json` for matchup score, reasons, and counter types.
- `rules.json` later, after the static matchup flow works.

## Planned Raw-to-Normalized Official Data Flow

Future official-source ingestion must keep raw source captures separate from reviewed app data.

### Planned locations

```txt
public/data/raw/
  official-heroes/
    YYYY-MM-DD-mobilelegends-heroes.json
public/data/
  heroes.json
  counters.json
```

- Raw official snapshots should live under `public/data/raw/` when this flow is implemented.
- Normalized, app-consumable data remains under `public/data/`.
- Raw snapshots are source captures for audit and review; analyzer and UI code must not import raw snapshots directly.
- Normalized files are curated outputs shaped for the app schema, such as reviewed hero identity, role, lane, image URL, and source references.

### Flow

1. **Source approval**: confirm the source is documented in `docs/01-data-source-research.md` and explicitly approved for the intended access pattern.
2. **Raw capture**: a future manual-only fetch script may write a timestamped snapshot into `public/data/raw/official-heroes/`.
3. **Raw review**: inspect the snapshot for source permissions, attribution needs, field meaning, missing fields, ambiguity, and data quality.
4. **Normalization**: convert only approved and understood fields into `public/data/heroes.json` using the documented schema.
5. **Human review**: review normalized output before app/analyzer use. Empty or ambiguous fields should stay empty instead of being guessed.
6. **Validation**: run `npm run validate:heroes`, then relevant tests/lint/build before marking data usable.

### Explicit boundaries

- Raw snapshots are evidence, not app data.
- `public/data/heroes.json` is the reviewed app source of truth.
- Generated normalized data is not trusted until it passes human review and validation.
- Automated scraping, scheduled crawling, ID enumeration, and direct raw-to-app writes are out of scope until explicitly approved by a future task.

This section documents the intended design only. It does not add fetch scripts, scraping logic, generated data, or automated ingestion.

## Source Audit Notes

For each external source considered, record:

- Source name.
- URL.
- Data available.
- Whether it is official or community-made.
- Whether crawling or scraping is allowed.
- Attribution requirements.
- Risk level.
- Notes.

## Later AI Assistant Use

AI can later help summarize source evidence, draft matchup notes, and suggest first-pass scores. Keep it separate from the first foundation step.

## Future Player Analysis Data

Later versions may analyze a player by player ID or public profile data. Possible outputs include:

- Favorite heroes.
- Favorite roles.
- Favorite lanes.
- Recent match tendencies.
- Hero comfort pool.
- Draft risk based on repeated picks.

This should not be part of the MVP. Player-linked data needs source access review, privacy review, storage rules, and clear user-facing consent expectations before implementation.

Do not assume Mobile Legends exposes an official, allowed API for this use case until it is verified and documented.

## Future Pro Player and Gameplay Data

Later versions may analyze pro player statistics and gameplay clips. Possible outputs include:

- Pro player hero pool.
- Role and lane tendencies.
- Draft patterns.
- Matchup examples from competitive games.
- Gameplay tendencies from reviewed clips.

This data should be gathered only from approved or clearly usable sources. Video clips require additional care because analysis, storage, embedding, and redistribution rights may differ from ordinary text data.

Start with aggregate statistics and manually reviewed notes before attempting automated video analysis.
