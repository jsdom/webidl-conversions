"use strict";

const assert = require("assert");

const conversions = require("..");

describe("WebIDL object type", () => {
    const sut = conversions["Error"];

    it("should return an `Error` for an `Error`", () => {
        const err = new Error();
        assert.strictEqual(sut(err), err);
    });

    it("should return an `TypeError` for an `TypeError`", () => {
        const err = new TypeError();
        assert.strictEqual(sut(err), err);
    });

    it("should throw a TypeError for `undefined`", () => {
        assert.throws(() => sut(undefined), TypeError);
    });

    it("should throw a TypeError for `null`", () => {
        assert.throws(() => sut(null), TypeError);
    });

    it("should throw a TypeError for `true`", () => {
        assert.throws(() => sut(true), TypeError);
    });

    it("should throw a TypeError for `false`", () => {
        assert.throws(() => sut(false), TypeError);
    });

    it("should throw a TypeError for `Infinity`", () => {
        assert.throws(() => sut(Infinity), TypeError);
    });

    it("should throw a TypeError for `NaN`", () => {
        assert.throws(() => sut(NaN), TypeError);
    });

    it("should throw a TypeError for `0`", () => {
        assert.throws(() => sut(0), TypeError);
    });

    it("should throw a TypeError for `''`", () => {
        assert.throws(() => sut(""), TypeError);
    });

    it("should throw a TypeError for `Symbol.iterator`", () => {
        assert.throws(() => sut(Symbol.iterator), TypeError);
    });

    it("should throw a TypeError for `{}`", () => {
        assert.throws(() => sut({}), TypeError);
    });

    it("should throw a TypeError for `() => {}`", () => {
        assert.throws(() => sut(() => {}), TypeError);
    });
});
