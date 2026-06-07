# Roadmap

## Phase 0 - Documentation

- Project context.
- Dataset source research.
- Dataset schema.
- Dataset generation rules.
- Analyzer rules.
- UI counter reveal flow.
- Development rules.
- Data gathering plan.

## Phase 1 - Foundation

- Set up Next.js.
- Add TypeScript and Tailwind CSS.
- Create initial project structure.
- Prepare data source audit notes.
- Stand up analyzer API with starter hero and counter datasets.

## Phase 2 - Counter Reveal MVP

- Connect frontend to analyzer API (`NEXT_PUBLIC_ANALYZER_API_URL`).
- Add hero search.
- Add selected hero card.
- Add top 3 counter reveal.
- Add ranked counter list.

## Navigation Direction

- Keep `/` as the counter analyzer during the early MVP.
- Later, turn `/` into a simple project landing and feature hub with friendly entry points.
- Move major tools to dedicated routes such as `/counters`, `/synergies`, `/draft`, and future analyzer sections.
- Keep each feature route focused on the actual tool experience, not marketing copy.

## Phase 3 - Dataset Tooling

- Validation script.
- Dataset generator script.
- Source audit.
- Manual review workflow.

## Phase 4 - Draft Analyzer

- Select 1-5 enemy heroes.
- Recommend counters.
- Identify threats.
- Add role and lane recommendations.

## Phase 5 - AI Analysis Assistant

- Help summarize dataset-backed matchup evidence.
- Suggest first-pass scores for human review.
- Support Indonesian and English explanations.

## Phase 6 - Community and Meta

- User feedback.
- Patch notes.
- Meta and tier notes.
- Admin review tools.

## Phase 7 - Player Profile Analysis

- Investigate whether player ID and match history data can be accessed through allowed sources.
- Audit privacy, terms, storage, and display rules before collecting player-linked data.
- Analyze favorite heroes, favorite roles, lane tendencies, and recent hero usage.
- Compare player tendencies against hero counter, role, and draft analysis.
- Keep player-specific analysis separate from the generic counter analyzer.

## Phase 8 - Pro Player and Gameplay Analysis

- Audit pro player statistics sources and tournament data rights.
- Investigate whether official or permitted gameplay clips can be used for analysis.
- Extract aggregate pro player hero pools, role tendencies, matchup examples, and draft patterns.
- Explore video-assisted analysis only after source rights, storage rules, and attribution requirements are clear.
- Use pro data as supporting evidence, not as the only source of truth for recommendations.
