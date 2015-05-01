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
var di_1 = require('angular2/di');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var getTestabilityModule = require('angular2/src/core/testability/get_testability');
var Testability = (function () {
    function Testability() {
        this._pendingCount = 0;
        this._callbacks = collection_1.ListWrapper.create();
    }
    Testability.prototype.increaseCount = function (delta) {
        if (delta === void 0) { delta = 1; }
        this._pendingCount += delta;
        if (this._pendingCount < 0) {
            throw new lang_1.BaseException('pending async requests below zero');
        }
        else if (this._pendingCount == 0) {
            this._runCallbacks();
        }
        return this._pendingCount;
    };
    Testability.prototype._runCallbacks = function () {
        while (this._callbacks.length !== 0) {
            collection_1.ListWrapper.removeLast(this._callbacks)();
        }
    };
    Testability.prototype.whenStable = function (callback) {
        collection_1.ListWrapper.push(this._callbacks, callback);
        if (this._pendingCount === 0) {
            this._runCallbacks();
        }
    };
    Testability.prototype.getPendingCount = function () {
        return this._pendingCount;
    };
    Testability.prototype.findBindings = function (using, binding, exactMatch) {
        return [];
    };
    return Testability;
})();
exports.Testability = Testability;
Object.defineProperty(Testability, "annotations", { get: function () {
        return [new di_1.Injectable()];
    } });
Object.defineProperty(Testability.prototype.increaseCount, "parameters", { get: function () {
        return [[assert.type.number]];
    } });
Object.defineProperty(Testability.prototype.whenStable, "parameters", { get: function () {
        return [[Function]];
    } });
Object.defineProperty(Testability.prototype.findBindings, "parameters", { get: function () {
        return [[], [assert.type.string], [assert.type.boolean]];
    } });
var TestabilityRegistry = (function () {
    function TestabilityRegistry() {
        this._applications = collection_1.MapWrapper.create();
        getTestabilityModule.GetTestability.addToWindow(this);
    }
    TestabilityRegistry.prototype.registerApplication = function (token, testability) {
        collection_1.MapWrapper.set(this._applications, token, testability);
    };
    TestabilityRegistry.prototype.findTestabilityInTree = function (elem) {
        if (elem == null) {
            return null;
        }
        if (collection_1.MapWrapper.contains(this._applications, elem)) {
            return collection_1.MapWrapper.get(this._applications, elem);
        }
        if (dom_adapter_1.DOM.isShadowRoot(elem)) {
            return this.findTestabilityInTree(dom_adapter_1.DOM.getHost(elem));
        }
        return this.findTestabilityInTree(dom_adapter_1.DOM.parentElement(elem));
    };
    return TestabilityRegistry;
})();
exports.TestabilityRegistry = TestabilityRegistry;
Object.defineProperty(TestabilityRegistry, "annotations", { get: function () {
        return [new di_1.Injectable()];
    } });
Object.defineProperty(TestabilityRegistry.prototype.registerApplication, "parameters", { get: function () {
        return [[], [Testability]];
    } });
