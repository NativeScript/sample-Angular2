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
var collection_1 = require('angular2/src/facade/collection');
var ElementBinder = (function () {
    function ElementBinder(_a) {
        var index = _a.index, parentIndex = _a.parentIndex, distanceToParent = _a.distanceToParent, directives = _a.directives, nestedProtoView = _a.nestedProtoView, propertyBindings = _a.propertyBindings, variableBindings = _a.variableBindings, eventBindings = _a.eventBindings, textBindings = _a.textBindings, readAttributes = _a.readAttributes;
        this.index = index;
        this.parentIndex = parentIndex;
        this.distanceToParent = distanceToParent;
        this.directives = directives;
        this.nestedProtoView = nestedProtoView;
        this.propertyBindings = propertyBindings;
        this.variableBindings = variableBindings;
        this.eventBindings = eventBindings;
        this.textBindings = textBindings;
        this.readAttributes = readAttributes;
    }
    return ElementBinder;
})();
exports.ElementBinder = ElementBinder;
var DirectiveBinder = (function () {
    function DirectiveBinder(_a) {
        var directiveIndex = _a.directiveIndex, propertyBindings = _a.propertyBindings, eventBindings = _a.eventBindings;
        this.directiveIndex = directiveIndex;
        this.propertyBindings = propertyBindings;
        this.eventBindings = eventBindings;
    }
    return DirectiveBinder;
})();
exports.DirectiveBinder = DirectiveBinder;
var ProtoView = (function () {
    function ProtoView(_a) {
        var _b = _a === void 0 ? {} : _a, render = _b.render, elementBinders = _b.elementBinders, variableBindings = _b.variableBindings;
        this.render = render;
        this.elementBinders = elementBinders;
        this.variableBindings = variableBindings;
    }
    return ProtoView;
})();
exports.ProtoView = ProtoView;
var DirectiveMetadata = (function () {
    function DirectiveMetadata(_a) {
        var id = _a.id, selector = _a.selector, compileChildren = _a.compileChildren, events = _a.events, bind = _a.bind, setters = _a.setters, readAttributes = _a.readAttributes, type = _a.type;
        this.id = id;
        this.selector = selector;
        this.compileChildren = lang_1.isPresent(compileChildren) ? compileChildren : true;
        this.events = events;
        this.bind = bind;
        this.setters = setters;
        this.readAttributes = readAttributes;
        this.type = type;
    }
    Object.defineProperty(DirectiveMetadata, "DECORATOR_TYPE", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectiveMetadata, "COMPONENT_TYPE", {
        get: function () {
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectiveMetadata, "VIEWPORT_TYPE", {
        get: function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    return DirectiveMetadata;
})();
exports.DirectiveMetadata = DirectiveMetadata;
var ProtoViewRef = (function () {
    function ProtoViewRef() {
    }
    return ProtoViewRef;
})();
exports.ProtoViewRef = ProtoViewRef;
var ViewRef = (function () {
    function ViewRef() {
    }
    return ViewRef;
})();
exports.ViewRef = ViewRef;
var ViewContainerRef = (function () {
    function ViewContainerRef(view, elementIndex) {
        this.view = view;
        this.elementIndex = elementIndex;
    }
    return ViewContainerRef;
})();
exports.ViewContainerRef = ViewContainerRef;
Object.defineProperty(ViewContainerRef, "parameters", { get: function () {
        return [[ViewRef], [assert.type.number]];
    } });
var Template = (function () {
    function Template(_a) {
        var componentId = _a.componentId, absUrl = _a.absUrl, inline = _a.inline, directives = _a.directives;
        this.componentId = componentId;
        this.absUrl = absUrl;
        this.inline = inline;
        this.directives = directives;
    }
    return Template;
})();
exports.Template = Template;
var Renderer = (function () {
    function Renderer() {
    }
    Renderer.prototype.compile = function (template) {
        return null;
    };
    Renderer.prototype.mergeChildComponentProtoViews = function (protoViewRef, protoViewRefs) {
        return null;
    };
    Renderer.prototype.createRootProtoView = function (selectorOrElement) {
        return null;
    };
    Renderer.prototype.createView = function (protoView) {
        return null;
    };
    Renderer.prototype.destroyView = function (view) { };
    Renderer.prototype.insertViewIntoContainer = function (vcRef, view, atIndex) { };
    Renderer.prototype.detachViewFromContainer = function (vcRef, atIndex) { };
    Renderer.prototype.setElementProperty = function (view, elementIndex, propertyName, propertyValue) { };
    Renderer.prototype.setDynamicComponentView = function (view, elementIndex, nestedViewRef) { };
    Renderer.prototype.setText = function (view, textNodeIndex, text) { };
    Renderer.prototype.setEventDispatcher = function (viewRef, dispatcher) { };
    Renderer.prototype.flush = function () { };
    return Renderer;
})();
exports.Renderer = Renderer;
Object.defineProperty(Renderer.prototype.compile, "parameters", { get: function () {
        return [[Template]];
    } });
Object.defineProperty(Renderer.prototype.mergeChildComponentProtoViews, "parameters", { get: function () {
        return [[ProtoViewRef], [assert.genericType(collection_1.List, ProtoViewRef)]];
    } });
Object.defineProperty(Renderer.prototype.createView, "parameters", { get: function () {
        return [[ProtoViewRef]];
    } });
Object.defineProperty(Renderer.prototype.destroyView, "parameters", { get: function () {
        return [[ViewRef]];
    } });
Object.defineProperty(Renderer.prototype.insertViewIntoContainer, "parameters", { get: function () {
        return [[ViewContainerRef], [ViewRef], []];
    } });
Object.defineProperty(Renderer.prototype.detachViewFromContainer, "parameters", { get: function () {
        return [[ViewContainerRef], [assert.type.number]];
    } });
Object.defineProperty(Renderer.prototype.setElementProperty, "parameters", { get: function () {
        return [[ViewRef], [assert.type.number], [assert.type.string], [assert.type.any]];
    } });
Object.defineProperty(Renderer.prototype.setDynamicComponentView, "parameters", { get: function () {
        return [[ViewRef], [assert.type.number], [ViewRef]];
    } });
Object.defineProperty(Renderer.prototype.setText, "parameters", { get: function () {
        return [[ViewRef], [assert.type.number], [assert.type.string]];
    } });
Object.defineProperty(Renderer.prototype.setEventDispatcher, "parameters", { get: function () {
        return [[ViewRef], [EventDispatcher]];
    } });
var EventDispatcher = (function () {
    function EventDispatcher() {
    }
    EventDispatcher.prototype.dispatchEvent = function (elementIndex, eventName, locals) { };
    return EventDispatcher;
})();
exports.EventDispatcher = EventDispatcher;
Object.defineProperty(EventDispatcher.prototype.dispatchEvent, "parameters", { get: function () {
        return [[assert.type.number], [assert.type.string], [assert.genericType(collection_1.List, assert.type.any)]];
    } });
