import {int,
  isBlank,
  BaseException} from 'angular2/src/facade/lang';
import * as eiModule from './element_injector';
import {DirectiveBinding} from './element_injector';
import {List,
  StringMap} from 'angular2/src/facade/collection';
import * as viewModule from './view';
export class ElementBinder {
  constructor(index, parent, distanceToParent, protoElementInjector, componentDirective, viewportDirective) {
    if (isBlank(index)) {
      throw new BaseException('null index not allowed.');
    }
    this.protoElementInjector = protoElementInjector;
    this.componentDirective = componentDirective;
    this.viewportDirective = viewportDirective;
    this.parent = parent;
    this.index = index;
    this.distanceToParent = distanceToParent;
    this.events = null;
    this.textNodeIndices = null;
    this.hasElementPropertyBindings = false;
    this.nestedProtoView = null;
    this.contentTagSelector = null;
  }
}
Object.defineProperty(ElementBinder, "parameters", {get: function() {
    return [[int], [ElementBinder], [int], [eiModule.ProtoElementInjector], [DirectiveBinding], [DirectiveBinding]];
  }});
//# sourceMappingURL=element_binder.js.map

//# sourceMappingURL=./element_binder.map