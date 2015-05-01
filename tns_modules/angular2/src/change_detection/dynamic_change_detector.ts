import {isPresent,
  isBlank,
  BaseException,
  FunctionWrapper} from 'angular2/src/facade/lang';
import {List,
  ListWrapper,
  MapWrapper,
  StringMapWrapper} from 'angular2/src/facade/collection';
import {AbstractChangeDetector} from './abstract_change_detector';
import {PipeRegistry} from './pipes/pipe_registry';
import {ChangeDetectionUtil,
  uninitialized} from './change_detection_util';
import {ProtoRecord,
  RECORD_TYPE_SELF,
  RECORD_TYPE_PROPERTY,
  RECORD_TYPE_LOCAL,
  RECORD_TYPE_INVOKE_METHOD,
  RECORD_TYPE_CONST,
  RECORD_TYPE_INVOKE_CLOSURE,
  RECORD_TYPE_PRIMITIVE_OP,
  RECORD_TYPE_KEYED_ACCESS,
  RECORD_TYPE_PIPE,
  RECORD_TYPE_BINDING_PIPE,
  RECORD_TYPE_INTERPOLATE} from './proto_record';
import {ExpressionChangedAfterItHasBeenChecked,
  ChangeDetectionError} from './exceptions';
export class DynamicChangeDetector extends AbstractChangeDetector {
  constructor(changeControlStrategy, dispatcher, pipeRegistry, protoRecords, directiveMementos) {
    super();
    this.dispatcher = dispatcher;
    this.pipeRegistry = pipeRegistry;
    this.values = ListWrapper.createFixedSize(protoRecords.length + 1);
    this.pipes = ListWrapper.createFixedSize(protoRecords.length + 1);
    this.prevContexts = ListWrapper.createFixedSize(protoRecords.length + 1);
    this.changes = ListWrapper.createFixedSize(protoRecords.length + 1);
    ListWrapper.fill(this.values, uninitialized);
    ListWrapper.fill(this.pipes, null);
    ListWrapper.fill(this.prevContexts, uninitialized);
    ListWrapper.fill(this.changes, false);
    this.locals = null;
    this.protos = protoRecords;
    this.directiveMementos = directiveMementos;
    this.changeControlStrategy = changeControlStrategy;
  }
  hydrate(context, locals) {
    this.mode = ChangeDetectionUtil.changeDetectionMode(this.changeControlStrategy);
    this.values[0] = context;
    this.locals = locals;
  }
  dehydrate() {
    this._destroyPipes();
    ListWrapper.fill(this.values, uninitialized);
    ListWrapper.fill(this.changes, false);
    ListWrapper.fill(this.pipes, null);
    ListWrapper.fill(this.prevContexts, uninitialized);
    this.locals = null;
  }
  _destroyPipes() {
    for (var i = 0; i < this.pipes.length; ++i) {
      if (isPresent(this.pipes[i])) {
        this.pipes[i].onDestroy();
      }
    }
  }
  hydrated() {
    return this.values[0] !== uninitialized;
  }
  detectChangesInRecords(throwOnChange) {
    var protos = this.protos;
    var changes = null;
    var currentDirectiveMemento = null;
    for (var i = 0; i < protos.length; ++i) {
      var proto = protos[i];
      if (isBlank(currentDirectiveMemento)) {
        currentDirectiveMemento = proto.directiveMemento;
      }
      var change = this._check(proto);
      if (isPresent(change)) {
        if (throwOnChange)
          ChangeDetectionUtil.throwOnChange(proto, change);
        this.dispatcher.invokeMementoFor(proto.bindingMemento, change.currentValue);
        if (isPresent(currentDirectiveMemento) && currentDirectiveMemento.callOnChange) {
          changes = ChangeDetectionUtil.addChange(changes, proto.bindingMemento, change);
        }
      }
      if (proto.lastInDirective) {
        if (isPresent(changes)) {
          this.dispatcher.onChange(currentDirectiveMemento, changes);
        }
        currentDirectiveMemento = null;
        changes = null;
      }
    }
  }
  callOnAllChangesDone() {
    var mementos = this.directiveMementos;
    for (var i = mementos.length - 1; i >= 0; --i) {
      var memento = mementos[i];
      if (memento.callOnAllChangesDone) {
        this.dispatcher.onAllChangesDone(memento);
      }
    }
  }
  _check(proto) {
    try {
      if (proto.mode === RECORD_TYPE_PIPE || proto.mode === RECORD_TYPE_BINDING_PIPE) {
        return this._pipeCheck(proto);
      } else {
        return this._referenceCheck(proto);
      }
    } catch (e) {
      throw new ChangeDetectionError(proto, e);
    }
  }
  _referenceCheck(proto) {
    if (this._pureFuncAndArgsDidNotChange(proto)) {
      this._setChanged(proto, false);
      return null;
    }
    var prevValue = this._readSelf(proto);
    var currValue = this._calculateCurrValue(proto);
    if (!isSame(prevValue, currValue)) {
      this._writeSelf(proto, currValue);
      this._setChanged(proto, true);
      if (proto.lastInBinding) {
        return ChangeDetectionUtil.simpleChange(prevValue, currValue);
      } else {
        return null;
      }
    } else {
      this._setChanged(proto, false);
      return null;
    }
  }
  _calculateCurrValue(proto) {
    switch (proto.mode) {
      case RECORD_TYPE_SELF:
        return this._readContext(proto);
      case RECORD_TYPE_CONST:
        return proto.funcOrValue;
      case RECORD_TYPE_PROPERTY:
        var context = this._readContext(proto);
        return proto.funcOrValue(context);
      case RECORD_TYPE_LOCAL:
        return this.locals.get(proto.name);
      case RECORD_TYPE_INVOKE_METHOD:
        var context = this._readContext(proto);
        var args = this._readArgs(proto);
        return proto.funcOrValue(context, args);
      case RECORD_TYPE_KEYED_ACCESS:
        var arg = this._readArgs(proto)[0];
        return this._readContext(proto)[arg];
      case RECORD_TYPE_INVOKE_CLOSURE:
        return FunctionWrapper.apply(this._readContext(proto), this._readArgs(proto));
      case RECORD_TYPE_INTERPOLATE:
      case RECORD_TYPE_PRIMITIVE_OP:
        return FunctionWrapper.apply(proto.funcOrValue, this._readArgs(proto));
      default:
        throw new BaseException(`Unknown operation ${proto.mode}`);
    }
  }
  _pipeCheck(proto) {
    var context = this._readContext(proto);
    var pipe = this._pipeFor(proto, context);
    var newValue = pipe.transform(context);
    if (!ChangeDetectionUtil.noChangeMarker(newValue)) {
      var prevValue = this._readSelf(proto);
      this._writeSelf(proto, newValue);
      this._setChanged(proto, true);
      if (proto.lastInBinding) {
        return ChangeDetectionUtil.simpleChange(prevValue, newValue);
      } else {
        return null;
      }
    } else {
      this._setChanged(proto, false);
      return null;
    }
  }
  _pipeFor(proto, context) {
    var storedPipe = this._readPipe(proto);
    if (isPresent(storedPipe) && storedPipe.supports(context)) {
      return storedPipe;
    }
    if (isPresent(storedPipe)) {
      storedPipe.onDestroy();
    }
    var bpc = proto.mode === RECORD_TYPE_BINDING_PIPE ? this.bindingPropagationConfig : null;
    var pipe = this.pipeRegistry.get(proto.name, context, bpc);
    this._writePipe(proto, pipe);
    return pipe;
  }
  _readContext(proto) {
    return this.values[proto.contextIndex];
  }
  _readSelf(proto) {
    return this.values[proto.selfIndex];
  }
  _writeSelf(proto, value) {
    this.values[proto.selfIndex] = value;
  }
  _readPipe(proto) {
    return this.pipes[proto.selfIndex];
  }
  _writePipe(proto, value) {
    this.pipes[proto.selfIndex] = value;
  }
  _setChanged(proto, value) {
    this.changes[proto.selfIndex] = value;
  }
  _pureFuncAndArgsDidNotChange(proto) {
    return proto.isPureFunction() && !this._argsChanged(proto);
  }
  _argsChanged(proto) {
    var args = proto.args;
    for (var i = 0; i < args.length; ++i) {
      if (this.changes[args[i]]) {
        return true;
      }
    }
    return false;
  }
  _readArgs(proto) {
    var res = ListWrapper.createFixedSize(proto.args.length);
    var args = proto.args;
    for (var i = 0; i < args.length; ++i) {
      res[i] = this.values[args[i]];
    }
    return res;
  }
}
Object.defineProperty(DynamicChangeDetector, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.any], [PipeRegistry], [assert.genericType(List, ProtoRecord)], [List]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype.hydrate, "parameters", {get: function() {
    return [[assert.type.any], [assert.type.any]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype.detectChangesInRecords, "parameters", {get: function() {
    return [[assert.type.boolean]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._check, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._referenceCheck, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._calculateCurrValue, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._pipeCheck, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._pipeFor, "parameters", {get: function() {
    return [[ProtoRecord], []];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._readContext, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._readSelf, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._writeSelf, "parameters", {get: function() {
    return [[ProtoRecord], []];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._readPipe, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._writePipe, "parameters", {get: function() {
    return [[ProtoRecord], []];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._setChanged, "parameters", {get: function() {
    return [[ProtoRecord], [assert.type.boolean]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._pureFuncAndArgsDidNotChange, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._argsChanged, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._readArgs, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
function isSame(a, b) {
  if (a === b)
    return true;
  if (a instanceof String && b instanceof String && a == b)
    return true;
  if ((a !== a) && (b !== b))
    return true;
  return false;
}
//# sourceMappingURL=dynamic_change_detector.js.map

//# sourceMappingURL=./dynamic_change_detector.map