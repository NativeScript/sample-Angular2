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
var collection_1 = require('angular2/src/facade/collection');
var async_1 = require('angular2/src/facade/async');
var change_detection_1 = require('angular2/change_detection');
var api_1 = require('../../api');
var property_binding_parser_1 = require('./property_binding_parser');
var text_interpolation_parser_1 = require('./text_interpolation_parser');
var directive_parser_1 = require('./directive_parser');
var view_splitter_1 = require('./view_splitter');
var shadow_dom_compile_step_1 = require('../shadow_dom/shadow_dom_compile_step');
var CompileStepFactory = (function () {
    function CompileStepFactory() {
    }
    CompileStepFactory.prototype.createSteps = function (template, subTaskPromises) {
        return null;
    };
    return CompileStepFactory;
})();
exports.CompileStepFactory = CompileStepFactory;
Object.defineProperty(CompileStepFactory.prototype.createSteps, "parameters", { get: function () {
        return [[api_1.Template], [assert.genericType(collection_1.List, async_1.Promise)]];
    } });
var DefaultStepFactory = (function (_super) {
    __extends(DefaultStepFactory, _super);
    function DefaultStepFactory(parser, shadowDomStrategy) {
        _super.call(this);
        this._parser = parser;
        this._shadowDomStrategy = shadowDomStrategy;
    }
    DefaultStepFactory.prototype.createSteps = function (template, subTaskPromises) {
        return [new view_splitter_1.ViewSplitter(this._parser), new property_binding_parser_1.PropertyBindingParser(this._parser), new directive_parser_1.DirectiveParser(this._parser, template.directives), new text_interpolation_parser_1.TextInterpolationParser(this._parser), new shadow_dom_compile_step_1.ShadowDomCompileStep(this._shadowDomStrategy, template, subTaskPromises)];
    };
    return DefaultStepFactory;
})(CompileStepFactory);
exports.DefaultStepFactory = DefaultStepFactory;
Object.defineProperty(DefaultStepFactory, "parameters", { get: function () {
        return [[change_detection_1.Parser], []];
    } });
Object.defineProperty(DefaultStepFactory.prototype.createSteps, "parameters", { get: function () {
        return [[api_1.Template], [assert.genericType(collection_1.List, async_1.Promise)]];
    } });
