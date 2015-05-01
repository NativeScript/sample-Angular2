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
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var VmTurnZone = (function () {
    function VmTurnZone(_a) {
        var enableLongStackTrace = _a.enableLongStackTrace;
        this._nestedRunCounter = 0;
        this._onTurnStart = null;
        this._onTurnDone = null;
        this._onErrorHandler = null;
        this._outerZone = lang_1.global.zone;
        this._innerZone = this._createInnerZone(this._outerZone, enableLongStackTrace);
    }
    VmTurnZone.prototype.initCallbacks = function (_a) {
        var _b = _a === void 0 ? {} : _a, onTurnStart = _b.onTurnStart, onTurnDone = _b.onTurnDone, onScheduleMicrotask = _b.onScheduleMicrotask, onErrorHandler = _b.onErrorHandler;
        this._onTurnStart = lang_1.normalizeBlank(onTurnStart);
        this._onTurnDone = lang_1.normalizeBlank(onTurnDone);
        this._onErrorHandler = lang_1.normalizeBlank(onErrorHandler);
    };
    VmTurnZone.prototype.run = function (fn) {
        return this._innerZone.run(fn);
    };
    VmTurnZone.prototype.runOutsideAngular = function (fn) {
        return this._outerZone.run(fn);
    };
    VmTurnZone.prototype._createInnerZone = function (zone, enableLongStackTrace) {
        var _this = this;
        var vmTurnZone = this;
        var errorHandling;
        if (enableLongStackTrace) {
            errorHandling = collection_1.StringMapWrapper.merge(Zone.longStackTraceZone, { onError: function (e) {
                    vmTurnZone._onError(this, e);
                } });
        }
        else {
            errorHandling = { onError: function (e) {
                    vmTurnZone._onError(this, e);
                } };
        }
        return zone.fork(errorHandling).fork({
            beforeTask: function () {
                _this._beforeTask();
            },
            afterTask: function () {
                _this._afterTask();
            }
        });
    };
    VmTurnZone.prototype._beforeTask = function () {
        this._nestedRunCounter++;
        if (this._nestedRunCounter === 1 && this._onTurnStart) {
            this._onTurnStart();
        }
    };
    VmTurnZone.prototype._afterTask = function () {
        this._nestedRunCounter--;
        if (this._nestedRunCounter === 0 && this._onTurnDone) {
            this._onTurnDone();
        }
    };
    VmTurnZone.prototype._onError = function (zone, e) {
        if (lang_1.isPresent(this._onErrorHandler)) {
            var trace = [lang_1.normalizeBlank(e.stack)];
            while (zone && zone.constructedAtException) {
                trace.push(zone.constructedAtException.get());
                zone = zone.parent;
            }
            this._onErrorHandler(e, trace);
        }
        else {
            throw e;
        }
    };
    return VmTurnZone;
})();
exports.VmTurnZone = VmTurnZone;
