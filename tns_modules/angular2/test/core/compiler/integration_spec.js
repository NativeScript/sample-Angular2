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
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var lang_1 = require('angular2/src/facade/lang');
var async_1 = require('angular2/src/facade/async');
var di_1 = require('angular2/di');
var change_detection_1 = require('angular2/change_detection');
var compiler_1 = require('angular2/src/core/compiler/compiler');
var directive_metadata_reader_1 = require('angular2/src/core/compiler/directive_metadata_reader');
var shadow_dom_strategy_1 = require('angular2/src/core/compiler/shadow_dom_strategy');
var private_component_location_1 = require('angular2/src/core/compiler/private_component_location');
var private_component_loader_1 = require('angular2/src/core/compiler/private_component_loader');
var template_loader_1 = require('angular2/src/render/dom/compiler/template_loader');
var template_resolver_mock_1 = require('angular2/src/mock/template_resolver_mock');
var component_url_mapper_1 = require('angular2/src/core/compiler/component_url_mapper');
var url_resolver_1 = require('angular2/src/services/url_resolver');
var style_url_resolver_1 = require('angular2/src/render/dom/shadow_dom/style_url_resolver');
var event_manager_1 = require('angular2/src/render/dom/events/event_manager');
var annotations_1 = require('angular2/src/core/annotations/annotations');
var template_1 = require('angular2/src/core/annotations/template');
var visibility_1 = require('angular2/src/core/annotations/visibility');
var di_2 = require('angular2/src/core/annotations/di');
var if_1 = require('angular2/src/directives/if');
var view_container_1 = require('angular2/src/core/compiler/view_container');
function main() {
    test_lib_1.describe('integration tests', function () {
        var directiveMetadataReader, shadowDomStrategy, compiler, tplResolver;
        function createCompiler(tplResolver, changedDetection) {
            var urlResolver = new url_resolver_1.UrlResolver();
            return new compiler_1.Compiler(changedDetection, new template_loader_1.TemplateLoader(null, null), directiveMetadataReader, new change_detection_1.Parser(new change_detection_1.Lexer()), new compiler_1.CompilerCache(), shadowDomStrategy, tplResolver, new component_url_mapper_1.ComponentUrlMapper(), urlResolver);
        }
        test_lib_1.beforeEach(function () {
            tplResolver = new template_resolver_mock_1.MockTemplateResolver();
            directiveMetadataReader = new directive_metadata_reader_1.DirectiveMetadataReader();
            var urlResolver = new url_resolver_1.UrlResolver();
            shadowDomStrategy = new shadow_dom_strategy_1.EmulatedUnscopedShadowDomStrategy(new style_url_resolver_1.StyleUrlResolver(urlResolver), null);
            compiler = createCompiler(tplResolver, change_detection_1.dynamicChangeDetection);
        });
        test_lib_1.describe('react to record changes', function () {
            var view, ctx, cd;
            function createView(pv) {
                ctx = new MyComp();
                view = pv.instantiate(null, null);
                view.hydrate(new di_1.Injector([di_1.bind(compiler_1.Compiler).toValue(compiler), di_1.bind(directive_metadata_reader_1.DirectiveMetadataReader).toValue(directiveMetadataReader), di_1.bind(shadow_dom_strategy_1.ShadowDomStrategy).toValue(shadowDomStrategy), di_1.bind(event_manager_1.EventManager).toValue(null), private_component_loader_1.PrivateComponentLoader]), null, null, ctx, null);
                cd = view.changeDetector;
            }
            test_lib_1.it('should consume text node changes', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({ inline: '<div>{{ctxProp}}</div>' }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    ctx.ctxProp = 'Hello World!';
                    cd.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.getInnerHTML(view.nodes[0])).toEqual('Hello World!');
                    async.done();
                });
            }));
            test_lib_1.it('should consume element binding changes', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({ inline: '<div [id]="ctxProp"></div>' }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    ctx.ctxProp = 'Hello World!';
                    cd.detectChanges();
                    test_lib_1.expect(view.nodes[0].id).toEqual('Hello World!');
                    async.done();
                });
            }));
            test_lib_1.it('should consume binding to aria-* attributes', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({ inline: '<div [attr.aria-label]="ctxProp"></div>' }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    ctx.ctxProp = 'Initial aria label';
                    cd.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.getAttribute(view.nodes[0], 'aria-label')).toEqual('Initial aria label');
                    ctx.ctxProp = 'Changed aria label';
                    cd.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.getAttribute(view.nodes[0], 'aria-label')).toEqual('Changed aria label');
                    async.done();
                });
            }));
            test_lib_1.it('should consume binding to property names where attr name and property name do not match', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({ inline: '<div [tabindex]="ctxNumProp"></div>' }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    cd.detectChanges();
                    test_lib_1.expect(view.nodes[0].tabIndex).toEqual(0);
                    ctx.ctxNumProp = 5;
                    cd.detectChanges();
                    test_lib_1.expect(view.nodes[0].tabIndex).toEqual(5);
                    async.done();
                });
            }));
            test_lib_1.it('should consume binding to camel-cased properties using dash-cased syntax in templates', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({ inline: '<input [read-only]="ctxBoolProp">' }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    cd.detectChanges();
                    test_lib_1.expect(view.nodes[0].readOnly).toBeFalsy();
                    ctx.ctxBoolProp = true;
                    cd.detectChanges();
                    test_lib_1.expect(view.nodes[0].readOnly).toBeTruthy();
                    async.done();
                });
            }));
            test_lib_1.it('should consume binding to inner-html', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({ inline: '<div inner-html="{{ctxProp}}"></div>' }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    ctx.ctxProp = 'Some <span>HTML</span>';
                    cd.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.getInnerHTML(view.nodes[0])).toEqual('Some <span>HTML</span>');
                    ctx.ctxProp = 'Some other <div>HTML</div>';
                    cd.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.getInnerHTML(view.nodes[0])).toEqual('Some other <div>HTML</div>');
                    async.done();
                });
            }));
            test_lib_1.it('should ignore bindings to unknown properties', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({ inline: '<div unknown="{{ctxProp}}"></div>' }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    ctx.ctxProp = 'Some value';
                    cd.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.hasProperty(view.nodes[0], 'unknown')).toBeFalsy();
                    async.done();
                });
            }));
            test_lib_1.it('should consume directive watch expression change.', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                var tpl = '<div>' + '<div my-dir [elprop]="ctxProp"></div>' + '<div my-dir elprop="Hi there!"></div>' + '<div my-dir elprop="Hi {{\'there!\'}}"></div>' + '<div my-dir elprop="One more {{ctxProp}}"></div>' + '</div>';
                tplResolver.setTemplate(MyComp, new template_1.Template({
                    inline: tpl,
                    directives: [MyDir]
                }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    ctx.ctxProp = 'Hello World!';
                    cd.detectChanges();
                    test_lib_1.expect(view.elementInjectors[0].get(MyDir).dirProp).toEqual('Hello World!');
                    test_lib_1.expect(view.elementInjectors[1].get(MyDir).dirProp).toEqual('Hi there!');
                    test_lib_1.expect(view.elementInjectors[2].get(MyDir).dirProp).toEqual('Hi there!');
                    test_lib_1.expect(view.elementInjectors[3].get(MyDir).dirProp).toEqual('One more Hello World!');
                    async.done();
                });
            }));
            test_lib_1.it("should support pipes in bindings and bind config", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({
                    inline: '<component-with-pipes #comp [prop]="ctxProp | double"></component-with-pipes>',
                    directives: [ComponentWithPipes]
                }));
                var registry = new change_detection_1.PipeRegistry({ "double": [new DoublePipeFactory()] });
                var changeDetection = new change_detection_1.DynamicChangeDetection(registry);
                var compiler = createCompiler(tplResolver, changeDetection);
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    ctx.ctxProp = 'a';
                    cd.detectChanges();
                    var comp = view.locals.get("comp");
                    test_lib_1.expect(comp.prop).toEqual('aaaa');
                    async.done();
                });
            }));
            test_lib_1.it('should support nested components.', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({
                    inline: '<child-cmp></child-cmp>',
                    directives: [ChildComp]
                }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    cd.detectChanges();
                    test_lib_1.expect(view.nodes).toHaveText('hello');
                    async.done();
                });
            }));
            test_lib_1.it('should support different directive types on a single node', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({
                    inline: '<child-cmp my-dir [elprop]="ctxProp"></child-cmp>',
                    directives: [MyDir, ChildComp]
                }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    ctx.ctxProp = 'Hello World!';
                    cd.detectChanges();
                    var elInj = view.elementInjectors[0];
                    test_lib_1.expect(elInj.get(MyDir).dirProp).toEqual('Hello World!');
                    test_lib_1.expect(elInj.get(ChildComp).dirProp).toEqual(null);
                    async.done();
                });
            }));
            test_lib_1.it('should support directives where a binding attribute is not given', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({
                    inline: '<p my-dir></p>',
                    directives: [MyDir]
                }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    async.done();
                });
            }));
            test_lib_1.it('should support directives where a selector matches property binding', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({
                    inline: '<p [id]="ctxProp"></p>',
                    directives: [IdComponent]
                }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    ctx.ctxProp = 'some_id';
                    cd.detectChanges();
                    test_lib_1.expect(view.nodes[0].id).toEqual('some_id');
                    test_lib_1.expect(view.nodes).toHaveText('Matched on id with some_id');
                    ctx.ctxProp = 'other_id';
                    cd.detectChanges();
                    test_lib_1.expect(view.nodes[0].id).toEqual('other_id');
                    test_lib_1.expect(view.nodes).toHaveText('Matched on id with other_id');
                    async.done();
                });
            }));
            test_lib_1.it('should support template directives via `<template>` elements.', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({
                    inline: '<div><template some-viewport var-greeting="some-tmpl"><copy-me>{{greeting}}</copy-me></template></div>',
                    directives: [SomeViewport]
                }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    cd.detectChanges();
                    var childNodesOfWrapper = view.nodes[0].childNodes;
                    test_lib_1.expect(childNodesOfWrapper.length).toBe(3);
                    test_lib_1.expect(childNodesOfWrapper[1].childNodes[0].nodeValue).toEqual('hello');
                    test_lib_1.expect(childNodesOfWrapper[2].childNodes[0].nodeValue).toEqual('again');
                    async.done();
                });
            }));
            test_lib_1.it('should support template directives via `template` attribute.', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({
                    inline: '<div><copy-me template="some-viewport: var greeting=some-tmpl">{{greeting}}</copy-me></div>',
                    directives: [SomeViewport]
                }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    cd.detectChanges();
                    var childNodesOfWrapper = view.nodes[0].childNodes;
                    test_lib_1.expect(childNodesOfWrapper.length).toBe(3);
                    test_lib_1.expect(childNodesOfWrapper[1].childNodes[0].nodeValue).toEqual('hello');
                    test_lib_1.expect(childNodesOfWrapper[2].childNodes[0].nodeValue).toEqual('again');
                    async.done();
                });
            }));
            test_lib_1.it('should assign the component instance to a var-', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({
                    inline: '<p><child-cmp var-alice></child-cmp></p>',
                    directives: [ChildComp]
                }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    test_lib_1.expect(view.locals).not.toBe(null);
                    test_lib_1.expect(view.locals.get('alice')).toBeAnInstanceOf(ChildComp);
                    async.done();
                });
            }));
            test_lib_1.it('should assign two component instances each with a var-', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({
                    inline: '<p><child-cmp var-alice></child-cmp><child-cmp var-bob></p>',
                    directives: [ChildComp]
                }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    test_lib_1.expect(view.locals).not.toBe(null);
                    test_lib_1.expect(view.locals.get('alice')).toBeAnInstanceOf(ChildComp);
                    test_lib_1.expect(view.locals.get('bob')).toBeAnInstanceOf(ChildComp);
                    test_lib_1.expect(view.locals.get('alice')).not.toBe(view.locals.get('bob'));
                    async.done();
                });
            }));
            test_lib_1.it('should assign the component instance to a var- with shorthand syntax', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({
                    inline: '<child-cmp #alice></child-cmp>',
                    directives: [ChildComp]
                }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    test_lib_1.expect(view.locals).not.toBe(null);
                    test_lib_1.expect(view.locals.get('alice')).toBeAnInstanceOf(ChildComp);
                    async.done();
                });
            }));
            test_lib_1.it('should assign the element instance to a user-defined variable', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({ inline: '<p><div var-alice><i>Hello</i></div></p>' }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    test_lib_1.expect(view.locals).not.toBe(null);
                    var value = view.locals.get('alice');
                    test_lib_1.expect(value).not.toBe(null);
                    test_lib_1.expect(value.tagName.toLowerCase()).toEqual('div');
                    async.done();
                });
            }));
            test_lib_1.it('should assign the element instance to a user-defined variable with camelCase using dash-case', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({ inline: '<p><div var-super-alice><i>Hello</i></div></p>' }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    test_lib_1.expect(view.locals).not.toBe(null);
                    var value = view.locals.get('superAlice');
                    test_lib_1.expect(value).not.toBe(null);
                    test_lib_1.expect(value.tagName.toLowerCase()).toEqual('div');
                    async.done();
                });
            }));
            test_lib_1.describe("BindingPropagationConfig", function () {
                test_lib_1.it("can be used to disable the change detection of the component's template", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    tplResolver.setTemplate(MyComp, new template_1.Template({
                        inline: '<push-cmp #cmp></push-cmp>',
                        directives: [[[PushBasedComp]]]
                    }));
                    compiler.compile(MyComp).then(function (pv) {
                        createView(pv);
                        var cmp = view.locals.get('cmp');
                        cd.detectChanges();
                        test_lib_1.expect(cmp.numberOfChecks).toEqual(1);
                        cd.detectChanges();
                        test_lib_1.expect(cmp.numberOfChecks).toEqual(1);
                        cmp.propagate();
                        cd.detectChanges();
                        test_lib_1.expect(cmp.numberOfChecks).toEqual(2);
                        async.done();
                    });
                }));
                test_lib_1.it('should not affect updating properties on the component', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    tplResolver.setTemplate(MyComp, new template_1.Template({
                        inline: '<push-cmp [prop]="ctxProp" #cmp></push-cmp>',
                        directives: [[[PushBasedComp]]]
                    }));
                    compiler.compile(MyComp).then(function (pv) {
                        createView(pv);
                        var cmp = view.locals.get('cmp');
                        ctx.ctxProp = "one";
                        cd.detectChanges();
                        test_lib_1.expect(cmp.prop).toEqual("one");
                        ctx.ctxProp = "two";
                        cd.detectChanges();
                        test_lib_1.expect(cmp.prop).toEqual("two");
                        async.done();
                    });
                }));
            });
            test_lib_1.it('should create a component that injects a @Parent', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({
                    inline: '<some-directive><cmp-with-parent #child></cmp-with-parent></some-directive>',
                    directives: [SomeDirective, CompWithParent]
                }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    var childComponent = view.locals.get('child');
                    test_lib_1.expect(childComponent.myParent).toBeAnInstanceOf(SomeDirective);
                    async.done();
                });
            }));
            test_lib_1.it('should create a component that injects an @Ancestor', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({
                    inline: "\n            <some-directive>\n              <p>\n                <cmp-with-ancestor #child></cmp-with-ancestor>\n              </p>\n            </some-directive>",
                    directives: [SomeDirective, CompWithAncestor]
                }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    var childComponent = view.locals.get('child');
                    test_lib_1.expect(childComponent.myAncestor).toBeAnInstanceOf(SomeDirective);
                    async.done();
                });
            }));
            test_lib_1.it('should create a component that injects an @Ancestor through viewport directive', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({
                    inline: "\n            <some-directive>\n              <p *if=\"true\">\n                <cmp-with-ancestor #child></cmp-with-ancestor>\n              </p>\n            </some-directive>",
                    directives: [SomeDirective, CompWithAncestor, if_1.If]
                }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    cd.detectChanges();
                    var subview = view.viewContainers[1].get(0);
                    var childComponent = subview.locals.get('child');
                    test_lib_1.expect(childComponent.myAncestor).toBeAnInstanceOf(SomeDirective);
                    async.done();
                });
            }));
            test_lib_1.it('should support events', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({
                    inline: '<div emitter listener></div>',
                    directives: [DecoratorEmitingEvent, DecoratorListeningEvent]
                }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    var injector = view.elementInjectors[0];
                    var emitter = injector.get(DecoratorEmitingEvent);
                    var listener = injector.get(DecoratorListeningEvent);
                    test_lib_1.expect(emitter.msg).toEqual('');
                    test_lib_1.expect(listener.msg).toEqual('');
                    emitter.fireEvent('fired !');
                    test_lib_1.expect(emitter.msg).toEqual('fired !');
                    test_lib_1.expect(listener.msg).toEqual('fired !');
                    async.done();
                });
            }));
            test_lib_1.it('should support dynamic components', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({
                    inline: '<dynamic-comp #dynamic></dynamic-comp>',
                    directives: [DynamicComp]
                }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    var dynamicComponent = view.locals.get("dynamic");
                    test_lib_1.expect(dynamicComponent).toBeAnInstanceOf(DynamicComp);
                    dynamicComponent.done.then(function (_) {
                        cd.detectChanges();
                        test_lib_1.expect(view.nodes).toHaveText('hello');
                        async.done();
                    });
                });
            }));
            test_lib_1.it('should support static attributes', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                tplResolver.setTemplate(MyComp, new template_1.Template({
                    inline: '<input static type="text" title></input>',
                    directives: [NeedsAttribute]
                }));
                compiler.compile(MyComp).then(function (pv) {
                    createView(pv);
                    var injector = view.elementInjectors[0];
                    var needsAttribute = injector.get(NeedsAttribute);
                    test_lib_1.expect(needsAttribute.typeAttribute).toEqual('text');
                    test_lib_1.expect(needsAttribute.titleAttribute).toEqual('');
                    test_lib_1.expect(needsAttribute.fooAttribute).toEqual(null);
                    async.done();
                });
            }));
        });
        test_lib_1.xdescribe('Missing directive checks', function () {
            if (lang_1.assertionsEnabled()) {
                function expectCompileError(inlineTpl, errMessage, done) {
                    tplResolver.setTemplate(MyComp, new template_1.Template({ inline: inlineTpl }));
                    async_1.PromiseWrapper.then(compiler.compile(MyComp), function (value) {
                        throw new lang_1.BaseException("Test failure: should not have come here as an exception was expected");
                    }, function (err) {
                        test_lib_1.expect(err.message).toEqual(errMessage);
                        done();
                    });
                }
                test_lib_1.it('should raise an error if no directive is registered for a template with template bindings', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    expectCompileError('<div><div template="if: foo"></div></div>', 'Missing directive to handle \'if\' in <div template="if: foo">', function () { return async.done(); });
                }));
                test_lib_1.it('should raise an error for missing template directive (1)', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    expectCompileError('<div><template foo></template></div>', 'Missing directive to handle: <template foo>', function () { return async.done(); });
                }));
                test_lib_1.it('should raise an error for missing template directive (2)', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    expectCompileError('<div><template *if="condition"></template></div>', 'Missing directive to handle: <template *if="condition">', function () { return async.done(); });
                }));
                test_lib_1.it('should raise an error for missing template directive (3)', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    expectCompileError('<div *if="condition"></div>', 'Missing directive to handle \'if\' in MyComp: <div *if="condition">', function () { return async.done(); });
                }));
            }
        });
    });
}
exports.main = main;
var DynamicComp = (function () {
    function DynamicComp(loader, location) {
        this.done = loader.load(HelloCmp, location);
    }
    return DynamicComp;
})();
Object.defineProperty(DynamicComp, "annotations", { get: function () {
        return [new annotations_1.DynamicComponent({ selector: 'dynamic-comp' })];
    } });
