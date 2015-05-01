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
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var element_injector_1 = require('angular2/src/core/compiler/element_injector');
var visibility_1 = require('angular2/src/core/annotations/visibility');
var di_1 = require('angular2/src/core/annotations/di');
var annotations_1 = require('angular2/src/core/annotations/annotations');
var di_2 = require('angular2/di');
var view_1 = require('angular2/src/core/compiler/view');
var view_container_1 = require('angular2/src/core/compiler/view_container');
var element_1 = require('angular2/src/core/dom/element');
var light_dom_1 = require('angular2/src/core/compiler/shadow_dom_emulation/light_dom');
var annotations_2 = require('angular2/src/core/annotations/annotations');
var change_detection_1 = require('angular2/change_detection');
var DummyDirective = (function (_super) {
    __extends(DummyDirective, _super);
    function DummyDirective(_a) {
        var lifecycle = (_a === void 0 ? {} : _a).lifecycle;
        _super.call(this, { lifecycle: lifecycle });
    }
    return DummyDirective;
})(annotations_2.Directive);
var DummyView = (function (_super) {
    __extends(DummyView, _super);
    function DummyView() {
        _super.apply(this, arguments);
    }
    DummyView.prototype.noSuchMethod = function (m) {
        _super.prototype.noSuchMethod.call(this, m);
    };
    return DummyView;
})(test_lib_1.SpyObject);
Object.defineProperty(DummyView, "annotations", { get: function () {
        return [new test_lib_1.proxy, new lang_1.IMPLEMENTS(view_1.View)];
    } });
var DummyLightDom = (function (_super) {
    __extends(DummyLightDom, _super);
    function DummyLightDom() {
        _super.apply(this, arguments);
    }
    DummyLightDom.prototype.noSuchMethod = function (m) {
        _super.prototype.noSuchMethod.call(this, m);
    };
    return DummyLightDom;
})(test_lib_1.SpyObject);
Object.defineProperty(DummyLightDom, "annotations", { get: function () {
        return [new test_lib_1.proxy, new lang_1.IMPLEMENTS(light_dom_1.LightDom)];
    } });
var SimpleDirective = (function () {
    function SimpleDirective() {
    }
    return SimpleDirective;
})();
var SomeOtherDirective = (function () {
    function SomeOtherDirective() {
    }
    return SomeOtherDirective;
})();
var NeedsDirective = (function () {
    function NeedsDirective(dependency) {
        this.dependency = dependency;
    }
    return NeedsDirective;
})();
Object.defineProperty(NeedsDirective, "parameters", { get: function () {
        return [[SimpleDirective]];
    } });
var OptionallyNeedsDirective = (function () {
    function OptionallyNeedsDirective(dependency) {
        this.dependency = dependency;
    }
    return OptionallyNeedsDirective;
})();
Object.defineProperty(OptionallyNeedsDirective, "parameters", { get: function () {
        return [[SimpleDirective, new di_2.Optional()]];
    } });
var NeedDirectiveFromParent = (function () {
    function NeedDirectiveFromParent(dependency) {
        this.dependency = dependency;
    }
    return NeedDirectiveFromParent;
})();
Object.defineProperty(NeedDirectiveFromParent, "parameters", { get: function () {
        return [[SimpleDirective, new visibility_1.Parent()]];
    } });
var NeedDirectiveFromAncestor = (function () {
    function NeedDirectiveFromAncestor(dependency) {
        this.dependency = dependency;
    }
    return NeedDirectiveFromAncestor;
})();
Object.defineProperty(NeedDirectiveFromAncestor, "parameters", { get: function () {
        return [[SimpleDirective, new visibility_1.Ancestor()]];
    } });
var NeedsService = (function () {
    function NeedsService(service) {
        this.service = service;
    }
    return NeedsService;
})();
Object.defineProperty(NeedsService, "parameters", { get: function () {
        return [[new di_2.Inject("service")]];
    } });
