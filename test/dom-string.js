var assert = require("assert");

const conversions = require("..");

describe("WebIDL DOMString type", () => {
    var sut = conversions["DOMString"];

    it("should return `\"undefined\"` for `undefined`", () => {
        assert.strictEqual(sut(undefined), "undefined");
    });

    it("should return `\"null\"` for `null`", () => {
        assert.strictEqual(sut(null), "null");
    });

    it("should return `\"true\"` for `true`", () => {
        assert.strictEqual(sut(true), "true");
    });

    it("should return `\"false\"` for `false`", () => {
        assert.strictEqual(sut(false), "false");
    });

    it("should return the correct number formatting for numbers", () => {
        assert.strictEqual(sut(NaN), "NaN");
        assert.strictEqual(sut(+0), "0");
        assert.strictEqual(sut(-0), "0");
        assert.strictEqual(sut(+Infinity), "Infinity");
        assert.strictEqual(sut(-Infinity), "-Infinity");
        assert.strictEqual(sut(10), "10");
        assert.strictEqual(sut(-10), "-10");
    });

    it("should return the input for a string", () => {
        assert.strictEqual(sut(""), "");
        assert.strictEqual(sut("whee"), "whee");
    });

    it("should throw a TypeError for a symbol", () => {
        assert.throws(() => sut(new Symbol()), TypeError);
    });

    it("should prefer toString to valueOf on objects", () => {
        var o = { valueOf() { return 5; }, toString() { return "foo"; } };
        assert.strictEqual(sut(o), "foo");
    });
});