Object.defineProperty(DynamicComp, "parameters", { get: function () {
        return [[private_component_loader_1.PrivateComponentLoader], [private_component_location_1.PrivateComponentLocation]];
    } });
var HelloCmp = (function () {
    function HelloCmp() {
        this.greeting = "hello";
    }
    return HelloCmp;
})();
Object.defineProperty(HelloCmp, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'hello-cmp' }), new template_1.Template({ inline: "{{greeting}}" })];
    } });
var MyDir = (function () {
    function MyDir() {
        this.dirProp = '';
    }
    return MyDir;
})();
Object.defineProperty(MyDir, "annotations", { get: function () {
        return [new annotations_1.Decorator({
                selector: '[my-dir]',
                bind: { 'dirProp': 'elprop' }
            })];
    } });
var PushBasedComp = (function () {
    function PushBasedComp(bpc) {
        this.numberOfChecks = 0;
        this.bpc = bpc;
    }
    Object.defineProperty(PushBasedComp.prototype, "field", {
        get: function () {
            this.numberOfChecks++;
            return "fixed";
        },
        enumerable: true,
        configurable: true
    });
    PushBasedComp.prototype.propagate = function () {
        this.bpc.shouldBePropagatedFromRoot();
    };
    return PushBasedComp;
})();
Object.defineProperty(PushBasedComp, "annotations", { get: function () {
        return [new annotations_1.Component({
                selector: 'push-cmp',
                bind: { 'prop': 'prop' },
                changeDetection: change_detection_1.ON_PUSH
            }), new template_1.Template({ inline: '{{field}}' })];
    } });
