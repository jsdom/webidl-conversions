var conversions = {};
export default conversions;

var global_String = String;

conversions["boolean"] = val => !!val;
conversions["DOMString"] = val => global_String(val);
