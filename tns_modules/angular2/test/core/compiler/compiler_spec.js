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
var async_1 = require('angular2/src/facade/async');
var compiler_1 = require('angular2/src/core/compiler/compiler');
var view_1 = require('angular2/src/core/compiler/view');
var element_binder_1 = require('angular2/src/core/compiler/element_binder');
var directive_metadata_reader_1 = require('angular2/src/core/compiler/directive_metadata_reader');
var annotations_1 = require('angular2/src/core/annotations/annotations');
var di_1 = require('angular2/src/core/annotations/di');
var template_1 = require('angular2/src/core/annotations/template');
var element_injector_1 = require('angular2/src/core/compiler/element_injector');
var template_resolver_1 = require('angular2/src/core/compiler/template_resolver');
var component_url_mapper_1 = require('angular2/src/core/compiler/component_url_mapper');
var proto_view_factory_1 = require('angular2/src/core/compiler/proto_view_factory');
var url_resolver_1 = require('angular2/src/services/url_resolver');
var renderApi = require('angular2/src/render/api');
function main() {
    test_lib_1.describe('compiler', function () {
        var reader, tplResolver, renderer, protoViewFactory, cmpUrlMapper;
        test_lib_1.beforeEach(function () {
            reader = new directive_metadata_reader_1.DirectiveMetadataReader();
            tplResolver = new FakeTemplateResolver();
            cmpUrlMapper = new component_url_mapper_1.RuntimeComponentUrlMapper();
        });
        function createCompiler(renderCompileResults, protoViewFactoryResults) {
            var urlResolver = new FakeUrlResolver();
            renderer = new FakeRenderer(renderCompileResults);
            protoViewFactory = new FakeProtoViewFactory(protoViewFactoryResults);
            return new compiler_1.NewCompiler(reader, new compiler_1.CompilerCache(), tplResolver, cmpUrlMapper, urlResolver, renderer, protoViewFactory);
        }
        Object.defineProperty(createCompiler, "parameters", { get: function () {
                return [[collection_1.List], [assert.genericType(collection_1.List, view_1.ProtoView)]];
            } });
        test_lib_1.describe('serialize template', function () {
            function captureTemplate(template) {
                tplResolver.setTemplate(MainComponent, template);
                var compiler = createCompiler([createRenderProtoView()], [createProtoView()]);
                return compiler.compile(MainComponent).then(function (protoView) {
                    test_lib_1.expect(renderer.requests.length).toBe(1);
                    return renderer.requests[0];
                });
            }
            Object.defineProperty(captureTemplate, "parameters", { get: function () {
                    return [[template_1.Template]];
                } });
            function captureDirective(directive) {
                return captureTemplate(new template_1.Template({
                    inline: '<div></div>',
                    directives: [directive]
                })).then(function (renderTpl) {
                    test_lib_1.expect(renderTpl.directives.length).toBe(1);
                    return renderTpl.directives[0];
                });
            }
            test_lib_1.it('should fill the componentId', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                captureTemplate(new template_1.Template({ inline: '<div></div>' })).then(function (renderTpl) {
                    test_lib_1.expect(renderTpl.componentId).toEqual(lang_1.stringify(MainComponent));
                    async.done();
                });
            }));
            test_lib_1.it('should fill inline', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                captureTemplate(new template_1.Template({ inline: '<div></div>' })).then(function (renderTpl) {
                    test_lib_1.expect(renderTpl.inline).toEqual('<div></div>');
                    async.done();
                });
            }));
            test_lib_1.it('should fill absUrl given inline templates', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                cmpUrlMapper.setComponentUrl(MainComponent, '/mainComponent');
                captureTemplate(new template_1.Template({ inline: '<div></div>' })).then(function (renderTpl) {
                    test_lib_1.expect(renderTpl.absUrl).toEqual('http://www.app.com/mainComponent');
                    async.done();
                });
            }));
            test_lib_1.it('should fill absUrl given url template', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                cmpUrlMapper.setComponentUrl(MainComponent, '/mainComponent');
                captureTemplate(new template_1.Template({ url: '/someTemplate' })).then(function (renderTpl) {
                    test_lib_1.expect(renderTpl.absUrl).toEqual('http://www.app.com/mainComponent/someTemplate');
                    async.done();
                });
            }));
            test_lib_1.it('should fill directive.id', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                captureDirective(MainComponent).then(function (renderDir) {
                    test_lib_1.expect(renderDir.id).toEqual(lang_1.stringify(MainComponent));
                    async.done();
                });
            }));
            test_lib_1.it('should fill directive.selector', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                captureDirective(MainComponent).then(function (renderDir) {
                    test_lib_1.expect(renderDir.selector).toEqual('main-comp');
                    async.done();
                });
            }));
            test_lib_1.it('should fill directive.type for components', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                captureDirective(MainComponent).then(function (renderDir) {
                    test_lib_1.expect(renderDir.type).toEqual(renderApi.DirectiveMetadata.COMPONENT_TYPE);
                    async.done();
                });
            }));
            test_lib_1.it('should fill directive.type for dynamic components', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                captureDirective(SomeDynamicComponentDirective).then(function (renderDir) {
                    test_lib_1.expect(renderDir.type).toEqual(renderApi.DirectiveMetadata.COMPONENT_TYPE);
                    async.done();
                });
            }));
            test_lib_1.it('should fill directive.type for viewport directives', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                captureDirective(SomeViewportDirective).then(function (renderDir) {
                    test_lib_1.expect(renderDir.type).toEqual(renderApi.DirectiveMetadata.VIEWPORT_TYPE);
                    async.done();
                });
            }));
            test_lib_1.it('should fill directive.type for decorator directives', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                captureDirective(SomeDecoratorDirective).then(function (renderDir) {
                    test_lib_1.expect(renderDir.type).toEqual(renderApi.DirectiveMetadata.DECORATOR_TYPE);
                    async.done();
                });
            }));
            test_lib_1.it('should set directive.compileChildren to false for other directives', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                captureDirective(MainComponent).then(function (renderDir) {
                    test_lib_1.expect(renderDir.compileChildren).toEqual(true);
                    async.done();
                });
            }));
            test_lib_1.it('should set directive.compileChildren to true for decorator directives', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                captureDirective(SomeDecoratorDirective).then(function (renderDir) {
                    test_lib_1.expect(renderDir.compileChildren).toEqual(true);
                    async.done();
                });
            }));
            test_lib_1.it('should set directive.compileChildren to false for decorator directives', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                captureDirective(IgnoreChildrenDecoratorDirective).then(function (renderDir) {
                    test_lib_1.expect(renderDir.compileChildren).toEqual(false);
                    async.done();
                });
            }));
            test_lib_1.it('should set directive.events', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                captureDirective(DirectiveWithEvents).then(function (renderDir) {
                    test_lib_1.expect(renderDir.events).toEqual(collection_1.MapWrapper.createFromStringMap({ 'someEvent': 'someAction' }));
                    async.done();
                });
            }));
            test_lib_1.it('should set directive.bind', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                captureDirective(DirectiveWithBind).then(function (renderDir) {
                    test_lib_1.expect(renderDir.bind).toEqual(collection_1.MapWrapper.createFromStringMap({ 'a': 'b' }));
                    async.done();
                });
            }));
            test_lib_1.it('should read @PropertySetter', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                captureDirective(DirectiveWithPropertySetters).then(function (renderDir) {
                    test_lib_1.expect(renderDir.setters).toEqual(['someProp']);
                    async.done();
                });
            }));
            test_lib_1.it('should read @Attribute', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                captureDirective(DirectiveWithAttributes).then(function (renderDir) {
                    test_lib_1.expect(renderDir.readAttributes).toEqual(['someAttr']);
                    async.done();
                });
            }));
        });
        test_lib_1.describe('call ProtoViewFactory', function () {
            test_lib_1.it('should pass the render protoView', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MainComponent, new template_1.Template({ inline: '<div></div>' }));
                var renderProtoView = createRenderProtoView();
                var expectedProtoView = createProtoView();
                var compiler = createCompiler([renderProtoView], [expectedProtoView]);
                compiler.compile(MainComponent).then(function (protoView) {
                    var request = protoViewFactory.requests[0];
                    test_lib_1.expect(request[1]).toBe(renderProtoView);
                    async.done();
                });
            }));
            test_lib_1.it('should pass the component annotation', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MainComponent, new template_1.Template({ inline: '<div></div>' }));
                var compiler = createCompiler([createRenderProtoView()], [createProtoView()]);
                compiler.compile(MainComponent).then(function (protoView) {
                    var request = protoViewFactory.requests[0];
                    test_lib_1.expect(request[0]).toEqual(new annotations_1.Component({ selector: 'main-comp' }));
                    async.done();
                });
            }));
            test_lib_1.it('should pass the directive bindings', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MainComponent, new template_1.Template({
                    inline: '<div></div>',
                    directives: [SomeDecoratorDirective]
                }));
                var compiler = createCompiler([createRenderProtoView()], [createProtoView()]);
                compiler.compile(MainComponent).then(function (protoView) {
                    var request = protoViewFactory.requests[0];
                    var binding = request[2][0];
                    test_lib_1.expect(binding.key.token).toBe(SomeDecoratorDirective);
                    async.done();
                });
            }));
            test_lib_1.it('should use the protoView of the ProtoViewFactory', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MainComponent, new template_1.Template({ inline: '<div></div>' }));
                var renderProtoView = createRenderProtoView();
                var expectedProtoView = createProtoView();
                var compiler = createCompiler([renderProtoView], [expectedProtoView]);
                compiler.compile(MainComponent).then(function (protoView) {
                    test_lib_1.expect(protoView).toBe(expectedProtoView);
                    async.done();
                });
            }));
        });
        test_lib_1.it('should load nested components in root ProtoView', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            tplResolver.setTemplate(MainComponent, new template_1.Template({ inline: '<div></div>' }));
            tplResolver.setTemplate(NestedComponent, new template_1.Template({ inline: '<div></div>' }));
            var mainProtoView = createProtoView([createComponentElementBinder(reader, NestedComponent)]);
            var nestedProtoView = createProtoView();
            var compiler = createCompiler([createRenderProtoView(), createRenderProtoView()], [mainProtoView, nestedProtoView]);
            compiler.compile(MainComponent).then(function (protoView) {
                test_lib_1.expect(protoView).toBe(mainProtoView);
                test_lib_1.expect(mainProtoView.elementBinders[0].nestedProtoView).toBe(nestedProtoView);
                async.done();
            });
        }));
        test_lib_1.it('should load nested components in viewport ProtoView', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            tplResolver.setTemplate(MainComponent, new template_1.Template({ inline: '<div></div>' }));
            tplResolver.setTemplate(NestedComponent, new template_1.Template({ inline: '<div></div>' }));
            var mainProtoView = createProtoView([createViewportElementBinder(createProtoView([createComponentElementBinder(reader, NestedComponent)]))]);
            var nestedProtoView = createProtoView();
            var compiler = createCompiler([createRenderProtoView(), createRenderProtoView()], [mainProtoView, nestedProtoView]);
            compiler.compile(MainComponent).then(function (protoView) {
                test_lib_1.expect(protoView).toBe(mainProtoView);
                test_lib_1.expect(mainProtoView.elementBinders[0].nestedProtoView.elementBinders[0].nestedProtoView).toBe(nestedProtoView);
                async.done();
            });
        }));
        test_lib_1.it('should cache compiled components', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            tplResolver.setTemplate(MainComponent, new template_1.Template({ inline: '<div></div>' }));
            var renderProtoView = createRenderProtoView();
            var expectedProtoView = createProtoView();
            var compiler = createCompiler([renderProtoView], [expectedProtoView]);
            compiler.compile(MainComponent).then(function (protoView) {
                test_lib_1.expect(protoView).toBe(expectedProtoView);
                return compiler.compile(MainComponent);
            }).then(function (protoView) {
                test_lib_1.expect(protoView).toBe(expectedProtoView);
                async.done();
            });
        }));
        test_lib_1.it('should re-use components being compiled', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            tplResolver.setTemplate(MainComponent, new template_1.Template({ inline: '<div></div>' }));
            var renderProtoViewCompleter = async_1.PromiseWrapper.completer();
            var expectedProtoView = createProtoView();
            var compiler = createCompiler([renderProtoViewCompleter.promise], [expectedProtoView]);
            renderProtoViewCompleter.resolve(createRenderProtoView());
            async_1.PromiseWrapper.all([compiler.compile(MainComponent), compiler.compile(MainComponent)]).then(function (protoViews) {
                test_lib_1.expect(protoViews[0]).toBe(expectedProtoView);
                test_lib_1.expect(protoViews[1]).toBe(expectedProtoView);
                async.done();
            });
        }));
        test_lib_1.it('should allow recursive components', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            tplResolver.setTemplate(MainComponent, new template_1.Template({ inline: '<div></div>' }));
            var mainProtoView = createProtoView([createComponentElementBinder(reader, MainComponent)]);
            var compiler = createCompiler([createRenderProtoView()], [mainProtoView]);
            compiler.compile(MainComponent).then(function (protoView) {
                test_lib_1.expect(protoView).toBe(mainProtoView);
                test_lib_1.expect(mainProtoView.elementBinders[0].nestedProtoView).toBe(mainProtoView);
                async.done();
            });
        }));
    });
}
exports.main = main;
function createProtoView(elementBinders) {
    if (elementBinders === void 0) { elementBinders = null; }
    var pv = new view_1.ProtoView(null, null, null, null);
    if (lang_1.isPresent(elementBinders)) {
        pv.elementBinders = elementBinders;
    }
    return pv;
}
function createComponentElementBinder(reader, type) {
    var meta = reader.read(type);
    var binding = element_injector_1.DirectiveBinding.createFromType(meta.type, meta.annotation);
    return new element_binder_1.ElementBinder(0, null, 0, null, binding, null);
}
function createViewportElementBinder(nestedProtoView) {
    var elBinder = new element_binder_1.ElementBinder(0, null, 0, null, null, null);
    elBinder.nestedProtoView = nestedProtoView;
    return elBinder;
}
function createRenderProtoView() {
    return new renderApi.ProtoView();
}
var MainComponent = (function () {
    function MainComponent() {
    }
    return MainComponent;
})();
Object.defineProperty(MainComponent, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'main-comp' })];
    } });
