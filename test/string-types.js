"use strict";
const assert = require("assert");

const conversions = require("..");
const assertThrows = require("./helpers/assertThrows");

function commonTest(sut) {
  it("should return `\"undefined\"` for `undefined`", () => {
    assert.strictEqual(sut(undefined), "undefined");
  });

  it("should return `\"null\"` for `null`", () => {
    assert.strictEqual(sut(null), "null");
  });

  it("should return `\"\"` for `null` with [TreatNullAsEmptyString]", () => {
    assert.strictEqual(sut(null, { treatNullAsEmptyString: true }), "");
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
    assert.strictEqual(sut(Infinity), "Infinity");
    assert.strictEqual(sut(-Infinity), "-Infinity");
    assert.strictEqual(sut(10), "10");
    assert.strictEqual(sut(-10), "-10");
  });

  it("should return the input for a string", () => {
    assert.strictEqual(sut(""), "");
    assert.strictEqual(sut("whee"), "whee");
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
    assert.strictEqual(sut(o), "foo");
  });
}

describe("WebIDL DOMString type", () => {
  const sut = conversions.DOMString;

  commonTest(sut);

  it("should return the input for two-byte characters", () => {
    assert.strictEqual(sut("中文"), "中文");
  });

  it("should return the input for valid Unicode surrogates", () => {
    assert.strictEqual(sut("\uD83D\uDE00"), "\uD83D\uDE00");
  });

  it("should return the input for invalid Unicode surrogates", () => {
    assert.strictEqual(sut("\uD83D"), "\uD83D");
    assert.strictEqual(sut("\uD83Da"), "\uD83Da");
    assert.strictEqual(sut("a\uD83D"), "a\uD83D");
    assert.strictEqual(sut("a\uD83Da"), "a\uD83Da");
    assert.strictEqual(sut("\uDE00"), "\uDE00");
    assert.strictEqual(sut("\uDE00a"), "\uDE00a");
    assert.strictEqual(sut("a\uDE00"), "a\uDE00");
    assert.strictEqual(sut("a\uDE00a"), "a\uDE00a");
    assert.strictEqual(sut("\uDE00\uD830"), "\uDE00\uD830");
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
    assert.strictEqual(sut("中文"), "中文");
  });

  it("should return the input for valid Unicode surrogates", () => {
    assert.strictEqual(sut("\uD83D\uDE00"), "\uD83D\uDE00");
  });

  it("should replace invalid Unicode surrogates with U+FFFD REPLACEMENT CHARACTER", () => {
    assert.strictEqual(sut("\uD83D"), "\uFFFD");
    assert.strictEqual(sut("\uD83Da"), "\uFFFDa");
    assert.strictEqual(sut("a\uD83D"), "a\uFFFD");
    assert.strictEqual(sut("a\uD83Da"), "a\uFFFDa");
    assert.strictEqual(sut("\uDE00"), "\uFFFD");
    assert.strictEqual(sut("\uDE00a"), "\uFFFDa");
    assert.strictEqual(sut("a\uDE00"), "a\uFFFD");
    assert.strictEqual(sut("a\uDE00a"), "a\uFFFDa");
    assert.strictEqual(sut("\uDE00\uD830"), "\uFFFD\uFFFD");
  });
});
