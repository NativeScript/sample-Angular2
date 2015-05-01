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
var reflection_1 = require('angular2/src/reflection/reflection');
var reflection_capabilities_1 = require('angular2/src/reflection/reflection_capabilities');
var lang_1 = require('angular2/src/facade/lang');
var Annotation = (function () {
    function Annotation(value) {
        this.value = value;
    }
    return Annotation;
})();
Object.defineProperty(Annotation, "annotations", { get: function () {
        return [new lang_1.CONST()];
    } });
var AType = (function () {
    function AType(value) {
        this.value = value;
    }
    return AType;
})();
var ClassWithAnnotations = (function () {
    function ClassWithAnnotations(a, b) {
        this.a = a;
        this.b = b;
    }
    return ClassWithAnnotations;
})();
Object.defineProperty(ClassWithAnnotations, "annotations", { get: function () {
        return [new Annotation('class')];
    } });
Object.defineProperty(ClassWithAnnotations, "parameters", { get: function () {
        return [[AType, new Annotation("a")], [AType, new Annotation("b")]];
    } });
var ClassWithoutAnnotations = (function () {
    function ClassWithoutAnnotations(a, b) {
    }
    return ClassWithoutAnnotations;
})();
var TestObjWith11Args = (function () {
    function TestObjWith11Args(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11) {
    }
    return TestObjWith11Args;
})();
function testFunc(a, b) { }
Object.defineProperty(testFunc, "annotations", { get: function () {
        return [new Annotation('func')];
    } });
Object.defineProperty(testFunc, "parameters", { get: function () {
        return [[AType, new Annotation("a")], [AType, new Annotation("b")]];
    } });
var TestObj = (function () {
    function TestObj(a, b) {
        this.a = a;
        this.b = b;
    }
    TestObj.prototype.identity = function (arg) {
        return arg;
    };
    return TestObj;
})();
function main() {
    test_lib_1.describe('Reflector', function () {
        var reflector;
        test_lib_1.beforeEach(function () {
            reflector = new reflection_1.Reflector(new reflection_capabilities_1.ReflectionCapabilities());
        });
        test_lib_1.describe("factory", function () {
            test_lib_1.it("should create a factory for the given type", function () {
                var obj = reflector.factory(TestObj)(1, 2);
                test_lib_1.expect(obj.a).toEqual(1);
                test_lib_1.expect(obj.b).toEqual(2);
            });
            test_lib_1.it("should throw when more than 10 arguments", function () {
                test_lib_1.expect(function () { return reflector.factory(TestObjWith11Args)(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11); }).toThrowError();
            });
            test_lib_1.it("should return a registered factory if available", function () {
                reflector.registerType(TestObj, { "factory": function () { return "fake"; } });
                test_lib_1.expect(reflector.factory(TestObj)()).toEqual("fake");
            });
        });
        test_lib_1.describe("parameters", function () {
            test_lib_1.it("should return an array of parameters for a type", function () {
                var p = reflector.parameters(ClassWithAnnotations);
                test_lib_1.expect(p).toEqual([[AType, new Annotation('a')], [AType, new Annotation('b')]]);
            });
            test_lib_1.it("should return an array of parameters for a function", function () {
                var p = reflector.parameters(testFunc);
                test_lib_1.expect(p).toEqual([[AType, new Annotation('a')], [AType, new Annotation('b')]]);
            });
            test_lib_1.it("should work for a class without annotations", function () {
                var p = reflector.parameters(ClassWithoutAnnotations);
                test_lib_1.expect(p.length).toEqual(2);
            });
            test_lib_1.it("should return registered parameters if available", function () {
                reflector.registerType(TestObj, { "parameters": [1, 2] });
                test_lib_1.expect(reflector.parameters(TestObj)).toEqual([1, 2]);
            });
        });
        test_lib_1.describe("annotations", function () {
            test_lib_1.it("should return an array of annotations for a type", function () {
                var p = reflector.annotations(ClassWithAnnotations);
                test_lib_1.expect(p).toEqual([new Annotation('class')]);
            });
            test_lib_1.it("should return an array of annotations for a function", function () {
                var p = reflector.annotations(testFunc);
                test_lib_1.expect(p).toEqual([new Annotation('func')]);
            });
            test_lib_1.it("should return registered annotations if available", function () {
                reflector.registerType(TestObj, { "annotations": [1, 2] });
                test_lib_1.expect(reflector.annotations(TestObj)).toEqual([1, 2]);
            });
        });
        test_lib_1.describe("getter", function () {
            test_lib_1.it("returns a function reading a property", function () {
                var getA = reflector.getter('a');
                test_lib_1.expect(getA(new TestObj(1, 2))).toEqual(1);
            });
            test_lib_1.it("should return a registered getter if available", function () {
                reflector.registerGetters({ "abc": function (obj) { return "fake"; } });
                test_lib_1.expect(reflector.getter("abc")("anything")).toEqual("fake");
            });
        });
        test_lib_1.describe("setter", function () {
            test_lib_1.it("returns a function setting a property", function () {
                var setA = reflector.setter('a');
                var obj = new TestObj(1, 2);
                setA(obj, 100);
                test_lib_1.expect(obj.a).toEqual(100);
            });
            test_lib_1.it("should return a registered setter if available", function () {
                var updateMe;
                reflector.registerSetters({ "abc": function (obj, value) {
                        updateMe = value;
                    } });
                reflector.setter("abc")("anything", "fake");
                test_lib_1.expect(updateMe).toEqual("fake");
            });
        });
        test_lib_1.describe("method", function () {
            test_lib_1.it("returns a function invoking a method", function () {
                var func = reflector.method('identity');
                var obj = new TestObj(1, 2);
                test_lib_1.expect(func(obj, ['value'])).toEqual('value');
            });
            test_lib_1.it("should return a registered method if available", function () {
                reflector.registerMethods({ "abc": function (obj, args) { return args; } });
                test_lib_1.expect(reflector.method("abc")("anything", ["fake"])).toEqual(['fake']);
            });
        });
    });
}
exports.main = main;
