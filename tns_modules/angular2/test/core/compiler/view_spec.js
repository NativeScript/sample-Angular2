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
var view_1 = require('angular2/src/core/compiler/view');
var element_injector_1 = require('angular2/src/core/compiler/element_injector');
var shadow_dom_strategy_1 = require('angular2/src/core/compiler/shadow_dom_strategy');
var directive_metadata_reader_1 = require('angular2/src/core/compiler/directive_metadata_reader');
var annotations_1 = require('angular2/src/core/annotations/annotations');
var change_detection_1 = require('angular2/change_detection');
var di_1 = require('angular2/src/core/annotations/di');
var collection_1 = require('angular2/src/facade/collection');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var lang_1 = require('angular2/src/facade/lang');
var di_2 = require('angular2/di');
var view_2 = require('angular2/src/core/compiler/view');
var view_container_1 = require('angular2/src/core/compiler/view_container');
var vm_turn_zone_1 = require('angular2/src/core/zone/vm_turn_zone');
var event_manager_1 = require('angular2/src/render/dom/events/event_manager');
var reflection_1 = require('angular2/src/reflection/reflection');
var DummyDirective = (function (_super) {
    __extends(DummyDirective, _super);
    function DummyDirective(_a) {
        var lifecycle = (_a === void 0 ? {} : _a).lifecycle;
        _super.call(this, { lifecycle: lifecycle });
    }
    return DummyDirective;
})(annotations_1.Directive);
var FakeViewContainer = (function () {
    function FakeViewContainer(templateElement) {
        this.templateElement = templateElement;
    }
    FakeViewContainer.prototype.noSuchMethod = function (i) {
        _super.noSuchMethod.call(this, i);
    };
    return FakeViewContainer;
})();
Object.defineProperty(FakeViewContainer, "annotations", { get: function () {
        return [new test_lib_1.proxy, new lang_1.IMPLEMENTS(view_container_1.ViewContainer)];
    } });
var FakeView = (function () {
    function FakeView() {
    }
    FakeView.prototype.noSuchMethod = function (i) {
        _super.noSuchMethod.call(this, i);
    };
    return FakeView;
})();
Object.defineProperty(FakeView, "annotations", { get: function () {
        return [new test_lib_1.proxy, new lang_1.IMPLEMENTS(view_2.View)];
    } });
