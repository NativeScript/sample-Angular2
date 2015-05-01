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
var async_1 = require('angular2/src/facade/async');
var lang_1 = require('angular2/src/facade/lang');
var api_1 = require('../../api');
var compile_pipeline_1 = require('./compile_pipeline');
var template_loader_1 = require('angular2/src/render/dom/compiler/template_loader');
var compile_step_factory_1 = require('./compile_step_factory');
var Compiler = (function () {
    function Compiler(stepFactory, templateLoader) {
        this._templateLoader = templateLoader;
        this._stepFactory = stepFactory;
    }
    Compiler.prototype.compile = function (template) {
        var _this = this;
        var tplPromise = this._templateLoader.load(template);
        return async_1.PromiseWrapper.then(tplPromise, function (el) { return _this._compileTemplate(template, el); }, function (_) {
            throw new lang_1.BaseException("Failed to load the template \"" + template.componentId + "\"");
        });
    };
    Compiler.prototype._compileTemplate = function (template, tplElement) {
        var subTaskPromises = [];
        var pipeline = new compile_pipeline_1.CompilePipeline(this._stepFactory.createSteps(template, subTaskPromises));
        var compileElements;
        compileElements = pipeline.process(tplElement, template.componentId);
        var protoView = compileElements[0].inheritedProtoView.build();
        if (subTaskPromises.length > 0) {
            return async_1.PromiseWrapper.all(subTaskPromises).then(function (_) { return protoView; });
        }
        else {
            return async_1.PromiseWrapper.resolve(protoView);
        }
    };
    return Compiler;
})();
exports.Compiler = Compiler;
Object.defineProperty(Compiler, "parameters", { get: function () {
        return [[compile_step_factory_1.CompileStepFactory], [template_loader_1.TemplateLoader]];
    } });
Object.defineProperty(Compiler.prototype.compile, "parameters", { get: function () {
        return [[api_1.Template]];
    } });
Object.defineProperty(Compiler.prototype._compileTemplate, "parameters", { get: function () {
        return [[api_1.Template], []];
    } });
