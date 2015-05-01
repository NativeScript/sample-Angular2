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
var test_lib_2 = require('angular2/test_lib');
var async_1 = require('angular2/src/facade/async');
var lang_1 = require('angular2/src/facade/lang');
var vm_turn_zone_1 = require('angular2/src/core/zone/vm_turn_zone');
function main() {
    test_lib_1.describe("VmTurnZone", function () {
        var log, zone;
        test_lib_1.beforeEach(function () {
            log = new test_lib_2.Log();
            zone = new vm_turn_zone_1.VmTurnZone({ enableLongStackTrace: true });
            zone.initCallbacks({
                onTurnStart: log.fn('onTurnStart'),
                onTurnDone: log.fn('onTurnDone')
            });
        });
        test_lib_1.describe("run", function () {
            test_lib_1.it('should call onTurnStart and onTurnDone', function () {
                zone.run(log.fn('run'));
                test_lib_1.expect(log.result()).toEqual('onTurnStart; run; onTurnDone');
            });
            test_lib_1.it('should return the body return value from run', function () {
                test_lib_1.expect(zone.run(function () { return 6; })).toEqual(6);
            });
            test_lib_1.it('should not run onTurnStart and onTurnDone for nested Zone.run', function () {
                zone.run(function () {
                    zone.run(log.fn('run'));
                });
                test_lib_1.expect(log.result()).toEqual('onTurnStart; run; onTurnDone');
            });
            test_lib_1.it('should call onTurnStart and onTurnDone before and after each top-level run', function () {
                zone.run(log.fn('run1'));
                zone.run(log.fn('run2'));
                test_lib_1.expect(log.result()).toEqual('onTurnStart; run1; onTurnDone; onTurnStart; run2; onTurnDone');
            });
            test_lib_1.it('should call onTurnStart and onTurnDone before and after each turn', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                var a = async_1.PromiseWrapper.completer();
                var b = async_1.PromiseWrapper.completer();
                zone.run(function () {
                    log.add('run start');
                    a.promise.then(function (_) { return log.add('a then'); });
                    b.promise.then(function (_) { return log.add('b then'); });
                });
                a.resolve("a");
                b.resolve("b");
                async_1.PromiseWrapper.all([a.promise, b.promise]).then(function (_) {
                    test_lib_1.expect(log.result()).toEqual('onTurnStart; run start; onTurnDone; onTurnStart; a then; onTurnDone; onTurnStart; b then; onTurnDone');
                    async.done();
                });
            }));
        });
        test_lib_1.describe("runOutsideAngular", function () {
            test_lib_1.it("should run a function outside of the angular zone", function () {
                zone.runOutsideAngular(log.fn('run'));
                test_lib_1.expect(log.result()).toEqual('run');
            });
        });
        test_lib_1.describe("exceptions", function () {
            var trace, exception, saveStackTrace;
            test_lib_1.beforeEach(function () {
                trace = null;
                exception = null;
                saveStackTrace = function (e, t) {
                    exception = e;
                    trace = t;
                };
            });
            test_lib_1.it('should call the on error callback when it is defined', function () {
                zone.initCallbacks({ onErrorHandler: saveStackTrace });
                zone.run(function () {
                    throw new lang_1.BaseException('aaa');
                });
                test_lib_1.expect(exception).toBeDefined();
            });
            test_lib_1.it('should rethrow exceptions from the body when no callback defined', function () {
                test_lib_1.expect(function () {
                    zone.run(function () {
                        throw new lang_1.BaseException('bbb');
                    });
                }).toThrowError('bbb');
            });
            test_lib_1.it('should produce long stack traces', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                zone.initCallbacks({ onErrorHandler: saveStackTrace });
                var c = async_1.PromiseWrapper.completer();
                zone.run(function () {
                    async_1.PromiseWrapper.setTimeout(function () {
                        async_1.PromiseWrapper.setTimeout(function () {
                            c.resolve(null);
                            throw new lang_1.BaseException('ccc');
                        }, 0);
                    }, 0);
                });
                c.promise.then(function (_) {
                    test_lib_1.expect(trace.length).toBeGreaterThan(1);
                    async.done();
                });
            }));
            test_lib_1.it('should produce long stack traces (when using promises)', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                zone.initCallbacks({ onErrorHandler: saveStackTrace });
                var c = async_1.PromiseWrapper.completer();
                zone.run(function () {
                    async_1.PromiseWrapper.resolve(null).then(function (_) {
                        return async_1.PromiseWrapper.resolve(null).then(function (__) {
                            c.resolve(null);
                            throw new lang_1.BaseException("ddd");
                        });
                    });
                });
                c.promise.then(function (_) {
                    test_lib_1.expect(trace.length).toBeGreaterThan(1);
                    async.done();
                });
            }));
            test_lib_1.it('should disable long stack traces', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                var zone = new vm_turn_zone_1.VmTurnZone({ enableLongStackTrace: false });
                zone.initCallbacks({ onErrorHandler: saveStackTrace });
                var c = async_1.PromiseWrapper.completer();
                zone.run(function () {
                    async_1.PromiseWrapper.setTimeout(function () {
                        async_1.PromiseWrapper.setTimeout(function () {
                            c.resolve(null);
                            throw new lang_1.BaseException('ccc');
                        }, 0);
                    }, 0);
                });
                c.promise.then(function (_) {
                    test_lib_1.expect(trace.length).toEqual(1);
                    async.done();
                });
            }));
        });
    });
}
exports.main = main;
