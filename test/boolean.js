var assert = require("assert");

import conversions from "..";

describe("WebIDL boolean type", () => {
    var sut = conversions["boolean"];

    it("should return `false` for `undefined`", function () {
        assert.strictEqual(sut(undefined), false);
    });

    it("should return `false` for `null`", function () {
        assert.strictEqual(sut(null), false);
    });

    it("should return the input for a boolean", function () {
        assert.strictEqual(sut(true), true);
        assert.strictEqual(sut(false), false);
    });

    it("should return `false` for `+0`, `-0`, and `NaN`, but `true` other numbers", function () {
        assert.strictEqual(sut(+0), false);
        assert.strictEqual(sut(-0), false);
        assert.strictEqual(sut(NaN), false);
        assert.strictEqual(sut(1), true);
        assert.strictEqual(sut(-1), true);
        assert.strictEqual(sut(-Infinity), true);
    });

    it("should return `false` for empty strings, but `true` for other strings", function () {
        assert.strictEqual(sut(""), false);
        assert.strictEqual(sut(" "), true);
        assert.strictEqual(sut("false"), true);
    });

    it("should return `true` for symbols", function () {
        assert.strictEqual(sut(Symbol()), true);
    });

    it("should return `true` for objects", function () {
        assert.strictEqual(sut({}), true);
        assert.strictEqual(sut(Object.create(null)), true);
        assert.strictEqual(sut(function () { }), true);
        assert.strictEqual(sut(new Boolean(false)), true);
        assert.strictEqual(sut(new Number(0)), true);
    });
});
