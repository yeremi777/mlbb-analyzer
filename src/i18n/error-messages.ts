/**
 * Maps an analyzer API failure (stable `error.code` when present, otherwise the
 * HTTP status) to a key in the `errors` translation namespace. The frontend owns
 * this copy — the backend only returns English `error.message`, which we never
 * display raw. See AnalyzerError in @/lib/analyzer-api.
 */

/** Stable `error.code` strings → `errors.<key>`. */
const CODE_TO_KEY: Record<string, string> = {
  target_hero_not_found: "targetHeroNotFound",
  counter_hero_not_found: "counterHeroNotFound",
  counter_matchup_not_found: "counterMatchupNotFound",
  counter_data_not_found: "counterDataNotFound",
};

/** HTTP statuses without a stable `code` → `errors.<key>`. */
const STATUS_TO_KEY: Record<number, string> = {
  429: "rateLimited",
  501: "unavailable",
  502: "unavailable",
  504: "unavailable",
};

export function errorMessageKey(code?: string, status?: number): string {
  if (code && CODE_TO_KEY[code]) {
    return CODE_TO_KEY[code];
  }

  if (status && STATUS_TO_KEY[status]) {
    return STATUS_TO_KEY[status];
  }

  return "unknown";
}