Object.defineProperty(PushBasedComp, "parameters", { get: function () {
        return [[change_detection_1.BindingPropagationConfig]];
    } });
var MyComp = (function () {
    function MyComp() {
        this.ctxProp = 'initial value';
        this.ctxNumProp = 0;
        this.ctxBoolProp = false;
    }
    return MyComp;
})();
Object.defineProperty(MyComp, "annotations", { get: function () {
        return [new annotations_1.Component()];
    } });
var ComponentWithPipes = (function () {
    function ComponentWithPipes() {
    }
    return ComponentWithPipes;
})();
Object.defineProperty(ComponentWithPipes, "annotations", { get: function () {
        return [new annotations_1.Component({
                selector: 'component-with-pipes',
                bind: { "prop": "prop | double" }
            }), new template_1.Template({ inline: '' })];
    } });
var ChildComp = (function () {
    function ChildComp(service) {
        this.ctxProp = service.greeting;
        this.dirProp = null;
    }
    return ChildComp;
})();
Object.defineProperty(ChildComp, "annotations", { get: function () {
        return [new annotations_1.Component({
                selector: 'child-cmp',
                services: [MyService]
            }), new template_1.Template({
                directives: [MyDir],
                inline: '{{ctxProp}}'
            })];
    } });
Object.defineProperty(ChildComp, "parameters", { get: function () {
        return [[MyService]];
    } });
