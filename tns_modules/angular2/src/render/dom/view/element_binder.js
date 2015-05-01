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
var protoViewModule = require('./proto_view');
var ElementBinder = (function () {
    function ElementBinder(_a) {
        var textNodeIndices = _a.textNodeIndices, contentTagSelector = _a.contentTagSelector, nestedProtoView = _a.nestedProtoView, componentId = _a.componentId, eventLocals = _a.eventLocals, eventNames = _a.eventNames, parentIndex = _a.parentIndex, distanceToParent = _a.distanceToParent, propertySetters = _a.propertySetters;
        this.textNodeIndices = textNodeIndices;
        this.contentTagSelector = contentTagSelector;
        this.nestedProtoView = nestedProtoView;
        this.componentId = componentId;
        this.eventLocals = eventLocals;
        this.eventNames = eventNames;
        this.parentIndex = parentIndex;
        this.distanceToParent = distanceToParent;
        this.propertySetters = propertySetters;
    }
    ElementBinder.prototype.mergeChildComponentProtoViews = function (protoViews, target) {
        var nestedProtoView;
        if (lang_1.isPresent(this.componentId)) {
            nestedProtoView = collection_1.ListWrapper.removeAt(protoViews, 0);
        }
        else if (lang_1.isPresent(this.nestedProtoView)) {
            nestedProtoView = this.nestedProtoView.mergeChildComponentProtoViews(protoViews, target);
        }
        return new ElementBinder({
            parentIndex: this.parentIndex,
            textNodeIndices: this.textNodeIndices,
            contentTagSelector: this.contentTagSelector,
            nestedProtoView: nestedProtoView,
            componentId: this.componentId,
            eventLocals: this.eventLocals,
            eventNames: this.eventNames,
            distanceToParent: this.distanceToParent,
            propertySetters: this.propertySetters
        });
    };
    return ElementBinder;
})();
exports.ElementBinder = ElementBinder;
Object.defineProperty(ElementBinder.prototype.mergeChildComponentProtoViews, "parameters", { get: function () {
        return [[assert.genericType(collection_1.List, protoViewModule.ProtoView)], [assert.genericType(collection_1.List, protoViewModule.ProtoView)]];
    } });
