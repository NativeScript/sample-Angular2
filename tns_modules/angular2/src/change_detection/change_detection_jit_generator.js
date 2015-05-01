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
var change_detection_util_1 = require('./change_detection_util');
var proto_record_1 = require('./proto_record');
var ABSTRACT_CHANGE_DETECTOR = "AbstractChangeDetector";
var UTIL = "ChangeDetectionUtil";
var DISPATCHER_ACCESSOR = "this.dispatcher";
var PIPE_REGISTRY_ACCESSOR = "this.pipeRegistry";
var PROTOS_ACCESSOR = "this.protos";
var MEMENTOS_ACCESSOR = "this.directiveMementos";
var CONTEXT_ACCESSOR = "this.context";
var CHANGE_LOCAL = "change";
var CHANGES_LOCAL = "changes";
var LOCALS_ACCESSOR = "this.locals";
var MODE_ACCESSOR = "this.mode";
var TEMP_LOCAL = "temp";
var CURRENT_PROTO = "currentProto";
function typeTemplate(type, cons, detectChanges, notifyOnAllChangesDone, setContext) {
    return "\n" + cons + "\n" + detectChanges + "\n" + notifyOnAllChangesDone + "\n" + setContext + ";\n\nreturn function(dispatcher, pipeRegistry) {\n  return new " + type + "(dispatcher, pipeRegistry, protos, directiveMementos);\n}\n";
}
Object.defineProperty(typeTemplate, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string]];
    } });
function constructorTemplate(type, fieldsDefinitions) {
    return "\nvar " + type + " = function " + type + "(dispatcher, pipeRegistry, protos, directiveMementos) {\n" + ABSTRACT_CHANGE_DETECTOR + ".call(this);\n" + DISPATCHER_ACCESSOR + " = dispatcher;\n" + PIPE_REGISTRY_ACCESSOR + " = pipeRegistry;\n" + PROTOS_ACCESSOR + " = protos;\n" + MEMENTOS_ACCESSOR + " = directiveMementos;\n" + LOCALS_ACCESSOR + " = null;\n" + fieldsDefinitions + "\n}\n\n" + type + ".prototype = Object.create(" + ABSTRACT_CHANGE_DETECTOR + ".prototype);\n";
}
Object.defineProperty(constructorTemplate, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
function pipeOnDestroyTemplate(pipeNames) {
    return pipeNames.map(function (p) { return (p + ".onDestroy()"); }).join("\n");
}
Object.defineProperty(pipeOnDestroyTemplate, "parameters", { get: function () {
        return [[collection_1.List]];
    } });
function hydrateTemplate(type, mode, fieldsDefinitions, pipeOnDestroy) {
    return "\n" + type + ".prototype.hydrate = function(context, locals) {\n  " + MODE_ACCESSOR + " = \"" + mode + "\";\n  " + CONTEXT_ACCESSOR + " = context;\n  " + LOCALS_ACCESSOR + " = locals;\n}\n" + type + ".prototype.dehydrate = function() {\n  " + pipeOnDestroy + "\n  " + fieldsDefinitions + "\n  " + LOCALS_ACCESSOR + " = null;\n}\n" + type + ".prototype.hydrated = function() {\n  return " + CONTEXT_ACCESSOR + " !== " + UTIL + ".unitialized();\n}\n";
}
Object.defineProperty(hydrateTemplate, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string]];
    } });
function detectChangesTemplate(type, body) {
    return "\n" + type + ".prototype.detectChangesInRecords = function(throwOnChange) {\n  " + body + "\n}\n";
}
Object.defineProperty(detectChangesTemplate, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
function callOnAllChangesDoneTemplate(type, body) {
    return "\n" + type + ".prototype.callOnAllChangesDone = function() {\n  " + body + "\n}\n";
}
Object.defineProperty(callOnAllChangesDoneTemplate, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
function onAllChangesDoneTemplate(index) {
    return DISPATCHER_ACCESSOR + ".onAllChangesDone(" + MEMENTOS_ACCESSOR + "[" + index + "]);";
}
Object.defineProperty(onAllChangesDoneTemplate, "parameters", { get: function () {
        return [[assert.type.number]];
    } });
function detectChangesBodyTemplate(localDefinitions, changeDefinitions, records) {
    return "\n" + localDefinitions + "\n" + changeDefinitions + "\nvar " + TEMP_LOCAL + ";\nvar " + CHANGE_LOCAL + ";\nvar " + CURRENT_PROTO + ";\nvar " + CHANGES_LOCAL + " = null;\n\ncontext = " + CONTEXT_ACCESSOR + ";\n" + records + "\n";
}
Object.defineProperty(detectChangesBodyTemplate, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string], [assert.type.string]];
    } });
