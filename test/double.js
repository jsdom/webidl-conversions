"use strict";
const assert = require("assert");

const conversions = require("..");
const assertThrows = require("./helpers/assertThrows");

function assertIs(actual, expected, message) {
  if (!Object.is(actual, expected)) {
    assert.fail(actual, expected, message, "is", assertIs);
  }
}

function commonTest(sut) {
  it("should return `0` for `0`", () => {
    assert.strictEqual(sut(0), 0);
  });

  it("should return `-0` for `-0`", () => {
    assertIs(sut(-0), -0);
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

  it("should return `-123.5` for `\" -123.500 \"`", () => {
    assert.strictEqual(sut(" -123.500 "), -123.5);
  });

  it("should throw a TypeError for `0n`", () => {
    assertThrows(sut, [0n], TypeError);
  });
}

function commonRestricted(sut) {
  it("should throw a TypeError for no argument", () => {
    assertThrows(sut, [], TypeError);
  });

  it("should throw a TypeError for `undefined`", () => {
    assertThrows(sut, [undefined], TypeError);
  });

  it("should throw a TypeError for `NaN`", () => {
    assertThrows(sut, [NaN], TypeError);
  });

  it("should throw a TypeError for `+Infinity`", () => {
    assertThrows(sut, [Infinity], TypeError);
  });

  it("should throw a TypeError for `-Infinity`", () => {
    assertThrows(sut, [-Infinity], TypeError);
  });

  it("should throw a TypeError for `\" 123,123 \"` (since it becomes `NaN`)", () => {
    assertThrows(sut, [" 123,123 "], TypeError);
  });
}

function commonUnrestricted(sut) {
  it("should return `NaN` for no argument", () => {
    assert(isNaN(sut()));
  });

  it("should return `NaN for `undefined`", () => {
    assert(isNaN(sut(undefined)));
  });

  it("should return `NaN for `NaN`", () => {
    assert(isNaN(sut(NaN)));
  });

  it("should return `+Infinity` for `+Infinity`", () => {
    assert.strictEqual(sut(Infinity), Infinity);
  });

  it("should return `-Infinity` for `-Infinity`", () => {
    assert.strictEqual(sut(-Infinity), -Infinity);
  });

  it("should return `NaN for `\" 123,123 \"` (since it becomes `NaN`)", () => {
    assert(isNaN(sut(" 123,123 ")));
  });
}

function commonDouble(sut) {
  it("should return `3.5000000000000004` for `3.5000000000000004`", () => {
    assert.strictEqual(sut(3.5000000000000004), 3.5000000000000004);
  });

  it("should return `-3.5000000000000004` for `-3.5000000000000004`", () => {
    assert.strictEqual(sut(-3.5000000000000004), -3.5000000000000004);
  });
}

function commonFloat(sut) {
  it("should return `3.5` for `3.5000000000000004`", () => {
    assert.strictEqual(sut(3.5000000000000004), 3.5);
  });

  it("should return `-3.5` for `-3.5000000000000004`", () => {
    assert.strictEqual(sut(-3.5000000000000004), -3.5);
  });
}

describe("WebIDL double type", () => {
  const sut = conversions.double;

  commonTest(sut);
  commonRestricted(sut);
  commonDouble(sut);
});

describe("WebIDL unrestricted double type", () => {
  const sut = conversions["unrestricted double"];

  commonTest(sut);
  commonUnrestricted(sut);
  commonDouble(sut);
});

describe("WebIDL float type", () => {
  const sut = conversions.float;

  commonTest(sut);
  commonRestricted(sut);
  commonFloat(sut);

  it("should throw a TypeError for `2 ** 128`", () => {
    assertThrows(sut, [2 ** 128], TypeError);
  });

  it("should throw a TypeError for `-(2 ** 128)`", () => {
    assertThrows(sut, [-(2 ** 128)], TypeError);
  });
});

describe("WebIDL unrestricted float type", () => {
  const sut = conversions["unrestricted float"];

  commonTest(sut);
  commonUnrestricted(sut);
  commonFloat(sut);

  it("should return `Infinity` for `2 ** 128`", () => {
    assert.strictEqual(sut(2 ** 128), Infinity);
  });

  it("should return `-Infinity` for `-(2 ** 128)`", () => {
    assert.strictEqual(sut(-(2 ** 128)), -Infinity);
  });
});
