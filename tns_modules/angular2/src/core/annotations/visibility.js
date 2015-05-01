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
var di_1 = require('angular2/di');
var Parent = (function (_super) {
    __extends(Parent, _super);
    function Parent() {
        _super.call(this);
    }
    return Parent;
})(di_1.DependencyAnnotation);
exports.Parent = Parent;
Object.defineProperty(Parent, "annotations", { get: function () {
        return [new lang_1.CONST()];
    } });
var Ancestor = (function (_super) {
    __extends(Ancestor, _super);
    function Ancestor() {
        _super.call(this);
    }
    return Ancestor;
})(di_1.DependencyAnnotation);
exports.Ancestor = Ancestor;
Object.defineProperty(Ancestor, "annotations", { get: function () {
        return [new lang_1.CONST()];
    } });
