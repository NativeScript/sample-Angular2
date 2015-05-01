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
var testability_1 = require('angular2/src/core/testability/testability');
function main() {
    test_lib_1.describe('Testability', function () {
        var testability, executed;
        test_lib_1.beforeEach(function () {
            testability = new testability_1.Testability();
            executed = false;
        });
        test_lib_1.it('should start with a pending count of 0', function () {
            test_lib_1.expect(testability.getPendingCount()).toEqual(0);
        });
        test_lib_1.it('should fire whenstable callbacks if pending count is 0', function () {
            testability.whenStable(function () { return executed = true; });
            test_lib_1.expect(executed).toBe(true);
        });
        test_lib_1.it('should not call whenstable callbacks when there are pending counts', function () {
            testability.increaseCount(2);
            testability.whenStable(function () { return executed = true; });
            test_lib_1.expect(executed).toBe(false);
            testability.increaseCount(-1);
            test_lib_1.expect(executed).toBe(false);
        });
        test_lib_1.it('should fire whenstable callbacks when pending drops to 0', function () {
            testability.increaseCount(2);
            testability.whenStable(function () { return executed = true; });
            test_lib_1.expect(executed).toBe(false);
            testability.increaseCount(-2);
            test_lib_1.expect(executed).toBe(true);
        });
    });
}
exports.main = main;
