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
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var change_detection_1 = require('angular2/change_detection');
var proto_view_1 = require('./proto_view');
var light_dom_1 = require('../shadow_dom/light_dom');
var shadow_dom_strategy_1 = require('../shadow_dom/shadow_dom_strategy');
var api_1 = require('../../api');
var NG_BINDING_CLASS = 'ng-binding';
var View = (function () {
    function View(proto, rootNodes, boundTextNodes, boundElements, viewContainers, contentTags) {
        this.proto = proto;
        this.rootNodes = rootNodes;
        this.boundTextNodes = boundTextNodes;
        this.boundElements = boundElements;
        this.viewContainers = viewContainers;
        this.contentTags = contentTags;
        this.lightDoms = collection_1.ListWrapper.createFixedSize(boundElements.length);
        this.componentChildViews = collection_1.ListWrapper.createFixedSize(boundElements.length);
        this._hydrated = false;
    }
    View.prototype.hydrated = function () {
        return this._hydrated;
    };
    View.prototype.setElementProperty = function (elementIndex, propertyName, value) {
        var setter = collection_1.MapWrapper.get(this.proto.elementBinders[elementIndex].propertySetters, propertyName);
        setter(this.boundElements[elementIndex], value);
    };
    View.prototype.setText = function (textIndex, value) {
        dom_adapter_1.DOM.setText(this.boundTextNodes[textIndex], value);
    };
    View.prototype.setComponentView = function (strategy, elementIndex, childView) {
        var element = this.boundElements[elementIndex];
        var lightDom = strategy.constructLightDom(this, childView, element);
        strategy.attachTemplate(element, childView);
        this.lightDoms[elementIndex] = lightDom;
        this.componentChildViews[elementIndex] = childView;
        if (this._hydrated) {
            childView.hydrate(lightDom);
        }
    };
    View.prototype.getViewContainer = function (index) {
        return this.viewContainers[index];
    };
    View.prototype._getDestLightDom = function (binderIndex) {
        var binder = this.proto.elementBinders[binderIndex];
        var destLightDom = null;
        if (binder.parentIndex !== -1 && binder.distanceToParent === 1) {
            destLightDom = this.lightDoms[binder.parentIndex];
        }
        return destLightDom;
    };
    View.prototype.hydrate = function (hostLightDom) {
        if (this._hydrated)
            throw new lang_1.BaseException('The view is already hydrated.');
        this._hydrated = true;
        for (var i = 0; i < this.viewContainers.length; i++) {
            var vc = this.viewContainers[i];
            var destLightDom = this._getDestLightDom(i);
            if (lang_1.isPresent(vc)) {
                vc.hydrate(destLightDom, hostLightDom);
            }
            var ct = this.contentTags[i];
            if (lang_1.isPresent(ct)) {
                ct.hydrate(destLightDom);
            }
        }
        for (var i = 0; i < this.componentChildViews.length; i++) {
            var cv = this.componentChildViews[i];
            if (lang_1.isPresent(cv)) {
                cv.hydrate(this.lightDoms[i]);
            }
        }
        for (var i = 0; i < this.lightDoms.length; ++i) {
            var lightDom = this.lightDoms[i];
            if (lang_1.isPresent(lightDom)) {
                lightDom.redistribute();
            }
        }
    };
    View.prototype.dehydrate = function () {
        for (var i = 0; i < this.componentChildViews.length; i++) {
            this.componentChildViews[i].dehydrate();
        }
        if (lang_1.isPresent(this.viewContainers)) {
            for (var i = 0; i < this.viewContainers.length; i++) {
                var vc = this.viewContainers[i];
                if (lang_1.isPresent(vc)) {
                    vc.dehydrate();
                }
                var ct = this.contentTags[i];
                if (lang_1.isPresent(ct)) {
                    ct.dehydrate();
                }
            }
        }
        this._hydrated = false;
    };
    View.prototype.setEventDispatcher = function (dispatcher) {
        this._eventDispatcher = dispatcher;
    };
    View.prototype.dispatchEvent = function (elementIndex, eventName, event) {
        if (lang_1.isPresent(this._eventDispatcher)) {
            var evalLocals = collection_1.MapWrapper.create();
            collection_1.MapWrapper.set(evalLocals, '$event', event);
            var localValues = this.proto.elementBinders[elementIndex].eventLocals.eval(null, new change_detection_1.Locals(null, evalLocals));
            this._eventDispatcher.dispatchEvent(elementIndex, eventName, localValues);
        }
    };
    return View;
})();
exports.View = View;
Object.defineProperty(View, "parameters", { get: function () {
        return [[proto_view_1.ProtoView], [collection_1.List], [collection_1.List], [collection_1.List], [collection_1.List], [collection_1.List]];
    } });
Object.defineProperty(View.prototype.setElementProperty, "parameters", { get: function () {
        return [[assert.type.number], [assert.type.string], [assert.type.any]];
    } });
Object.defineProperty(View.prototype.setText, "parameters", { get: function () {
        return [[assert.type.number], [assert.type.string]];
    } });
Object.defineProperty(View.prototype.setComponentView, "parameters", { get: function () {
        return [[shadow_dom_strategy_1.ShadowDomStrategy], [assert.type.number], [View]];
    } });
Object.defineProperty(View.prototype.getViewContainer, "parameters", { get: function () {
        return [[assert.type.number]];
    } });
Object.defineProperty(View.prototype.hydrate, "parameters", { get: function () {
        return [[light_dom_1.LightDom]];
    } });
Object.defineProperty(View.prototype.setEventDispatcher, "parameters", { get: function () {
        return [[api_1.EventDispatcher]];
    } });
