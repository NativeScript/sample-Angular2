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
var compile_element_1 = require('./compile_element');
var compileControlModule = require('./compile_control');
var CompileStep = (function () {
    function CompileStep() {
    }
    CompileStep.prototype.process = function (parent, current, control) { };
    return CompileStep;
})();
exports.CompileStep = CompileStep;
Object.defineProperty(CompileStep.prototype.process, "parameters", { get: function () {
        return [[compile_element_1.CompileElement], [compile_element_1.CompileElement], [compileControlModule.CompileControl]];
    } });