var NeedsEventEmitter = (function () {
    function NeedsEventEmitter(clickEmitter) {
        this.clickEmitter = clickEmitter;
    }
    NeedsEventEmitter.prototype.click = function () {
        this.clickEmitter(null);
    };
    return NeedsEventEmitter;
})();
Object.defineProperty(NeedsEventEmitter, "parameters", { get: function () {
        return [[Function, new di_1.EventEmitter('click')]];
    } });
var NeedsEventEmitterNoType = (function () {
    function NeedsEventEmitterNoType(clickEmitter) {
        this.clickEmitter = clickEmitter;
    }
    NeedsEventEmitterNoType.prototype.click = function () {
        this.clickEmitter(null);
    };
    return NeedsEventEmitterNoType;
})();
Object.defineProperty(NeedsEventEmitterNoType, "parameters", { get: function () {
        return [[new di_1.EventEmitter('click')]];
    } });
var NeedsPropertySetter = (function () {
    function NeedsPropertySetter(propSetter, roleSetter, classSetter, classWithDashSetter, styleSetter, unitSetter) {
        this.propSetter = propSetter;
        this.roleSetter = roleSetter;
        this.classSetter = classSetter;
        this.classWithDashSetter = classWithDashSetter;
        this.styleSetter = styleSetter;
        this.unitSetter = unitSetter;
    }
    NeedsPropertySetter.prototype.setProp = function (value) {
        this.propSetter(value);
    };
    NeedsPropertySetter.prototype.setRole = function (value) {
        this.roleSetter(value);
    };
    NeedsPropertySetter.prototype.setClass = function (value) {
        this.classSetter(value);
    };
    NeedsPropertySetter.prototype.setStyle = function (value) {
        this.styleSetter(value);
    };
    NeedsPropertySetter.prototype.setStyleWithUnit = function (value) {
        this.unitSetter(value);
    };
    return NeedsPropertySetter;
})();
Object.defineProperty(NeedsPropertySetter, "parameters", { get: function () {
        return [[Function, new di_1.PropertySetter('title')], [Function, new di_1.PropertySetter('attr.role')], [Function, new di_1.PropertySetter('class.active')], [Function, new di_1.PropertySetter('class.foo-bar')], [Function, new di_1.PropertySetter('style.width')], [Function, new di_1.PropertySetter('style.height.px')]];
    } });
var NeedsPropertySetterNoType = (function () {
    function NeedsPropertySetterNoType(propSetter) {
        this.propSetter = propSetter;
    }
    NeedsPropertySetterNoType.prototype.setProp = function (value) {
        this.propSetter(value);
    };
    return NeedsPropertySetterNoType;
})();
Object.defineProperty(NeedsPropertySetterNoType, "parameters", { get: function () {
        return [[new di_1.PropertySetter('title')]];
    } });
var NeedsAttribute = (function () {
    function NeedsAttribute(typeAttribute, titleAttribute, fooAttribute) {
        this.typeAttribute = typeAttribute;
        this.titleAttribute = titleAttribute;
        this.fooAttribute = fooAttribute;
    }
    return NeedsAttribute;
})();
Object.defineProperty(NeedsAttribute, "parameters", { get: function () {
        return [[assert.type.string, new di_1.Attribute('type')], [assert.type.string, new di_1.Attribute('title')], [assert.type.string, new di_1.Attribute('foo')]];
    } });
var NeedsAttributeNoType = (function () {
    function NeedsAttributeNoType(fooAttribute) {
        this.fooAttribute = fooAttribute;
    }
    return NeedsAttributeNoType;
})();
Object.defineProperty(NeedsAttributeNoType, "parameters", { get: function () {
        return [[new di_1.Attribute('foo')]];
    } });
var A_Needs_B = (function () {
    function A_Needs_B(dep) {
    }
    return A_Needs_B;
})();
var B_Needs_A = (function () {
    function B_Needs_A(dep) {
    }
    return B_Needs_A;
})();
var NeedsView = (function () {
    function NeedsView(view) {
        this.view = view;
    }
    return NeedsView;
})();
Object.defineProperty(NeedsView, "parameters", { get: function () {
        return [[new di_2.Inject(view_1.View)]];
    } });
