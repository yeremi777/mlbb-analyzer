# Development Rules

These rules guide implementation after the documentation phase.

## Language and Stack

- Use TypeScript.
- Use Next.js when project setup begins.
- Use Tailwind CSS for styling.
- Use shadcn/ui for reusable UI primitives when appropriate.
- Use static JSON data first.
- Use local analyzer logic first.

## Keep Code Simple

Prefer explicit code over premature abstraction. Add helper functions only when they reduce real duplication or isolate important logic.

Keep these areas separate:

- Static data.
- Type definitions.
- Analyzer logic.
- UI components.
- UI state and animation timing.

## MVP Restrictions

For the MVP:

- No backend.
- No database.
- No authentication.
- No live AI scoring in the first static MVP.
- No scraper.
- No crawler.
- No live patch/meta fetch.

The app should work from local static data.

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

## Analyzer Expectations

- Analyzer functions should be deterministic.
- Analyzer functions should avoid UI dependencies.
- Analyzer functions should not call APIs.
- MVP analyzer functions should not call live AI services directly.
- Analyzer functions should return enough structured data for the UI to display ranking and reasons.

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
