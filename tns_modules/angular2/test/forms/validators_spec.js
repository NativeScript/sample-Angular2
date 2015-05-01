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
function main() {
    function validator(key, error) {
        return function (c) {
            var r = {};
            r[key] = error;
            return r;
        };
    }
    Object.defineProperty(validator, "parameters", { get: function () {
            return [[assert.type.string], [assert.type.any]];
        } });
    test_lib_1.describe("Validators", function () {
        test_lib_1.describe("required", function () {
            test_lib_1.it("should error on an empty string", function () {
                test_lib_1.expect(forms_1.Validators.required(new forms_1.Control(""))).toEqual({ "required": true });
            });
            test_lib_1.it("should error on null", function () {
                test_lib_1.expect(forms_1.Validators.required(new forms_1.Control(null))).toEqual({ "required": true });
            });
            test_lib_1.it("should not error on a non-empty string", function () {
                test_lib_1.expect(forms_1.Validators.required(new forms_1.Control("not empty"))).toEqual(null);
            });
        });
        test_lib_1.describe("compose", function () {
            test_lib_1.it("should collect errors from all the validators", function () {
                var c = forms_1.Validators.compose([validator("a", true), validator("b", true)]);
                test_lib_1.expect(c(new forms_1.Control(""))).toEqual({
                    "a": true,
                    "b": true
                });
            });
            test_lib_1.it("should run validators left to right", function () {
                var c = forms_1.Validators.compose([validator("a", 1), validator("a", 2)]);
                test_lib_1.expect(c(new forms_1.Control(""))).toEqual({ "a": 2 });
            });
            test_lib_1.it("should return null when no errors", function () {
                var c = forms_1.Validators.compose([forms_1.Validators.nullValidator, forms_1.Validators.nullValidator]);
                test_lib_1.expect(c(new forms_1.Control(""))).toEqual(null);
            });
        });
        test_lib_1.describe("controlGroupValidator", function () {
            test_lib_1.it("should collect errors from the child controls", function () {
                var one = new forms_1.Control("one", validator("a", true));
                var two = new forms_1.Control("one", validator("b", true));
                var g = new forms_1.ControlGroup({
                    "one": one,
                    "two": two
                });
                test_lib_1.expect(forms_1.Validators.group(g)).toEqual({
                    "a": [one],
                    "b": [two]
                });
            });
            test_lib_1.it("should not include controls that have no errors", function () {
                var one = new forms_1.Control("one", validator("a", true));
                var two = new forms_1.Control("two");
                var g = new forms_1.ControlGroup({
                    "one": one,
                    "two": two
                });
                test_lib_1.expect(forms_1.Validators.group(g)).toEqual({ "a": [one] });
            });
            test_lib_1.it("should return null when no errors", function () {
                var g = new forms_1.ControlGroup({ "one": new forms_1.Control("one") });
                test_lib_1.expect(forms_1.Validators.group(g)).toEqual(null);
            });
        });
    });
}
exports.main = main;
