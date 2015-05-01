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
var annotations_1 = require('angular2/src/core/annotations/annotations');
var lang_1 = require('angular2/src/facade/lang');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var element_1 = require('angular2/src/core/dom/element');
var CSSClass = (function () {
    function CSSClass(ngEl) {
        this._domEl = ngEl.domElement;
    }
    CSSClass.prototype._toggleClass = function (className, enabled) {
        if (enabled) {
            dom_adapter_1.DOM.addClass(this._domEl, className);
        }
        else {
            dom_adapter_1.DOM.removeClass(this._domEl, className);
        }
    };
    Object.defineProperty(CSSClass.prototype, "iterableChanges", {
        set: function (changes) {
            var _this = this;
            if (lang_1.isPresent(changes)) {
                changes.forEachAddedItem(function (record) {
                    _this._toggleClass(record.key, record.currentValue);
                });
                changes.forEachChangedItem(function (record) {
                    _this._toggleClass(record.key, record.currentValue);
                });
                changes.forEachRemovedItem(function (record) {
                    if (record.previousValue) {
                        dom_adapter_1.DOM.removeClass(_this._domEl, record.key);
                    }
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    return CSSClass;
})();
exports.CSSClass = CSSClass;
Object.defineProperty(CSSClass, "annotations", { get: function () {
        return [new annotations_1.Decorator({
                selector: '[class]',
                bind: { 'iterableChanges': 'class | keyValDiff' }
            })];
    } });
Object.defineProperty(CSSClass, "parameters", { get: function () {
        return [[element_1.NgElement]];
    } });
