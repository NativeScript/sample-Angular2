var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var __decorate = this.__decorate || function (decorators, target, key, value) {
    var kind = typeof (arguments.length == 2 ? value = target : value);
    for (var i = decorators.length - 1; i >= 0; --i) {
        var decorator = decorators[i];
        switch (kind) {
            case "function": value = decorator(value) || value; break;
            case "number": decorator(target, key, value); break;
            case "undefined": decorator(target, key); break;
            case "object": value = decorator(target, key, value) || value; break;
        }
    }
    return value;
};
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var abstract_change_detector_1 = require('./abstract_change_detector');
var pipe_registry_1 = require('./pipes/pipe_registry');
var change_detection_util_1 = require('./change_detection_util');
var proto_record_1 = require('./proto_record');
var exceptions_1 = require('./exceptions');
var DynamicChangeDetector = (function (_super) {
    __extends(DynamicChangeDetector, _super);
    function DynamicChangeDetector(changeControlStrategy, dispatcher, pipeRegistry, protoRecords, directiveMementos) {
        _super.call(this);
        this.dispatcher = dispatcher;
        this.pipeRegistry = pipeRegistry;
        this.values = collection_1.ListWrapper.createFixedSize(protoRecords.length + 1);
        this.pipes = collection_1.ListWrapper.createFixedSize(protoRecords.length + 1);
        this.prevContexts = collection_1.ListWrapper.createFixedSize(protoRecords.length + 1);
        this.changes = collection_1.ListWrapper.createFixedSize(protoRecords.length + 1);
        collection_1.ListWrapper.fill(this.values, change_detection_util_1.uninitialized);
        collection_1.ListWrapper.fill(this.pipes, null);
        collection_1.ListWrapper.fill(this.prevContexts, change_detection_util_1.uninitialized);
        collection_1.ListWrapper.fill(this.changes, false);
        this.locals = null;
        this.protos = protoRecords;
        this.directiveMementos = directiveMementos;
        this.changeControlStrategy = changeControlStrategy;
    }
    DynamicChangeDetector.prototype.hydrate = function (context, locals) {
        this.mode = change_detection_util_1.ChangeDetectionUtil.changeDetectionMode(this.changeControlStrategy);
        this.values[0] = context;
        this.locals = locals;
    };
    DynamicChangeDetector.prototype.dehydrate = function () {
        this._destroyPipes();
        collection_1.ListWrapper.fill(this.values, change_detection_util_1.uninitialized);
        collection_1.ListWrapper.fill(this.changes, false);
        collection_1.ListWrapper.fill(this.pipes, null);
        collection_1.ListWrapper.fill(this.prevContexts, change_detection_util_1.uninitialized);
        this.locals = null;
    };
    DynamicChangeDetector.prototype._destroyPipes = function () {
        for (var i = 0; i < this.pipes.length; ++i) {
            if (lang_1.isPresent(this.pipes[i])) {
                this.pipes[i].onDestroy();
            }
        }
    };
    DynamicChangeDetector.prototype.hydrated = function () {
        return this.values[0] !== change_detection_util_1.uninitialized;
    };
    DynamicChangeDetector.prototype.detectChangesInRecords = function (throwOnChange) {
        var protos = this.protos;
        var changes = null;
        var currentDirectiveMemento = null;
        for (var i = 0; i < protos.length; ++i) {
            var proto = protos[i];
            if (lang_1.isBlank(currentDirectiveMemento)) {
                currentDirectiveMemento = proto.directiveMemento;
            }
            var change = this._check(proto);
            if (lang_1.isPresent(change)) {
                if (throwOnChange)
                    change_detection_util_1.ChangeDetectionUtil.throwOnChange(proto, change);
                this.dispatcher.invokeMementoFor(proto.bindingMemento, change.currentValue);
                if (lang_1.isPresent(currentDirectiveMemento) && currentDirectiveMemento.callOnChange) {
                    changes = change_detection_util_1.ChangeDetectionUtil.addChange(changes, proto.bindingMemento, change);
                }
            }
            if (proto.lastInDirective) {
                if (lang_1.isPresent(changes)) {
                    this.dispatcher.onChange(currentDirectiveMemento, changes);
                }
                currentDirectiveMemento = null;
                changes = null;
            }
        }
    };
    DynamicChangeDetector.prototype.callOnAllChangesDone = function () {
        var mementos = this.directiveMementos;
        for (var i = mementos.length - 1; i >= 0; --i) {
            var memento = mementos[i];
            if (memento.callOnAllChangesDone) {
                this.dispatcher.onAllChangesDone(memento);
            }
        }
    };
    DynamicChangeDetector.prototype._check = function (proto) {
        try {
            if (proto.mode === proto_record_1.RECORD_TYPE_PIPE || proto.mode === proto_record_1.RECORD_TYPE_BINDING_PIPE) {
                return this._pipeCheck(proto);
            }
            else {
                return this._referenceCheck(proto);
            }
        }
        catch (e) {
            throw new exceptions_1.ChangeDetectionError(proto, e);
        }
    };
    DynamicChangeDetector.prototype._referenceCheck = function (proto) {
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
                return change_detection_util_1.ChangeDetectionUtil.simpleChange(prevValue, currValue);
            }
            else {
                return null;
            }
        }
        else {
            this._setChanged(proto, false);
            return null;
        }
    };
    DynamicChangeDetector.prototype._calculateCurrValue = function (proto) {
        switch (proto.mode) {
            case proto_record_1.RECORD_TYPE_SELF:
                return this._readContext(proto);
            case proto_record_1.RECORD_TYPE_CONST:
                return proto.funcOrValue;
            case proto_record_1.RECORD_TYPE_PROPERTY:
                var context = this._readContext(proto);
                return proto.funcOrValue(context);
            case proto_record_1.RECORD_TYPE_LOCAL:
                return this.locals.get(proto.name);
            case proto_record_1.RECORD_TYPE_INVOKE_METHOD:
                var context = this._readContext(proto);
                var args = this._readArgs(proto);
                return proto.funcOrValue(context, args);
            case proto_record_1.RECORD_TYPE_KEYED_ACCESS:
                var arg = this._readArgs(proto)[0];
                return this._readContext(proto)[arg];
            case proto_record_1.RECORD_TYPE_INVOKE_CLOSURE:
                return lang_1.FunctionWrapper.apply(this._readContext(proto), this._readArgs(proto));
            case proto_record_1.RECORD_TYPE_INTERPOLATE:
            case proto_record_1.RECORD_TYPE_PRIMITIVE_OP:
                return lang_1.FunctionWrapper.apply(proto.funcOrValue, this._readArgs(proto));
            default:
                throw new lang_1.BaseException("Unknown operation " + proto.mode);
        }
    };
    DynamicChangeDetector.prototype._pipeCheck = function (proto) {
        var context = this._readContext(proto);
        var pipe = this._pipeFor(proto, context);
        var newValue = pipe.transform(context);
        if (!change_detection_util_1.ChangeDetectionUtil.noChangeMarker(newValue)) {
            var prevValue = this._readSelf(proto);
            this._writeSelf(proto, newValue);
            this._setChanged(proto, true);
            if (proto.lastInBinding) {
                return change_detection_util_1.ChangeDetectionUtil.simpleChange(prevValue, newValue);
            }
            else {
                return null;
            }
        }
        else {
            this._setChanged(proto, false);
            return null;
        }
    };
    DynamicChangeDetector.prototype._pipeFor = function (proto, context) {
        var storedPipe = this._readPipe(proto);
        if (lang_1.isPresent(storedPipe) && storedPipe.supports(context)) {
            return storedPipe;
        }
        if (lang_1.isPresent(storedPipe)) {
            storedPipe.onDestroy();
        }
        var bpc = proto.mode === proto_record_1.RECORD_TYPE_BINDING_PIPE ? this.bindingPropagationConfig : null;
        var pipe = this.pipeRegistry.get(proto.name, context, bpc);
        this._writePipe(proto, pipe);
        return pipe;
    };
    DynamicChangeDetector.prototype._readContext = function (proto) {
        return this.values[proto.contextIndex];
    };
    DynamicChangeDetector.prototype._readSelf = function (proto) {
        return this.values[proto.selfIndex];
    };
    DynamicChangeDetector.prototype._writeSelf = function (proto, value) {
        this.values[proto.selfIndex] = value;
    };
    DynamicChangeDetector.prototype._readPipe = function (proto) {
        return this.pipes[proto.selfIndex];
    };
    DynamicChangeDetector.prototype._writePipe = function (proto, value) {
        this.pipes[proto.selfIndex] = value;
    };
    DynamicChangeDetector.prototype._setChanged = function (proto, value) {
        this.changes[proto.selfIndex] = value;
    };
    DynamicChangeDetector.prototype._pureFuncAndArgsDidNotChange = function (proto) {
        return proto.isPureFunction() && !this._argsChanged(proto);
    };
    DynamicChangeDetector.prototype._argsChanged = function (proto) {
        var args = proto.args;
        for (var i = 0; i < args.length; ++i) {
            if (this.changes[args[i]]) {
                return true;
            }
        }
        return false;
    };
    DynamicChangeDetector.prototype._readArgs = function (proto) {
        var res = collection_1.ListWrapper.createFixedSize(proto.args.length);
        var args = proto.args;
        for (var i = 0; i < args.length; ++i) {
            res[i] = this.values[args[i]];
        }
        return res;
    };
    return DynamicChangeDetector;
})(abstract_change_detector_1.AbstractChangeDetector);
exports.DynamicChangeDetector = DynamicChangeDetector;
Object.defineProperty(DynamicChangeDetector, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.any], [pipe_registry_1.PipeRegistry], [assert.genericType(collection_1.List, proto_record_1.ProtoRecord)], [collection_1.List]];
    } });
