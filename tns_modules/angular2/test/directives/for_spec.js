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
var annotations_1 = require('angular2/src/core/annotations/annotations');
var template_1 = require('angular2/src/core/annotations/template');
var for_1 = require('angular2/src/directives/for');
var test_bed_1 = require('angular2/src/test_lib/test_bed');
function main() {
    test_lib_1.describe('for', function () {
        var TEMPLATE = '<div><copy-me template="for #item of items">{{item.toString()}};</copy-me></div>';
        test_lib_1.it('should reflect initial elements', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            tb.createView(TestComponent, { html: TEMPLATE }).then(function (view) {
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('1;2;');
                async.done();
            });
        }));
        test_lib_1.it('should reflect added elements', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            tb.createView(TestComponent, { html: TEMPLATE }).then(function (view) {
                view.detectChanges();
                collection_1.ListWrapper.push(view.context.items, 3);
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('1;2;3;');
                async.done();
            });
        }));
        test_lib_1.it('should reflect removed elements', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            tb.createView(TestComponent, { html: TEMPLATE }).then(function (view) {
                view.detectChanges();
                collection_1.ListWrapper.removeAt(view.context.items, 1);
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('1;');
                async.done();
            });
        }));
        test_lib_1.it('should reflect moved elements', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            tb.createView(TestComponent, { html: TEMPLATE }).then(function (view) {
                view.detectChanges();
                collection_1.ListWrapper.removeAt(view.context.items, 0);
                collection_1.ListWrapper.push(view.context.items, 1);
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('2;1;');
                async.done();
            });
        }));
        test_lib_1.it('should reflect a mix of all changes (additions/removals/moves)', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            tb.createView(TestComponent, { html: TEMPLATE }).then(function (view) {
                view.context.items = [0, 1, 2, 3, 4, 5];
                view.detectChanges();
                view.context.items = [6, 2, 7, 0, 4, 8];
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('6;2;7;0;4;8;');
                async.done();
            });
        }));
        test_lib_1.it('should iterate over an array of objects', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            var template = '<ul><li template="for #item of items">{{item["name"]}};</li></ul>';
            tb.createView(TestComponent, { html: template }).then(function (view) {
                view.context.items = [{ 'name': 'misko' }, { 'name': 'shyam' }];
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('misko;shyam;');
                collection_1.ListWrapper.push(view.context.items, { 'name': 'adam' });
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('misko;shyam;adam;');
                collection_1.ListWrapper.removeAt(view.context.items, 2);
                collection_1.ListWrapper.removeAt(view.context.items, 0);
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('shyam;');
                async.done();
            });
        }));
        test_lib_1.it('should gracefully handle nulls', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            var template = '<ul><li template="for #item of null">{{item}};</li></ul>';
            tb.createView(TestComponent, { html: template }).then(function (view) {
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('');
                async.done();
            });
        }));
        test_lib_1.it('should gracefully handle ref changing to null and back', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            tb.createView(TestComponent, { html: TEMPLATE }).then(function (view) {
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('1;2;');
                view.context.items = null;
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('');
                view.context.items = [1, 2, 3];
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('1;2;3;');
                async.done();
            });
        }));
        test_lib_1.it('should throw on ref changing to string', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            tb.createView(TestComponent, { html: TEMPLATE }).then(function (view) {
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('1;2;');
                view.context.items = 'whaaa';
                test_lib_1.expect(function () { return view.detectChanges(); }).toThrowError();
                async.done();
            });
        }));
        test_lib_1.it('should works with duplicates', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            tb.createView(TestComponent, { html: TEMPLATE }).then(function (view) {
                var a = new Foo();
                view.context.items = [a, a];
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('foo;foo;');
                async.done();
            });
        }));
        test_lib_1.it('should repeat over nested arrays', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            var template = '<div>' + '<div template="for #item of items">' + '<div template="for #subitem of item">' + '{{subitem}}-{{item.length}};' + '</div>|' + '</div>' + '</div>';
            tb.createView(TestComponent, { html: template }).then(function (view) {
                view.context.items = [['a', 'b'], ['c']];
                view.detectChanges();
                view.detectChanges();
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('a-2;b-2;|c-1;|');
                view.context.items = [['e'], ['f', 'g']];
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('e-1;|f-2;g-2;|');
                async.done();
            });
        }));
        test_lib_1.it('should repeat over nested arrays with no intermediate element', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            var template = '<div><template [for] #item [of]="items">' + '<div template="for #subitem of item">' + '{{subitem}}-{{item.length}};' + '</div></template></div>';
            tb.createView(TestComponent, { html: template }).then(function (view) {
                view.context.items = [['a', 'b'], ['c']];
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('a-2;b-2;c-1;');
                view.context.items = [['e'], ['f', 'g']];
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('e-1;f-2;g-2;');
                async.done();
            });
        }));
        test_lib_1.it('should display indices correctly', test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
            var template = '<div><copy-me template="for: var item of items; var i=index">{{i.toString()}}</copy-me></div>';
            tb.createView(TestComponent, { html: template }).then(function (view) {
                view.context.items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('0123456789');
                view.context.items = [1, 2, 6, 7, 4, 3, 5, 8, 9, 0];
                view.detectChanges();
                test_lib_1.expect(dom_adapter_1.DOM.getText(view.nodes[0])).toEqual('0123456789');
                async.done();
            });
        }));
    });
}
exports.main = main;
var Foo = (function () {
    function Foo() {
    }
    Foo.prototype.toString = function () {
        return 'foo';
    };
    return Foo;
})();
var TestComponent = (function () {
    function TestComponent() {
        this.items = [1, 2];
    }
    return TestComponent;
})();
Object.defineProperty(TestComponent, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'test-cmp' }), new template_1.Template({ directives: [for_1.For] })];
    } });
