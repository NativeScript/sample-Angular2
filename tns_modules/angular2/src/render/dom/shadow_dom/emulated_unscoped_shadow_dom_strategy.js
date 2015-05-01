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
var light_dom_1 = require('./light_dom');
var shadow_dom_strategy_1 = require('angular2/src/render/dom/shadow_dom/shadow_dom_strategy');
var style_url_resolver_1 = require('./style_url_resolver');
var util_1 = require('./util');
var util_2 = require('./util');
var EmulatedUnscopedShadowDomStrategy = (function (_super) {
    __extends(EmulatedUnscopedShadowDomStrategy, _super);
    function EmulatedUnscopedShadowDomStrategy(styleUrlResolver, styleHost) {
        _super.call(this);
        this.styleUrlResolver = styleUrlResolver;
        this.styleHost = styleHost;
    }
    EmulatedUnscopedShadowDomStrategy.prototype.hasNativeContentElement = function () {
        return false;
    };
    EmulatedUnscopedShadowDomStrategy.prototype.attachTemplate = function (el, view) {
        dom_adapter_1.DOM.clearNodes(el);
        util_1.moveViewNodesIntoParent(el, view);
    };
    EmulatedUnscopedShadowDomStrategy.prototype.constructLightDom = function (lightDomView, shadowDomView, el) {
        return new light_dom_1.LightDom(lightDomView, shadowDomView, el);
    };
    EmulatedUnscopedShadowDomStrategy.prototype.processStyleElement = function (hostComponentId, templateUrl, styleEl) {
        var cssText = dom_adapter_1.DOM.getText(styleEl);
        cssText = this.styleUrlResolver.resolveUrls(cssText, templateUrl);
        dom_adapter_1.DOM.setText(styleEl, cssText);
        dom_adapter_1.DOM.remove(styleEl);
        util_2.insertSharedStyleText(cssText, this.styleHost, styleEl);
        return null;
    };
    return EmulatedUnscopedShadowDomStrategy;
})(shadow_dom_strategy_1.ShadowDomStrategy);
exports.EmulatedUnscopedShadowDomStrategy = EmulatedUnscopedShadowDomStrategy;
Object.defineProperty(EmulatedUnscopedShadowDomStrategy, "parameters", { get: function () {
        return [[style_url_resolver_1.StyleUrlResolver], []];
    } });
Object.defineProperty(EmulatedUnscopedShadowDomStrategy.prototype.attachTemplate, "parameters", { get: function () {
        return [[], [viewModule.View]];
    } });
Object.defineProperty(EmulatedUnscopedShadowDomStrategy.prototype.constructLightDom, "parameters", { get: function () {
        return [[viewModule.View], [viewModule.View], []];
    } });
Object.defineProperty(EmulatedUnscopedShadowDomStrategy.prototype.processStyleElement, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string], []];
    } });
