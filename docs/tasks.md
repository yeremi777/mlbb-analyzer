# Tasks

Use this file as the lightweight kanban source for Hermes/Codex work. Each task should stay small enough to complete in one focused agent run.

## Workflow

Statuses:

- `Backlog`: known work, not ready to start.
- `Ready`: enough context exists for an agent to begin.
- `In Progress`: currently being worked.
- `Needs Review`: implementation is complete, needs human or agent review.
- `Done`: accepted and verified.
- `Blocked`: cannot continue without a decision or external access.

Task rules:

- Pick one `Ready` task at a time.
- Do not scrape, crawl, or import external data unless the task explicitly says to do so.
- Keep raw source snapshots separate from normalized app data.
- Keep analyzer behavior deterministic unless a task explicitly introduces AI explanation.
- Run relevant validation before marking a task `Done`.

## Current Priority

1. `chore: add counter dataset validation`
2. `feat: expose typed data accessors for public data`
3. `feat: add official hero fetch script`
4. `feat: add hero normalizer script`
5. `feat: add AI explanation route`

## Ready

### data: define hero dataset schema

Status: Done

Goal:

Define the normalized hero dataset shape before gathering the full hero list.

Scope:

- Update the `Hero` type.
- Update `public/data/heroes.json` to match the target shape.
- Update dataset docs to describe the fields.

Files:

- `src/types/hero.ts`
- `public/data/heroes.json`
- `docs/02-dataset-schema.md`

Acceptance Criteria:

- Hero records support `id`, `officialId`, `name`, `imageUrl`, `roles`, `lanes`, `sourceRefs`, and `updatedAt`.
- `roles` keeps the primary role first.
- `lanes` uses project lane IDs such as `exp`, `gold`, `mid`, `roam`, and `jungle`.
- Existing UI still works with the updated data shape.
- `npm run lint` passes, allowing unrelated existing warnings.

Non-Goals:

- Do not scrape or fetch official hero data.
- Do not add counter logic changes.
- Do not add AI analysis.

### chore: add hero dataset validation

Status: Done

Goal:

Add a repeatable validation step so static hero data can be trusted before the analyzer relies on it.

Scope:

- Add a validation script for `public/data/heroes.json`.
- Add an npm script to run it.
- Document what the validator checks.

Files:

- `scripts/validate-heroes.ts`
- `package.json`
- `public/data/heroes.json`
- `docs/02-dataset-schema.md`

Acceptance Criteria:

- Validation checks required fields.
- Validation rejects duplicate hero IDs.
- Validation checks `id` is lowercase kebab-case.
- Validation checks allowed roles.
- Validation checks allowed lanes.
- Validation checks `sourceRefs` is not empty.
- Validation checks `updatedAt` is an ISO date string.
- The script exits non-zero on invalid data.

Non-Goals:

- Do not fetch remote sources.
- Do not normalize raw source data yet.
- Do not validate counter matchups in this task.

### docs: audit official MLBB hero source

Status: Done

Goal:

Document the official hero source before any scraping or importing work happens.

Scope:

- Record the official source URL.
- Document available fields.
- Document whether the source is static HTML, rendered HTML, embedded JSON, or API-backed.
- Document usage risk and attribution uncertainty.

Files:

- `docs/01-data-source-research.md`

Acceptance Criteria:

- Official source entry includes source name, URL, data available, usage type, scraping status, attribution status, risk level, and notes.
- Notes clearly state that scraping should not run until explicitly approved.
- Notes identify which fields are safe to manually review first: name, image URL, roles, and lanes if available.

Non-Goals:

- Do not scrape the website.
- Do not create an automated fetch script.
- Do not copy third-party community datasets.

### data: create starter official hero records

Status: Done

Goal:

Create a small manually reviewed hero dataset using the normalized schema.

Scope:

- Add or update 10 starter hero records.
- Include only fields that are confidently known or clearly sourced.
- Keep unknown image URLs or lanes empty rather than guessed.

Files:

- `public/data/heroes.json`
- `docs/01-data-source-research.md`

Acceptance Criteria:

- At least 10 heroes exist in `public/data/heroes.json`.
- Every record includes `sourceRefs`.
- Every record passes hero dataset validation.
- Any uncertain lane data is omitted or left as an empty array.

Non-Goals:

- Do not automate scraping.
- Do not fill the full hero roster yet.
- Do not copy proprietary tier-list or matchup data.

## Backlog

### feat: wire analyzer UI to public datasets

Status: Done

Goal:

Make the visible counter analyzer use `public/data/heroes.json` and `public/data/counters.json` instead of legacy mock data.

Scope:

- Keep the current `CounterAnalyzer`, `HeroSelector`, `HeroPortrait`, and `CounterCard` UI flow.
- Adapt public hero records into the UI shape where needed.
- Use deterministic recommendations from `src/lib/analyzer/counters.ts`.
- Remove fallback mock counter recommendations from the active analyzer path.

