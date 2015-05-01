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
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var async_1 = require('angular2/src/facade/async');
var compiler_1 = require('angular2/src/render/dom/compiler/compiler');
var api_1 = require('angular2/src/render/api');
var compile_element_1 = require('angular2/src/render/dom/compiler/compile_element');
var compile_step_1 = require('angular2/src/render/dom/compiler/compile_step');
var compile_step_factory_1 = require('angular2/src/render/dom/compiler/compile_step_factory');
var compile_control_1 = require('angular2/src/render/dom/compiler/compile_control');
var template_loader_1 = require('angular2/src/render/dom/compiler/template_loader');
var url_resolver_1 = require('angular2/src/services/url_resolver');
function runCompilerCommonTests() {
    test_lib_1.describe('compiler', function () {
        var mockStepFactory;
        function createCompiler(processClosure, urlData) {
            if (urlData === void 0) { urlData = null; }
            if (lang_1.isBlank(urlData)) {
                urlData = collection_1.MapWrapper.create();
            }
            var tplLoader = new FakeTemplateLoader(urlData);
            mockStepFactory = new MockStepFactory([new MockStep(processClosure)]);
            return new compiler_1.Compiler(mockStepFactory, tplLoader);
        }
        test_lib_1.it('should run the steps and build the ProtoView of the root element', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            var compiler = createCompiler(function (parent, current, control) {
                current.inheritedProtoView.bindVariable('b', 'a');
            });
            compiler.compile(new api_1.Template({
                componentId: 'someComponent',
                inline: '<div></div>'
            })).then(function (protoView) {
                test_lib_1.expect(protoView.variableBindings).toEqual(collection_1.MapWrapper.createFromStringMap({ 'a': 'b' }));
                async.done();
            });
        }));
        test_lib_1.it('should use the inline template and compile in sync', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            var compiler = createCompiler(EMPTY_STEP);
            compiler.compile(new api_1.Template({
                componentId: 'someId',
                inline: 'inline component'
            })).then(function (protoView) {
                test_lib_1.expect(dom_adapter_1.DOM.getInnerHTML(protoView.render.delegate.element)).toEqual('inline component');
                async.done();
            });
        }));
        test_lib_1.it('should load url templates', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            var urlData = collection_1.MapWrapper.createFromStringMap({ 'someUrl': 'url component' });
            var compiler = createCompiler(EMPTY_STEP, urlData);
            compiler.compile(new api_1.Template({
                componentId: 'someId',
                absUrl: 'someUrl'
            })).then(function (protoView) {
                test_lib_1.expect(dom_adapter_1.DOM.getInnerHTML(protoView.render.delegate.element)).toEqual('url component');
                async.done();
            });
        }));
        test_lib_1.it('should report loading errors', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            var compiler = createCompiler(EMPTY_STEP, collection_1.MapWrapper.create());
            async_1.PromiseWrapper.catchError(compiler.compile(new api_1.Template({
                componentId: 'someId',
                absUrl: 'someUrl'
            })), function (e) {
                test_lib_1.expect(e.message).toContain("Failed to load the template \"someId\"");
                async.done();
            });
        }));
        test_lib_1.it('should wait for async subtasks to be resolved', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            var subTasksCompleted = false;
            var completer = async_1.PromiseWrapper.completer();
            var compiler = createCompiler(function (parent, current, control) {
                collection_1.ListWrapper.push(mockStepFactory.subTaskPromises, completer.promise.then(function (_) {
                    subTasksCompleted = true;
                }));
            });
            var pvPromise = compiler.compile(new api_1.Template({
                componentId: 'someId',
                inline: 'some component'
            }));
            test_lib_1.expect(pvPromise).toBePromise();
            test_lib_1.expect(subTasksCompleted).toEqual(false);
            completer.resolve(null);
            pvPromise.then(function (protoView) {
                test_lib_1.expect(subTasksCompleted).toEqual(true);
                async.done();
            });
        }));
    });
}
exports.runCompilerCommonTests = runCompilerCommonTests;
var MockStepFactory = (function (_super) {
    __extends(MockStepFactory, _super);
    function MockStepFactory(steps) {
        _super.call(this);
        this.steps = steps;
    }
    MockStepFactory.prototype.createSteps = function (template, subTaskPromises) {
        this.subTaskPromises = subTaskPromises;
        collection_1.ListWrapper.forEach(this.subTaskPromises, function (p) { return collection_1.ListWrapper.push(subTaskPromises, p); });
        return this.steps;
    };
    return MockStepFactory;
})(compile_step_factory_1.CompileStepFactory);
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
var EMPTY_STEP = function (parent, current, control) {
    if (lang_1.isPresent(parent)) {
        current.inheritedProtoView = parent.inheritedProtoView;
    }
};
var FakeTemplateLoader = (function (_super) {
    __extends(FakeTemplateLoader, _super);
    function FakeTemplateLoader(urlData) {
        _super.call(this, null, new url_resolver_1.UrlResolver());
        this._urlData = urlData;
    }
    FakeTemplateLoader.prototype.load = function (template) {
        if (lang_1.isPresent(template.inline)) {
            return async_1.PromiseWrapper.resolve(dom_adapter_1.DOM.createTemplate(template.inline));
        }
        if (lang_1.isPresent(template.absUrl)) {
            var content = collection_1.MapWrapper.get(this._urlData, template.absUrl);
            if (lang_1.isPresent(content)) {
                return async_1.PromiseWrapper.resolve(dom_adapter_1.DOM.createTemplate(content));
            }
        }
        return async_1.PromiseWrapper.reject('Load failed');
    };
    return FakeTemplateLoader;
})(template_loader_1.TemplateLoader);
Object.defineProperty(FakeTemplateLoader.prototype.load, "parameters", { get: function () {
        return [[api_1.Template]];
    } });
