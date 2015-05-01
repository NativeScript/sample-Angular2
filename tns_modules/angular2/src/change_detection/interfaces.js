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
var collection_1 = require('angular2/src/facade/collection');
var locals_1 = require('./parser/locals');
var ast_1 = require('./parser/ast');
var ProtoChangeDetector = (function () {
    function ProtoChangeDetector() {
    }
    ProtoChangeDetector.prototype.addAst = function (ast, bindingMemento, directiveMemento) {
        if (directiveMemento === void 0) { directiveMemento = null; }
    };
    ProtoChangeDetector.prototype.instantiate = function (dispatcher, bindingRecords, variableBindings, directiveMemento) {
        return null;
    };
    return ProtoChangeDetector;
})();
exports.ProtoChangeDetector = ProtoChangeDetector;
Object.defineProperty(ProtoChangeDetector.prototype.addAst, "parameters", { get: function () {
        return [[ast_1.AST], [assert.type.any], [assert.type.any]];
    } });
Object.defineProperty(ProtoChangeDetector.prototype.instantiate, "parameters", { get: function () {
        return [[assert.type.any], [collection_1.List], [collection_1.List], [collection_1.List]];
    } });
var ChangeDetection = (function () {
    function ChangeDetection() {
    }
    ChangeDetection.prototype.createProtoChangeDetector = function (name, changeControlStrategy) {
        return null;
    };
    return ChangeDetection;
})();
exports.ChangeDetection = ChangeDetection;
Object.defineProperty(ChangeDetection.prototype.createProtoChangeDetector, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
var ChangeRecord = (function () {
    function ChangeRecord(bindingMemento, change) {
        this.bindingMemento = bindingMemento;
        this.change = change;
    }
    Object.defineProperty(ChangeRecord.prototype, "currentValue", {
        get: function () {
            return this.change.currentValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChangeRecord.prototype, "previousValue", {
        get: function () {
            return this.change.previousValue;
        },
        enumerable: true,
        configurable: true
    });
    return ChangeRecord;
})();
exports.ChangeRecord = ChangeRecord;
var ChangeDispatcher = (function () {
    function ChangeDispatcher() {
    }
    ChangeDispatcher.prototype.onRecordChange = function (directiveMemento, records) { };
    return ChangeDispatcher;
})();
exports.ChangeDispatcher = ChangeDispatcher;
Object.defineProperty(ChangeDispatcher.prototype.onRecordChange, "parameters", { get: function () {
        return [[], [assert.genericType(collection_1.List, ChangeRecord)]];
    } });
var ChangeDetector = (function () {
    function ChangeDetector() {
    }
    ChangeDetector.prototype.addChild = function (cd) { };
    ChangeDetector.prototype.removeChild = function (cd) { };
    ChangeDetector.prototype.remove = function () { };
    ChangeDetector.prototype.hydrate = function (context, locals) { };
    ChangeDetector.prototype.dehydrate = function () { };
    ChangeDetector.prototype.markPathToRootAsCheckOnce = function () { };
    ChangeDetector.prototype.detectChanges = function () { };
    ChangeDetector.prototype.checkNoChanges = function () { };
    return ChangeDetector;
})();
exports.ChangeDetector = ChangeDetector;
Object.defineProperty(ChangeDetector.prototype.addChild, "parameters", { get: function () {
        return [[ChangeDetector]];
    } });
Object.defineProperty(ChangeDetector.prototype.removeChild, "parameters", { get: function () {
        return [[ChangeDetector]];
    } });
Object.defineProperty(ChangeDetector.prototype.hydrate, "parameters", { get: function () {
        return [[assert.type.any], [locals_1.Locals]];
    } });
