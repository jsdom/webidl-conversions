"use strict";
const assert = require("assert");
const vm = require("vm");

const assertThrows = require("./assertThrows");
const conversions = require("..");

function commonNotOk(sut) {
    it("should throw a TypeError for `undefined`", () => {
        assertThrows(sut, [undefined], TypeError);
    });

    it("should throw a TypeError for `null`", () => {
        assertThrows(sut, [null], TypeError);
    });

    it("should throw a TypeError for `true`", () => {
        assertThrows(sut, [true], TypeError);
    });

    it("should throw a TypeError for `false`", () => {
        assertThrows(sut, [false], TypeError);
    });

    it("should throw a TypeError for `Infinity`", () => {
        assertThrows(sut, [Infinity], TypeError);
    });

    it("should throw a TypeError for `NaN`", () => {
        assertThrows(sut, [NaN], TypeError);
    });

    it("should throw a TypeError for `0`", () => {
        assertThrows(sut, [0], TypeError);
    });

    it("should throw a TypeError for `''`", () => {
        assertThrows(sut, [""], TypeError);
    });

    it("should throw a TypeError for `Symbol.iterator`", () => {
        assertThrows(sut, [Symbol.iterator], TypeError);
    });

    it("should throw a TypeError for `{}`", () => {
        assertThrows(sut, [{}], TypeError);
    });

    it("should throw a TypeError for `() => {}`", () => {
        assertThrows(sut, [() => {}], TypeError);
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
        assertThrows(sut, [create()], TypeError);
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
    const { name } = constructor;
    bufferSourceCreators.push(
        {
            typeName: name,
            label: `${name} same realm`,
            creator: () => new constructor(new ArrayBuffer(0))
        },
        {
            typeName: name,
            label: `${name} different realm`,
            creator: () => vm.runInContext(`new ${name}(new ArrayBuffer(0))`, differentRealm)
        },
        {
            typeName: name,
            label: `forged ${name}`,
            creator: () => Object.create(constructor.prototype, { [Symbol.toStringTag]: { value: name } }),
            isForged: true
        }
    );
}

for (const type of bufferSourceConstructors) {
    const typeName = type.name;
    const sut = conversions[typeName];

    describe("WebIDL " + typeName + " type", () => {
        for (const innerType of bufferSourceCreators) {
            const testFunction = innerType.typeName === typeName && !innerType.isForged ? testOk : testNotOk;
            testFunction(innerType.label, sut, innerType.creator);
        }

        commonNotOk(sut);
    });
}

describe("WebIDL ArrayBufferView type", () => {
    const sut = conversions.ArrayBufferView;

    for (const { label, typeName, creator, isForged } of bufferSourceCreators) {
        const testFunction = typeName !== "ArrayBuffer" && !isForged ? testOk : testNotOk;
        testFunction(label, sut, creator);
    }

    commonNotOk(sut);
});

describe("WebIDL BufferSource type", () => {
    const sut = conversions.BufferSource;

    for (const { label, creator, isForged } of bufferSourceCreators) {
        const testFunction = !isForged ? testOk : testNotOk;
        testFunction(label, sut, creator);
    }

    commonNotOk(sut);
});
