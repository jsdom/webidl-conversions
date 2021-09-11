"use strict";
/* eslint-disable no-new-wrappers */
const assert = require("assert");

const conversions = require("..");

describe("WebIDL boolean type", () => {
  const sut = conversions.boolean;

  it("should return `false` for `undefined`", () => {
    assert.strictEqual(sut(undefined), false);
  });

  it("should return `false` for `null`", () => {
    assert.strictEqual(sut(null), false);
  });

  it("should return the input for a boolean", () => {
    assert.strictEqual(sut(true), true);
    assert.strictEqual(sut(false), false);
  });

  it("should return `false` for `+0`, `-0`, and `NaN`, but `true` other numbers", () => {
    assert.strictEqual(sut(+0), false);
    assert.strictEqual(sut(-0), false);
    assert.strictEqual(sut(NaN), false);
    assert.strictEqual(sut(1), true);
    assert.strictEqual(sut(-1), true);
    assert.strictEqual(sut(-Infinity), true);
  });

  it("should return `false` for empty strings, but `true` for other strings", () => {
    assert.strictEqual(sut(""), false);
    assert.strictEqual(sut(" "), true);
    assert.strictEqual(sut("false"), true);
  });

  it("should return `true` for symbols", () => {
    assert.strictEqual(sut(Symbol("dummy description")), true);
  });

  it("should return `true` for objects", () => {
    assert.strictEqual(sut({}), true);
    assert.strictEqual(sut(Object.create(null)), true);
    assert.strictEqual(sut(() => { }), true);
    assert.strictEqual(sut(new Boolean(false)), true);
    assert.strictEqual(sut(new Number(0)), true);
  });
});
