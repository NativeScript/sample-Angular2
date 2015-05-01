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
var annotations_1 = require('angular2/src/core/annotations/annotations');
var element_1 = require('angular2/src/core/dom/element');
var viewModule = require('./view');
var eiModule = require('./element_injector');
var shadow_dom_strategy_1 = require('./shadow_dom_strategy');
var event_manager_1 = require('angular2/src/render/dom/events/event_manager');
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var PrivateComponentLocation = (function () {
    function PrivateComponentLocation(elementInjector, elt, view) {
        this._elementInjector = elementInjector;
        this._elt = elt;
        this._view = view;
    }
    PrivateComponentLocation.prototype.createComponent = function (type, annotation, componentProtoView, eventManager, shadowDomStrategy) {
        var context = this._elementInjector.createPrivateComponent(type, annotation);
        var view = componentProtoView.instantiate(this._elementInjector, eventManager);
        view.hydrate(this._elementInjector.getShadowDomAppInjector(), this._elementInjector, null, context, null);
        shadowDomStrategy.attachTemplate(this._elt.domElement, view);
        collection_1.ListWrapper.push(this._view.componentChildViews, view);
        this._view.changeDetector.addChild(view.changeDetector);
    };
    return PrivateComponentLocation;
})();
exports.PrivateComponentLocation = PrivateComponentLocation;
Object.defineProperty(PrivateComponentLocation, "parameters", { get: function () {
        return [[eiModule.ElementInjector], [element_1.NgElement], [viewModule.View]];
    } });
Object.defineProperty(PrivateComponentLocation.prototype.createComponent, "parameters", { get: function () {
        return [[lang_1.Type], [annotations_1.Directive], [viewModule.ProtoView], [event_manager_1.EventManager], [shadow_dom_strategy_1.ShadowDomStrategy]];
    } });
