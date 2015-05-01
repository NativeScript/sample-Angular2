import {ABSTRACT,
  CONST,
  normalizeBlank,
  isPresent} from 'angular2/src/facade/lang';
import {ListWrapper,
  List} from 'angular2/src/facade/collection';
import {Injectable} from 'angular2/di';
export class Directive extends Injectable {
  constructor({selector,
    bind,
    events,
    lifecycle} = {}) {
    super();
    this.selector = selector;
    this.bind = bind;
    this.events = events;
    this.lifecycle = lifecycle;
  }
  hasLifecycleHook(hook) {
    return isPresent(this.lifecycle) ? ListWrapper.contains(this.lifecycle, hook) : false;
  }
}
Object.defineProperty(Directive, "annotations", {get: function() {
    return [new ABSTRACT(), new CONST()];
  }});
Object.defineProperty(Directive.prototype.hasLifecycleHook, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export class Component extends Directive {
  constructor({selector,
    bind,
    events,
    services,
    lifecycle,
    changeDetection} = {}) {
    super({
      selector: selector,
      bind: bind,
      events: events,
      lifecycle: lifecycle
    });
    this.changeDetection = changeDetection;
    this.services = services;
  }
}
Object.defineProperty(Component, "annotations", {get: function() {
    return [new CONST()];
  }});
export class DynamicComponent extends Directive {
  constructor({selector,
    bind,
    events,
    services,
    lifecycle} = {}) {
    super({
      selector: selector,
      bind: bind,
      events: events,
      lifecycle: lifecycle
    });
    this.services = services;
  }
}
Object.defineProperty(DynamicComponent, "annotations", {get: function() {
    return [new CONST()];
  }});
export class Decorator extends Directive {
  constructor({selector,
    bind,
    events,
    lifecycle,
    compileChildren = true} = {}) {
    super({
      selector: selector,
      bind: bind,
      events: events,
      lifecycle: lifecycle
    });
    this.compileChildren = compileChildren;
  }
}
Object.defineProperty(Decorator, "annotations", {get: function() {
    return [new CONST()];
  }});
export class Viewport extends Directive {
  constructor({selector,
    bind,
    events,
    lifecycle} = {}) {
    super({
      selector: selector,
      bind: bind,
      events: events,
      lifecycle: lifecycle
    });
  }
}
Object.defineProperty(Viewport, "annotations", {get: function() {
    return [new CONST()];
  }});
export const onDestroy = "onDestroy";
export const onChange = "onChange";
export const onAllChangesDone = "onAllChangesDone";
//# sourceMappingURL=annotations.js.map

//# sourceMappingURL=./annotations.map