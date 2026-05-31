# AGENTS.md

Project instructions for future Codex tasks in `mlbb-analyzer`.

## Project Goal

`mlbb-analyzer` is a website-first Mobile Legends: Bang Bang analysis app. The long-term goal is to help players understand hero picks, counters, draft threats, team composition, and matchup reasoning through deterministic analysis first and readable explanations later.

## Product Direction

- Build a browser-accessible website, not a mobile app.
- Keep the project flexible enough to expand beyond hero counters.
- The first MVP focuses on selecting one enemy hero and revealing ranked counter heroes.
- Future scope may include draft analysis, role/lane recommendations, synergy analysis, item/emblem suggestions, patch/meta notes, player profile analysis, pro player analysis, and an AI analysis assistant.

## MVP Scope

The first MVP should support:

- Selecting one enemy hero.
- Showing the selected enemy hero in a centered card.
- Reading counter data from a static dataset.
- Ranking counters deterministically.
- Revealing the top 3 counters in dramatic order: third, second, then first.
- Showing the remaining counters as a normal ranked list.

MVP non-goals:

- No backend.
- No database.
- No authentication.
- No live AI scoring or AI-generated recommendations in the first static MVP.
- No scraping or crawling.
- No live patch/meta ingestion.
- No player ID lookup or match history ingestion.
- No video clip analysis.

## Planned Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Static JSON dataset first
- Local analyzer logic first
- Vercel deployment later

Possible later additions:

- Supabase
- Next.js API routes
- AI route or edge function
- Player profile data pipeline, only if data access is allowed
- Pro player statistics and video-analysis pipeline, only if source rights are clear

## Dataset-First Development Rule

Dataset quality is central to this project. Do not build analyzer behavior around unclear or undocumented data.

Before adding or importing matchup data, document:

- Source name.
- URL.
- Data available.
- Whether the source is official or community-made.
- Whether scraping is allowed.
- Whether attribution is needed.
- What fields are safe to use.
- Risk level.
- Notes.

Do not blindly copy proprietary datasets from public websites. Publicly viewable data is not automatically open source.

## Analyzer Rule

The analyzer should produce structured, reviewable results. In the first MVP, rankings come from static scores in `counters.json`. Later phases may add an AI analysis assistant to help interpret dataset or approved source data.

For the MVP, static scores from `counters.json` are enough. Later scoring can combine matchup scores, rules, role/lane relevance, meta data, and AI-assisted analysis.

Player and pro analysis must follow stricter rules:

- Do not assume Mobile Legends player ID, match history, or pro data is accessible without permission.
- Do not collect personal player data until the source, terms, privacy risk, and allowed usage are documented.
- Do not analyze video clips unless usage rights, storage policy, and citation or attribution needs are clear.
- Keep personal player analysis separate from generic hero counter analysis.
- Prefer aggregated, non-sensitive statistics when possible.

## Preferred Future File Structure

```txt
src/
  app/
  components/
    hero/
    counter/
    layout/
  data/
    heroes.json
    counters.json
    rules.json
  lib/
    analyzer/
    validation/
  types/
    hero.ts
    counter.ts
```

The structure can evolve, but keep analyzer logic separate from UI components.

## Quality Rules

- Use TypeScript for app code.
- Keep implementation simple and explicit.
- Prefer deterministic pure functions for analyzer logic.
- Validate static datasets before relying on them.
- Avoid hidden network calls in analyzer behavior.
- Keep UI state separate from scoring logic.
- Add tests when analyzer behavior or data validation becomes non-trivial.
- Do not introduce backend, live AI, scraping, or auth until the project phase requires it.

## Commit Style

Use short conventional commits.

Examples:

```txt
chore: initialize project docs
docs: add dataset schema
feat: add static hero dataset
feat: add counter analyzer logic
feat: add counter reveal prototype
```
