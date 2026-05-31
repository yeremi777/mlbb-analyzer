# Data Source Research

Dataset quality is the foundation of `mlbb-analyzer`. Counter rankings are only useful if hero identities, roles, lanes, tags, matchup scores, and reasons are consistent and reviewable.

## Why Source Research Matters

The app should create its own counter score and ranking rules. It may use public information for reference, but it should not blindly copy another website's proprietary dataset. Public website data does not automatically mean open source data.

Before scraping, crawling, importing, or heavily referencing any data source, audit the source and document the usage risk.

## Candidate Source Categories

### Official Mobile Legends Pages

Official pages are useful for hero names, roles, basic descriptions, and official patch information. They are usually safer as references, but usage terms and allowed fields still need review.

### Community Wiki

Community wikis may provide structured hero information, ability summaries, and historical details. They may have their own licenses and attribution requirements.

### Manually Curated Knowledge

Manual curation is the safest approach for matchup reasoning. It allows the project to define its own tags, scores, and reasons instead of inheriting another site's hidden methodology.

### AI Analysis Assistant

AI can later help summarize matchup evidence, draft notes, and suggest first-pass scores from reviewed datasets or crawled source data. Keep this as future assistance only; the immediate foundation is project setup and data gathering.

### Player Profile and Match History Sources

Future versions may analyze a player by player ID, favorite heroes, favorite roles, lane preference, and recent play history. This requires stricter review than static hero data because it may involve personal or account-linked data.

Before using any player data source, document whether the data is official, public, allowed to access, allowed to store, and allowed to display. If access depends on unofficial endpoints, scraping, account credentials, or reverse-engineered APIs, treat the source as high risk until proven otherwise.

### Pro Player Statistics and Gameplay Sources

Future versions may analyze pro player statistics or gameplay clips. This can support draft insights, role tendencies, hero mastery, and matchup examples. Video clips and tournament data need source-rights review before use.

For video-based data, document:

- Clip source and URL.
- Whether the clip is official, community-made, or user-uploaded.
- Whether analysis, storage, embedding, or redistribution is allowed.
- Whether attribution is required.
- What metadata can be safely extracted.
- Whether the result should be aggregate-only.

## Source Audit Table

Use this table before relying on any source:

| Source | URL | Data Available | Usage Type | Scraping Allowed? | Attribution Needed? | Risk Level | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Example official source | TBD | Hero names, roles, patch notes | Reference | TBD | TBD | Low to Medium | Verify current terms before use. |
| Example community wiki | TBD | Hero details, skills, history | Reference with license review | TBD | TBD | Medium | Check license and attribution rules. |
| Manual curation | Internal | Tags, scores, reasons | Original dataset | Not applicable | No | Low | Preferred for counter logic. |
| Player profile source | TBD | Player ID, match history, favorite heroes, roles | Future player analysis | TBD | TBD | Unknown to High | Requires privacy and terms review before use. |
| Pro gameplay source | TBD | Pro player stats, match VODs, clips | Future pro analysis | TBD | TBD | Unknown to High | Requires rights, attribution, and storage review. |

## Risk Levels

- Low: Original data created for this project or basic factual references with clear usage rights.
- Medium: Community-maintained data with license or attribution requirements.
- High: Proprietary rankings, matchup scores, tier lists, or copied datasets from another website.
- Unknown: Any source without reviewed terms, unclear ownership, or unclear scraping policy.
- Personal or account-linked data should default to Unknown or High until access rights and privacy handling are documented.

## Recommended Safe Approach

Start with a small manually curated dataset and source audit. Use official or community sources to verify basic hero facts and document any source used for matchup evidence. If crawling is added later, keep the crawler scope small and respect usage terms.

Do not start player ID lookup, match-history ingestion, pro stat ingestion, or video clip analysis until the basic counter MVP, source audit process, and data validation workflow are stable.
