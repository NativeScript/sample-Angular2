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
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var viewModule = require('../view/view');
var style_url_resolver_1 = require('./style_url_resolver');
var shadow_dom_strategy_1 = require('angular2/src/render/dom/shadow_dom/./shadow_dom_strategy');
var util_1 = require('./util');
var NativeShadowDomStrategy = (function (_super) {
    __extends(NativeShadowDomStrategy, _super);
    function NativeShadowDomStrategy(styleUrlResolver) {
        _super.call(this);
        this.styleUrlResolver = styleUrlResolver;
    }
    NativeShadowDomStrategy.prototype.attachTemplate = function (el, view) {
        util_1.moveViewNodesIntoParent(dom_adapter_1.DOM.createShadowRoot(el), view);
    };
    NativeShadowDomStrategy.prototype.processStyleElement = function (hostComponentId, templateUrl, styleEl) {
        var cssText = dom_adapter_1.DOM.getText(styleEl);
        cssText = this.styleUrlResolver.resolveUrls(cssText, templateUrl);
        dom_adapter_1.DOM.setText(styleEl, cssText);
        return null;
    };
    return NativeShadowDomStrategy;
})(shadow_dom_strategy_1.ShadowDomStrategy);
exports.NativeShadowDomStrategy = NativeShadowDomStrategy;
Object.defineProperty(NativeShadowDomStrategy, "parameters", { get: function () {
        return [[style_url_resolver_1.StyleUrlResolver]];
    } });
Object.defineProperty(NativeShadowDomStrategy.prototype.attachTemplate, "parameters", { get: function () {
        return [[], [viewModule.View]];
    } });
Object.defineProperty(NativeShadowDomStrategy.prototype.processStyleElement, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string], []];
    } });
