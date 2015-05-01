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
var test_lib_1 = require('angular2/test_lib');
var shadow_dom_strategy_1 = require('angular2/src/core/compiler/shadow_dom_strategy');
var url_resolver_1 = require('angular2/src/services/url_resolver');
var style_url_resolver_1 = require('angular2/src/render/dom/shadow_dom/style_url_resolver');
var style_inliner_1 = require('angular2/src/render/dom/shadow_dom/style_inliner');
var view_1 = require('angular2/src/core/compiler/view');
var xhr_1 = require('angular2/src/services/xhr');
var lang_1 = require('angular2/src/facade/lang');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var collection_1 = require('angular2/src/facade/collection');
var async_1 = require('angular2/src/facade/async');
var change_detection_1 = require('angular2/change_detection');
function main() {
    var strategy;
    test_lib_1.describe('NativeShadowDomStratgey', function () {
        test_lib_1.beforeEach(function () {
            var urlResolver = new url_resolver_1.UrlResolver();
            var styleUrlResolver = new style_url_resolver_1.StyleUrlResolver(urlResolver);
            strategy = new shadow_dom_strategy_1.NativeShadowDomStrategy(styleUrlResolver);
        });
        test_lib_1.it('should attach the view nodes to the shadow root', function () {
            var host = test_lib_1.el('<div></div>');
            var nodes = test_lib_1.el('<div>view</div>');
            var pv = new view_1.ProtoView(nodes, new change_detection_1.DynamicProtoChangeDetector(null, null), null);
            var view = pv.instantiate(null, null);
            strategy.attachTemplate(host, view);
            var shadowRoot = dom_adapter_1.DOM.getShadowRoot(host);
            test_lib_1.expect(lang_1.isPresent(shadowRoot)).toBeTruthy();
            test_lib_1.expect(shadowRoot).toHaveText('view');
        });
    });
    test_lib_1.describe('EmulatedScopedShadowDomStratgey', function () {
        var xhr, styleHost;
        test_lib_1.beforeEach(function () {
            var urlResolver = new url_resolver_1.UrlResolver();
            var styleUrlResolver = new style_url_resolver_1.StyleUrlResolver(urlResolver);
            xhr = new FakeXHR();
            var styleInliner = new style_inliner_1.StyleInliner(xhr, styleUrlResolver, urlResolver);
            styleHost = test_lib_1.el('<div></div>');
            strategy = new shadow_dom_strategy_1.EmulatedScopedShadowDomStrategy(styleInliner, styleUrlResolver, styleHost);
        });
        test_lib_1.it('should attach the view nodes as child of the host element', function () {
            var host = test_lib_1.el('<div><span>original content</span></div>');
            var nodes = test_lib_1.el('<div>view</div>');
            var pv = new view_1.ProtoView(nodes, new change_detection_1.DynamicProtoChangeDetector(null, null), null);
            var view = pv.instantiate(null, null);
            strategy.attachTemplate(host, view);
            var firstChild = dom_adapter_1.DOM.firstChild(host);
            test_lib_1.expect(dom_adapter_1.DOM.tagName(firstChild).toLowerCase()).toEqual('div');
            test_lib_1.expect(firstChild).toHaveText('view');
            test_lib_1.expect(host).toHaveText('view');
        });
    });
    test_lib_1.describe('EmulatedUnscopedShadowDomStratgey', function () {
        var styleHost;
        test_lib_1.beforeEach(function () {
            var urlResolver = new url_resolver_1.UrlResolver();
            var styleUrlResolver = new style_url_resolver_1.StyleUrlResolver(urlResolver);
            styleHost = test_lib_1.el('<div></div>');
            strategy = new shadow_dom_strategy_1.EmulatedUnscopedShadowDomStrategy(styleUrlResolver, styleHost);
        });
        test_lib_1.it('should attach the view nodes as child of the host element', function () {
            var host = test_lib_1.el('<div><span>original content</span></div>');
            var nodes = test_lib_1.el('<div>view</div>');
            var pv = new view_1.ProtoView(nodes, new change_detection_1.DynamicProtoChangeDetector(null, null), null);
            var view = pv.instantiate(null, null);
            strategy.attachTemplate(host, view);
            var firstChild = dom_adapter_1.DOM.firstChild(host);
            test_lib_1.expect(dom_adapter_1.DOM.tagName(firstChild).toLowerCase()).toEqual('div');
            test_lib_1.expect(firstChild).toHaveText('view');
            test_lib_1.expect(host).toHaveText('view');
        });
    });
}
exports.main = main;
var FakeXHR = (function (_super) {
    __extends(FakeXHR, _super);
    function FakeXHR() {
        _super.call(this);
        this._responses = collection_1.MapWrapper.create();
    }
    FakeXHR.prototype.get = function (url) {
        var response = collection_1.MapWrapper.get(this._responses, url);
        if (lang_1.isBlank(response)) {
            return async_1.PromiseWrapper.reject('xhr error');
        }
        return async_1.PromiseWrapper.resolve(response);
    };
    FakeXHR.prototype.reply = function (url, response) {
        collection_1.MapWrapper.set(this._responses, url, response);
    };
    return FakeXHR;
})(xhr_1.XHR);
Object.defineProperty(FakeXHR.prototype.get, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(FakeXHR.prototype.reply, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
var SomeComponent = (function () {
    function SomeComponent() {
    }
    return SomeComponent;
})();
var SomeOtherComponent = (function () {
    function SomeOtherComponent() {
    }
    return SomeOtherComponent;
})();
