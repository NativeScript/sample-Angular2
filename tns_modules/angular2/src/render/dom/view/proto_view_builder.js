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
var collection_1 = require('angular2/src/facade/collection');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var change_detection_1 = require('angular2/change_detection');
var proto_view_1 = require('./proto_view');
var element_binder_1 = require('./element_binder');
var property_setter_factory_1 = require('./property_setter_factory');
var api = require('../../api');
var directDomRenderer = require('../direct_dom_renderer');
var util_1 = require('../util');
var ProtoViewBuilder = (function () {
    function ProtoViewBuilder(rootElement) {
        this.rootElement = rootElement;
        this.elements = [];
        this.isRootView = false;
        this.variableBindings = collection_1.MapWrapper.create();
    }
    ProtoViewBuilder.prototype.bindElement = function (element, description) {
        if (description === void 0) { description = null; }
        var builder = new ElementBinderBuilder(this.elements.length, element, description);
        collection_1.ListWrapper.push(this.elements, builder);
        dom_adapter_1.DOM.addClass(element, util_1.NG_BINDING_CLASS);
        return builder;
    };
    ProtoViewBuilder.prototype.bindVariable = function (name, value) {
        collection_1.MapWrapper.set(this.variableBindings, value, name);
    };
    ProtoViewBuilder.prototype.setIsRootView = function (value) {
        this.isRootView = value;
    };
    ProtoViewBuilder.prototype.build = function () {
        var renderElementBinders = [];
        var apiElementBinders = [];
        collection_1.ListWrapper.forEach(this.elements, function (ebb) {
            var propertySetters = collection_1.MapWrapper.create();
            var eventLocalsAstSplitter = new EventLocalsAstSplitter();
            var apiDirectiveBinders = collection_1.ListWrapper.map(ebb.directives, function (db) {
                return new api.DirectiveBinder({
                    directiveIndex: db.directiveIndex,
                    propertyBindings: db.propertyBindings,
                    eventBindings: eventLocalsAstSplitter.splitEventAstIntoLocals(db.eventBindings)
                });
            });
            collection_1.MapWrapper.forEach(ebb.propertySetters, function (setter, propertyName) {
                collection_1.MapWrapper.set(propertySetters, propertyName, setter);
            });
            var nestedProtoView = lang_1.isPresent(ebb.nestedProtoView) ? ebb.nestedProtoView.build() : null;
            var parentIndex = lang_1.isPresent(ebb.parent) ? ebb.parent.index : -1;
            collection_1.ListWrapper.push(apiElementBinders, new api.ElementBinder({
                index: ebb.index,
                parentIndex: parentIndex,
                distanceToParent: ebb.distanceToParent,
                directives: apiDirectiveBinders,
                nestedProtoView: nestedProtoView,
                propertyBindings: ebb.propertyBindings,
                variableBindings: ebb.variableBindings,
                eventBindings: eventLocalsAstSplitter.splitEventAstIntoLocals(ebb.eventBindings),
                textBindings: ebb.textBindings,
                readAttributes: ebb.readAttributes
            }));
            collection_1.ListWrapper.push(renderElementBinders, new element_binder_1.ElementBinder({
                textNodeIndices: ebb.textBindingIndices,
                contentTagSelector: ebb.contentTagSelector,
                parentIndex: parentIndex,
                distanceToParent: ebb.distanceToParent,
                nestedProtoView: lang_1.isPresent(nestedProtoView) ? nestedProtoView.render.delegate : null,
                componentId: ebb.componentId,
                eventLocals: eventLocalsAstSplitter.buildEventLocals(),
                eventNames: eventLocalsAstSplitter.buildEventNames(),
                propertySetters: propertySetters
            }));
        });
        return new api.ProtoView({
            render: new directDomRenderer.DirectDomProtoViewRef(new proto_view_1.ProtoView({
                element: this.rootElement,
                elementBinders: renderElementBinders,
                isRootView: this.isRootView
            })),
            elementBinders: apiElementBinders,
            variableBindings: this.variableBindings
        });
    };
    return ProtoViewBuilder;
})();
exports.ProtoViewBuilder = ProtoViewBuilder;
var ElementBinderBuilder = (function () {
    function ElementBinderBuilder(index, element, description) {
        this.element = element;
        this.index = index;
        this.parent = null;
        this.distanceToParent = 0;
        this.directives = [];
        this.nestedProtoView = null;
        this.propertyBindings = collection_1.MapWrapper.create();
        this.variableBindings = collection_1.MapWrapper.create();
        this.eventBindings = collection_1.MapWrapper.create();
        this.textBindings = [];
        this.textBindingIndices = [];
        this.contentTagSelector = null;
        this.propertySetters = collection_1.MapWrapper.create();
        this.componentId = null;
        this.readAttributes = collection_1.MapWrapper.create();
    }
    ElementBinderBuilder.prototype.setParent = function (parent, distanceToParent) {
        this.parent = parent;
        if (lang_1.isPresent(parent)) {
            this.distanceToParent = distanceToParent;
        }
        return this;
    };
    ElementBinderBuilder.prototype.readAttribute = function (attrName) {
        if (lang_1.isBlank(collection_1.MapWrapper.get(this.readAttributes, attrName))) {
            collection_1.MapWrapper.set(this.readAttributes, attrName, dom_adapter_1.DOM.getAttribute(this.element, attrName));
        }
    };
    ElementBinderBuilder.prototype.bindDirective = function (directiveIndex) {
        var directive = new DirectiveBuilder(directiveIndex);
        collection_1.ListWrapper.push(this.directives, directive);
        return directive;
    };
    ElementBinderBuilder.prototype.bindNestedProtoView = function (rootElement) {
        if (lang_1.isPresent(this.nestedProtoView)) {
            throw new lang_1.BaseException('Only one nested view per element is allowed');
        }
        this.nestedProtoView = new ProtoViewBuilder(rootElement);
        return this.nestedProtoView;
    };
    ElementBinderBuilder.prototype.bindProperty = function (name, expression) {
        collection_1.MapWrapper.set(this.propertyBindings, name, expression);
        this.bindPropertySetter(name);
    };
    ElementBinderBuilder.prototype.bindPropertySetter = function (name) {
        collection_1.MapWrapper.set(this.propertySetters, name, property_setter_factory_1.setterFactory(name));
    };
    ElementBinderBuilder.prototype.bindVariable = function (name, value) {
        if (lang_1.isPresent(this.nestedProtoView)) {
            this.nestedProtoView.bindVariable(name, value);
        }
        else {
            collection_1.MapWrapper.set(this.variableBindings, value, name);
        }
    };
    ElementBinderBuilder.prototype.bindEvent = function (name, expression) {
        collection_1.MapWrapper.set(this.eventBindings, name, expression);
    };
    ElementBinderBuilder.prototype.bindText = function (index, expression) {
        collection_1.ListWrapper.push(this.textBindingIndices, index);
        collection_1.ListWrapper.push(this.textBindings, expression);
    };
    ElementBinderBuilder.prototype.setContentTagSelector = function (value) {
        this.contentTagSelector = value;
    };
    ElementBinderBuilder.prototype.setComponentId = function (componentId) {
        this.componentId = componentId;
    };
    return ElementBinderBuilder;
})();
exports.ElementBinderBuilder = ElementBinderBuilder;
Object.defineProperty(ElementBinderBuilder.prototype.setParent, "parameters", { get: function () {
        return [[ElementBinderBuilder], []];
    } });