function pipeCheckTemplate(protoIndex, context, bindingPropagationConfig, pipe, pipeType, oldValue, newValue, change, invokeMementoAndAddChange, addToChanges, lastInDirective) {
    return "\n" + CURRENT_PROTO + " = " + PROTOS_ACCESSOR + "[" + protoIndex + "];\nif (" + pipe + " === " + UTIL + ".unitialized()) {\n  " + pipe + " = " + PIPE_REGISTRY_ACCESSOR + ".get('" + pipeType + "', " + context + ", " + bindingPropagationConfig + ");\n} else if (!" + pipe + ".supports(" + context + ")) {\n  " + pipe + ".onDestroy();\n  " + pipe + " = " + PIPE_REGISTRY_ACCESSOR + ".get('" + pipeType + "', " + context + ", " + bindingPropagationConfig + ");\n}\n\n" + newValue + " = " + pipe + ".transform(" + context + ");\nif (! " + UTIL + ".noChangeMarker(" + newValue + ")) {\n  " + change + " = true;\n  " + invokeMementoAndAddChange + "\n  " + addToChanges + "\n  " + oldValue + " = " + newValue + ";\n}\n" + lastInDirective + "\n";
}
Object.defineProperty(pipeCheckTemplate, "parameters", { get: function () {
        return [[assert.type.number], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [], [assert.type.string]];
    } });
function referenceCheckTemplate(protoIndex, assignment, oldValue, newValue, change, invokeMementoAndAddChange, addToChanges, lastInDirective) {
    return "\n" + CURRENT_PROTO + " = " + PROTOS_ACCESSOR + "[" + protoIndex + "];\n" + assignment + "\nif (" + newValue + " !== " + oldValue + " || (" + newValue + " !== " + newValue + ") && (" + oldValue + " !== " + oldValue + ")) {\n  " + change + " = true;\n  " + invokeMementoAndAddChange + "\n  " + addToChanges + "\n  " + oldValue + " = " + newValue + ";\n}\n" + lastInDirective + "\n";
}
Object.defineProperty(referenceCheckTemplate, "parameters", { get: function () {
        return [[assert.type.number], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string]];
    } });
