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
exports.NO_CHANGE = new Object();
var Pipe = (function () {
    function Pipe() {
    }
    Pipe.prototype.supports = function (obj) {
        return false;
    };
    Pipe.prototype.onDestroy = function () { };
    Pipe.prototype.transform = function (value) {
        return null;
    };
    return Pipe;
})();
exports.Pipe = Pipe;
Object.defineProperty(Pipe.prototype.transform, "parameters", { get: function () {
        return [[assert.type.any]];
    } });
