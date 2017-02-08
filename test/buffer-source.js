"use strict";

const assert = require("assert");

const conversions = require("..");

function commonNotOk(sut) {
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

    it("should throw a TypeError for `() => {}`", () => {
        assert.throws(() => sut(() => {}), TypeError);
    });
}

function testOk(name, sut, create) {
    it("should return `" + name + "` object for `" + name + "` object", () => {
        const obj = create();
        assert.strictEqual(sut(obj), obj);
    });
}

function testNotOk(name, sut, create) {
    it("should throw a TypeError for `" + name + "` object", () => {
        assert.throws(() => sut(create()), TypeError);
    });
}

const objCreators = [
    [ DataView, () => new DataView(new ArrayBuffer(0)) ]
];

[
    ArrayBuffer,
    Int8Array,
    Int16Array,
    Int32Array,
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Uint8ClampedArray,
    Float32Array,
    Float64Array
].forEach((ctor) => {
    objCreators.push([ctor, () => new ctor(0)]);
});

objCreators.forEach((type) => {
    const name = type[0].name;
    const sut = conversions[name];

    describe("WebIDL " + name + " type", () => {
        objCreators.forEach((innerType) => {
            const name = innerType[0].name;
            const create = innerType[1];

            (innerType === type ? testOk : testNotOk)(name, sut, create);
        });

        commonNotOk(sut);
    });
});

describe("WebIDL ArrayBufferView type", () => {
    const sut = conversions["ArrayBufferView"];

    objCreators.forEach((type) => {
        const name = type[0].name;
        const create = type[1];

        (name === "ArrayBuffer" ? testNotOk : testOk)(name, sut, create);
    });

    commonNotOk(sut);
});

describe("WebIDL BufferSource type", () => {
    const sut = conversions["BufferSource"];

    objCreators.forEach((type) => {
        const name = type[0].name;
        const create = type[1];

        testOk(name, sut, create);
    });

    commonNotOk(sut);
});