function assignmentTemplate(field, value) {
    return field + " = " + value + ";";
}
Object.defineProperty(assignmentTemplate, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
function localDefinitionsTemplate(names) {
    return names.map(function (n) { return ("var " + n + ";"); }).join("\n");
}
Object.defineProperty(localDefinitionsTemplate, "parameters", { get: function () {
        return [[collection_1.List]];
    } });
function changeDefinitionsTemplate(names) {
    return names.map(function (n) { return ("var " + n + " = false;"); }).join("\n");
}
Object.defineProperty(changeDefinitionsTemplate, "parameters", { get: function () {
        return [[collection_1.List]];
    } });
function fieldDefinitionsTemplate(names) {
    return names.map(function (n) { return (n + " = " + UTIL + ".unitialized();"); }).join("\n");
}
Object.defineProperty(fieldDefinitionsTemplate, "parameters", { get: function () {
        return [[collection_1.List]];
    } });
function ifChangedGuardTemplate(changeNames, body) {
    var cond = changeNames.join(" || ");
    return "\nif (" + cond + ") {\n  " + body + "\n}\n";
}
Object.defineProperty(ifChangedGuardTemplate, "parameters", { get: function () {
        return [[collection_1.List], [assert.type.string]];
    } });
function addToChangesTemplate(oldValue, newValue) {
    return CHANGES_LOCAL + " = " + UTIL + ".addChange(" + CHANGES_LOCAL + ", " + CURRENT_PROTO + ".bindingMemento, " + UTIL + ".simpleChange(" + oldValue + ", " + newValue + "));";
}
Object.defineProperty(addToChangesTemplate, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
function invokeBindingMemento(oldValue, newValue) {
    return "\nif(throwOnChange) " + UTIL + ".throwOnChange(" + CURRENT_PROTO + ", " + UTIL + ".simpleChange(" + oldValue + ", " + newValue + "));\n\n" + DISPATCHER_ACCESSOR + ".invokeMementoFor(" + CURRENT_PROTO + ".bindingMemento, " + newValue + ");\n  ";
}
Object.defineProperty(invokeBindingMemento, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
function lastInDirectiveTemplate(protoIndex) {
    return "\nif (" + CHANGES_LOCAL + ") {\n  " + DISPATCHER_ACCESSOR + ".onChange(" + PROTOS_ACCESSOR + "[" + protoIndex + "].directiveMemento, " + CHANGES_LOCAL + ");\n}\n" + CHANGES_LOCAL + " = null;\n";
}
Object.defineProperty(lastInDirectiveTemplate, "parameters", { get: function () {
        return [[assert.type.number]];
    } });
var ChangeDetectorJITGenerator = (function () {
    function ChangeDetectorJITGenerator(typeName, changeDetectionStrategy, records, directiveMementos) {
        this.typeName = typeName;
        this.changeDetectionStrategy = changeDetectionStrategy;
        this.records = records;
        this.directiveMementos = directiveMementos;
        this.localNames = this.getLocalNames(records);
        this.changeNames = this.getChangeNames(this.localNames);
        this.fieldNames = this.getFieldNames(this.localNames);
        this.pipeNames = this.getPipeNames(this.localNames);
    }
    ChangeDetectorJITGenerator.prototype.getLocalNames = function (records) {
        var index = 0;
        var names = records.map(function (r) {
            var sanitizedName = r.name.replace(new RegExp("\\W", "g"), '');
            return "" + sanitizedName + index++;
        });
        return ["context"].concat(names);
    };
    ChangeDetectorJITGenerator.prototype.getChangeNames = function (localNames) {
        return localNames.map(function (n) { return ("change_" + n); });
    };
    ChangeDetectorJITGenerator.prototype.getFieldNames = function (localNames) {
        return localNames.map(function (n) { return ("this." + n); });
    };
    ChangeDetectorJITGenerator.prototype.getPipeNames = function (localNames) {
        return localNames.map(function (n) { return ("this." + n + "_pipe"); });
    };
    ChangeDetectorJITGenerator.prototype.generate = function () {
        var text = typeTemplate(this.typeName, this.genConstructor(), this.genDetectChanges(), this.genCallOnAllChangesDone(), this.genHydrate());
        return new Function('AbstractChangeDetector', 'ChangeDetectionUtil', 'protos', 'directiveMementos', text)(abstract_change_detector_1.AbstractChangeDetector, change_detection_util_1.ChangeDetectionUtil, this.records, this.directiveMementos);
    };
    ChangeDetectorJITGenerator.prototype.genConstructor = function () {
        return constructorTemplate(this.typeName, this.genFieldDefinitions());
    };
    ChangeDetectorJITGenerator.prototype.genHydrate = function () {
        var mode = change_detection_util_1.ChangeDetectionUtil.changeDetectionMode(this.changeDetectionStrategy);
        return hydrateTemplate(this.typeName, mode, this.genFieldDefinitions(), pipeOnDestroyTemplate(this.getNonNullPipeNames()));
    };
    ChangeDetectorJITGenerator.prototype.genFieldDefinitions = function () {
        var fields = [];
        fields = fields.concat(this.fieldNames);
        fields = fields.concat(this.getNonNullPipeNames());
        return fieldDefinitionsTemplate(fields);
    };
    ChangeDetectorJITGenerator.prototype.getNonNullPipeNames = function () {
        var _this = this;
        var pipes = [];
        this.records.forEach(function (r) {
            if (r.mode === proto_record_1.RECORD_TYPE_PIPE || r.mode === proto_record_1.RECORD_TYPE_BINDING_PIPE) {
                pipes.push(_this.pipeNames[r.selfIndex]);
            }
        });
        return pipes;
    };
    ChangeDetectorJITGenerator.prototype.genDetectChanges = function () {
        var body = this.genDetectChangesBody();
        return detectChangesTemplate(this.typeName, body);
    };
    ChangeDetectorJITGenerator.prototype.genCallOnAllChangesDone = function () {
        var notifications = [];
        var mementos = this.directiveMementos;
        for (var i = mementos.length - 1; i >= 0; --i) {
            var memento = mementos[i];
            if (memento.callOnAllChangesDone) {
                notifications.push(onAllChangesDoneTemplate(i));
            }
        }
        return callOnAllChangesDoneTemplate(this.typeName, notifications.join(";\n"));
    };
    ChangeDetectorJITGenerator.prototype.genDetectChangesBody = function () {
        var _this = this;
        var rec = this.records.map(function (r) { return _this.genRecord(r); }).join("\n");
        return detectChangesBodyTemplate(this.genLocalDefinitions(), this.genChangeDefinitions(), rec);
    };
    ChangeDetectorJITGenerator.prototype.genLocalDefinitions = function () {
        return localDefinitionsTemplate(this.localNames);
    };
    ChangeDetectorJITGenerator.prototype.genChangeDefinitions = function () {
        return changeDefinitionsTemplate(this.changeNames);
    };
    ChangeDetectorJITGenerator.prototype.genRecord = function (r) {
        if (r.mode === proto_record_1.RECORD_TYPE_PIPE || r.mode === proto_record_1.RECORD_TYPE_BINDING_PIPE) {
            return this.genPipeCheck(r);
        }
        else {
            return this.genReferenceCheck(r);
        }
    };
    ChangeDetectorJITGenerator.prototype.genPipeCheck = function (r) {
        var context = this.localNames[r.contextIndex];
        var oldValue = this.fieldNames[r.selfIndex];
        var newValue = this.localNames[r.selfIndex];
        var change = this.changeNames[r.selfIndex];
        var pipe = this.pipeNames[r.selfIndex];
        var bpc = r.mode === proto_record_1.RECORD_TYPE_BINDING_PIPE ? "this.bindingPropagationConfig" : "null";
        var invokeMemento = this.getInvokeMementoAndAddChangeTemplate(r);
        var addToChanges = this.genAddToChanges(r);
        var lastInDirective = this.genLastInDirective(r);
        return pipeCheckTemplate(r.selfIndex - 1, context, bpc, pipe, r.name, oldValue, newValue, change, invokeMemento, addToChanges, lastInDirective);
    };
    ChangeDetectorJITGenerator.prototype.genReferenceCheck = function (r) {
        var oldValue = this.fieldNames[r.selfIndex];
        var newValue = this.localNames[r.selfIndex];
        var change = this.changeNames[r.selfIndex];
        var assignment = this.genUpdateCurrentValue(r);
        var invokeMemento = this.getInvokeMementoAndAddChangeTemplate(r);
        var addToChanges = this.genAddToChanges(r);
        var lastInDirective = this.genLastInDirective(r);
        var check = referenceCheckTemplate(r.selfIndex - 1, assignment, oldValue, newValue, change, invokeMemento, addToChanges, lastInDirective);
        if (r.isPureFunction()) {
            return this.ifChangedGuard(r, check);
        }
        else {
            return check;
        }
    };
    ChangeDetectorJITGenerator.prototype.genUpdateCurrentValue = function (r) {
        var context = this.localNames[r.contextIndex];
        var newValue = this.localNames[r.selfIndex];
        var args = this.genArgs(r);
        switch (r.mode) {
            case proto_record_1.RECORD_TYPE_SELF:
                return assignmentTemplate(newValue, context);
            case proto_record_1.RECORD_TYPE_CONST:
                return newValue + " = " + this.genLiteral(r.funcOrValue);
            case proto_record_1.RECORD_TYPE_PROPERTY:
                return assignmentTemplate(newValue, context + "." + r.name);
            case proto_record_1.RECORD_TYPE_LOCAL:
                return assignmentTemplate(newValue, LOCALS_ACCESSOR + ".get('" + r.name + "')");
            case proto_record_1.RECORD_TYPE_INVOKE_METHOD:
                return assignmentTemplate(newValue, context + "." + r.name + "(" + args + ")");
            case proto_record_1.RECORD_TYPE_INVOKE_CLOSURE:
                return assignmentTemplate(newValue, context + "(" + args + ")");
            case proto_record_1.RECORD_TYPE_PRIMITIVE_OP:
                return assignmentTemplate(newValue, UTIL + "." + r.name + "(" + args + ")");
            case proto_record_1.RECORD_TYPE_INTERPOLATE:
                return assignmentTemplate(newValue, this.genInterpolation(r));
            case proto_record_1.RECORD_TYPE_KEYED_ACCESS:
                var key = this.localNames[r.args[0]];
                return assignmentTemplate(newValue, context + "[" + key + "]");
            default:
                throw new lang_1.BaseException("Unknown operation " + r.mode);
        }
    };
    ChangeDetectorJITGenerator.prototype.ifChangedGuard = function (r, body) {
        var _this = this;
        return ifChangedGuardTemplate(r.args.map(function (a) { return _this.changeNames[a]; }), body);
    };
    ChangeDetectorJITGenerator.prototype.genInterpolation = function (r) {
        var res = "";
        for (var i = 0; i < r.args.length; ++i) {
            res += this.genLiteral(r.fixedArgs[i]);
            res += " + ";
            res += this.localNames[r.args[i]];
            res += " + ";
        }
        res += this.genLiteral(r.fixedArgs[r.args.length]);
        return res;
    };
    ChangeDetectorJITGenerator.prototype.genLiteral = function (value) {
        return JSON.stringify(value);
    };
    ChangeDetectorJITGenerator.prototype.getInvokeMementoAndAddChangeTemplate = function (r) {
        var newValue = this.localNames[r.selfIndex];
        var oldValue = this.fieldNames[r.selfIndex];
        return r.lastInBinding ? invokeBindingMemento(oldValue, newValue) : "";
    };
    ChangeDetectorJITGenerator.prototype.genAddToChanges = function (r) {
        var newValue = this.localNames[r.selfIndex];
        var oldValue = this.fieldNames[r.selfIndex];
        var callOnChange = r.directiveMemento && r.directiveMemento.callOnChange;
        return callOnChange ? addToChangesTemplate(oldValue, newValue) : "";
    };
    ChangeDetectorJITGenerator.prototype.genLastInDirective = function (r) {
        var callOnChange = r.directiveMemento && r.directiveMemento.callOnChange;
        return r.lastInDirective && callOnChange ? lastInDirectiveTemplate(r.selfIndex - 1) : '';
    };
    ChangeDetectorJITGenerator.prototype.genArgs = function (r) {
        var _this = this;
        return r.args.map(function (arg) { return _this.localNames[arg]; }).join(", ");
    };
    return ChangeDetectorJITGenerator;
})();
exports.ChangeDetectorJITGenerator = ChangeDetectorJITGenerator;
Object.defineProperty(ChangeDetectorJITGenerator, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string], [assert.genericType(collection_1.List, proto_record_1.ProtoRecord)], [collection_1.List]];
    } });
