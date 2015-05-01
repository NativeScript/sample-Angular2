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
var di_1 = require('angular2/di');
function main() {
    test_lib_1.describe("key", function () {
        var registry;
        test_lib_1.beforeEach(function () {
            registry = new di_1.KeyRegistry();
        });
        test_lib_1.it('should be equal to another key if type is the same', function () {
            test_lib_1.expect(registry.get('car')).toBe(registry.get('car'));
        });
        test_lib_1.it('should not be equal to another key if types are different', function () {
            test_lib_1.expect(registry.get('car')).not.toBe(registry.get('porsche'));
        });
        test_lib_1.it('should return the passed in key', function () {
            test_lib_1.expect(registry.get(registry.get('car'))).toBe(registry.get('car'));
        });
        test_lib_1.describe("metadata", function () {
            test_lib_1.it("should assign metadata to a key", function () {
                var key = registry.get('car');
                di_1.Key.setMetadata(key, "meta");
                test_lib_1.expect(key.metadata).toEqual("meta");
            });
            test_lib_1.it("should allow assigning the same metadata twice", function () {
                var key = registry.get('car');
                di_1.Key.setMetadata(key, "meta");
                di_1.Key.setMetadata(key, "meta");
                test_lib_1.expect(key.metadata).toEqual("meta");
            });
            test_lib_1.it("should throw when assigning different metadata", function () {
                var key = registry.get('car');
                di_1.Key.setMetadata(key, "meta1");
                test_lib_1.expect(function () { return di_1.Key.setMetadata(key, "meta2"); }).toThrowError();
            });
        });
    });
}
exports.main = main;
