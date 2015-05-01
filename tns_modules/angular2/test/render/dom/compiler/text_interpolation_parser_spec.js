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
var test_lib_1 = require('angular2/test_lib');
var text_interpolation_parser_1 = require('angular2/src/render/dom/compiler/text_interpolation_parser');
var compile_pipeline_1 = require('angular2/src/render/dom/compiler/compile_pipeline');
var collection_1 = require('angular2/src/facade/collection');
var change_detection_1 = require('angular2/change_detection');
var compile_element_1 = require('angular2/src/render/dom/compiler/compile_element');
var compile_step_1 = require('angular2/src/render/dom/compiler/compile_step');
var compile_control_1 = require('angular2/src/render/dom/compiler/compile_control');
var pipeline_spec_1 = require('./pipeline_spec');
function main() {
    test_lib_1.describe('TextInterpolationParser', function () {
        function createPipeline(ignoreBindings) {
            if (ignoreBindings === void 0) { ignoreBindings = false; }
            return new compile_pipeline_1.CompilePipeline([new MockStep(function (parent, current, control) {
                    current.ignoreBindings = ignoreBindings;
                }), new pipeline_spec_1.IgnoreChildrenStep(), new text_interpolation_parser_1.TextInterpolationParser(new change_detection_1.Parser(new change_detection_1.Lexer()))]);
        }
        function process(element, ignoreBindings) {
            if (ignoreBindings === void 0) { ignoreBindings = false; }
            return collection_1.ListWrapper.map(createPipeline(ignoreBindings).process(element), function (compileElement) { return compileElement.inheritedElementBinder; });
        }
        function assertTextBinding(elementBinder, bindingIndex, nodeIndex, expression) {
            test_lib_1.expect(elementBinder.textBindings[bindingIndex].source).toEqual(expression);
            test_lib_1.expect(elementBinder.textBindingIndices[bindingIndex]).toEqual(nodeIndex);
        }
        test_lib_1.it('should not look for text interpolation when ignoreBindings is true', function () {
            var results = process(test_lib_1.el('<div>{{expr1}}<span></span>{{expr2}}</div>'), true);
            test_lib_1.expect(results[0]).toEqual(null);
        });
        test_lib_1.it('should find text interpolation in normal elements', function () {
            var result = process(test_lib_1.el('<div>{{expr1}}<span></span>{{expr2}}</div>'))[0];
            assertTextBinding(result, 0, 0, "{{expr1}}");
            assertTextBinding(result, 1, 2, "{{expr2}}");
        });
        test_lib_1.it('should find text interpolation in template elements', function () {
            var result = process(test_lib_1.el('<template>{{expr1}}<span></span>{{expr2}}</template>'))[0];
            assertTextBinding(result, 0, 0, "{{expr1}}");
            assertTextBinding(result, 1, 2, "{{expr2}}");
        });
        test_lib_1.it('should allow multiple expressions', function () {
            var result = process(test_lib_1.el('<div>{{expr1}}{{expr2}}</div>'))[0];
            assertTextBinding(result, 0, 0, "{{expr1}}{{expr2}}");
        });
        test_lib_1.it('should not interpolate when compileChildren is false', function () {
            var results = process(test_lib_1.el('<div>{{included}}<span ignore-children>{{excluded}}</span></div>'));
            assertTextBinding(results[0], 0, 0, "{{included}}");
            test_lib_1.expect(results[1]).toBe(results[0]);
        });
        test_lib_1.it('should allow fixed text before, in between and after expressions', function () {
            var result = process(test_lib_1.el('<div>a{{expr1}}b{{expr2}}c</div>'))[0];
            assertTextBinding(result, 0, 0, "a{{expr1}}b{{expr2}}c");
        });
        test_lib_1.it('should escape quotes in fixed parts', function () {
            var result = process(test_lib_1.el("<div>'\"a{{expr1}}</div>"))[0];
            assertTextBinding(result, 0, 0, "'\"a{{expr1}}");
        });
    });
}
exports.main = main;
var MockStep = (function (_super) {
    __extends(MockStep, _super);
    function MockStep(process) {
        _super.call(this);
        this.processClosure = process;
    }
    MockStep.prototype.process = function (parent, current, control) {
        this.processClosure(parent, current, control);
    };
    return MockStep;
})(compile_step_1.CompileStep);
Object.defineProperty(MockStep.prototype.process, "parameters", { get: function () {
        return [[compile_element_1.CompileElement], [compile_element_1.CompileElement], [compile_control_1.CompileControl]];
    } });
