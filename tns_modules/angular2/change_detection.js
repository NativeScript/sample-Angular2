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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var ast_1 = require('./src/change_detection/parser/ast');
exports.ASTWithSource = ast_1.ASTWithSource;
exports.AST = ast_1.AST;
exports.AstTransformer = ast_1.AstTransformer;
exports.AccessMember = ast_1.AccessMember;
exports.LiteralArray = ast_1.LiteralArray;
exports.ImplicitReceiver = ast_1.ImplicitReceiver;
var lexer_1 = require('./src/change_detection/parser/lexer');
exports.Lexer = lexer_1.Lexer;
var parser_1 = require('./src/change_detection/parser/parser');
exports.Parser = parser_1.Parser;
var locals_1 = require('./src/change_detection/parser/locals');
exports.Locals = locals_1.Locals;
var exceptions_1 = require('./src/change_detection/exceptions');
exports.ExpressionChangedAfterItHasBeenChecked = exceptions_1.ExpressionChangedAfterItHasBeenChecked;
exports.ChangeDetectionError = exceptions_1.ChangeDetectionError;
var interfaces_1 = require('./src/change_detection/interfaces');
exports.ProtoChangeDetector = interfaces_1.ProtoChangeDetector;
exports.ChangeRecord = interfaces_1.ChangeRecord;
exports.ChangeDispatcher = interfaces_1.ChangeDispatcher;
exports.ChangeDetector = interfaces_1.ChangeDetector;
exports.ChangeDetection = interfaces_1.ChangeDetection;
var constants_1 = require('./src/change_detection/constants');
exports.CHECK_ONCE = constants_1.CHECK_ONCE;
exports.CHECK_ALWAYS = constants_1.CHECK_ALWAYS;
exports.DETACHED = constants_1.DETACHED;
exports.CHECKED = constants_1.CHECKED;
exports.ON_PUSH = constants_1.ON_PUSH;
exports.DEFAULT = constants_1.DEFAULT;
var proto_change_detector_1 = require('./src/change_detection/proto_change_detector');
exports.DynamicProtoChangeDetector = proto_change_detector_1.DynamicProtoChangeDetector;
exports.JitProtoChangeDetector = proto_change_detector_1.JitProtoChangeDetector;
exports.BindingRecord = proto_change_detector_1.BindingRecord;
var dynamic_change_detector_1 = require('./src/change_detection/dynamic_change_detector');
exports.DynamicChangeDetector = dynamic_change_detector_1.DynamicChangeDetector;
var binding_propagation_config_1 = require('./src/change_detection/binding_propagation_config');
exports.BindingPropagationConfig = binding_propagation_config_1.BindingPropagationConfig;
__export(require('./src/change_detection/pipes/pipe_registry'));
var change_detection_util_1 = require('./src/change_detection/change_detection_util');
exports.uninitialized = change_detection_util_1.uninitialized;
__export(require('./src/change_detection/pipes/pipe'));
var proto_change_detector_2 = require('./src/change_detection/proto_change_detector');
var pipe_registry_2 = require('./src/change_detection/pipes/pipe_registry');
var iterable_changes_1 = require('./src/change_detection/pipes/iterable_changes');
var keyvalue_changes_1 = require('./src/change_detection/pipes/keyvalue_changes');
var null_pipe_1 = require('./src/change_detection/pipes/null_pipe');
var constants_2 = require('./src/change_detection/constants');
var interfaces_2 = require('./src/change_detection/interfaces');
exports.defaultPipes = {
    "iterableDiff": [new iterable_changes_1.IterableChangesFactory(), new null_pipe_1.NullPipeFactory()],
    "keyValDiff": [new keyvalue_changes_1.KeyValueChangesFactory(), new null_pipe_1.NullPipeFactory()]
};
var DynamicChangeDetection = (function (_super) {
    __extends(DynamicChangeDetection, _super);
    function DynamicChangeDetection(registry) {
        _super.call(this);
        this.registry = registry;
    }
    DynamicChangeDetection.prototype.createProtoChangeDetector = function (name, changeControlStrategy) {
        if (changeControlStrategy === void 0) { changeControlStrategy = constants_2.DEFAULT; }
        return new proto_change_detector_2.DynamicProtoChangeDetector(this.registry, changeControlStrategy);
    };
    return DynamicChangeDetection;
})(interfaces_2.ChangeDetection);
exports.DynamicChangeDetection = DynamicChangeDetection;
Object.defineProperty(DynamicChangeDetection, "parameters", { get: function () {
        return [[pipe_registry_2.PipeRegistry]];
    } });
Object.defineProperty(DynamicChangeDetection.prototype.createProtoChangeDetector, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
var JitChangeDetection = (function (_super) {
    __extends(JitChangeDetection, _super);
    function JitChangeDetection(registry) {
        _super.call(this);
        this.registry = registry;
    }
    JitChangeDetection.prototype.createProtoChangeDetector = function (name, changeControlStrategy) {
        if (changeControlStrategy === void 0) { changeControlStrategy = constants_2.DEFAULT; }
        return new proto_change_detector_2.JitProtoChangeDetector(this.registry, changeControlStrategy);
    };
    return JitChangeDetection;
})(interfaces_2.ChangeDetection);
exports.JitChangeDetection = JitChangeDetection;
Object.defineProperty(JitChangeDetection, "parameters", { get: function () {
        return [[pipe_registry_2.PipeRegistry]];
    } });
Object.defineProperty(JitChangeDetection.prototype.createProtoChangeDetector, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
var _registry = new pipe_registry_2.PipeRegistry(exports.defaultPipes);
exports.dynamicChangeDetection = new DynamicChangeDetection(_registry);
exports.jitChangeDetection = new JitChangeDetection(_registry);
