"use strict";
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const conversions = require("..");

describe("WebIDL DOMTimeStamp type", () => {
  const sut = conversions.DOMTimeStamp;

  it("should have the same conversion routine as unsigned long long type", () => {
    assert.equal(sut, conversions["unsigned long long"]);
  });
});
