import assert from "node:assert/strict";
import { validateCountersData } from "./validate-counters";

const heroes = [
  { uid: "tigreal", name: "Tigreal" },
  { uid: "diggie", name: "Diggie" },
];

const validCounter = {
  targetHeroId: "tigreal",
  counterHeroId: "diggie",
  reasons: ["Diggie can protect the team from Tigreal's engage."],
};

const validProof = {
  id: "diggie-time-journey-vs-tigreal-implosion",
  category: "skill-interaction",
  priority: "primary",
  impact: "high",
  summary: "Diggie's team cleanse directly reduces Tigreal's crowd-control engage value.",
  worksBestWhen: ["Diggie saves ultimate for Tigreal's engage."],
  failureCases: ["Tigreal baits Diggie's ultimate before committing."],
};

function messagesFor(counters: unknown): string[] {
  const result = validateCountersData({ heroes, counters });
  return result.errors;
}

assert.equal(messagesFor([validCounter]).length, 0, "valid counters should pass");
assert.equal(messagesFor([{ ...validCounter, proof: [validProof] }]).length, 0, "valid counter proof should pass");

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
  messagesFor([{ ...validCounter, score: 80 }]).join("\n"),
  /must not include score/,
  "static scores should produce a clear error",
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

assert.match(
  messagesFor([{ ...validCounter, proof: [] }]).join("\n"),
  /proof.*non-empty/,
  "empty proof arrays should produce a clear error",
);

assert.match(
  messagesFor([{ ...validCounter, proof: [{ ...validProof, category: "generic-good-counter" }] }]).join("\n"),
  /category.*skill-interaction/,
  "unknown proof categories should produce a clear error",
);

assert.match(
  messagesFor([{ ...validCounter, proof: [{ ...validProof, priority: "bonus" }] }]).join("\n"),
  /priority.*primary.*secondary.*condition/,
  "unknown proof priorities should produce a clear error",
);

assert.match(
  messagesFor([{ ...validCounter, proof: [{ ...validProof, summary: "   " }] }]).join("\n"),
  /summary/,
  "blank proof summaries should produce a clear error",
);

assert.match(
  messagesFor([{ ...validCounter, proof: [{ ...validProof, failureCases: [""] }] }]).join("\n"),
  /failureCases.*non-empty/,
  "blank proof failure cases should produce a clear error",
);

assert.match(
  messagesFor([{ ...validCounter, proof: [{ ...validProof, scoreHint: { points: 12, reason: "Static hint" } }] }]).join(
    "\n",
  ),
  /must not include scoreHint/,
  "static proof score hints should produce a clear error",
);

console.log("validate-counters tests passed");