var DirectiveWithDestroy = (function () {
    function DirectiveWithDestroy() {
        this.onDestroyCounter = 0;
    }
    DirectiveWithDestroy.prototype.onDestroy = function () {
        this.onDestroyCounter++;
    };
    return DirectiveWithDestroy;
})();
function main() {
    var defaultPreBuiltObjects = new element_injector_1.PreBuiltObjects(null, null, null, null);
    var appInjector = new di_2.Injector([]);
    function humanize(tree, names) {
        var lookupName = function (item) { return collection_1.ListWrapper.last(collection_1.ListWrapper.find(names, function (pair) { return pair[0] === item; })); };
        if (tree.children.length == 0)
            return lookupName(tree);
        var children = tree.children.map(function (m) { return humanize(m, names); });
        return [lookupName(tree), children];
    }
    Object.defineProperty(humanize, "parameters", { get: function () {
            return [[], [collection_1.List]];
        } });
    function injector(bindings, lightDomAppInjector, shadowDomAppInjector, preBuiltObjects, attributes) {
        if (lightDomAppInjector === void 0) { lightDomAppInjector = null; }
        if (shadowDomAppInjector === void 0) { shadowDomAppInjector = null; }
        if (preBuiltObjects === void 0) { preBuiltObjects = null; }
        if (attributes === void 0) { attributes = null; }
        if (lang_1.isBlank(lightDomAppInjector))
            lightDomAppInjector = appInjector;
        var proto = new element_injector_1.ProtoElementInjector(null, 0, bindings, lang_1.isPresent(shadowDomAppInjector));
        proto.attributes = attributes;
        var inj = proto.instantiate(null, null);
        var preBuilt = lang_1.isPresent(preBuiltObjects) ? preBuiltObjects : defaultPreBuiltObjects;
        inj.instantiateDirectives(lightDomAppInjector, shadowDomAppInjector, preBuilt);
        return inj;
    }
    function parentChildInjectors(parentBindings, childBindings, parentPreBuildObjects) {
        if (parentPreBuildObjects === void 0) { parentPreBuildObjects = null; }
        if (lang_1.isBlank(parentPreBuildObjects))
            parentPreBuildObjects = defaultPreBuiltObjects;
        var inj = new di_2.Injector([]);
        var protoParent = new element_injector_1.ProtoElementInjector(null, 0, parentBindings);
        var parent = protoParent.instantiate(null, null);
        parent.instantiateDirectives(inj, null, parentPreBuildObjects);
        var protoChild = new element_injector_1.ProtoElementInjector(protoParent, 1, childBindings, false, 1);
        var child = protoChild.instantiate(parent, null);
        child.instantiateDirectives(inj, null, defaultPreBuiltObjects);
        return child;
    }
    function hostShadowInjectors(hostBindings, shadowBindings, hostPreBuildObjects) {
        if (hostPreBuildObjects === void 0) { hostPreBuildObjects = null; }
        if (lang_1.isBlank(hostPreBuildObjects))
            hostPreBuildObjects = defaultPreBuiltObjects;
        var inj = new di_2.Injector([]);
        var shadowInj = inj.createChild([]);
        var protoParent = new element_injector_1.ProtoElementInjector(null, 0, hostBindings, true);
        var host = protoParent.instantiate(null, null);
        host.instantiateDirectives(inj, shadowInj, hostPreBuildObjects);
        var protoChild = new element_injector_1.ProtoElementInjector(protoParent, 0, shadowBindings, false, 1);
        var shadow = protoChild.instantiate(null, host);
        shadow.instantiateDirectives(shadowInj, null, null);
        return shadow;
    }
    test_lib_1.describe("ProtoElementInjector", function () {
        test_lib_1.describe("direct parent", function () {
            test_lib_1.it("should return parent proto injector when distance is 1", function () {
                var distance = 1;
                var protoParent = new element_injector_1.ProtoElementInjector(null, 0, []);
                var protoChild = new element_injector_1.ProtoElementInjector(protoParent, 1, [], false, distance);
                test_lib_1.expect(protoChild.directParent()).toEqual(protoParent);
            });
            test_lib_1.it("should return null otherwise", function () {
                var distance = 2;
                var protoParent = new element_injector_1.ProtoElementInjector(null, 0, []);
                var protoChild = new element_injector_1.ProtoElementInjector(protoParent, 1, [], false, distance);
                test_lib_1.expect(protoChild.directParent()).toEqual(null);
            });
            test_lib_1.it("should allow for direct access using getDirectiveBindingAtIndex", function () {
                var binding = element_injector_1.DirectiveBinding.createFromBinding(di_2.bind(SimpleDirective).toClass(SimpleDirective), null);
                var proto = new element_injector_1.ProtoElementInjector(null, 0, [binding]);
                test_lib_1.expect(proto.getDirectiveBindingAtIndex(0)).toBeAnInstanceOf(element_injector_1.DirectiveBinding);
                test_lib_1.expect(function () { return proto.getDirectiveBindingAtIndex(-1); }).toThrowError('Index -1 is out-of-bounds.');
                test_lib_1.expect(function () { return proto.getDirectiveBindingAtIndex(10); }).toThrowError('Index 10 is out-of-bounds.');
            });
        });
    });
    test_lib_1.describe("ElementInjector", function () {
        test_lib_1.describe("instantiate", function () {
            test_lib_1.it("should create an element injector", function () {
                var protoParent = new element_injector_1.ProtoElementInjector(null, 0, []);
                var protoChild1 = new element_injector_1.ProtoElementInjector(protoParent, 1, []);
                var protoChild2 = new element_injector_1.ProtoElementInjector(protoParent, 2, []);
                var p = protoParent.instantiate(null, null);
                var c1 = protoChild1.instantiate(p, null);
                var c2 = protoChild2.instantiate(p, null);
                test_lib_1.expect(humanize(p, [[p, 'parent'], [c1, 'child1'], [c2, 'child2']])).toEqual(["parent", ["child1", "child2"]]);
            });
            test_lib_1.describe("direct parent", function () {
                test_lib_1.it("should return parent injector when distance is 1", function () {
                    var distance = 1;
                    var protoParent = new element_injector_1.ProtoElementInjector(null, 0, []);
                    var protoChild = new element_injector_1.ProtoElementInjector(protoParent, 1, [], false, distance);
                    var p = protoParent.instantiate(null, null);
                    var c = protoChild.instantiate(p, null);
                    test_lib_1.expect(c.directParent()).toEqual(p);
                });
                test_lib_1.it("should return null otherwise", function () {
                    var distance = 2;
                    var protoParent = new element_injector_1.ProtoElementInjector(null, 0, []);
                    var protoChild = new element_injector_1.ProtoElementInjector(protoParent, 1, [], false, distance);
                    var p = protoParent.instantiate(null, null);
                    var c = protoChild.instantiate(p, null);
                    test_lib_1.expect(c.directParent()).toEqual(null);
                });
            });
        });
        test_lib_1.describe("hasBindings", function () {
            test_lib_1.it("should be true when there are bindings", function () {
                var p = new element_injector_1.ProtoElementInjector(null, 0, [SimpleDirective]);
                test_lib_1.expect(p.hasBindings).toBeTruthy();
            });
            test_lib_1.it("should be false otherwise", function () {
                var p = new element_injector_1.ProtoElementInjector(null, 0, []);
                test_lib_1.expect(p.hasBindings).toBeFalsy();
            });
        });
        test_lib_1.describe("hasInstances", function () {
            test_lib_1.it("should be false when no directives are instantiated", function () {
                test_lib_1.expect(injector([]).hasInstances()).toBe(false);
            });
            test_lib_1.it("should be true when directives are instantiated", function () {
                test_lib_1.expect(injector([SimpleDirective]).hasInstances()).toBe(true);
            });
        });
        test_lib_1.describe("instantiateDirectives", function () {
            test_lib_1.it("should instantiate directives that have no dependencies", function () {
                var inj = injector([SimpleDirective]);
                test_lib_1.expect(inj.get(SimpleDirective)).toBeAnInstanceOf(SimpleDirective);
            });
            test_lib_1.it("should instantiate directives that depend on other directives", function () {
                var inj = injector([SimpleDirective, NeedsDirective]);
                var d = inj.get(NeedsDirective);
                test_lib_1.expect(d).toBeAnInstanceOf(NeedsDirective);
                test_lib_1.expect(d.dependency).toBeAnInstanceOf(SimpleDirective);
            });
            test_lib_1.it("should instantiate directives that depend on app services", function () {
                var appInjector = new di_2.Injector([di_2.bind("service").toValue("service")]);
                var inj = injector([NeedsService], appInjector);
                var d = inj.get(NeedsService);
                test_lib_1.expect(d).toBeAnInstanceOf(NeedsService);
                test_lib_1.expect(d.service).toEqual("service");
            });
            test_lib_1.it("should instantiate directives that depend on pre built objects", function () {
                var view = new DummyView();
                var inj = injector([NeedsView], null, null, new element_injector_1.PreBuiltObjects(view, null, null, null));
                test_lib_1.expect(inj.get(NeedsView).view).toBe(view);
            });
            test_lib_1.it("should instantiate directives that depend on the containing component", function () {
                var shadow = hostShadowInjectors([SimpleDirective], [NeedsDirective]);
                var d = shadow.get(NeedsDirective);
                test_lib_1.expect(d).toBeAnInstanceOf(NeedsDirective);
                test_lib_1.expect(d.dependency).toBeAnInstanceOf(SimpleDirective);
            });
            test_lib_1.it("should not instantiate directives that depend on other directives in the containing component's ElementInjector", function () {
                test_lib_1.expect(function () {
                    hostShadowInjectors([SomeOtherDirective, SimpleDirective], [NeedsDirective]);
                }).toThrowError('No provider for SimpleDirective! (NeedsDirective -> SimpleDirective)');
            });
            test_lib_1.it("should instantiate component directives that depend on app services in the shadow app injector", function () {
                var shadowAppInjector = new di_2.Injector([di_2.bind("service").toValue("service")]);
                var inj = injector([NeedsService], null, shadowAppInjector);
                var d = inj.get(NeedsService);
                test_lib_1.expect(d).toBeAnInstanceOf(NeedsService);
                test_lib_1.expect(d.service).toEqual("service");
            });
            test_lib_1.it("should not instantiate other directives that depend on app services in the shadow app injector", function () {
                var shadowAppInjector = new di_2.Injector([di_2.bind("service").toValue("service")]);
                test_lib_1.expect(function () {
                    injector([SomeOtherDirective, NeedsService], null, shadowAppInjector);
                }).toThrowError('No provider for service! (NeedsService -> service)');
            });
            test_lib_1.it("should return app services", function () {
                var appInjector = new di_2.Injector([di_2.bind("service").toValue("service")]);
                var inj = injector([], appInjector);
                test_lib_1.expect(inj.get('service')).toEqual('service');
            });
            test_lib_1.it("should get directives from parent", function () {
                var child = parentChildInjectors([SimpleDirective], [NeedDirectiveFromParent]);
                var d = child.get(NeedDirectiveFromParent);
                test_lib_1.expect(d).toBeAnInstanceOf(NeedDirectiveFromParent);
                test_lib_1.expect(d.dependency).toBeAnInstanceOf(SimpleDirective);
            });
            test_lib_1.it("should not return parent's directives on self", function () {
                test_lib_1.expect(function () {
                    injector([SimpleDirective, NeedDirectiveFromParent]);
                }).toThrowError();
            });
            test_lib_1.it("should get directives from ancestor", function () {
                var child = parentChildInjectors([SimpleDirective], [NeedDirectiveFromAncestor]);
                var d = child.get(NeedDirectiveFromAncestor);
                test_lib_1.expect(d).toBeAnInstanceOf(NeedDirectiveFromAncestor);
                test_lib_1.expect(d.dependency).toBeAnInstanceOf(SimpleDirective);
            });
            test_lib_1.it("should throw when no SimpleDirective found", function () {
                test_lib_1.expect(function () { return injector([NeedDirectiveFromParent]); }).toThrowError('No provider for SimpleDirective! (NeedDirectiveFromParent -> SimpleDirective)');
            });
            test_lib_1.it("should inject null when no directive found", function () {
                var inj = injector([OptionallyNeedsDirective]);
                var d = inj.get(OptionallyNeedsDirective);
                test_lib_1.expect(d.dependency).toEqual(null);
            });
            test_lib_1.it("should accept SimpleDirective bindings instead of SimpleDirective types", function () {
                var inj = injector([element_injector_1.DirectiveBinding.createFromBinding(di_2.bind(SimpleDirective).toClass(SimpleDirective), null)]);
                test_lib_1.expect(inj.get(SimpleDirective)).toBeAnInstanceOf(SimpleDirective);
            });
            test_lib_1.it("should allow for direct access using getDirectiveAtIndex", function () {
                var inj = injector([element_injector_1.DirectiveBinding.createFromBinding(di_2.bind(SimpleDirective).toClass(SimpleDirective), null)]);
                test_lib_1.expect(inj.getDirectiveAtIndex(0)).toBeAnInstanceOf(SimpleDirective);
                test_lib_1.expect(function () { return inj.getDirectiveAtIndex(-1); }).toThrowError('Index -1 is out-of-bounds.');
                test_lib_1.expect(function () { return inj.getDirectiveAtIndex(10); }).toThrowError('Index 10 is out-of-bounds.');
            });
            test_lib_1.it("should handle cyclic dependencies", function () {
                test_lib_1.expect(function () {
                    var bAneedsB = di_2.bind(A_Needs_B).toFactory(function (a) { return new A_Needs_B(a); }, [B_Needs_A]);
                    var bBneedsA = di_2.bind(B_Needs_A).toFactory(function (a) { return new B_Needs_A(a); }, [A_Needs_B]);
                    injector([element_injector_1.DirectiveBinding.createFromBinding(bAneedsB, null), element_injector_1.DirectiveBinding.createFromBinding(bBneedsA, null)]);
                }).toThrowError('Cannot instantiate cyclic dependency! ' + '(A_Needs_B -> B_Needs_A -> A_Needs_B)');
            });
            test_lib_1.it("should call onDestroy on directives subscribed to this event", function () {
                var inj = injector([element_injector_1.DirectiveBinding.createFromType(DirectiveWithDestroy, new DummyDirective({ lifecycle: [annotations_1.onDestroy] }))]);
                var destroy = inj.get(DirectiveWithDestroy);
                inj.clearDirectives();
                test_lib_1.expect(destroy.onDestroyCounter).toBe(1);
            });
        });
        test_lib_1.describe("pre built objects", function () {
            test_lib_1.it("should return view", function () {
                var view = new DummyView();
                var inj = injector([], null, null, new element_injector_1.PreBuiltObjects(view, null, null, null));
                test_lib_1.expect(inj.get(view_1.View)).toEqual(view);
            });
            test_lib_1.it("should return element", function () {
                var element = new element_1.NgElement(null);
                var inj = injector([], null, null, new element_injector_1.PreBuiltObjects(null, element, null, null));
                test_lib_1.expect(inj.get(element_1.NgElement)).toEqual(element);
            });
            test_lib_1.it('should return viewContainer', function () {
                var viewContainer = new view_container_1.ViewContainer(null, null, null, null, null);
                var inj = injector([], null, null, new element_injector_1.PreBuiltObjects(null, null, viewContainer, null));
                test_lib_1.expect(inj.get(view_container_1.ViewContainer)).toEqual(viewContainer);
            });
            test_lib_1.it('should return bindingPropagationConfig', function () {
                var config = new change_detection_1.BindingPropagationConfig(null);
                var inj = injector([], null, null, new element_injector_1.PreBuiltObjects(null, null, null, config));
                test_lib_1.expect(inj.get(change_detection_1.BindingPropagationConfig)).toEqual(config);
            });
        });
        test_lib_1.describe("createPrivateComponent", function () {
            test_lib_1.it("should create a private component", function () {
                var inj = injector([]);
                inj.createPrivateComponent(SimpleDirective, null);
                test_lib_1.expect(inj.getPrivateComponent()).toBeAnInstanceOf(SimpleDirective);
            });
            test_lib_1.it("should inject parent dependencies into the private component", function () {
                var inj = parentChildInjectors([SimpleDirective], []);
                inj.createPrivateComponent(NeedDirectiveFromAncestor, null);
                test_lib_1.expect(inj.getPrivateComponent()).toBeAnInstanceOf(NeedDirectiveFromAncestor);
                test_lib_1.expect(inj.getPrivateComponent().dependency).toBeAnInstanceOf(SimpleDirective);
            });
            test_lib_1.it("should not inject the proxy component into the children of the private component", function () {
                var injWithPrivateComponent = injector([SimpleDirective]);
                injWithPrivateComponent.createPrivateComponent(SomeOtherDirective, null);
                var shadowDomProtoInjector = new element_injector_1.ProtoElementInjector(null, 0, [NeedDirectiveFromAncestor], false);
                var shadowDomInj = shadowDomProtoInjector.instantiate(null, injWithPrivateComponent);
                test_lib_1.expect(function () { return shadowDomInj.instantiateDirectives(appInjector, null, defaultPreBuiltObjects); }).toThrowError(new RegExp("No provider for SimpleDirective"));
            });
            test_lib_1.it("should inject the private component into the children of the private component", function () {
                var injWithPrivateComponent = injector([]);
                injWithPrivateComponent.createPrivateComponent(SimpleDirective, null);
                var shadowDomProtoInjector = new element_injector_1.ProtoElementInjector(null, 0, [NeedDirectiveFromAncestor], false);
                var shadowDomInjector = shadowDomProtoInjector.instantiate(null, injWithPrivateComponent);
                shadowDomInjector.instantiateDirectives(appInjector, null, defaultPreBuiltObjects);
                test_lib_1.expect(shadowDomInjector.get(NeedDirectiveFromAncestor)).toBeAnInstanceOf(NeedDirectiveFromAncestor);
                test_lib_1.expect(shadowDomInjector.get(NeedDirectiveFromAncestor).dependency).toBeAnInstanceOf(SimpleDirective);
            });
            test_lib_1.it("should support rehydrating the private component", function () {
                var inj = injector([]);
                inj.createPrivateComponent(DirectiveWithDestroy, new DummyDirective({ lifecycle: [annotations_1.onDestroy] }));
                var dir = inj.getPrivateComponent();
                inj.clearDirectives();
                test_lib_1.expect(inj.getPrivateComponent()).toBe(null);
                test_lib_1.expect(dir.onDestroyCounter).toBe(1);
                inj.instantiateDirectives(null, null, null);
                test_lib_1.expect(inj.getPrivateComponent()).not.toBe(null);
            });
        });
        test_lib_1.describe('event emitters', function () {
            function createpreBuildObject(eventName, eventHandler) {
                var handlers = collection_1.StringMapWrapper.create();
                collection_1.StringMapWrapper.set(handlers, eventName, eventHandler);
                var pv = new view_1.ProtoView(null, null, null);
                pv.eventHandlers = [handlers];
                var view = new view_1.View(pv, null, collection_1.MapWrapper.create());
                return new element_injector_1.PreBuiltObjects(view, null, null, null);
            }
            test_lib_1.it('should be injectable and callable', function () {
                var called = false;
                var preBuildObject = createpreBuildObject('click', function (e, view) {
                    called = true;
                });
                var inj = injector([NeedsEventEmitter], null, null, preBuildObject);
                inj.get(NeedsEventEmitter).click();
                test_lib_1.expect(called).toEqual(true);
            });
            test_lib_1.it('should be injectable and callable without specifying param type annotation', function () {
                var called = false;
                var preBuildObject = createpreBuildObject('click', function (e, view) {
                    called = true;
                });
                var inj = injector([NeedsEventEmitterNoType], null, null, preBuildObject);
                inj.get(NeedsEventEmitterNoType).click();
                test_lib_1.expect(called).toEqual(true);
            });
            test_lib_1.it('should be queryable through hasEventEmitter', function () {
                var inj = injector([NeedsEventEmitter]);
                test_lib_1.expect(inj.hasEventEmitter('click')).toBe(true);
                test_lib_1.expect(inj.hasEventEmitter('move')).toBe(false);
            });
            test_lib_1.it('should be queryable through hasEventEmitter without specifying param type annotation', function () {
                var inj = injector([NeedsEventEmitterNoType]);
                test_lib_1.expect(inj.hasEventEmitter('click')).toBe(true);
                test_lib_1.expect(inj.hasEventEmitter('move')).toBe(false);
            });
        });
        test_lib_1.describe('property setter', function () {
            test_lib_1.it('should be injectable and callable', function () {
                var div = test_lib_1.el('<div></div>');
                var ngElement = new element_1.NgElement(div);
                var preBuildObject = new element_injector_1.PreBuiltObjects(null, ngElement, null, null);
                var inj = injector([NeedsPropertySetter], null, null, preBuildObject);
                var component = inj.get(NeedsPropertySetter);
                component.setProp('foobar');
                component.setRole('button');
                component.setClass(true);
                component.classWithDashSetter(true);
                component.setStyle('40px');
                component.setStyleWithUnit(50);
                test_lib_1.expect(div.title).toEqual('foobar');
                test_lib_1.expect(dom_adapter_1.DOM.getAttribute(div, 'role')).toEqual('button');
                test_lib_1.expect(dom_adapter_1.DOM.hasClass(div, 'active')).toEqual(true);
                test_lib_1.expect(dom_adapter_1.DOM.hasClass(div, 'foo-bar')).toEqual(true);
                test_lib_1.expect(dom_adapter_1.DOM.getStyle(div, 'width')).toEqual('40px');
                test_lib_1.expect(dom_adapter_1.DOM.getStyle(div, 'height')).toEqual('50px');
            });
            test_lib_1.it('should be injectable and callable without specifying param type annotation', function () {
                var div = test_lib_1.el('<div></div>');
                var preBuildObject = new element_injector_1.PreBuiltObjects(null, new element_1.NgElement(div), null, null);
                var inj = injector([NeedsPropertySetterNoType], null, null, preBuildObject);
                var component = inj.get(NeedsPropertySetterNoType);
                component.setProp('foobar');
                test_lib_1.expect(div.title).toEqual('foobar');
            });
        });
        test_lib_1.describe('static attributes', function () {
            test_lib_1.it('should be injectable', function () {
                var attributes = collection_1.MapWrapper.create();
                collection_1.MapWrapper.set(attributes, 'type', 'text');
                collection_1.MapWrapper.set(attributes, 'title', '');
                var inj = injector([NeedsAttribute], null, null, null, attributes);
                var needsAttribute = inj.get(NeedsAttribute);
                test_lib_1.expect(needsAttribute.typeAttribute).toEqual('text');
                test_lib_1.expect(needsAttribute.titleAttribute).toEqual('');
                test_lib_1.expect(needsAttribute.fooAttribute).toEqual(null);
            });
            test_lib_1.it('should be injectable without type annotation', function () {
                var attributes = collection_1.MapWrapper.create();
                collection_1.MapWrapper.set(attributes, 'foo', 'bar');
                var inj = injector([NeedsAttributeNoType], null, null, null, attributes);
                var needsAttribute = inj.get(NeedsAttributeNoType);
                test_lib_1.expect(needsAttribute.fooAttribute).toEqual('bar');
            });
        });
    });
}
exports.main = main;
