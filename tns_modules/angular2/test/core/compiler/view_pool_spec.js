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
var view_1 = require('angular2/src/core/compiler/view');
var view_pool_1 = require('angular2/src/core/compiler/view_pool');
var lang_1 = require('angular2/src/facade/lang');
var FakeView = (function () {
    function FakeView() {
    }
    FakeView.prototype.noSuchMethod = function (i) {
        _super.noSuchMethod.call(this, i);
    };
    return FakeView;
})();
Object.defineProperty(FakeView, "annotations", { get: function () {
        return [new test_lib_1.proxy, new lang_1.IMPLEMENTS(view_1.View)];
    } });
function main() {
    test_lib_1.describe('ViewPool', function () {
        var viewPool, capacity = 3;
        test_lib_1.beforeEach(function () {
            viewPool = new view_pool_1.ViewPool(capacity);
        });
        test_lib_1.it('should return null when there are no views', function () {
            test_lib_1.expect(viewPool.pop()).toBeNull();
            test_lib_1.expect(viewPool.length()).toBe(0);
        });
        test_lib_1.it('should support storing and retrieving a view', function () {
            var view = new FakeView();
            viewPool.push(view);
            test_lib_1.expect(viewPool.length()).toBe(1);
            test_lib_1.expect(viewPool.pop()).toBe(view);
            test_lib_1.expect(viewPool.length()).toBe(0);
        });
        test_lib_1.it('should not store more views that its capacity', function () {
            for (var i = 0; i < capacity * 2; i++)
                viewPool.push(new FakeView());
            test_lib_1.expect(viewPool.length()).toBe(capacity);
            for (var i = 0; i < capacity; i++) {
                test_lib_1.expect(viewPool.pop()).not.toBe(null);
            }
            test_lib_1.expect(viewPool.pop()).toBeNull();
        });
    });
}
exports.main = main;