var SomeDirective = (function () {
    function SomeDirective() {
    }
    return SomeDirective;
})();
Object.defineProperty(SomeDirective, "annotations", { get: function () {
        return [new annotations_1.Decorator({ selector: 'some-directive' })];
    } });
var CompWithParent = (function () {
    function CompWithParent(someComp) {
        this.myParent = someComp;
    }
    return CompWithParent;
})();
Object.defineProperty(CompWithParent, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'cmp-with-parent' }), new template_1.Template({
                inline: '<p>Component with an injected parent</p>',
                directives: [SomeDirective]
            })];
    } });
Object.defineProperty(CompWithParent, "parameters", { get: function () {
        return [[SomeDirective, new visibility_1.Parent()]];
    } });
var CompWithAncestor = (function () {
    function CompWithAncestor(someComp) {
        this.myAncestor = someComp;
    }
    return CompWithAncestor;
})();
Object.defineProperty(CompWithAncestor, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'cmp-with-ancestor' }), new template_1.Template({
                inline: '<p>Component with an injected ancestor</p>',
                directives: [SomeDirective]
            })];
    } });
Object.defineProperty(CompWithAncestor, "parameters", { get: function () {
        return [[SomeDirective, new visibility_1.Ancestor()]];
    } });
var ChildComp2 = (function () {
    function ChildComp2(service) {
        this.ctxProp = service.greeting;
        this.dirProp = null;
    }
    return ChildComp2;
})();
Object.defineProperty(ChildComp2, "annotations", { get: function () {
        return [new annotations_1.Component({
                selector: '[child-cmp2]',
                services: [MyService]
            })];
    } });