function main() {
    test_lib_1.describe('view', function () {
        var parser, someComponentDirective, someViewportDirective;
        function createView(protoView, eventManager) {
            if (eventManager === void 0) { eventManager = null; }
            var ctx = new MyEvaluationContext();
            var view = protoView.instantiate(null, eventManager);
            view.hydrate(null, null, null, ctx, null);
            return view;
        }
        Object.defineProperty(createView, "parameters", { get: function () {
                return [[], [event_manager_1.EventManager]];
            } });
        test_lib_1.beforeEach(function () {
            parser = new change_detection_1.Parser(new change_detection_1.Lexer());
            someComponentDirective = readDirectiveBinding(SomeComponent);
            someViewportDirective = readDirectiveBinding(SomeViewport);
        });
        test_lib_1.describe('instantiated from protoView', function () {
            var view;
            test_lib_1.beforeEach(function () {
                var pv = new view_1.ProtoView(test_lib_1.el('<div id="1"></div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                view = pv.instantiate(null, null);
            });
            test_lib_1.it('should be dehydrated by default', function () {
                test_lib_1.expect(view.hydrated()).toBe(false);
            });
            test_lib_1.it('should be able to be hydrated and dehydrated', function () {
                var ctx = new Object();
                view.hydrate(null, null, null, ctx, null);
                test_lib_1.expect(view.hydrated()).toBe(true);
                view.dehydrate();
                test_lib_1.expect(view.hydrated()).toBe(false);
            });
            test_lib_1.it('should hydrate and dehydrate the change detector', function () {
                var ctx = new Object();
                view.hydrate(null, null, null, ctx, null);
                test_lib_1.expect(view.changeDetector.hydrated()).toBe(true);
                view.dehydrate();
                test_lib_1.expect(view.changeDetector.hydrated()).toBe(false);
            });
            test_lib_1.it('should use the view pool to reuse views', function () {
                var pv = new view_1.ProtoView(test_lib_1.el('<div id="1"></div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                var fakeView = new FakeView();
                pv.returnToPool(fakeView);
                test_lib_1.expect(pv.instantiate(null, null)).toBe(fakeView);
            });
        });
        test_lib_1.describe('with locals', function () {
            var view;
            test_lib_1.beforeEach(function () {
                var pv = new view_1.ProtoView(test_lib_1.el('<div id="1"></div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                pv.bindVariable('context-foo', 'template-foo');
                view = createView(pv);
            });
            test_lib_1.it('should support setting of declared locals', function () {
                view.setLocal('context-foo', 'bar');
                test_lib_1.expect(view.locals.get('template-foo')).toBe('bar');
            });
            test_lib_1.it('should not throw on undeclared locals', function () {
                test_lib_1.expect(function () { return view.setLocal('setMePlease', 'bar'); }).not.toThrow();
            });
            test_lib_1.it('when dehydrated should set locals to null', function () {
                view.setLocal('context-foo', 'bar');
                view.dehydrate();
                view.hydrate(null, null, null, new Object(), null);
                test_lib_1.expect(view.locals.get('template-foo')).toBe(null);
            });
            test_lib_1.it('should throw when trying to set on dehydrated view', function () {
                view.dehydrate();
                test_lib_1.expect(function () { return view.setLocal('context-foo', 'bar'); }).toThrowError();
            });
        });
        test_lib_1.describe('instantiated and hydrated', function () {
            function createCollectDomNodesTestCases(useTemplateElement) {
                function templateAwareCreateElement(html) {
                    return test_lib_1.el(useTemplateElement ? "<template>" + html + "</template>" : html);
                }
                test_lib_1.it('should collect the root node in the ProtoView element', function () {
                    var pv = new view_1.ProtoView(templateAwareCreateElement('<div id="1"></div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                    var view = pv.instantiate(null, null);
                    view.hydrate(null, null, null, null, null);
                    test_lib_1.expect(view.nodes.length).toBe(1);
                    test_lib_1.expect(dom_adapter_1.DOM.getAttribute(view.nodes[0], 'id')).toEqual('1');
                });
                test_lib_1.describe('collect elements with property bindings', function () {
                    test_lib_1.it('should collect property bindings on the root element if it has the ng-binding class', function () {
                        var pv = new view_1.ProtoView(templateAwareCreateElement('<div [prop]="a" class="ng-binding"></div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                        pv.bindElement(null, 0, null);
                        pv.bindElementProperty(parser.parseBinding('a', null), 'prop', reflection_1.reflector.setter('prop'));
                        var view = pv.instantiate(null, null);
                        view.hydrate(null, null, null, null, null);
                        test_lib_1.expect(view.bindElements.length).toEqual(1);
                        test_lib_1.expect(view.bindElements[0]).toBe(view.nodes[0]);
                    });
                    test_lib_1.it('should collect property bindings on child elements with ng-binding class', function () {
                        var pv = new view_1.ProtoView(templateAwareCreateElement('<div><span></span><span class="ng-binding"></span></div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                        pv.bindElement(null, 0, null);
                        pv.bindElementProperty(parser.parseBinding('b', null), 'a', reflection_1.reflector.setter('a'));
                        var view = pv.instantiate(null, null);
                        view.hydrate(null, null, null, null, null);
                        test_lib_1.expect(view.bindElements.length).toEqual(1);
                        test_lib_1.expect(view.bindElements[0]).toBe(view.nodes[0].childNodes[1]);
                    });
                });
                test_lib_1.describe('collect text nodes with bindings', function () {
                    test_lib_1.it('should collect text nodes under the root element', function () {
                        var pv = new view_1.ProtoView(templateAwareCreateElement('<div class="ng-binding">{{}}<span></span>{{}}</div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                        pv.bindElement(null, 0, null);
                        pv.bindTextNode(0, parser.parseBinding('a', null));
                        pv.bindTextNode(2, parser.parseBinding('b', null));
                        var view = pv.instantiate(null, null);
                        view.hydrate(null, null, null, null, null);
                        test_lib_1.expect(view.textNodes.length).toEqual(2);
                        test_lib_1.expect(view.textNodes[0]).toBe(view.nodes[0].childNodes[0]);
                        test_lib_1.expect(view.textNodes[1]).toBe(view.nodes[0].childNodes[2]);
                    });
                    test_lib_1.it('should collect text nodes with bindings on child elements with ng-binding class', function () {
                        var pv = new view_1.ProtoView(templateAwareCreateElement('<div><span> </span><span class="ng-binding">{{}}</span></div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                        pv.bindElement(null, 0, null);
                        pv.bindTextNode(0, parser.parseBinding('b', null));
                        var view = pv.instantiate(null, null);
                        view.hydrate(null, null, null, null, null);
                        test_lib_1.expect(view.textNodes.length).toEqual(1);
                        test_lib_1.expect(view.textNodes[0]).toBe(view.nodes[0].childNodes[1].childNodes[0]);
                    });
                });
            }
            Object.defineProperty(createCollectDomNodesTestCases, "parameters", { get: function () {
                    return [[assert.type.boolean]];
                } });
            test_lib_1.describe('inplace instantiation', function () {
                test_lib_1.it('should be supported.', function () {
                    var template = test_lib_1.el('<div></div>');
                    var pv = new view_1.ProtoView(template, new change_detection_1.DynamicProtoChangeDetector(null, null), new shadow_dom_strategy_1.NativeShadowDomStrategy(null));
                    pv.instantiateInPlace = true;
                    var view = pv.instantiate(null, null);
                    view.hydrate(null, null, null, null, null);
                    test_lib_1.expect(view.nodes[0]).toBe(template);
                });
                test_lib_1.it('should be off by default.', function () {
                    var template = test_lib_1.el('<div></div>');
                    var pv = new view_1.ProtoView(template, new change_detection_1.DynamicProtoChangeDetector(null, null), new shadow_dom_strategy_1.NativeShadowDomStrategy(null));
                    var view = pv.instantiate(null, null);
                    view.hydrate(null, null, null, null, null);
                    test_lib_1.expect(view.nodes[0]).not.toBe(template);
                });
            });
            test_lib_1.describe('collect dom nodes with a regular element as root', function () {
                createCollectDomNodesTestCases(false);
            });
            test_lib_1.describe('collect dom nodes with a template element as root', function () {
                createCollectDomNodesTestCases(true);
            });
            test_lib_1.describe('create ElementInjectors', function () {
                test_lib_1.it('should use the directives of the ProtoElementInjector', function () {
                    var pv = new view_1.ProtoView(test_lib_1.el('<div class="ng-binding"></div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                    pv.bindElement(null, 0, new element_injector_1.ProtoElementInjector(null, 1, [SomeDirective]));
                    var view = pv.instantiate(null, null);
                    view.hydrate(null, null, null, null, null);
                    test_lib_1.expect(view.elementInjectors.length).toBe(1);
                    test_lib_1.expect(view.elementInjectors[0].get(SomeDirective) instanceof SomeDirective).toBe(true);
                });
                test_lib_1.it('should use the correct parent', function () {
                    var pv = new view_1.ProtoView(test_lib_1.el('<div class="ng-binding"><span class="ng-binding"></span></div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                    var protoParent = new element_injector_1.ProtoElementInjector(null, 0, [SomeDirective]);
                    pv.bindElement(null, 0, protoParent);
                    pv.bindElement(null, 0, new element_injector_1.ProtoElementInjector(protoParent, 1, [AnotherDirective]));
                    var view = pv.instantiate(null, null);
                    view.hydrate(null, null, null, null, null);
                    test_lib_1.expect(view.elementInjectors.length).toBe(2);
                    test_lib_1.expect(view.elementInjectors[0].get(SomeDirective) instanceof SomeDirective).toBe(true);
                    test_lib_1.expect(view.elementInjectors[1].parent).toBe(view.elementInjectors[0]);
                });
                test_lib_1.it('should not pass the host injector when a parent injector exists', function () {
                    var pv = new view_1.ProtoView(test_lib_1.el('<div class="ng-binding"><span class="ng-binding"></span></div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                    var protoParent = new element_injector_1.ProtoElementInjector(null, 0, [SomeDirective]);
                    pv.bindElement(null, 0, protoParent);
                    var testProtoElementInjector = new TestProtoElementInjector(protoParent, 1, [AnotherDirective]);
                    pv.bindElement(null, 0, testProtoElementInjector);
                    var hostProtoInjector = new element_injector_1.ProtoElementInjector(null, 0, []);
                    var hostInjector = hostProtoInjector.instantiate(null, null);
                    var view;
                    test_lib_1.expect(function () { return view = pv.instantiate(hostInjector, null); }).not.toThrow();
                    test_lib_1.expect(testProtoElementInjector.parentElementInjector).toBe(view.elementInjectors[0]);
                    test_lib_1.expect(testProtoElementInjector.hostElementInjector).toBeNull();
                });
                test_lib_1.it('should pass the host injector when there is no parent injector', function () {
                    var pv = new view_1.ProtoView(test_lib_1.el('<div class="ng-binding"><span class="ng-binding"></span></div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                    pv.bindElement(null, 0, new element_injector_1.ProtoElementInjector(null, 0, [SomeDirective]));
                    var testProtoElementInjector = new TestProtoElementInjector(null, 1, [AnotherDirective]);
                    pv.bindElement(null, 0, testProtoElementInjector);
                    var hostProtoInjector = new element_injector_1.ProtoElementInjector(null, 0, []);
                    var hostInjector = hostProtoInjector.instantiate(null, null);
                    test_lib_1.expect(function () { return pv.instantiate(hostInjector, null); }).not.toThrow();
                    test_lib_1.expect(testProtoElementInjector.parentElementInjector).toBeNull();
                    test_lib_1.expect(testProtoElementInjector.hostElementInjector).toBe(hostInjector);
                });
            });
            test_lib_1.describe('collect root element injectors', function () {
                test_lib_1.it('should collect a single root element injector', function () {
                    var pv = new view_1.ProtoView(test_lib_1.el('<div class="ng-binding"><span class="ng-binding"></span></div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                    var protoParent = new element_injector_1.ProtoElementInjector(null, 0, [SomeDirective]);
                    pv.bindElement(null, 0, protoParent);
                    pv.bindElement(null, 0, new element_injector_1.ProtoElementInjector(protoParent, 1, [AnotherDirective]));
                    var view = pv.instantiate(null, null);
                    view.hydrate(null, null, null, null, null);
                    test_lib_1.expect(view.rootElementInjectors.length).toBe(1);
                    test_lib_1.expect(view.rootElementInjectors[0].get(SomeDirective) instanceof SomeDirective).toBe(true);
                });
                test_lib_1.it('should collect multiple root element injectors', function () {
                    var pv = new view_1.ProtoView(test_lib_1.el('<div><span class="ng-binding"></span><span class="ng-binding"></span></div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                    pv.bindElement(null, 0, new element_injector_1.ProtoElementInjector(null, 1, [SomeDirective]));
                    pv.bindElement(null, 0, new element_injector_1.ProtoElementInjector(null, 2, [AnotherDirective]));
                    var view = pv.instantiate(null, null);
                    view.hydrate(null, null, null, null, null);
                    test_lib_1.expect(view.rootElementInjectors.length).toBe(2);
                    test_lib_1.expect(view.rootElementInjectors[0].get(SomeDirective) instanceof SomeDirective).toBe(true);
                    test_lib_1.expect(view.rootElementInjectors[1].get(AnotherDirective) instanceof AnotherDirective).toBe(true);
                });
            });
            test_lib_1.describe('with component views', function () {
                var ctx;
                function createComponentWithSubPV(subProtoView) {
                    var pv = new view_1.ProtoView(test_lib_1.el('<cmp class="ng-binding"></cmp>'), new change_detection_1.DynamicProtoChangeDetector(null, null), new shadow_dom_strategy_1.NativeShadowDomStrategy(null));
                    var binder = pv.bindElement(null, 0, new element_injector_1.ProtoElementInjector(null, 0, [SomeComponent], true));
                    binder.componentDirective = someComponentDirective;
                    binder.nestedProtoView = subProtoView;
                    return pv;
                }
                function createNestedView(protoView) {
                    ctx = new MyEvaluationContext();
                    var view = protoView.instantiate(null, null);
                    view.hydrate(new di_2.Injector([]), null, null, ctx, null);
                    return view;
                }
                test_lib_1.it('should expose component services to the component', function () {
                    var subpv = new view_1.ProtoView(test_lib_1.el('<span></span>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                    var pv = createComponentWithSubPV(subpv);
                    var view = createNestedView(pv);
                    var comp = view.rootElementInjectors[0].get(SomeComponent);
                    test_lib_1.expect(comp.service).toBeAnInstanceOf(SomeService);
                });
                test_lib_1.it('should expose component services and component instance to directives in the shadow Dom', function () {
                    var subpv = new view_1.ProtoView(test_lib_1.el('<div dec class="ng-binding">hello shadow dom</div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                    subpv.bindElement(null, 0, new element_injector_1.ProtoElementInjector(null, 0, [ServiceDependentDecorator]));
                    var pv = createComponentWithSubPV(subpv);
                    var view = createNestedView(pv);
                    var subView = view.componentChildViews[0];
                    var subInj = subView.rootElementInjectors[0];
                    var subDecorator = subInj.get(ServiceDependentDecorator);
                    var comp = view.rootElementInjectors[0].get(SomeComponent);
                    test_lib_1.expect(subDecorator).toBeAnInstanceOf(ServiceDependentDecorator);
                    test_lib_1.expect(subDecorator.service).toBe(comp.service);
                    test_lib_1.expect(subDecorator.component).toBe(comp);
                });
                function expectViewHasNoDirectiveInstances(view) {
                    view.elementInjectors.forEach(function (inj) { return test_lib_1.expect(inj.hasInstances()).toBe(false); });
                }
                test_lib_1.it('dehydration should dehydrate child component views too', function () {
                    var subpv = new view_1.ProtoView(test_lib_1.el('<div dec class="ng-binding">hello shadow dom</div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                    subpv.bindElement(null, 0, new element_injector_1.ProtoElementInjector(null, 0, [ServiceDependentDecorator]));
                    var pv = createComponentWithSubPV(subpv);
                    var view = createNestedView(pv);
                    view.dehydrate();
                    test_lib_1.expect(view.hydrated()).toBe(false);
                    expectViewHasNoDirectiveInstances(view);
                    view.componentChildViews.forEach(function (view) { return expectViewHasNoDirectiveInstances(view); });
                });
                test_lib_1.it('should create shadow dom (Native Strategy)', function () {
                    var subpv = new view_1.ProtoView(test_lib_1.el('<span>hello shadow dom</span>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                    var pv = createComponentWithSubPV(subpv);
                    var view = createNestedView(pv);
                    test_lib_1.expect(view.nodes[0].shadowRoot.childNodes[0].childNodes[0].nodeValue).toEqual('hello shadow dom');
                });
                test_lib_1.it('should emulate shadow dom (Emulated Strategy)', function () {
                    var subpv = new view_1.ProtoView(test_lib_1.el('<span>hello shadow dom</span>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                    var pv = new view_1.ProtoView(test_lib_1.el('<cmp class="ng-binding"></cmp>'), new change_detection_1.DynamicProtoChangeDetector(null, null), new shadow_dom_strategy_1.EmulatedScopedShadowDomStrategy(null, null, null));
                    var binder = pv.bindElement(null, 0, new element_injector_1.ProtoElementInjector(null, 0, [SomeComponent], true));
                    binder.componentDirective = readDirectiveBinding(SomeComponent);
                    binder.nestedProtoView = subpv;
                    var view = createNestedView(pv);
                    test_lib_1.expect(view.nodes[0].childNodes[0].childNodes[0].nodeValue).toEqual('hello shadow dom');
                });
            });
            test_lib_1.describe('with template views', function () {
                function createViewWithViewport() {
                    var templateProtoView = new view_1.ProtoView(test_lib_1.el('<div id="1"></div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                    var pv = new view_1.ProtoView(test_lib_1.el('<someTmpl class="ng-binding"></someTmpl>'), new change_detection_1.DynamicProtoChangeDetector(null, null), new shadow_dom_strategy_1.NativeShadowDomStrategy(null));
                    var binder = pv.bindElement(null, 0, new element_injector_1.ProtoElementInjector(null, 0, [SomeViewport]));
                    binder.viewportDirective = someViewportDirective;
                    binder.nestedProtoView = templateProtoView;
                    return createView(pv);
                }
                test_lib_1.it('should create a ViewContainer for the Viewport directive', function () {
                    var view = createViewWithViewport();
                    var tmplComp = view.rootElementInjectors[0].get(SomeViewport);
                    test_lib_1.expect(tmplComp.viewContainer).not.toBe(null);
                });
                test_lib_1.it('dehydration should dehydrate viewcontainers', function () {
                    var view = createViewWithViewport();
                    var tmplComp = view.rootElementInjectors[0].get(SomeViewport);
                    test_lib_1.expect(tmplComp.viewContainer.hydrated()).toBe(false);
                });
            });
            if (dom_adapter_1.DOM.supportsDOMEvents()) {
                test_lib_1.describe('event handlers', function () {
                    var view, ctx, called, receivedEvent, dispatchedEvent;
                    function createViewAndContext(protoView) {
                        view = createView(protoView, new event_manager_1.EventManager([new event_manager_1.DomEventsPlugin()], new FakeVmTurnZone()));
                        ctx = view.context;
                        called = 0;
                        receivedEvent = null;
                        ctx.callMe = function (event) {
                            called += 1;
                            receivedEvent = event;
                        };
                    }
                    function dispatchClick(el) {
                        dispatchedEvent = dom_adapter_1.DOM.createMouseEvent('click');
                        dom_adapter_1.DOM.dispatchEvent(el, dispatchedEvent);
                    }
                    function createProtoView() {
                        var pv = new view_1.ProtoView(test_lib_1.el('<div class="ng-binding"><div></div></div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                        pv.bindElement(null, 0, new TestProtoElementInjector(null, 0, []));
                        pv.bindEvent('click', parser.parseBinding('callMe($event)', null));
                        return pv;
                    }
                    test_lib_1.it('should fire on non-bubbling native events', function () {
                        createViewAndContext(createProtoView());
                        dispatchClick(view.nodes[0]);
                        test_lib_1.expect(called).toEqual(1);
                        test_lib_1.expect(receivedEvent).toBe(dispatchedEvent);
                    });
                    test_lib_1.it('should not fire on a bubbled native events', function () {
                        createViewAndContext(createProtoView());
                        dispatchClick(view.nodes[0].firstChild);
                        test_lib_1.expect(called).toEqual(0);
                    });
                    test_lib_1.it('should not throw if the view is dehydrated', function () {
                        createViewAndContext(createProtoView());
                        view.dehydrate();
                        test_lib_1.expect(function () { return dispatchClick(view.nodes[0]); }).not.toThrow();
                        test_lib_1.expect(called).toEqual(0);
                    });
                    test_lib_1.it('should support custom event emitters', function () {
                        var pv = new view_1.ProtoView(test_lib_1.el('<div class="ng-binding"><div></div></div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                        pv.bindElement(null, 0, new TestProtoElementInjector(null, 0, [EventEmitterDirective]));
                        pv.bindEvent('click', parser.parseBinding('callMe($event)', null));
                        createViewAndContext(pv);
                        var dir = view.elementInjectors[0].get(EventEmitterDirective);
                        var dispatchedEvent = new Object();
                        dir.click(dispatchedEvent);
                        test_lib_1.expect(receivedEvent).toBe(dispatchedEvent);
                        test_lib_1.expect(called).toEqual(1);
                        dispatchClick(view.nodes[0]);
                        test_lib_1.expect(called).toEqual(1);
                    });
                    test_lib_1.it('should bind to directive events', function () {
                        var pv = new view_1.ProtoView(test_lib_1.el('<div class="ng-binding"></div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                        pv.bindElement(null, 0, new element_injector_1.ProtoElementInjector(null, 0, [SomeDirectiveWithEventHandler]));
                        pv.bindEvent('click', parser.parseAction('onEvent($event)', null), 0);
                        view = createView(pv, new event_manager_1.EventManager([new event_manager_1.DomEventsPlugin()], new FakeVmTurnZone()));
                        var directive = view.elementInjectors[0].get(SomeDirectiveWithEventHandler);
                        test_lib_1.expect(directive.event).toEqual(null);
                        dispatchClick(view.nodes[0]);
                        test_lib_1.expect(directive.event).toBe(dispatchedEvent);
                    });
                });
            }
            test_lib_1.describe('react to record changes', function () {
                var view, cd, ctx;
                function createViewAndChangeDetector(protoView) {
                    view = createView(protoView);
                    ctx = view.context;
                    cd = view.changeDetector;
                }
                test_lib_1.it('should consume text node changes', function () {
                    var pv = new view_1.ProtoView(test_lib_1.el('<div class="ng-binding">{{}}</div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                    pv.bindElement(null, 0, null);
                    pv.bindTextNode(0, parser.parseBinding('foo', null));
                    createViewAndChangeDetector(pv);
                    ctx.foo = 'buz';
                    cd.detectChanges();
                    test_lib_1.expect(view.textNodes[0].nodeValue).toEqual('buz');
                });
                test_lib_1.it('should consume element binding changes', function () {
                    var pv = new view_1.ProtoView(test_lib_1.el('<div class="ng-binding"></div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                    pv.bindElement(null, 0, null);
                    pv.bindElementProperty(parser.parseBinding('foo', null), 'id', reflection_1.reflector.setter('id'));
                    createViewAndChangeDetector(pv);
                    ctx.foo = 'buz';
                    cd.detectChanges();
                    test_lib_1.expect(view.bindElements[0].id).toEqual('buz');
                });
                test_lib_1.it('should consume directive watch expression change', function () {
                    var pv = new view_1.ProtoView(test_lib_1.el('<div class="ng-binding"></div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                    pv.bindElement(null, 0, new element_injector_1.ProtoElementInjector(null, 0, [SomeDirective]));
                    pv.bindDirectiveProperty(0, parser.parseBinding('foo', null), 'prop', reflection_1.reflector.setter('prop'));
                    createViewAndChangeDetector(pv);
                    ctx.foo = 'buz';
                    cd.detectChanges();
                    test_lib_1.expect(view.elementInjectors[0].get(SomeDirective).prop).toEqual('buz');
                });
                test_lib_1.it('should notify a directive about changes after all its properties have been set', function () {
                    var pv = new view_1.ProtoView(test_lib_1.el('<div class="ng-binding"></div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                    pv.bindElement(null, 0, new element_injector_1.ProtoElementInjector(null, 0, [element_injector_1.DirectiveBinding.createFromType(DirectiveImplementingOnChange, new DummyDirective({ lifecycle: [annotations_1.onChange] }))]));
                    pv.bindDirectiveProperty(0, parser.parseBinding('a', null), 'a', reflection_1.reflector.setter('a'));
                    pv.bindDirectiveProperty(0, parser.parseBinding('b', null), 'b', reflection_1.reflector.setter('b'));
                    createViewAndChangeDetector(pv);
                    ctx.a = 100;
                    ctx.b = 200;
                    cd.detectChanges();
                    var directive = view.elementInjectors[0].get(DirectiveImplementingOnChange);
                    test_lib_1.expect(directive.c).toEqual(300);
                });
                test_lib_1.it('should provide a map of updated properties using onChange callback', function () {
                    var pv = new view_1.ProtoView(test_lib_1.el('<div class="ng-binding"></div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                    pv.bindElement(null, 0, new element_injector_1.ProtoElementInjector(null, 0, [element_injector_1.DirectiveBinding.createFromType(DirectiveImplementingOnChange, new DummyDirective({ lifecycle: [annotations_1.onChange] }))]));
                    pv.bindDirectiveProperty(0, parser.parseBinding('a', null), 'a', reflection_1.reflector.setter('a'));
                    pv.bindDirectiveProperty(0, parser.parseBinding('b', null), 'b', reflection_1.reflector.setter('b'));
                    createViewAndChangeDetector(pv);
                    var directive = view.elementInjectors[0].get(DirectiveImplementingOnChange);
                    ctx.a = 0;
                    ctx.b = 0;
                    cd.detectChanges();
                    test_lib_1.expect(directive.changes["a"].currentValue).toEqual(0);
                    test_lib_1.expect(directive.changes["b"].currentValue).toEqual(0);
                    ctx.a = 100;
                    cd.detectChanges();
                    test_lib_1.expect(directive.changes["a"].currentValue).toEqual(100);
                    test_lib_1.expect(collection_1.StringMapWrapper.contains(directive.changes, "b")).toBe(false);
                });
                test_lib_1.it('should invoke the onAllChangesDone callback', function () {
                    var pv = new view_1.ProtoView(test_lib_1.el('<div class="ng-binding"></div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), null);
                    pv.bindElement(null, 0, new element_injector_1.ProtoElementInjector(null, 0, [element_injector_1.DirectiveBinding.createFromType(DirectiveImplementingOnAllChangesDone, new DummyDirective({ lifecycle: [annotations_1.onAllChangesDone] }))]));
                    createViewAndChangeDetector(pv);
                    cd.detectChanges();
                    var directive = view.elementInjectors[0].get(DirectiveImplementingOnAllChangesDone);
                    test_lib_1.expect(directive.onAllChangesDoneCalled).toBe(true);
                });
            });
        });
        test_lib_1.describe('protoView createRootProtoView', function () {
            var element, pv;
            test_lib_1.beforeEach(function () {
                element = dom_adapter_1.DOM.createElement('div');
                pv = new view_1.ProtoView(test_lib_1.el('<div>hi</div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), new shadow_dom_strategy_1.NativeShadowDomStrategy(null));
            });
            test_lib_1.it('should create the root component when instantiated', function () {
                var rootProtoView = view_1.ProtoView.createRootProtoView(pv, element, someComponentDirective, new change_detection_1.DynamicProtoChangeDetector(null, null), new shadow_dom_strategy_1.NativeShadowDomStrategy(null));
                var view = rootProtoView.instantiate(null, null);
                view.hydrate(new di_2.Injector([]), null, null, null, null);
                test_lib_1.expect(view.rootElementInjectors[0].get(SomeComponent)).not.toBe(null);
            });
            test_lib_1.it('should inject the protoView into the shadowDom', function () {
                var rootProtoView = view_1.ProtoView.createRootProtoView(pv, element, someComponentDirective, new change_detection_1.DynamicProtoChangeDetector(null, null), new shadow_dom_strategy_1.NativeShadowDomStrategy(null));
                var view = rootProtoView.instantiate(null, null);
                view.hydrate(new di_2.Injector([]), null, null, null, null);
                test_lib_1.expect(element.shadowRoot.childNodes[0].childNodes[0].nodeValue).toEqual('hi');
            });
        });
    });
}
exports.main = main;
function readDirectiveBinding(type) {
    var meta = new directive_metadata_reader_1.DirectiveMetadataReader().read(type);
    return element_injector_1.DirectiveBinding.createFromType(type, meta.annotation);
}
var SomeDirective = (function () {
    function SomeDirective() {
        this.prop = 'foo';
    }
    return SomeDirective;
})();
var DirectiveImplementingOnChange = (function () {
    function DirectiveImplementingOnChange() {
    }
    DirectiveImplementingOnChange.prototype.onChange = function (changes) {
        this.c = this.a + this.b;
        this.changes = changes;
    };
    return DirectiveImplementingOnChange;
})();
var DirectiveImplementingOnAllChangesDone = (function () {
    function DirectiveImplementingOnAllChangesDone() {
    }
    DirectiveImplementingOnAllChangesDone.prototype.onAllChangesDone = function () {
        this.onAllChangesDoneCalled = true;
    };
    return DirectiveImplementingOnAllChangesDone;
})();
var SomeService = (function () {
    function SomeService() {
    }
    return SomeService;
})();
var SomeComponent = (function () {
    function SomeComponent(service) {
        this.service = service;
    }
    return SomeComponent;
})();
Object.defineProperty(SomeComponent, "annotations", { get: function () {
        return [new annotations_1.Component({ services: [SomeService] })];
    } });
Object.defineProperty(SomeComponent, "parameters", { get: function () {
        return [[SomeService]];
    } });
var ServiceDependentDecorator = (function () {
    function ServiceDependentDecorator(component, service) {
        this.component = component;
        this.service = service;
    }
    return ServiceDependentDecorator;
})();
Object.defineProperty(ServiceDependentDecorator, "annotations", { get: function () {
        return [new annotations_1.Decorator({ selector: '[dec]' })];
    } });
Object.defineProperty(ServiceDependentDecorator, "parameters", { get: function () {
        return [[SomeComponent], [SomeService]];
    } });
var SomeViewport = (function () {
    function SomeViewport(viewContainer) {
        this.viewContainer = viewContainer;
    }
    return SomeViewport;
})();
Object.defineProperty(SomeViewport, "annotations", { get: function () {
        return [new annotations_1.Viewport({ selector: 'someTmpl' })];
    } });
Object.defineProperty(SomeViewport, "parameters", { get: function () {
        return [[view_container_1.ViewContainer]];
    } });
var AnotherDirective = (function () {
    function AnotherDirective() {
        this.prop = 'anotherFoo';
    }
    return AnotherDirective;
})();
var EventEmitterDirective = (function () {
    function EventEmitterDirective(clicker) {
        this._clicker = clicker;
    }
    EventEmitterDirective.prototype.click = function (eventData) {
        this._clicker(eventData);
    };
    return EventEmitterDirective;
})();
Object.defineProperty(EventEmitterDirective, "parameters", { get: function () {
        return [[Function, new di_1.EventEmitter('click')]];
    } });
var SomeDirectiveWithEventHandler = (function () {
    function SomeDirectiveWithEventHandler() {
        this.event = null;
    }
    SomeDirectiveWithEventHandler.prototype.onEvent = function (event) {
        this.event = event;
    };
    return SomeDirectiveWithEventHandler;
})();
var MyEvaluationContext = (function () {
    function MyEvaluationContext() {
        this.foo = 'bar';
    }
    return MyEvaluationContext;
})();
var TestProtoElementInjector = (function (_super) {
    __extends(TestProtoElementInjector, _super);
    function TestProtoElementInjector(parent, index, bindings, firstBindingIsComponent) {
        if (firstBindingIsComponent === void 0) { firstBindingIsComponent = false; }
        _super.call(this, parent, index, bindings, firstBindingIsComponent);
    }
    TestProtoElementInjector.prototype.instantiate = function (parent, host) {
        this.parentElementInjector = parent;
        this.hostElementInjector = host;
        return _super.prototype.instantiate.call(this, parent, host);
    };
    return TestProtoElementInjector;
})(element_injector_1.ProtoElementInjector);
Object.defineProperty(TestProtoElementInjector, "parameters", { get: function () {
        return [[element_injector_1.ProtoElementInjector], [lang_1.int], [collection_1.List], [assert.type.boolean]];
    } });
Object.defineProperty(TestProtoElementInjector.prototype.instantiate, "parameters", { get: function () {
        return [[element_injector_1.ElementInjector], [element_injector_1.ElementInjector]];
    } });
var FakeVmTurnZone = (function (_super) {
    __extends(FakeVmTurnZone, _super);
    function FakeVmTurnZone() {
        _super.call(this, { enableLongStackTrace: false });
    }
    FakeVmTurnZone.prototype.run = function (fn) {
        fn();
    };
    FakeVmTurnZone.prototype.runOutsideAngular = function (fn) {
        fn();
    };
    return FakeVmTurnZone;
})(vm_turn_zone_1.VmTurnZone);
