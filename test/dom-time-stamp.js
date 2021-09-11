"use strict";
const assert = require("assert");

const conversions = require("..");

describe("WebIDL DOMTimeStamp type", () => {
  const sut = conversions.DOMTimeStamp;

  it("should have the same conversion routine as unsigned long long type", () => {
    assert.strictEqual(sut, conversions["unsigned long long"]);
  });
});
