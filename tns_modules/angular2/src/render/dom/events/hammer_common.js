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
var event_manager_1 = require('./event_manager');
var collection_1 = require('angular2/src/facade/collection');
var _eventNames = {
    'pan': true,
    'panstart': true,
    'panmove': true,
    'panend': true,
    'pancancel': true,
    'panleft': true,
    'panright': true,
    'panup': true,
    'pandown': true,
    'pinch': true,
    'pinchstart': true,
    'pinchmove': true,
    'pinchend': true,
    'pinchcancel': true,
    'pinchin': true,
    'pinchout': true,
    'press': true,
    'pressup': true,
    'rotate': true,
    'rotatestart': true,
    'rotatemove': true,
    'rotateend': true,
    'rotatecancel': true,
    'swipe': true,
    'swipeleft': true,
    'swiperight': true,
    'swipeup': true,
    'swipedown': true,
    'tap': true
};
var HammerGesturesPluginCommon = (function (_super) {
    __extends(HammerGesturesPluginCommon, _super);
    function HammerGesturesPluginCommon() {
        _super.call(this);
    }
    HammerGesturesPluginCommon.prototype.supports = function (eventName) {
        eventName = eventName.toLowerCase();
        return collection_1.StringMapWrapper.contains(_eventNames, eventName);
    };
    return HammerGesturesPluginCommon;
})(event_manager_1.EventManagerPlugin);
exports.HammerGesturesPluginCommon = HammerGesturesPluginCommon;
Object.defineProperty(HammerGesturesPluginCommon.prototype.supports, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
