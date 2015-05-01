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
var lang_1 = require('angular2/src/facade/lang');
var math_1 = require('angular2/src/facade/math');
var collection_1 = require('angular2/src/facade/collection');
var di_1 = require('angular2/di');
var visibility_1 = require('angular2/src/core/annotations/visibility');
var di_2 = require('angular2/src/core/annotations/di');
var viewModule = require('angular2/src/core/compiler/view');
var view_container_1 = require('angular2/src/core/compiler/view_container');
var element_1 = require('angular2/src/core/dom/element');
var annotations_1 = require('angular2/src/core/annotations/annotations');
var change_detection_1 = require('angular2/change_detection');
var pclModule = require('angular2/src/core/compiler/private_component_location');
var property_setter_factory_1 = require('angular2/src/render/dom/view/property_setter_factory');
var _MAX_DIRECTIVE_CONSTRUCTION_COUNTER = 10;
var MAX_DEPTH = math_1.Math.pow(2, 30) - 1;
var _undefined = new Object();
var _staticKeys;
var StaticKeys = (function () {
    function StaticKeys() {
        this.viewId = di_1.Key.get(viewModule.View).id;
        this.ngElementId = di_1.Key.get(element_1.NgElement).id;
        this.viewContainerId = di_1.Key.get(view_container_1.ViewContainer).id;
        this.bindingPropagationConfigId = di_1.Key.get(change_detection_1.BindingPropagationConfig).id;
        this.privateComponentLocationId = di_1.Key.get(pclModule.PrivateComponentLocation).id;
    }
    StaticKeys.instance = function () {
        if (lang_1.isBlank(_staticKeys))
            _staticKeys = new StaticKeys();
        return _staticKeys;
    };
    return StaticKeys;
})();
var TreeNode = (function () {
    function TreeNode(parent) {
        this._parent = parent;
        this._head = null;
        this._tail = null;
        this._next = null;
        if (lang_1.isPresent(parent))
            parent._addChild(this);
    }
    TreeNode.prototype._addChild = function (child) {
        if (lang_1.isPresent(this._tail)) {
            this._tail._next = child;
            this._tail = child;
        }
        else {
            this._tail = this._head = child;
        }
    };
    Object.defineProperty(TreeNode.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        set: function (node) {
            this._parent = node;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "children", {
        get: function () {
            var res = [];
            var child = this._head;
            while (child != null) {
                collection_1.ListWrapper.push(res, child);
                child = child._next;
            }
            return res;
        },
        enumerable: true,
        configurable: true
    });
    return TreeNode;
})();
Object.defineProperty(TreeNode, "parameters", { get: function () {
        return [[TreeNode]];
    } });
Object.defineProperty(TreeNode.prototype._addChild, "parameters", { get: function () {
        return [[TreeNode]];
    } });
Object.defineProperty(Object.getOwnPropertyDescriptor(TreeNode.prototype, "parent").set, "parameters", { get: function () {
        return [[TreeNode]];
    } });
var DirectiveDependency = (function (_super) {
    __extends(DirectiveDependency, _super);
    function DirectiveDependency(key, asPromise, lazy, optional, properties, depth, eventEmitterName, propSetterName, attributeName) {
        _super.call(this, key, asPromise, lazy, optional, properties);
        this.depth = depth;
        this.eventEmitterName = eventEmitterName;
        this.propSetterName = propSetterName;
        this.attributeName = attributeName;
    }
    DirectiveDependency.createFrom = function (d) {
        var depth = 0;
        var eventName = null;
        var propName = null;
        var attributeName = null;
        var properties = d.properties;
        for (var i = 0; i < properties.length; i++) {
            var property = properties[i];
            if (property instanceof visibility_1.Parent) {
                depth = 1;
            }
            else if (property instanceof visibility_1.Ancestor) {
                depth = MAX_DEPTH;
            }
            else if (property instanceof di_2.EventEmitter) {
                eventName = property.eventName;
            }
            else if (property instanceof di_2.PropertySetter) {
                propName = property.propName;
            }
            else if (property instanceof di_2.Attribute) {
                attributeName = property.attributeName;
            }
        }
        return new DirectiveDependency(d.key, d.asPromise, d.lazy, d.optional, d.properties, depth, eventName, propName, attributeName);
    };
    return DirectiveDependency;
})(di_1.Dependency);
exports.DirectiveDependency = DirectiveDependency;
Object.defineProperty(DirectiveDependency, "parameters", { get: function () {
        return [[di_1.Key], [assert.type.boolean], [assert.type.boolean], [assert.type.boolean], [collection_1.List], [lang_1.int], [assert.type.string], [assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(DirectiveDependency.createFrom, "parameters", { get: function () {
        return [[di_1.Dependency]];
    } });
var DirectiveBinding = (function (_super) {
    __extends(DirectiveBinding, _super);
    function DirectiveBinding(key, factory, dependencies, providedAsPromise, annotation) {
        _super.call(this, key, factory, dependencies, providedAsPromise);
        this.callOnDestroy = lang_1.isPresent(annotation) && annotation.hasLifecycleHook(annotations_1.onDestroy);
        this.callOnChange = lang_1.isPresent(annotation) && annotation.hasLifecycleHook(annotations_1.onChange);
        this.callOnAllChangesDone = lang_1.isPresent(annotation) && annotation.hasLifecycleHook(annotations_1.onAllChangesDone);
        this.annotation = annotation;
    }
    DirectiveBinding.createFromBinding = function (b, annotation) {
        var deps = collection_1.ListWrapper.map(b.dependencies, DirectiveDependency.createFrom);
        return new DirectiveBinding(b.key, b.factory, deps, b.providedAsPromise, annotation);
    };
    DirectiveBinding.createFromType = function (type, annotation) {
        var binding = di_1.bind(type).toClass(type);
        return DirectiveBinding.createFromBinding(binding, annotation);
    };
    DirectiveBinding._hasEventEmitter = function (eventName, binding) {
        return collection_1.ListWrapper.any(binding.dependencies, function (d) { return (d.eventEmitterName == eventName); });
    };
    return DirectiveBinding;
})(di_1.Binding);
exports.DirectiveBinding = DirectiveBinding;
Object.defineProperty(DirectiveBinding, "parameters", { get: function () {
        return [[di_1.Key], [Function], [collection_1.List], [assert.type.boolean], [annotations_1.Directive]];
    } });
Object.defineProperty(DirectiveBinding.createFromBinding, "parameters", { get: function () {
        return [[di_1.Binding], [annotations_1.Directive]];
    } });
Object.defineProperty(DirectiveBinding.createFromType, "parameters", { get: function () {
        return [[lang_1.Type], [annotations_1.Directive]];
    } });
Object.defineProperty(DirectiveBinding._hasEventEmitter, "parameters", { get: function () {
        return [[assert.type.string], [DirectiveBinding]];
    } });
var PreBuiltObjects = (function () {
    function PreBuiltObjects(view, element, viewContainer, bindingPropagationConfig) {
        this.view = view;
        this.element = element;
        this.viewContainer = viewContainer;
        this.bindingPropagationConfig = bindingPropagationConfig;
    }
    return PreBuiltObjects;
})();
exports.PreBuiltObjects = PreBuiltObjects;
Object.defineProperty(PreBuiltObjects, "parameters", { get: function () {
        return [[], [element_1.NgElement], [view_container_1.ViewContainer], [change_detection_1.BindingPropagationConfig]];
    } });
var ProtoElementInjector = (function () {
    function ProtoElementInjector(parent, index, bindings, firstBindingIsComponent, distanceToParent) {
        if (firstBindingIsComponent === void 0) { firstBindingIsComponent = false; }
        if (distanceToParent === void 0) { distanceToParent = 0; }
        this.parent = parent;
        this.index = index;
        this.distanceToParent = distanceToParent;
        this.exportComponent = false;
        this.exportElement = false;
        this._binding0IsComponent = firstBindingIsComponent;
        this._binding0 = null;
        this._keyId0 = null;
        this._binding1 = null;
        this._keyId1 = null;
        this._binding2 = null;
        this._keyId2 = null;
        this._binding3 = null;
        this._keyId3 = null;
        this._binding4 = null;
        this._keyId4 = null;
        this._binding5 = null;
        this._keyId5 = null;
        this._binding6 = null;
        this._keyId6 = null;
        this._binding7 = null;
        this._keyId7 = null;
        this._binding8 = null;
        this._keyId8 = null;
        this._binding9 = null;
        this._keyId9 = null;
        this.numberOfDirectives = bindings.length;
        var length = bindings.length;
        if (length > 0) {
            this._binding0 = this._createBinding(bindings[0]);
            this._keyId0 = this._binding0.key.id;
        }
        if (length > 1) {
            this._binding1 = this._createBinding(bindings[1]);
            this._keyId1 = this._binding1.key.id;
        }
        if (length > 2) {
            this._binding2 = this._createBinding(bindings[2]);
            this._keyId2 = this._binding2.key.id;
        }
        if (length > 3) {
            this._binding3 = this._createBinding(bindings[3]);
            this._keyId3 = this._binding3.key.id;
        }
        if (length > 4) {
            this._binding4 = this._createBinding(bindings[4]);
            this._keyId4 = this._binding4.key.id;
        }
        if (length > 5) {
            this._binding5 = this._createBinding(bindings[5]);
            this._keyId5 = this._binding5.key.id;
        }
        if (length > 6) {
            this._binding6 = this._createBinding(bindings[6]);
            this._keyId6 = this._binding6.key.id;
        }
        if (length > 7) {
            this._binding7 = this._createBinding(bindings[7]);
            this._keyId7 = this._binding7.key.id;
        }
        if (length > 8) {
            this._binding8 = this._createBinding(bindings[8]);
            this._keyId8 = this._binding8.key.id;
        }
        if (length > 9) {
            this._binding9 = this._createBinding(bindings[9]);
            this._keyId9 = this._binding9.key.id;
        }
        if (length > 10) {
            throw 'Maximum number of directives per element has been reached.';
        }
    }
    ProtoElementInjector.prototype.instantiate = function (parent, host) {
        return new ElementInjector(this, parent, host);
    };
    ProtoElementInjector.prototype.directParent = function () {
        return this.distanceToParent < 2 ? this.parent : null;
    };
    ProtoElementInjector.prototype._createBinding = function (bindingOrType) {
        if (bindingOrType instanceof DirectiveBinding) {
            return bindingOrType;
        }
        else {
            var b = di_1.bind(bindingOrType).toClass(bindingOrType);
            return DirectiveBinding.createFromBinding(b, null);
        }
    };
    Object.defineProperty(ProtoElementInjector.prototype, "hasBindings", {
        get: function () {
            return lang_1.isPresent(this._binding0);
        },
        enumerable: true,
        configurable: true
    });
    ProtoElementInjector.prototype.getDirectiveBindingAtIndex = function (index) {
        if (index == 0)
            return this._binding0;
        if (index == 1)
            return this._binding1;
        if (index == 2)
            return this._binding2;
        if (index == 3)
            return this._binding3;
        if (index == 4)
            return this._binding4;
        if (index == 5)
            return this._binding5;
        if (index == 6)
            return this._binding6;
        if (index == 7)
            return this._binding7;
        if (index == 8)
            return this._binding8;
        if (index == 9)
            return this._binding9;
        throw new OutOfBoundsAccess(index);
    };
    ProtoElementInjector.prototype.hasEventEmitter = function (eventName) {
        var p = this;
        if (lang_1.isPresent(p._binding0) && DirectiveBinding._hasEventEmitter(eventName, p._binding0))
            return true;
        if (lang_1.isPresent(p._binding1) && DirectiveBinding._hasEventEmitter(eventName, p._binding1))
            return true;
        if (lang_1.isPresent(p._binding2) && DirectiveBinding._hasEventEmitter(eventName, p._binding2))
            return true;
        if (lang_1.isPresent(p._binding3) && DirectiveBinding._hasEventEmitter(eventName, p._binding3))
            return true;
        if (lang_1.isPresent(p._binding4) && DirectiveBinding._hasEventEmitter(eventName, p._binding4))
            return true;
        if (lang_1.isPresent(p._binding5) && DirectiveBinding._hasEventEmitter(eventName, p._binding5))
            return true;
        if (lang_1.isPresent(p._binding6) && DirectiveBinding._hasEventEmitter(eventName, p._binding6))
            return true;
        if (lang_1.isPresent(p._binding7) && DirectiveBinding._hasEventEmitter(eventName, p._binding7))
            return true;
        if (lang_1.isPresent(p._binding8) && DirectiveBinding._hasEventEmitter(eventName, p._binding8))
            return true;
        if (lang_1.isPresent(p._binding9) && DirectiveBinding._hasEventEmitter(eventName, p._binding9))
            return true;
        return false;
    };
    return ProtoElementInjector;
})();
exports.ProtoElementInjector = ProtoElementInjector;
Object.defineProperty(ProtoElementInjector, "parameters", { get: function () {
        return [[ProtoElementInjector], [lang_1.int], [collection_1.List], [assert.type.boolean], [assert.type.number]];
    } });
Object.defineProperty(ProtoElementInjector.prototype.instantiate, "parameters", { get: function () {
        return [[ElementInjector], [ElementInjector]];
    } });
Object.defineProperty(ProtoElementInjector.prototype.getDirectiveBindingAtIndex, "parameters", { get: function () {
        return [[lang_1.int]];
    } });
Object.defineProperty(ProtoElementInjector.prototype.hasEventEmitter, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
var ElementInjector = (function (_super) {
    __extends(ElementInjector, _super);
    function ElementInjector(proto, parent, host) {
        _super.call(this, parent);
        if (lang_1.isPresent(parent) && lang_1.isPresent(host)) {
            throw new lang_1.BaseException('Only either parent or host is allowed');
        }
        this._host = null;
        if (lang_1.isPresent(parent)) {
            this._host = parent._host;
        }
        else {
            this._host = host;
        }
        this._proto = proto;
        this._preBuiltObjects = null;
        this._lightDomAppInjector = null;
        this._shadowDomAppInjector = null;
        this._obj0 = null;
        this._obj1 = null;
        this._obj2 = null;
        this._obj3 = null;
        this._obj4 = null;
        this._obj5 = null;
        this._obj6 = null;
        this._obj7 = null;
        this._obj8 = null;
        this._obj9 = null;
        this._constructionCounter = 0;
    }
    ElementInjector.prototype.clearDirectives = function () {
        this._preBuiltObjects = null;
        this._lightDomAppInjector = null;
        this._shadowDomAppInjector = null;
        var p = this._proto;
        if (lang_1.isPresent(p._binding0) && p._binding0.callOnDestroy) {
            this._obj0.onDestroy();
        }
        if (lang_1.isPresent(p._binding1) && p._binding1.callOnDestroy) {
            this._obj1.onDestroy();
        }
        if (lang_1.isPresent(p._binding2) && p._binding2.callOnDestroy) {
            this._obj2.onDestroy();
        }
        if (lang_1.isPresent(p._binding3) && p._binding3.callOnDestroy) {
            this._obj3.onDestroy();
        }
        if (lang_1.isPresent(p._binding4) && p._binding4.callOnDestroy) {
            this._obj4.onDestroy();
        }
        if (lang_1.isPresent(p._binding5) && p._binding5.callOnDestroy) {
            this._obj5.onDestroy();
        }
        if (lang_1.isPresent(p._binding6) && p._binding6.callOnDestroy) {
            this._obj6.onDestroy();
        }
        if (lang_1.isPresent(p._binding7) && p._binding7.callOnDestroy) {
            this._obj7.onDestroy();
        }
        if (lang_1.isPresent(p._binding8) && p._binding8.callOnDestroy) {
            this._obj8.onDestroy();
        }
        if (lang_1.isPresent(p._binding9) && p._binding9.callOnDestroy) {
            this._obj9.onDestroy();
        }
        if (lang_1.isPresent(this._privateComponentBinding) && this._privateComponentBinding.callOnDestroy) {
            this._privateComponent.onDestroy();
        }
        this._obj0 = null;
        this._obj1 = null;
        this._obj2 = null;
        this._obj3 = null;
        this._obj4 = null;
        this._obj5 = null;
        this._obj6 = null;
        this._obj7 = null;
        this._obj8 = null;
        this._obj9 = null;
        this._privateComponent = null;
        this._constructionCounter = 0;
    };
    ElementInjector.prototype.instantiateDirectives = function (lightDomAppInjector, shadowDomAppInjector, preBuiltObjects) {
        this._checkShadowDomAppInjector(shadowDomAppInjector);
        this._preBuiltObjects = preBuiltObjects;
        this._lightDomAppInjector = lightDomAppInjector;
        this._shadowDomAppInjector = shadowDomAppInjector;
        var p = this._proto;
        if (lang_1.isPresent(p._keyId0))
            this._getDirectiveByKeyId(p._keyId0);
        if (lang_1.isPresent(p._keyId1))
            this._getDirectiveByKeyId(p._keyId1);
        if (lang_1.isPresent(p._keyId2))
            this._getDirectiveByKeyId(p._keyId2);
        if (lang_1.isPresent(p._keyId3))
            this._getDirectiveByKeyId(p._keyId3);
        if (lang_1.isPresent(p._keyId4))
            this._getDirectiveByKeyId(p._keyId4);
        if (lang_1.isPresent(p._keyId5))
            this._getDirectiveByKeyId(p._keyId5);
        if (lang_1.isPresent(p._keyId6))
            this._getDirectiveByKeyId(p._keyId6);
        if (lang_1.isPresent(p._keyId7))
            this._getDirectiveByKeyId(p._keyId7);
        if (lang_1.isPresent(p._keyId8))
            this._getDirectiveByKeyId(p._keyId8);
        if (lang_1.isPresent(p._keyId9))
            this._getDirectiveByKeyId(p._keyId9);
        if (lang_1.isPresent(this._privateComponentBinding)) {
            this._privateComponent = this._new(this._privateComponentBinding);
        }
    };
    ElementInjector.prototype.createPrivateComponent = function (componentType, annotation) {
        this._privateComponentBinding = DirectiveBinding.createFromType(componentType, annotation);
        this._privateComponent = this._new(this._privateComponentBinding);
        return this._privateComponent;
    };
    ElementInjector.prototype._checkShadowDomAppInjector = function (shadowDomAppInjector) {
        if (this._proto._binding0IsComponent && lang_1.isBlank(shadowDomAppInjector)) {
            throw new lang_1.BaseException('A shadowDomAppInjector is required as this ElementInjector contains a component');
        }
        else if (!this._proto._binding0IsComponent && lang_1.isPresent(shadowDomAppInjector)) {
            throw new lang_1.BaseException('No shadowDomAppInjector allowed as there is not component stored in this ElementInjector');
        }
    };
    ElementInjector.prototype.get = function (token) {
        return this._getByKey(di_1.Key.get(token), 0, false, null);
    };
    ElementInjector.prototype.hasDirective = function (type) {
        return this._getDirectiveByKeyId(di_1.Key.get(type).id) !== _undefined;
    };
    ElementInjector.prototype.hasPreBuiltObject = function (type) {
        var pb = this._getPreBuiltObjectByKeyId(di_1.Key.get(type).id);
        return pb !== _undefined && lang_1.isPresent(pb);
    };
    ElementInjector.prototype.forElement = function (el) {
        return this._preBuiltObjects.element.domElement === el;
    };
    ElementInjector.prototype.getNgElement = function () {
        return this._preBuiltObjects.element;
    };
    ElementInjector.prototype.getComponent = function () {
        if (this._proto._binding0IsComponent) {
            return this._obj0;
        }
        else {
            throw new lang_1.BaseException('There is not component stored in this ElementInjector');
        }
    };
    ElementInjector.prototype.getPrivateComponent = function () {
        return this._privateComponent;
    };
    ElementInjector.prototype.getShadowDomAppInjector = function () {
        return this._shadowDomAppInjector;
    };
    ElementInjector.prototype.directParent = function () {
        return this._proto.distanceToParent < 2 ? this.parent : null;
    };
    ElementInjector.prototype._isComponentKey = function (key) {
        return this._proto._binding0IsComponent && key.id === this._proto._keyId0;
    };
    ElementInjector.prototype._isPrivateComponentKey = function (key) {
        return lang_1.isPresent(this._privateComponentBinding) && key.id === this._privateComponentBinding.key.id;
    };
    ElementInjector.prototype._new = function (binding) {
        if (this._constructionCounter++ > _MAX_DIRECTIVE_CONSTRUCTION_COUNTER) {
            throw new di_1.CyclicDependencyError(binding.key);
        }
        var factory = binding.factory;
        var deps = binding.dependencies;
        var length = deps.length;
        var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;
        try {
            d0 = length > 0 ? this._getByDependency(deps[0], binding.key) : null;
            d1 = length > 1 ? this._getByDependency(deps[1], binding.key) : null;
            d2 = length > 2 ? this._getByDependency(deps[2], binding.key) : null;
            d3 = length > 3 ? this._getByDependency(deps[3], binding.key) : null;
            d4 = length > 4 ? this._getByDependency(deps[4], binding.key) : null;
            d5 = length > 5 ? this._getByDependency(deps[5], binding.key) : null;
            d6 = length > 6 ? this._getByDependency(deps[6], binding.key) : null;
            d7 = length > 7 ? this._getByDependency(deps[7], binding.key) : null;
            d8 = length > 8 ? this._getByDependency(deps[8], binding.key) : null;
            d9 = length > 9 ? this._getByDependency(deps[9], binding.key) : null;
        }
        catch (e) {
            if (e instanceof di_1.ProviderError)
                e.addKey(binding.key);
            throw e;
        }
        var obj;
        switch (length) {
            case 0:
                obj = factory();
                break;
            case 1:
                obj = factory(d0);
                break;
            case 2:
                obj = factory(d0, d1);
                break;
            case 3:
                obj = factory(d0, d1, d2);
                break;
            case 4:
                obj = factory(d0, d1, d2, d3);
                break;
            case 5:
                obj = factory(d0, d1, d2, d3, d4);
                break;
            case 6:
                obj = factory(d0, d1, d2, d3, d4, d5);
                break;
            case 7:
                obj = factory(d0, d1, d2, d3, d4, d5, d6);
                break;
            case 8:
                obj = factory(d0, d1, d2, d3, d4, d5, d6, d7);
                break;
            case 9:
                obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8);
                break;
            case 10:
                obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9);
                break;
            default:
                throw "Directive " + binding.key.token + " can only have up to 10 dependencies.";
        }
        return obj;
    };
    ElementInjector.prototype._getByDependency = function (dep, requestor) {
        if (lang_1.isPresent(dep.eventEmitterName))
            return this._buildEventEmitter(dep);
        if (lang_1.isPresent(dep.propSetterName))
            return this._buildPropSetter(dep);
        if (lang_1.isPresent(dep.attributeName))
            return this._buildAttribute(dep);
        return this._getByKey(dep.key, dep.depth, dep.optional, requestor);
    };
    ElementInjector.prototype._buildEventEmitter = function (dep) {
        var _this = this;
        var view = this._getPreBuiltObjectByKeyId(StaticKeys.instance().viewId);
        return function (event) {
            view.triggerEventHandlers(dep.eventEmitterName, event, _this._proto.index);
        };
    };
    ElementInjector.prototype._buildPropSetter = function (dep) {
        var ngElement = this._getPreBuiltObjectByKeyId(StaticKeys.instance().ngElementId);
        var domElement = ngElement.domElement;
        var setter = property_setter_factory_1.setterFactory(dep.propSetterName);
        return function (v) {
            setter(domElement, v);
        };
    };
    ElementInjector.prototype._buildAttribute = function (dep) {
        var attributes = this._proto.attributes;
        if (lang_1.isPresent(attributes) && collection_1.MapWrapper.contains(attributes, dep.attributeName)) {
            return collection_1.MapWrapper.get(attributes, dep.attributeName);
        }
        else {
            return null;
        }
    };
    ElementInjector.prototype._getByKey = function (key, depth, optional, requestor) {
        var ei = this;
        if (!this._shouldIncludeSelf(depth)) {
            depth -= ei._proto.distanceToParent;
            ei = ei._parent;
        }
        while (ei != null && depth >= 0) {
            var preBuiltObj = ei._getPreBuiltObjectByKeyId(key.id);
            if (preBuiltObj !== _undefined)
                return preBuiltObj;
            var dir = ei._getDirectiveByKeyId(key.id);
            if (dir !== _undefined)
                return dir;
            depth -= ei._proto.distanceToParent;
            ei = ei._parent;
        }
        if (lang_1.isPresent(this._host) && this._host._isComponentKey(key)) {
            return this._host.getComponent();
        }
        else if (lang_1.isPresent(this._host) && this._host._isPrivateComponentKey(key)) {
            return this._host.getPrivateComponent();
        }
        else if (optional) {
            return this._appInjector(requestor).getOptional(key);
        }
        else {
            return this._appInjector(requestor).get(key);
        }
    };
    ElementInjector.prototype._appInjector = function (requestor) {
        if (lang_1.isPresent(requestor) && this._isComponentKey(requestor)) {
            return this._shadowDomAppInjector;
        }
        else {
            return this._lightDomAppInjector;
        }
    };
    ElementInjector.prototype._shouldIncludeSelf = function (depth) {
        return depth === 0;
    };
    ElementInjector.prototype._getPreBuiltObjectByKeyId = function (keyId) {
        var staticKeys = StaticKeys.instance();
        if (keyId === staticKeys.viewId)
            return this._preBuiltObjects.view;
        if (keyId === staticKeys.ngElementId)
            return this._preBuiltObjects.element;
        if (keyId === staticKeys.viewContainerId)
            return this._preBuiltObjects.viewContainer;
        if (keyId === staticKeys.bindingPropagationConfigId)
            return this._preBuiltObjects.bindingPropagationConfig;
        if (keyId === staticKeys.privateComponentLocationId) {
            return new pclModule.PrivateComponentLocation(this, this._preBuiltObjects.element, this._preBuiltObjects.view);
        }
        return _undefined;
    };
    ElementInjector.prototype._getDirectiveByKeyId = function (keyId) {
        var p = this._proto;
        if (p._keyId0 === keyId) {
            if (lang_1.isBlank(this._obj0)) {
                this._obj0 = this._new(p._binding0);
            }
            return this._obj0;
        }
        if (p._keyId1 === keyId) {
            if (lang_1.isBlank(this._obj1)) {
                this._obj1 = this._new(p._binding1);
            }
            return this._obj1;
        }
        if (p._keyId2 === keyId) {
            if (lang_1.isBlank(this._obj2)) {
                this._obj2 = this._new(p._binding2);
            }
            return this._obj2;
        }
        if (p._keyId3 === keyId) {
            if (lang_1.isBlank(this._obj3)) {
                this._obj3 = this._new(p._binding3);
            }
            return this._obj3;
        }
        if (p._keyId4 === keyId) {
            if (lang_1.isBlank(this._obj4)) {
                this._obj4 = this._new(p._binding4);
            }
            return this._obj4;
        }
        if (p._keyId5 === keyId) {
            if (lang_1.isBlank(this._obj5)) {
                this._obj5 = this._new(p._binding5);
            }
            return this._obj5;
        }
        if (p._keyId6 === keyId) {
            if (lang_1.isBlank(this._obj6)) {
                this._obj6 = this._new(p._binding6);
            }
            return this._obj6;
        }
        if (p._keyId7 === keyId) {
            if (lang_1.isBlank(this._obj7)) {
                this._obj7 = this._new(p._binding7);
            }
            return this._obj7;
        }
        if (p._keyId8 === keyId) {
            if (lang_1.isBlank(this._obj8)) {
                this._obj8 = this._new(p._binding8);
            }
            return this._obj8;
        }
        if (p._keyId9 === keyId) {
            if (lang_1.isBlank(this._obj9)) {
                this._obj9 = this._new(p._binding9);
            }
            return this._obj9;
        }
        return _undefined;
    };
    ElementInjector.prototype.getDirectiveAtIndex = function (index) {
        if (index == 0)
            return this._obj0;
        if (index == 1)
            return this._obj1;
        if (index == 2)
            return this._obj2;
        if (index == 3)
            return this._obj3;
        if (index == 4)
            return this._obj4;
        if (index == 5)
            return this._obj5;
        if (index == 6)
            return this._obj6;
        if (index == 7)
            return this._obj7;
        if (index == 8)
            return this._obj8;
        if (index == 9)
            return this._obj9;
        throw new OutOfBoundsAccess(index);
    };
    ElementInjector.prototype.getDirectiveBindingAtIndex = function (index) {
        return this._proto.getDirectiveBindingAtIndex(index);
    };
    ElementInjector.prototype.hasInstances = function () {
        return this._constructionCounter > 0;
    };
    ElementInjector.prototype.hasEventEmitter = function (eventName) {
        return this._proto.hasEventEmitter(eventName);
    };
    ElementInjector.prototype.isExportingComponent = function () {
        return this._proto.exportComponent;
    };
    ElementInjector.prototype.isExportingElement = function () {
        return this._proto.exportElement;
    };
    ElementInjector.prototype.getExportImplicitName = function () {
        return this._proto.exportImplicitName;
    };
    return ElementInjector;
})(TreeNode);
exports.ElementInjector = ElementInjector;
Object.defineProperty(ElementInjector, "parameters", { get: function () {
        return [[ProtoElementInjector], [ElementInjector], [ElementInjector]];
    } });
Object.defineProperty(ElementInjector.prototype.instantiateDirectives, "parameters", { get: function () {
        return [[di_1.Injector], [di_1.Injector], [PreBuiltObjects]];
    } });
Object.defineProperty(ElementInjector.prototype.createPrivateComponent, "parameters", { get: function () {
        return [[lang_1.Type], [annotations_1.Directive]];
    } });
Object.defineProperty(ElementInjector.prototype._checkShadowDomAppInjector, "parameters", { get: function () {
        return [[di_1.Injector]];
    } });
Object.defineProperty(ElementInjector.prototype.hasDirective, "parameters", { get: function () {
        return [[lang_1.Type]];
    } });
Object.defineProperty(ElementInjector.prototype.hasPreBuiltObject, "parameters", { get: function () {
        return [[lang_1.Type]];
    } });
Object.defineProperty(ElementInjector.prototype._isComponentKey, "parameters", { get: function () {
        return [[di_1.Key]];
    } });
Object.defineProperty(ElementInjector.prototype._isPrivateComponentKey, "parameters", { get: function () {
        return [[di_1.Key]];
    } });
Object.defineProperty(ElementInjector.prototype._new, "parameters", { get: function () {
        return [[di_1.Binding]];
    } });
Object.defineProperty(ElementInjector.prototype._getByDependency, "parameters", { get: function () {
        return [[DirectiveDependency], [di_1.Key]];
    } });
Object.defineProperty(ElementInjector.prototype._getByKey, "parameters", { get: function () {
        return [[di_1.Key], [assert.type.number], [assert.type.boolean], [di_1.Key]];
    } });
Object.defineProperty(ElementInjector.prototype._appInjector, "parameters", { get: function () {
        return [[di_1.Key]];
    } });
Object.defineProperty(ElementInjector.prototype._shouldIncludeSelf, "parameters", { get: function () {
        return [[lang_1.int]];
    } });
Object.defineProperty(ElementInjector.prototype._getPreBuiltObjectByKeyId, "parameters", { get: function () {
        return [[lang_1.int]];
    } });
Object.defineProperty(ElementInjector.prototype._getDirectiveByKeyId, "parameters", { get: function () {
        return [[lang_1.int]];
    } });
Object.defineProperty(ElementInjector.prototype.getDirectiveAtIndex, "parameters", { get: function () {
        return [[lang_1.int]];
    } });
Object.defineProperty(ElementInjector.prototype.getDirectiveBindingAtIndex, "parameters", { get: function () {
        return [[lang_1.int]];
    } });
Object.defineProperty(ElementInjector.prototype.hasEventEmitter, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
var OutOfBoundsAccess = (function (_super) {
    __extends(OutOfBoundsAccess, _super);
    function OutOfBoundsAccess(index) {
        _super.call(this);
        this.message = "Index " + index + " is out-of-bounds.";
    }
    OutOfBoundsAccess.prototype.toString = function () {
        return this.message;
    };
    return OutOfBoundsAccess;
})(Error);
