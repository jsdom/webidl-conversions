var assert = require("assert");

const conversions = require("..");

// Adapted pretty directly from
// https://github.com/marcoscaceres/webidl.js/blob/e631bcf2c1ba2d3ea283f5a39ed7bd1470743552/test/WebIDL.Double-tests.js

describe("WebIDL double type", () => {
    var sut = conversions["double"];

    it("should return `0` for `0`", () => {
        assert.strictEqual(sut(0), 0);
    });

    it("should return `42` for `42`", () => {
        assert.strictEqual(sut(42), 42);
    });

    it("should return `0` for `null`", () => {
        assert.strictEqual(sut(null), 0);
    });

    it("should return `0` for `\"\"`", () => {
        assert.strictEqual(sut(""), 0);
    });

    it("should return `0` for `false`", () => {
        assert.strictEqual(sut(0), 0);
    });

    it("should return `1` for `true`", () => {
        assert.strictEqual(sut(null), 0);
    });

    it("should return `0` for random whitespace", () => {
        assert.strictEqual(sut(" \t\n\t "), 0);
    });

    it("should return `123` for `\" 123 \"`", () => {
        assert.strictEqual(sut(" 123 "), 123);
    });

    it("should return `-123.123` for `\" -123.123 \"`", () => {
        assert.strictEqual(sut(" -123.123 "), -123.123);
    });

    it("should throw a TypeError for no argument", () => {
        assert.throws(() => sut(), TypeError);
    });

    it("should throw a TypeError for `undefined`", () => {
        assert.throws(() => sut(undefined), TypeError);
    });

    it("should throw a TypeError for `NaN`", () => {
        assert.throws(() => sut(NaN), TypeError);
    });

    it("should throw a TypeError for `+Infinity`", () => {
        assert.throws(() => sut(+Infinity), TypeError);
    });

    it("should throw a TypeError for `-Infinity`", () => {
        assert.throws(() => sut(-Infinity), TypeError);
    });

    it("should throw a TypeError for `\" 123,123 \"` (since it becomes `NaN`)", () => {
        assert.throws(() => sut(" 123,123 "), TypeError);
    });
});
