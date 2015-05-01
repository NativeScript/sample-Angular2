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
var ldModule = require('../shadow_dom/light_dom');
var vfModule = require('./view_factory');
var ViewContainer = (function () {
    function ViewContainer(viewFactory, templateElement) {
        this._viewFactory = viewFactory;
        this.templateElement = templateElement;
        this._views = [];
        this._hostLightDom = null;
        this._hydrated = false;
    }
    ViewContainer.prototype.hydrate = function (destLightDom, hostLightDom) {
        this._hydrated = true;
        this._hostLightDom = hostLightDom;
        this._lightDom = destLightDom;
    };
    ViewContainer.prototype.dehydrate = function () {
        if (lang_1.isBlank(this._lightDom)) {
            for (var i = this._views.length - 1; i >= 0; i--) {
                var view = this._views[i];
                ViewContainer.removeViewNodesFromParent(this.templateElement.parentNode, view);
                this._viewFactory.returnView(view);
            }
            this._views = [];
        }
        else {
            for (var i = 0; i < this._views.length; i++) {
                var view = this._views[i];
                this._viewFactory.returnView(view);
            }
            this._views = [];
            this._lightDom.redistribute();
        }
        this._hostLightDom = null;
        this._lightDom = null;
        this._hydrated = false;
    };
    ViewContainer.prototype.get = function (index) {
        return this._views[index];
    };
    ViewContainer.prototype.size = function () {
        return this._views.length;
    };
    ViewContainer.prototype._siblingToInsertAfter = function (index) {
        if (index == 0)
            return this.templateElement;
        return collection_1.ListWrapper.last(this._views[index - 1].rootNodes);
    };
    ViewContainer.prototype._checkHydrated = function () {
        if (!this._hydrated)
            throw new lang_1.BaseException('Cannot change dehydrated ViewContainer');
    };
    ViewContainer.prototype.insert = function (view, atIndex) {
        if (atIndex === void 0) { atIndex = -1; }
        this._checkHydrated();
        if (atIndex == -1)
            atIndex = this._views.length;
        collection_1.ListWrapper.insert(this._views, atIndex, view);
        if (!view.hydrated()) {
            view.hydrate(this._hostLightDom);
        }
        if (lang_1.isBlank(this._lightDom)) {
            ViewContainer.moveViewNodesAfterSibling(this._siblingToInsertAfter(atIndex), view);
        }
        else {
            this._lightDom.redistribute();
        }
        if (lang_1.isPresent(this._hostLightDom)) {
            this._hostLightDom.redistribute();
        }
        return view;
    };
    ViewContainer.prototype.detach = function (atIndex) {
        this._checkHydrated();
        var detachedView = this.get(atIndex);
        collection_1.ListWrapper.removeAt(this._views, atIndex);
        if (lang_1.isBlank(this._lightDom)) {
            ViewContainer.removeViewNodesFromParent(this.templateElement.parentNode, detachedView);
        }
        else {
            this._lightDom.redistribute();
        }
        if (lang_1.isPresent(this._hostLightDom)) {
            this._hostLightDom.redistribute();
        }
        return detachedView;
    };
    ViewContainer.prototype.contentTagContainers = function () {
        return this._views;
    };
    ViewContainer.prototype.nodes = function () {
        var r = [];
        for (var i = 0; i < this._views.length; ++i) {
            r = collection_1.ListWrapper.concat(r, this._views[i].rootNodes);
        }
        return r;
    };
    ViewContainer.moveViewNodesAfterSibling = function (sibling, view) {
        for (var i = view.rootNodes.length - 1; i >= 0; --i) {
            dom_adapter_1.DOM.insertAfter(sibling, view.rootNodes[i]);
        }
    };
    ViewContainer.removeViewNodesFromParent = function (parent, view) {
        for (var i = view.rootNodes.length - 1; i >= 0; --i) {
            dom_adapter_1.DOM.removeChild(parent, view.rootNodes[i]);
        }
    };
    return ViewContainer;
})();
exports.ViewContainer = ViewContainer;
Object.defineProperty(ViewContainer, "parameters", { get: function () {
        return [[vfModule.ViewFactory], []];
    } });
Object.defineProperty(ViewContainer.prototype.hydrate, "parameters", { get: function () {
        return [[ldModule.LightDom], [ldModule.LightDom]];
    } });
Object.defineProperty(ViewContainer.prototype.get, "parameters", { get: function () {
        return [[assert.type.number]];
    } });
Object.defineProperty(ViewContainer.prototype._siblingToInsertAfter, "parameters", { get: function () {
        return [[assert.type.number]];
    } });
Object.defineProperty(ViewContainer.prototype.detach, "parameters", { get: function () {
        return [[assert.type.number]];
    } });
