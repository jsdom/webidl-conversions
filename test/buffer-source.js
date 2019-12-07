"use strict";
const assert = require("assert");
const vm = require("vm");

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

const differentRealm = vm.createContext();

const bufferSourceConstructors = [
    DataView,
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
];

const bufferSourceCreators = [];
for (const constructor of bufferSourceConstructors) {
    bufferSourceCreators.push(
        {
            typeName: constructor.name,
            label: `${constructor.name} same realm`,
            creator: () => new constructor(new ArrayBuffer(0))
        },
        {
            typeName: constructor.name,
            label: `${constructor.name} different realm`,
            creator: () => vm.runInContext(`new ${constructor.name}(new ArrayBuffer(0))`, differentRealm)
        }
    );
}

for (const type of bufferSourceConstructors) {
    const typeName = type.name;
    const sut = conversions[typeName];

    describe("WebIDL " + typeName + " type", () => {
        for (const innerType of bufferSourceCreators) {
            const testFunction = innerType.typeName === typeName ? testOk : testNotOk;
            testFunction(innerType.label, sut, innerType.creator);
        }

        commonNotOk(sut);
    });
}

describe("WebIDL ArrayBufferView type", () => {
    const sut = conversions.ArrayBufferView;

    for (const { label, typeName, creator } of bufferSourceCreators) {
        const testFunction = typeName !== "ArrayBuffer" ? testOk : testNotOk;
        testFunction(label, sut, creator);
    }

    commonNotOk(sut);
});

describe("WebIDL BufferSource type", () => {
    const sut = conversions.BufferSource;

    for (const { label, creator } of bufferSourceCreators) {
        testOk(label, sut, creator);
    }

    commonNotOk(sut);
});
