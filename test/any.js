"use strict";
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const conversions = require("..");

describe("WebIDL any type", () => {
  const sut = conversions.any;

  it("should return `undefined` for `undefined`", () => {
    assert.equal(sut(undefined), undefined);
  });

  it("should return `null` for `null`", () => {
    assert.equal(sut(null), null);
  });

  it("should return `true` for `true`", () => {
    assert.equal(sut(true), true);
  });

  it("should return `false` for `false`", () => {
    assert.equal(sut(false), false);
  });

  it("should return `Infinity` for `Infinity`", () => {
    assert.equal(sut(Infinity), Infinity);
  });

  it("should return `-Infinity` for `-Infinity`", () => {
    assert.equal(sut(-Infinity), -Infinity);
  });

  it("should return `NaN` for `NaN`", () => {
    assert.equal(sut(NaN), NaN);
  });

  it("should return `0` for `0`", () => {
    assert.equal(sut(0), 0);
  });

  it("should return `-0` for `-0`", () => {
    assert.equal(sut(-0), -0);
  });

  it("should return `1` for `1`", () => {
    assert.equal(sut(1), 1);
  });

  it("should return `-1` for `-1`", () => {
    assert.equal(sut(-1), -1);
  });

  it("should return `''` for `''`", () => {
    assert.equal(sut(""), "");
  });

  it("should return `'a'` for `'a'`", () => {
    assert.equal(sut("a"), "a");
  });

  it("should return `{}` for `{}`", () => {
    const obj = {};
    assert.equal(sut(obj), obj);
  });

  it("should return `() => {}` for `() => {}`", () => {
    const func = () => {};
    assert.equal(sut(func), func);
  });
});
