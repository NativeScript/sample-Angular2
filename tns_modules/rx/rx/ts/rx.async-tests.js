// Tests for RxJS-Async TypeScript definitions
// Tests by Igor Oleinikov <https://github.com/Igorbek>
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
/// <reference path="rx.async.d.ts" />
var Rx;
(function (Rx) {
    var Tests;
    (function (Tests) {
        var Async;
        (function (Async) {
            var obsNum;
            var obsStr;
            var sch;
            function start() {
                obsNum = Rx.Observable.start(function () { return 10; }, obsStr, sch);
                obsNum = Rx.Observable.start(function () { return 10; }, obsStr);
                obsNum = Rx.Observable.start(function () { return 10; });
            }
            function toAsync() {
                obsNum = Rx.Observable.toAsync(function () { return 1; }, sch)();
                obsNum = Rx.Observable.toAsync(function (a1) { return a1; })(1);
                obsStr = Rx.Observable.toAsync(function (a1, a2) { return a1 + a2.toFixed(0); })("", 1);
                obsStr = Rx.Observable.toAsync(function (a1, a2, a3) { return a1 + a2.toFixed(0) + a3.toDateString(); })("", 1, new Date());
                obsStr = Rx.Observable.toAsync(function (a1, a2, a3, a4) { return a1 + a2.toFixed(0) + a3.toDateString() + (a4 ? 1 : 0); })("", 1, new Date(), false);
            }
            function fromCallback() {
                var func0;
                obsNum = Rx.Observable.fromCallback(func0)();
                obsNum = Rx.Observable.fromCallback(func0, obsStr)();
                obsNum = Rx.Observable.fromCallback(func0, obsStr, function (results) { return results[0]; })();
                var func1;
                obsNum = Rx.Observable.fromCallback(func1)("");
                obsNum = Rx.Observable.fromCallback(func1, {})("");
                obsNum = Rx.Observable.fromCallback(func1, {}, function (results) { return results[0]; })("");
                var func2;
                obsStr = Rx.Observable.fromCallback(func2)(1, "");
                obsStr = Rx.Observable.fromCallback(func2, {})(1, "");
                obsStr = Rx.Observable.fromCallback(func2, {}, function (results) { return results[0]; })(1, "");
                var func3;
                obsStr = Rx.Observable.fromCallback(func3)(1, "", true);
                obsStr = Rx.Observable.fromCallback(func3, {})(1, "", true);
                obsStr = Rx.Observable.fromCallback(func3, {}, function (results) { return results[0]; })(1, "", true);
                var func0m;
                obsNum = Rx.Observable.fromCallback(func0m, obsStr, function (results) { return results[0]; })();
                var func1m;
                obsNum = Rx.Observable.fromCallback(func1m, obsStr, function (results) { return results[0]; })("");
                var func2m;
                obsStr = Rx.Observable.fromCallback(func2m, obsStr, function (results) { return results[0]; })("", 10);
            }
            function toPromise() {
                var promiseImpl;
                Rx.config.Promise = promiseImpl;
                var p = obsNum.toPromise(promiseImpl);
                p = obsNum.toPromise();
                p = p.then(function (x) { return x; });
                p = p.then(function (x) { return p; });
                p = p.then(undefined, function (reason) { return 10; });
                p = p.then(undefined, function (reason) { return p; });
                var ps = p.then(undefined, function (reason) { return "error"; });
                ps = p.then(function (x) { return ""; });
                ps = p.then(function (x) { return ps; });
            }
            function startAsync() {
                var o = Rx.Observable.startAsync(function () { return null; });
            }
        })(Async = Tests.Async || (Tests.Async = {}));
    })(Tests = Rx.Tests || (Rx.Tests = {}));
})(Rx || (Rx = {}));
