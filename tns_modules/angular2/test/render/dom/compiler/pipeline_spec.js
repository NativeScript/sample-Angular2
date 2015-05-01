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
var collection_1 = require('angular2/src/facade/collection');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var lang_1 = require('angular2/src/facade/lang');
var compile_pipeline_1 = require('angular2/src/render/dom/compiler/compile_pipeline');
var compile_element_1 = require('angular2/src/render/dom/compiler/compile_element');
var compile_step_1 = require('angular2/src/render/dom/compiler/compile_step');
var compile_control_1 = require('angular2/src/render/dom/compiler/compile_control');
var proto_view_builder_1 = require('angular2/src/render/dom/view/proto_view_builder');
function main() {
    test_lib_1.describe('compile_pipeline', function () {
        test_lib_1.describe('children compilation', function () {
            test_lib_1.it('should walk the tree in depth first order including template contents', function () {
                var element = test_lib_1.el('<div id="1"><template id="2"><span id="3"></span></template></div>');
                var step0Log = [];
                var results = new compile_pipeline_1.CompilePipeline([createLoggerStep(step0Log)]).process(element);
                test_lib_1.expect(step0Log).toEqual(['1', '1<2', '2<3']);
                test_lib_1.expect(resultIdLog(results)).toEqual(['1', '2', '3']);
            });
            test_lib_1.it('should stop walking the tree when compileChildren is false', function () {
                var element = test_lib_1.el('<div id="1"><template id="2" ignore-children><span id="3"></span></template></div>');
                var step0Log = [];
                var pipeline = new compile_pipeline_1.CompilePipeline([new IgnoreChildrenStep(), createLoggerStep(step0Log)]);
                var results = pipeline.process(element);
                test_lib_1.expect(step0Log).toEqual(['1', '1<2']);
                test_lib_1.expect(resultIdLog(results)).toEqual(['1', '2']);
            });
        });
        test_lib_1.it('should inherit protoViewBuilders to children', function () {
            var element = test_lib_1.el('<div><div><span viewroot><span></span></span></div></div>');
            var pipeline = new compile_pipeline_1.CompilePipeline([new MockStep(function (parent, current, control) {
                    if (lang_1.isPresent(dom_adapter_1.DOM.getAttribute(current.element, 'viewroot'))) {
                        current.inheritedProtoView = new proto_view_builder_1.ProtoViewBuilder(current.element);
                    }
                })]);
            var results = pipeline.process(element);
            test_lib_1.expect(results[0].inheritedProtoView).toBe(results[1].inheritedProtoView);
            test_lib_1.expect(results[2].inheritedProtoView).toBe(results[3].inheritedProtoView);
        });
        test_lib_1.it('should inherit elementBinderBuilders to children', function () {
            var element = test_lib_1.el('<div bind><div><span bind><span></span></span></div></div>');
            var pipeline = new compile_pipeline_1.CompilePipeline([new MockStep(function (parent, current, control) {
                    if (lang_1.isPresent(dom_adapter_1.DOM.getAttribute(current.element, 'bind'))) {
                        current.bindElement();
                    }
                })]);
            var results = pipeline.process(element);
            test_lib_1.expect(results[0].inheritedElementBinder).toBe(results[1].inheritedElementBinder);
            test_lib_1.expect(results[2].inheritedElementBinder).toBe(results[3].inheritedElementBinder);
        });
        test_lib_1.it('should mark root elements as viewRoot', function () {
            var rootElement = test_lib_1.el('<div></div>');
            var results = new compile_pipeline_1.CompilePipeline([]).process(rootElement);
            test_lib_1.expect(results[0].isViewRoot).toBe(true);
        });
        test_lib_1.it('should calculate distanceToParent / parent correctly', function () {
            var element = test_lib_1.el('<div bind><div bind></div><div><div bind></div></div></div>');
            var pipeline = new compile_pipeline_1.CompilePipeline([new MockStep(function (parent, current, control) {
                    if (lang_1.isPresent(dom_adapter_1.DOM.getAttribute(current.element, 'bind'))) {
                        current.bindElement();
                    }
                })]);
            var results = pipeline.process(element);
            test_lib_1.expect(results[0].inheritedElementBinder.distanceToParent).toBe(0);
            test_lib_1.expect(results[1].inheritedElementBinder.distanceToParent).toBe(1);
            test_lib_1.expect(results[3].inheritedElementBinder.distanceToParent).toBe(2);
            test_lib_1.expect(results[1].inheritedElementBinder.parent).toBe(results[0].inheritedElementBinder);
            test_lib_1.expect(results[3].inheritedElementBinder.parent).toBe(results[0].inheritedElementBinder);
        });
        test_lib_1.describe('control.addParent', function () {
            test_lib_1.it('should report the new parent to the following processor and the result', function () {
                var element = test_lib_1.el('<div id="1"><span wrap0="1" id="2"><b id="3"></b></span></div>');
                var step0Log = [];
                var step1Log = [];
                var pipeline = new compile_pipeline_1.CompilePipeline([createWrapperStep('wrap0', step0Log), createLoggerStep(step1Log)]);
                var result = pipeline.process(element);
                test_lib_1.expect(step0Log).toEqual(['1', '1<2', '2<3']);
                test_lib_1.expect(step1Log).toEqual(['1', '1<wrap0#0', 'wrap0#0<2', '2<3']);
                test_lib_1.expect(resultIdLog(result)).toEqual(['1', 'wrap0#0', '2', '3']);
            });
            test_lib_1.it('should allow to add a parent by multiple processors to the same element', function () {
                var element = test_lib_1.el('<div id="1"><span wrap0="1" wrap1="1" id="2"><b id="3"></b></span></div>');
                var step0Log = [];
                var step1Log = [];
                var step2Log = [];
                var pipeline = new compile_pipeline_1.CompilePipeline([createWrapperStep('wrap0', step0Log), createWrapperStep('wrap1', step1Log), createLoggerStep(step2Log)]);
                var result = pipeline.process(element);
                test_lib_1.expect(step0Log).toEqual(['1', '1<2', '2<3']);
                test_lib_1.expect(step1Log).toEqual(['1', '1<wrap0#0', 'wrap0#0<2', '2<3']);
                test_lib_1.expect(step2Log).toEqual(['1', '1<wrap0#0', 'wrap0#0<wrap1#0', 'wrap1#0<2', '2<3']);
                test_lib_1.expect(resultIdLog(result)).toEqual(['1', 'wrap0#0', 'wrap1#0', '2', '3']);
            });
            test_lib_1.it('should allow to add a parent by multiple processors to different elements', function () {
                var element = test_lib_1.el('<div id="1"><span wrap0="1" id="2"><b id="3" wrap1="1"></b></span></div>');
                var step0Log = [];
                var step1Log = [];
                var step2Log = [];
                var pipeline = new compile_pipeline_1.CompilePipeline([createWrapperStep('wrap0', step0Log), createWrapperStep('wrap1', step1Log), createLoggerStep(step2Log)]);
                var result = pipeline.process(element);
                test_lib_1.expect(step0Log).toEqual(['1', '1<2', '2<3']);
                test_lib_1.expect(step1Log).toEqual(['1', '1<wrap0#0', 'wrap0#0<2', '2<3']);
                test_lib_1.expect(step2Log).toEqual(['1', '1<wrap0#0', 'wrap0#0<2', '2<wrap1#0', 'wrap1#0<3']);
                test_lib_1.expect(resultIdLog(result)).toEqual(['1', 'wrap0#0', '2', 'wrap1#0', '3']);
            });
            test_lib_1.it('should allow to add multiple parents by the same processor', function () {
                var element = test_lib_1.el('<div id="1"><span wrap0="2" id="2"><b id="3"></b></span></div>');
                var step0Log = [];
                var step1Log = [];
                var pipeline = new compile_pipeline_1.CompilePipeline([createWrapperStep('wrap0', step0Log), createLoggerStep(step1Log)]);
                var result = pipeline.process(element);
                test_lib_1.expect(step0Log).toEqual(['1', '1<2', '2<3']);
                test_lib_1.expect(step1Log).toEqual(['1', '1<wrap0#0', 'wrap0#0<wrap0#1', 'wrap0#1<2', '2<3']);
                test_lib_1.expect(resultIdLog(result)).toEqual(['1', 'wrap0#0', 'wrap0#1', '2', '3']);
            });
        });
        test_lib_1.describe('control.addChild', function () {
            test_lib_1.it('should report the new child to all processors and the result', function () {
                var element = test_lib_1.el('<div id="1"><div id="2"></div></div>');
                var resultLog = [];
                var newChild = new compile_element_1.CompileElement(test_lib_1.el('<div id="3"></div>'));
                var pipeline = new compile_pipeline_1.CompilePipeline([new MockStep(function (parent, current, control) {
                        if (lang_1.StringWrapper.equals(dom_adapter_1.DOM.getAttribute(current.element, 'id'), '1')) {
                            control.addChild(newChild);
                        }
                    }), createLoggerStep(resultLog)]);
                var result = pipeline.process(element);
                test_lib_1.expect(result[2]).toBe(newChild);
                test_lib_1.expect(resultLog).toEqual(['1', '1<2', '1<3']);
                test_lib_1.expect(resultIdLog(result)).toEqual(['1', '2', '3']);
            });
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
var IgnoreChildrenStep = (function (_super) {
    __extends(IgnoreChildrenStep, _super);
    function IgnoreChildrenStep() {
        _super.apply(this, arguments);
    }
    IgnoreChildrenStep.prototype.process = function (parent, current, control) {
        var attributeMap = dom_adapter_1.DOM.attributeMap(current.element);
        if (collection_1.MapWrapper.contains(attributeMap, 'ignore-children')) {
            current.compileChildren = false;
        }
    };
    return IgnoreChildrenStep;
})(compile_step_1.CompileStep);
exports.IgnoreChildrenStep = IgnoreChildrenStep;
Object.defineProperty(IgnoreChildrenStep.prototype.process, "parameters", { get: function () {
        return [[compile_element_1.CompileElement], [compile_element_1.CompileElement], [compile_control_1.CompileControl]];
    } });
function logEntry(log, parent, current) {
    var parentId = '';
    if (lang_1.isPresent(parent)) {
        parentId = dom_adapter_1.DOM.getAttribute(parent.element, 'id') + '<';
    }
    collection_1.ListWrapper.push(log, parentId + dom_adapter_1.DOM.getAttribute(current.element, 'id'));
}
function createLoggerStep(log) {
    return new MockStep(function (parent, current, control) {
        logEntry(log, parent, current);
    });
}
function createWrapperStep(wrapperId, log) {
    var nextElementId = 0;
    return new MockStep(function (parent, current, control) {
        var parentCountStr = dom_adapter_1.DOM.getAttribute(current.element, wrapperId);
        if (lang_1.isPresent(parentCountStr)) {
            var parentCount = lang_1.NumberWrapper.parseInt(parentCountStr, 10);
            while (parentCount > 0) {
                control.addParent(new compile_element_1.CompileElement(test_lib_1.el("<a id=\"" + wrapperId + "#" + nextElementId++ + "\"></a>")));
                parentCount--;
            }
        }
        logEntry(log, parent, current);
    });
}
function resultIdLog(result) {
    var idLog = [];
    collection_1.ListWrapper.forEach(result, function (current) {
        logEntry(idLog, null, current);
    });
    return idLog;
}
