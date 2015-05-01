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
var Title = (function () {
    function Title() {
    }
    Title.prototype.getTitle = function () {
        return dom_adapter_1.DOM.getTitle();
    };
    Title.prototype.setTitle = function (newTitle) {
        dom_adapter_1.DOM.setTitle(newTitle);
    };
    return Title;
})();
exports.Title = Title;
Object.defineProperty(Title.prototype.setTitle, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
