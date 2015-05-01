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
var collection_1 = require('angular2/src/facade/collection');
var di_1 = require('angular2/di');
var Directive = (function (_super) {
    __extends(Directive, _super);
    function Directive(_a) {
        var _b = _a === void 0 ? {} : _a, selector = _b.selector, bind = _b.bind, events = _b.events, lifecycle = _b.lifecycle;
        _super.call(this);
        this.selector = selector;
        this.bind = bind;
        this.events = events;
        this.lifecycle = lifecycle;
    }
    Directive.prototype.hasLifecycleHook = function (hook) {
        return lang_1.isPresent(this.lifecycle) ? collection_1.ListWrapper.contains(this.lifecycle, hook) : false;
    };
    return Directive;
})(di_1.Injectable);
exports.Directive = Directive;
Object.defineProperty(Directive, "annotations", { get: function () {
        return [new lang_1.ABSTRACT(), new lang_1.CONST()];
    } });
Object.defineProperty(Directive.prototype.hasLifecycleHook, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
var Component = (function (_super) {
    __extends(Component, _super);
    function Component(_a) {
        var _b = _a === void 0 ? {} : _a, selector = _b.selector, bind = _b.bind, events = _b.events, services = _b.services, lifecycle = _b.lifecycle, changeDetection = _b.changeDetection;
        _super.call(this, {
            selector: selector,
            bind: bind,
            events: events,
            lifecycle: lifecycle
        });
        this.changeDetection = changeDetection;
        this.services = services;
    }
    return Component;
})(Directive);
exports.Component = Component;
Object.defineProperty(Component, "annotations", { get: function () {
        return [new lang_1.CONST()];
    } });
var DynamicComponent = (function (_super) {
    __extends(DynamicComponent, _super);
    function DynamicComponent(_a) {
        var _b = _a === void 0 ? {} : _a, selector = _b.selector, bind = _b.bind, events = _b.events, services = _b.services, lifecycle = _b.lifecycle;
        _super.call(this, {
            selector: selector,
            bind: bind,
            events: events,
            lifecycle: lifecycle
        });
        this.services = services;
    }
    return DynamicComponent;
})(Directive);
exports.DynamicComponent = DynamicComponent;
Object.defineProperty(DynamicComponent, "annotations", { get: function () {
        return [new lang_1.CONST()];
    } });
var Decorator = (function (_super) {
    __extends(Decorator, _super);
    function Decorator(_a) {
        var _b = _a === void 0 ? {} : _a, selector = _b.selector, bind = _b.bind, events = _b.events, lifecycle = _b.lifecycle, _c = _b.compileChildren, compileChildren = _c === void 0 ? true : _c;
        _super.call(this, {
            selector: selector,
            bind: bind,
            events: events,
            lifecycle: lifecycle
        });
        this.compileChildren = compileChildren;
    }
    return Decorator;
})(Directive);
exports.Decorator = Decorator;
Object.defineProperty(Decorator, "annotations", { get: function () {
        return [new lang_1.CONST()];
    } });
var Viewport = (function (_super) {
    __extends(Viewport, _super);
    function Viewport(_a) {
        var _b = _a === void 0 ? {} : _a, selector = _b.selector, bind = _b.bind, events = _b.events, lifecycle = _b.lifecycle;
        _super.call(this, {
            selector: selector,
            bind: bind,
            events: events,
            lifecycle: lifecycle
        });
    }
    return Viewport;
})(Directive);
exports.Viewport = Viewport;
Object.defineProperty(Viewport, "annotations", { get: function () {
        return [new lang_1.CONST()];
    } });
exports.onDestroy = "onDestroy";
exports.onChange = "onChange";
exports.onAllChangesDone = "onAllChangesDone";