Object.defineProperty(ChangeDetectorJITGenerator.prototype.getLocalNames, "parameters", { get: function () {
        return [[assert.genericType(collection_1.List, proto_record_1.ProtoRecord)]];
    } });
Object.defineProperty(ChangeDetectorJITGenerator.prototype.getChangeNames, "parameters", { get: function () {
        return [[assert.genericType(collection_1.List, assert.type.string)]];
    } });
Object.defineProperty(ChangeDetectorJITGenerator.prototype.getFieldNames, "parameters", { get: function () {
        return [[assert.genericType(collection_1.List, assert.type.string)]];
    } });
Object.defineProperty(ChangeDetectorJITGenerator.prototype.getPipeNames, "parameters", { get: function () {
        return [[assert.genericType(collection_1.List, assert.type.string)]];
    } });
Object.defineProperty(ChangeDetectorJITGenerator.prototype.genRecord, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord]];
    } });
Object.defineProperty(ChangeDetectorJITGenerator.prototype.genPipeCheck, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord]];
    } });
Object.defineProperty(ChangeDetectorJITGenerator.prototype.genReferenceCheck, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord]];
    } });
Object.defineProperty(ChangeDetectorJITGenerator.prototype.genUpdateCurrentValue, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord]];
    } });
Object.defineProperty(ChangeDetectorJITGenerator.prototype.ifChangedGuard, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord], [assert.type.string]];
    } });
Object.defineProperty(ChangeDetectorJITGenerator.prototype.genInterpolation, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord]];
    } });
Object.defineProperty(ChangeDetectorJITGenerator.prototype.getInvokeMementoAndAddChangeTemplate, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord]];
    } });
Object.defineProperty(ChangeDetectorJITGenerator.prototype.genAddToChanges, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord]];
    } });
Object.defineProperty(ChangeDetectorJITGenerator.prototype.genLastInDirective, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord]];
    } });
Object.defineProperty(ChangeDetectorJITGenerator.prototype.genArgs, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord]];
    } });
