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
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var collection_1 = require('angular2/src/facade/collection');
var vm_turn_zone_1 = require('angular2/src/core/zone/vm_turn_zone');
var BUBBLE_SYMBOL = '^';
var EventManager = (function () {
    function EventManager(plugins, zone) {
        this._zone = zone;
        this._plugins = plugins;
        for (var i = 0; i < plugins.length; i++) {
            plugins[i].manager = this;
        }
    }
    EventManager.prototype.addEventListener = function (element, eventName, handler) {
        var shouldSupportBubble = eventName[0] == BUBBLE_SYMBOL;
        if (shouldSupportBubble) {
            eventName = lang_1.StringWrapper.substring(eventName, 1);
        }
        var plugin = this._findPluginFor(eventName);
        plugin.addEventListener(element, eventName, handler, shouldSupportBubble);
    };
    EventManager.prototype.getZone = function () {
        return this._zone;
    };
    EventManager.prototype._findPluginFor = function (eventName) {
        var plugins = this._plugins;
        for (var i = 0; i < plugins.length; i++) {
            var plugin = plugins[i];
            if (plugin.supports(eventName)) {
                return plugin;
            }
        }
        throw new lang_1.BaseException("No event manager plugin found for event " + eventName);
    };
    return EventManager;
})();
exports.EventManager = EventManager;
Object.defineProperty(EventManager, "parameters", { get: function () {
        return [[assert.genericType(collection_1.List, EventManagerPlugin)], [vm_turn_zone_1.VmTurnZone]];
    } });
Object.defineProperty(EventManager.prototype.addEventListener, "parameters", { get: function () {
        return [[], [assert.type.string], [Function]];
    } });
Object.defineProperty(EventManager.prototype._findPluginFor, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
var EventManagerPlugin = (function () {
    function EventManagerPlugin() {
    }
    EventManagerPlugin.prototype.supports = function (eventName) {
        return false;
    };
    EventManagerPlugin.prototype.addEventListener = function (element, eventName, handler, shouldSupportBubble) {
        throw "not implemented";
    };
    return EventManagerPlugin;
})();
exports.EventManagerPlugin = EventManagerPlugin;
Object.defineProperty(EventManagerPlugin.prototype.supports, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(EventManagerPlugin.prototype.addEventListener, "parameters", { get: function () {
        return [[], [assert.type.string], [Function], [assert.type.boolean]];
    } });
var DomEventsPlugin = (function (_super) {
    __extends(DomEventsPlugin, _super);
    function DomEventsPlugin() {
        _super.apply(this, arguments);
    }
    DomEventsPlugin.prototype.supports = function (eventName) {
        return true;
    };
    DomEventsPlugin.prototype.addEventListener = function (element, eventName, handler, shouldSupportBubble) {
        var outsideHandler = shouldSupportBubble ? DomEventsPlugin.bubbleCallback(element, handler, this.manager._zone) : DomEventsPlugin.sameElementCallback(element, handler, this.manager._zone);
        this.manager._zone.runOutsideAngular(function () {
            dom_adapter_1.DOM.on(element, eventName, outsideHandler);
        });
    };
    DomEventsPlugin.sameElementCallback = function (element, handler, zone) {
        return function (event) {
            if (event.target === element) {
                zone.run(function () { return handler(event); });
            }
        };
    };
    DomEventsPlugin.bubbleCallback = function (element, handler, zone) {
        return function (event) { return zone.run(function () { return handler(event); }); };
    };
    return DomEventsPlugin;
})(EventManagerPlugin);
exports.DomEventsPlugin = DomEventsPlugin;
Object.defineProperty(DomEventsPlugin.prototype.supports, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(DomEventsPlugin.prototype.addEventListener, "parameters", { get: function () {
        return [[], [assert.type.string], [Function], [assert.type.boolean]];
    } });
