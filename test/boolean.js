"use strict";
/* eslint-disable no-new-wrappers */
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const conversions = require("..");

describe("WebIDL boolean type", () => {
  const sut = conversions.boolean;

  it("should return `false` for `undefined`", () => {
    assert.equal(sut(undefined), false);
  });

  it("should return `false` for `null`", () => {
    assert.equal(sut(null), false);
  });

  it("should return the input for a boolean", () => {
    assert.equal(sut(true), true);
    assert.equal(sut(false), false);
  });

  it("should return `false` for `+0`, `-0`, and `NaN`, but `true` other numbers", () => {
    assert.equal(sut(+0), false);
    assert.equal(sut(-0), false);
    assert.equal(sut(NaN), false);
    assert.equal(sut(1), true);
    assert.equal(sut(-1), true);
    assert.equal(sut(-Infinity), true);
  });

  it("should return `false` for empty strings, but `true` for other strings", () => {
    assert.equal(sut(""), false);
    assert.equal(sut(" "), true);
    assert.equal(sut("false"), true);
  });

  it("should return `true` for symbols", () => {
    assert.equal(sut(Symbol("dummy description")), true);
  });

  it("should return `true` for objects", () => {
    assert.equal(sut({}), true);
    assert.equal(sut(Object.create(null)), true);
    assert.equal(sut(() => { }), true);
    assert.equal(sut(new Boolean(false)), true);
    assert.equal(sut(new Number(0)), true);
  });
});
