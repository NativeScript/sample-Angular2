var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
var lang_1 = require('angular2/src/facade/lang');
var pipe_1 = require('./pipe');
var NullPipeFactory = (function () {
    function NullPipeFactory() {
    }
    NullPipeFactory.prototype.supports = function (obj) {
        return NullPipe.supportsObj(obj);
    };
    NullPipeFactory.prototype.create = function (bpc) {
        return new NullPipe();
    };
    return NullPipeFactory;
})();
exports.NullPipeFactory = NullPipeFactory;
var NullPipe = (function (_super) {
    __extends(NullPipe, _super);
    function NullPipe() {
        _super.call(this);
        this.called = false;
    }
    NullPipe.supportsObj = function (obj) {
        return lang_1.isBlank(obj);
    };
    NullPipe.prototype.supports = function (obj) {
        return NullPipe.supportsObj(obj);
    };
    NullPipe.prototype.transform = function (value) {
        if (!this.called) {
            this.called = true;
            return null;
        }
        else {
            return pipe_1.NO_CHANGE;
        }
    };
    return NullPipe;
})(pipe_1.Pipe);
exports.NullPipe = NullPipe;
