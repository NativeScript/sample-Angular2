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
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var reflection_1 = require('angular2/src/reflection/reflection');
var annotations_1 = require('../annotations/annotations');
var renderApi = require('angular2/src/render/api');
var direct_dom_renderer_1 = require('angular2/src/render/dom/direct_dom_renderer');
var view_1 = require('./view');
var element_injector_1 = require('./element_injector');
var ProtoViewFactory = (function () {
    function ProtoViewFactory(changeDetection, shadowDomStrategy) {
        this._changeDetection = changeDetection;
        this._shadowDomStrategy = shadowDomStrategy;
    }
    ProtoViewFactory.prototype.createProtoView = function (componentAnnotation, renderProtoView, directives) {
        return this._createProtoView(null, componentAnnotation, renderProtoView, directives);
    };
    ProtoViewFactory.prototype._createProtoView = function (parent, componentAnnotation, renderProtoView, directives) {
        var protoChangeDetector = this._changeDetection.createProtoChangeDetector('dummy', componentAnnotation.changeDetection);
        var domProtoView = this._getDomProtoView(renderProtoView.render);
        var protoView = new view_1.ProtoView(domProtoView.element, protoChangeDetector, this._shadowDomStrategy, parent);
        for (var i = 0; i < renderProtoView.elementBinders.length; i++) {
            var renderElementBinder = renderProtoView.elementBinders[i];
            var domElementBinder = domProtoView.elementBinders[i];
            var sortedDirectives = new SortedDirectives(renderElementBinder.directives, directives);
            var parentPeiWithDistance = this._findParentProtoElementInjectorWithDistance(i, protoView.elementBinders, renderProtoView.elementBinders);
            var protoElementInjector = this._createProtoElementInjector(i, parentPeiWithDistance, sortedDirectives, renderElementBinder);
            var elementBinder = this._createElementBinder(protoView, renderElementBinder, domElementBinder, protoElementInjector, sortedDirectives);
            this._createDirectiveBinders(protoView, sortedDirectives);
            if (lang_1.isPresent(renderElementBinder.nestedProtoView)) {
                elementBinder.nestedProtoView = this._createProtoView(protoView, componentAnnotation, renderElementBinder.nestedProtoView, directives);
            }
        }
        collection_1.MapWrapper.forEach(renderProtoView.variableBindings, function (mappedName, varName) {
            protoView.bindVariable(varName, mappedName);
        });
        return protoView;
    };
    ProtoViewFactory.prototype._getDomProtoView = function (protoViewRef) {
        return protoViewRef.delegate;
    };
    ProtoViewFactory.prototype._findParentProtoElementInjectorWithDistance = function (binderIndex, elementBinders, renderElementBinders) {
        var distance = 0;
        do {
            var renderElementBinder = renderElementBinders[binderIndex];
            binderIndex = renderElementBinder.parentIndex;
            if (binderIndex !== -1) {
                distance += renderElementBinder.distanceToParent;
                var elementBinder = elementBinders[binderIndex];
                if (lang_1.isPresent(elementBinder.protoElementInjector)) {
                    return new ParentProtoElementInjectorWithDistance(elementBinder.protoElementInjector, distance);
                }
            }
        } while (binderIndex !== -1);
        return new ParentProtoElementInjectorWithDistance(null, -1);
    };
    ProtoViewFactory.prototype._createProtoElementInjector = function (binderIndex, parentPeiWithDistance, sortedDirectives, renderElementBinder) {
        var protoElementInjector = null;
        var hasVariables = collection_1.MapWrapper.size(renderElementBinder.variableBindings) > 0;
        if (sortedDirectives.directives.length > 0 || hasVariables) {
            protoElementInjector = new element_injector_1.ProtoElementInjector(parentPeiWithDistance.protoElementInjector, binderIndex, sortedDirectives.directives, lang_1.isPresent(sortedDirectives.componentDirective), parentPeiWithDistance.distance);
            protoElementInjector.attributes = renderElementBinder.readAttributes;
            if (hasVariables && !lang_1.isPresent(sortedDirectives.viewportDirective)) {
                protoElementInjector.exportComponent = lang_1.isPresent(sortedDirectives.componentDirective);
                protoElementInjector.exportElement = lang_1.isBlank(sortedDirectives.componentDirective);
                var exportImplicitName = collection_1.MapWrapper.get(renderElementBinder.variableBindings, '\$implicit');
                if (lang_1.isPresent(exportImplicitName)) {
                    protoElementInjector.exportImplicitName = exportImplicitName;
                }
            }
        }
        return protoElementInjector;
    };
    ProtoViewFactory.prototype._createElementBinder = function (protoView, renderElementBinder, domElementBinder, protoElementInjector, sortedDirectives) {
        var parent = null;
        if (renderElementBinder.parentIndex !== -1) {
            parent = protoView.elementBinders[renderElementBinder.parentIndex];
        }
        var elBinder = protoView.bindElement(parent, renderElementBinder.distanceToParent, protoElementInjector, sortedDirectives.componentDirective, sortedDirectives.viewportDirective);
        elBinder.contentTagSelector = domElementBinder.contentTagSelector;
        for (var i = 0; i < renderElementBinder.textBindings.length; i++) {
            protoView.bindTextNode(domElementBinder.textNodeIndices[i], renderElementBinder.textBindings[i].ast);
        }
        collection_1.MapWrapper.forEach(renderElementBinder.propertyBindings, function (astWithSource, propertyName) {
            protoView.bindElementProperty(astWithSource.ast, propertyName, collection_1.MapWrapper.get(domElementBinder.propertySetters, propertyName));
        });
        collection_1.MapWrapper.forEach(renderElementBinder.eventBindings, function (astWithSource, eventName) {
            protoView.bindEvent(eventName, astWithSource.ast, -1);
        });
        collection_1.MapWrapper.forEach(renderElementBinder.variableBindings, function (mappedName, varName) {
            collection_1.MapWrapper.set(protoView.protoLocals, mappedName, null);
        });
        return elBinder;
    };
    ProtoViewFactory.prototype._createDirectiveBinders = function (protoView, sortedDirectives) {
        for (var i = 0; i < sortedDirectives.renderDirectives.length; i++) {
            var renderDirectiveMetadata = sortedDirectives.renderDirectives[i];
            collection_1.MapWrapper.forEach(renderDirectiveMetadata.propertyBindings, function (astWithSource, propertyName) {
                var setter = reflection_1.reflector.setter(propertyName);
                protoView.bindDirectiveProperty(i, astWithSource.ast, propertyName, setter);
            });
            collection_1.MapWrapper.forEach(renderDirectiveMetadata.eventBindings, function (astWithSource, eventName) {
                protoView.bindEvent(eventName, astWithSource.ast, i);
            });
        }
    };
    return ProtoViewFactory;
})();
exports.ProtoViewFactory = ProtoViewFactory;
Object.defineProperty(ProtoViewFactory.prototype.createProtoView, "parameters", { get: function () {
        return [[annotations_1.Component], [renderApi.ProtoView], [assert.genericType(collection_1.List, element_injector_1.DirectiveBinding)]];
    } });
