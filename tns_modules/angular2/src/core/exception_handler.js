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
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var ExceptionHandler = (function () {
    function ExceptionHandler() {
    }
    ExceptionHandler.prototype.call = function (error, stackTrace, reason) {
        if (stackTrace === void 0) { stackTrace = null; }
        if (reason === void 0) { reason = null; }
        var longStackTrace = collection_1.isListLikeIterable(stackTrace) ? collection_1.ListWrapper.join(stackTrace, "\n\n") : stackTrace;
        var reasonStr = lang_1.isPresent(reason) ? "\n" + reason : '';
        lang_1.print("" + error + reasonStr + "\nSTACKTRACE:\n" + longStackTrace);
    };
    return ExceptionHandler;
})();
exports.ExceptionHandler = ExceptionHandler;
Object.defineProperty(ExceptionHandler, "annotations", { get: function () {
        return [new di_1.Injectable()];
    } });
