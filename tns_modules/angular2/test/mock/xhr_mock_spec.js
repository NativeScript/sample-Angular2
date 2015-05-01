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
var xhr_mock_1 = require('angular2/src/mock/xhr_mock');
var async_1 = require('angular2/src/facade/async');
var lang_1 = require('angular2/src/facade/lang');
function main() {
    test_lib_1.describe('MockXHR', function () {
        var xhr;
        test_lib_1.beforeEach(function () {
            xhr = new xhr_mock_1.MockXHR();
        });
        function expectResponse(request, url, response, done) {
            if (done === void 0) { done = null; }
            function onResponse(text) {
                if (response === null) {
                    throw "Unexpected response " + url + " -> " + text;
                }
                else {
                    test_lib_1.expect(text).toEqual(response);
                    if (lang_1.isPresent(done))
                        done();
                }
            }
            Object.defineProperty(onResponse, "parameters", { get: function () {
                    return [[assert.type.string]];
                } });
            function onError(error) {
                if (response !== null) {
                    throw "Unexpected error " + url;
                }
                else {
                    test_lib_1.expect(error).toEqual("Failed to load " + url);
                    if (lang_1.isPresent(done))
                        done();
                }
            }
            Object.defineProperty(onError, "parameters", { get: function () {
                    return [[assert.type.string]];
                } });
            async_1.PromiseWrapper.then(request, onResponse, onError);
        }
        Object.defineProperty(expectResponse, "parameters", { get: function () {
                return [[async_1.Promise], [assert.type.string], [assert.type.string], []];
            } });
        test_lib_1.it('should return a response from the definitions', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            var url = '/foo';
            var response = 'bar';
            xhr.when(url, response);
            expectResponse(xhr.get(url), url, response, function () { return async.done(); });
            xhr.flush();
        }));
        test_lib_1.it('should return an error from the definitions', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            var url = '/foo';
            var response = null;
            xhr.when(url, response);
            expectResponse(xhr.get(url), url, response, function () { return async.done(); });
            xhr.flush();
        }));
        test_lib_1.it('should return a response from the expectations', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            var url = '/foo';
            var response = 'bar';
            xhr.expect(url, response);
            expectResponse(xhr.get(url), url, response, function () { return async.done(); });
            xhr.flush();
        }));
        test_lib_1.it('should return an error from the expectations', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            var url = '/foo';
            var response = null;
            xhr.expect(url, response);
            expectResponse(xhr.get(url), url, response, function () { return async.done(); });
            xhr.flush();
        }));
        test_lib_1.it('should not reuse expectations', function () {
            var url = '/foo';
            var response = 'bar';
            xhr.expect(url, response);
            xhr.get(url);
            xhr.get(url);
            test_lib_1.expect(function () {
                xhr.flush();
            }).toThrowError('Unexpected request /foo');
        });
        test_lib_1.it('should return expectations before definitions', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            var url = '/foo';
            xhr.when(url, 'when');
            xhr.expect(url, 'expect');
            expectResponse(xhr.get(url), url, 'expect');
            expectResponse(xhr.get(url), url, 'when', function () { return async.done(); });
            xhr.flush();
        }));
        test_lib_1.it('should throw when there is no definitions or expectations', function () {
            xhr.get('/foo');
            test_lib_1.expect(function () {
                xhr.flush();
            }).toThrowError('Unexpected request /foo');
        });
        test_lib_1.it('should throw when flush is called without any pending requests', function () {
            test_lib_1.expect(function () {
                xhr.flush();
            }).toThrowError('No pending requests to flush');
        });
        test_lib_1.it('should throw on unstatisfied expectations', function () {
            xhr.expect('/foo', 'bar');
            xhr.when('/bar', 'foo');
            xhr.get('/bar');
            test_lib_1.expect(function () {
                xhr.flush();
            }).toThrowError('Unsatisfied requests: /foo');
        });
    });
}
exports.main = main;
