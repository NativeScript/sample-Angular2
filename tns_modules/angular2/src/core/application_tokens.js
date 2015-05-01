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
var di_1 = require('angular2/di');
exports.appViewToken = new di_1.OpaqueToken('AppView');
exports.appChangeDetectorToken = new di_1.OpaqueToken('AppChangeDetector');
exports.appElementToken = new di_1.OpaqueToken('AppElement');
exports.appComponentAnnotatedTypeToken = new di_1.OpaqueToken('AppComponentAnnotatedType');
exports.appDocumentToken = new di_1.OpaqueToken('AppDocument');
