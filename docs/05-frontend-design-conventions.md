# Frontend Design Conventions

A lightweight, **anti-slop** convention for this frontend: keep the UI feeling
human-designed, not AI-default. This is a curated reference, not a full design
system.

## Source and scope

These conventions are a **product-UI subset** of
`.agents/skills/design-taste-frontend/SKILL.md` ("Anti-Slop Frontend Skill").

That skill is scoped to **landing pages, portfolios, and redesigns**. This app is
a **product/tool UI** (hero selector, ranked counter results, detail panel), which
the skill lists as out of scope. So we deliberately adopt only the **universal
rules that transfer** to product UI, and explicitly ignore the marketing-page
machinery.

### Not applicable here (intentionally ignored)

Hero stack discipline, bento-grid rhythm, eyebrow restraint, CTA-intent dedup,
logo walls, marquees, "image-generation first" asset strategy, split-header bans.
These govern marketing/landing layouts, not a tool UI. Do not apply them.

## The rules we follow

### Anti-slop / "human taste"

- **No em-dashes** (`—`) or en-dash separators (`–`) anywhere user-visible
  (headlines, labels, body, errors, alt text). Use a regular hyphen `-`, comma,
  or two sentences. This is the single strongest AI tell.
- **No emoji** in UI text. Use icon-library glyphs.
- **No AI-purple / neon glows.** Neutral base + one accent. (Our accent is the
  amber `--primary`/`--accent` token in `globals.css`.)
- **No fake-precise invented numbers.** Scores/confidence come from the analyzer
  API, never hardcoded for effect.
- **No filler copy** ("Elevate", "Seamless", "Unleash", "Next-Gen"). Plain,
  concrete strings; see the i18n bundles in `messages/`.

### Consistency locks (audit before shipping)

- **One theme.** Single dark theme via tokens; sections do not invert.
- **One accent color** used across the whole UI (the amber token). No stray
  second accent in one component.
- **One corner-radius scale** (`--radius`, `0.5rem`). Don't mix pill buttons with
  sharp cards ad hoc.
- **One icon family.** Currently `lucide-react` (the skill discourages it but
  permits it when the project already depends on it, which we do). Do not add a
  second icon library. Never hand-roll SVG icon paths.

### Accessibility (mandatory)

- **Respect `prefers-reduced-motion`.** Non-essential motion (score count-up,
  staged reveal, smooth scroll) must have a reduced fallback. See
  `src/hooks/use-reduced-motion.ts` and its use in
  `src/components/counter-analyzer.tsx`.
- **WCAG AA contrast** on buttons, inputs, placeholders, focus rings, helper and
  error text.
- **Viewport stability:** full-height wrappers use `min-h-dvh` (or
  `min-h-[100dvh]`), never `h-screen`.

### Interactive completeness

- Every async surface ships **loading, empty, and error** states, not just the
  happy path. (The analyzer already does: loading spinner, "No counters" empty
  state, localized error cards.)
- Error copy is **localized via `error.code` / HTTP status**, never raw English
  API messages. See `src/i18n/error-messages.ts`.

### Motion discipline

- Every animation must be justifiable in one sentence (hierarchy, storytelling,
  feedback, or state transition). The score reveal earns its motion as
  storytelling/feedback. Don't add motion "because it looks cool."
- `useEffect`-driven animations/timers must clean up (clear intervals/timeouts,
  cancel rAF).

## Current-state notes

- Consistency locks (theme / accent / radius) are already satisfied by the
  `globals.css` tokens.
- Reduced-motion support and `min-h-dvh` were added when these conventions were
  written.
- Known, accepted deviations from the source skill: centered hero/header and
  fairly heavy `Card` usage. The skill discourages both as defaults for
  *landing pages*; for a focused tool UI they are acceptable. Revisit only if the
  layout grows into a marketing surface.
