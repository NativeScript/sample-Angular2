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
var view_container_1 = require('angular2/src/core/compiler/view_container');
var lang_1 = require('angular2/src/facade/lang');
var If = (function () {
    function If(viewContainer) {
        this.viewContainer = viewContainer;
        this.prevCondition = null;
    }
    Object.defineProperty(If.prototype, "condition", {
        set: function (newCondition) {
            if (newCondition && (lang_1.isBlank(this.prevCondition) || !this.prevCondition)) {
                this.prevCondition = true;
                this.viewContainer.create();
            }
            else if (!newCondition && (lang_1.isBlank(this.prevCondition) || this.prevCondition)) {
                this.prevCondition = false;
                this.viewContainer.clear();
            }
        },
        enumerable: true,
        configurable: true
    });
    return If;
})();
exports.If = If;
Object.defineProperty(If, "annotations", { get: function () {
        return [new annotations_1.Viewport({
                selector: '[if]',
                bind: { 'condition': 'if' }
            })];
    } });
Object.defineProperty(If, "parameters", { get: function () {
        return [[view_container_1.ViewContainer]];
    } });
