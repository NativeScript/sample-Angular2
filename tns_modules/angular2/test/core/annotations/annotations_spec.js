var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
var annotations_1 = require('angular2/src/core/annotations/annotations');
var DummyDirective = (function (_super) {
    __extends(DummyDirective, _super);
    function DummyDirective(_a) {
        var lifecycle = (_a === void 0 ? {} : _a).lifecycle;
        _super.call(this, { lifecycle: lifecycle });
    }
    return DummyDirective;
})(annotations_1.Directive);
function main() {
    test_lib_1.describe("Directive", function () {
        test_lib_1.describe("lifecycle", function () {
            test_lib_1.it("should be false when no lifecycle specified", function () {
                var d = new DummyDirective();
                test_lib_1.expect(d.hasLifecycleHook(annotations_1.onChange)).toBe(false);
            });
            test_lib_1.it("should be false when the lifecycle does not contain the hook", function () {
                var d = new DummyDirective({ lifecycle: [] });
                test_lib_1.expect(d.hasLifecycleHook(annotations_1.onChange)).toBe(false);
            });
            test_lib_1.it("should be true otherwise", function () {
                var d = new DummyDirective({ lifecycle: [annotations_1.onChange] });
                test_lib_1.expect(d.hasLifecycleHook(annotations_1.onChange)).toBe(true);
            });
        });
    });
}
exports.main = main;
