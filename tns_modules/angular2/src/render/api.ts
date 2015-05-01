import {isPresent} from 'angular2/src/facade/lang';
import {Promise} from 'angular2/src/facade/async';
import {List,
  Map} from 'angular2/src/facade/collection';
import {ASTWithSource} from 'angular2/change_detection';
export class ElementBinder {
  constructor({index,
    parentIndex,
    distanceToParent,
    directives,
    nestedProtoView,
    propertyBindings,
    variableBindings,
    eventBindings,
    textBindings,
    readAttributes}) {
    this.index = index;
    this.parentIndex = parentIndex;
    this.distanceToParent = distanceToParent;
    this.directives = directives;
    this.nestedProtoView = nestedProtoView;
    this.propertyBindings = propertyBindings;
    this.variableBindings = variableBindings;
    this.eventBindings = eventBindings;
    this.textBindings = textBindings;
    this.readAttributes = readAttributes;
  }
}
export class DirectiveBinder {
  constructor({directiveIndex,
    propertyBindings,
    eventBindings}) {
    this.directiveIndex = directiveIndex;
    this.propertyBindings = propertyBindings;
    this.eventBindings = eventBindings;
  }
}
export class ProtoView {
  constructor({render,
    elementBinders,
    variableBindings} = {}) {
    this.render = render;
    this.elementBinders = elementBinders;
    this.variableBindings = variableBindings;
  }
}
export class DirectiveMetadata {
  static get DECORATOR_TYPE() {
    return 0;
  }
  static get COMPONENT_TYPE() {
    return 1;
  }
  static get VIEWPORT_TYPE() {
    return 2;
  }
  constructor({id,
    selector,
    compileChildren,
    events,
    bind,
    setters,
    readAttributes,
    type}) {
    this.id = id;
    this.selector = selector;
    this.compileChildren = isPresent(compileChildren) ? compileChildren : true;
    this.events = events;
    this.bind = bind;
    this.setters = setters;
    this.readAttributes = readAttributes;
    this.type = type;
  }
}
export class ProtoViewRef {}
export class ViewRef {}
export class ViewContainerRef {
  constructor(view, elementIndex) {
    this.view = view;
    this.elementIndex = elementIndex;
  }
}
Object.defineProperty(ViewContainerRef, "parameters", {get: function() {
    return [[ViewRef], [assert.type.number]];
  }});
export class Template {
  constructor({componentId,
    absUrl,
    inline,
    directives}) {
    this.componentId = componentId;
    this.absUrl = absUrl;
    this.inline = inline;
    this.directives = directives;
  }
}
export class Renderer {
  compile(template) {
    return null;
  }
  mergeChildComponentProtoViews(protoViewRef, protoViewRefs) {
    return null;
  }
  createRootProtoView(selectorOrElement) {
    return null;
  }
  createView(protoView) {
    return null;
  }
  destroyView(view) {}
  insertViewIntoContainer(vcRef, view, atIndex) {}
  detachViewFromContainer(vcRef, atIndex) {}
  setElementProperty(view, elementIndex, propertyName, propertyValue) {}
  setDynamicComponentView(view, elementIndex, nestedViewRef) {}
  setText(view, textNodeIndex, text) {}
  setEventDispatcher(viewRef, dispatcher) {}
  flush() {}
}
Object.defineProperty(Renderer.prototype.compile, "parameters", {get: function() {
    return [[Template]];
  }});
Object.defineProperty(Renderer.prototype.mergeChildComponentProtoViews, "parameters", {get: function() {
    return [[ProtoViewRef], [assert.genericType(List, ProtoViewRef)]];
  }});
Object.defineProperty(Renderer.prototype.createView, "parameters", {get: function() {
    return [[ProtoViewRef]];
  }});
Object.defineProperty(Renderer.prototype.destroyView, "parameters", {get: function() {
    return [[ViewRef]];
  }});
Object.defineProperty(Renderer.prototype.insertViewIntoContainer, "parameters", {get: function() {
    return [[ViewContainerRef], [ViewRef], []];
  }});
Object.defineProperty(Renderer.prototype.detachViewFromContainer, "parameters", {get: function() {
    return [[ViewContainerRef], [assert.type.number]];
  }});
Object.defineProperty(Renderer.prototype.setElementProperty, "parameters", {get: function() {
    return [[ViewRef], [assert.type.number], [assert.type.string], [assert.type.any]];
  }});
Object.defineProperty(Renderer.prototype.setDynamicComponentView, "parameters", {get: function() {
    return [[ViewRef], [assert.type.number], [ViewRef]];
  }});
Object.defineProperty(Renderer.prototype.setText, "parameters", {get: function() {
    return [[ViewRef], [assert.type.number], [assert.type.string]];
  }});
Object.defineProperty(Renderer.prototype.setEventDispatcher, "parameters", {get: function() {
    return [[ViewRef], [EventDispatcher]];
  }});
export class EventDispatcher {
  dispatchEvent(elementIndex, eventName, locals) {}
}
Object.defineProperty(EventDispatcher.prototype.dispatchEvent, "parameters", {get: function() {
    return [[assert.type.number], [assert.type.string], [assert.genericType(List, assert.type.any)]];
  }});
//# sourceMappingURL=api.js.map

//# sourceMappingURL=./api.map