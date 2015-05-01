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
var testability_1 = require('angular2/src/core/testability/testability');
var PublicTestability = (function () {
    function PublicTestability(testability) {
        this._testability = testability;
    }
    PublicTestability.prototype.whenStable = function (callback) {
        this._testability.whenStable(callback);
    };
    PublicTestability.prototype.findBindings = function (using, binding, exactMatch) {
        return this._testability.findBindings(using, binding, exactMatch);
    };
    return PublicTestability;
})();
Object.defineProperty(PublicTestability, "parameters", { get: function () {
        return [[testability_1.Testability]];
    } });
Object.defineProperty(PublicTestability.prototype.whenStable, "parameters", { get: function () {
        return [[Function]];
    } });
Object.defineProperty(PublicTestability.prototype.findBindings, "parameters", { get: function () {
        return [[], [assert.type.string], [assert.type.boolean]];
    } });
var GetTestability = (function () {
    function GetTestability() {
    }
    GetTestability.addToWindow = function (registry) {
        if (!global.angular2) {
            global.angular2 = {};
        }
        global.angular2.getTestability = function (elem) {
            var testability = registry.findTestabilityInTree(elem);
            if (testability == null) {
                throw new Error('Could not find testability for element.');
            }
            return new PublicTestability(testability);
        };
        global.angular2.resumeBootstrap = function () { };
    };
    return GetTestability;
})();
exports.GetTestability = GetTestability;
Object.defineProperty(GetTestability.addToWindow, "parameters", { get: function () {
        return [[testability_1.TestabilityRegistry]];
    } });
