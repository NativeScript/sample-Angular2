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
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var change_detection_1 = require('angular2/change_detection');
var selector_1 = require('angular2/src/render/dom/compiler/selector');
var compile_step_1 = require('./compile_step');
var compile_element_1 = require('./compile_element');
var compile_control_1 = require('./compile_control');
var api_1 = require('../../api');
var util_1 = require('../util');
var DirectiveParser = (function (_super) {
    __extends(DirectiveParser, _super);
    function DirectiveParser(parser, directives) {
        _super.call(this);
        this._parser = parser;
        this._selectorMatcher = new selector_1.SelectorMatcher();
        this._directives = directives;
        for (var i = 0; i < directives.length; i++) {
            var selector = selector_1.CssSelector.parse(directives[i].selector);
            this._selectorMatcher.addSelectables(selector, i);
        }
    }
    DirectiveParser.prototype.process = function (parent, current, control) {
        var _this = this;
        var attrs = current.attrs();
        var classList = current.classList();
        var cssSelector = new selector_1.CssSelector();
        var nodeName = dom_adapter_1.DOM.nodeName(current.element);
        cssSelector.setElement(nodeName);
        for (var i = 0; i < classList.length; i++) {
            cssSelector.addClassName(classList[i]);
        }
        collection_1.MapWrapper.forEach(attrs, function (attrValue, attrName) {
            cssSelector.addAttribute(attrName, attrValue);
        });
        var viewportDirective;
        var componentDirective;
        var isTemplateElement = dom_adapter_1.DOM.isTemplateElement(current.element);
        this._selectorMatcher.match(cssSelector, function (selector, directiveIndex) {
            var elementBinder = current.bindElement();
            var directive = _this._directives[directiveIndex];
            var directiveBinder = elementBinder.bindDirective(directiveIndex);
            current.compileChildren = current.compileChildren && directive.compileChildren;
            if (lang_1.isPresent(directive.bind)) {
                collection_1.MapWrapper.forEach(directive.bind, function (bindConfig, dirProperty) {
                    _this._bindDirectiveProperty(dirProperty, bindConfig, current, directiveBinder);
                });
            }
            if (lang_1.isPresent(directive.events)) {
                collection_1.MapWrapper.forEach(directive.events, function (action, eventName) {
                    _this._bindDirectiveEvent(eventName, action, current, directiveBinder);
                });
            }
            if (lang_1.isPresent(directive.setters)) {
                collection_1.ListWrapper.forEach(directive.setters, function (propertyName) {
                    elementBinder.bindPropertySetter(propertyName);
                });
            }
            if (lang_1.isPresent(directive.readAttributes)) {
                collection_1.ListWrapper.forEach(directive.readAttributes, function (attrName) {
                    elementBinder.readAttribute(attrName);
                });
            }
            if (directive.type === api_1.DirectiveMetadata.VIEWPORT_TYPE) {
                if (!isTemplateElement) {
                    throw new lang_1.BaseException("Viewport directives need to be placed on <template> elements or elements " + ("with template attribute - check " + current.elementDescription));
                }
                if (lang_1.isPresent(viewportDirective)) {
                    throw new lang_1.BaseException("Only one viewport directive is allowed per element - check " + current.elementDescription);
                }
                viewportDirective = directive;
            }
            else {
                if (isTemplateElement) {
                    throw new lang_1.BaseException("Only template directives are allowed on template elements - check " + current.elementDescription);
                }
                if (directive.type === api_1.DirectiveMetadata.COMPONENT_TYPE) {
                    if (lang_1.isPresent(componentDirective)) {
                        throw new lang_1.BaseException("Only one component directive is allowed per element - check " + current.elementDescription);
                    }
                    componentDirective = directive;
                    elementBinder.setComponentId(directive.id);
                }
            }
        });
    };
    DirectiveParser.prototype._bindDirectiveProperty = function (dirProperty, bindConfig, compileElement, directiveBinder) {
        var pipes = this._splitBindConfig(bindConfig);
        var elProp = collection_1.ListWrapper.removeAt(pipes, 0);
        var bindingAst = collection_1.MapWrapper.get(compileElement.bindElement().propertyBindings, util_1.dashCaseToCamelCase(elProp));
        if (lang_1.isBlank(bindingAst)) {
            var attributeValue = collection_1.MapWrapper.get(compileElement.attrs(), util_1.camelCaseToDashCase(elProp));
            if (lang_1.isPresent(attributeValue)) {
                bindingAst = this._parser.wrapLiteralPrimitive(attributeValue, compileElement.elementDescription);
            }
        }
        if (lang_1.isPresent(bindingAst)) {
            var fullExpAstWithBindPipes = this._parser.addPipes(bindingAst, pipes);
            directiveBinder.bindProperty(dirProperty, fullExpAstWithBindPipes);
        }
    };
    DirectiveParser.prototype._bindDirectiveEvent = function (eventName, action, compileElement, directiveBinder) {
        var ast = this._parser.parseAction(action, compileElement.elementDescription);
        directiveBinder.bindEvent(eventName, ast);
    };
    DirectiveParser.prototype._splitBindConfig = function (bindConfig) {
        return collection_1.ListWrapper.map(bindConfig.split('|'), function (s) { return s.trim(); });
    };
    return DirectiveParser;
})(compile_step_1.CompileStep);
exports.DirectiveParser = DirectiveParser;
Object.defineProperty(DirectiveParser, "parameters", { get: function () {
        return [[change_detection_1.Parser], [assert.genericType(collection_1.List, api_1.DirectiveMetadata)]];
    } });
Object.defineProperty(DirectiveParser.prototype.process, "parameters", { get: function () {
        return [[compile_element_1.CompileElement], [compile_element_1.CompileElement], [compile_control_1.CompileControl]];
    } });
Object.defineProperty(DirectiveParser.prototype._splitBindConfig, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
