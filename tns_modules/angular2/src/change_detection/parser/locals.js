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
var Locals = (function () {
    function Locals(parent, current) {
        this.parent = parent;
        this.current = current;
    }
    Locals.prototype.contains = function (name) {
        if (collection_1.MapWrapper.contains(this.current, name)) {
            return true;
        }
        if (lang_1.isPresent(this.parent)) {
            return this.parent.contains(name);
        }
        return false;
    };
    Locals.prototype.get = function (name) {
        if (collection_1.MapWrapper.contains(this.current, name)) {
            return collection_1.MapWrapper.get(this.current, name);
        }
        if (lang_1.isPresent(this.parent)) {
            return this.parent.get(name);
        }
        throw new lang_1.BaseException("Cannot find '" + name + "'");
    };
    Locals.prototype.set = function (name, value) {
        if (collection_1.MapWrapper.contains(this.current, name)) {
            collection_1.MapWrapper.set(this.current, name, value);
        }
        else {
            throw new lang_1.BaseException('Setting of new keys post-construction is not supported.');
        }
    };
    Locals.prototype.clearValues = function () {
        collection_1.MapWrapper.clearValues(this.current);
    };
    return Locals;
})();
exports.Locals = Locals;
Object.defineProperty(Locals, "parameters", { get: function () {
        return [[Locals], [Map]];
    } });
Object.defineProperty(Locals.prototype.contains, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(Locals.prototype.get, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(Locals.prototype.set, "parameters", { get: function () {
        return [[assert.type.string], []];
    } });
