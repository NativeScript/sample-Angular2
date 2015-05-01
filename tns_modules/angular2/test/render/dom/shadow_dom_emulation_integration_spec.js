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
var collection_1 = require('angular2/src/facade/collection');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var api_1 = require('angular2/src/render/api');
var emulated_scoped_shadow_dom_strategy_1 = require('angular2/src/render/dom/shadow_dom/emulated_scoped_shadow_dom_strategy');
var emulated_unscoped_shadow_dom_strategy_1 = require('angular2/src/render/dom/shadow_dom/emulated_unscoped_shadow_dom_strategy');
var native_shadow_dom_strategy_1 = require('angular2/src/render/dom/shadow_dom/native_shadow_dom_strategy');
var url_resolver_1 = require('angular2/src/services/url_resolver');
var style_url_resolver_1 = require('angular2/src/render/dom/shadow_dom/style_url_resolver');
var style_inliner_1 = require('angular2/src/render/dom/shadow_dom/style_inliner');
var integration_testbed_1 = require('./integration_testbed');
function main() {
    test_lib_1.describe('ShadowDom integration tests', function () {
        var urlResolver, styleUrlResolver, styleInliner;
        var strategies = {
            "scoped": function () { return new emulated_scoped_shadow_dom_strategy_1.EmulatedScopedShadowDomStrategy(styleInliner, styleUrlResolver, null); },
            "unscoped": function () { return new emulated_unscoped_shadow_dom_strategy_1.EmulatedUnscopedShadowDomStrategy(styleUrlResolver, null); }
        };
        if (dom_adapter_1.DOM.supportsNativeShadowDOM()) {
            collection_1.StringMapWrapper.set(strategies, "native", function () { return new native_shadow_dom_strategy_1.NativeShadowDomStrategy(styleUrlResolver); });
        }
        collection_1.StringMapWrapper.forEach(strategies, function (strategyFactory, name) {
            test_lib_1.describe(name + " shadow dom strategy", function () {
                var testbed, renderer, rootEl, compile, strategy;
                test_lib_1.beforeEach(function () {
                    urlResolver = new url_resolver_1.UrlResolver();
                    styleUrlResolver = new style_url_resolver_1.StyleUrlResolver(urlResolver);
                    styleInliner = new style_inliner_1.StyleInliner(null, styleUrlResolver, urlResolver);
                    strategy = strategyFactory();
                    testbed = new integration_testbed_1.IntegrationTestbed({
                        shadowDomStrategy: strategy,
                        templates: templates
                    });
                    renderer = testbed.renderer;
                    rootEl = testbed.rootEl;
                    compile = function (template, directives) { return testbed.compile(template, directives); };
                });
                test_lib_1.it('should support simple components', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    var temp = '<simple>' + '<div>A</div>' + '</simple>';
                    compile(temp, [simple]).then(function (pvRefs) {
                        renderer.createView(pvRefs[0]);
                        test_lib_1.expect(rootEl).toHaveText('SIMPLE(A)');
                        async.done();
                    });
                }));
                test_lib_1.it('should support multiple content tags', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    var temp = '<multiple-content-tags>' + '<div>B</div>' + '<div>C</div>' + '<div class="left">A</div>' + '</multiple-content-tags>';
                    compile(temp, [multipleContentTagsComponent]).then(function (pvRefs) {
                        renderer.createView(pvRefs[0]);
                        test_lib_1.expect(rootEl).toHaveText('(A, BC)');
                        async.done();
                    });
                }));
                test_lib_1.it('should redistribute only direct children', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    var temp = '<multiple-content-tags>' + '<div>B<div class="left">A</div></div>' + '<div>C</div>' + '</multiple-content-tags>';
                    compile(temp, [multipleContentTagsComponent]).then(function (pvRefs) {
                        renderer.createView(pvRefs[0]);
                        test_lib_1.expect(rootEl).toHaveText('(, BAC)');
                        async.done();
                    });
                }));
                test_lib_1.it("should redistribute direct child viewcontainers when the light dom changes", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    var temp = '<multiple-content-tags>' + '<div><div template="manual" class="left">A</div></div>' + '<div>B</div>' + '</multiple-content-tags>';
                    compile(temp, [multipleContentTagsComponent, manualViewportDirective]).then(function (pvRefs) {
                        var viewRefs = renderer.createView(pvRefs[0]);
                        var vcRef = new api_1.ViewContainerRef(viewRefs[1], 1);
                        var vcProtoViewRef = pvRefs[2];
                        var childViewRef = renderer.createView(vcProtoViewRef)[0];
                        test_lib_1.expect(rootEl).toHaveText('(, B)');
                        renderer.insertViewIntoContainer(vcRef, childViewRef);
                        test_lib_1.expect(rootEl).toHaveText('(, AB)');
                        renderer.detachViewFromContainer(vcRef, 0);
                        test_lib_1.expect(rootEl).toHaveText('(, B)');
                        async.done();
                    });
                }));
                test_lib_1.it("should redistribute when the light dom changes", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    var temp = '<multiple-content-tags>' + '<div template="manual" class="left">A</div>' + '<div>B</div>' + '</multiple-content-tags>';
                    compile(temp, [multipleContentTagsComponent, manualViewportDirective]).then(function (pvRefs) {
                        var viewRefs = renderer.createView(pvRefs[0]);
                        var vcRef = new api_1.ViewContainerRef(viewRefs[1], 1);
                        var vcProtoViewRef = pvRefs[2];
                        var childViewRef = renderer.createView(vcProtoViewRef)[0];
                        test_lib_1.expect(rootEl).toHaveText('(, B)');
                        renderer.insertViewIntoContainer(vcRef, childViewRef);
                        test_lib_1.expect(rootEl).toHaveText('(A, B)');
                        renderer.detachViewFromContainer(vcRef, 0);
                        test_lib_1.expect(rootEl).toHaveText('(, B)');
                        async.done();
                    });
                }));
                test_lib_1.it("should support nested components", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    var temp = '<outer-with-indirect-nested>' + '<div>A</div>' + '<div>B</div>' + '</outer-with-indirect-nested>';
                    compile(temp, [outerWithIndirectNestedComponent]).then(function (pvRefs) {
                        renderer.createView(pvRefs[0]);
                        test_lib_1.expect(rootEl).toHaveText('OUTER(SIMPLE(AB))');
                        async.done();
                    });
                }));
                test_lib_1.it("should support nesting with content being direct child of a nested component", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    var temp = '<outer>' + '<div template="manual" class="left">A</div>' + '<div>B</div>' + '<div>C</div>' + '</outer>';
                    compile(temp, [outerComponent, manualViewportDirective]).then(function (pvRefs) {
                        var viewRefs = renderer.createView(pvRefs[0]);
                        var vcRef = new api_1.ViewContainerRef(viewRefs[1], 1);
                        var vcProtoViewRef = pvRefs[2];
                        var childViewRef = renderer.createView(vcProtoViewRef)[0];
                        test_lib_1.expect(rootEl).toHaveText('OUTER(INNER(INNERINNER(,BC)))');
                        renderer.insertViewIntoContainer(vcRef, childViewRef);
                        test_lib_1.expect(rootEl).toHaveText('OUTER(INNER(INNERINNER(A,BC)))');
                        async.done();
                    });
                }));
                test_lib_1.it('should redistribute when the shadow dom changes', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    var temp = '<conditional-content>' + '<div class="left">A</div>' + '<div>B</div>' + '<div>C</div>' + '</conditional-content>';
                    compile(temp, [conditionalContentComponent, autoViewportDirective]).then(function (pvRefs) {
                        var viewRefs = renderer.createView(pvRefs[0]);
                        var vcRef = new api_1.ViewContainerRef(viewRefs[2], 0);
                        var vcProtoViewRef = pvRefs[3];
                        var childViewRef = renderer.createView(vcProtoViewRef)[0];
                        test_lib_1.expect(rootEl).toHaveText('(, ABC)');
                        renderer.insertViewIntoContainer(vcRef, childViewRef);
                        test_lib_1.expect(rootEl).toHaveText('(A, BC)');
                        renderer.detachViewFromContainer(vcRef, 0);
                        test_lib_1.expect(rootEl).toHaveText('(, ABC)');
                        async.done();
                    });
                }));
            });
        });
    });
}
exports.main = main;
var simple = new api_1.DirectiveMetadata({
    selector: 'simple',
    id: 'simple',
    type: api_1.DirectiveMetadata.COMPONENT_TYPE
});
var multipleContentTagsComponent = new api_1.DirectiveMetadata({
    selector: 'multiple-content-tags',
    id: 'multiple-content-tags',
    type: api_1.DirectiveMetadata.COMPONENT_TYPE
});
var manualViewportDirective = new api_1.DirectiveMetadata({
    selector: '[manual]',
    id: 'manual',
    type: api_1.DirectiveMetadata.VIEWPORT_TYPE
});
var outerWithIndirectNestedComponent = new api_1.DirectiveMetadata({
    selector: 'outer-with-indirect-nested',
    id: 'outer-with-indirect-nested',
    type: api_1.DirectiveMetadata.COMPONENT_TYPE
});
var outerComponent = new api_1.DirectiveMetadata({
    selector: 'outer',
    id: 'outer',
    type: api_1.DirectiveMetadata.COMPONENT_TYPE
});
var innerComponent = new api_1.DirectiveMetadata({
    selector: 'inner',
    id: 'inner',
    type: api_1.DirectiveMetadata.COMPONENT_TYPE
});
var innerInnerComponent = new api_1.DirectiveMetadata({
    selector: 'innerinner',
    id: 'innerinner',
    type: api_1.DirectiveMetadata.COMPONENT_TYPE
});
var conditionalContentComponent = new api_1.DirectiveMetadata({
    selector: 'conditional-content',
    id: 'conditional-content',
    type: api_1.DirectiveMetadata.COMPONENT_TYPE
});
var autoViewportDirective = new api_1.DirectiveMetadata({
    selector: '[auto]',
    id: '[auto]',
    type: api_1.DirectiveMetadata.VIEWPORT_TYPE
});
var templates = [new api_1.Template({
        componentId: 'simple',
        inline: 'SIMPLE(<content></content>)',
        directives: []
    }), new api_1.Template({
        componentId: 'multiple-content-tags',
        inline: '(<content select=".left"></content>, <content></content>)',
        directives: []
    }), new api_1.Template({
        componentId: 'outer-with-indirect-nested',
        inline: 'OUTER(<simple><div><content></content></div></simple>)',
        directives: [simple]
    }), new api_1.Template({
        componentId: 'outer',
        inline: 'OUTER(<inner><content></content></inner>)',
        directives: [innerComponent]
    }), new api_1.Template({
        componentId: 'inner',
        inline: 'INNER(<innerinner><content></content></innerinner>)',
        directives: [innerInnerComponent]
    }), new api_1.Template({
        componentId: 'innerinner',
        inline: 'INNERINNER(<content select=".left"></content>,<content></content>)',
        directives: []
    }), new api_1.Template({
        componentId: 'conditional-content',
        inline: '<div>(<div *auto="cond"><content select=".left"></content></div>, <content></content>)</div>',
        directives: [autoViewportDirective]
    })];
