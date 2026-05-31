# UI Flow: Counter Reveal

This document defines the first MVP user flow. It is a UI behavior plan only; implementation comes later.

## Flow Summary

1. User searches for an enemy hero.
2. User selects one hero.
3. Selected enemy hero appears in a centered card.
4. App analyzes available counter data and returns ranked counters.
5. Top 3 counters are revealed dramatically.
6. Remaining counters appear as a normal ranking list.

## Hero Search

Hero search should help users quickly find a hero by name. Later versions may include role, lane, and tag filters, but the MVP only needs a simple searchable hero selector.

Expected behavior:

- Empty input shows a neutral selection state.
- Typing filters heroes by name.
- Selecting a hero updates the centered selected hero card.
- Changing the hero resets the previous reveal state.

## Selected Enemy Hero Card

After selection, the enemy hero should appear in a centered card. This card should clearly show the current analysis target.

Suggested content:

- Hero name.
- Role or lane labels.
- Optional hero image placeholder.
- Optional tags if useful.

## Top 3 Reveal

The top 3 counters are ranked by analyzer score but revealed in reverse dramatic order.

```txt
#3:
- medium card
- soft highlight
- appears first

#2:
- larger card
- stronger highlight
- appears second

#1:
- largest card
- strongest highlight
- "Best Counter" badge
- appears last
```

Possible animation timing:

```txt
0.3s: #3 appears
0.9s: #2 appears
1.5s: #1 appears
```

The first-ranked counter should be the most visually emphasized.

## Ranking List

After the top 3 reveal, remaining counters should appear in a normal ranked list.

Each row can include:

- Rank number.
- Counter hero name.
- Score.
- Short reason summary.
- Counter type labels.

## Desktop Layout

Desktop layout should prioritize clarity:

- Search area near the top.
- Selected enemy hero card centered.
- Top 3 reveal area below or around the selected hero.
- Remaining ranking list below the reveal area.

## Mobile Layout

Mobile layout should be vertically stacked:

- Search first.
- Selected enemy hero card.
- Top 3 reveal cards.
- Remaining ranking list.

Cards and rows should be easy to scan without requiring horizontal scrolling.

## Empty State

Before a hero is selected, show a simple empty state that invites the user to choose an enemy hero. Do not show fake recommendations.

## No Result State

If the selected hero has no counter data, show a no-result state. The state should explain that matchup data is not available yet and avoid inventing counters.

## Loading and Reveal State

Even if MVP analysis is local and fast, the reveal flow can use a brief controlled state:

- Analysis pending.
- Rank 3 visible.
- Rank 2 visible.
- Rank 1 visible.
- Full ranking visible.

This makes the reveal behavior predictable and testable.
