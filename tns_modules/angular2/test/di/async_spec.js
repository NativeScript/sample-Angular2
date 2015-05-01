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
var async_1 = require('angular2/src/facade/async');
var UserList = (function () {
    function UserList() {
    }
    return UserList;
})();
function fetchUsers() {
    return async_1.PromiseWrapper.resolve(new UserList());
}
var SynchronousUserList = (function () {
    function SynchronousUserList() {
    }
    return SynchronousUserList;
})();
var UserController = (function () {
    function UserController(list) {
        this.list = list;
    }
    return UserController;
})();
Object.defineProperty(UserController, "parameters", { get: function () {
        return [[UserList]];
    } });
var AsyncUserController = (function () {
    function AsyncUserController(userList) {
        this.userList = userList;
    }
    return AsyncUserController;
})();
Object.defineProperty(AsyncUserController, "parameters", { get: function () {
        return [[new di_1.InjectPromise(UserList)]];
    } });
function main() {
    test_lib_1.describe("async injection", function () {
        test_lib_1.describe("asyncGet", function () {
            test_lib_1.it('should return a promise', function () {
                var injector = new di_1.Injector([di_1.bind(UserList).toAsyncFactory(fetchUsers)]);
                var p = injector.asyncGet(UserList);
                test_lib_1.expect(p).toBePromise();
            });
            test_lib_1.it('should return a promise when the binding is sync', function () {
                var injector = new di_1.Injector([SynchronousUserList]);
                var p = injector.asyncGet(SynchronousUserList);
                test_lib_1.expect(p).toBePromise();
            });
            test_lib_1.it("should return a promise when the binding is sync (from cache)", function () {
                var injector = new di_1.Injector([UserList]);
                test_lib_1.expect(injector.get(UserList)).toBeAnInstanceOf(UserList);
                test_lib_1.expect(injector.asyncGet(UserList)).toBePromise();
            });
            test_lib_1.it('should return the injector', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                var injector = new di_1.Injector([]);
                var p = injector.asyncGet(di_1.Injector);
                p.then(function (injector) {
                    test_lib_1.expect(injector).toBe(injector);
                    async.done();
                });
            }));
            test_lib_1.it('should return a promise when instantiating a sync binding ' + 'with an async dependency', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                var injector = new di_1.Injector([di_1.bind(UserList).toAsyncFactory(fetchUsers), UserController]);
                injector.asyncGet(UserController).then(function (userController) {
                    test_lib_1.expect(userController).toBeAnInstanceOf(UserController);
                    test_lib_1.expect(userController.list).toBeAnInstanceOf(UserList);
                    async.done();
                });
            }));
            test_lib_1.it("should create only one instance (async + async)", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                var injector = new di_1.Injector([di_1.bind(UserList).toAsyncFactory(fetchUsers)]);
                var ul1 = injector.asyncGet(UserList);
                var ul2 = injector.asyncGet(UserList);
                async_1.PromiseWrapper.all([ul1, ul2]).then(function (uls) {
                    test_lib_1.expect(uls[0]).toBe(uls[1]);
                    async.done();
                });
            }));
            test_lib_1.it("should create only one instance (sync + async)", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                var injector = new di_1.Injector([UserList]);
                var promise = injector.asyncGet(UserList);
                var ul = injector.get(UserList);
                test_lib_1.expect(promise).toBePromise();
                test_lib_1.expect(ul).toBeAnInstanceOf(UserList);
                promise.then(function (ful) {
                    test_lib_1.expect(ful).toBe(ul);
                    async.done();
                });
            }));
            test_lib_1.it('should show the full path when error happens in a constructor', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                var injector = new di_1.Injector([UserController, di_1.bind(UserList).toAsyncFactory(function () {
                        throw "Broken UserList";
                    })]);
                var promise = injector.asyncGet(UserController);
                async_1.PromiseWrapper.then(promise, null, function (e) {
                    test_lib_1.expect(e.message).toContain("Error during instantiation of UserList! (UserController -> UserList)");
                    async.done();
                });
            }));
        });
        test_lib_1.describe("get", function () {
            test_lib_1.it('should throw when instantiating an async binding', function () {
                var injector = new di_1.Injector([di_1.bind(UserList).toAsyncFactory(fetchUsers)]);
                test_lib_1.expect(function () { return injector.get(UserList); }).toThrowError('Cannot instantiate UserList synchronously. It is provided as a promise!');
            });
            test_lib_1.it('should throw when instantiating a sync binding with an async dependency', function () {
                var injector = new di_1.Injector([di_1.bind(UserList).toAsyncFactory(fetchUsers), UserController]);
                test_lib_1.expect(function () { return injector.get(UserController); }).toThrowError('Cannot instantiate UserList synchronously. It is provided as a promise! (UserController -> UserList)');
            });
            test_lib_1.it('should not throw when instantiating a sync binding with a resolved async dependency', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
                var injector = new di_1.Injector([di_1.bind(UserList).toAsyncFactory(fetchUsers), UserController]);
                injector.asyncGet(UserList).then(function (_) {
                    test_lib_1.expect(function () {
                        injector.get(UserController);
                    }).not.toThrow();
                    async.done();
                });
            }));
            test_lib_1.it('should resolve synchronously when an async dependency requested as a promise', function () {
                var injector = new di_1.Injector([di_1.bind(UserList).toAsyncFactory(fetchUsers), AsyncUserController]);
                var controller = injector.get(AsyncUserController);
                test_lib_1.expect(controller).toBeAnInstanceOf(AsyncUserController);
                test_lib_1.expect(controller.userList).toBePromise();
            });
            test_lib_1.it('should wrap sync dependencies into promises if required', function () {
                var injector = new di_1.Injector([di_1.bind(UserList).toFactory(function () { return new UserList(); }), AsyncUserController]);
                var controller = injector.get(AsyncUserController);
                test_lib_1.expect(controller).toBeAnInstanceOf(AsyncUserController);
                test_lib_1.expect(controller.userList).toBePromise();
            });
        });
    });
}
exports.main = main;
