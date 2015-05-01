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
var annotations_1 = require('angular2/src/core/annotations/annotations');
var template_1 = require('angular2/src/core/annotations/template');
var element_1 = require('angular2/src/core/dom/element');
var non_bindable_1 = require('angular2/src/directives/non_bindable');
var test_bed_1 = require('angular2/src/test_lib/test_bed');
function main() {
    test_lib_1.describe('non-bindable', function () {
        test_lib_1.it('should not interpolate children', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            var template = '<div>{{text}}<span non-bindable>{{text}}</span></div>';
            tb.createView(TestComponent, { html: template }).then(function (view) {
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('foo{{text}}');
                async.done();
            });
        }));
        test_lib_1.it('should ignore directives on child nodes', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            var template = '<div non-bindable><span id=child test-dec>{{text}}</span></div>';
            tb.createView(TestComponent, { html: template }).then(function (view) {
                view.detectChanges();
                var span = dom_adapter_1.DOM.querySelector(view.nodes[0], '#child');
                test_lib_1.expect(dom_adapter_1.DOM.hasClass(span, 'compiled')).toBeFalsy();
                async.done();
            });
        }));
        test_lib_1.it('should trigger directives on the same node', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            var template = '<div><span id=child non-bindable test-dec>{{text}}</span></div>';
            tb.createView(TestComponent, { html: template }).then(function (view) {
                view.detectChanges();
                var span = dom_adapter_1.DOM.querySelector(view.nodes[0], '#child');
                test_lib_1.expect(dom_adapter_1.DOM.hasClass(span, 'compiled')).toBeTruthy();
                async.done();
            });
        }));
    });
}
exports.main = main;
var TestComponent = (function () {
    function TestComponent() {
        this.text = 'foo';
    }
    return TestComponent;
})();
Object.defineProperty(TestComponent, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'test-cmp' }), new template_1.Template({ directives: [non_bindable_1.NonBindable, TestDecorator] })];
    } });
var TestDecorator = (function () {
    function TestDecorator(el) {
        dom_adapter_1.DOM.addClass(el.domElement, 'compiled');
    }
    return TestDecorator;
})();
Object.defineProperty(TestDecorator, "annotations", { get: function () {
        return [new annotations_1.Decorator({ selector: '[test-dec]' })];
    } });
Object.defineProperty(TestDecorator, "parameters", { get: function () {
        return [[element_1.NgElement]];
    } });
