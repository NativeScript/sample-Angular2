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
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var directive_parser_1 = require('angular2/src/render/dom/compiler/directive_parser');
var compile_pipeline_1 = require('angular2/src/render/dom/compiler/compile_pipeline');
var compile_step_1 = require('angular2/src/render/dom/compiler/compile_step');
var compile_element_1 = require('angular2/src/render/dom/compiler/compile_element');
var compile_control_1 = require('angular2/src/render/dom/compiler/compile_control');
var api_1 = require('angular2/src/render/api');
var change_detection_1 = require('angular2/change_detection');
function main() {
    test_lib_1.describe('DirectiveParser', function () {
        var parser, annotatedDirectives;
        test_lib_1.beforeEach(function () {
            annotatedDirectives = [someComponent, someComponent2, someComponent3, someViewport, someViewport2, someDecorator, someDecoratorIgnoringChildren, someDecoratorWithProps, someDecoratorWithEvents];
            parser = new change_detection_1.Parser(new change_detection_1.Lexer());
        });
        function createPipeline(propertyBindings) {
            if (propertyBindings === void 0) { propertyBindings = null; }
            return new compile_pipeline_1.CompilePipeline([new MockStep(function (parent, current, control) {
                    if (lang_1.isPresent(propertyBindings)) {
                        collection_1.StringMapWrapper.forEach(propertyBindings, function (ast, name) {
                            current.bindElement().bindProperty(name, ast);
                        });
                    }
                }), new directive_parser_1.DirectiveParser(parser, annotatedDirectives)]);
        }
        function process(el, propertyBindings) {
            if (propertyBindings === void 0) { propertyBindings = null; }
            var pipeline = createPipeline(propertyBindings);
            return collection_1.ListWrapper.map(pipeline.process(el), function (ce) { return ce.inheritedElementBinder; });
        }
        test_lib_1.it('should not add directives if they are not used', function () {
            var results = process(test_lib_1.el('<div></div>'));
            test_lib_1.expect(results[0]).toBe(null);
        });
        test_lib_1.it('should detect directives in attributes', function () {
            var results = process(test_lib_1.el('<div some-decor></div>'));
            test_lib_1.expect(results[0].directives[0].directiveIndex).toBe(annotatedDirectives.indexOf(someDecorator));
        });
        test_lib_1.it('should detect directives with multiple attributes', function () {
            var results = process(test_lib_1.el('<input type=text control=one></input>'));
            test_lib_1.expect(results[0].directives[0].directiveIndex).toBe(annotatedDirectives.indexOf(someComponent3));
        });
        test_lib_1.it('should compile children by default', function () {
            var results = createPipeline().process(test_lib_1.el('<div some-decor></div>'));
            test_lib_1.expect(results[0].compileChildren).toEqual(true);
        });
        test_lib_1.it('should stop compiling children when specified in the directive config', function () {
            var results = createPipeline().process(test_lib_1.el('<div some-decor-ignoring-children></div>'));
            test_lib_1.expect(results[0].compileChildren).toEqual(false);
        });
        test_lib_1.it('should bind directive properties from bound properties', function () {
            var results = process(test_lib_1.el('<div some-decor-props></div>'), { 'elProp': parser.parseBinding('someExpr', '') });
            var directiveBinding = results[0].directives[0];
            test_lib_1.expect(collection_1.MapWrapper.get(directiveBinding.propertyBindings, 'dirProp').source).toEqual('someExpr');
        });
        test_lib_1.it('should bind directive properties with pipes', function () {
            var results = process(test_lib_1.el('<div some-decor-props></div>'), { 'elProp': parser.parseBinding('someExpr', '') });
            var directiveBinding = results[0].directives[0];
            var pipedProp = collection_1.MapWrapper.get(directiveBinding.propertyBindings, 'doubleProp');
            var simpleProp = collection_1.MapWrapper.get(directiveBinding.propertyBindings, 'dirProp');
            test_lib_1.expect(pipedProp.ast.name).toEqual('double');
            test_lib_1.expect(pipedProp.ast.exp).toEqual(simpleProp.ast);
            test_lib_1.expect(simpleProp.source).toEqual('someExpr');
        });
        test_lib_1.it('should bind directive properties from attribute values', function () {
            var results = process(test_lib_1.el('<div some-decor-props el-prop="someValue"></div>'));
            var directiveBinding = results[0].directives[0];
            var simpleProp = collection_1.MapWrapper.get(directiveBinding.propertyBindings, 'dirProp');
            test_lib_1.expect(simpleProp.source).toEqual('someValue');
        });
        test_lib_1.it('should store working property setters', function () {
            var element = test_lib_1.el('<input some-decor-props>');
            var results = process(element);
            var setter = collection_1.MapWrapper.get(results[0].propertySetters, 'value');
            setter(element, 'abc');
            test_lib_1.expect(element.value).toEqual('abc');
        });
        test_lib_1.it('should read attribute values', function () {
            var element = test_lib_1.el('<input some-decor-props some-attr="someValue">');
            var results = process(element);
            test_lib_1.expect(collection_1.MapWrapper.get(results[0].readAttributes, 'some-attr')).toEqual('someValue');
        });
        test_lib_1.it('should bind directive events', function () {
            var results = process(test_lib_1.el('<div some-decor-events></div>'));
            var directiveBinding = results[0].directives[0];
            test_lib_1.expect(collection_1.MapWrapper.get(directiveBinding.eventBindings, 'click').source).toEqual('doIt()');
        });
        test_lib_1.describe('viewport directives', function () {
            test_lib_1.it('should not allow multiple viewport directives on the same element', function () {
                test_lib_1.expect(function () {
                    process(test_lib_1.el('<template some-vp some-vp2></template>'));
                }).toThrowError('Only one viewport directive is allowed per element - check <template some-vp some-vp2>');
            });
            test_lib_1.it('should not allow viewport directives on non <template> elements', function () {
                test_lib_1.expect(function () {
                    process(test_lib_1.el('<div some-vp></div>'));
                }).toThrowError('Viewport directives need to be placed on <template> elements or elements with template attribute - check <div some-vp>');
            });
        });
        test_lib_1.describe('component directives', function () {
            test_lib_1.it('should save the component id', function () {
                var results = process(test_lib_1.el('<div some-comp></div>'));
                test_lib_1.expect(results[0].componentId).toEqual('someComponent');
            });
            test_lib_1.it('should not allow multiple component directives on the same element', function () {
                test_lib_1.expect(function () {
                    process(test_lib_1.el('<div some-comp some-comp2></div>'));
                }).toThrowError('Only one component directive is allowed per element - check <div some-comp some-comp2>');
            });
            test_lib_1.it('should not allow component directives on <template> elements', function () {
                test_lib_1.expect(function () {
                    process(test_lib_1.el('<template some-comp></template>'));
                }).toThrowError('Only template directives are allowed on template elements - check <template some-comp>');
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
var someComponent = new api_1.DirectiveMetadata({
    selector: '[some-comp]',
    id: 'someComponent',
    type: api_1.DirectiveMetadata.COMPONENT_TYPE
});
var someComponent2 = new api_1.DirectiveMetadata({
    selector: '[some-comp2]',
    id: 'someComponent2',
    type: api_1.DirectiveMetadata.COMPONENT_TYPE
});
var someComponent3 = new api_1.DirectiveMetadata({
    selector: 'input[type=text][control]',
    id: 'someComponent3',
    type: api_1.DirectiveMetadata.COMPONENT_TYPE
});
var someViewport = new api_1.DirectiveMetadata({
    selector: '[some-vp]',
    id: 'someViewport',
    type: api_1.DirectiveMetadata.VIEWPORT_TYPE
});
var someViewport2 = new api_1.DirectiveMetadata({
    selector: '[some-vp2]',
    id: 'someViewport2',
    type: api_1.DirectiveMetadata.VIEWPORT_TYPE
});
var someDecorator = new api_1.DirectiveMetadata({ selector: '[some-decor]' });
var someDecoratorIgnoringChildren = new api_1.DirectiveMetadata({
    selector: '[some-decor-ignoring-children]',
    compileChildren: false
});
var someDecoratorWithProps = new api_1.DirectiveMetadata({
    selector: '[some-decor-props]',
    bind: collection_1.MapWrapper.createFromStringMap({
        'dirProp': 'elProp',
        'doubleProp': 'elProp | double'
    }),
    setters: ['value'],
    readAttributes: ['some-attr']
});
var someDecoratorWithEvents = new api_1.DirectiveMetadata({
    selector: '[some-decor-events]',
    events: collection_1.MapWrapper.createFromStringMap({ 'click': 'doIt()' })
});
