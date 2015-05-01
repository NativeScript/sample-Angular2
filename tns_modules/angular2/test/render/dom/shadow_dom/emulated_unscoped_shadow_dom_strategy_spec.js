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
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var collection_1 = require('angular2/src/facade/collection');
var emulated_unscoped_shadow_dom_strategy_1 = require('angular2/src/render/dom/shadow_dom/emulated_unscoped_shadow_dom_strategy');
var util_1 = require('angular2/src/render/dom/shadow_dom/util');
var url_resolver_1 = require('angular2/src/services/url_resolver');
var style_url_resolver_1 = require('angular2/src/render/dom/shadow_dom/style_url_resolver');
var view_1 = require('angular2/src/render/dom/view/view');
function main() {
    var strategy;
    test_lib_1.describe('EmulatedUnscoped', function () {
        var styleHost;
        test_lib_1.beforeEach(function () {
            var urlResolver = new url_resolver_1.UrlResolver();
            var styleUrlResolver = new style_url_resolver_1.StyleUrlResolver(urlResolver);
            styleHost = test_lib_1.el('<div></div>');
            strategy = new emulated_unscoped_shadow_dom_strategy_1.EmulatedUnscopedShadowDomStrategy(styleUrlResolver, styleHost);
            util_1.resetShadowDomCache();
        });
        test_lib_1.it('should attach the view nodes as child of the host element', function () {
            var host = test_lib_1.el('<div><span>original content</span></div>');
            var nodes = test_lib_1.el('<div>view</div>');
            var view = new view_1.View(null, [nodes], [], [], [], []);
            strategy.attachTemplate(host, view);
            var firstChild = dom_adapter_1.DOM.firstChild(host);
            test_lib_1.expect(dom_adapter_1.DOM.tagName(firstChild).toLowerCase()).toEqual('div');
            test_lib_1.expect(firstChild).toHaveText('view');
            test_lib_1.expect(host).toHaveText('view');
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
        test_lib_1.it('should move the style element to the style host', function () {
            var compileElement = test_lib_1.el('<div><style>.one {}</style></div>');
            var styleElement = dom_adapter_1.DOM.firstChild(compileElement);
            strategy.processStyleElement('someComponent', 'http://base', styleElement);
            test_lib_1.expect(compileElement).toHaveText('');
            test_lib_1.expect(styleHost).toHaveText('.one {}');
        });
        test_lib_1.it('should insert the same style only once in the style host', function () {
            var styleEls = [test_lib_1.el('<style>/*css1*/</style>'), test_lib_1.el('<style>/*css2*/</style>'), test_lib_1.el('<style>/*css1*/</style>')];
            collection_1.ListWrapper.forEach(styleEls, function (styleEl) {
                strategy.processStyleElement('someComponent', 'http://base', styleEl);
            });
            test_lib_1.expect(styleHost).toHaveText("/*css1*//*css2*/");
        });
    });
}
exports.main = main;
