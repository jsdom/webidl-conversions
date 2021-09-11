"use strict";
const assert = require("assert");

const conversions = require("..");
const assertThrows = require("./helpers/assertThrows");

describe("WebIDL object type", () => {
  const sut = conversions.object;

  it("should return `{}` for `{}`", () => {
    const obj = {};
    assert.strictEqual(sut(obj), obj);
  });

  it("should return `() => {}` for `() => {}`", () => {
    const func = () => {};
    assert.strictEqual(sut(func), func);
  });

  it("should throw a TypeError for `undefined`", () => {
    assertThrows(sut, [undefined], TypeError);
  });

  it("should throw a TypeError for `null`", () => {
    assertThrows(sut, [null], TypeError);
  });

  it("should throw a TypeError for `true`", () => {
    assertThrows(sut, [true], TypeError);
  });

  it("should throw a TypeError for `false`", () => {
    assertThrows(sut, [false], TypeError);
  });

  it("should throw a TypeError for `Infinity`", () => {
    assertThrows(sut, [Infinity], TypeError);
  });

  it("should throw a TypeError for `NaN`", () => {
    assertThrows(sut, [NaN], TypeError);
  });

  it("should throw a TypeError for `0`", () => {
    assertThrows(sut, [0], TypeError);
  });

  it("should throw a TypeError for `''`", () => {
    assertThrows(sut, [""], TypeError);
  });

  it("should throw a TypeError for `Symbol.iterator`", () => {
    assertThrows(sut, [Symbol.iterator], TypeError);
  });

  it("should throw a TypeError for `0n`", () => {
    assertThrows(sut, [0n], TypeError);
  });
});
