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
var eiModule = require('./element_injector');
var element_injector_1 = require('./element_injector');
var ElementBinder = (function () {
    function ElementBinder(index, parent, distanceToParent, protoElementInjector, componentDirective, viewportDirective) {
        if (lang_1.isBlank(index)) {
            throw new lang_1.BaseException('null index not allowed.');
        }
        this.protoElementInjector = protoElementInjector;
        this.componentDirective = componentDirective;
        this.viewportDirective = viewportDirective;
        this.parent = parent;
        this.index = index;
        this.distanceToParent = distanceToParent;
        this.events = null;
        this.textNodeIndices = null;
        this.hasElementPropertyBindings = false;
        this.nestedProtoView = null;
        this.contentTagSelector = null;
    }
    return ElementBinder;
})();
exports.ElementBinder = ElementBinder;
Object.defineProperty(ElementBinder, "parameters", { get: function () {
        return [[lang_1.int], [ElementBinder], [lang_1.int], [eiModule.ProtoElementInjector], [element_injector_1.DirectiveBinding], [element_injector_1.DirectiveBinding]];
    } });
