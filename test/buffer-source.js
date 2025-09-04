"use strict";
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const { MessageChannel } = require("node:worker_threads");

const assertThrows = require("./helpers/assertThrows");
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
  it(`should return input for ${name}`, () => {
    const obj = create();
    assert.equal(sut(obj), obj);
  });
}

function testNotOk(name, sut, create) {
  it(`should throw a TypeError for ${name}`, () => {
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

const bufferSourceCreators = [
  {
    typeName: "ArrayBuffer",
    isShared: false,
    isResizable: false,
    isDetached: false,
    label: "ArrayBuffer same realm",
    creator: () => new ArrayBuffer(0)
  },
  {
    typeName: "ArrayBuffer",
    isShared: false,
    isResizable: true,
    isDetached: false,
    label: "resizable ArrayBuffer same realm",
    creator: () => new ArrayBuffer(0, { maxByteLength: 1 })
  },
  {
    typeName: "ArrayBuffer",
    isShared: false,
    isResizable: false,
    isDetached: true,
    label: "detached ArrayBuffer",
    creator: () => {
      const value = new ArrayBuffer(0);
      const { port1 } = new MessageChannel();
      port1.postMessage(undefined, [value]);
      return value;
    }
  },
  {
    typeName: "SharedArrayBuffer",
    isShared: true,
    isResizable: false,
    isDetached: false,
    label: "SharedArrayBuffer same realm",
    creator: () => new SharedArrayBuffer(0)
  },
  {
    typeName: "SharedArrayBuffer",
    isShared: true,
    isResizable: true,
    isDetached: false,
    label: "growable SharedArrayBuffer same realm",
    creator: () => new SharedArrayBuffer(0, { maxByteLength: 1 })
  },
  {
    typeName: "SharedArrayBuffer",
    isShared: true,
    isResizable: false,
    isDetached: false,
    label: "SharedArrayBuffer different realm",
    creator: () => vm.runInContext(`new SharedArrayBuffer(0)`, differentRealm)
  },
  {
    typeName: "SharedArrayBuffer",
    isShared: true,
    isResizable: true,
    isDetached: false,
    label: "growable SharedArrayBuffer different realm",
    creator: () => vm.runInContext(`new SharedArrayBuffer(0, { maxByteLength: 1 })`, differentRealm)
  }
];

for (const constructor of bufferSourceConstructors) {
  if (constructor === ArrayBuffer) {
    continue;
  }

  const { name } = constructor;
  bufferSourceCreators.push(
    {
      typeName: name,
      isShared: false,
      isResizable: false,
      isDetached: false,
      isForged: false,
      label: `${name} same realm`,
      creator: () => new constructor(new ArrayBuffer(0))
    },
    {
      typeName: name,
      isShared: false,
      isResizable: false,
      isDetached: false,
      isForged: false,
      label: `${name} different realm`,
      creator: () => vm.runInContext(`new ${constructor.name}(new ArrayBuffer(0))`, differentRealm)
    },
    {
      typeName: name,
      isShared: false,
      isResizable: true,
      isDetached: false,
      isForged: false,
      label: `resizable ${name} same realm`,
      creator: () => new constructor(new ArrayBuffer(0, { maxByteLength: 1 }))
    },
    {
      typeName: name,
      isShared: false,
      isResizable: true,
      isDetached: false,
      isForged: false,
      label: `resizable ${name} different realm`,
      creator: () => vm.runInContext(
        `new ${constructor.name}(new ArrayBuffer(0, { maxByteLength: 1 }))`,
        differentRealm
      )
    },
    {
      typeName: name,
      isShared: false,
      isResizable: false,
      isDetached: false,
      isForged: true,
      label: `forged ${name}`,
      creator: () => Object.create(constructor.prototype, { [Symbol.toStringTag]: { value: name } })
    },
    {
      typeName: name,
      isShared: false,
      isResizable: false,
      isDetached: true,
      isForged: false,
      label: `detached ${name}`,
      creator: () => {
        const value = new constructor(new ArrayBuffer(0));
        const { port1 } = new MessageChannel();
        port1.postMessage(undefined, [value.buffer]);
        return value;
      }
    },
    {
      typeName: name,
      isShared: true,
      isResizable: false,
      isDetached: false,
      isForged: false,
      label: `${name} SharedArrayBuffer same realm`,
      creator: () => new constructor(new SharedArrayBuffer(0))
    },
    {
      typeName: name,
      isShared: true,
      isResizable: false,
      isDetached: false,
      isForged: false,
      label: `${name} SharedArrayBuffer different realm`,
      creator: () => vm.runInContext(`new ${constructor.name}(new SharedArrayBuffer(0))`, differentRealm)
    },
    {
      typeName: name,
      isShared: true,
      isResizable: true,
      isDetached: false,
      isForged: false,
      label: `${name} growable SharedArrayBuffer same realm`,
      creator: () => new constructor(new SharedArrayBuffer(0, { maxByteLength: 1 }))
    },
    {
      typeName: name,
      isShared: true,
      isResizable: true,
      isDetached: false,
      isForged: false,
      label: `${name} growable SharedArrayBuffer different realm`,
      creator: () => vm.runInContext(
        `new ${constructor.name}(new SharedArrayBuffer(0, { maxByteLength: 1 }))`,
        differentRealm
      )
    }
  );
}

for (const type of bufferSourceConstructors) {
  const typeName = type.name;
  const sut = conversions[typeName];

  describe(`WebIDL ${typeName} type`, () => {
    for (const innerType of bufferSourceCreators) {
      const testFunction =
        innerType.typeName === typeName &&
        !innerType.isShared &&
        !innerType.isResizable &&
        !innerType.isDetached &&
        !innerType.isForged ?
          testOk :
          testNotOk;

      testFunction(innerType.label, sut, innerType.creator);
    }

    commonNotOk(sut);

    describe("with [AllowShared]", () => {
      const allowSharedSUT = (v, opts) => conversions[typeName](v, { ...opts, allowShared: true });

      for (const {
        label, creator, typeName: innerTypeName, isResizable, isDetached, isForged
      } of bufferSourceCreators) {
        const testFunction = innerTypeName === typeName &&
          !isResizable &&
          !isDetached &&
          !isForged ?
            testOk :
            testNotOk;
        testFunction(label, allowSharedSUT, creator);
      }

      commonNotOk(allowSharedSUT);
    });

    describe("with [AllowResizable]", () => {
      const allowResizableSUT = (v, opts) => conversions[typeName](v, { ...opts, allowResizable: true });

      for (const {
        label, creator, typeName: innerTypeName, isShared, isDetached, isForged
      } of bufferSourceCreators) {
        const testFunction = innerTypeName === typeName &&
          !isShared &&
          !isDetached &&
          !isForged ?
            testOk :
            testNotOk;
        testFunction(label, allowResizableSUT, creator);
      }

      commonNotOk(allowResizableSUT);
    });

    describe("with [AllowShared, AllowResizable]", () => {
      const allowSharedAndResizableSUT = (v, opts) => {
        return conversions[typeName](v, { ...opts, allowShared: true, allowResizable: true });
      };

      for (const { label, creator, typeName: innerTypeName, isDetached, isForged } of bufferSourceCreators) {
        const testFunction = innerTypeName === typeName &&
        !isDetached &&
        !isForged ?
          testOk :
          testNotOk;
        testFunction(label, allowSharedAndResizableSUT, creator);
      }

      commonNotOk(allowSharedAndResizableSUT);
    });
  });
}

describe(`WebIDL SharedArrayBuffer type`, () => {
  const sut = conversions.SharedArrayBuffer;

  for (const innerType of bufferSourceCreators) {
    const testFunction =
      innerType.typeName === "SharedArrayBuffer" &&
      innerType.isShared &&
      !innerType.isResizable &&
      !innerType.isDetached &&
      !innerType.isForged ?
        testOk :
        testNotOk;

    testFunction(innerType.label, sut, innerType.creator);
  }

  commonNotOk(sut);

  describe("with [AllowResizable]", () => {
    const allowResizableSUT = (v, opts) => sut(v, { ...opts, allowResizable: true });

    for (const { label, creator, typeName: innerTypeName, isDetached, isForged } of bufferSourceCreators) {
      const testFunction = innerTypeName === "SharedArrayBuffer" &&
        !isDetached &&
        !isForged ?
          testOk :
          testNotOk;
      testFunction(label, allowResizableSUT, creator);
    }

    commonNotOk(allowResizableSUT);
  });
});

describe("WebIDL ArrayBufferView type", () => {
  const sut = conversions.ArrayBufferView;

  for (const { label, typeName, isShared, isResizable, isDetached, isForged, creator } of bufferSourceCreators) {
    const testFunction =
      typeName !== "ArrayBuffer" &&
      typeName !== "SharedArrayBuffer" &&
      !isShared &&
      !isResizable &&
      !isDetached &&
      !isForged ?
        testOk :
        testNotOk;

    testFunction(label, sut, creator);
  }

  commonNotOk(sut);

  describe("with [AllowShared]", () => {
    const allowSharedSUT = (v, opts) => conversions.ArrayBufferView(v, { ...opts, allowShared: true });

    for (const { label, creator, typeName, isResizable, isDetached, isForged } of bufferSourceCreators) {
      const testFunction =
        typeName !== "ArrayBuffer" &&
        typeName !== "SharedArrayBuffer" &&
        !isResizable &&
        !isDetached &&
        !isForged ?
          testOk :
          testNotOk;

      testFunction(label, allowSharedSUT, creator);
    }

    commonNotOk(allowSharedSUT);
  });

  describe("with [AllowResizable]", () => {
    const allowResizableSUT = (v, opts) => conversions.ArrayBufferView(v, { ...opts, allowResizable: true });

    for (const { label, creator, typeName, isShared, isDetached, isForged } of bufferSourceCreators) {
      const testFunction =
        typeName !== "ArrayBuffer" &&
        typeName !== "SharedArrayBuffer" &&
        !isShared &&
        !isDetached &&
        !isForged ?
          testOk :
          testNotOk;

      testFunction(label, allowResizableSUT, creator);
    }

    commonNotOk(allowResizableSUT);
  });

  describe("with [AllowShared, AllowResizable]", () => {
    const allowResizableSUT = (v, opts) => {
      return conversions.ArrayBufferView(v, { ...opts, allowShared: true, allowResizable: true });
    };

    for (const { label, creator, typeName, isDetached, isForged } of bufferSourceCreators) {
      const testFunction =
        typeName !== "ArrayBuffer" &&
        typeName !== "SharedArrayBuffer" &&
        !isDetached &&
        !isForged ?
          testOk :
          testNotOk;

      testFunction(label, allowResizableSUT, creator);
    }

    commonNotOk(allowResizableSUT);
  });
});

describe("WebIDL BufferSource type", () => {
  const sut = conversions.BufferSource;

  for (const { label, creator, isShared, isResizable, isDetached, isForged } of bufferSourceCreators) {
    const testFunction = !isShared && !isResizable && !isDetached && !isForged ? testOk : testNotOk;
    testFunction(label, sut, creator);
  }

  commonNotOk(sut);

  describe("with [AllowShared]", () => {
    const allowSharedSUT = (v, opts) => conversions.BufferSource(v, { ...opts, allowShared: true });

    for (const { label, creator, isResizable, isDetached, isForged } of bufferSourceCreators) {
      const testFunction = !isResizable && !isDetached && !isForged ? testOk : testNotOk;
      testFunction(label, allowSharedSUT, creator);
    }

    commonNotOk(allowSharedSUT);
  });

  describe("with [AllowResizable]", () => {
    const allowResizableSUT = (v, opts) => conversions.BufferSource(v, { ...opts, allowResizable: true });

    for (const { label, creator, isShared, isDetached, isForged } of bufferSourceCreators) {
      const testFunction = !isShared && !isDetached && !isForged ? testOk : testNotOk;
      testFunction(label, allowResizableSUT, creator);
    }

    commonNotOk(allowResizableSUT);
  });

  describe("with [AllowShared, AllowResizable]", () => {
    const allowResizableSUT = (v, opts) => {
      return conversions.BufferSource(v, { ...opts, allowShared: true, allowResizable: true });
    };

    for (const { label, creator, isDetached, isForged } of bufferSourceCreators) {
      const testFunction = !isDetached && !isForged ? testOk : testNotOk;
      testFunction(label, allowResizableSUT, creator);
    }

    commonNotOk(allowResizableSUT);
  });
});
