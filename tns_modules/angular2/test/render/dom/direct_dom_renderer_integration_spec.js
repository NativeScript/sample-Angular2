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
var api_1 = require('angular2/src/render/api');
var integration_testbed_1 = require('./integration_testbed');
function main() {
    test_lib_1.describe('DirectDomRenderer integration', function () {
        var testbed, renderer, rootEl, rootProtoViewRef, eventPlugin, compile;
        function createRenderer(_a) {
            var _b = _a === void 0 ? {} : _a, urlData = _b.urlData, viewCacheCapacity = _b.viewCacheCapacity, shadowDomStrategy = _b.shadowDomStrategy, templates = _b.templates;
            testbed = new integration_testbed_1.IntegrationTestbed({
                urlData: urlData,
                viewCacheCapacity: viewCacheCapacity,
                shadowDomStrategy: shadowDomStrategy,
                templates: templates
            });
            renderer = testbed.renderer;
            rootEl = testbed.rootEl;
            rootProtoViewRef = testbed.rootProtoViewRef;
            eventPlugin = testbed.eventPlugin;
            compile = function (template, directives) { return testbed.compile(template, directives); };
        }
        test_lib_1.it('should create root views while using the given elements in place', function () {
            createRenderer();
            var viewRefs = renderer.createView(rootProtoViewRef);
            test_lib_1.expect(viewRefs.length).toBe(1);
            test_lib_1.expect(viewRefs[0].delegate.rootNodes[0]).toEqual(rootEl);
        });
        test_lib_1.it('should add a static component', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            createRenderer();
            var template = new api_1.Template({
                componentId: 'someComponent',
                inline: 'hello',
                directives: []
            });
            renderer.compile(template).then(function (pv) {
                var mergedProtoViewRefs = renderer.mergeChildComponentProtoViews(rootProtoViewRef, [pv.render]);
                renderer.createView(mergedProtoViewRefs[0]);
                test_lib_1.expect(rootEl).toHaveText('hello');
                async.done();
            });
        }));
        test_lib_1.it('should add a a dynamic component', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            createRenderer();
            var template = new api_1.Template({
                componentId: 'someComponent',
                inline: 'hello',
                directives: []
            });
            renderer.compile(template).then(function (pv) {
                var rootViewRef = renderer.createView(rootProtoViewRef)[0];
                var childComponentViewRef = renderer.createView(pv.render)[0];
                renderer.setDynamicComponentView(rootViewRef, 0, childComponentViewRef);
                test_lib_1.expect(rootEl).toHaveText('hello');
                async.done();
            });
        }));
        test_lib_1.it('should update text nodes', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            createRenderer();
            compile('{{a}}', [someComponent]).then(function (pvRefs) {
                var viewRefs = renderer.createView(pvRefs[0]);
                renderer.setText(viewRefs[1], 0, 'hello');
                test_lib_1.expect(rootEl).toHaveText('hello');
                async.done();
            });
        }));
        test_lib_1.it('should update element properties', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            createRenderer();
            compile('<input [value]="someProp">', []).then(function (pvRefs) {
                var viewRefs = renderer.createView(pvRefs[0]);
                renderer.setElementProperty(viewRefs[1], 0, 'value', 'hello');
                test_lib_1.expect(dom_adapter_1.DOM.childNodes(rootEl)[0].value).toEqual('hello');
                async.done();
            });
        }));
        test_lib_1.it('should add and remove views to and from containers', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            createRenderer();
            compile('<template>hello</template>', []).then(function (pvRefs) {
                var viewRef = renderer.createView(pvRefs[0])[1];
                var vcProtoViewRef = pvRefs[2];
                var vcRef = new api_1.ViewContainerRef(viewRef, 0);
                var childViewRef = renderer.createView(vcProtoViewRef)[0];
                test_lib_1.expect(rootEl).toHaveText('');
                renderer.insertViewIntoContainer(vcRef, childViewRef);
                test_lib_1.expect(rootEl).toHaveText('hello');
                renderer.detachViewFromContainer(vcRef, 0);
                test_lib_1.expect(rootEl).toHaveText('');
                async.done();
            });
        }));
        test_lib_1.it('should cache views', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            createRenderer({ viewCacheCapacity: 2 });
            compile('<template>hello</template>', []).then(function (pvRefs) {
                var vcProtoViewRef = pvRefs[2];
                var viewRef1 = renderer.createView(vcProtoViewRef)[0];
                renderer.destroyView(viewRef1);
                var viewRef2 = renderer.createView(vcProtoViewRef)[0];
                var viewRef3 = renderer.createView(vcProtoViewRef)[0];
                test_lib_1.expect(viewRef2.delegate).toBe(viewRef1.delegate);
                test_lib_1.expect(viewRef3.delegate).not.toBe(viewRef1.delegate);
                async.done();
            });
        }));
        test_lib_1.xit('should handle events', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            createRenderer();
            compile('<input (change)="$event.target.value">', []).then(function (pvRefs) {
                var viewRef = renderer.createView(pvRefs[0])[1];
                var dispatcher = new integration_testbed_1.LoggingEventDispatcher();
                renderer.setEventDispatcher(viewRef, dispatcher);
                var inputEl = dom_adapter_1.DOM.childNodes(rootEl)[0];
                inputEl.value = 'hello';
                eventPlugin.dispatchEvent('change', new integration_testbed_1.FakeEvent(inputEl));
                test_lib_1.expect(dispatcher.log).toEqual([[0, 'change', ['hello']]]);
                async.done();
            });
        }));
    });
}
exports.main = main;
var someComponent = new api_1.DirectiveMetadata({
    id: 'someComponent',
    type: api_1.DirectiveMetadata.COMPONENT_TYPE,
    selector: 'some-comp'
});
