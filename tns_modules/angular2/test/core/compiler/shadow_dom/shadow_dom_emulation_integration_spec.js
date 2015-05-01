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
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var di_1 = require('angular2/di');
var change_detection_1 = require('angular2/change_detection');
var exception_handler_1 = require('angular2/src/core/exception_handler');
var compiler_1 = require('angular2/src/core/compiler/compiler');
var life_cycle_1 = require('angular2/src/core/life_cycle/life_cycle');
var directive_metadata_reader_1 = require('angular2/src/core/compiler/directive_metadata_reader');
var shadow_dom_strategy_1 = require('angular2/src/core/compiler/shadow_dom_strategy');
var template_loader_1 = require('angular2/src/render/dom/compiler/template_loader');
var component_url_mapper_1 = require('angular2/src/core/compiler/component_url_mapper');
var url_resolver_1 = require('angular2/src/services/url_resolver');
var style_url_resolver_1 = require('angular2/src/render/dom/shadow_dom/style_url_resolver');
var style_inliner_1 = require('angular2/src/render/dom/shadow_dom/style_inliner');
var template_resolver_mock_1 = require('angular2/src/mock/template_resolver_mock');
var annotations_1 = require('angular2/src/core/annotations/annotations');
var template_1 = require('angular2/src/core/annotations/template');
var view_container_1 = require('angular2/src/core/compiler/view_container');
var browser_adapter_1 = require('angular2/src/dom/browser_adapter');
function main() {
    browser_adapter_1.BrowserDomAdapter.makeCurrent();
    test_lib_1.describe('integration tests', function () {
        var urlResolver;
        var styleUrlResolver;
        var styleInliner;
        var strategies = {
            "scoped": function () { return new shadow_dom_strategy_1.EmulatedScopedShadowDomStrategy(styleInliner, styleUrlResolver, dom_adapter_1.DOM.createElement('div')); },
            "unscoped": function () { return new shadow_dom_strategy_1.EmulatedUnscopedShadowDomStrategy(styleUrlResolver, dom_adapter_1.DOM.createElement('div')); }
        };
        if (dom_adapter_1.DOM.supportsNativeShadowDOM()) {
            collection_1.StringMapWrapper.set(strategies, "native", function () { return new shadow_dom_strategy_1.NativeShadowDomStrategy(styleUrlResolver); });
        }
        collection_1.StringMapWrapper.forEach(strategies, function (strategyFactory, name) {
            test_lib_1.describe(name + " shadow dom strategy", function () {
                var compiler, tplResolver;
                test_lib_1.beforeEach(function () {
                    urlResolver = new url_resolver_1.UrlResolver();
                    styleUrlResolver = new style_url_resolver_1.StyleUrlResolver(urlResolver);
                    styleInliner = new style_inliner_1.StyleInliner(null, styleUrlResolver, urlResolver);
                    tplResolver = new template_resolver_mock_1.MockTemplateResolver();
                    compiler = new compiler_1.Compiler(change_detection_1.dynamicChangeDetection, new template_loader_1.TemplateLoader(null, null), new directive_metadata_reader_1.DirectiveMetadataReader(), new change_detection_1.Parser(new change_detection_1.Lexer()), new compiler_1.CompilerCache(), strategyFactory(), tplResolver, new component_url_mapper_1.ComponentUrlMapper(), urlResolver);
                });
                function compile(template, directives, assertions) {
                    tplResolver.setTemplate(MyComp, new template_1.Template({
                        inline: template,
                        directives: directives
                    }));
                    compiler.compile(MyComp).then(createView).then(function (view) {
                        var lc = new life_cycle_1.LifeCycle(new exception_handler_1.ExceptionHandler(), view.changeDetector, false);
                        assertions(view, lc);
                    });
                }
                Object.defineProperty(compile, "parameters", { get: function () {
                        return [[], [assert.genericType(collection_1.List, lang_1.Type)], []];
                    } });
                test_lib_1.it('should support simple components', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    var temp = '<simple>' + '<div>A</div>' + '</simple>';
                    compile(temp, [Simple], function (view, lc) {
                        test_lib_1.expect(view.nodes).toHaveText('SIMPLE(A)');
                        async.done();
                    });
                }));
                test_lib_1.it('should support multiple content tags', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    var temp = '<multiple-content-tags>' + '<div>B</div>' + '<div>C</div>' + '<div class="left">A</div>' + '</multiple-content-tags>';
                    compile(temp, [MultipleContentTagsComponent], function (view, lc) {
                        test_lib_1.expect(view.nodes).toHaveText('(A, BC)');
                        async.done();
                    });
                }));
                test_lib_1.it('should redistribute only direct children', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    var temp = '<multiple-content-tags>' + '<div>B<div class="left">A</div></div>' + '<div>C</div>' + '</multiple-content-tags>';
                    compile(temp, [MultipleContentTagsComponent], function (view, lc) {
                        test_lib_1.expect(view.nodes).toHaveText('(, BAC)');
                        async.done();
                    });
                }));
                test_lib_1.it("should redistribute direct child viewcontainers when the light dom changes", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    var temp = '<multiple-content-tags>' + '<div><div template="manual" class="left">A</div></div>' + '<div>B</div>' + '</multiple-content-tags>';
                    compile(temp, [MultipleContentTagsComponent, ManualViewportDirective], function (view, lc) {
                        var dir = view.elementInjectors[1].get(ManualViewportDirective);
                        test_lib_1.expect(view.nodes).toHaveText('(, B)');
                        dir.show();
                        lc.tick();
                        test_lib_1.expect(view.nodes).toHaveText('(, AB)');
                        dir.hide();
                        lc.tick();
                        test_lib_1.expect(view.nodes).toHaveText('(, B)');
                        async.done();
                    });
                }));
                test_lib_1.it("should redistribute when the light dom changes", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    var temp = '<multiple-content-tags>' + '<div template="manual" class="left">A</div>' + '<div>B</div>' + '</multiple-content-tags>';
                    compile(temp, [MultipleContentTagsComponent, ManualViewportDirective], function (view, lc) {
                        var dir = view.elementInjectors[1].get(ManualViewportDirective);
                        test_lib_1.expect(view.nodes).toHaveText('(, B)');
                        dir.show();
                        lc.tick();
                        test_lib_1.expect(view.nodes).toHaveText('(A, B)');
                        dir.hide();
                        lc.tick();
                        test_lib_1.expect(view.nodes).toHaveText('(, B)');
                        async.done();
                    });
                }));
                test_lib_1.it("should support nested components", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    var temp = '<outer-with-indirect-nested>' + '<div>A</div>' + '<div>B</div>' + '</outer-with-indirect-nested>';
                    compile(temp, [OuterWithIndirectNestedComponent], function (view, lc) {
                        test_lib_1.expect(view.nodes).toHaveText('OUTER(SIMPLE(AB))');
                        async.done();
                    });
                }));
                test_lib_1.it("should support nesting with content being direct child of a nested component", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    var temp = '<outer>' + '<div template="manual" class="left">A</div>' + '<div>B</div>' + '<div>C</div>' + '</outer>';
                    compile(temp, [OuterComponent, ManualViewportDirective], function (view, lc) {
                        var dir = view.elementInjectors[1].get(ManualViewportDirective);
                        test_lib_1.expect(view.nodes).toHaveText('OUTER(INNER(INNERINNER(,BC)))');
                        dir.show();
                        lc.tick();
                        test_lib_1.expect(view.nodes).toHaveText('OUTER(INNER(INNERINNER(A,BC)))');
                        async.done();
                    });
                }));
                test_lib_1.it('should redistribute when the shadow dom changes', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    var temp = '<conditional-content>' + '<div class="left">A</div>' + '<div>B</div>' + '<div>C</div>' + '</conditional-content>';
                    compile(temp, [ConditionalContentComponent, AutoViewportDirective], function (view, lc) {
                        var cmp = view.elementInjectors[0].get(ConditionalContentComponent);
                        test_lib_1.expect(view.nodes).toHaveText('(, ABC)');
                        cmp.showLeft();
                        lc.tick();
                        test_lib_1.expect(view.nodes).toHaveText('(A, BC)');
                        cmp.hideLeft();
                        lc.tick();
                        test_lib_1.expect(view.nodes).toHaveText('(, ABC)');
                        async.done();
                    });
                }));
            });
        });
    });
}
exports.main = main;
var TestDirectiveMetadataReader = (function (_super) {
    __extends(TestDirectiveMetadataReader, _super);
    function TestDirectiveMetadataReader(shadowDomStrategy) {
        _super.call(this);
        this.shadowDomStrategy = shadowDomStrategy;
    }
    TestDirectiveMetadataReader.prototype.parseShadowDomStrategy = function (annotation) {
        return this.shadowDomStrategy;
    };
    return TestDirectiveMetadataReader;
})(directive_metadata_reader_1.DirectiveMetadataReader);
Object.defineProperty(TestDirectiveMetadataReader.prototype.parseShadowDomStrategy, "parameters", { get: function () {
        return [[annotations_1.Component]];
    } });
