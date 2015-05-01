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
var view_container_1 = require('angular2/src/core/compiler/view_container');
var lang_1 = require('angular2/src/facade/lang');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var collection_1 = require('angular2/src/facade/collection');
var di_1 = require('angular2/di');
var element_injector_1 = require('angular2/src/core/compiler/element_injector');
var shadow_dom_strategy_1 = require('angular2/src/core/compiler/shadow_dom_strategy');
var change_detection_1 = require('angular2/change_detection');
function createView(nodes) {
    var view = new view_1.View(null, nodes, collection_1.MapWrapper.create());
    var cd = new change_detection_1.DynamicProtoChangeDetector(null, null).instantiate(view, [], null, []);
    view.init(cd, [], [], [], [], [], [], [], [], []);
    return view;
}
var AttachableChangeDetector = (function () {
    function AttachableChangeDetector() {
    }
    AttachableChangeDetector.prototype.remove = function () {
        this.parent = null;
    };
    AttachableChangeDetector.prototype.noSuchMethod = function (i) {
        _super.noSuchMethod.call(this, i);
    };
    return AttachableChangeDetector;
})();
Object.defineProperty(AttachableChangeDetector, "annotations", { get: function () {
        return [new test_lib_1.proxy, new lang_1.IMPLEMENTS(change_detection_1.ChangeDetector)];
    } });
var HydrateAwareFakeView = (function () {
    function HydrateAwareFakeView(isHydrated) {
        this.isHydrated = isHydrated;
        this.nodes = [dom_adapter_1.DOM.createElement('div')];
        this.rootElementInjectors = [];
        this.changeDetector = new AttachableChangeDetector();
    }
    HydrateAwareFakeView.prototype.hydrated = function () {
        return this.isHydrated;
    };
    HydrateAwareFakeView.prototype.hydrate = function (_, __, ___, ____, _____) {
        this.isHydrated = true;
    };
    HydrateAwareFakeView.prototype.dehydrate = function () {
        this.isHydrated = false;
    };
    HydrateAwareFakeView.prototype.noSuchMethod = function (i) {
        _super.noSuchMethod.call(this, i);
    };
    return HydrateAwareFakeView;
})();
Object.defineProperty(HydrateAwareFakeView, "annotations", { get: function () {
        return [new test_lib_1.proxy, new lang_1.IMPLEMENTS(view_1.View)];
    } });
