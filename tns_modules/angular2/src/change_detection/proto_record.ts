import {List} from 'angular2/src/facade/collection';
export const RECORD_TYPE_SELF = 0;
export const RECORD_TYPE_CONST = 1;
export const RECORD_TYPE_PRIMITIVE_OP = 2;
export const RECORD_TYPE_PROPERTY = 3;
export const RECORD_TYPE_LOCAL = 4;
export const RECORD_TYPE_INVOKE_METHOD = 5;
export const RECORD_TYPE_INVOKE_CLOSURE = 6;
export const RECORD_TYPE_KEYED_ACCESS = 7;
export const RECORD_TYPE_PIPE = 8;
export const RECORD_TYPE_BINDING_PIPE = 9;
export const RECORD_TYPE_INTERPOLATE = 10;
export class ProtoRecord {
  constructor(mode, name, funcOrValue, args, fixedArgs, contextIndex, selfIndex, bindingMemento, directiveMemento, expressionAsString, lastInBinding, lastInDirective) {
    this.mode = mode;
    this.name = name;
    this.funcOrValue = funcOrValue;
    this.args = args;
    this.fixedArgs = fixedArgs;
    this.contextIndex = contextIndex;
    this.selfIndex = selfIndex;
    this.bindingMemento = bindingMemento;
    this.directiveMemento = directiveMemento;
    this.lastInBinding = lastInBinding;
    this.lastInDirective = lastInDirective;
    this.expressionAsString = expressionAsString;
  }
  isPureFunction() {
    return this.mode === RECORD_TYPE_INTERPOLATE || this.mode === RECORD_TYPE_PRIMITIVE_OP;
  }
}
Object.defineProperty(ProtoRecord, "parameters", {get: function() {
    return [[assert.type.number], [assert.type.string], [], [List], [List], [assert.type.number], [assert.type.number], [assert.type.any], [assert.type.any], [assert.type.string], [assert.type.boolean], [assert.type.boolean]];
  }});
//# sourceMappingURL=proto_record.js.map

//# sourceMappingURL=./proto_record.map