# Analyzer Rules

Counter ranking is produced by the **analyzer API**. The API stores reviewed matchup context (reasons, counter types, proof) and returns an ordered list to the frontend. Later AI scoring may produce numeric matchup scores from that context.

## One Enemy Hero Analysis

For the MVP:

1. The user selects one enemy hero in the frontend.
2. The frontend calls `GET /api/heroes/:uid/counters`.
3. The API returns ranked counter matchups for that target hero.
4. The UI reveals the top 3 counters in dramatic order (third, second, first).
5. The UI shows remaining counters as a normal ranked list.

If the API returns an empty list, show a no-result state rather than inventing recommendations.

## Sorting Rules

Sorting is implemented on the **analyzer API** before responses reach the browser. Until AI scoring exists, the API may use a temporary deterministic sort such as:

- Higher reviewed evidence weight first.
- Primary proof entries weighted above secondary proof.
- High-impact proof above medium or low impact.

Tie-breakers should remain deterministic (for example: more reasons, then counter hero name, then stable hero ID).

## Top 3 Selection

The top 3 counters are selected after sorting. Display order for reveal is different from ranking order:

- Reveal rank 3 first.
- Reveal rank 2 second.
- Reveal rank 1 last.

The actual ranking remains rank 1, rank 2, rank 3.

## Determinism

API ranking for a given hero and dataset version should be deterministic so the same request produces the same order. That makes the product easier to test, explain, cache, and debug.

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
