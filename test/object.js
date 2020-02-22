"use strict";
const assert = require("assert");

const conversions = require("..");

const itBigInt = typeof BigInt === "function" && typeof BigInt(0) === "bigint" ? it : it.skip;

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

    {
        const documentAll = (() => {
            try {
                // eslint-disable-next-line no-eval
                return (0, eval)("%GetUndetectable()");
            } catch (err) {
                return false;
            }
        })();

        const itHTMLDDA = documentAll !== false ? it : it.skip;
        itHTMLDDA("should return `document.all` for `document.all` (needs --allow-natives-syntax)", () => {
            assert.strictEqual(sut(documentAll), documentAll);
        });
    }

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

    itBigInt("should throw a TypeError for `0n`", () => {
        assert.throws(() => sut(BigInt(0)), TypeError);
    });
});
