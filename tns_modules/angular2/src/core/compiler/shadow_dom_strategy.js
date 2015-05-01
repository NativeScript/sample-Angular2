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
var di_1 = require('angular2/di');
var lang_1 = require('angular2/src/facade/lang');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var viewModule = require('./view');
var light_dom_1 = require('./shadow_dom_emulation/light_dom');
var style_inliner_1 = require('angular2/src/render/dom/shadow_dom/style_inliner');
var style_url_resolver_1 = require('angular2/src/render/dom/shadow_dom/style_url_resolver');
var nsds = require('angular2/src/render/dom/shadow_dom/native_shadow_dom_strategy');
var eusds = require('angular2/src/render/dom/shadow_dom/emulated_unscoped_shadow_dom_strategy');
var essds = require('angular2/src/render/dom/shadow_dom/emulated_scoped_shadow_dom_strategy');
var ShadowDomStrategy = (function () {
    function ShadowDomStrategy() {
    }
    ShadowDomStrategy.prototype.attachTemplate = function (el, view) { };
    ShadowDomStrategy.prototype.constructLightDom = function (lightDomView, shadowDomView, el) {
        return null;
    };
    ShadowDomStrategy.prototype.shimAppElement = function (componentType, insertionElement) {
        this.render.processElement(null, lang_1.stringify(componentType), insertionElement);
    };
    return ShadowDomStrategy;
})();
exports.ShadowDomStrategy = ShadowDomStrategy;
Object.defineProperty(ShadowDomStrategy.prototype.attachTemplate, "parameters", { get: function () {
        return [[], [viewModule.View]];
    } });
Object.defineProperty(ShadowDomStrategy.prototype.constructLightDom, "parameters", { get: function () {
        return [[viewModule.View], [viewModule.View], []];
    } });
var EmulatedUnscopedShadowDomStrategy = (function (_super) {
    __extends(EmulatedUnscopedShadowDomStrategy, _super);
    function EmulatedUnscopedShadowDomStrategy(styleUrlResolver, styleHost) {
        _super.call(this);
        this.render = new eusds.EmulatedUnscopedShadowDomStrategy(styleUrlResolver, styleHost);
    }
    EmulatedUnscopedShadowDomStrategy.prototype.attachTemplate = function (el, view) {
        dom_adapter_1.DOM.clearNodes(el);
        _moveViewNodesIntoParent(el, view);
    };
    EmulatedUnscopedShadowDomStrategy.prototype.constructLightDom = function (lightDomView, shadowDomView, el) {
        return new light_dom_1.LightDom(lightDomView, shadowDomView, el);
    };
    return EmulatedUnscopedShadowDomStrategy;
})(ShadowDomStrategy);
exports.EmulatedUnscopedShadowDomStrategy = EmulatedUnscopedShadowDomStrategy;
Object.defineProperty(EmulatedUnscopedShadowDomStrategy, "annotations", { get: function () {
        return [new di_1.Injectable()];
    } });
Object.defineProperty(EmulatedUnscopedShadowDomStrategy, "parameters", { get: function () {
        return [[style_url_resolver_1.StyleUrlResolver], []];
    } });
Object.defineProperty(EmulatedUnscopedShadowDomStrategy.prototype.attachTemplate, "parameters", { get: function () {
        return [[], [viewModule.View]];
    } });
Object.defineProperty(EmulatedUnscopedShadowDomStrategy.prototype.constructLightDom, "parameters", { get: function () {
        return [[viewModule.View], [viewModule.View], []];
    } });
var EmulatedScopedShadowDomStrategy = (function (_super) {
    __extends(EmulatedScopedShadowDomStrategy, _super);
    function EmulatedScopedShadowDomStrategy(styleInliner, styleUrlResolver, styleHost) {
        _super.call(this);
        this.render = new essds.EmulatedScopedShadowDomStrategy(styleInliner, styleUrlResolver, styleHost);
    }
    EmulatedScopedShadowDomStrategy.prototype.attachTemplate = function (el, view) {
        dom_adapter_1.DOM.clearNodes(el);
        _moveViewNodesIntoParent(el, view);
    };
    EmulatedScopedShadowDomStrategy.prototype.constructLightDom = function (lightDomView, shadowDomView, el) {
        return new light_dom_1.LightDom(lightDomView, shadowDomView, el);
    };
    return EmulatedScopedShadowDomStrategy;
})(ShadowDomStrategy);
exports.EmulatedScopedShadowDomStrategy = EmulatedScopedShadowDomStrategy;
Object.defineProperty(EmulatedScopedShadowDomStrategy, "annotations", { get: function () {
        return [new di_1.Injectable()];
    } });
Object.defineProperty(EmulatedScopedShadowDomStrategy, "parameters", { get: function () {
        return [[style_inliner_1.StyleInliner], [style_url_resolver_1.StyleUrlResolver], []];
    } });
Object.defineProperty(EmulatedScopedShadowDomStrategy.prototype.attachTemplate, "parameters", { get: function () {
        return [[], [viewModule.View]];
    } });
Object.defineProperty(EmulatedScopedShadowDomStrategy.prototype.constructLightDom, "parameters", { get: function () {
        return [[viewModule.View], [viewModule.View], []];
    } });
var NativeShadowDomStrategy = (function (_super) {
    __extends(NativeShadowDomStrategy, _super);
    function NativeShadowDomStrategy(styleUrlResolver) {
        _super.call(this);
        this.render = new nsds.NativeShadowDomStrategy(styleUrlResolver);
    }
    NativeShadowDomStrategy.prototype.attachTemplate = function (el, view) {
        _moveViewNodesIntoParent(dom_adapter_1.DOM.createShadowRoot(el), view);
    };
    return NativeShadowDomStrategy;
})(ShadowDomStrategy);
exports.NativeShadowDomStrategy = NativeShadowDomStrategy;
Object.defineProperty(NativeShadowDomStrategy, "annotations", { get: function () {
        return [new di_1.Injectable()];
    } });
Object.defineProperty(NativeShadowDomStrategy, "parameters", { get: function () {
        return [[style_url_resolver_1.StyleUrlResolver]];
    } });
Object.defineProperty(NativeShadowDomStrategy.prototype.attachTemplate, "parameters", { get: function () {
        return [[], [viewModule.View]];
    } });
function _moveViewNodesIntoParent(parent, view) {
    for (var i = 0; i < view.nodes.length; ++i) {
        dom_adapter_1.DOM.appendChild(parent, view.nodes[i]);
    }
}
