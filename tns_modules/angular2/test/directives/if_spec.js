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
var test_bed_1 = require('angular2/src/test_lib/test_bed');
var annotations_1 = require('angular2/src/core/annotations/annotations');
var template_1 = require('angular2/src/core/annotations/template');
var if_1 = require('angular2/src/directives/if');
function main() {
    test_lib_1.describe('if directive', function () {
        test_lib_1.it('should work in a template attribute', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            var html = '<div><copy-me template="if booleanCondition">hello</copy-me></div>';
            tb.createView(TestComponent, { html: html }).then(function (view) {
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.querySelectorAll(view.nodes[0], 'copy-me').length).toEqual(1);
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('hello');
                async.done();
            });
        }));
        test_lib_1.it('should work in a template element', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            var html = '<div><template [if]="booleanCondition"><copy-me>hello2</copy-me></template></div>';
            tb.createView(TestComponent, { html: html }).then(function (view) {
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.querySelectorAll(view.nodes[0], 'copy-me').length).toEqual(1);
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('hello2');
                async.done();
            });
        }));
        test_lib_1.it('should toggle node when condition changes', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            var html = '<div><copy-me template="if booleanCondition">hello</copy-me></div>';
            tb.createView(TestComponent, { html: html }).then(function (view) {
                view.context.booleanCondition = false;
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.querySelectorAll(view.nodes[0], 'copy-me').length).toEqual(0);
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('');
                view.context.booleanCondition = true;
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.querySelectorAll(view.nodes[0], 'copy-me').length).toEqual(1);
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('hello');
                view.context.booleanCondition = false;
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.querySelectorAll(view.nodes[0], 'copy-me').length).toEqual(0);
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('');
                async.done();
            });
        }));
        test_lib_1.it('should handle nested if correctly', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            var html = '<div><template [if]="booleanCondition"><copy-me *if="nestedBooleanCondition">hello</copy-me></template></div>';
            tb.createView(TestComponent, { html: html }).then(function (view) {
                view.context.booleanCondition = false;
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.querySelectorAll(view.nodes[0], 'copy-me').length).toEqual(0);
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('');
                view.context.booleanCondition = true;
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.querySelectorAll(view.nodes[0], 'copy-me').length).toEqual(1);
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('hello');
                view.context.nestedBooleanCondition = false;
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.querySelectorAll(view.nodes[0], 'copy-me').length).toEqual(0);
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('');
                view.context.nestedBooleanCondition = true;
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.querySelectorAll(view.nodes[0], 'copy-me').length).toEqual(1);
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('hello');
                view.context.booleanCondition = false;
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.querySelectorAll(view.nodes[0], 'copy-me').length).toEqual(0);
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('');
                async.done();
            });
        }));
        test_lib_1.it('should update several nodes with if', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            var html = '<div>' + '<copy-me template="if numberCondition + 1 >= 2">helloNumber</copy-me>' + '<copy-me template="if stringCondition == \'foo\'">helloString</copy-me>' + '<copy-me template="if functionCondition(stringCondition, numberCondition)">helloFunction</copy-me>' + '</div>';
            tb.createView(TestComponent, { html: html }).then(function (view) {
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.querySelectorAll(view.nodes[0], 'copy-me').length).toEqual(3);
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('helloNumberhelloStringhelloFunction');
                view.context.numberCondition = 0;
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.querySelectorAll(view.nodes[0], 'copy-me').length).toEqual(1);
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('helloString');
                view.context.numberCondition = 1;
                view.context.stringCondition = "bar";
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.querySelectorAll(view.nodes[0], 'copy-me').length).toEqual(1);
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('helloNumber');
                async.done();
            });
        }));
        if (!test_lib_1.IS_DARTIUM) {
            test_lib_1.it('should not add the element twice if the condition goes from true to true (JS)', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
                var html = '<div><copy-me template="if numberCondition">hello</copy-me></div>';
                tb.createView(TestComponent, { html: html }).then(function (view) {
                    view.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.querySelectorAll(view.nodes[0], 'copy-me').length).toEqual(1);
                    test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('hello');
                    view.context.numberCondition = 2;
                    view.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.querySelectorAll(view.nodes[0], 'copy-me').length).toEqual(1);
                    test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('hello');
                    async.done();
                });
            }));
            test_lib_1.it('should not recreate the element if the condition goes from true to true (JS)', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
                var html = '<div><copy-me template="if numberCondition">hello</copy-me></div>';
                tb.createView(TestComponent, { html: html }).then(function (view) {
                    view.detectChanges();
                    dom_adapter_1.DOM.addClass(view.nodes[0].childNodes[1], "foo");
                    view.context.numberCondition = 2;
                    view.detectChanges();
                    test_lib_1.expect(dom_adapter_1.DOM.hasClass(view.nodes[0].childNodes[1], "foo")).toBe(true);
                    async.done();
                });
            }));
        }
        if (test_lib_1.IS_DARTIUM) {
            test_lib_1.it('should not create the element if the condition is not a boolean (DART)', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
                var html = '<div><copy-me template="if numberCondition">hello</copy-me></div>';
                tb.createView(TestComponent, { html: html }).then(function (view) {
                    test_lib_1.expect(function () { return view.detectChanges(); }).toThrowError();
                    test_lib_1.expect(dom_adapter_1.DOM.querySelectorAll(view.nodes[0], 'copy-me').length).toEqual(0);
                    test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('');
                    async.done();
                });
            }));
        }
    });
}
exports.main = main;
var TestComponent = (function () {
    function TestComponent() {
        this.booleanCondition = true;
        this.nestedBooleanCondition = true;
        this.numberCondition = 1;
        this.stringCondition = "foo";
        this.functionCondition = function (s, n) {
            return s == "foo" && n == 1;
        };
    }
    return TestComponent;
})();
Object.defineProperty(TestComponent, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'test-cmp' }), new template_1.Template({ directives: [if_1.If] })];
    } });
