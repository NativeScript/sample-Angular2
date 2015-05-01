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
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var TestObj = (function () {
    function TestObj(prop) {
        this.prop = prop;
    }
    return TestObj;
})();
var SpyTestObj = (function (_super) {
    __extends(SpyTestObj, _super);
    function SpyTestObj() {
        _super.apply(this, arguments);
    }
    SpyTestObj.prototype.noSuchMethod = function (m) {
        return _super.prototype.noSuchMethod.call(this, m);
    };
    return SpyTestObj;
})(test_lib_1.SpyObject);
Object.defineProperty(SpyTestObj, "annotations", { get: function () {
        return [new test_lib_1.proxy, new lang_1.IMPLEMENTS(TestObj)];
    } });
function main() {
    test_lib_1.describe('test_lib', function () {
        test_lib_1.describe('equality', function () {
            test_lib_1.it('should structurally compare objects', function () {
                var expected = new TestObj(new TestObj({ 'one': [1, 2] }));
                var actual = new TestObj(new TestObj({ 'one': [1, 2] }));
                var falseActual = new TestObj(new TestObj({ 'one': [1, 3] }));
                test_lib_1.expect(actual).toEqual(expected);
                test_lib_1.expect(falseActual).not.toEqual(expected);
            });
        });
        test_lib_1.describe('toEqual for Maps', function () {
            test_lib_1.it('should detect equality for same reference', function () {
                var m1 = collection_1.MapWrapper.createFromStringMap({ 'a': 1 });
                test_lib_1.expect(m1).toEqual(m1);
            });
            test_lib_1.it('should detect equality for same content', function () {
                test_lib_1.expect(collection_1.MapWrapper.createFromStringMap({ 'a': 1 })).toEqual(collection_1.MapWrapper.createFromStringMap({ 'a': 1 }));
            });
            test_lib_1.it('should detect missing entries', function () {
                test_lib_1.expect(collection_1.MapWrapper.createFromStringMap({ 'a': 1 })).not.toEqual(collection_1.MapWrapper.createFromStringMap({}));
            });
            test_lib_1.it('should detect different values', function () {
                test_lib_1.expect(collection_1.MapWrapper.createFromStringMap({ 'a': 1 })).not.toEqual(collection_1.MapWrapper.createFromStringMap({ 'a': 2 }));
            });
            test_lib_1.it('should detect additional entries', function () {
                test_lib_1.expect(collection_1.MapWrapper.createFromStringMap({ 'a': 1 })).not.toEqual(collection_1.MapWrapper.createFromStringMap({
                    'a': 1,
                    'b': 1
                }));
            });
        });
        test_lib_1.describe("spy objects", function () {
            var spyObj;
            test_lib_1.beforeEach(function () {
                spyObj = new SpyTestObj();
            });
            test_lib_1.it("should pass the runtime check", function () {
                var t = spyObj;
                test_lib_1.expect(t).toBeDefined();
            });
            test_lib_1.it("should return a new spy func with no calls", function () {
                test_lib_1.expect(spyObj.spy("someFunc")).not.toHaveBeenCalled();
            });
            test_lib_1.it("should record function calls", function () {
                spyObj.spy("someFunc").andCallFake(function (a, b) { return a + b; });
                test_lib_1.expect(spyObj.someFunc(1, 2)).toEqual(3);
                test_lib_1.expect(spyObj.spy("someFunc")).toHaveBeenCalledWith(1, 2);
            });
        });
    });
}
exports.main = main;
