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
var XHR = (function () {
    function XHR() {
    }
    XHR.prototype.get = function (url) {
        return null;
    };
    return XHR;
})();
exports.XHR = XHR;
Object.defineProperty(XHR.prototype.get, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
