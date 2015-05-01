import {List} from 'angular2/src/facade/collection';
import {Locals} from './parser/locals';
import {AST} from './parser/ast';
export class ProtoChangeDetector {
  addAst(ast, bindingMemento, directiveMemento = null) {}
  instantiate(dispatcher, bindingRecords, variableBindings, directiveMemento) {
    return null;
  }
}
Object.defineProperty(ProtoChangeDetector.prototype.addAst, "parameters", {get: function() {
    return [[AST], [assert.type.any], [assert.type.any]];
  }});
Object.defineProperty(ProtoChangeDetector.prototype.instantiate, "parameters", {get: function() {
    return [[assert.type.any], [List], [List], [List]];
  }});
export class ChangeDetection {
  createProtoChangeDetector(name, changeControlStrategy) {
    return null;
  }
}
Object.defineProperty(ChangeDetection.prototype.createProtoChangeDetector, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string]];
  }});
export class ChangeRecord {
  constructor(bindingMemento, change) {
    this.bindingMemento = bindingMemento;
    this.change = change;
  }
  get currentValue() {
    return this.change.currentValue;
  }
  get previousValue() {
    return this.change.previousValue;
  }
}
export class ChangeDispatcher {
  onRecordChange(directiveMemento, records) {}
}
Object.defineProperty(ChangeDispatcher.prototype.onRecordChange, "parameters", {get: function() {
    return [[], [assert.genericType(List, ChangeRecord)]];
  }});
export class ChangeDetector {
  addChild(cd) {}
  removeChild(cd) {}
  remove() {}
  hydrate(context, locals) {}
  dehydrate() {}
  markPathToRootAsCheckOnce() {}
  detectChanges() {}
  checkNoChanges() {}
}
Object.defineProperty(ChangeDetector.prototype.addChild, "parameters", {get: function() {
    return [[ChangeDetector]];
  }});
Object.defineProperty(ChangeDetector.prototype.removeChild, "parameters", {get: function() {
    return [[ChangeDetector]];
  }});
Object.defineProperty(ChangeDetector.prototype.hydrate, "parameters", {get: function() {
    return [[assert.type.any], [Locals]];
  }});
//# sourceMappingURL=interfaces.js.map

//# sourceMappingURL=./interfaces.map