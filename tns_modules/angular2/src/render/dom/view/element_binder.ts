import {AST} from 'angular2/change_detection';
import {SetterFn} from 'angular2/src/reflection/types';
import {isPresent,
  isBlank,
  BaseException} from 'angular2/src/facade/lang';
import {List,
  ListWrapper} from 'angular2/src/facade/collection';
import * as protoViewModule from './proto_view';
export class ElementBinder {
  constructor({textNodeIndices,
    contentTagSelector,
    nestedProtoView,
    componentId,
    eventLocals,
    eventNames,
    parentIndex,
    distanceToParent,
    propertySetters}) {
    this.textNodeIndices = textNodeIndices;
    this.contentTagSelector = contentTagSelector;
    this.nestedProtoView = nestedProtoView;
    this.componentId = componentId;
    this.eventLocals = eventLocals;
    this.eventNames = eventNames;
    this.parentIndex = parentIndex;
    this.distanceToParent = distanceToParent;
    this.propertySetters = propertySetters;
  }
  mergeChildComponentProtoViews(protoViews, target) {
    var nestedProtoView;
    if (isPresent(this.componentId)) {
      nestedProtoView = ListWrapper.removeAt(protoViews, 0);
    } else if (isPresent(this.nestedProtoView)) {
      nestedProtoView = this.nestedProtoView.mergeChildComponentProtoViews(protoViews, target);
    }
    return new ElementBinder({
      parentIndex: this.parentIndex,
      textNodeIndices: this.textNodeIndices,
      contentTagSelector: this.contentTagSelector,
      nestedProtoView: nestedProtoView,
      componentId: this.componentId,
      eventLocals: this.eventLocals,
      eventNames: this.eventNames,
      distanceToParent: this.distanceToParent,
      propertySetters: this.propertySetters
    });
  }
}
Object.defineProperty(ElementBinder.prototype.mergeChildComponentProtoViews, "parameters", {get: function() {
    return [[assert.genericType(List, protoViewModule.ProtoView)], [assert.genericType(List, protoViewModule.ProtoView)]];
  }});
//# sourceMappingURL=element_binder.js.map

//# sourceMappingURL=./element_binder.map