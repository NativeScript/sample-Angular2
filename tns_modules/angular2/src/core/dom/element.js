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
var lang_1 = require('angular2/src/facade/lang');
var NgElement = (function () {
    function NgElement(domElement) {
        this.domElement = domElement;
    }
    NgElement.prototype.getAttribute = function (name) {
        return lang_1.normalizeBlank(dom_adapter_1.DOM.getAttribute(this.domElement, name));
    };
    return NgElement;
})();
exports.NgElement = NgElement;
Object.defineProperty(NgElement.prototype.getAttribute, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
