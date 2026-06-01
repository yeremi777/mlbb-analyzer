import assert from "node:assert/strict";
import { validateCountersData } from "./validate-counters";

const heroes = [
  { id: "tigreal", name: "Tigreal" },
  { id: "diggie", name: "Diggie" },
];

const validCounter = {
  targetHeroId: "tigreal",
  counterHeroId: "diggie",
  score: 80,
  reasons: ["Diggie can protect the team from Tigreal's engage."],
};

function messagesFor(counters: unknown): string[] {
  const result = validateCountersData({ heroes, counters });
  return result.errors;
}

assert.equal(messagesFor([validCounter]).length, 0, "valid counters should pass");

assert.match(
  messagesFor([{ ...validCounter, targetHeroId: "missing-hero" }]).join("\n"),
  /unknown targetHeroId "missing-hero"/,
  "missing target heroes should produce a clear error",
);

assert.match(
  messagesFor([{ ...validCounter, counterHeroId: "missing-counter" }]).join("\n"),
  /unknown counterHeroId "missing-counter"/,
  "missing counter heroes should produce a clear error",
);

assert.match(
  messagesFor([{ ...validCounter, counterHeroId: "tigreal" }]).join("\n"),
  /self-counter/i,
  "self-counters should produce a clear error",
);

assert.match(
  messagesFor([{ ...validCounter, score: 101 }]).join("\n"),
  /score.*0-100/,
  "out-of-range scores should produce a clear error",
);

assert.match(
  messagesFor([{ ...validCounter, score: "high" }]).join("\n"),
  /score.*numeric/,
  "non-numeric scores should produce a clear error",
);

assert.match(
  messagesFor([{ ...validCounter, reasons: [] }]).join("\n"),
  /reasons.*non-empty/,
  "missing reasons should produce a clear error",
);

assert.match(
  messagesFor([{ ...validCounter, reasons: ["   "] }]).join("\n"),
  /reasons.*non-empty/,
  "blank reasons should produce a clear error",
);

assert.match(
  messagesFor([validCounter, { ...validCounter }]).join("\n"),
  /duplicate.*tigreal.*diggie/i,
  "duplicate target/counter pairs should produce a clear error",
);

console.log("validate-counters tests passed");
