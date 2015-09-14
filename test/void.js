var assert = require("assert");

const conversions = require("..");

describe("WebIDL void type", () => {
    var sut = conversions["void"];

    it("should return `undefined` for everything", () => {
        assert.strictEqual(sut(undefined), undefined);
        assert.strictEqual(sut(null), undefined);
        assert.strictEqual(sut(""), undefined);
        assert.strictEqual(sut(123), undefined);
        assert.strictEqual(sut("123"), undefined);
        assert.strictEqual(sut({}), undefined);
        assert.strictEqual(sut(Object.create(null)), undefined);
    });
});
