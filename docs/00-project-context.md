# Project Context

`mlbb-analyzer` is a website-first Mobile Legends: Bang Bang analysis app. It is intended to help players understand hero picks, counters, draft threats, team composition, and matchup reasoning.

## Website-First Direction

The app should be accessible from a browser first. A website is easier to share, deploy, iterate, and test across desktop and mobile browsers. This also fits the early product goal: fast hero lookup and readable analysis without requiring users to install a mobile app.

## MVP Focus

The first MVP starts with one clear interaction:

1. The user selects one enemy hero.
2. The selected hero appears in a centered card.
3. The app analyzes available counter data and returns counter heroes.
4. Counter heroes are shown as a ranked result.
5. The top 3 counters are revealed in dramatic order: third, second, first.

This scope is intentionally narrow. A one-hero counter flow is simple enough to validate the dataset, analyzer rules, and reveal experience before expanding into full draft analysis.

## Future Expansion

The project should not be designed as a counters-only tool. Later phases may include:

- Recommended hero pick.
- Draft analyzer.
- Team composition analysis.
- Role and lane recommendation.
- Synergy analysis.
- Item and emblem recommendation.
- Patch and meta analysis.
- AI analysis assistant.

The architecture should keep data, analyzer logic, and UI separate so these features can grow without rewriting the MVP.

## MVP Non-Goals (this frontend repo)

The Next.js app should not include:

- Its own database or authentication.
- Scraping or crawling.
- Live patch/meta ingestion.
- Full team draft analysis.

Hero and counter data are served by a separate **analyzer API**. The frontend reads that API via `NEXT_PUBLIC_ANALYZER_API_URL` and does not ship static dataset files.
