import {CONST} from 'angular2/src/facade/lang';
import {DependencyAnnotation} from 'angular2/di';
export class EventEmitter extends DependencyAnnotation {
  constructor(eventName) {
    super();
    this.eventName = eventName;
  }
  get token() {
    return Function;
  }
}
Object.defineProperty(EventEmitter, "annotations", {get: function() {
    return [new CONST()];
  }});
export class PropertySetter extends DependencyAnnotation {
  constructor(propName) {
    super();
    this.propName = propName;
  }
  get token() {
    return Function;
  }
}
Object.defineProperty(PropertySetter, "annotations", {get: function() {
    return [new CONST()];
  }});
export class Attribute extends DependencyAnnotation {
  constructor(attributeName) {
    super();
    this.attributeName = attributeName;
  }
  get token() {
    return this;
  }
}
Object.defineProperty(Attribute, "annotations", {get: function() {
    return [new CONST()];
  }});
//# sourceMappingURL=di.js.map

//# sourceMappingURL=./di.map