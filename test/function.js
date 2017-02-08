"use strict";

const assert = require("assert");

const conversions = require("..");

const supportsAsyncFunction = (() => {
    try {
        eval("(async function () {})");
        return true;
    } catch (err) {
        return false;
    }
})();

function test(type) {
    describe("WebIDL " + type + " type", () => {
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

        it("should return `async function () {}` for `async function () {}`", supportsAsyncFunction ? () => {
            const func = eval("(async function () {})");
            assert.strictEqual(sut(func), func);
        } : undefined);

        it("should return `async () => {}` for `async () => {}`", supportsAsyncFunction ? () => {
            const func = eval("async () => {}");
            assert.strictEqual(sut(func), func);
        } : undefined);

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
    });
}

test("Function");
test("VoidFunction");
