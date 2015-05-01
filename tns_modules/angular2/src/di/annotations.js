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
var lang_1 = require("angular2/src/facade/lang");
var Inject = (function () {
    function Inject(token) {
        this.token = token;
    }
    return Inject;
})();
exports.Inject = Inject;
Object.defineProperty(Inject, "annotations", { get: function () {
        return [new lang_1.CONST()];
    } });
var InjectPromise = (function () {
    function InjectPromise(token) {
        this.token = token;
    }
    return InjectPromise;
})();
exports.InjectPromise = InjectPromise;
Object.defineProperty(InjectPromise, "annotations", { get: function () {
        return [new lang_1.CONST()];
    } });
var InjectLazy = (function () {
    function InjectLazy(token) {
        this.token = token;
    }
    return InjectLazy;
})();
exports.InjectLazy = InjectLazy;
Object.defineProperty(InjectLazy, "annotations", { get: function () {
        return [new lang_1.CONST()];
    } });
var Optional = (function () {
    function Optional() {
    }
    return Optional;
})();
exports.Optional = Optional;
Object.defineProperty(Optional, "annotations", { get: function () {
        return [new lang_1.CONST()];
    } });
var DependencyAnnotation = (function () {
    function DependencyAnnotation() {
    }
    Object.defineProperty(DependencyAnnotation.prototype, "token", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    return DependencyAnnotation;
})();
exports.DependencyAnnotation = DependencyAnnotation;
Object.defineProperty(DependencyAnnotation, "annotations", { get: function () {
        return [new lang_1.CONST()];
    } });
var Injectable = (function () {
    function Injectable() {
    }
    return Injectable;
})();
exports.Injectable = Injectable;
Object.defineProperty(Injectable, "annotations", { get: function () {
        return [new lang_1.CONST()];
    } });