var NestedComponent = (function () {
    function NestedComponent() {
    }
    return NestedComponent;
})();
Object.defineProperty(NestedComponent, "annotations", { get: function () {
        return [new annotations_1.Component()];
    } });
var RecursiveComponent = (function () {
    function RecursiveComponent() {
    }
    return RecursiveComponent;
})();
var SomeDynamicComponentDirective = (function () {
    function SomeDynamicComponentDirective() {
    }
    return SomeDynamicComponentDirective;
})();
Object.defineProperty(SomeDynamicComponentDirective, "annotations", { get: function () {
        return [new annotations_1.DynamicComponent()];
    } });
var SomeViewportDirective = (function () {
    function SomeViewportDirective() {
    }
    return SomeViewportDirective;
})();
Object.defineProperty(SomeViewportDirective, "annotations", { get: function () {
        return [new annotations_1.Viewport()];
    } });
var SomeDecoratorDirective = (function () {
    function SomeDecoratorDirective() {
    }
    return SomeDecoratorDirective;
})();
Object.defineProperty(SomeDecoratorDirective, "annotations", { get: function () {
        return [new annotations_1.Decorator()];
    } });
var IgnoreChildrenDecoratorDirective = (function () {
    function IgnoreChildrenDecoratorDirective() {
    }
    return IgnoreChildrenDecoratorDirective;
})();
Object.defineProperty(IgnoreChildrenDecoratorDirective, "annotations", { get: function () {
        return [new annotations_1.Decorator({ compileChildren: false })];
    } });
