var assert = require("assert");

import conversions from "..";

describe("WebIDL DOMString type", () => {
    var sut = conversions["DOMString"];

    it("should return `\"undefined\"` for `undefined`", function () {
        assert.strictEqual(sut(undefined), "undefined");
    });

    it("should return `\"null\"` for `null`", function () {
        assert.strictEqual(sut(null), "null");
    });

    it("should return `\"true\"` for `true`", function () {
        assert.strictEqual(sut(true), "true");
    });

    it("should return `\"false\"` for `false`", function () {
        assert.strictEqual(sut(false), "false");
    });

    it("should return the correct number formatting for numbers", function () {
        assert.strictEqual(sut(NaN), "NaN");
        assert.strictEqual(sut(+0), "0");
        assert.strictEqual(sut(-0), "0");
        assert.strictEqual(sut(+Infinity), "Infinity");
        assert.strictEqual(sut(-Infinity), "-Infinity");
        assert.strictEqual(sut(10), "10");
        assert.strictEqual(sut(-10), "-10");
    });

    it("should return the input for a string", function () {
        assert.strictEqual(sut(""), "");
        assert.strictEqual(sut("whee"), "whee");
    });

    it("should throw a TypeError for a symbol", function () {
        assert.throws(function () {
            sut(new Symbol());
        }, TypeError);
    });

    it("should prefer toString to valueOf on objects", function () {
        var o = { valueOf: function () { return 5; }, toString: function () { return "foo"; } };
        assert.strictEqual(sut(o), "foo");
    });
});
