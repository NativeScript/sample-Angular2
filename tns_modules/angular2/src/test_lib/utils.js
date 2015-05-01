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
var collection_1 = require('angular2/src/facade/collection');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var lang_1 = require('angular2/src/facade/lang');
var Log = (function () {
    function Log() {
        this._result = [];
    }
    Log.prototype.add = function (value) {
        collection_1.ListWrapper.push(this._result, value);
    };
    Log.prototype.fn = function (value) {
        var _this = this;
        return function () {
            collection_1.ListWrapper.push(_this._result, value);
        };
    };
    Log.prototype.result = function () {
        return collection_1.ListWrapper.join(this._result, "; ");
    };
    return Log;
})();
exports.Log = Log;
function queryView(view, selector) {
    for (var i = 0; i < view.nodes.length; ++i) {
        var res = dom_adapter_1.DOM.querySelector(view.nodes[i], selector);
        if (lang_1.isPresent(res)) {
            return res;
        }
    }
    return null;
}
exports.queryView = queryView;
function dispatchEvent(element, eventType) {
    dom_adapter_1.DOM.dispatchEvent(element, dom_adapter_1.DOM.createEvent(eventType));
}
exports.dispatchEvent = dispatchEvent;
function el(html) {
    return dom_adapter_1.DOM.firstChild(dom_adapter_1.DOM.content(dom_adapter_1.DOM.createTemplate(html)));
}
exports.el = el;
