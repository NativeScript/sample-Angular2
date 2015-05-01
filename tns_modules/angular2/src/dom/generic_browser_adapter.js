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
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var lang_2 = require('angular2/src/facade/lang');
var dom_adapter_1 = require('./dom_adapter');
var GenericBrowserDomAdapter = (function (_super) {
    __extends(GenericBrowserDomAdapter, _super);
    function GenericBrowserDomAdapter() {
        _super.apply(this, arguments);
    }
    GenericBrowserDomAdapter.prototype.getDistributedNodes = function (el) {
        return el.getDistributedNodes();
    };
    GenericBrowserDomAdapter.prototype.resolveAndSetHref = function (el, baseUrl, href) {
        el.href = href == null ? baseUrl : baseUrl + '/../' + href;
    };
    GenericBrowserDomAdapter.prototype.cssToRules = function (css) {
        var style = this.createStyleElement(css);
        this.appendChild(this.defaultDoc().head, style);
        var rules = collection_1.ListWrapper.create();
        if (lang_2.isPresent(style.sheet)) {
            try {
                var rawRules = style.sheet.cssRules;
                rules = collection_1.ListWrapper.createFixedSize(rawRules.length);
                for (var i = 0; i < rawRules.length; i++) {
                    rules[i] = rawRules[i];
                }
            }
            catch (e) { }
        }
        else { }
        this.remove(style);
        return rules;
    };
    GenericBrowserDomAdapter.prototype.supportsDOMEvents = function () {
        return true;
    };
    GenericBrowserDomAdapter.prototype.supportsNativeShadowDOM = function () {
        return lang_2.isFunction(this.defaultDoc().body.createShadowRoot);
    };
    return GenericBrowserDomAdapter;
})(dom_adapter_1.DomAdapter);
exports.GenericBrowserDomAdapter = GenericBrowserDomAdapter;
Object.defineProperty(GenericBrowserDomAdapter, "annotations", { get: function () {
        return [new lang_1.ABSTRACT()];
    } });
Object.defineProperty(GenericBrowserDomAdapter.prototype.resolveAndSetHref, "parameters", { get: function () {
        return [[], [assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(GenericBrowserDomAdapter.prototype.cssToRules, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