var DirectiveWithEvents = (function () {
    function DirectiveWithEvents() {
    }
    return DirectiveWithEvents;
})();
Object.defineProperty(DirectiveWithEvents, "annotations", { get: function () {
        return [new annotations_1.Decorator({ events: { 'someEvent': 'someAction' } })];
    } });
var DirectiveWithBind = (function () {
    function DirectiveWithBind() {
    }
    return DirectiveWithBind;
})();
Object.defineProperty(DirectiveWithBind, "annotations", { get: function () {
        return [new annotations_1.Decorator({ bind: { 'a': 'b' } })];
    } });
var DirectiveWithPropertySetters = (function () {
    function DirectiveWithPropertySetters(someProp) {
    }
    return DirectiveWithPropertySetters;
})();
Object.defineProperty(DirectiveWithPropertySetters, "annotations", { get: function () {
        return [new annotations_1.Decorator()];
    } });
Object.defineProperty(DirectiveWithPropertySetters, "parameters", { get: function () {
        return [[new di_1.PropertySetter('someProp')]];
    } });
var DirectiveWithAttributes = (function () {
    function DirectiveWithAttributes(someAttr) {
    }
    return DirectiveWithAttributes;
})();
Object.defineProperty(DirectiveWithAttributes, "annotations", { get: function () {
        return [new annotations_1.Decorator()];
    } });
