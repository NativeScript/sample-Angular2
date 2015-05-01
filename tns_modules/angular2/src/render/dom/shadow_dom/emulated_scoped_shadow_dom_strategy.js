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
var async_1 = require('angular2/src/facade/async');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var style_inliner_1 = require('angular2/src/render/dom/shadow_dom/style_inliner');
var style_url_resolver_1 = require('angular2/src/render/dom/shadow_dom/style_url_resolver');
var emulated_unscoped_shadow_dom_strategy_1 = require('angular2/src/render/dom/shadow_dom/emulated_unscoped_shadow_dom_strategy');
var util_1 = require('./util');
var EmulatedScopedShadowDomStrategy = (function (_super) {
    __extends(EmulatedScopedShadowDomStrategy, _super);
    function EmulatedScopedShadowDomStrategy(styleInliner, styleUrlResolver, styleHost) {
        _super.call(this, styleUrlResolver, styleHost);
        this.styleInliner = styleInliner;
    }
    EmulatedScopedShadowDomStrategy.prototype.processStyleElement = function (hostComponentId, templateUrl, styleEl) {
        var cssText = dom_adapter_1.DOM.getText(styleEl);
        cssText = this.styleUrlResolver.resolveUrls(cssText, templateUrl);
        var css = this.styleInliner.inlineImports(cssText, templateUrl);
        if (async_1.PromiseWrapper.isPromise(css)) {
            dom_adapter_1.DOM.setText(styleEl, '');
            return css.then(function (css) {
                css = util_1.shimCssForComponent(css, hostComponentId);
                dom_adapter_1.DOM.setText(styleEl, css);
            });
        }
        else {
            css = util_1.shimCssForComponent(css, hostComponentId);
            dom_adapter_1.DOM.setText(styleEl, css);
        }
        dom_adapter_1.DOM.remove(styleEl);
        util_1.insertStyleElement(this.styleHost, styleEl);
        return null;
    };
    EmulatedScopedShadowDomStrategy.prototype.processElement = function (hostComponentId, elementComponentId, element) {
        if (lang_1.isPresent(hostComponentId)) {
            var contentAttribute = util_1.getContentAttribute(util_1.getComponentId(hostComponentId));
            dom_adapter_1.DOM.setAttribute(element, contentAttribute, '');
        }
        if (lang_1.isPresent(elementComponentId)) {
            var hostAttribute = util_1.getHostAttribute(util_1.getComponentId(elementComponentId));
            dom_adapter_1.DOM.setAttribute(element, hostAttribute, '');
        }
    };
    return EmulatedScopedShadowDomStrategy;
})(emulated_unscoped_shadow_dom_strategy_1.EmulatedUnscopedShadowDomStrategy);
exports.EmulatedScopedShadowDomStrategy = EmulatedScopedShadowDomStrategy;
Object.defineProperty(EmulatedScopedShadowDomStrategy, "parameters", { get: function () {
        return [[style_inliner_1.StyleInliner], [style_url_resolver_1.StyleUrlResolver], []];
    } });
Object.defineProperty(EmulatedScopedShadowDomStrategy.prototype.processStyleElement, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string], []];
    } });
Object.defineProperty(EmulatedScopedShadowDomStrategy.prototype.processElement, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string], []];
    } });