Object.defineProperty(DynamicChangeDetector.prototype.hydrate, "parameters", { get: function () {
        return [[assert.type.any], [assert.type.any]];
    } });
Object.defineProperty(DynamicChangeDetector.prototype.detectChangesInRecords, "parameters", { get: function () {
        return [[assert.type.boolean]];
    } });
Object.defineProperty(DynamicChangeDetector.prototype._check, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord]];
    } });
Object.defineProperty(DynamicChangeDetector.prototype._referenceCheck, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord]];
    } });
Object.defineProperty(DynamicChangeDetector.prototype._calculateCurrValue, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord]];
    } });
Object.defineProperty(DynamicChangeDetector.prototype._pipeCheck, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord]];
    } });
Object.defineProperty(DynamicChangeDetector.prototype._pipeFor, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord], []];
    } });
Object.defineProperty(DynamicChangeDetector.prototype._readContext, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord]];
    } });
Object.defineProperty(DynamicChangeDetector.prototype._readSelf, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord]];
    } });
Object.defineProperty(DynamicChangeDetector.prototype._writeSelf, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord], []];
    } });
Object.defineProperty(DynamicChangeDetector.prototype._readPipe, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord]];
    } });
Object.defineProperty(DynamicChangeDetector.prototype._writePipe, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord], []];
    } });
Object.defineProperty(DynamicChangeDetector.prototype._setChanged, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord], [assert.type.boolean]];
    } });
Object.defineProperty(DynamicChangeDetector.prototype._pureFuncAndArgsDidNotChange, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord]];
    } });
Object.defineProperty(DynamicChangeDetector.prototype._argsChanged, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord]];
    } });
Object.defineProperty(DynamicChangeDetector.prototype._readArgs, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord]];
    } });
function isSame(a, b) {
    if (a === b)
        return true;
    if (a instanceof String && b instanceof String && a == b)
        return true;
    if ((a !== a) && (b !== b))
        return true;
    return false;
}
