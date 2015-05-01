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
var viewModule = require('./view');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var di_1 = require('angular2/di');
var eiModule = require('angular2/src/core/compiler/element_injector');
var lang_2 = require('angular2/src/facade/lang');
var event_manager_1 = require('angular2/src/render/dom/events/event_manager');
var light_dom_1 = require('./shadow_dom_emulation/light_dom');
var ViewContainer = (function () {
    function ViewContainer(parentView, templateElement, defaultProtoView, elementInjector, eventManager, lightDom) {
        if (lightDom === void 0) { lightDom = null; }
        this.parentView = parentView;
        this.templateElement = templateElement;
        this.defaultProtoView = defaultProtoView;
        this.elementInjector = elementInjector;
        this._lightDom = lightDom;
        this._views = [];
        this.appInjector = null;
        this.hostElementInjector = null;
        this.hostLightDom = null;
        this._eventManager = eventManager;
    }
    ViewContainer.prototype.hydrate = function (appInjector, hostElementInjector, hostLightDom) {
        this.appInjector = appInjector;
        this.hostElementInjector = hostElementInjector;
        this.hostLightDom = hostLightDom;
    };
    ViewContainer.prototype.dehydrate = function () {
        this.appInjector = null;
        this.hostElementInjector = null;
        this.hostLightDom = null;
        this.clear();
    };
    ViewContainer.prototype.clear = function () {
        for (var i = this._views.length - 1; i >= 0; i--) {
            this.remove(i);
        }
    };
    ViewContainer.prototype.get = function (index) {
        return this._views[index];
    };
    Object.defineProperty(ViewContainer.prototype, "length", {
        get: function () {
            return this._views.length;
        },
        enumerable: true,
        configurable: true
    });
    ViewContainer.prototype._siblingToInsertAfter = function (index) {
        if (index == 0)
            return this.templateElement;
        return collection_1.ListWrapper.last(this._views[index - 1].nodes);
    };
    ViewContainer.prototype.hydrated = function () {
        return lang_2.isPresent(this.appInjector);
    };
    ViewContainer.prototype.create = function (atIndex) {
        if (atIndex === void 0) { atIndex = -1; }
        if (!this.hydrated())
            throw new lang_1.BaseException('Cannot create views on a dehydrated ViewContainer');
        var newView = this.defaultProtoView.instantiate(this.hostElementInjector, this._eventManager);
        this.insert(newView, atIndex);
        newView.hydrate(this.appInjector, this.hostElementInjector, this.hostLightDom, this.parentView.context, this.parentView.locals);
        if (lang_2.isPresent(this.hostLightDom)) {
            this.hostLightDom.redistribute();
        }
        return newView;
    };
    ViewContainer.prototype.insert = function (view, atIndex) {
        if (atIndex === void 0) { atIndex = -1; }
        if (atIndex == -1)
            atIndex = this._views.length;
        collection_1.ListWrapper.insert(this._views, atIndex, view);
        if (lang_2.isBlank(this._lightDom)) {
            ViewContainer.moveViewNodesAfterSibling(this._siblingToInsertAfter(atIndex), view);
        }
        else {
            this._lightDom.redistribute();
        }
        this.parentView.changeDetector.addChild(view.changeDetector);
        this._linkElementInjectors(view);
        return view;
    };
    ViewContainer.prototype.remove = function (atIndex) {
        if (atIndex === void 0) { atIndex = -1; }
        if (atIndex == -1)
            atIndex = this._views.length - 1;
        var view = this.detach(atIndex);
        view.dehydrate();
        this.defaultProtoView.returnToPool(view);
    };
    ViewContainer.prototype.detach = function (atIndex) {
        if (atIndex === void 0) { atIndex = -1; }
        if (atIndex == -1)
            atIndex = this._views.length - 1;
        var detachedView = this.get(atIndex);
        collection_1.ListWrapper.removeAt(this._views, atIndex);
        if (lang_2.isBlank(this._lightDom)) {
            ViewContainer.removeViewNodes(detachedView);
        }
        else {
            this._lightDom.redistribute();
        }
        if (lang_2.isPresent(this.hostLightDom)) {
            this.hostLightDom.redistribute();
        }
        detachedView.changeDetector.remove();
        this._unlinkElementInjectors(detachedView);
        return detachedView;
    };
    ViewContainer.prototype.contentTagContainers = function () {
        return this._views;
    };
    ViewContainer.prototype.nodes = function () {
        var r = [];
        for (var i = 0; i < this._views.length; ++i) {
            r = collection_1.ListWrapper.concat(r, this._views[i].nodes);
        }
        return r;
    };
    ViewContainer.prototype._linkElementInjectors = function (view) {
        for (var i = 0; i < view.rootElementInjectors.length; ++i) {
            view.rootElementInjectors[i].parent = this.elementInjector;
        }
    };
    ViewContainer.prototype._unlinkElementInjectors = function (view) {
        for (var i = 0; i < view.rootElementInjectors.length; ++i) {
            view.rootElementInjectors[i].parent = null;
        }
    };
    ViewContainer.moveViewNodesAfterSibling = function (sibling, view) {
        for (var i = view.nodes.length - 1; i >= 0; --i) {
            dom_adapter_1.DOM.insertAfter(sibling, view.nodes[i]);
        }
    };
    ViewContainer.removeViewNodes = function (view) {
        var len = view.nodes.length;
        if (len == 0)
            return;
        var parent = view.nodes[0].parentNode;
        for (var i = len - 1; i >= 0; --i) {
            dom_adapter_1.DOM.removeChild(parent, view.nodes[i]);
        }
    };
    return ViewContainer;
})();
exports.ViewContainer = ViewContainer;
Object.defineProperty(ViewContainer, "parameters", { get: function () {
        return [[viewModule.View], [], [viewModule.ProtoView], [eiModule.ElementInjector], [event_manager_1.EventManager], []];
    } });
Object.defineProperty(ViewContainer.prototype.hydrate, "parameters", { get: function () {
        return [[di_1.Injector], [eiModule.ElementInjector], [light_dom_1.LightDom]];
    } });
Object.defineProperty(ViewContainer.prototype.get, "parameters", { get: function () {
        return [[assert.type.number]];
    } });
Object.defineProperty(ViewContainer.prototype._siblingToInsertAfter, "parameters", { get: function () {
        return [[assert.type.number]];
    } });