var ManualViewportDirective = (function () {
    function ManualViewportDirective(viewContainer) {
        this.viewContainer = viewContainer;
    }
    ManualViewportDirective.prototype.show = function () {
        this.viewContainer.create();
    };
    ManualViewportDirective.prototype.hide = function () {
        this.viewContainer.remove(0);
    };
    return ManualViewportDirective;
})();
Object.defineProperty(ManualViewportDirective, "annotations", { get: function () {
        return [new annotations_1.Viewport({ selector: '[manual]' })];
    } });
Object.defineProperty(ManualViewportDirective, "parameters", { get: function () {
        return [[view_container_1.ViewContainer]];
    } });
var AutoViewportDirective = (function () {
    function AutoViewportDirective(viewContainer) {
        this.viewContainer = viewContainer;
    }
    Object.defineProperty(AutoViewportDirective.prototype, "auto", {
        set: function (newValue) {
            if (newValue) {
                this.viewContainer.create();
            }
            else {
                this.viewContainer.remove(0);
            }
        },
        enumerable: true,
        configurable: true
    });
    return AutoViewportDirective;
})();
Object.defineProperty(AutoViewportDirective, "annotations", { get: function () {
        return [new annotations_1.Viewport({
                selector: '[auto]',
                bind: { 'auto': 'auto' }
            })];
    } });
