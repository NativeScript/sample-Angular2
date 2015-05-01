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
var NonBindable = (function () {
    function NonBindable() {
    }
    return NonBindable;
})();
exports.NonBindable = NonBindable;
Object.defineProperty(NonBindable, "annotations", { get: function () {
        return [new annotations_1.Decorator({
                selector: '[non-bindable]',
                compileChildren: false
            })];
    } });
