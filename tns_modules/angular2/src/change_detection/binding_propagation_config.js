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
var interfaces_1 = require('./interfaces');
var constants_1 = require('./constants');
var BindingPropagationConfig = (function () {
    function BindingPropagationConfig(cd) {
        this._cd = cd;
    }
    BindingPropagationConfig.prototype.shouldBePropagated = function () {
        this._cd.mode = constants_1.CHECK_ONCE;
    };
    BindingPropagationConfig.prototype.shouldBePropagatedFromRoot = function () {
        this._cd.markPathToRootAsCheckOnce();
    };
    BindingPropagationConfig.prototype.shouldNotPropagate = function () {
        this._cd.mode = constants_1.DETACHED;
    };
    BindingPropagationConfig.prototype.shouldAlwaysPropagate = function () {
        this._cd.mode = constants_1.CHECK_ALWAYS;
    };
    return BindingPropagationConfig;
})();
exports.BindingPropagationConfig = BindingPropagationConfig;
Object.defineProperty(BindingPropagationConfig, "parameters", { get: function () {
        return [[interfaces_1.ChangeDetector]];
    } });