Object.defineProperty(ChildComp2, "parameters", { get: function () {
        return [[MyService]];
    } });
var SomeViewport = (function () {
    function SomeViewport(container) {
        container.create().setLocal('some-tmpl', 'hello');
        container.create().setLocal('some-tmpl', 'again');
    }
    return SomeViewport;
})();
Object.defineProperty(SomeViewport, "annotations", { get: function () {
        return [new annotations_1.Viewport({ selector: '[some-viewport]' })];
    } });
Object.defineProperty(SomeViewport, "parameters", { get: function () {
        return [[view_container_1.ViewContainer]];
    } });
var MyService = (function () {
    function MyService() {
        this.greeting = 'hello';
    }
    return MyService;
})();
var DoublePipe = (function (_super) {
    __extends(DoublePipe, _super);
    function DoublePipe() {
        _super.apply(this, arguments);
    }
    DoublePipe.prototype.supports = function (obj) {
        return true;
    };
    DoublePipe.prototype.transform = function (value) {
        return "" + value + value;
    };
    return DoublePipe;
})(change_detection_1.Pipe);
var DoublePipeFactory = (function () {
    function DoublePipeFactory() {
    }
    DoublePipeFactory.prototype.supports = function (obj) {
        return true;
    };
    DoublePipeFactory.prototype.create = function (bpc) {
        return new DoublePipe();
    };
    return DoublePipeFactory;
})();
var DecoratorEmitingEvent = (function () {
    function DecoratorEmitingEvent(emitter) {
        this.msg = '';
        this.emitter = emitter;
    }
    DecoratorEmitingEvent.prototype.fireEvent = function (msg) {
        this.emitter(msg);
    };
    DecoratorEmitingEvent.prototype.onEvent = function (msg) {
        this.msg = msg;
    };
    return DecoratorEmitingEvent;
})();
Object.defineProperty(DecoratorEmitingEvent, "annotations", { get: function () {
        return [new annotations_1.Decorator({
                selector: '[emitter]',
                events: { 'event': 'onEvent($event)' }
            })];
    } });
