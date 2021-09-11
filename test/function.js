"use strict";
/* eslint-disable no-eval */

const assert = require("assert");

const conversions = require("..");
const assertThrows = require("./assertThrows");

const supportsAsyncFunction = (() => {
  try {
    eval("(async function () {})");
    return true;
  } catch (err) {
    return false;
  }
})();

function test(type) {
  describe(`WebIDL ${type} type`, () => {
    const sut = conversions[type];

    it("should return `function () {}` for `function () {}`", () => {
      const func = function () {};
      assert.strictEqual(sut(func), func);
    });

    it("should return `function* () {}` for `function* () {}`", () => {
      const func = function* () {};
      assert.strictEqual(sut(func), func);
    });

    it("should return `() => {}` for `() => {}`", () => {
      const func = () => {};
      assert.strictEqual(sut(func), func);
    });

    if (supportsAsyncFunction) {
      it("should return `async function () {}` for `async function () {}`", () => {
        const func = eval("(async function () {})");
        assert.strictEqual(sut(func), func);
      });

      it("should return `async () => {}` for `async () => {}`", () => {
        const func = eval("async () => {}");
        assert.strictEqual(sut(func), func);
      });
    }

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

    it("should throw a TypeError for `{}`", () => {
      assertThrows(sut, [{}], TypeError);
    });
  });
}

test("Function");
test("VoidFunction");
