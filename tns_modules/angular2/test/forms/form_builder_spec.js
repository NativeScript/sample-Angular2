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
    test_lib_1.describe("Form Builder", function () {
        var b;
        test_lib_1.beforeEach(function () {
            b = new forms_1.FormBuilder();
        });
        test_lib_1.it("should create controls from a value", function () {
            var g = b.group({ "login": "some value" });
            test_lib_1.expect(g.controls["login"].value).toEqual("some value");
        });
        test_lib_1.it("should create controls from an array", function () {
            var g = b.group({
                "login": ["some value"],
                "password": ["some value", forms_1.Validators.required]
            });
            test_lib_1.expect(g.controls["login"].value).toEqual("some value");
            test_lib_1.expect(g.controls["password"].value).toEqual("some value");
            test_lib_1.expect(g.controls["password"].validator).toEqual(forms_1.Validators.required);
        });
        test_lib_1.it("should use controls", function () {
            var g = b.group({ "login": b.control("some value", forms_1.Validators.required) });
            test_lib_1.expect(g.controls["login"].value).toEqual("some value");
            test_lib_1.expect(g.controls["login"].validator).toBe(forms_1.Validators.required);
        });
        test_lib_1.it("should create groups with optional controls", function () {
            var g = b.group({ "login": "some value" }, { "optionals": { "login": false } });
            test_lib_1.expect(g.contains("login")).toEqual(false);
        });
        test_lib_1.it("should create groups with a custom validator", function () {
            var g = b.group({ "login": "some value" }, { "validator": forms_1.Validators.nullValidator });
            test_lib_1.expect(g.validator).toBe(forms_1.Validators.nullValidator);
        });
        test_lib_1.it("should use default validators when no validators are provided", function () {
            var g = b.group({ "login": "some value" });
            test_lib_1.expect(g.controls["login"].validator).toBe(forms_1.Validators.nullValidator);
            test_lib_1.expect(g.validator).toBe(forms_1.Validators.group);
        });
        test_lib_1.it("should create control arrays", function () {
            var c = b.control("three");
            var a = b.array(["one", ["two", forms_1.Validators.required], c, b.array(['four'])]);
            test_lib_1.expect(a.value).toEqual(['one', 'two', 'three', ['four']]);
        });
    });
}
exports.main = main;
