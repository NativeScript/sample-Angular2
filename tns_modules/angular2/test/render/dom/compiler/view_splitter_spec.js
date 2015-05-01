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
var view_splitter_1 = require('angular2/src/render/dom/compiler/view_splitter');
var compile_pipeline_1 = require('angular2/src/render/dom/compiler/compile_pipeline');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var change_detection_1 = require('angular2/change_detection');
function main() {
    test_lib_1.describe('ViewSplitter', function () {
        function createPipeline() {
            return new compile_pipeline_1.CompilePipeline([new view_splitter_1.ViewSplitter(new change_detection_1.Parser(new change_detection_1.Lexer()))]);
        }
        test_lib_1.describe('<template> elements', function () {
            test_lib_1.it('should move the content into a new <template> element and mark that as viewRoot', function () {
                var rootElement = test_lib_1.el('<div><template if="true">a</template></div>');
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(dom_adapter_1.DOM.getOuterHTML(results[1].element)).toEqual('<template if="true" class="ng-binding"></template>');
                test_lib_1.expect(results[1].isViewRoot).toBe(false);
                test_lib_1.expect(dom_adapter_1.DOM.getOuterHTML(results[2].element)).toEqual('<template>a</template>');
                test_lib_1.expect(results[2].isViewRoot).toBe(true);
            });
            test_lib_1.it('should mark the new <template> element as viewRoot', function () {
                var rootElement = test_lib_1.el('<div><template if="true">a</template></div>');
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(results[2].isViewRoot).toBe(true);
            });
            test_lib_1.it('should not wrap the root element', function () {
                var rootElement = test_lib_1.el('<div></div>');
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(results.length).toBe(1);
                test_lib_1.expect(dom_adapter_1.DOM.getOuterHTML(rootElement)).toEqual('<div></div>');
            });
            test_lib_1.it('should copy over the elementDescription', function () {
                var rootElement = test_lib_1.el('<div><template if="true">a</template></div>');
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(results[2].elementDescription).toBe(results[1].elementDescription);
            });
            test_lib_1.it('should clean out the inheritedElementBinder', function () {
                var rootElement = test_lib_1.el('<div><template if="true">a</template></div>');
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(results[2].inheritedElementBinder).toBe(null);
            });
            test_lib_1.it('should create a nestedProtoView', function () {
                var rootElement = test_lib_1.el('<div><template if="true">a</template></div>');
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(results[2].inheritedProtoView).not.toBe(null);
                test_lib_1.expect(results[2].inheritedProtoView).toBe(results[1].inheritedElementBinder.nestedProtoView);
                test_lib_1.expect(dom_adapter_1.DOM.getOuterHTML(results[2].inheritedProtoView.rootElement)).toEqual('<template>a</template>');
            });
        });
        test_lib_1.describe('elements with template attribute', function () {
            test_lib_1.it('should replace the element with an empty <template> element', function () {
                var rootElement = test_lib_1.el('<div><span template=""></span></div>');
                var originalChild = rootElement.childNodes[0];
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(results[0].element).toBe(rootElement);
                test_lib_1.expect(dom_adapter_1.DOM.getOuterHTML(results[0].element)).toEqual('<div><template class="ng-binding"></template></div>');
                test_lib_1.expect(dom_adapter_1.DOM.getOuterHTML(results[2].element)).toEqual('<span template=""></span>');
                test_lib_1.expect(results[2].element).toBe(originalChild);
            });
            test_lib_1.it('should work with top-level template node', function () {
                var rootElement = test_lib_1.el('<template><div template>x</div></template>');
                var originalChild = dom_adapter_1.DOM.content(rootElement).childNodes[0];
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(results[0].element).toBe(rootElement);
                test_lib_1.expect(results[0].isViewRoot).toBe(true);
                test_lib_1.expect(results[2].isViewRoot).toBe(true);
                test_lib_1.expect(dom_adapter_1.DOM.getOuterHTML(results[0].element)).toEqual('<template><template class="ng-binding"></template></template>');
                test_lib_1.expect(results[2].element).toBe(originalChild);
            });
            test_lib_1.it('should mark the element as viewRoot', function () {
                var rootElement = test_lib_1.el('<div><div template></div></div>');
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(results[2].isViewRoot).toBe(true);
            });
            test_lib_1.it('should add property bindings from the template attribute', function () {
                var rootElement = test_lib_1.el('<div><div template="some-prop:expr"></div></div>');
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(collection_1.MapWrapper.get(results[1].inheritedElementBinder.propertyBindings, 'someProp').source).toEqual('expr');
                test_lib_1.expect(collection_1.MapWrapper.get(results[1].attrs(), 'some-prop')).toEqual('expr');
            });
            test_lib_1.it('should add variable mappings from the template attribute to the nestedProtoView', function () {
                var rootElement = test_lib_1.el('<div><div template="var var-name=mapName"></div></div>');
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(results[2].inheritedProtoView.variableBindings).toEqual(collection_1.MapWrapper.createFromStringMap({ 'mapName': 'varName' }));
            });
            test_lib_1.it('should add entries without value as attributes to the element', function () {
                var rootElement = test_lib_1.el('<div><div template="varname"></div></div>');
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(collection_1.MapWrapper.get(results[1].attrs(), 'varname')).toEqual('');
                test_lib_1.expect(results[1].inheritedElementBinder.propertyBindings).toEqual(collection_1.MapWrapper.create());
                test_lib_1.expect(results[1].inheritedElementBinder.variableBindings).toEqual(collection_1.MapWrapper.create());
            });
            test_lib_1.it('should iterate properly after a template dom modification', function () {
                var rootElement = test_lib_1.el('<div><div template></div><after></after></div>');
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(results.length).toEqual(4);
            });
            test_lib_1.it('should copy over the elementDescription', function () {
                var rootElement = test_lib_1.el('<div><span template=""></span></div>');
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(results[2].elementDescription).toBe(results[1].elementDescription);
            });
            test_lib_1.it('should clean out the inheritedElementBinder', function () {
                var rootElement = test_lib_1.el('<div><span template=""></span></div>');
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(results[2].inheritedElementBinder).toBe(null);
            });
            test_lib_1.it('should create a nestedProtoView', function () {
                var rootElement = test_lib_1.el('<div><span template=""></span></div>');
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(results[2].inheritedProtoView).not.toBe(null);
                test_lib_1.expect(results[2].inheritedProtoView).toBe(results[1].inheritedElementBinder.nestedProtoView);
                test_lib_1.expect(dom_adapter_1.DOM.getOuterHTML(results[2].inheritedProtoView.rootElement)).toEqual('<span template=""></span>');
            });
        });
        test_lib_1.describe('elements with *directive_name attribute', function () {
            test_lib_1.it('should replace the element with an empty <template> element', function () {
                var rootElement = test_lib_1.el('<div><span *if></span></div>');
                var originalChild = rootElement.childNodes[0];
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(results[0].element).toBe(rootElement);
                test_lib_1.expect(dom_adapter_1.DOM.getOuterHTML(results[0].element)).toEqual('<div><template class="ng-binding" if=""></template></div>');
                test_lib_1.expect(dom_adapter_1.DOM.getOuterHTML(results[2].element)).toEqual('<span *if=""></span>');
                test_lib_1.expect(results[2].element).toBe(originalChild);
            });
            test_lib_1.it('should mark the element as viewRoot', function () {
                var rootElement = test_lib_1.el('<div><div *foo="bar"></div></div>');
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(results[2].isViewRoot).toBe(true);
            });
            test_lib_1.it('should work with top-level template node', function () {
                var rootElement = test_lib_1.el('<template><div *foo>x</div></template>');
                var originalChild = dom_adapter_1.DOM.content(rootElement).childNodes[0];
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(results[0].element).toBe(rootElement);
                test_lib_1.expect(results[0].isViewRoot).toBe(true);
                test_lib_1.expect(results[2].isViewRoot).toBe(true);
                test_lib_1.expect(dom_adapter_1.DOM.getOuterHTML(results[0].element)).toEqual('<template><template class="ng-binding" foo=""></template></template>');
                test_lib_1.expect(results[2].element).toBe(originalChild);
            });
            test_lib_1.it('should add property bindings from the template attribute', function () {
                var rootElement = test_lib_1.el('<div><div *prop="expr"></div></div>');
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(collection_1.MapWrapper.get(results[1].inheritedElementBinder.propertyBindings, 'prop').source).toEqual('expr');
                test_lib_1.expect(collection_1.MapWrapper.get(results[1].attrs(), 'prop')).toEqual('expr');
            });
            test_lib_1.it('should add variable mappings from the template attribute to the nestedProtoView', function () {
                var rootElement = test_lib_1.el('<div><div *foreach="var varName=mapName"></div></div>');
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(results[2].inheritedProtoView.variableBindings).toEqual(collection_1.MapWrapper.createFromStringMap({ 'mapName': 'varName' }));
            });
            test_lib_1.it('should add entries without value as attribute to the element', function () {
                var rootElement = test_lib_1.el('<div><div *varname></div></div>');
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(collection_1.MapWrapper.get(results[1].attrs(), 'varname')).toEqual('');
                test_lib_1.expect(results[1].inheritedElementBinder.propertyBindings).toEqual(collection_1.MapWrapper.create());
                test_lib_1.expect(results[1].inheritedElementBinder.variableBindings).toEqual(collection_1.MapWrapper.create());
            });
            test_lib_1.it('should iterate properly after a template dom modification', function () {
                var rootElement = test_lib_1.el('<div><div *foo></div><after></after></div>');
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(results.length).toEqual(4);
            });
            test_lib_1.it('should copy over the elementDescription', function () {
                var rootElement = test_lib_1.el('<div><span *foo></span></div>');
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(results[2].elementDescription).toBe(results[1].elementDescription);
            });
            test_lib_1.it('should clean out the inheritedElementBinder', function () {
                var rootElement = test_lib_1.el('<div><span *foo></span></div>');
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(results[2].inheritedElementBinder).toBe(null);
            });
            test_lib_1.it('should create a nestedProtoView', function () {
                var rootElement = test_lib_1.el('<div><span *foo></span></div>');
                var results = createPipeline().process(rootElement);
                test_lib_1.expect(results[2].inheritedProtoView).not.toBe(null);
                test_lib_1.expect(results[2].inheritedProtoView).toBe(results[1].inheritedElementBinder.nestedProtoView);
                test_lib_1.expect(dom_adapter_1.DOM.getOuterHTML(results[2].inheritedProtoView.rootElement)).toEqual('<span *foo=""></span>');
            });
        });
    });
}
exports.main = main;
