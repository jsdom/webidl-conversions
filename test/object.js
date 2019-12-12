"use strict";
/* global BigInt */
const assert = require("assert");

const conversions = require("..");

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

    const itBigInt = typeof BigInt === "function" && typeof BigInt(0) === "bigint" ? it : it.skip;
    itBigInt("should throw a TypeError for `0n`", () => {
        assert.throws(() => sut(BigInt(0)), TypeError);
    });
});