Object.defineProperty(DecoratorEmitingEvent, "parameters", { get: function () {
        return [[Function, new di_2.EventEmitter('event')]];
    } });
Object.defineProperty(DecoratorEmitingEvent.prototype.fireEvent, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(DecoratorEmitingEvent.prototype.onEvent, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
var DecoratorListeningEvent = (function () {
    function DecoratorListeningEvent() {
        this.msg = '';
    }
    DecoratorListeningEvent.prototype.onEvent = function (msg) {
        this.msg = msg;
    };
    return DecoratorListeningEvent;
})();
Object.defineProperty(DecoratorListeningEvent, "annotations", { get: function () {
        return [new annotations_1.Decorator({
                selector: '[listener]',
                events: { 'event': 'onEvent($event)' }
            })];
    } });
Object.defineProperty(DecoratorListeningEvent.prototype.onEvent, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
var IdComponent = (function () {
    function IdComponent() {
    }
    return IdComponent;
})();
Object.defineProperty(IdComponent, "annotations", { get: function () {
        return [new annotations_1.Component({
                selector: '[id]',
                bind: { 'id': 'id' }
            }), new template_1.Template({ inline: '<div>Matched on id with {{id}}</div>' })];
    } });
var NeedsAttribute = (function () {
    function NeedsAttribute(typeAttribute, titleAttribute, fooAttribute) {
        this.typeAttribute = typeAttribute;
        this.titleAttribute = titleAttribute;
        this.fooAttribute = fooAttribute;
    }
    return NeedsAttribute;
})();
Object.defineProperty(NeedsAttribute, "annotations", { get: function () {
        return [new annotations_1.Decorator({ selector: '[static]' })];
    } });
Object.defineProperty(NeedsAttribute, "parameters", { get: function () {
        return [[assert.type.string, new di_2.Attribute('type')], [assert.type.string, new di_2.Attribute('title')], [assert.type.string, new di_2.Attribute('foo')]];
    } });
