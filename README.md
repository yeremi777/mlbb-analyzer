# mlbb-analyzer

A web-based Mobile Legends draft, hero pick, and counter analysis tool.

## Current MVP Focus

The first MVP focuses on one flow:

1. Select one enemy hero.
2. Show the selected hero in a centered card.
3. Analyze available counter data and return ranked counter heroes.
4. Reveal the top 3 counters dramatically in this order: third, second, first.
5. Show remaining counters as a normal ranked list.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Analyzer API for heroes and counter matchups

## Environment

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_ANALYZER_API_URL` — base URL of the analyzer API (no trailing slash)

Vercel: add the same variable in Project Settings → Environment Variables.

## Planned Features

- Hero counter reveal.
- Recommended hero pick.
- Draft analyzer.
- Team composition analysis.
- Role and lane recommendation.
- Synergy analysis.
- Item and emblem recommendation.
- Patch and meta analysis.
- AI analysis assistant.

## Development Status

Counter reveal MVP UI with analyzer API integration. Dataset authoring and validation live in the analyzer API service, not in this frontend repo.
