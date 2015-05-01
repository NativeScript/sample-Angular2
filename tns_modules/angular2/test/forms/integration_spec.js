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
var di_1 = require('angular2/di');
var angular2_1 = require('angular2/angular2');
var test_bed_1 = require('angular2/src/test_lib/test_bed');
var forms_1 = require('angular2/forms');
function main() {
    if (dom_adapter_1.DOM.supportsDOMEvents()) {
        test_lib_1.describe("integration tests", function () {
            test_lib_1.it("should initialize DOM elements with the given form object", test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
                var ctx = new MyComp(new forms_1.ControlGroup({ "login": new forms_1.Control("loginValue") }));
                var t = "<div [control-group]=\"form\">\n                <input type=\"text\" control=\"login\">\n              </div>";
                tb.createView(MyComp, {
                    context: ctx,
                    html: t
                }).then(function (view) {
                    view.detectChanges();
                    var input = view.querySelector("input");
                    test_lib_1.expect(input.value).toEqual("loginValue");
                    async.done();
                });
            }));
            test_lib_1.it("should update the control group values on DOM change", test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
                var form = new forms_1.ControlGroup({ "login": new forms_1.Control("oldValue") });
                var ctx = new MyComp(form);
                var t = "<div [control-group]=\"form\">\n                  <input type=\"text\" control=\"login\">\n                </div>";
                tb.createView(MyComp, {
                    context: ctx,
                    html: t
                }).then(function (view) {
                    view.detectChanges();
                    var input = view.querySelector("input");
                    input.value = "updatedValue";
                    test_lib_1.dispatchEvent(input, "change");
                    test_lib_1.expect(form.value).toEqual({ "login": "updatedValue" });
                    async.done();
                });
            }));
            test_lib_1.it("should work with single controls", test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
                var control = new forms_1.Control("loginValue");
                var ctx = new MyComp(control);
                var t = "<div><input type=\"text\" [control]=\"form\"></div>";
                tb.createView(MyComp, {
                    context: ctx,
                    html: t
                }).then(function (view) {
                    view.detectChanges();
                    var input = view.querySelector("input");
                    test_lib_1.expect(input.value).toEqual("loginValue");
                    input.value = "updatedValue";
                    test_lib_1.dispatchEvent(input, "change");
                    test_lib_1.expect(control.value).toEqual("updatedValue");
                    async.done();
                });
            }));
            test_lib_1.it("should update DOM elements when rebinding the control group", test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
                var form = new forms_1.ControlGroup({ "login": new forms_1.Control("oldValue") });
                var ctx = new MyComp(form);
                var t = "<div [control-group]=\"form\">\n                <input type=\"text\" control=\"login\">\n              </div>";
                tb.createView(MyComp, {
                    context: ctx,
                    html: t
                }).then(function (view) {
                    view.detectChanges();
                    ctx.form = new forms_1.ControlGroup({ "login": new forms_1.Control("newValue") });
                    view.detectChanges();
                    var input = view.querySelector("input");
                    test_lib_1.expect(input.value).toEqual("newValue");
                    async.done();
                });
            }));
            test_lib_1.it("should update DOM element when rebinding the control name", test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
                var ctx = new MyComp(new forms_1.ControlGroup({
                    "one": new forms_1.Control("one"),
                    "two": new forms_1.Control("two")
                }), "one");
                var t = "<div [control-group]=\"form\">\n                <input type=\"text\" [control]=\"name\">\n              </div>";
                tb.createView(MyComp, {
                    context: ctx,
                    html: t
                }).then(function (view) {
                    view.detectChanges();
                    var input = view.querySelector("input");
                    test_lib_1.expect(input.value).toEqual("one");
                    ctx.name = "two";
                    view.detectChanges();
                    test_lib_1.expect(input.value).toEqual("two");
                    async.done();
                });
            }));
            test_lib_1.describe("different control types", function () {
                test_lib_1.it("should support <input type=text>", test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
                    var ctx = new MyComp(new forms_1.ControlGroup({ "text": new forms_1.Control("old") }));
                    var t = "<div [control-group]=\"form\">\n                    <input type=\"text\" control=\"text\">\n                  </div>";
                    tb.createView(MyComp, {
                        context: ctx,
                        html: t
                    }).then(function (view) {
                        view.detectChanges();
                        var input = view.querySelector("input");
                        test_lib_1.expect(input.value).toEqual("old");
                        input.value = "new";
                        test_lib_1.dispatchEvent(input, "input");
                        test_lib_1.expect(ctx.form.value).toEqual({ "text": "new" });
                        async.done();
                    });
                }));
                test_lib_1.it("should support <input> without type", test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
                    var ctx = new MyComp(new forms_1.ControlGroup({ "text": new forms_1.Control("old") }));
                    var t = "<div [control-group]=\"form\">\n                    <input control=\"text\">\n                  </div>";
                    tb.createView(MyComp, {
                        context: ctx,
                        html: t
                    }).then(function (view) {
                        view.detectChanges();
                        var input = view.querySelector("input");
                        test_lib_1.expect(input.value).toEqual("old");
                        input.value = "new";
                        test_lib_1.dispatchEvent(input, "input");
                        test_lib_1.expect(ctx.form.value).toEqual({ "text": "new" });
                        async.done();
                    });
                }));
                test_lib_1.it("should support <textarea>", test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
                    var ctx = new MyComp(new forms_1.ControlGroup({ "text": new forms_1.Control('old') }));
                    var t = "<div [control-group]=\"form\">\n                    <textarea control=\"text\"></textarea>\n                  </div>";
                    tb.createView(MyComp, {
                        context: ctx,
                        html: t
                    }).then(function (view) {
                        view.detectChanges();
                        var textarea = view.querySelector("textarea");
                        test_lib_1.expect(textarea.value).toEqual("old");
                        textarea.value = "new";
                        test_lib_1.dispatchEvent(textarea, "input");
                        test_lib_1.expect(ctx.form.value).toEqual({ "text": 'new' });
                        async.done();
                    });
                }));
                test_lib_1.it("should support <type=checkbox>", test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
                    var ctx = new MyComp(new forms_1.ControlGroup({ "checkbox": new forms_1.Control(true) }));
                    var t = "<div [control-group]=\"form\">\n                    <input type=\"checkbox\" control=\"checkbox\">\n                  </div>";
                    tb.createView(MyComp, {
                        context: ctx,
                        html: t
                    }).then(function (view) {
                        view.detectChanges();
                        var input = view.querySelector("input");
                        test_lib_1.expect(input.checked).toBe(true);
                        input.checked = false;
                        test_lib_1.dispatchEvent(input, "change");
                        test_lib_1.expect(ctx.form.value).toEqual({ "checkbox": false });
                        async.done();
                    });
                }));
                test_lib_1.it("should support <select>", test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
                    var ctx = new MyComp(new forms_1.ControlGroup({ "city": new forms_1.Control("SF") }));
                    var t = "<div [control-group]=\"form\">\n                      <select control=\"city\">\n                        <option value=\"SF\"></option>\n                        <option value=\"NYC\"></option>\n                      </select>\n                    </div>";
                    tb.createView(MyComp, {
                        context: ctx,
                        html: t
                    }).then(function (view) {
                        view.detectChanges();
                        var select = view.querySelector("select");
                        var sfOption = view.querySelector("option");
                        test_lib_1.expect(select.value).toEqual('SF');
                        test_lib_1.expect(sfOption.selected).toBe(true);
                        select.value = 'NYC';
                        test_lib_1.dispatchEvent(select, "change");
                        test_lib_1.expect(ctx.form.value).toEqual({ "city": 'NYC' });
                        test_lib_1.expect(sfOption.selected).toBe(false);
                        async.done();
                    });
                }));
                test_lib_1.it("should support custom value accessors", test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
                    var ctx = new MyComp(new forms_1.ControlGroup({ "name": new forms_1.Control("aa") }));
                    var t = "<div [control-group]=\"form\">\n                    <input type=\"text\" control=\"name\" wrapped-value>\n                  </div>";
                    tb.createView(MyComp, {
                        context: ctx,
                        html: t
                    }).then(function (view) {
                        view.detectChanges();
                        var input = view.querySelector("input");
                        test_lib_1.expect(input.value).toEqual("!aa!");
                        input.value = "!bb!";
                        test_lib_1.dispatchEvent(input, "change");
                        test_lib_1.expect(ctx.form.value).toEqual({ "name": "bb" });
                        async.done();
                    });
                }));
            });
            test_lib_1.describe("validations", function () {
                test_lib_1.it("should use validators defined in html", test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
                    var form = new forms_1.ControlGroup({ "login": new forms_1.Control("aa") });
                    var ctx = new MyComp(form);
                    var t = "<div [control-group]=\"form\">\n                    <input type=\"text\" control=\"login\" required>\n                   </div>";
                    tb.createView(MyComp, {
                        context: ctx,
                        html: t
                    }).then(function (view) {
                        view.detectChanges();
                        test_lib_1.expect(form.valid).toEqual(true);
                        var input = view.querySelector("input");
                        input.value = "";
                        test_lib_1.dispatchEvent(input, "change");
                        test_lib_1.expect(form.valid).toEqual(false);
                        async.done();
                    });
                }));
                test_lib_1.it("should use validators defined in the model", test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
                    var form = new forms_1.ControlGroup({ "login": new forms_1.Control("aa", forms_1.Validators.required) });
                    var ctx = new MyComp(form);
                    var t = "<div [control-group]=\"form\">\n                    <input type=\"text\" control=\"login\">\n                   </div>";
                    tb.createView(MyComp, {
                        context: ctx,
                        html: t
                    }).then(function (view) {
                        view.detectChanges();
                        test_lib_1.expect(form.valid).toEqual(true);
                        var input = view.querySelector("input");
                        input.value = "";
                        test_lib_1.dispatchEvent(input, "change");
                        test_lib_1.expect(form.valid).toEqual(false);
                        async.done();
                    });
                }));
            });
            test_lib_1.describe("nested forms", function () {
                test_lib_1.it("should init DOM with the given form object", test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
                    var form = new forms_1.ControlGroup({ "nested": new forms_1.ControlGroup({ "login": new forms_1.Control("value") }) });
                    var ctx = new MyComp(form);
                    var t = "<div [control-group]=\"form\">\n                    <div control-group=\"nested\">\n                      <input type=\"text\" control=\"login\">\n                    </div>\n                </div>";
                    tb.createView(MyComp, {
                        context: ctx,
                        html: t
                    }).then(function (view) {
                        view.detectChanges();
                        var input = view.querySelector("input");
                        test_lib_1.expect(input.value).toEqual("value");
                        async.done();
                    });
                }));
                test_lib_1.it("should update the control group values on DOM change", test_lib_1.inject([test_bed_1.TestBed, test_lib_1.AsyncTestCompleter], function (tb, async) {
                    var form = new forms_1.ControlGroup({ "nested": new forms_1.ControlGroup({ "login": new forms_1.Control("value") }) });
                    var ctx = new MyComp(form);
                    var t = "<div [control-group]=\"form\">\n                      <div control-group=\"nested\">\n                        <input type=\"text\" control=\"login\">\n                      </div>\n                  </div>";
                    tb.createView(MyComp, {
                        context: ctx,
                        html: t
                    }).then(function (view) {
                        view.detectChanges();
                        var input = view.querySelector("input");
                        input.value = "updatedValue";
                        test_lib_1.dispatchEvent(input, "change");
                        test_lib_1.expect(form.value).toEqual({ "nested": { "login": "updatedValue" } });
                        async.done();
                    });
                }));
            });
        });
    }
}
exports.main = main;
var MyComp = (function () {
    function MyComp(form, name) {
        if (form === void 0) { form = null; }
        if (name === void 0) { name = null; }
        this.form = form;
        this.name = name;
    }
    return MyComp;
})();
Object.defineProperty(MyComp, "annotations", { get: function () {
        return [new angular2_1.Component({ selector: "my-comp" }), new angular2_1.Template({ directives: [forms_1.ControlGroupDirective, forms_1.ControlDirective, WrappedValue, forms_1.RequiredValidatorDirective, forms_1.CheckboxControlValueAccessor, forms_1.DefaultValueAccessor] })];
    } });
Object.defineProperty(MyComp, "parameters", { get: function () {
        return [[new di_1.Inject('form')], [new di_1.Inject('name')]];
    } });
var WrappedValue = (function () {
    function WrappedValue(cd, setProperty) {
        this._setProperty = setProperty;
        cd.valueAccessor = this;
    }
    WrappedValue.prototype.writeValue = function (value) {
        this._setProperty("!" + value + "!");
    };
    WrappedValue.prototype.handleOnChange = function (value) {
        this.onChange(value.substring(1, value.length - 1));
    };
    return WrappedValue;
})();
Object.defineProperty(WrappedValue, "annotations", { get: function () {
        return [new angular2_1.Decorator({
                selector: '[wrapped-value]',
                events: { 'change': 'handleOnChange($event.target.value)' }
            })];
    } });
Object.defineProperty(WrappedValue, "parameters", { get: function () {
        return [[forms_1.ControlDirective], [Function, new angular2_1.PropertySetter('value')]];
    } });
