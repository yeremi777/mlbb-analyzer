# Analyzer Rules

The analyzer is responsible for producing structured rankings. Static counter data stores reviewed context, not numeric scores. Later AI scoring should produce numeric matchup scores from reasons, counter types, and proof entries.

## One Enemy Hero Analysis

For the MVP:

1. Receive one selected enemy hero ID.
2. Find all `CounterMatchup` records where `targetHeroId` matches the selected enemy hero.
3. Sort matching records by reviewed evidence richness until AI scoring is implemented.
4. Select the top 3 counters for dramatic reveal.
5. Return remaining counters as a normal ranked list.

If no matchups exist, return a no-result state rather than inventing recommendations.

## Sorting Rules

Current temporary sort:

- Higher reviewed evidence weight appears first.
- Primary proof entries count more than secondary proof entries.
- High-impact proof entries count more than medium or low-impact proof entries.

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

## Future AI Scoring

Long-term scoring should use the reviewed context as input:

```txt
AI score input =
Reasons
+ Counter types
+ Proof categories
+ Proof priorities and impacts
+ Works-best conditions
+ Failure cases
```

Static counter records must not include a `score` field. The AI analyzer may later produce a runtime score, but it must base that score on supplied reviewed context rather than invented matchup facts.
