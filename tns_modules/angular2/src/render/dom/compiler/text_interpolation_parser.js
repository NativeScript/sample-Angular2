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
var change_detection_1 = require('angular2/change_detection');
var compile_step_1 = require('./compile_step');
var compile_element_1 = require('./compile_element');
var compile_control_1 = require('./compile_control');
var TextInterpolationParser = (function (_super) {
    __extends(TextInterpolationParser, _super);
    function TextInterpolationParser(parser) {
        _super.call(this);
        this._parser = parser;
    }
    TextInterpolationParser.prototype.process = function (parent, current, control) {
        if (!current.compileChildren || current.ignoreBindings) {
            return;
        }
        var element = current.element;
        var childNodes = dom_adapter_1.DOM.childNodes(dom_adapter_1.DOM.templateAwareRoot(element));
        for (var i = 0; i < childNodes.length; i++) {
            var node = childNodes[i];
            if (dom_adapter_1.DOM.isTextNode(node)) {
                var text = dom_adapter_1.DOM.nodeValue(node);
                var expr = this._parser.parseInterpolation(text, current.elementDescription);
                if (lang_1.isPresent(expr)) {
                    dom_adapter_1.DOM.setText(node, ' ');
                    current.bindElement().bindText(i, expr);
                }
            }
        }
    };
    return TextInterpolationParser;
})(compile_step_1.CompileStep);
exports.TextInterpolationParser = TextInterpolationParser;
Object.defineProperty(TextInterpolationParser, "parameters", { get: function () {
        return [[change_detection_1.Parser]];
    } });
Object.defineProperty(TextInterpolationParser.prototype.process, "parameters", { get: function () {
        return [[compile_element_1.CompileElement], [compile_element_1.CompileElement], [compile_control_1.CompileControl]];
    } });
