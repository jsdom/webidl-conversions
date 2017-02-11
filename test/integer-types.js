"use strict";
const assert = require("assert");

const conversions = require("..");

function assertIs(actual, expected, message) {
    if (!Object.is(actual, expected)) {
        assert.fail(actual, expected, message, "is", assertIs);
    }
}

function commonTest(sut) {
    it("should return 0 for 0", () => {
        assertIs(sut(0), 0);
    });

    it("should return 0 for -0", () => {
        assertIs(sut(0), 0);
    });

    it("should return 0 for -0 with [EnforceRange]", () => {
        assertIs(sut(0, { enforceRange: true }), 0);
    });

    it("should return 0 for -0 with [Clamp]", () => {
        assertIs(sut(0, { clamp: true }), 0);
    });

    it("should return 42 for 42", () => {
        assertIs(sut(42), 42);
    });

    it("should return 0 for null", () => {
        assertIs(sut(null), 0);
    });

    it("should return 0 for \"\"", () => {
        assertIs(sut(""), 0);
    });

    it("should return 0 for false", () => {
        assertIs(sut(0), 0);
    });

    it("should return 1 for true", () => {
        assertIs(sut(null), 0);
    });

    it("should return 0 for random whitespace", () => {
        assertIs(sut(" \t\n\t "), 0);
    });

    it("should return 0 for \"123, 123\"", () => {
        assertIs(sut("123,123"), 0);
    });
    it("should return 123 for \" 123 \"", () => {
        assertIs(sut(" 123 "), 123);
    });

    it("should return 123 for \" 123.400 \"", () => {
        assertIs(sut(" 123.400 "), 123);
    });
}

function commonTestNonFinite(sut) {
    it("should return 0 for NaN", () => {
        assertIs(sut(NaN), 0);
    });

    it("should return 0 for +Infinity", () => {
        assertIs(sut(Infinity), 0);
    });

    it("should return 0 for -Infinity", () => {
        assertIs(sut(Infinity), 0);
    });

    it("should throw for NaN with [EnforceRange]", () => {
        assert.throws(() => sut(NaN, { enforceRange: true }), TypeError);
    });

    it("should throw for +Infinity with [EnforceRange]", () => {
        assert.throws(() => sut(Infinity, { enforceRange: true }), TypeError);
    });

    it("should throw for -Infinity with [EnforceRange]", () => {
        assert.throws(() => sut(-Infinity, { enforceRange: true }), TypeError);
    });
}

function generateTests(sut, testCases, options, extraLabel) {
    extraLabel = extraLabel === undefined ? "" : " " + extraLabel;

    for (const testCase of testCases) {
        const input = testCase[0];
        const expected = testCase[1];

        if (expected === TypeError) {
            it("should throw for " + input + extraLabel, () => {
                assert.throws(() => sut(input, options), TypeError);
            });
        } else {
            it(`should return ${expected} for ${input}${extraLabel}`, () => {
                assertIs(sut(input, options), expected);
            });
        }
    }
}

describe("WebIDL byte type", () => {
    const sut = conversions.byte;

    commonTest(sut);
    commonTestNonFinite(sut);

    generateTests(sut, [
        [-128, -128],
        [127, 127],
        [128, -128],
        [129, -127],
        [-129, 127],
        [-130, 126],
        [256, 0],
        [257, 1]
    ]);

    generateTests(sut, [
        [-128, -128],
        [-129, -128],
        [-10000, -128],
        [-Infinity, -128],
        [127, 127],
        [128, 127],
        [10000, 127],
        [Infinity, 127]
    ], { clamp: true }, "with [Clamp]");

    generateTests(sut, [
        [-128, -128],
        [-129, TypeError],
        [-10000, TypeError],
        [127, 127],
        [128, TypeError],
        [10000, TypeError]
    ], { enforceRange: true }, "with [EnforceRange]");
});

describe("WebIDL octet type", () => {
    const sut = conversions.octet;

    commonTest(sut);
    commonTestNonFinite(sut);
});

describe("WebIDL short type", () => {
    const sut = conversions.short;

    commonTest(sut);
    commonTestNonFinite(sut);
});

describe("WebIDL unsigned short type", () => {
    const sut = conversions["unsigned short"];

    commonTest(sut);
    commonTestNonFinite(sut);
});

describe("WebIDL long type", () => {
    const sut = conversions.long;

    commonTest(sut);
    commonTestNonFinite(sut);
});

describe("WebIDL unsigned long type", () => {
    const sut = conversions["unsigned long"];

    commonTest(sut);
    commonTestNonFinite(sut);
});

describe("WebIDL long long type", () => {
    const sut = conversions["long long"];

    commonTest(sut);
    commonTestNonFinite(sut);
});

describe("WebIDL unsigned long long type", () => {
    const sut = conversions["unsigned long long"];

    commonTest(sut);
    commonTestNonFinite(sut);
});
