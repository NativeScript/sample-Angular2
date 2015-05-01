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
var di_1 = require('angular2/di');
var lang_1 = require('angular2/src/facade/lang');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var UrlResolver = (function () {
    function UrlResolver() {
        if (lang_1.isBlank(UrlResolver.a)) {
            UrlResolver.a = dom_adapter_1.DOM.createElement('a');
        }
    }
    UrlResolver.prototype.resolve = function (baseUrl, url) {
        if (lang_1.isBlank(baseUrl)) {
            dom_adapter_1.DOM.resolveAndSetHref(UrlResolver.a, url, null);
            return dom_adapter_1.DOM.getHref(UrlResolver.a);
        }
        if (lang_1.isBlank(url) || url == '')
            return baseUrl;
        if (url[0] == '/') {
            throw new lang_1.BaseException("Could not resolve the url " + url + " from " + baseUrl);
        }
        var m = lang_1.RegExpWrapper.firstMatch(_schemeRe, url);
        if (lang_1.isPresent(m[1])) {
            return url;
        }
        dom_adapter_1.DOM.resolveAndSetHref(UrlResolver.a, baseUrl, url);
        return dom_adapter_1.DOM.getHref(UrlResolver.a);
    };
    return UrlResolver;
})();
exports.UrlResolver = UrlResolver;
Object.defineProperty(UrlResolver, "annotations", { get: function () {
        return [new di_1.Injectable()];
    } });
Object.defineProperty(UrlResolver.prototype.resolve, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
var _schemeRe = lang_1.RegExpWrapper.create('^([^:/?#]+:)?');
