"use strict";
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const conversions = require("..");
const assertThrows = require("./helpers/assertThrows");

function commonTest(sut) {
  it("should return `\"undefined\"` for `undefined`", () => {
    assert.equal(sut(undefined), "undefined");
  });

  it("should return `\"null\"` for `null`", () => {
    assert.equal(sut(null), "null");
  });

  it("should return `\"\"` for `null` with [TreatNullAsEmptyString]", () => {
    assert.equal(sut(null, { treatNullAsEmptyString: true }), "");
  });

  it("should return `\"true\"` for `true`", () => {
    assert.equal(sut(true), "true");
  });

  it("should return `\"false\"` for `false`", () => {
    assert.equal(sut(false), "false");
  });

  it("should return the correct number formatting for numbers", () => {
    assert.equal(sut(NaN), "NaN");
    assert.equal(sut(+0), "0");
    assert.equal(sut(-0), "0");
    assert.equal(sut(Infinity), "Infinity");
    assert.equal(sut(-Infinity), "-Infinity");
    assert.equal(sut(10), "10");
    assert.equal(sut(-10), "-10");
  });

  it("should return the input for a string", () => {
    assert.equal(sut(""), "");
    assert.equal(sut("whee"), "whee");
  });

  it("should throw a TypeError for a symbol", () => {
    assertThrows(sut, [Symbol("dummy description")], TypeError);
  });

  it("should prefer toString to valueOf on objects", () => {
    const o = {
      valueOf() {
        return 5;
      },
      toString() {
        return "foo";
      }
    };
    assert.equal(sut(o), "foo");
  });
}

describe("WebIDL DOMString type", () => {
  const sut = conversions.DOMString;

  commonTest(sut);

  it("should return the input for two-byte characters", () => {
    assert.equal(sut("中文"), "中文");
  });

  it("should return the input for valid Unicode surrogates", () => {
    assert.equal(sut("\uD83D\uDE00"), "\uD83D\uDE00");
  });

  it("should return the input for invalid Unicode surrogates", () => {
    assert.equal(sut("\uD83D"), "\uD83D");
    assert.equal(sut("\uD83Da"), "\uD83Da");
    assert.equal(sut("a\uD83D"), "a\uD83D");
    assert.equal(sut("a\uD83Da"), "a\uD83Da");
    assert.equal(sut("\uDE00"), "\uDE00");
    assert.equal(sut("\uDE00a"), "\uDE00a");
    assert.equal(sut("a\uDE00"), "a\uDE00");
    assert.equal(sut("a\uDE00a"), "a\uDE00a");
    assert.equal(sut("\uDE00\uD830"), "\uDE00\uD830");
  });
});

describe("WebIDL ByteString type", () => {
  const sut = conversions.ByteString;

  commonTest(sut);

  it("should throw a TypeError for two-byte characters", () => {
    assertThrows(sut, ["中文"], TypeError);
  });

  it("should throw a TypeError for valid Unicode surrogates", () => {
    assertThrows(sut, ["\uD83D\uDE00"], TypeError);
  });

  it("should throw a TypeError for invalid Unicode surrogates", () => {
    assertThrows(sut, ["\uD83D"], TypeError);
    assertThrows(sut, ["\uD83Da"], TypeError);
    assertThrows(sut, ["a\uD83D"], TypeError);
    assertThrows(sut, ["a\uD83Da"], TypeError);
    assertThrows(sut, ["\uDE00"], TypeError);
    assertThrows(sut, ["\uDE00a"], TypeError);
    assertThrows(sut, ["a\uDE00"], TypeError);
    assertThrows(sut, ["a\uDE00a"], TypeError);
    assertThrows(sut, ["\uDE00\uD830"], TypeError);
  });
});

describe("WebIDL USVString type", () => {
  const sut = conversions.USVString;

  commonTest(sut);

  it("should return the input for two-byte characters", () => {
    assert.equal(sut("中文"), "中文");
  });

  it("should return the input for valid Unicode surrogates", () => {
    assert.equal(sut("\uD83D\uDE00"), "\uD83D\uDE00");
  });

  it("should replace invalid Unicode surrogates with U+FFFD REPLACEMENT CHARACTER", () => {
    assert.equal(sut("\uD83D"), "\uFFFD");
    assert.equal(sut("\uD83Da"), "\uFFFDa");
    assert.equal(sut("a\uD83D"), "a\uFFFD");
    assert.equal(sut("a\uD83Da"), "a\uFFFDa");
    assert.equal(sut("\uDE00"), "\uFFFD");
    assert.equal(sut("\uDE00a"), "\uFFFDa");
    assert.equal(sut("a\uDE00"), "a\uFFFD");
    assert.equal(sut("a\uDE00a"), "a\uFFFDa");
    assert.equal(sut("\uDE00\uD830"), "\uFFFD\uFFFD");
  });
});
