var conversions = {};
export default conversions;

var global_String = String;
var Number_isFinite = Number.isFinite;

conversions["boolean"] = val => !!val;

conversions["DOMString"] = val => global_String(val);

conversions["double"] = val => {
    var asNumber = +val;

    if (!Number_isFinite(asNumber)) {
        throw new TypeError("Argument is not a finite floating-point value.");
    }

    return asNumber;
};
