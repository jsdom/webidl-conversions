"use strict";
const assert = require("assert");

const conversions = require("..");

function assertIs(actual, expected, message) {
    if (!Object.is(actual, expected)) {
        assert.fail(actual, expected, message, "is", assertIs);
    }
}

const itBigInt = typeof BigInt === "function" && typeof BigInt(0) === "bigint" ? it : it.skip;

function commonTest(sut) {
    it("should return 0 for 0", () => {
        assertIs(sut(0), 0);
    });

    it("should return 0 for -0", () => {
        assertIs(sut(-0), 0);
    });

    it("should return 0 for -0 with [EnforceRange]", () => {
        assertIs(sut(-0, { enforceRange: true }), 0);
    });

    it("should return 0 for -0 with [Clamp]", () => {
        assertIs(sut(-0, { clamp: true }), 0);
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

    itBigInt("should throw a TypeError for `0n`", () => {
        assert.throws(() => sut(BigInt(0)), TypeError);
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
        [257, 1],
        [256, 0],
        [129, -127],
        [128, -128],
        [127.8, 127],
        [127.5, 127],
        [127.2, 127],
        [127, 127],
        [3.5, 3],
        [2.5, 2],
        [1.5, 1],
        [0.8, 0],
        [0.5, 0],
        [0.2, 0],
        [-0.2, 0],
        [-0.5, 0],
        [-0.8, 0],
        [-1, -1],
        [-1.5, -1],
        [-1.8, -1],
        [-2.5, -2],
        [-3.5, -3],
        [-128, -128],
        [-129, 127],
        [-130, 126]
    ]);

    generateTests(sut, [
        [-128, -128],
        [-129, -128],
        [-10000, -128],
        [-Infinity, -128],
        [127, 127],
        [128, 127],
        [10000, 127],
        [Infinity, 127],
        [3.5, 4],
        [2.5, 2],
        [1.5, 2],
        [0.8, 1],
        [0.5, 0],
        [0.2, 0],
        [-0.2, 0],
        [-0.5, 0],
        [-0.8, -1],
        [-1.2, -1],
        [-1.5, -2],
        [-1.8, -2],
        [-2.5, -2],
        [-2.8, -3]
    ], { clamp: true }, "with [Clamp]");

    generateTests(sut, [
        [-128, -128],
        [-128.8, -128],
        [-129, TypeError],
        [-10000, TypeError],
        [127, 127],
        [127.8, 127],
        [128, TypeError],
        [10000, TypeError]
    ], { enforceRange: true }, "with [EnforceRange]");
});

describe("WebIDL octet type", () => {
    const sut = conversions.octet;

    commonTest(sut);
    commonTestNonFinite(sut);

    generateTests(sut, [
        [512, 0],
        [257, 1],
        [256, 0],
        [255.8, 255],
        [255.5, 255],
        [255.2, 255],
        [255, 255],
        [129, 129],
        [128, 128],
        [127, 127],
        [3.5, 3],
        [2.5, 2],
        [1.5, 1],
        [0.8, 0],
        [0.5, 0],
        [0.2, 0],
        [-0.2, 0],
        [-0.5, 0],
        [-0.8, 0],
        [-1, 255],
        [-1.5, 255],
        [-1.8, 255],
        [-2, 254],
        [-2.5, 254],
        [-3.5, 253],
        [-128, 128]
    ]);

    generateTests(sut, [
        [-1, 0],
        [-255, 0],
        [-256, 0],
        [-1000, 0],
        [-Infinity, 0],
        [127, 127],
        [128, 128],
        [255, 255],
        [256, 255],
        [10000, 255],
        [Infinity, 255],
        [3.5, 4],
        [2.5, 2],
        [1.5, 2],
        [0.8, 1],
        [0.5, 0],
        [0.2, 0],
        [-0.2, 0],
        [-0.5, 0],
        [-0.8, 0]
    ], { clamp: true }, "with [Clamp]");

    generateTests(sut, [
        [-256, TypeError],
        [-1, TypeError],
        [-0.8, 0],
        [0, 0],
        [255, 255],
        [255.8, 255],
        [256, TypeError],
        [10000, TypeError]
    ], { enforceRange: true }, "with [EnforceRange]");
});

describe("WebIDL short type", () => {
    const sut = conversions.short;

    commonTest(sut);
    commonTestNonFinite(sut);

    generateTests(sut, [
        [-32768, -32768],
        [32767, 32767],
        [32768, -32768],
        [32769, -32767],
        [-32769, 32767],
        [-32770, 32766],
        [65536, 0],
        [65537, 1]
    ]);

    generateTests(sut, [
        [-32768, -32768],
        [-32769, -32768],
        [-1000000, -32768],
        [-Infinity, -32768],
        [32767, 32767],
        [32768, 32767],
        [1000000, 32767],
        [Infinity, 32767]
    ], { clamp: true }, "with [Clamp]");

    generateTests(sut, [
        [-32768, -32768],
        [-32769, TypeError],
        [-100000, TypeError],
        [32767, 32767],
        [32768, TypeError],
        [100000, TypeError]
    ], { enforceRange: true }, "with [EnforceRange]");
});

describe("WebIDL unsigned short type", () => {
    const sut = conversions["unsigned short"];

    commonTest(sut);
    commonTestNonFinite(sut);

    generateTests(sut, [
        [-32768, 32768],
        [32767, 32767],
        [32768, 32768],
        [32769, 32769],
        [65535, 65535],
        [65536, 0],
        [65537, 1],
        [131072, 0],
        [-1, 65535],
        [-2, 65534]
    ]);

    generateTests(sut, [
        [-1, 0],
        [-32767, 0],
        [-32768, 0],
        [-100000, 0],
        [-Infinity, 0],
        [32767, 32767],
        [32768, 32768],
        [65535, 65535],
        [65536, 65535],
        [100000, 65535],
        [Infinity, 65535]
    ], { clamp: true }, "with [Clamp]");

    generateTests(sut, [
        [-65536, TypeError],
        [-1, TypeError],
        [0, 0],
        [65535, 65535],
        [65536, TypeError],
        [100000, TypeError]
    ], { enforceRange: true }, "with [EnforceRange]");
});

describe("WebIDL long type", () => {
    const sut = conversions.long;

    commonTest(sut);
    commonTestNonFinite(sut);

    generateTests(sut, [
        [-2147483648, -2147483648],
        [2147483647, 2147483647],
        [2147483648, -2147483648],
        [2147483649, -2147483647],
        [-2147483649, 2147483647],
        [-2147483650, 2147483646],
        [4294967296, 0],
        [4294967297, 1]
    ]);

    generateTests(sut, [
        [-2147483648, -2147483648],
        [-2147483649, -2147483648],
        [-10000000000, -2147483648],
        [-Infinity, -2147483648],
        [2147483647, 2147483647],
        [2147483648, 2147483647],
        [10000000000, 2147483647],
        [Infinity, 2147483647]
    ], { clamp: true }, "with [Clamp]");

    generateTests(sut, [
        [-2147483648, -2147483648],
        [-2147483649, TypeError],
        [-10000000000, TypeError],
        [2147483647, 2147483647],
        [2147483648, TypeError],
        [10000000000, TypeError]
    ], { enforceRange: true }, "with [EnforceRange]");
});

describe("WebIDL unsigned long type", () => {
    const sut = conversions["unsigned long"];

    commonTest(sut);
    commonTestNonFinite(sut);

    generateTests(sut, [
        [-2147483648, 2147483648],
        [2147483647, 2147483647],
        [2147483648, 2147483648],
        [2147483649, 2147483649],
        [4294967295, 4294967295],
        [4294967296, 0],
        [4294967297, 1],
        [8589934592, 0],
        [-1, 4294967295],
        [-2, 4294967294]
    ]);

    generateTests(sut, [
        [-1, 0],
        [-4294967295, 0],
        [-4294967296, 0],
        [-10000000000, 0],
        [-Infinity, 0],
        [2147483647, 2147483647],
        [2147483648, 2147483648],
        [4294967295, 4294967295],
        [4294967296, 4294967295],
        [10000000000, 4294967295],
        [Infinity, 4294967295]
    ], { clamp: true }, "with [Clamp]");

    generateTests(sut, [
        [-4294967296, TypeError],
        [-1, TypeError],
        [0, 0],
        [4294967295, 4294967295],
        [4294967296, TypeError],
        [10000000000, TypeError]
    ], { enforceRange: true }, "with [EnforceRange]");
});

describe("WebIDL long long type", () => {
    const sut = conversions["long long"];

    commonTest(sut);
    commonTestNonFinite(sut);

    generateTests(sut, [
        [4294967296, 4294967296],
        [9007199254740991, 9007199254740991],
        [9007199254740992, 9007199254740992],
        [9007199254740993, 9007199254740992], // This is just JavaScript; no Web IDL special behavior involved
        [9007199254740994, 9007199254740994],
        [4611686018427388000, 4611686018427388000],
        [9223372036854776000, -9223372036854776000],
        [-4294967295, -4294967295],
        [-9007199254740991, -9007199254740991]
    ]);

    generateTests(sut, [
        [4294967296, 4294967296],
        [9007199254740991, 9007199254740991],
        [9007199254740992, 9007199254740991],
        [9007199254740993, 9007199254740991],
        [9007199254740994, 9007199254740991],
        [4611686018427388000, 9007199254740991],
        [9223372036854776000, 9007199254740991],
        [18446744073709552000, 9007199254740991],
        [-4294967295, -4294967295],
        [-9007199254740991, -9007199254740991],
        [-9007199254740992, -9007199254740991],
        [-18446744073709552000, -9007199254740991]
    ], { clamp: true }, "with [Clamp]");

    generateTests(sut, [
        [4294967296, 4294967296],
        [9007199254740991, 9007199254740991],
        [9007199254740992, TypeError],
        [9007199254740993, TypeError],
        [9007199254740994, TypeError],
        [4611686018427388000, TypeError],
        [9223372036854776000, TypeError],
        [18446744073709552000, TypeError],
        [-4294967295, -4294967295],
        [-9007199254740991, -9007199254740991],
        [-9007199254740992, TypeError],
        [-18446744073709552000, TypeError]
    ], { enforceRange: true }, "with [EnforceRange]");
});

describe.skip("WebIDL long long test cases hard to pass within JavaScript", () => {
    // See the README for more details.
    const sut = conversions["long long"];

    generateTests(sut, [
        [18446744073709552000, -18446744073709552000]
    ]);
});

describe("WebIDL unsigned long long type", () => {
    const sut = conversions["unsigned long long"];

    commonTest(sut);
    commonTestNonFinite(sut);

    generateTests(sut, [
        [4294967296, 4294967296],
        [9007199254740991, 9007199254740991],
        [9007199254740992, 9007199254740992],
        [9007199254740993, 9007199254740992], // This is just JavaScript; no Web IDL special behavior involved
        [9007199254740994, 9007199254740994],
        [4611686018427388000, 4611686018427388000],
        [9223372036854776000, 9223372036854776000],
        [-4294967295, 18446744069414584321],
        [-9007199254740991, 18437736874454810625]
    ]);

    generateTests(sut, [
        [4294967296, 4294967296],
        [9007199254740991, 9007199254740991],
        [9007199254740992, 9007199254740991],
        [9007199254740993, 9007199254740991],
        [9007199254740994, 9007199254740991],
        [4611686018427388000, 9007199254740991],
        [9223372036854776000, 9007199254740991],
        [18446744073709552000, 9007199254740991],
        [-4294967295, 0],
        [-9007199254740991, 0],
        [-9007199254740992, 0],
        [-18446744073709552000, 0]
    ], { clamp: true }, "with [Clamp]");

    generateTests(sut, [
        [4294967296, 4294967296],
        [9007199254740991, 9007199254740991],
        [9007199254740992, TypeError],
        [9007199254740993, TypeError],
        [9007199254740994, TypeError],
        [4611686018427388000, TypeError],
        [9223372036854776000, TypeError],
        [18446744073709552000, TypeError],
        [-4294967295, TypeError],
        [-9007199254740991, TypeError],
        [-9007199254740992, TypeError],
        [-18446744073709552000, TypeError]
    ], { enforceRange: true }, "with [EnforceRange]");
});

describe.skip("WebIDL unsigned long long test cases hard to pass within JavaScript", () => {
    // See the README for more details.
    const sut = conversions["unsigned long long"];

    generateTests(sut, [
        [18446744073709552000, -18446744073709552000]
    ]);
});