Object.defineProperty(AutoViewportDirective, "parameters", { get: function () {
        return [[view_container_1.ViewContainer]];
    } });
Object.defineProperty(Object.getOwnPropertyDescriptor(AutoViewportDirective.prototype, "auto").set, "parameters", { get: function () {
        return [[assert.type.boolean]];
    } });
var Simple = (function () {
    function Simple() {
    }
    return Simple;
})();
Object.defineProperty(Simple, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'simple' }), new template_1.Template({ inline: 'SIMPLE(<content></content>)' })];
    } });
var MultipleContentTagsComponent = (function () {
    function MultipleContentTagsComponent() {
    }
    return MultipleContentTagsComponent;
})();
Object.defineProperty(MultipleContentTagsComponent, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'multiple-content-tags' }), new template_1.Template({ inline: '(<content select=".left"></content>, <content></content>)' })];
    } });
var ConditionalContentComponent = (function () {
    function ConditionalContentComponent() {
        this.cond = false;
    }
    ConditionalContentComponent.prototype.showLeft = function () {
        this.cond = true;
    };
    ConditionalContentComponent.prototype.hideLeft = function () {
        this.cond = false;
    };
    return ConditionalContentComponent;
})();
Object.defineProperty(ConditionalContentComponent, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'conditional-content' }), new template_1.Template({
                inline: '<div>(<div *auto="cond"><content select=".left"></content></div>, <content></content>)</div>',
                directives: [AutoViewportDirective]
            })];
    } });
var OuterWithIndirectNestedComponent = (function () {
    function OuterWithIndirectNestedComponent() {
    }
    return OuterWithIndirectNestedComponent;
})();
Object.defineProperty(OuterWithIndirectNestedComponent, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'outer-with-indirect-nested' }), new template_1.Template({
                inline: 'OUTER(<simple><div><content></content></div></simple>)',
                directives: [Simple]
            })];
    } });
var OuterComponent = (function () {
    function OuterComponent() {
    }
    return OuterComponent;
})();
Object.defineProperty(OuterComponent, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'outer' }), new template_1.Template({
                inline: 'OUTER(<inner><content></content></inner>)',
                directives: [InnerComponent]
            })];
    } });
var InnerComponent = (function () {
    function InnerComponent() {
    }
    return InnerComponent;
})();
Object.defineProperty(InnerComponent, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'inner' }), new template_1.Template({
                inline: 'INNER(<innerinner><content></content></innerinner>)',
                directives: [InnerInnerComponent]
            })];
    } });
var InnerInnerComponent = (function () {
    function InnerInnerComponent() {
    }
    return InnerInnerComponent;
})();
Object.defineProperty(InnerInnerComponent, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'innerinner' }), new template_1.Template({ inline: 'INNERINNER(<content select=".left"></content>,<content></content>)' })];
    } });
var MyComp = (function () {
    function MyComp() {
    }
    return MyComp;
})();
Object.defineProperty(MyComp, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'my-comp' }), new template_1.Template({ directives: [MultipleContentTagsComponent, ManualViewportDirective, ConditionalContentComponent, OuterWithIndirectNestedComponent, OuterComponent] })];
    } });
function createView(pv) {
    var view = pv.instantiate(null, null);
    view.hydrate(new di_1.Injector([]), null, null, {}, null);
    return view;
}
