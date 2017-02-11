"use strict";

function type(V) {
    if (V === null) {
        return "Null";
    }
    switch (typeof V) {
        case "undefined":
            return "Undefined";
        case "boolean":
            return "Boolean";
        case "number":
            return "Number";
        case "string":
            return "String";
        case "symbol":
            return "Symbol";
        case "object":
            // Falls through
        case "function":
            // Falls through
        default:
            // Per ES spec, typeof returns an implemention-defined value that is not any of the existing ones for
            // uncallable non-standard exotic objects. Yet Type() which the Web IDL spec depends on returns Object for
            // such cases. So treat the default case as an object.
            return "Object";
    }
}

function sign(x) {
    return x < 0 ? -1 : 1;
}

function evenRound(x) {
    // Round x to the nearest integer, choosing the even integer if it lies halfway between two.
    if ((x % 1) === 0.5 && (x & 1) === 0) { // [even number].5; round down (i.e. floor)
        return Math.floor(x);
    }

    return Math.round(x);
}

function createNumberConversion(bitLength, typeOpts) {
    if (!typeOpts.unsigned) {
        --bitLength;
    }
    const lowerBound = typeOpts.unsigned ? 0 : -Math.pow(2, bitLength);
    const upperBound = Math.pow(2, bitLength) - 1;

    const moduloVal = typeOpts.moduloBitLength ? Math.pow(2, typeOpts.moduloBitLength) : Math.pow(2, bitLength);
    const moduloBound = typeOpts.moduloBitLength ? Math.pow(2, typeOpts.moduloBitLength - 1) :
        Math.pow(2, bitLength - 1);

    return (V, opts) => {
        if (opts === undefined) {
            opts = {};
        }

        let x = +V;

        if (opts.enforceRange) {
            if (!Number.isFinite(x)) {
                throw new TypeError("Argument is not a finite number");
            }

            x = sign(x) * Math.floor(Math.abs(x));
            if (x < lowerBound || x > upperBound) {
                throw new TypeError("Argument is not in byte range");
            }

            return x;
        }

        if (!isNaN(x) && opts.clamp) {
            x = evenRound(x);

            if (x < lowerBound) {
                x = lowerBound;
            }
            if (x > upperBound) {
                x = upperBound;
            }
            return x;
        }

        if (!Number.isFinite(x) || x === 0) {
            return 0;
        }

        x = sign(x) * Math.floor(Math.abs(x));
        x %= moduloVal;

        if (!typeOpts.unsigned && x >= moduloBound) {
            return x - moduloVal;
        } else if (typeOpts.unsigned) {
            if (x < 0) {
                x += moduloVal;
            } else if (Object.is(x, -0)) { // Don't return negative zero
                return 0;
            }
        }

        return x;
    };
}

exports.any = V => {
    return V;
};

exports.void = function () {
    return undefined;
};

exports.boolean = function (val) {
    return !!val;
};

exports.byte = createNumberConversion(8, { unsigned: false });
exports.octet = createNumberConversion(8, { unsigned: true });

exports.short = createNumberConversion(16, { unsigned: false });
exports["unsigned short"] = createNumberConversion(16, { unsigned: true });

exports.long = createNumberConversion(32, { unsigned: false });
exports["unsigned long"] = createNumberConversion(32, { unsigned: true });

exports["long long"] = createNumberConversion(32, { unsigned: false, moduloBitLength: 64 });
exports["unsigned long long"] = createNumberConversion(32, { unsigned: true, moduloBitLength: 64 });

exports.double = V => {
    const x = +V;

    if (!Number.isFinite(x)) {
        throw new TypeError("Argument is not a finite floating-point value");
    }

    return x;
};

exports["unrestricted double"] = V => {
    const x = +V;

    return x;
};

exports.float = V => {
    const x = +V;

    if (!Number.isFinite(x)) {
        throw new TypeError("Argument is not a finite floating-point value");
    }

    if (Object.is(x, -0)) {
        return x;
    }

    const array = new Float32Array(1);
    array[0] = x;
    const y = array[0];

    if (!Number.isFinite(y)) {
        throw new TypeError("Argument is not within the range of a single-precision floating-point value");
    }

    return y;
};

exports["unrestricted float"] = V => {
    const x = +V;

    if (isNaN(x)) {
        return x;
    }

    if (Object.is(x, -0)) {
        return x;
    }

    const array = new Float32Array(1);
    array[0] = x;
    return array[0];
};

exports.DOMString = function (V, opts) {
    if (opts === undefined) {
        opts = {};
    }

    if (opts.treatNullAsEmptyString && V === null) {
        return "";
    }

    if (typeof V === "symbol") {
        throw new TypeError("Argument is a symbol, which cannot be converted to a string");
    }

    return String(V);
};

exports.ByteString = V => {
    const x = String(V);
    let c;
    for (let i = 0; (c = x.codePointAt(i)) !== undefined; ++i) {
        if (c > 255) {
            throw new TypeError("Argument is not a valid bytestring");
        }
    }

    return x;
};

exports.USVString = V => {
    const S = String(V);
    const n = S.length;
    const U = [];
    for (let i = 0; i < n; ++i) {
        const c = S.charCodeAt(i);
        if (c < 0xD800 || c > 0xDFFF) {
            U.push(String.fromCodePoint(c));
        } else if (0xDC00 <= c && c <= 0xDFFF) {
            U.push(String.fromCodePoint(0xFFFD));
        } else if (i === n - 1) {
            U.push(String.fromCodePoint(0xFFFD));
        } else {
            const d = S.charCodeAt(i + 1);
            if (0xDC00 <= d && d <= 0xDFFF) {
                const a = c & 0x3FF;
                const b = d & 0x3FF;
                U.push(String.fromCodePoint((2 << 15) + ((2 << 9) * a) + b));
                ++i;
            } else {
                U.push(String.fromCodePoint(0xFFFD));
            }
        }
    }

    return U.join("");
};

exports.object = V => {
    if (type(V) !== "Object") {
        throw new TypeError("Argument is not an object");
    }

    return V;
};

// Not exported, but used in Function and VoidFunction.

// Neither Function nor VoidFunction is defined with [TreatNonObjectAsNull], so
// handling for that is omitted.
function convertCallbackFunction(V) {
    if (typeof V !== "function") {
        throw new TypeError("Argument is not a function");
    }
    return V;
}

[
    Error,
    ArrayBuffer, // The IsDetachedBuffer abstract operation is not exposed in JS
    DataView, Int8Array, Int16Array, Int32Array, Uint8Array,
    Uint16Array, Uint32Array, Uint8ClampedArray, Float32Array, Float64Array
].forEach(func => {
    const name = func.name;
    const article = /^[AEIOU]/.test(name) ? "an" : "a";
    exports[name] = V => {
        if (!(V instanceof func)) {
            throw new TypeError(`Argument is not ${article} ${name} object`);
        }

        return V;
    };
});

// Common definitions

exports.ArrayBufferView = V => {
    if (!ArrayBuffer.isView(V)) {
        throw new TypeError("Argument is not a view on an ArrayBuffer object");
    }

    return V;
};

exports.BufferSource = V => {
    if (!(ArrayBuffer.isView(V) || V instanceof ArrayBuffer)) {
        throw new TypeError("Argument is not an ArrayBuffer object or a view on one");
    }

    return V;
};

exports.DOMTimeStamp = exports["unsigned long long"];

exports.Function = convertCallbackFunction;

exports.VoidFunction = convertCallbackFunction;