Files:

- `src/lib/hero-data.ts`
- `src/components/counter-analyzer.tsx`
- `src/components/hero-selector.tsx`
- `src/components/hero-portrait.tsx`
- `src/components/counter-card.tsx`
- `public/data/heroes.json`
- `public/data/counters.json`

Acceptance Criteria:

- Hero selector options come from `public/data/heroes.json`.
- Selected hero portraits use `imageUrl` when present.
- Counter recommendations come from `public/data/counters.json`.
- Ranking order is produced by `getCounterRecommendations`.
- No legacy mock `COUNTER_DATA` recommendations appear in the active analyzer path.
- `npm run lint` passes, allowing unrelated existing warnings.
- `npx tsc --noEmit` passes.

Completed:

- 2026-06-01

Non-Goals:

- Do not scrape or fetch external data.
- Do not change counter scores.
- Do not add AI analysis.
- Do not redesign the UI.

### chore: design raw-to-normalized data flow

Status: Done

Goal:

Design the pipeline for future official-source ingestion.

Scope:

- Define where raw official snapshots live.
- Define how normalized `public/data/heroes.json` is generated.
- Define review rules for fields that may be incomplete or ambiguous.

Files:

- `docs/08-data-gathering-plan.md`
- `docs/03-dataset-generation-rules.md`

Acceptance Criteria:

- Raw snapshots have a planned location such as `public/data/raw/`.
- Normalized app data remains in `public/data/`.
- The flow documents that generated data must be reviewed before use.

Non-Goals:

- Do not implement the fetch script.
- Do not run scraping.

### feat: add official hero fetch script

Status: Backlog

Goal:

Create a script that fetches approved official hero source data into a raw snapshot.

Scope:

- Fetch only from approved and documented official source URLs.
- Write raw data to a snapshot file.
- Never write directly to normalized app data.

Files:

- `scripts/fetch-official-heroes.ts`
- `public/data/raw/`
- `package.json`

Acceptance Criteria:

- Script is manually run only.
- Script writes a timestamped raw snapshot.
- Script has clear error output.
- Script respects documented source restrictions.

Non-Goals:

- Do not normalize the data.
- Do not schedule scraping.
- Do not bypass source restrictions.

### feat: add hero normalizer script

Status: Backlog

Goal:

Convert reviewed raw hero snapshots into normalized app data.

Scope:

- Read from `public/data/raw/`.
- Produce or update `public/data/heroes.json`.
- Preserve source references.

Files:

- `scripts/normalize-heroes.ts`
- `public/data/raw/`
- `public/data/heroes.json`

Acceptance Criteria:

- Normalizer outputs records matching the `Hero` type.
- Normalizer does not invent missing lane data.
- Output passes hero dataset validation.

Non-Goals:

- Do not fetch remote data.
- Do not infer counters.

### chore: add counter dataset validation

Status: Done

Goal:

Validate matchup data before expanding counter rankings.

Scope:

- Add validation for `public/data/counters.json`.
- Ensure all referenced heroes exist.

Files:

- `scripts/validate-counters.ts`
- `public/data/counters.json`
- `public/data/heroes.json`
- `package.json`

Acceptance Criteria:

- Validation checks `targetHeroId` exists.
- Validation checks `counterHeroId` exists.
- Validation rejects self-counters.
- Validation checks score is `0-100`.
- Validation checks reasons are present.
- Validation rejects duplicate target/counter pairs.

Non-Goals:

- Do not change scoring rules.
- Do not add new matchup data.

Completed:

- 2026-06-01

### feat: expose typed data accessors for public data

Status: Done

Goal:

Keep app code typed while public JSON remains accessible under `/data`.

Scope:

- Review existing `src/data/*.ts` wrappers.
- Keep imports centralized.
- Avoid components importing JSON directly.

Files:

- `src/data/heroes.ts`
- `src/data/counters.ts`
- `src/lib/hero-data.ts`

Acceptance Criteria:

- Components use typed exports, not direct JSON imports.
- Public JSON remains available at `/data/heroes.json` and `/data/counters.json`.
- Build or lint verifies the data access path.

Non-Goals:

- Do not add a backend API route.
- Do not fetch public JSON at runtime unless needed.

Completed:

- 2026-06-01

### feat: add AI explanation route

Status: Backlog

Goal:

Add AI-generated readable explanations after deterministic analyzer output is stable.

Scope:

- Use deterministic analyzer results as input.
- Ask AI only to explain, not rank.
- Return structured explanation fields.

Files:

- `src/app/api/analyze/route.ts`
- `src/lib/analyzer/`

Acceptance Criteria:

- Counter ranking still comes from static data and analyzer logic.
- AI output references only provided structured analyzer results.
- Route handles missing or invalid hero IDs.

Non-Goals:

- Do not let AI invent scores.
- Do not scrape live data.
- Do not add authentication.