Object.defineProperty(DirectiveWithAttributes, "parameters", { get: function () {
        return [[assert.type.string, new di_1.Attribute('someAttr')]];
    } });
var FakeRenderer = (function (_super) {
    __extends(FakeRenderer, _super);
    function FakeRenderer(results) {
        _super.call(this);
        this._results = results;
        this.requests = [];
    }
    FakeRenderer.prototype.compile = function (template) {
        collection_1.ListWrapper.push(this.requests, template);
        return async_1.PromiseWrapper.resolve(collection_1.ListWrapper.removeAt(this._results, 0));
    };
    return FakeRenderer;
})(renderApi.Renderer);
Object.defineProperty(FakeRenderer.prototype.compile, "parameters", { get: function () {
        return [[renderApi.Template]];
    } });
var FakeUrlResolver = (function (_super) {
    __extends(FakeUrlResolver, _super);
    function FakeUrlResolver() {
        _super.call(this);
    }
    FakeUrlResolver.prototype.resolve = function (baseUrl, url) {
        if (baseUrl === null && url == './') {
            return 'http://www.app.com';
        }
        ;
        return baseUrl + url;
    };
    return FakeUrlResolver;
})(url_resolver_1.UrlResolver);
Object.defineProperty(FakeUrlResolver.prototype.resolve, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
var FakeTemplateResolver = (function (_super) {
    __extends(FakeTemplateResolver, _super);
    function FakeTemplateResolver() {
        _super.call(this);
        this._cmpTemplates = collection_1.MapWrapper.create();
    }
    FakeTemplateResolver.prototype.resolve = function (component) {
        var template = collection_1.MapWrapper.get(this._cmpTemplates, component);
        if (lang_1.isBlank(template)) {
            throw 'No template';
        }
        return template;
    };
    FakeTemplateResolver.prototype.setTemplate = function (component, template) {
        collection_1.MapWrapper.set(this._cmpTemplates, component, template);
    };
    return FakeTemplateResolver;
})(template_resolver_1.TemplateResolver);
Object.defineProperty(FakeTemplateResolver.prototype.resolve, "parameters", { get: function () {
        return [[lang_1.Type]];
    } });
Object.defineProperty(FakeTemplateResolver.prototype.setTemplate, "parameters", { get: function () {
        return [[lang_1.Type], [template_1.Template]];
    } });
var FakeProtoViewFactory = (function (_super) {
    __extends(FakeProtoViewFactory, _super);
    function FakeProtoViewFactory(results) {
        _super.call(this, null, null);
        this.requests = [];
        this._results = results;
    }
    FakeProtoViewFactory.prototype.createProtoView = function (componentAnnotation, renderProtoView, directives) {
        collection_1.ListWrapper.push(this.requests, [componentAnnotation, renderProtoView, directives]);
        return collection_1.ListWrapper.removeAt(this._results, 0);
    };
    return FakeProtoViewFactory;
})(proto_view_factory_1.ProtoViewFactory);
Object.defineProperty(FakeProtoViewFactory.prototype.createProtoView, "parameters", { get: function () {
        return [[annotations_1.Component], [renderApi.ProtoView], [assert.genericType(collection_1.List, element_injector_1.DirectiveBinding)]];
    } });