Object.defineProperty(ElementBinderBuilder.prototype.readAttribute, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(ElementBinderBuilder.prototype.bindDirective, "parameters", { get: function () {
        return [[assert.type.number]];
    } });
Object.defineProperty(ElementBinderBuilder.prototype.setContentTagSelector, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(ElementBinderBuilder.prototype.setComponentId, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
var DirectiveBuilder = (function () {
    function DirectiveBuilder(directiveIndex) {
        this.directiveIndex = directiveIndex;
        this.propertyBindings = collection_1.MapWrapper.create();
        this.eventBindings = collection_1.MapWrapper.create();
    }
    DirectiveBuilder.prototype.bindProperty = function (name, expression) {
        collection_1.MapWrapper.set(this.propertyBindings, name, expression);
    };
    DirectiveBuilder.prototype.bindEvent = function (name, expression) {
        collection_1.MapWrapper.set(this.eventBindings, name, expression);
    };
    return DirectiveBuilder;
})();
exports.DirectiveBuilder = DirectiveBuilder;
var EventLocalsAstSplitter = (function (_super) {
    __extends(EventLocalsAstSplitter, _super);
    function EventLocalsAstSplitter() {
        _super.call(this);
        this.locals = [];
        this.eventNames = [];
        this._implicitReceiver = new change_detection_1.ImplicitReceiver();
    }
    EventLocalsAstSplitter.prototype.splitEventAstIntoLocals = function (eventBindings) {
        return eventBindings;
    };
    EventLocalsAstSplitter.prototype.visitAccessMember = function (ast) {
        var isEventAccess = false;
        var current = ast;
        while (!isEventAccess && (current instanceof change_detection_1.AccessMember)) {
            if (current.name == '$event') {
                isEventAccess = true;
            }
            current = current.receiver;
        }
        if (isEventAccess) {
            collection_1.ListWrapper.push(this.locals, ast);
            var index = this.locals.length - 1;
            return new change_detection_1.AccessMember(this._implicitReceiver, "" + index, function (arr) { return arr[index]; }, null);
        }
        else {
            return ast;
        }
    };
    EventLocalsAstSplitter.prototype.buildEventLocals = function () {
        return new change_detection_1.LiteralArray(this.locals);
    };
    EventLocalsAstSplitter.prototype.buildEventNames = function () {
        return this.eventNames;
    };
    return EventLocalsAstSplitter;
})(change_detection_1.AstTransformer);
exports.EventLocalsAstSplitter = EventLocalsAstSplitter;
Object.defineProperty(EventLocalsAstSplitter.prototype.splitEventAstIntoLocals, "parameters", { get: function () {
        return [[assert.genericType(Map, assert.type.string, change_detection_1.ASTWithSource)]];
    } });
Object.defineProperty(EventLocalsAstSplitter.prototype.visitAccessMember, "parameters", { get: function () {
        return [[change_detection_1.AccessMember]];
    } });
