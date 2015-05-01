var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
var proto_record_1 = require('./proto_record');
var ExpressionChangedAfterItHasBeenChecked = (function (_super) {
    __extends(ExpressionChangedAfterItHasBeenChecked, _super);
    function ExpressionChangedAfterItHasBeenChecked(proto, change) {
        _super.call(this);
        this.message = ("Expression '" + proto.expressionAsString + "' has changed after it was checked. ") + ("Previous value: '" + change.previousValue + "'. Current value: '" + change.currentValue + "'");
    }
    ExpressionChangedAfterItHasBeenChecked.prototype.toString = function () {
        return this.message;
    };
    return ExpressionChangedAfterItHasBeenChecked;
})(Error);
exports.ExpressionChangedAfterItHasBeenChecked = ExpressionChangedAfterItHasBeenChecked;
Object.defineProperty(ExpressionChangedAfterItHasBeenChecked, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord], [assert.type.any]];
    } });
var ChangeDetectionError = (function (_super) {
    __extends(ChangeDetectionError, _super);
    function ChangeDetectionError(proto, originalException) {
        _super.call(this);
        this.originalException = originalException;
        this.location = proto.expressionAsString;
        this.message = this.originalException + " in [" + this.location + "]";
    }
    ChangeDetectionError.prototype.toString = function () {
        return this.message;
    };
    return ChangeDetectionError;
})(Error);
exports.ChangeDetectionError = ChangeDetectionError;
Object.defineProperty(ChangeDetectionError, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord], [assert.type.any]];
    } });
