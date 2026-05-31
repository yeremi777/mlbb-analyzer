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
- Community wiki pages for cross-checking skills and hero behavior.
- Manual player knowledge for early matchup reasoning.

Do not copy proprietary tier lists, rankings, or matchup scores directly from third-party sites.

## First Dataset Fields

Start with the existing planned schema:

- `heroes.json` for hero identity, role, lane, and tags.
- `counters.json` for matchup score, reasons, and counter types.
- `rules.json` later, after the static matchup flow works.

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
