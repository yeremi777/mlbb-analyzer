# Data Gathering Plan

This project should start with a small, reviewable dataset before building a larger data pipeline. **Dataset storage and ingestion live in the analyzer API**, not in the Next.js frontend.

## Immediate Goal

Prepare enough data to support the first counter reveal MVP:

- 5-10 starter heroes.
- A small set of counter matchups.
- Clear reasons for each counter.
- Source notes for hero facts and matchup evidence.

The frontend consumes this through the analyzer API after it is reviewed and published.

## Suggested Starter Sources

- Official Mobile Legends pages for hero names, roles, and basic hero facts.
- Community wiki pages for cross-checking skills and hero behavior, only after license/attribution review.
- Manual player knowledge for early matchup reasoning.

Do not copy proprietary tier lists, rankings, or matchup scores directly from third-party sites.

## First Dataset Fields

Start with the schema in `docs/02-dataset-schema.md`:

- Hero records (`uid`, `mlid`, `name`, `images`, `roles`, `lanes`, `sourceRefs`).
- Counter matchups per target hero (`targetHeroId`, `counterHeroId`, `reasons`, `counterTypes`, optional `proof`).
- `rules.json` later, after the matchup flow works.

## Planned Raw-to-Normalized Official Data Flow (analyzer API)

Future official-source ingestion must keep raw source captures separate from reviewed API data.

### Planned locations (API service)

```txt
raw/
  official-heroes/
    YYYY-MM-DD-mobilelegends-heroes.json
heroes.json                    # or equivalent DB table
counters.json                  # optional index
counters/
  <target-hero-id>.json
```

- Raw official snapshots are for audit and review only.
- Normalized records are curated outputs shaped for the API schema.
- The Next.js app calls HTTP endpoints; it does not read these paths from disk.

### Flow

1. **Source approval**: confirm the source is documented in `docs/01-data-source-research.md` and explicitly approved for the intended access pattern.
2. **Raw capture**: a manual-only fetch job writes timestamped snapshots under `raw/official-heroes/` for explicit approved URLs only.
3. **Raw review**: inspect the snapshot for source permissions, attribution needs, field meaning, missing fields, ambiguity, and data quality.
4. **Normalization**: convert only approved and understood fields into the API’s hero catalog using the documented schema.
5. **Human review**: review normalized output before exposing it via the API. Empty or ambiguous fields should stay empty instead of being guessed.
6. **Validation**: run dataset validation on the API side before marking data usable.

### Explicit boundaries

- Raw snapshots are evidence, not API responses.
- The reviewed hero catalog on the API is the source of truth for `GET /api/heroes`.
- Generated normalized data is not trusted until it passes human review and validation.
- Automated scheduled crawling, ID enumeration, and direct raw-to-production writes are out of scope until explicitly approved by a future task.
- Manual fetch jobs must only request explicit approved URLs supplied by the operator.

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

AI can later summarize source evidence and produce matchup scores from reviewed context. Keep AI scoring separate from static dataset authoring on the API.

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