function main() {
    test_lib_1.describe('ViewContainer', function () {
        var viewContainer, parentView, protoView, dom, customViewWithOneNode, customViewWithTwoNodes, elementInjector;
        test_lib_1.beforeEach(function () {
            dom = test_lib_1.el("<div><stuff></stuff><div insert-after-me></div><stuff></stuff></div>");
            var insertionElement = dom.childNodes[1];
            parentView = createView([dom.childNodes[0]]);
            protoView = new view_1.ProtoView(test_lib_1.el('<div>hi</div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), new shadow_dom_strategy_1.NativeShadowDomStrategy(null));
            elementInjector = new element_injector_1.ElementInjector(null, null, null);
            viewContainer = new view_container_1.ViewContainer(parentView, insertionElement, protoView, elementInjector, null);
            customViewWithOneNode = createView([test_lib_1.el('<div>single</div>')]);
            customViewWithTwoNodes = createView([test_lib_1.el('<div>one</div>'), test_lib_1.el('<div>two</div>')]);
        });
        test_lib_1.describe('when dehydrated', function () {
            test_lib_1.it('should throw if create is called', function () {
                test_lib_1.expect(function () { return viewContainer.create(); }).toThrowError();
            });
        });
        test_lib_1.describe('when hydrated', function () {
            function textInViewContainer() {
                var out = '';
                for (var i = 2; i < dom.childNodes.length - 1; i++) {
                    if (i != 2)
                        out += ' ';
                    out += dom_adapter_1.DOM.getInnerHTML(dom.childNodes[i]);
                }
                return out;
            }
            test_lib_1.beforeEach(function () {
                viewContainer.hydrate(new di_1.Injector([]), null, null);
                var fillerView = createView([test_lib_1.el('<filler>filler</filler>')]);
                viewContainer.insert(fillerView);
            });
            test_lib_1.it('should create new views from protoView', function () {
                viewContainer.create();
                test_lib_1.expect(textInViewContainer()).toEqual('filler hi');
                test_lib_1.expect(viewContainer.length).toBe(2);
            });
            test_lib_1.it('should create new views from protoView at index', function () {
                viewContainer.create(0);
                test_lib_1.expect(textInViewContainer()).toEqual('hi filler');
                test_lib_1.expect(viewContainer.length).toBe(2);
            });
            test_lib_1.it('should insert new views at the end by default', function () {
                viewContainer.insert(customViewWithOneNode);
                test_lib_1.expect(textInViewContainer()).toEqual('filler single');
                test_lib_1.expect(viewContainer.get(1)).toBe(customViewWithOneNode);
                test_lib_1.expect(viewContainer.length).toBe(2);
            });
            test_lib_1.it('should insert new views at the given index', function () {
                viewContainer.insert(customViewWithOneNode, 0);
                test_lib_1.expect(textInViewContainer()).toEqual('single filler');
                test_lib_1.expect(viewContainer.get(0)).toBe(customViewWithOneNode);
                test_lib_1.expect(viewContainer.length).toBe(2);
            });
            test_lib_1.it('should remove the last view by default', function () {
                viewContainer.insert(customViewWithOneNode);
                viewContainer.remove();
                test_lib_1.expect(textInViewContainer()).toEqual('filler');
                test_lib_1.expect(viewContainer.length).toBe(1);
            });
            test_lib_1.it('should remove the view at a given index', function () {
                viewContainer.insert(customViewWithOneNode);
                viewContainer.insert(customViewWithTwoNodes);
                viewContainer.remove(1);
                test_lib_1.expect(textInViewContainer()).toEqual('filler one two');
                test_lib_1.expect(viewContainer.get(1)).toBe(customViewWithTwoNodes);
                test_lib_1.expect(viewContainer.length).toBe(2);
            });
            test_lib_1.it('should detach the last view by default', function () {
                viewContainer.insert(customViewWithOneNode);
                test_lib_1.expect(viewContainer.length).toBe(2);
                var detachedView = viewContainer.detach();
                test_lib_1.expect(detachedView).toBe(customViewWithOneNode);
                test_lib_1.expect(textInViewContainer()).toEqual('filler');
                test_lib_1.expect(viewContainer.length).toBe(1);
            });
            test_lib_1.it('should detach the view at a given index', function () {
                viewContainer.insert(customViewWithOneNode);
                viewContainer.insert(customViewWithTwoNodes);
                test_lib_1.expect(viewContainer.length).toBe(3);
                var detachedView = viewContainer.detach(1);
                test_lib_1.expect(detachedView).toBe(customViewWithOneNode);
                test_lib_1.expect(textInViewContainer()).toEqual('filler one two');
                test_lib_1.expect(viewContainer.length).toBe(2);
            });
            test_lib_1.it('should keep views hydration state during insert', function () {
                var hydratedView = new HydrateAwareFakeView(true);
                var dehydratedView = new HydrateAwareFakeView(false);
                viewContainer.insert(hydratedView);
                viewContainer.insert(dehydratedView);
                test_lib_1.expect(hydratedView.hydrated()).toBe(true);
                test_lib_1.expect(dehydratedView.hydrated()).toBe(false);
            });
            test_lib_1.it('should dehydrate on remove', function () {
                var hydratedView = new HydrateAwareFakeView(true);
                viewContainer.insert(hydratedView);
                viewContainer.remove();
                test_lib_1.expect(hydratedView.hydrated()).toBe(false);
            });
            test_lib_1.it('should keep views hydration state during detach', function () {
                var hydratedView = new HydrateAwareFakeView(true);
                var dehydratedView = new HydrateAwareFakeView(false);
                viewContainer.insert(hydratedView);
                viewContainer.insert(dehydratedView);
                test_lib_1.expect(viewContainer.detach().hydrated()).toBe(false);
                test_lib_1.expect(viewContainer.detach().hydrated()).toBe(true);
            });
            test_lib_1.it('should support adding/removing views with more than one node', function () {
                viewContainer.insert(customViewWithTwoNodes);
                viewContainer.insert(customViewWithOneNode);
                test_lib_1.expect(textInViewContainer()).toEqual('filler one two single');
                viewContainer.remove(1);
                test_lib_1.expect(textInViewContainer()).toEqual('filler single');
            });
        });
        test_lib_1.describe('should update injectors and parent views.', function () {
            var fancyView;
            test_lib_1.beforeEach(function () {
                var parser = new change_detection_1.Parser(new change_detection_1.Lexer());
                viewContainer.hydrate(new di_1.Injector([]), null, null);
                var pv = new view_1.ProtoView(test_lib_1.el('<div class="ng-binding">{{}}</div>'), new change_detection_1.DynamicProtoChangeDetector(null, null), new shadow_dom_strategy_1.NativeShadowDomStrategy(null));
                pv.bindElement(null, 0, new element_injector_1.ProtoElementInjector(null, 1, [SomeDirective]));
                pv.bindTextNode(0, parser.parseBinding('foo', null));
                fancyView = pv.instantiate(null, null);
            });
            test_lib_1.it('hydrating should update rootElementInjectors and parent change detector', function () {
                viewContainer.insert(fancyView);
                collection_1.ListWrapper.forEach(fancyView.rootElementInjectors, function (inj) { return test_lib_1.expect(inj.parent).toBe(elementInjector); });
                test_lib_1.expect(parentView.changeDetector.lightDomChildren.length).toBe(1);
            });
            test_lib_1.it('dehydrating should update rootElementInjectors and parent change detector', function () {
                viewContainer.insert(fancyView);
                viewContainer.remove();
                collection_1.ListWrapper.forEach(fancyView.rootElementInjectors, function (inj) { return test_lib_1.expect(inj.parent).toBe(null); });
                test_lib_1.expect(parentView.changeDetector.lightDomChildren.length).toBe(0);
                test_lib_1.expect(viewContainer.length).toBe(0);
            });
        });
    });
}
exports.main = main;
var SomeDirective = (function () {
    function SomeDirective() {
        this.prop = 'foo';
    }
    return SomeDirective;
})();
