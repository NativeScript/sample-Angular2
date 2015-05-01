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
var browser_adapter_1 = require('angular2/src/dom/browser_adapter');
var browser_1 = require('angular2/src/facade/browser');
var lang_1 = require('angular2/src/facade/lang');
var DOM = new browser_adapter_1.BrowserDomAdapter();
function getIntParameter(name) {
    return lang_1.NumberWrapper.parseInt(getStringParameter(name), 10);
}
exports.getIntParameter = getIntParameter;
Object.defineProperty(getIntParameter, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
function getStringParameter(name) {
    var els = DOM.querySelectorAll(browser_1.document, "input[name=\"" + name + "\"]");
    var value;
    var el;
    for (var i = 0; i < els.length; i++) {
        el = els[i];
        var type = DOM.type(el);
        if ((type != 'radio' && type != 'checkbox') || DOM.getChecked(el)) {
            value = DOM.getValue(el);
            break;
        }
    }
    if (lang_1.isBlank(value)) {
        throw new lang_1.BaseException("Could not find and input field with name " + name);
    }
    return value;
}
exports.getStringParameter = getStringParameter;
Object.defineProperty(getStringParameter, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
function bindAction(selector, callback) {
    var el = DOM.querySelector(browser_1.document, selector);
    DOM.on(el, 'click', function (_) {
        callback();
    });
}
exports.bindAction = bindAction;
Object.defineProperty(bindAction, "parameters", { get: function () {
        return [[assert.type.string], [Function]];
    } });
function microBenchmark(name, iterationCount, callback) {
    var durationName = name + "/" + iterationCount;
    browser_1.window.console.time(durationName);
    callback();
    browser_1.window.console.timeEnd(durationName);
}
exports.microBenchmark = microBenchmark;
