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
var forms_1 = require('angular2/forms');
var async_1 = require('angular2/src/facade/async');
var collection_1 = require('angular2/src/facade/collection');
function main() {
    test_lib_1.describe("Form Model", function () {
        test_lib_1.describe("Control", function () {
            test_lib_1.describe("validator", function () {
                test_lib_1.it("should run validator with the initial value", function () {
                    var c = new forms_1.Control("value", forms_1.Validators.required);
                    test_lib_1.expect(c.valid).toEqual(true);
                });
                test_lib_1.it("should rerun the validator when the value changes", function () {
                    var c = new forms_1.Control("value", forms_1.Validators.required);
                    c.updateValue(null);
                    test_lib_1.expect(c.valid).toEqual(false);
                });
                test_lib_1.it("should return errors", function () {
                    var c = new forms_1.Control(null, forms_1.Validators.required);
                    test_lib_1.expect(c.errors).toEqual({ "required": true });
                });
            });
            test_lib_1.describe("pristine", function () {
                test_lib_1.it("should be true after creating a control", function () {
                    var c = new forms_1.Control("value");
                    test_lib_1.expect(c.pristine).toEqual(true);
                });
                test_lib_1.it("should be false after changing the value of the control", function () {
                    var c = new forms_1.Control("value");
                    c.updateValue("new value");
                    test_lib_1.expect(c.pristine).toEqual(false);
                });
            });
            test_lib_1.describe("dirty", function () {
                test_lib_1.it("should be false after creating a control", function () {
                    var c = new forms_1.Control("value");
                    test_lib_1.expect(c.dirty).toEqual(false);
                });
                test_lib_1.it("should be true after changing the value of the control", function () {
                    var c = new forms_1.Control("value");
                    c.updateValue("new value");
                    test_lib_1.expect(c.dirty).toEqual(true);
                });
            });
            test_lib_1.describe("valueChanges", function () {
                var c;
                test_lib_1.beforeEach(function () {
                    c = new forms_1.Control("old");
                });
                test_lib_1.it("should fire an event after the value has been updated", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    async_1.ObservableWrapper.subscribe(c.valueChanges, function (value) {
                        test_lib_1.expect(c.value).toEqual('new');
                        test_lib_1.expect(value).toEqual('new');
                        async.done();
                    });
                    c.updateValue("new");
                }));
                test_lib_1.it("should return a cold observable", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    c.updateValue("will be ignored");
                    async_1.ObservableWrapper.subscribe(c.valueChanges, function (value) {
                        test_lib_1.expect(value).toEqual('new');
                        async.done();
                    });
                    c.updateValue("new");
                }));
            });
        });
        test_lib_1.describe("ControlGroup", function () {
            test_lib_1.describe("value", function () {
                test_lib_1.it("should be the reduced value of the child controls", function () {
                    var g = new forms_1.ControlGroup({
                        "one": new forms_1.Control("111"),
                        "two": new forms_1.Control("222")
                    });
                    test_lib_1.expect(g.value).toEqual({
                        "one": "111",
                        "two": "222"
                    });
                });
                test_lib_1.it("should be empty when there are no child controls", function () {
                    var g = new forms_1.ControlGroup({});
                    test_lib_1.expect(g.value).toEqual({});
                });
                test_lib_1.it("should support nested groups", function () {
                    var g = new forms_1.ControlGroup({
                        "one": new forms_1.Control("111"),
                        "nested": new forms_1.ControlGroup({ "two": new forms_1.Control("222") })
                    });
                    test_lib_1.expect(g.value).toEqual({
                        "one": "111",
                        "nested": { "two": "222" }
                    });
                    g.controls["nested"].controls["two"].updateValue("333");
                    test_lib_1.expect(g.value).toEqual({
                        "one": "111",
                        "nested": { "two": "333" }
                    });
                });
            });
            test_lib_1.describe("validator", function () {
                test_lib_1.it("should run the validator with the initial value (valid)", function () {
                    var g = new forms_1.ControlGroup({ "one": new forms_1.Control('value', forms_1.Validators.required) });
                    test_lib_1.expect(g.valid).toEqual(true);
                    test_lib_1.expect(g.errors).toEqual(null);
                });
                test_lib_1.it("should run the validator with the initial value (invalid)", function () {
                    var one = new forms_1.Control(null, forms_1.Validators.required);
                    var g = new forms_1.ControlGroup({ "one": one });
                    test_lib_1.expect(g.valid).toEqual(false);
                    test_lib_1.expect(g.errors).toEqual({ "required": [one] });
                });
                test_lib_1.it("should run the validator with the value changes", function () {
                    var c = new forms_1.Control(null, forms_1.Validators.required);
                    var g = new forms_1.ControlGroup({ "one": c });
                    c.updateValue("some value");
                    test_lib_1.expect(g.valid).toEqual(true);
                    test_lib_1.expect(g.errors).toEqual(null);
                });
            });
            test_lib_1.describe("pristine", function () {
                test_lib_1.it("should be true after creating a control", function () {
                    var c = new forms_1.Control('value');
                    var g = new forms_1.ControlGroup({ "one": c });
                    test_lib_1.expect(g.pristine).toEqual(true);
                });
                test_lib_1.it("should be false after changing the value of the control", function () {
                    var c = new forms_1.Control('value');
                    var g = new forms_1.ControlGroup({ "one": c });
                    c.updateValue('new value');
                    test_lib_1.expect(g.pristine).toEqual(false);
                });
            });
            test_lib_1.describe("optional components", function () {
                test_lib_1.describe("contains", function () {
                    var group;
                    test_lib_1.beforeEach(function () {
                        group = new forms_1.ControlGroup({
                            "required": new forms_1.Control("requiredValue"),
                            "optional": new forms_1.Control("optionalValue")
                        }, { "optional": false });
                    });
                    test_lib_1.it("should return false when the component is not included", function () {
                        test_lib_1.expect(group.contains("optional")).toEqual(false);
                    });
                    test_lib_1.it("should return false when there is no component with the given name", function () {
                        test_lib_1.expect(group.contains("something else")).toEqual(false);
                    });
                    test_lib_1.it("should return true when the component is included", function () {
                        test_lib_1.expect(group.contains("required")).toEqual(true);
                        group.include("optional");
                        test_lib_1.expect(group.contains("optional")).toEqual(true);
                    });
                });
                test_lib_1.it("should not include an inactive component into the group value", function () {
                    var group = new forms_1.ControlGroup({
                        "required": new forms_1.Control("requiredValue"),
                        "optional": new forms_1.Control("optionalValue")
                    }, { "optional": false });
                    test_lib_1.expect(group.value).toEqual({ "required": "requiredValue" });
                    group.include("optional");
                    test_lib_1.expect(group.value).toEqual({
                        "required": "requiredValue",
                        "optional": "optionalValue"
                    });
                });
                test_lib_1.it("should not run Validators on an inactive component", function () {
                    var group = new forms_1.ControlGroup({
                        "required": new forms_1.Control("requiredValue", forms_1.Validators.required),
                        "optional": new forms_1.Control("", forms_1.Validators.required)
                    }, { "optional": false });
                    test_lib_1.expect(group.valid).toEqual(true);
                    group.include("optional");
                    test_lib_1.expect(group.valid).toEqual(false);
                });
                test_lib_1.describe("valueChanges", function () {
                    var g, c1, c2;
                    test_lib_1.beforeEach(function () {
                        c1 = new forms_1.Control("old1");
                        c2 = new forms_1.Control("old2");
                        g = new forms_1.ControlGroup({
                            "one": c1,
                            "two": c2
                        }, { "two": true });
                    });
                    test_lib_1.it("should fire an event after the value has been updated", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                        async_1.ObservableWrapper.subscribe(g.valueChanges, function (value) {
                            test_lib_1.expect(g.value).toEqual({
                                'one': 'new1',
                                'two': 'old2'
                            });
                            test_lib_1.expect(value).toEqual({
                                'one': 'new1',
                                'two': 'old2'
                            });
                            async.done();
                        });
                        c1.updateValue("new1");
                    }));
                    test_lib_1.it("should fire an event after the control's observable fired an event", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                        var controlCallbackIsCalled = false;
                        async_1.ObservableWrapper.subscribe(c1.valueChanges, function (value) {
                            controlCallbackIsCalled = true;
                        });
                        async_1.ObservableWrapper.subscribe(g.valueChanges, function (value) {
                            test_lib_1.expect(controlCallbackIsCalled).toBe(true);
                            async.done();
                        });
                        c1.updateValue("new1");
                    }));
                    test_lib_1.it("should fire an event when a control is excluded", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                        async_1.ObservableWrapper.subscribe(g.valueChanges, function (value) {
                            test_lib_1.expect(value).toEqual({ 'one': 'old1' });
                            async.done();
                        });
                        g.exclude("two");
                    }));
                    test_lib_1.it("should fire an event when a control is included", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                        g.exclude("two");
                        async_1.ObservableWrapper.subscribe(g.valueChanges, function (value) {
                            test_lib_1.expect(value).toEqual({
                                'one': 'old1',
                                'two': 'old2'
                            });
                            async.done();
                        });
                        g.include("two");
                    }));
                    test_lib_1.it("should fire an event every time a control is updated", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                        var loggedValues = [];
                        async_1.ObservableWrapper.subscribe(g.valueChanges, function (value) {
                            collection_1.ListWrapper.push(loggedValues, value);
                            if (loggedValues.length == 2) {
                                test_lib_1.expect(loggedValues).toEqual([{
                                        "one": "new1",
                                        "two": "old2"
                                    }, {
                                        "one": "new1",
                                        "two": "new2"
                                    }]);
                                async.done();
                            }
                        });
                        c1.updateValue("new1");
                        c2.updateValue("new2");
                    }));
                    test_lib_1.xit("should not fire an event when an excluded control is updated", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) { }));
                });
            });
            test_lib_1.describe("ControlArray", function () {
                test_lib_1.describe("adding/removing", function () {
                    var a;
                    var c1, c2, c3;
                    test_lib_1.beforeEach(function () {
                        a = new forms_1.ControlArray([]);
                        c1 = new forms_1.Control(1);
                        c2 = new forms_1.Control(2);
                        c3 = new forms_1.Control(3);
                    });
                    test_lib_1.it("should support pushing", function () {
                        a.push(c1);
                        test_lib_1.expect(a.length).toEqual(1);
                        test_lib_1.expect(a.controls).toEqual([c1]);
                    });
                    test_lib_1.it("should support removing", function () {
                        a.push(c1);
                        a.push(c2);
                        a.push(c3);
                        a.removeAt(1);
                        test_lib_1.expect(a.controls).toEqual([c1, c3]);
                    });
                    test_lib_1.it("should support inserting", function () {
                        a.push(c1);
                        a.push(c3);
                        a.insert(1, c2);
                        test_lib_1.expect(a.controls).toEqual([c1, c2, c3]);
                    });
                });
                test_lib_1.describe("value", function () {
                    test_lib_1.it("should be the reduced value of the child controls", function () {
                        var a = new forms_1.ControlArray([new forms_1.Control(1), new forms_1.Control(2)]);
                        test_lib_1.expect(a.value).toEqual([1, 2]);
                    });
                    test_lib_1.it("should be an empty array when there are no child controls", function () {
                        var a = new forms_1.ControlArray([]);
                        test_lib_1.expect(a.value).toEqual([]);
                    });
                });
                test_lib_1.describe("validator", function () {
                    test_lib_1.it("should run the validator with the initial value (valid)", function () {
                        var a = new forms_1.ControlArray([new forms_1.Control(1, forms_1.Validators.required), new forms_1.Control(2, forms_1.Validators.required)]);
                        test_lib_1.expect(a.valid).toBe(true);
                        test_lib_1.expect(a.errors).toBe(null);
                    });
                    test_lib_1.it("should run the validator with the initial value (invalid)", function () {
                        var a = new forms_1.ControlArray([new forms_1.Control(1, forms_1.Validators.required), new forms_1.Control(null, forms_1.Validators.required), new forms_1.Control(2, forms_1.Validators.required)]);
                        test_lib_1.expect(a.valid).toBe(false);
                        test_lib_1.expect(a.errors).toEqual({ "required": [a.controls[1]] });
                    });
                    test_lib_1.it("should run the validator when the value changes", function () {
                        var a = new forms_1.ControlArray([]);
                        var c = new forms_1.Control(null, forms_1.Validators.required);
                        a.push(c);
                        test_lib_1.expect(a.valid).toBe(false);
                        c.updateValue("some value");
                        test_lib_1.expect(a.valid).toBe(true);
                        test_lib_1.expect(a.errors).toBe(null);
                    });
                });
                test_lib_1.describe("pristine", function () {
                    test_lib_1.it("should be true after creating a control", function () {
                        var a = new forms_1.ControlArray([new forms_1.Control(1)]);
                        test_lib_1.expect(a.pristine).toBe(true);
                    });
                    test_lib_1.it("should be false after changing the value of the control", function () {
                        var c = new forms_1.Control(1);
                        var a = new forms_1.ControlArray([c]);
                        c.updateValue('new value');
                        test_lib_1.expect(a.pristine).toEqual(false);
                    });
                });
                test_lib_1.describe("valueChanges", function () {
                    var a, c1, c2;
                    test_lib_1.beforeEach(function () {
                        c1 = new forms_1.Control("old1");
                        c2 = new forms_1.Control("old2");
                        a = new forms_1.ControlArray([c1, c2]);
                    });
                    test_lib_1.it("should fire an event after the value has been updated", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                        async_1.ObservableWrapper.subscribe(a.valueChanges, function (value) {
                            test_lib_1.expect(a.value).toEqual(['new1', 'old2']);
                            test_lib_1.expect(value).toEqual(['new1', 'old2']);
                            async.done();
                        });
                        c1.updateValue("new1");
                    }));
                    test_lib_1.it("should fire an event after the control's observable fired an event", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                        var controlCallbackIsCalled = false;
                        async_1.ObservableWrapper.subscribe(c1.valueChanges, function (value) {
                            controlCallbackIsCalled = true;
                        });
                        async_1.ObservableWrapper.subscribe(a.valueChanges, function (value) {
                            test_lib_1.expect(controlCallbackIsCalled).toBe(true);
                            async.done();
                        });
                        c1.updateValue("new1");
                    }));
                    test_lib_1.it("should fire an event when a control is removed", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                        async_1.ObservableWrapper.subscribe(a.valueChanges, function (value) {
                            test_lib_1.expect(value).toEqual(['old1']);
                            async.done();
                        });
                        a.removeAt(1);
                    }));
                    test_lib_1.it("should fire an event when a control is added", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                        a.removeAt(1);
                        async_1.ObservableWrapper.subscribe(a.valueChanges, function (value) {
                            test_lib_1.expect(value).toEqual(['old1', 'old2']);
                            async.done();
                        });
                        a.push(c2);
                    }));
                });
            });
        });
    });
}
exports.main = main;
