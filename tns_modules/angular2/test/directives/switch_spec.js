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
var switch_1 = require('angular2/src/directives/switch');
var test_bed_1 = require('angular2/src/test_lib/test_bed');
function main() {
    test_lib_1.describe('switch', function () {
        test_lib_1.describe('switch value changes', function () {
            test_lib_1.it('should switch amongst when values', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
                var template = '<div>' + '<ul [switch]="switchValue">' + '<template [switch-when]="\'a\'"><li>when a</li></template>' + '<template [switch-when]="\'b\'"><li>when b</li></template>' + '</ul></div>';
                tb.createView(TestComponent, { html: template }).then(function (view) {
                    view.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('');
                    view.context.switchValue = 'a';
                    view.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('when a');
                    view.context.switchValue = 'b';
                    view.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('when b');
                    async.done();
                });
            }));
            test_lib_1.it('should switch amongst when values with fallback to default', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
                var template = '<div>' + '<ul [switch]="switchValue">' + '<li template="switch-when \'a\'">when a</li>' + '<li template="switch-default">when default</li>' + '</ul></div>';
                tb.createView(TestComponent, { html: template }).then(function (view) {
                    view.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('when default');
                    view.context.switchValue = 'a';
                    view.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('when a');
                    view.context.switchValue = 'b';
                    view.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('when default');
                    async.done();
                });
            }));
            test_lib_1.it('should support multiple whens with the same value', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
                var template = '<div>' + '<ul [switch]="switchValue">' + '<template [switch-when]="\'a\'"><li>when a1;</li></template>' + '<template [switch-when]="\'b\'"><li>when b1;</li></template>' + '<template [switch-when]="\'a\'"><li>when a2;</li></template>' + '<template [switch-when]="\'b\'"><li>when b2;</li></template>' + '<template [switch-default]><li>when default1;</li></template>' + '<template [switch-default]><li>when default2;</li></template>' + '</ul></div>';
                tb.createView(TestComponent, { html: template }).then(function (view) {
                    view.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('when default1;when default2;');
                    view.context.switchValue = 'a';
                    view.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('when a1;when a2;');
                    view.context.switchValue = 'b';
                    view.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('when b1;when b2;');
                    async.done();
                });
            }));
        });
        test_lib_1.describe('when values changes', function () {
            test_lib_1.it('should switch amongst when values', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
                var template = '<div>' + '<ul [switch]="switchValue">' + '<template [switch-when]="when1"><li>when 1;</li></template>' + '<template [switch-when]="when2"><li>when 2;</li></template>' + '<template [switch-default]><li>when default;</li></template>' + '</ul></div>';
                tb.createView(TestComponent, { html: template }).then(function (view) {
                    view.context.when1 = 'a';
                    view.context.when2 = 'b';
                    view.context.switchValue = 'a';
                    view.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('when 1;');
                    view.context.switchValue = 'b';
                    view.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('when 2;');
                    view.context.switchValue = 'c';
                    view.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('when default;');
                    view.context.when1 = 'c';
                    view.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('when 1;');
                    view.context.when1 = 'd';
                    view.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('when default;');
                    async.done();
                });
            }));
        });
    });
}
exports.main = main;
var TestComponent = (function () {
    function TestComponent() {
        this.switchValue = null;
        this.when1 = null;
        this.when2 = null;
    }
    return TestComponent;
})();
Object.defineProperty(TestComponent, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'test-cmp' }), new template_1.Template({ directives: [switch_1.Switch, switch_1.SwitchWhen, switch_1.SwitchDefault] })];
    } });
