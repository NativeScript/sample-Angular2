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
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var compile_element_1 = require('./compile_element');
var compile_control_1 = require('./compile_control');
var compile_step_1 = require('./compile_step');
var proto_view_builder_1 = require('../view/proto_view_builder');
var CompilePipeline = (function () {
    function CompilePipeline(steps) {
        this._control = new compile_control_1.CompileControl(steps);
    }
    CompilePipeline.prototype.process = function (rootElement, compilationCtxtDescription) {
        if (compilationCtxtDescription === void 0) { compilationCtxtDescription = ''; }
        var results = collection_1.ListWrapper.create();
        var rootCompileElement = new compile_element_1.CompileElement(rootElement, compilationCtxtDescription);
        rootCompileElement.inheritedProtoView = new proto_view_builder_1.ProtoViewBuilder(rootElement);
        rootCompileElement.isViewRoot = true;
        this._process(results, null, rootCompileElement, compilationCtxtDescription);
        return results;
    };
    CompilePipeline.prototype._process = function (results, parent, current, compilationCtxtDescription) {
        if (compilationCtxtDescription === void 0) { compilationCtxtDescription = ''; }
        var additionalChildren = this._control.internalProcess(results, 0, parent, current);
        if (current.compileChildren) {
            var node = dom_adapter_1.DOM.firstChild(dom_adapter_1.DOM.templateAwareRoot(current.element));
            while (lang_1.isPresent(node)) {
                var nextNode = dom_adapter_1.DOM.nextSibling(node);
                if (dom_adapter_1.DOM.isElementNode(node)) {
                    var childCompileElement = new compile_element_1.CompileElement(node, compilationCtxtDescription);
                    childCompileElement.inheritedProtoView = current.inheritedProtoView;
                    childCompileElement.inheritedElementBinder = current.inheritedElementBinder;
                    childCompileElement.distanceToInheritedBinder = current.distanceToInheritedBinder + 1;
                    this._process(results, current, childCompileElement);
                }
                node = nextNode;
            }
        }
        if (lang_1.isPresent(additionalChildren)) {
            for (var i = 0; i < additionalChildren.length; i++) {
                this._process(results, current, additionalChildren[i]);
            }
        }
    };
    return CompilePipeline;
})();
exports.CompilePipeline = CompilePipeline;
Object.defineProperty(CompilePipeline, "parameters", { get: function () {
        return [[assert.genericType(collection_1.List, compile_step_1.CompileStep)]];
    } });
Object.defineProperty(CompilePipeline.prototype.process, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(CompilePipeline.prototype._process, "parameters", { get: function () {
        return [[], [compile_element_1.CompileElement], [compile_element_1.CompileElement], [assert.type.string]];
    } });
