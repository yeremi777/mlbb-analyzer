# Development Rules

These rules guide implementation after the documentation phase.

## Language and Stack

- Use TypeScript.
- Use Next.js when project setup begins.
- Use Tailwind CSS for styling.
- Use shadcn/ui for reusable UI primitives when appropriate.
- Load heroes and counter matchups from the analyzer API (`src/lib/analyzer-api.ts`).
- Keep API URL configuration in environment variables, not in source code.

## Keep Code Simple

Prefer explicit code over premature abstraction. Add helper functions only when they reduce real duplication or isolate important logic.

Keep these areas separate:

- API client (`analyzer-api.ts`).
- Type definitions (`src/types/`).
- UI components.
- UI state and animation timing.

## MVP Restrictions (this frontend repo)

For the MVP:

- No embedded database or auth in the Next.js app.
- No static JSON datasets checked into this repo for runtime use.
- No scraper or crawler in the frontend.
- No live patch/meta fetch from the browser.

Counter ranking and matchup records are owned by the analyzer API. The UI fetches ranked results from API routes such as `GET /api/heroes` and `GET /api/heroes/:id/counters`.

## Component Naming

Use descriptive component names based on UI responsibility.

Examples:

```txt
HeroSearch
SelectedHeroCard
CounterReveal
CounterRevealCard
CounterRankingList
CounterRankingRow
```

Avoid vague names such as `CardSection`, `MainBox`, or `DataView` unless the component is truly generic.

## Data Validation Expectations

Future validation should verify:

- All hero IDs are unique.
- All matchup hero references exist.
- Scores are in the 0-100 range.
- Reasons are present.
- Tags use lowercase kebab-case.
- Rule references point to known tags.

Data validation should run before relying on generated or manually edited datasets.

## API Client Expectations

- API helpers should be thin wrappers around `fetch`.
- UI components should not hardcode API base URLs; use `NEXT_PUBLIC_ANALYZER_API_URL`.
- Handle loading and error states when the API is unavailable.
- Treat API response shapes as defined in `docs/02-dataset-schema.md` and `src/types/`.

## Commit Message Style

Use short conventional commits.

Examples:

```txt
chore: initialize project docs
docs: add dataset schema
feat: add static hero dataset
feat: add counter analyzer logic
feat: add counter reveal prototype
```
