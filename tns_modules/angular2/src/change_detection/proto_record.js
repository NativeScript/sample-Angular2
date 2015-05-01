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
exports.RECORD_TYPE_SELF = 0;
exports.RECORD_TYPE_CONST = 1;
exports.RECORD_TYPE_PRIMITIVE_OP = 2;
exports.RECORD_TYPE_PROPERTY = 3;
exports.RECORD_TYPE_LOCAL = 4;
exports.RECORD_TYPE_INVOKE_METHOD = 5;
exports.RECORD_TYPE_INVOKE_CLOSURE = 6;
exports.RECORD_TYPE_KEYED_ACCESS = 7;
exports.RECORD_TYPE_PIPE = 8;
exports.RECORD_TYPE_BINDING_PIPE = 9;
exports.RECORD_TYPE_INTERPOLATE = 10;
var ProtoRecord = (function () {
    function ProtoRecord(mode, name, funcOrValue, args, fixedArgs, contextIndex, selfIndex, bindingMemento, directiveMemento, expressionAsString, lastInBinding, lastInDirective) {
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
    ProtoRecord.prototype.isPureFunction = function () {
        return this.mode === exports.RECORD_TYPE_INTERPOLATE || this.mode === exports.RECORD_TYPE_PRIMITIVE_OP;
    };
    return ProtoRecord;
})();
exports.ProtoRecord = ProtoRecord;
Object.defineProperty(ProtoRecord, "parameters", { get: function () {
        return [[assert.type.number], [assert.type.string], [], [collection_1.List], [collection_1.List], [assert.type.number], [assert.type.number], [assert.type.any], [assert.type.any], [assert.type.string], [assert.type.boolean], [assert.type.boolean]];
    } });
