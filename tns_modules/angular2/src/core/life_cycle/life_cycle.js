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
var change_detection_1 = require('angular2/change_detection');
var vm_turn_zone_1 = require('angular2/src/core/zone/vm_turn_zone');
var exception_handler_1 = require('angular2/src/core/exception_handler');
var lang_1 = require('angular2/src/facade/lang');
var LifeCycle = (function () {
    function LifeCycle(exceptionHandler, changeDetector, enforceNoNewChanges) {
        if (changeDetector === void 0) { changeDetector = null; }
        if (enforceNoNewChanges === void 0) { enforceNoNewChanges = false; }
        this._errorHandler = function (exception, stackTrace) {
            exceptionHandler.call(exception, stackTrace);
            throw exception;
        };
        this._changeDetector = changeDetector;
        this._enforceNoNewChanges = enforceNoNewChanges;
    }
    LifeCycle.prototype.registerWith = function (zone, changeDetector) {
        var _this = this;
        if (changeDetector === void 0) { changeDetector = null; }
        if (lang_1.isPresent(changeDetector)) {
            this._changeDetector = changeDetector;
        }
        zone.initCallbacks({
            onErrorHandler: this._errorHandler,
            onTurnDone: function () { return _this.tick(); }
        });
    };
    LifeCycle.prototype.tick = function () {
        this._changeDetector.detectChanges();
        if (this._enforceNoNewChanges) {
            this._changeDetector.checkNoChanges();
        }
    };
    return LifeCycle;
})();
exports.LifeCycle = LifeCycle;
Object.defineProperty(LifeCycle, "annotations", { get: function () {
        return [new di_1.Injectable()];
    } });
Object.defineProperty(LifeCycle, "parameters", { get: function () {
        return [[exception_handler_1.ExceptionHandler], [change_detection_1.ChangeDetector], [assert.type.boolean]];
    } });
Object.defineProperty(LifeCycle.prototype.registerWith, "parameters", { get: function () {
        return [[vm_turn_zone_1.VmTurnZone], [change_detection_1.ChangeDetector]];
    } });
