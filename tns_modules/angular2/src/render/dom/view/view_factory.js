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
var di_1 = require('angular2/di');
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var content_tag_1 = require('../shadow_dom/content_tag');
var view_container_1 = require('./view_container');
var proto_view_1 = require('./proto_view');
var view_1 = require('./view');
var util_1 = require('../util');
exports.VIEW_POOL_CAPACITY = new di_1.OpaqueToken('ViewFactory.viewPoolCapacity');
var ViewFactory = (function () {
    function ViewFactory(capacity, eventManager, shadowDomStrategy) {
        this._poolCapacity = capacity;
        this._pooledViews = collection_1.ListWrapper.create();
        this._eventManager = eventManager;
        this._shadowDomStrategy = shadowDomStrategy;
    }
    ViewFactory.prototype.getView = function (protoView) {
        var view;
        for (var i = 0; i < this._pooledViews.length; i++) {
            var pooledView = this._pooledViews[i];
            if (pooledView.proto === protoView) {
                view = collection_1.ListWrapper.removeAt(this._pooledViews, i);
            }
        }
        if (lang_1.isBlank(view)) {
            view = this._createView(protoView);
        }
        return view;
    };
    ViewFactory.prototype.returnView = function (view) {
        if (view.hydrated()) {
            view.dehydrate();
        }
        collection_1.ListWrapper.push(this._pooledViews, view);
        while (this._pooledViews.length > this._poolCapacity) {
            collection_1.ListWrapper.removeAt(this._pooledViews, 0);
        }
    };
    ViewFactory.prototype._createView = function (protoView) {
        var _this = this;
        var rootElementClone = protoView.isRootView ? protoView.element : dom_adapter_1.DOM.importIntoDoc(protoView.element);
        var elementsWithBindingsDynamic;
        if (protoView.isTemplateElement) {
            elementsWithBindingsDynamic = dom_adapter_1.DOM.querySelectorAll(dom_adapter_1.DOM.content(rootElementClone), util_1.NG_BINDING_CLASS_SELECTOR);
        }
        else {
            elementsWithBindingsDynamic = dom_adapter_1.DOM.getElementsByClassName(rootElementClone, util_1.NG_BINDING_CLASS);
        }
        var elementsWithBindings = collection_1.ListWrapper.createFixedSize(elementsWithBindingsDynamic.length);
        for (var binderIdx = 0; binderIdx < elementsWithBindingsDynamic.length; ++binderIdx) {
            elementsWithBindings[binderIdx] = elementsWithBindingsDynamic[binderIdx];
        }
        var viewRootNodes;
        if (protoView.isTemplateElement) {
            var childNode = dom_adapter_1.DOM.firstChild(dom_adapter_1.DOM.content(rootElementClone));
            viewRootNodes = [];
            while (childNode != null) {
                collection_1.ListWrapper.push(viewRootNodes, childNode);
                childNode = dom_adapter_1.DOM.nextSibling(childNode);
            }
        }
        else {
            viewRootNodes = [rootElementClone];
        }
        var binders = protoView.elementBinders;
        var boundTextNodes = [];
        var boundElements = collection_1.ListWrapper.createFixedSize(binders.length);
        var viewContainers = collection_1.ListWrapper.createFixedSize(binders.length);
        var contentTags = collection_1.ListWrapper.createFixedSize(binders.length);
        for (var binderIdx = 0; binderIdx < binders.length; binderIdx++) {
            var binder = binders[binderIdx];
            var element;
            if (binderIdx === 0 && protoView.rootBindingOffset === 1) {
                element = rootElementClone;
            }
            else {
                element = elementsWithBindings[binderIdx - protoView.rootBindingOffset];
            }
            boundElements[binderIdx] = element;
            var childNodes = dom_adapter_1.DOM.childNodes(dom_adapter_1.DOM.templateAwareRoot(element));
            var textNodeIndices = binder.textNodeIndices;
            for (var i = 0; i < textNodeIndices.length; i++) {
                collection_1.ListWrapper.push(boundTextNodes, childNodes[textNodeIndices[i]]);
            }
            var viewContainer = null;
            if (lang_1.isBlank(binder.componentId) && lang_1.isPresent(binder.nestedProtoView)) {
                viewContainer = new view_container_1.ViewContainer(this, element);
            }
            viewContainers[binderIdx] = viewContainer;
            var contentTag = null;
            if (lang_1.isPresent(binder.contentTagSelector)) {
                contentTag = new content_tag_1.Content(element, binder.contentTagSelector);
            }
            contentTags[binderIdx] = contentTag;
        }
        var view = new view_1.View(protoView, viewRootNodes, boundTextNodes, boundElements, viewContainers, contentTags);
        for (var binderIdx = 0; binderIdx < binders.length; binderIdx++) {
            var binder = binders[binderIdx];
            var element = boundElements[binderIdx];
            if (lang_1.isPresent(binder.componentId) && lang_1.isPresent(binder.nestedProtoView)) {
                var childView = this._createView(binder.nestedProtoView);
                view.setComponentView(this._shadowDomStrategy, binderIdx, childView);
            }
            if (lang_1.isPresent(binder.eventLocals)) {
                collection_1.ListWrapper.forEach(binder.eventNames, function (eventName) {
                    _this._createEventListener(view, element, binderIdx, eventName, binder.eventLocals);
                });
            }
        }
        if (protoView.isRootView) {
            view.hydrate(null);
        }
        return view;
    };
    ViewFactory.prototype._createEventListener = function (view, element, elementIndex, eventName, eventLocals) {
        this._eventManager.addEventListener(element, eventName, function (event) {
            view.dispatchEvent(elementIndex, eventName, event);
        });
    };
    return ViewFactory;
})();
exports.ViewFactory = ViewFactory;
Object.defineProperty(ViewFactory.prototype.getView, "parameters", { get: function () {
        return [[proto_view_1.ProtoView]];
    } });
Object.defineProperty(ViewFactory.prototype.returnView, "parameters", { get: function () {
        return [[view_1.View]];
    } });
Object.defineProperty(ViewFactory.prototype._createView, "parameters", { get: function () {
        return [[proto_view_1.ProtoView]];
    } });
