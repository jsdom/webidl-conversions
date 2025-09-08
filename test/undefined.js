"use strict";
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const conversions = require("..");

describe("WebIDL undefined type", () => {
  const sut = conversions.undefined;

  it("should return `undefined` for everything", () => {
    assert.equal(sut(undefined), undefined);
    assert.equal(sut(null), undefined);
    assert.equal(sut(""), undefined);
    assert.equal(sut(123), undefined);
    assert.equal(sut("123"), undefined);
    assert.equal(sut({}), undefined);
    assert.equal(sut(Object.create(null)), undefined);
  });
});
