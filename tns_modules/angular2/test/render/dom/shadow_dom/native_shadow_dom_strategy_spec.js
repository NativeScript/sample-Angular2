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
var native_shadow_dom_strategy_1 = require('angular2/src/render/dom/shadow_dom/native_shadow_dom_strategy');
var url_resolver_1 = require('angular2/src/services/url_resolver');
var style_url_resolver_1 = require('angular2/src/render/dom/shadow_dom/style_url_resolver');
var view_1 = require('angular2/src/render/dom/view/view');
var lang_1 = require('angular2/src/facade/lang');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
function main() {
    var strategy;
    test_lib_1.describe('NativeShadowDomStrategy', function () {
        test_lib_1.beforeEach(function () {
            var urlResolver = new url_resolver_1.UrlResolver();
            var styleUrlResolver = new style_url_resolver_1.StyleUrlResolver(urlResolver);
            strategy = new native_shadow_dom_strategy_1.NativeShadowDomStrategy(styleUrlResolver);
        });
        test_lib_1.it('should attach the view nodes to the shadow root', function () {
            var host = test_lib_1.el('<div><span>original content</span></div>');
            var nodes = test_lib_1.el('<div>view</div>');
            var view = new view_1.View(null, [nodes], [], [], [], []);
            strategy.attachTemplate(host, view);
            var shadowRoot = dom_adapter_1.DOM.getShadowRoot(host);
            test_lib_1.expect(lang_1.isPresent(shadowRoot)).toBeTruthy();
            test_lib_1.expect(shadowRoot).toHaveText('view');
        });
        test_lib_1.it('should rewrite style urls', function () {
            var styleElement = test_lib_1.el('<style>.foo {background-image: url("img.jpg");}</style>');
            strategy.processStyleElement('someComponent', 'http://base', styleElement);
            test_lib_1.expect(styleElement).toHaveText(".foo {" + "background-image: url('http://base/img.jpg');" + "}");
        });
        test_lib_1.it('should not inline import rules', function () {
            var styleElement = test_lib_1.el('<style>@import "other.css";</style>');
            strategy.processStyleElement('someComponent', 'http://base', styleElement);
            test_lib_1.expect(styleElement).toHaveText("@import 'http://base/other.css';");
        });
    });
}
exports.main = main;
