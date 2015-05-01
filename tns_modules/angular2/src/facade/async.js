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
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var rx_all_1 = require('rx/dist/rx.all');
exports.Promise = lang_1.global.Promise;
var PromiseWrapper = (function () {
    function PromiseWrapper() {
    }
    PromiseWrapper.resolve = function (obj) {
        return exports.Promise.resolve(obj);
    };
    PromiseWrapper.reject = function (obj) {
        return exports.Promise.reject(obj);
    };
    PromiseWrapper.catchError = function (promise, onError) {
        return promise.catch(onError);
    };
    PromiseWrapper.all = function (promises) {
        if (promises.length == 0)
            return exports.Promise.resolve([]);
        return exports.Promise.all(promises);
    };
    PromiseWrapper.then = function (promise, success, rejection) {
        return promise.then(success, rejection);
    };
    PromiseWrapper.completer = function () {
        var resolve;
        var reject;
        var p = new exports.Promise(function (res, rej) {
            resolve = res;
            reject = rej;
        });
        return {
            promise: p,
            resolve: resolve,
            reject: reject
        };
    };
    PromiseWrapper.setTimeout = function (fn, millis) {
        lang_1.global.setTimeout(fn, millis);
    };
    PromiseWrapper.isPromise = function (maybePromise) {
        return maybePromise instanceof exports.Promise;
    };
    return PromiseWrapper;
})();
exports.PromiseWrapper = PromiseWrapper;
Object.defineProperty(PromiseWrapper.catchError, "parameters", { get: function () {
        return [[exports.Promise], [Function]];
    } });
Object.defineProperty(PromiseWrapper.all, "parameters", { get: function () {
        return [[collection_1.List]];
    } });
Object.defineProperty(PromiseWrapper.then, "parameters", { get: function () {
        return [[exports.Promise], [Function], [Function]];
    } });
Object.defineProperty(PromiseWrapper.setTimeout, "parameters", { get: function () {
        return [[Function], [lang_1.int]];
    } });
exports.Observable = rx_all_1.default.Observable;
exports.ObservableController = rx_all_1.default.Subject;
var ObservableWrapper = (function () {
    function ObservableWrapper() {
    }
    ObservableWrapper.createController = function () {
        return new rx_all_1.default.Subject();
    };
    ObservableWrapper.createObservable = function (subject) {
        return subject;
    };
    ObservableWrapper.subscribe = function (observable, generatorOrOnNext, onThrow, onReturn) {
        if (onThrow === void 0) { onThrow = null; }
        if (onReturn === void 0) { onReturn = null; }
        if (lang_1.isPresent(generatorOrOnNext.next)) {
            return observable.observeOn(rx_all_1.default.Scheduler.timeout).subscribe(function (value) { return generatorOrOnNext.next(value); }, function (error) { return generatorOrOnNext.throw(error); }, function () { return generatorOrOnNext.return(); });
        }
        else {
            return observable.observeOn(rx_all_1.default.Scheduler.timeout).subscribe(generatorOrOnNext, onThrow, onReturn);
        }
    };
    ObservableWrapper.callNext = function (subject, value) {
        subject.onNext(value);
    };
    ObservableWrapper.callThrow = function (subject, error) {
        subject.onError(error);
    };
    ObservableWrapper.callReturn = function (subject) {
        subject.onCompleted();
    };
    return ObservableWrapper;
})();
exports.ObservableWrapper = ObservableWrapper;
Object.defineProperty(ObservableWrapper.createObservable, "parameters", { get: function () {
        return [[rx_all_1.default.Subject]];
    } });
Object.defineProperty(ObservableWrapper.subscribe, "parameters", { get: function () {
        return [[exports.Observable], [], [], []];
    } });
Object.defineProperty(ObservableWrapper.callNext, "parameters", { get: function () {
        return [[rx_all_1.default.Subject], [assert.type.any]];
    } });
Object.defineProperty(ObservableWrapper.callThrow, "parameters", { get: function () {
        return [[rx_all_1.default.Subject], [assert.type.any]];
    } });
Object.defineProperty(ObservableWrapper.callReturn, "parameters", { get: function () {
        return [[rx_all_1.default.Subject]];
    } });
