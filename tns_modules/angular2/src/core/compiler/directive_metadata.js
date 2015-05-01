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
var annotations_1 = require('angular2/src/core/annotations/annotations');
var DirectiveMetadata = (function () {
    function DirectiveMetadata(type, annotation) {
        this.annotation = annotation;
        this.type = type;
    }
    return DirectiveMetadata;
})();
exports.DirectiveMetadata = DirectiveMetadata;
Object.defineProperty(DirectiveMetadata, "parameters", { get: function () {
        return [[lang_1.Type], [annotations_1.Directive]];
    } });
