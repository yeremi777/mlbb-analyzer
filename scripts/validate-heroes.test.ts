import assert from "node:assert/strict";
import { validateHeroesData } from "./validate-heroes";

const validHero = {
  id: "ruby",
  officialId: "",
  name: "Ruby",
  imageUrl: "",
  roles: ["fighter"],
  lanes: ["exp"],
  sourceRefs: ["manual-curation:starter-v1"],
  updatedAt: "2026-06-01",
};

function messagesFor(heroes: unknown): string[] {
  return validateHeroesData(heroes).errors;
}

assert.equal(messagesFor([validHero]).length, 0, "valid heroes should pass");

assert.match(
  messagesFor([{ ...validHero, name: "" }]).join("\n"),
  /name.*non-empty string/i,
  "required string fields should be validated",
);

assert.match(
  messagesFor([{ ...validHero }, { ...validHero }]).join("\n"),
  /duplicate.*ruby/i,
  "duplicate hero IDs should produce a clear error",
);

assert.match(
  messagesFor([{ ...validHero, id: "Ruby Hero" }]).join("\n"),
  /lowercase kebab-case/i,
  "hero IDs should be lowercase kebab-case",
);

assert.match(
  messagesFor([{ ...validHero, roles: ["fighter", "invalid-role"] }]).join("\n"),
  /allowed roles/i,
  "roles should be limited to allowed values",
);

assert.match(
  messagesFor([{ ...validHero, lanes: ["exp", "invalid-lane"] }]).join("\n"),
  /allowed lanes/i,
  "lanes should be limited to allowed values",
);

assert.match(
  messagesFor([{ ...validHero, sourceRefs: [] }]).join("\n"),
  /sourceRefs.*non-empty/i,
  "sourceRefs should be required",
);

assert.match(
  messagesFor([{ ...validHero, updatedAt: "06/01/2026" }]).join("\n"),
  /updatedAt.*ISO date/i,
  "updatedAt should be an ISO date string",
);

assert.match(
  messagesFor([{ ...validHero, roles: [] }]).join("\n"),
  /roles.*non-empty/i,
  "roles should not be empty",
);

console.log("validate-heroes tests passed");
