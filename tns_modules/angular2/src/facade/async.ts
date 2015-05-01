import {int,
  global,
  isPresent} from 'angular2/src/facade/lang';
import {List} from 'angular2/src/facade/collection';
import Rx from 'rx/dist/rx.all';
export var Promise = global.Promise;
export class PromiseWrapper {
  static resolve(obj) {
    return Promise.resolve(obj);
  }
  static reject(obj) {
    return Promise.reject(obj);
  }
  static catchError(promise, onError) {
    return promise.catch(onError);
  }
  static all(promises) {
    if (promises.length == 0)
      return Promise.resolve([]);
    return Promise.all(promises);
  }
  static then(promise, success, rejection) {
    return promise.then(success, rejection);
  }
  static completer() {
    var resolve;
    var reject;
    var p = new Promise(function(res, rej) {
      resolve = res;
      reject = rej;
    });
    return {
      promise: p,
      resolve: resolve,
      reject: reject
    };
  }
  static setTimeout(fn, millis) {
    global.setTimeout(fn, millis);
  }
  static isPromise(maybePromise) {
    return maybePromise instanceof Promise;
  }
}
Object.defineProperty(PromiseWrapper.catchError, "parameters", {get: function() {
    return [[Promise], [Function]];
  }});
Object.defineProperty(PromiseWrapper.all, "parameters", {get: function() {
    return [[List]];
  }});
Object.defineProperty(PromiseWrapper.then, "parameters", {get: function() {
    return [[Promise], [Function], [Function]];
  }});
Object.defineProperty(PromiseWrapper.setTimeout, "parameters", {get: function() {
    return [[Function], [int]];
  }});
export var Observable = Rx.Observable;
export var ObservableController = Rx.Subject;
export class ObservableWrapper {
  static createController() {
    return new Rx.Subject();
  }
  static createObservable(subject) {
    return subject;
  }
  static subscribe(observable, generatorOrOnNext, onThrow = null, onReturn = null) {
    if (isPresent(generatorOrOnNext.next)) {
      return observable.observeOn(Rx.Scheduler.timeout).subscribe((value) => generatorOrOnNext.next(value), (error) => generatorOrOnNext.throw(error), () => generatorOrOnNext.return());
    } else {
      return observable.observeOn(Rx.Scheduler.timeout).subscribe(generatorOrOnNext, onThrow, onReturn);
    }
  }
  static callNext(subject, value) {
    subject.onNext(value);
  }
  static callThrow(subject, error) {
    subject.onError(error);
  }
  static callReturn(subject) {
    subject.onCompleted();
  }
}
Object.defineProperty(ObservableWrapper.createObservable, "parameters", {get: function() {
    return [[Rx.Subject]];
  }});
Object.defineProperty(ObservableWrapper.subscribe, "parameters", {get: function() {
    return [[Observable], [], [], []];
  }});
Object.defineProperty(ObservableWrapper.callNext, "parameters", {get: function() {
    return [[Rx.Subject], [assert.type.any]];
  }});
Object.defineProperty(ObservableWrapper.callThrow, "parameters", {get: function() {
    return [[Rx.Subject], [assert.type.any]];
  }});
Object.defineProperty(ObservableWrapper.callReturn, "parameters", {get: function() {
    return [[Rx.Subject]];
  }});
//# sourceMappingURL=async.es6.map

//# sourceMappingURL=./async.map