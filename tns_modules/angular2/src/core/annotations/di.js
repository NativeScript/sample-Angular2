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
var lang_1 = require('angular2/src/facade/lang');
var di_1 = require('angular2/di');
var EventEmitter = (function (_super) {
    __extends(EventEmitter, _super);
    function EventEmitter(eventName) {
        _super.call(this);
        this.eventName = eventName;
    }
    Object.defineProperty(EventEmitter.prototype, "token", {
        get: function () {
            return Function;
        },
        enumerable: true,
        configurable: true
    });
    return EventEmitter;
})(di_1.DependencyAnnotation);
exports.EventEmitter = EventEmitter;
Object.defineProperty(EventEmitter, "annotations", { get: function () {
        return [new lang_1.CONST()];
    } });
var PropertySetter = (function (_super) {
    __extends(PropertySetter, _super);
    function PropertySetter(propName) {
        _super.call(this);
        this.propName = propName;
    }
    Object.defineProperty(PropertySetter.prototype, "token", {
        get: function () {
            return Function;
        },
        enumerable: true,
        configurable: true
    });
    return PropertySetter;
})(di_1.DependencyAnnotation);
exports.PropertySetter = PropertySetter;
Object.defineProperty(PropertySetter, "annotations", { get: function () {
        return [new lang_1.CONST()];
    } });
var Attribute = (function (_super) {
    __extends(Attribute, _super);
    function Attribute(attributeName) {
        _super.call(this);
        this.attributeName = attributeName;
    }
    Object.defineProperty(Attribute.prototype, "token", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    return Attribute;
})(di_1.DependencyAnnotation);
exports.Attribute = Attribute;
Object.defineProperty(Attribute, "annotations", { get: function () {
        return [new lang_1.CONST()];
    } });
