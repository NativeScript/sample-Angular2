import {isBlank,
  BaseException,
  isPresent,
  StringWrapper} from 'angular2/src/facade/lang';
import {DOM} from 'angular2/src/dom/dom_adapter';
import {List,
  ListWrapper,
  MapWrapper} from 'angular2/src/facade/collection';
import {VmTurnZone} from 'angular2/src/core/zone/vm_turn_zone';
var BUBBLE_SYMBOL = '^';
export class EventManager {
  constructor(plugins, zone) {
    this._zone = zone;
    this._plugins = plugins;
    for (var i = 0; i < plugins.length; i++) {
      plugins[i].manager = this;
    }
  }
  addEventListener(element, eventName, handler) {
    var shouldSupportBubble = eventName[0] == BUBBLE_SYMBOL;
    if (shouldSupportBubble) {
      eventName = StringWrapper.substring(eventName, 1);
    }
    var plugin = this._findPluginFor(eventName);
    plugin.addEventListener(element, eventName, handler, shouldSupportBubble);
  }
  getZone() {
    return this._zone;
  }
  _findPluginFor(eventName) {
    var plugins = this._plugins;
    for (var i = 0; i < plugins.length; i++) {
      var plugin = plugins[i];
      if (plugin.supports(eventName)) {
        return plugin;
      }
    }
    throw new BaseException(`No event manager plugin found for event ${eventName}`);
  }
}
Object.defineProperty(EventManager, "parameters", {get: function() {
    return [[assert.genericType(List, EventManagerPlugin)], [VmTurnZone]];
  }});
Object.defineProperty(EventManager.prototype.addEventListener, "parameters", {get: function() {
    return [[], [assert.type.string], [Function]];
  }});
Object.defineProperty(EventManager.prototype._findPluginFor, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export class EventManagerPlugin {
  supports(eventName) {
    return false;
  }
  addEventListener(element, eventName, handler, shouldSupportBubble) {
    throw "not implemented";
  }
}
Object.defineProperty(EventManagerPlugin.prototype.supports, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(EventManagerPlugin.prototype.addEventListener, "parameters", {get: function() {
    return [[], [assert.type.string], [Function], [assert.type.boolean]];
  }});
export class DomEventsPlugin extends EventManagerPlugin {
  supports(eventName) {
    return true;
  }
  addEventListener(element, eventName, handler, shouldSupportBubble) {
    var outsideHandler = shouldSupportBubble ? DomEventsPlugin.bubbleCallback(element, handler, this.manager._zone) : DomEventsPlugin.sameElementCallback(element, handler, this.manager._zone);
    this.manager._zone.runOutsideAngular(() => {
      DOM.on(element, eventName, outsideHandler);
    });
  }
  static sameElementCallback(element, handler, zone) {
    return (event) => {
      if (event.target === element) {
        zone.run(() => handler(event));
      }
    };
  }
  static bubbleCallback(element, handler, zone) {
    return (event) => zone.run(() => handler(event));
  }
}
Object.defineProperty(DomEventsPlugin.prototype.supports, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(DomEventsPlugin.prototype.addEventListener, "parameters", {get: function() {
    return [[], [assert.type.string], [Function], [assert.type.boolean]];
  }});
//# sourceMappingURL=event_manager.js.map

//# sourceMappingURL=./event_manager.map