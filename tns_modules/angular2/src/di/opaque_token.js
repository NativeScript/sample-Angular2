var __decorate = this.__decorate || function (decorators, target, key, value) {
    var kind = typeof (arguments.length == 2 ? value = target : value);
    for (var i = decorators.length - 1; i >= 0; --i) {
        var decorator = decorators[i];
        switch (kind) {
            case "function": value = decorator(value) || value; break;
            case "number": decorator(target, key, value); break;
            case "undefined": decorator(target, key); break;
            case "object": value = decorator(target, key, value) || value; break;
        }
    }
    return value;
};
var OpaqueToken = (function () {
    function OpaqueToken(desc) {
        this._desc = "Token(" + desc + ")";
    }
    OpaqueToken.prototype.toString = function () {
        return this._desc;
    };
    return OpaqueToken;
})();
exports.OpaqueToken = OpaqueToken;
Object.defineProperty(OpaqueToken, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
