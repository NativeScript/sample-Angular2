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
var viewModule = require('../view/view');
var ShadowDomStrategy = (function () {
    function ShadowDomStrategy() {
    }
    ShadowDomStrategy.prototype.hasNativeContentElement = function () {
        return true;
    };
    ShadowDomStrategy.prototype.attachTemplate = function (el, view) { };
    ShadowDomStrategy.prototype.constructLightDom = function (lightDomView, shadowDomView, el) {
        return null;
    };
    ShadowDomStrategy.prototype.processStyleElement = function (hostComponentId, templateUrl, styleElement) {
        return null;
    };
    ShadowDomStrategy.prototype.processElement = function (hostComponentId, elementComponentId, element) { };
    return ShadowDomStrategy;
})();
exports.ShadowDomStrategy = ShadowDomStrategy;
Object.defineProperty(ShadowDomStrategy.prototype.attachTemplate, "parameters", { get: function () {
        return [[], [viewModule.View]];
    } });
Object.defineProperty(ShadowDomStrategy.prototype.constructLightDom, "parameters", { get: function () {
        return [[viewModule.View], [viewModule.View], []];
    } });
Object.defineProperty(ShadowDomStrategy.prototype.processStyleElement, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string], []];
    } });
Object.defineProperty(ShadowDomStrategy.prototype.processElement, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string], []];
    } });
