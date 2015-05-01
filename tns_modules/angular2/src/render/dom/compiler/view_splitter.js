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
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var collection_1 = require('angular2/src/facade/collection');
var change_detection_1 = require('angular2/change_detection');
var compile_step_1 = require('./compile_step');
var compile_element_1 = require('./compile_element');
var compile_control_1 = require('./compile_control');
var util_1 = require('../util');
var ViewSplitter = (function (_super) {
    __extends(ViewSplitter, _super);
    function ViewSplitter(parser) {
        _super.call(this);
        this._parser = parser;
    }
    ViewSplitter.prototype.process = function (parent, current, control) {
        var attrs = current.attrs();
        var templateBindings = collection_1.MapWrapper.get(attrs, 'template');
        var hasTemplateBinding = lang_1.isPresent(templateBindings);
        collection_1.MapWrapper.forEach(attrs, function (attrValue, attrName) {
            if (lang_1.StringWrapper.startsWith(attrName, '*')) {
                var key = lang_1.StringWrapper.substring(attrName, 1);
                if (hasTemplateBinding) {
                    throw new lang_1.BaseException("Only one template directive per element is allowed: " + (templateBindings + " and " + key + " cannot be used simultaneously ") + ("in " + current.elementDescription));
                }
                else {
                    templateBindings = (attrValue.length == 0) ? key : key + ' ' + attrValue;
                    hasTemplateBinding = true;
                }
            }
        });
        if (lang_1.isPresent(parent)) {
            if (dom_adapter_1.DOM.isTemplateElement(current.element)) {
                if (!current.isViewRoot) {
                    var viewRoot = new compile_element_1.CompileElement(dom_adapter_1.DOM.createTemplate(''));
                    viewRoot.inheritedProtoView = current.bindElement().bindNestedProtoView(viewRoot.element);
                    viewRoot.elementDescription = current.elementDescription;
                    viewRoot.isViewRoot = true;
                    this._moveChildNodes(dom_adapter_1.DOM.content(current.element), dom_adapter_1.DOM.content(viewRoot.element));
                    control.addChild(viewRoot);
                }
            }
            if (hasTemplateBinding) {
                var newParent = new compile_element_1.CompileElement(dom_adapter_1.DOM.createTemplate(''));
                newParent.inheritedProtoView = current.inheritedProtoView;
                newParent.inheritedElementBinder = current.inheritedElementBinder;
                newParent.distanceToInheritedBinder = current.distanceToInheritedBinder;
                newParent.elementDescription = current.elementDescription;
                current.inheritedProtoView = newParent.bindElement().bindNestedProtoView(current.element);
                current.inheritedElementBinder = null;
                current.distanceToInheritedBinder = 0;
                current.isViewRoot = true;
                this._parseTemplateBindings(templateBindings, newParent);
                this._addParentElement(current.element, newParent.element);
                control.addParent(newParent);
                dom_adapter_1.DOM.remove(current.element);
            }
        }
    };
    ViewSplitter.prototype._moveChildNodes = function (source, target) {
        var next = dom_adapter_1.DOM.firstChild(source);
        while (lang_1.isPresent(next)) {
            dom_adapter_1.DOM.appendChild(target, next);
            next = dom_adapter_1.DOM.firstChild(source);
        }
    };
    ViewSplitter.prototype._addParentElement = function (currentElement, newParentElement) {
        dom_adapter_1.DOM.insertBefore(currentElement, newParentElement);
        dom_adapter_1.DOM.appendChild(newParentElement, currentElement);
    };
    ViewSplitter.prototype._parseTemplateBindings = function (templateBindings, compileElement) {
        var bindings = this._parser.parseTemplateBindings(templateBindings, compileElement.elementDescription);
        for (var i = 0; i < bindings.length; i++) {
            var binding = bindings[i];
            if (binding.keyIsVar) {
                compileElement.bindElement().bindVariable(util_1.dashCaseToCamelCase(binding.key), binding.name);
                collection_1.MapWrapper.set(compileElement.attrs(), binding.key, binding.name);
            }
            else if (lang_1.isPresent(binding.expression)) {
                compileElement.bindElement().bindProperty(util_1.dashCaseToCamelCase(binding.key), binding.expression);
                collection_1.MapWrapper.set(compileElement.attrs(), binding.key, binding.expression.source);
            }
            else {
                dom_adapter_1.DOM.setAttribute(compileElement.element, binding.key, '');
            }
        }
    };
    return ViewSplitter;
})(compile_step_1.CompileStep);
exports.ViewSplitter = ViewSplitter;
Object.defineProperty(ViewSplitter, "parameters", { get: function () {
        return [[change_detection_1.Parser]];
    } });
Object.defineProperty(ViewSplitter.prototype.process, "parameters", { get: function () {
        return [[compile_element_1.CompileElement], [compile_element_1.CompileElement], [compile_control_1.CompileControl]];
    } });
Object.defineProperty(ViewSplitter.prototype._parseTemplateBindings, "parameters", { get: function () {
        return [[assert.type.string], [compile_element_1.CompileElement]];
    } });
