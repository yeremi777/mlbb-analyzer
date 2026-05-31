# Analyzer Rules

The analyzer is responsible for producing structured rankings. In the first MVP, rankings come from static matchup scores. Later phases may add an AI analysis assistant, but the immediate focus is setup and data gathering.

## One Enemy Hero Analysis

For the MVP:

1. Receive one selected enemy hero ID.
2. Find all `CounterMatchup` records where `targetHeroId` matches the selected enemy hero.
3. Sort matching records by `score` from highest to lowest.
4. Select the top 3 counters for dramatic reveal.
5. Return remaining counters as a normal ranked list.

If no matchups exist, return a no-result state rather than inventing recommendations.

## Sorting Rules

Primary sort:

- Higher `score` appears first.

Tie-breakers should be deterministic:

- Higher number of reasons.
- Alphabetical counter hero name.
- Stable hero ID as final fallback.

This avoids random ordering between renders.

## Top 3 Selection

The top 3 counters are selected after sorting. Display order for reveal is different from ranking order:

- Reveal rank 3 first.
- Reveal rank 2 second.
- Reveal rank 1 last.

The actual ranking remains rank 1, rank 2, rank 3.

## Determinism

Analyzer output must be deterministic. The same input dataset and selected enemy hero should always produce the same result.

Deterministic behavior makes the app:

- Easier to test.
- Easier to explain.
- Safer to cache.
- Easier to debug when users question recommendations.

## Future Scoring Formula

Long-term scoring may use this concept:

```txt
Final score =
Base matchup score
+ Skill interaction bonus
+ Role/lane relevance bonus
+ Team composition bonus later
+ Meta/patch bonus later
- Difficulty penalty later
```

For MVP, static score from `counters.json` is enough. Do not add advanced scoring until the base dataset and reveal flow are working.
