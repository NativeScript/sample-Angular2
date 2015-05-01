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
var application_1 = require('angular2/src/core/application');
var application_tokens_1 = require('angular2/src/core/application_tokens');
var annotations_1 = require('angular2/src/core/annotations/annotations');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var async_1 = require('angular2/src/facade/async');
var di_1 = require('angular2/di');
var template_1 = require('angular2/src/core/annotations/template');
var life_cycle_1 = require('angular2/src/core/life_cycle/life_cycle');
var testability_1 = require('angular2/src/core/testability/testability');
var HelloRootCmp = (function () {
    function HelloRootCmp() {
        this.greeting = 'hello';
    }
    return HelloRootCmp;
})();
Object.defineProperty(HelloRootCmp, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'hello-app' }), new template_1.Template({ inline: '{{greeting}} world!' })];
    } });
var HelloRootCmpContent = (function () {
    function HelloRootCmpContent() {
    }
    return HelloRootCmpContent;
})();
Object.defineProperty(HelloRootCmpContent, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'hello-app' }), new template_1.Template({ inline: 'before: <content></content> after: done' })];
    } });
var HelloRootCmp2 = (function () {
    function HelloRootCmp2() {
        this.greeting = 'hello';
    }
    return HelloRootCmp2;
})();
Object.defineProperty(HelloRootCmp2, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'hello-app-2' }), new template_1.Template({ inline: '{{greeting}} world, again!' })];
    } });
var HelloRootCmp3 = (function () {
    function HelloRootCmp3(appBinding) {
        this.appBinding = appBinding;
    }
    return HelloRootCmp3;
})();
Object.defineProperty(HelloRootCmp3, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'hello-app' }), new template_1.Template({ inline: '' })];
    } });
Object.defineProperty(HelloRootCmp3, "parameters", { get: function () {
        return [[new di_1.Inject("appBinding")]];
    } });
var HelloRootCmp4 = (function () {
    function HelloRootCmp4(lc) {
        this.lc = lc;
    }
    return HelloRootCmp4;
})();
Object.defineProperty(HelloRootCmp4, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'hello-app' }), new template_1.Template({ inline: '' })];
    } });
Object.defineProperty(HelloRootCmp4, "parameters", { get: function () {
        return [[new di_1.Inject(life_cycle_1.LifeCycle)]];
    } });
var HelloRootMissingTemplate = (function () {
    function HelloRootMissingTemplate() {
    }
    return HelloRootMissingTemplate;
})();
Object.defineProperty(HelloRootMissingTemplate, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'hello-app' })];
    } });
var HelloRootDirectiveIsNotCmp = (function () {
    function HelloRootDirectiveIsNotCmp() {
    }
    return HelloRootDirectiveIsNotCmp;
})();
Object.defineProperty(HelloRootDirectiveIsNotCmp, "annotations", { get: function () {
        return [new annotations_1.Decorator({ selector: 'hello-app' })];
    } });
