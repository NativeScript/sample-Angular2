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
var style_inliner_1 = require('angular2/src/render/dom/shadow_dom/style_inliner');
var lang_1 = require('angular2/src/facade/lang');
var async_1 = require('angular2/src/facade/async');
var collection_1 = require('angular2/src/facade/collection');
var xhr_1 = require('angular2/src/services/xhr');
var di_1 = require('angular2/di');
function main() {
    test_lib_1.describe('StyleInliner', function () {
        test_lib_1.beforeEachBindings(function () { return [di_1.bind(xhr_1.XHR).toClass(FakeXHR)]; });
        test_lib_1.describe('loading', function () {
            test_lib_1.it('should return a string when there is no import statement', test_lib_1.inject([style_inliner_1.StyleInliner], function (inliner) {
                var css = '.main {}';
                var loadedCss = inliner.inlineImports(css, 'http://base');
                test_lib_1.expect(loadedCss).not.toBePromise();
                test_lib_1.expect(loadedCss).toEqual(css);
            }));
            test_lib_1.it('should inline @import rules', test_lib_1.inject([xhr_1.XHR, style_inliner_1.StyleInliner, test_lib_1.AsyncTestCompleter], function (xhr, inliner, async) {
                xhr.reply('http://base/one.css', '.one {}');
                var css = '@import url("one.css");.main {}';
                var loadedCss = inliner.inlineImports(css, 'http://base');
                test_lib_1.expect(loadedCss).toBePromise();
                async_1.PromiseWrapper.then(loadedCss, function (css) {
                    test_lib_1.expect(css).toEqual('.one {}\n.main {}');
                    async.done();
                }, function (e) {
                    throw 'fail;';
                });
            }));
            test_lib_1.it('should support url([unquoted url]) in @import rules', test_lib_1.inject([xhr_1.XHR, style_inliner_1.StyleInliner, test_lib_1.AsyncTestCompleter], function (xhr, inliner, async) {
                xhr.reply('http://base/one.css', '.one {}');
                var css = '@import url(one.css);.main {}';
                var loadedCss = inliner.inlineImports(css, 'http://base');
                test_lib_1.expect(loadedCss).toBePromise();
                async_1.PromiseWrapper.then(loadedCss, function (css) {
                    test_lib_1.expect(css).toEqual('.one {}\n.main {}');
                    async.done();
                }, function (e) {
                    throw 'fail;';
                });
            }));
            test_lib_1.it('should handle @import error gracefuly', test_lib_1.inject([style_inliner_1.StyleInliner, test_lib_1.AsyncTestCompleter], function (inliner, async) {
                var css = '@import "one.css";.main {}';
                var loadedCss = inliner.inlineImports(css, 'http://base');
                test_lib_1.expect(loadedCss).toBePromise();
                async_1.PromiseWrapper.then(loadedCss, function (css) {
                    test_lib_1.expect(css).toEqual('/* failed to import http://base/one.css */\n.main {}');
                    async.done();
                }, function (e) {
                    throw 'fail;';
                });
            }));
            test_lib_1.it('should inline multiple @import rules', test_lib_1.inject([xhr_1.XHR, style_inliner_1.StyleInliner, test_lib_1.AsyncTestCompleter], function (xhr, inliner, async) {
                xhr.reply('http://base/one.css', '.one {}');
                xhr.reply('http://base/two.css', '.two {}');
                var css = '@import "one.css";@import "two.css";.main {}';
                var loadedCss = inliner.inlineImports(css, 'http://base');
                test_lib_1.expect(loadedCss).toBePromise();
                async_1.PromiseWrapper.then(loadedCss, function (css) {
                    test_lib_1.expect(css).toEqual('.one {}\n.two {}\n.main {}');
                    async.done();
                }, function (e) {
                    throw 'fail;';
                });
            }));
            test_lib_1.it('should inline nested @import rules', test_lib_1.inject([xhr_1.XHR, style_inliner_1.StyleInliner, test_lib_1.AsyncTestCompleter], function (xhr, inliner, async) {
                xhr.reply('http://base/one.css', '@import "two.css";.one {}');
                xhr.reply('http://base/two.css', '.two {}');
                var css = '@import "one.css";.main {}';
                var loadedCss = inliner.inlineImports(css, 'http://base/');
                test_lib_1.expect(loadedCss).toBePromise();
                async_1.PromiseWrapper.then(loadedCss, function (css) {
                    test_lib_1.expect(css).toEqual('.two {}\n.one {}\n.main {}');
                    async.done();
                }, function (e) {
                    throw 'fail;';
                });
            }));
            test_lib_1.it('should handle circular dependencies gracefuly', test_lib_1.inject([xhr_1.XHR, style_inliner_1.StyleInliner, test_lib_1.AsyncTestCompleter], function (xhr, inliner, async) {
                xhr.reply('http://base/one.css', '@import "two.css";.one {}');
                xhr.reply('http://base/two.css', '@import "one.css";.two {}');
                var css = '@import "one.css";.main {}';
                var loadedCss = inliner.inlineImports(css, 'http://base/');
                test_lib_1.expect(loadedCss).toBePromise();
                async_1.PromiseWrapper.then(loadedCss, function (css) {
                    test_lib_1.expect(css).toEqual('.two {}\n.one {}\n.main {}');
                    async.done();
                }, function (e) {
                    throw 'fail;';
                });
            }));
            test_lib_1.it('should handle invalid @import fracefuly', test_lib_1.inject([style_inliner_1.StyleInliner, test_lib_1.AsyncTestCompleter], function (inliner, async) {
                var css = '@import one.css;.main {}';
                var loadedCss = inliner.inlineImports(css, 'http://base/');
                test_lib_1.expect(loadedCss).toBePromise();
                async_1.PromiseWrapper.then(loadedCss, function (css) {
                    test_lib_1.expect(css).toEqual('/* Invalid import rule: "@import one.css;" */.main {}');
                    async.done();
                }, function (e) {
                    throw 'fail;';
                });
            }));
        });
        test_lib_1.describe('media query', function () {
            test_lib_1.it('should wrap inlined content in media query', test_lib_1.inject([xhr_1.XHR, style_inliner_1.StyleInliner, test_lib_1.AsyncTestCompleter], function (xhr, inliner, async) {
                xhr.reply('http://base/one.css', '.one {}');
                var css = '@import "one.css" (min-width: 700px) and (orientation: landscape);';
                var loadedCss = inliner.inlineImports(css, 'http://base/');
                test_lib_1.expect(loadedCss).toBePromise();
                async_1.PromiseWrapper.then(loadedCss, function (css) {
                    test_lib_1.expect(css).toEqual('@media (min-width: 700px) and (orientation: landscape) {\n.one {}\n}\n');
                    async.done();
                }, function (e) {
                    throw 'fail;';
                });
            }));
        });
        test_lib_1.describe('url rewritting', function () {
            test_lib_1.it('should rewrite url in inlined content', test_lib_1.inject([xhr_1.XHR, style_inliner_1.StyleInliner, test_lib_1.AsyncTestCompleter], function (xhr, inliner, async) {
                xhr.reply('http://base/one.css', '@import "./nested/two.css";.one {background-image: url("one.jpg");}');
                xhr.reply('http://base/nested/two.css', '.two {background-image: url("../img/two.jpg");}');
                var css = '@import "one.css";';
                var loadedCss = inliner.inlineImports(css, 'http://base/');
                test_lib_1.expect(loadedCss).toBePromise();
                async_1.PromiseWrapper.then(loadedCss, function (css) {
                    test_lib_1.expect(css).toEqual(".two {background-image: url('http://base/img/two.jpg');}\n" + ".one {background-image: url('http://base/one.jpg');}\n");
                    async.done();
                }, function (e) {
                    throw 'fail;';
                });
            }));
        });
    });
}
exports.main = main;
var FakeXHR = (function (_super) {
    __extends(FakeXHR, _super);
    function FakeXHR() {
        _super.call(this);
        this._responses = collection_1.MapWrapper.create();
    }
    FakeXHR.prototype.get = function (url) {
        var response = collection_1.MapWrapper.get(this._responses, url);
        if (lang_1.isBlank(response)) {
            return async_1.PromiseWrapper.reject('xhr error');
        }
        return async_1.PromiseWrapper.resolve(response);
    };
    FakeXHR.prototype.reply = function (url, response) {
        collection_1.MapWrapper.set(this._responses, url, response);
    };
    return FakeXHR;
})(xhr_1.XHR);
Object.defineProperty(FakeXHR.prototype.get, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(FakeXHR.prototype.reply, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
