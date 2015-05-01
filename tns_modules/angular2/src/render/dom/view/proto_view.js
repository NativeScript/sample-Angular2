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
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var collection_1 = require('angular2/src/facade/collection');
var util_1 = require('../util');
var ProtoView = (function () {
    function ProtoView(_a) {
        var elementBinders = _a.elementBinders, element = _a.element, isRootView = _a.isRootView;
        this.element = element;
        this.elementBinders = elementBinders;
        this.isTemplateElement = dom_adapter_1.DOM.isTemplateElement(this.element);
        this.isRootView = isRootView;
        this.rootBindingOffset = (lang_1.isPresent(this.element) && dom_adapter_1.DOM.hasClass(this.element, util_1.NG_BINDING_CLASS)) ? 1 : 0;
    }
    ProtoView.prototype.mergeChildComponentProtoViews = function (protoViews, target) {
        var elementBinders = collection_1.ListWrapper.createFixedSize(this.elementBinders.length);
        for (var i = 0; i < this.elementBinders.length; i++) {
            var eb = this.elementBinders[i];
            if (lang_1.isPresent(eb.componentId) || lang_1.isPresent(eb.nestedProtoView)) {
                elementBinders[i] = eb.mergeChildComponentProtoViews(protoViews, target);
            }
            else {
                elementBinders[i] = eb;
            }
        }
        var result = new ProtoView({
            elementBinders: elementBinders,
            element: this.element,
            isRootView: this.isRootView
        });
        collection_1.ListWrapper.insert(target, 0, result);
        return result;
    };
    return ProtoView;
})();
exports.ProtoView = ProtoView;
Object.defineProperty(ProtoView.prototype.mergeChildComponentProtoViews, "parameters", { get: function () {
        return [[assert.genericType(collection_1.List, ProtoView)], [assert.genericType(collection_1.List, ProtoView)]];
    } });