function main() {
    var fakeDoc, el, el2, testBindings, lightDom;
    test_lib_1.beforeEach(function () {
        fakeDoc = dom_adapter_1.DOM.createHtmlDocument();
        el = dom_adapter_1.DOM.createElement('hello-app', fakeDoc);
        el2 = dom_adapter_1.DOM.createElement('hello-app-2', fakeDoc);
        lightDom = dom_adapter_1.DOM.createElement('light-dom-el', fakeDoc);
        dom_adapter_1.DOM.appendChild(fakeDoc.body, el);
        dom_adapter_1.DOM.appendChild(fakeDoc.body, el2);
        dom_adapter_1.DOM.appendChild(el, lightDom);
        dom_adapter_1.DOM.setText(lightDom, 'loading');
        testBindings = [di_1.bind(application_tokens_1.appDocumentToken).toValue(fakeDoc)];
    });
    test_lib_1.describe('bootstrap factory method', function () {
        test_lib_1.it('should throw if no Template found', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            var injectorPromise = application_1.bootstrap(HelloRootMissingTemplate, testBindings, function (e, t) {
                throw e;
            });
            async_1.PromiseWrapper.then(injectorPromise, null, function (reason) {
                test_lib_1.expect(reason.message).toContain('No template found for HelloRootMissingTemplate');
                async.done();
            });
        }));
        test_lib_1.it('should throw if bootstrapped Directive is not a Component', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            var injectorPromise = application_1.bootstrap(HelloRootDirectiveIsNotCmp, testBindings, function (e, t) {
                throw e;
            });
            async_1.PromiseWrapper.then(injectorPromise, null, function (reason) {
                test_lib_1.expect(reason.message).toContain('Only Components can be bootstrapped; ' + 'Directive of HelloRootDirectiveIsNotCmp is not a Component');
                async.done();
            });
        }));
        test_lib_1.it('should throw if no element is found', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            var injectorPromise = application_1.bootstrap(HelloRootCmp, [], function (e, t) {
                throw e;
            });
            async_1.PromiseWrapper.then(injectorPromise, null, function (reason) {
                test_lib_1.expect(reason.message).toContain('The app selector "hello-app" did not match any elements');
                async.done();
            });
        }));
        test_lib_1.it('should create an injector promise', function () {
            var injectorPromise = application_1.bootstrap(HelloRootCmp, testBindings);
            test_lib_1.expect(injectorPromise).not.toBe(null);
        });
        test_lib_1.it('should resolve an injector promise and contain bindings', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            var injectorPromise = application_1.bootstrap(HelloRootCmp, testBindings);
            injectorPromise.then(function (injector) {
                test_lib_1.expect(injector.get(application_tokens_1.appElementToken)).toBe(el);
                async.done();
            });
        }));
        test_lib_1.it('should provide the application component in the injector', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            var injectorPromise = application_1.bootstrap(HelloRootCmp, testBindings);
            injectorPromise.then(function (injector) {
                test_lib_1.expect(injector.get(HelloRootCmp)).toBeAnInstanceOf(HelloRootCmp);
                async.done();
            });
        }));
        test_lib_1.it('should display hello world', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            var injectorPromise = application_1.bootstrap(HelloRootCmp, testBindings);
            injectorPromise.then(function (injector) {
                test_lib_1.expect(injector.get(application_tokens_1.appElementToken)).toHaveText('hello world!');
                async.done();
            });
        }));
        test_lib_1.it('should support multiple calls to bootstrap', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            var injectorPromise1 = application_1.bootstrap(HelloRootCmp, testBindings);
            var injectorPromise2 = application_1.bootstrap(HelloRootCmp2, testBindings);
            async_1.PromiseWrapper.all([injectorPromise1, injectorPromise2]).then(function (injectors) {
                test_lib_1.expect(injectors[0].get(application_tokens_1.appElementToken)).toHaveText('hello world!');
                test_lib_1.expect(injectors[1].get(application_tokens_1.appElementToken)).toHaveText('hello world, again!');
                async.done();
            });
        }));
        test_lib_1.it("should make the provided bindings available to the application component", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            var injectorPromise = application_1.bootstrap(HelloRootCmp3, [testBindings, di_1.bind("appBinding").toValue("BoundValue")]);
            injectorPromise.then(function (injector) {
                test_lib_1.expect(injector.get(HelloRootCmp3).appBinding).toEqual("BoundValue");
                async.done();
            });
        }));
        test_lib_1.it("should avoid cyclic dependencies when root component requires Lifecycle through DI", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            var injectorPromise = application_1.bootstrap(HelloRootCmp4, testBindings);
            injectorPromise.then(function (injector) {
                test_lib_1.expect(injector.get(HelloRootCmp4).lc).toBe(injector.get(life_cycle_1.LifeCycle));
                async.done();
            });
        }));
        test_lib_1.it("should support shadow dom content tag", test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            var injectorPromise = application_1.bootstrap(HelloRootCmpContent, testBindings);
            injectorPromise.then(function (injector) {
                test_lib_1.expect(injector.get(application_tokens_1.appElementToken)).toHaveText('before: loading after: done');
                async.done();
            });
        }));
        test_lib_1.it('should register each application with the testability registry', test_lib_1.inject([test_lib_1.AsyncTestCompleter], function (async) {
            var injectorPromise1 = application_1.bootstrap(HelloRootCmp, testBindings);
            var injectorPromise2 = application_1.bootstrap(HelloRootCmp2, testBindings);
            async_1.PromiseWrapper.all([injectorPromise1, injectorPromise2]).then(function (injectors) {
                var registry = injectors[0].get(testability_1.TestabilityRegistry);
                async_1.PromiseWrapper.all([injectors[0].asyncGet(testability_1.Testability), injectors[1].asyncGet(testability_1.Testability)]).then(function (testabilities) {
                    test_lib_1.expect(registry.findTestabilityInTree(el)).toEqual(testabilities[0]);
                    test_lib_1.expect(registry.findTestabilityInTree(el2)).toEqual(testabilities[1]);
                    async.done();
                });
            });
        }));
    });
}
exports.main = main;
