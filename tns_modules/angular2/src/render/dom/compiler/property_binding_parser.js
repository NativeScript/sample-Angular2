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
var change_detection_1 = require('angular2/change_detection');
var compile_step_1 = require('./compile_step');
var compile_element_1 = require('./compile_element');
var compile_control_1 = require('./compile_control');
var util_1 = require('../util');
var BIND_NAME_REGEXP = lang_1.RegExpWrapper.create('^(?:(?:(?:(bind-)|(var-|#)|(on-))(.+))|\\[([^\\]]+)\\]|\\(([^\\)]+)\\))$');
var PropertyBindingParser = (function (_super) {
    __extends(PropertyBindingParser, _super);
    function PropertyBindingParser(parser) {
        _super.call(this);
        this._parser = parser;
    }
    PropertyBindingParser.prototype.process = function (parent, current, control) {
        var _this = this;
        if (current.ignoreBindings) {
            return;
        }
        var attrs = current.attrs();
        var newAttrs = collection_1.MapWrapper.create();
        collection_1.MapWrapper.forEach(attrs, function (attrValue, attrName) {
            var bindParts = lang_1.RegExpWrapper.firstMatch(BIND_NAME_REGEXP, attrName);
            if (lang_1.isPresent(bindParts)) {
                if (lang_1.isPresent(bindParts[1])) {
                    _this._bindProperty(bindParts[4], attrValue, current, newAttrs);
                }
                else if (lang_1.isPresent(bindParts[2])) {
                    var identifier = bindParts[4];
                    var value = attrValue == '' ? '\$implicit' : attrValue;
                    _this._bindVariable(identifier, value, current, newAttrs);
                }
                else if (lang_1.isPresent(bindParts[3])) {
                    _this._bindEvent(bindParts[4], attrValue, current, newAttrs);
                }
                else if (lang_1.isPresent(bindParts[5])) {
                    _this._bindProperty(bindParts[5], attrValue, current, newAttrs);
                }
                else if (lang_1.isPresent(bindParts[6])) {
                    _this._bindEvent(bindParts[6], attrValue, current, newAttrs);
                }
            }
            else {
                var expr = _this._parser.parseInterpolation(attrValue, current.elementDescription);
                if (lang_1.isPresent(expr)) {
                    _this._bindPropertyAst(attrName, expr, current, newAttrs);
                }
            }
        });
        collection_1.MapWrapper.forEach(newAttrs, function (attrValue, attrName) {
            collection_1.MapWrapper.set(attrs, attrName, attrValue);
        });
    };
    PropertyBindingParser.prototype._bindVariable = function (identifier, value, current, newAttrs) {
        current.bindElement().bindVariable(util_1.dashCaseToCamelCase(identifier), value);
        collection_1.MapWrapper.set(newAttrs, identifier, value);
    };
    PropertyBindingParser.prototype._bindProperty = function (name, expression, current, newAttrs) {
        this._bindPropertyAst(name, this._parser.parseBinding(expression, current.elementDescription), current, newAttrs);
    };
    PropertyBindingParser.prototype._bindPropertyAst = function (name, ast, current, newAttrs) {
        var binder = current.bindElement();
        var camelCaseName = util_1.dashCaseToCamelCase(name);
        binder.bindProperty(camelCaseName, ast);
        collection_1.MapWrapper.set(newAttrs, name, ast.source);
    };
    PropertyBindingParser.prototype._bindEvent = function (name, expression, current, newAttrs) {
        current.bindElement().bindEvent(util_1.dashCaseToCamelCase(name), this._parser.parseAction(expression, current.elementDescription));
    };
    return PropertyBindingParser;
})(compile_step_1.CompileStep);
exports.PropertyBindingParser = PropertyBindingParser;
Object.defineProperty(PropertyBindingParser, "parameters", { get: function () {
        return [[change_detection_1.Parser]];
    } });
Object.defineProperty(PropertyBindingParser.prototype.process, "parameters", { get: function () {
        return [[compile_element_1.CompileElement], [compile_element_1.CompileElement], [compile_control_1.CompileControl]];
    } });
Object.defineProperty(PropertyBindingParser.prototype._bindVariable, "parameters", { get: function () {
        return [[], [], [compile_element_1.CompileElement], []];
    } });
Object.defineProperty(PropertyBindingParser.prototype._bindProperty, "parameters", { get: function () {
        return [[], [], [compile_element_1.CompileElement], []];
    } });
Object.defineProperty(PropertyBindingParser.prototype._bindPropertyAst, "parameters", { get: function () {
        return [[], [], [compile_element_1.CompileElement], []];
    } });
Object.defineProperty(PropertyBindingParser.prototype._bindEvent, "parameters", { get: function () {
        return [[], [], [compile_element_1.CompileElement], []];
    } });
