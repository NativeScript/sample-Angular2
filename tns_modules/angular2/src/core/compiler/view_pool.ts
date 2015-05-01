import {ListWrapper,
  MapWrapper,
  StringMapWrapper,
  List} from 'angular2/src/facade/collection';
import * as viewModule from './view';
export class ViewPool {
  constructor(capacity) {
    this._views = [];
    this._capacity = capacity;
  }
  pop() {
    return ListWrapper.isEmpty(this._views) ? null : ListWrapper.removeLast(this._views);
  }
  push(view) {
    if (this._views.length < this._capacity) {
      ListWrapper.push(this._views, view);
    }
  }
  length() {
    return this._views.length;
  }
}
Object.defineProperty(ViewPool, "parameters", {get: function() {
    return [[assert.type.number]];
  }});
Object.defineProperty(ViewPool.prototype.push, "parameters", {get: function() {
    return [[viewModule.View]];
  }});
//# sourceMappingURL=view_pool.js.map

//# sourceMappingURL=./view_pool.map