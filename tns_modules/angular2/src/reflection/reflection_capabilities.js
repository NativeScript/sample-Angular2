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
var collection_1 = require('angular2/src/facade/collection');
var ReflectionCapabilities = (function () {
    function ReflectionCapabilities() {
    }
    ReflectionCapabilities.prototype.factory = function (type) {
        switch (type.length) {
            case 0:
                return function () {
                    return new type();
                };
            case 1:
                return function (a1) {
                    return new type(a1);
                };
            case 2:
                return function (a1, a2) {
                    return new type(a1, a2);
                };
            case 3:
                return function (a1, a2, a3) {
                    return new type(a1, a2, a3);
                };
            case 4:
                return function (a1, a2, a3, a4) {
                    return new type(a1, a2, a3, a4);
                };
            case 5:
                return function (a1, a2, a3, a4, a5) {
                    return new type(a1, a2, a3, a4, a5);
                };
            case 6:
                return function (a1, a2, a3, a4, a5, a6) {
                    return new type(a1, a2, a3, a4, a5, a6);
                };
            case 7:
                return function (a1, a2, a3, a4, a5, a6, a7) {
                    return new type(a1, a2, a3, a4, a5, a6, a7);
                };
            case 8:
                return function (a1, a2, a3, a4, a5, a6, a7, a8) {
                    return new type(a1, a2, a3, a4, a5, a6, a7, a8);
                };
            case 9:
                return function (a1, a2, a3, a4, a5, a6, a7, a8, a9) {
                    return new type(a1, a2, a3, a4, a5, a6, a7, a8, a9);
                };
            case 10:
                return function (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
                    return new type(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
                };
        }
        ;
        throw new Error("Factory cannot take more than 10 arguments");
    };
    ReflectionCapabilities.prototype.parameters = function (typeOfFunc) {
        return lang_1.isPresent(typeOfFunc.parameters) ? typeOfFunc.parameters : collection_1.ListWrapper.createFixedSize(typeOfFunc.length);
    };
    ReflectionCapabilities.prototype.annotations = function (typeOfFunc) {
        return lang_1.isPresent(typeOfFunc.annotations) ? typeOfFunc.annotations : [];
    };
    ReflectionCapabilities.prototype.getter = function (name) {
        return new Function('o', 'return o.' + name + ';');
    };
    ReflectionCapabilities.prototype.setter = function (name) {
        return new Function('o', 'v', 'return o.' + name + ' = v;');
    };
    ReflectionCapabilities.prototype.method = function (name) {
        var method = "o." + name;
        return new Function('o', 'args', ("if (!" + method + ") throw new Error('\"" + name + "\" is undefined');") + ("return " + method + ".apply(o, args);"));
    };
    return ReflectionCapabilities;
})();
exports.ReflectionCapabilities = ReflectionCapabilities;
Object.defineProperty(ReflectionCapabilities.prototype.factory, "parameters", { get: function () {
        return [[lang_1.Type]];
    } });
Object.defineProperty(ReflectionCapabilities.prototype.getter, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(ReflectionCapabilities.prototype.setter, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(ReflectionCapabilities.prototype.method, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
