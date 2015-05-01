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
var async_1 = require('angular2/src/facade/async');
function main() {
    test_lib_1.describe('Observable', function () {
        var obs;
        var controller;
        test_lib_1.beforeEach(function () {
            controller = async_1.ObservableWrapper.createController();
            obs = async_1.ObservableWrapper.createObservable(controller);
        });
        test_lib_1.it("should call the next callback", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            async_1.ObservableWrapper.subscribe(obs, function (value) {
                test_lib_1.expect(value).toEqual(99);
                async.done();
            });
            async_1.ObservableWrapper.callNext(controller, 99);
        }));
        test_lib_1.it("should call the throw callback", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            async_1.ObservableWrapper.subscribe(obs, function (_) { }, function (error) {
                test_lib_1.expect(error).toEqual("Boom");
                async.done();
            });
            async_1.ObservableWrapper.callThrow(controller, "Boom");
        }));
        test_lib_1.it("should call the return callback", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            async_1.ObservableWrapper.subscribe(obs, function (_) { }, function (_) { }, function () {
                async.done();
            });
            async_1.ObservableWrapper.callReturn(controller);
        }));
        test_lib_1.it("should subscribe to the wrapper asynchronously", function () {
            var called = false;
            async_1.ObservableWrapper.subscribe(obs, function (value) {
                called = true;
            });
            async_1.ObservableWrapper.callNext(controller, 99);
            test_lib_1.expect(called).toBe(false);
        });
        if (!test_lib_1.IS_DARTIUM) {
            test_lib_1.describe("Generator", function () {
                var generator;
                test_lib_1.beforeEach(function () {
                    generator = new test_lib_1.SpyObject();
                    generator.spy("next");
                    generator.spy("throw");
                    generator.spy("return");
                });
                test_lib_1.it("should call next on the given generator", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    generator.spy("next").andCallFake(function (value) {
                        test_lib_1.expect(value).toEqual(99);
                        async.done();
                    });
                    async_1.ObservableWrapper.subscribe(obs, generator);
                    async_1.ObservableWrapper.callNext(controller, 99);
                }));
                test_lib_1.it("should call throw on the given generator", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    generator.spy("throw").andCallFake(function (error) {
                        test_lib_1.expect(error).toEqual("Boom");
                        async.done();
                    });
                    async_1.ObservableWrapper.subscribe(obs, generator);
                    async_1.ObservableWrapper.callThrow(controller, "Boom");
                }));
                test_lib_1.it("should call return on the given generator", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                    generator.spy("return").andCallFake(function () {
                        async.done();
                    });
                    async_1.ObservableWrapper.subscribe(obs, generator);
                    async_1.ObservableWrapper.callReturn(controller);
                }));
            });
        }
    });
}
exports.main = main;
