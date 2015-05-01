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
var collection_1 = require('angular2/src/facade/collection');
var viewModule = require('./view');
var ViewPool = (function () {
    function ViewPool(capacity) {
        this._views = [];
        this._capacity = capacity;
    }
    ViewPool.prototype.pop = function () {
        return collection_1.ListWrapper.isEmpty(this._views) ? null : collection_1.ListWrapper.removeLast(this._views);
    };
    ViewPool.prototype.push = function (view) {
        if (this._views.length < this._capacity) {
            collection_1.ListWrapper.push(this._views, view);
        }
    };
    ViewPool.prototype.length = function () {
        return this._views.length;
    };
    return ViewPool;
})();
exports.ViewPool = ViewPool;
Object.defineProperty(ViewPool, "parameters", { get: function () {
        return [[assert.type.number]];
    } });
Object.defineProperty(ViewPool.prototype.push, "parameters", { get: function () {
        return [[viewModule.View]];
    } });