Object.defineProperty(ProtoViewFactory.prototype._createProtoView, "parameters", { get: function () {
        return [[view_1.ProtoView], [annotations_1.Component], [renderApi.ProtoView], [assert.genericType(collection_1.List, element_injector_1.DirectiveBinding)]];
    } });
Object.defineProperty(ProtoViewFactory.prototype._getDomProtoView, "parameters", { get: function () {
        return [[direct_dom_renderer_1.DirectDomProtoViewRef]];
    } });
var SortedDirectives = (function () {
    function SortedDirectives(renderDirectives, allDirectives) {
        var _this = this;
        this.renderDirectives = [];
        this.directives = [];
        this.viewportDirective = null;
        this.componentDirective = null;
        collection_1.ListWrapper.forEach(renderDirectives, function (renderDirectiveMetadata) {
            var directiveBinding = allDirectives[renderDirectiveMetadata.directiveIndex];
            if ((directiveBinding.annotation instanceof annotations_1.Component) || (directiveBinding.annotation instanceof annotations_1.DynamicComponent)) {
                _this.componentDirective = directiveBinding;
                collection_1.ListWrapper.insert(_this.renderDirectives, 0, renderDirectiveMetadata);
                collection_1.ListWrapper.insert(_this.directives, 0, directiveBinding);
            }
            else {
                if (directiveBinding.annotation instanceof annotations_1.Viewport) {
                    _this.viewportDirective = directiveBinding;
                }
                collection_1.ListWrapper.push(_this.renderDirectives, renderDirectiveMetadata);
                collection_1.ListWrapper.push(_this.directives, directiveBinding);
            }
        });
    }
    return SortedDirectives;
})();
var ParentProtoElementInjectorWithDistance = (function () {
    function ParentProtoElementInjectorWithDistance(protoElementInjector, distance) {
        this.protoElementInjector = protoElementInjector;
        this.distance = distance;
    }
    return ParentProtoElementInjectorWithDistance;
})();
Object.defineProperty(ParentProtoElementInjectorWithDistance, "parameters", { get: function () {
        return [[element_injector_1.ProtoElementInjector], [assert.type.number]];
    } });
