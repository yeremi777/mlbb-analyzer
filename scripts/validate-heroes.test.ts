import assert from "node:assert/strict";
import { validateHeroesData } from "./validate-heroes";

const validHero = {
  uid: "ruby",
  mlid: "29",
  name: "Ruby",
  images: {
    head: "https://example.com/ruby.png",
  },
  roles: ["fighter"],
  lanes: ["exp"],
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
  messagesFor([{ ...validHero, images: { smallmap: "" } }]).join("\n"),
  /images\.head.*string/i,
  "head image should be validated",
);

assert.match(
  messagesFor([{ ...validHero, images: { head: "", smallmap: 123 } }]).join("\n"),
  /images\.smallmap.*string/i,
  "optional smallmap image should be validated when present",
);

assert.match(
  messagesFor([{ ...validHero }, { ...validHero }]).join("\n"),
  /duplicate.*ruby/i,
  "duplicate hero UIDs should produce a clear error",
);

assert.match(
  messagesFor([{ ...validHero, uid: "Ruby Hero" }]).join("\n"),
  /lowercase uid format/i,
  "hero UIDs should use lowercase uid format",
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

assert.equal(
  messagesFor([{ ...validHero, sourceRefs: [] }]).length,
  0,
  "sourceRefs should be optional and may be empty while pending manual fill",
);

assert.match(
  messagesFor([{ ...validHero, sourceRefs: [""] }]).join("\n"),
  /sourceRefs.*non-empty/i,
  "sourceRefs should contain only non-empty strings when present",
);

assert.match(
  messagesFor([{ ...validHero, roles: [] }]).join("\n"),
  /roles.*non-empty/i,
  "roles should not be empty",
);

console.log("validate-heroes tests passed");
