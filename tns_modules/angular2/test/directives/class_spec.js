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
var template_1 = require('angular2/src/core/annotations/template');
var annotations_1 = require('angular2/src/core/annotations/annotations');
var test_bed_1 = require('angular2/src/test_lib/test_bed');
var class_1 = require('angular2/src/directives/class');
function main() {
    test_lib_1.describe('binding to CSS class list', function () {
        test_lib_1.it('should add classes specified in an object literal', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            var template = '<div [class]="{foo: true, bar: false}"></div>';
            tb.createView(TestComponent, { html: template }).then(function (view) {
                view.detectChanges();
                test_lib_1.expect(view.nodes[0].className).toEqual('ng-binding foo');
                async.done();
            });
        }));
        test_lib_1.it('should add and remove classes based on changes in object literal values', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            var template = '<div [class]="{foo: condition, bar: !condition}"></div>';
            tb.createView(TestComponent, { html: template }).then(function (view) {
                view.detectChanges();
                test_lib_1.expect(view.nodes[0].className).toEqual('ng-binding foo');
                view.context.condition = false;
                view.detectChanges();
                test_lib_1.expect(view.nodes[0].className).toEqual('ng-binding bar');
                async.done();
            });
        }));
        test_lib_1.it('should add and remove classes based on changes to the expression object', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            var template = '<div [class]="expr"></div>';
            tb.createView(TestComponent, { html: template }).then(function (view) {
                view.detectChanges();
                test_lib_1.expect(view.nodes[0].className).toEqual('ng-binding foo');
                collection_1.StringMapWrapper.set(view.context.expr, 'bar', true);
                view.detectChanges();
                test_lib_1.expect(view.nodes[0].className).toEqual('ng-binding foo bar');
                collection_1.StringMapWrapper.set(view.context.expr, 'baz', true);
                view.detectChanges();
                test_lib_1.expect(view.nodes[0].className).toEqual('ng-binding foo bar baz');
                collection_1.StringMapWrapper.delete(view.context.expr, 'bar');
                view.detectChanges();
                test_lib_1.expect(view.nodes[0].className).toEqual('ng-binding foo baz');
                async.done();
            });
        }));
        test_lib_1.it('should retain existing classes when expression evaluates to null', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            var template = '<div [class]="expr"></div>';
            tb.createView(TestComponent, { html: template }).then(function (view) {
                view.detectChanges();
                test_lib_1.expect(view.nodes[0].className).toEqual('ng-binding foo');
                view.context.expr = null;
                view.detectChanges();
                test_lib_1.expect(view.nodes[0].className).toEqual('ng-binding foo');
                view.context.expr = {
                    'foo': false,
                    'bar': true
                };
                view.detectChanges();
                test_lib_1.expect(view.nodes[0].className).toEqual('ng-binding bar');
                async.done();
            });
        }));
        test_lib_1.it('should co-operate with the class attribute', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            var template = '<div [class]="expr" class="init foo"></div>';
            tb.createView(TestComponent, { html: template }).then(function (view) {
                collection_1.StringMapWrapper.set(view.context.expr, 'bar', true);
                view.detectChanges();
                test_lib_1.expect(view.nodes[0].className).toEqual('init foo ng-binding bar');
                collection_1.StringMapWrapper.set(view.context.expr, 'foo', false);
                view.detectChanges();
                test_lib_1.expect(view.nodes[0].className).toEqual('init ng-binding bar');
                async.done();
            });
        }));
        test_lib_1.it('should co-operate with the class attribute and class.name binding', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            var template = '<div class="init foo" [class]="expr" [class.baz]="condition"></div>';
            tb.createView(TestComponent, { html: template }).then(function (view) {
                view.detectChanges();
                test_lib_1.expect(view.nodes[0].className).toEqual('init foo ng-binding baz');
                collection_1.StringMapWrapper.set(view.context.expr, 'bar', true);
                view.detectChanges();
                test_lib_1.expect(view.nodes[0].className).toEqual('init foo ng-binding baz bar');
                collection_1.StringMapWrapper.set(view.context.expr, 'foo', false);
                view.detectChanges();
                test_lib_1.expect(view.nodes[0].className).toEqual('init ng-binding baz bar');
                view.context.condition = false;
                view.detectChanges();
                test_lib_1.expect(view.nodes[0].className).toEqual('init ng-binding bar');
                async.done();
            });
        }));
    });
}
exports.main = main;
var TestComponent = (function () {
    function TestComponent() {
        this.condition = true;
        this.expr = {
            'foo': true,
            'bar': false
        };
    }
    return TestComponent;
})();
Object.defineProperty(TestComponent, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'test-cmp' }), new template_1.Template({ directives: [class_1.CSSClass] })];
    } });
