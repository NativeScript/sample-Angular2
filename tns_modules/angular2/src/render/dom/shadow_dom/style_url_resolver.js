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
var url_resolver_1 = require('angular2/src/services/url_resolver');
var StyleUrlResolver = (function () {
    function StyleUrlResolver(resolver) {
        this._resolver = resolver;
    }
    StyleUrlResolver.prototype.resolveUrls = function (cssText, baseUrl) {
        cssText = this._replaceUrls(cssText, _cssUrlRe, baseUrl);
        cssText = this._replaceUrls(cssText, _cssImportRe, baseUrl);
        return cssText;
    };
    StyleUrlResolver.prototype._replaceUrls = function (cssText, re, baseUrl) {
        var _this = this;
        return lang_1.StringWrapper.replaceAllMapped(cssText, re, function (m) {
            var pre = m[1];
            var url = lang_1.StringWrapper.replaceAll(m[2], _quoteRe, '');
            var post = m[3];
            var resolvedUrl = _this._resolver.resolve(baseUrl, url);
            return pre + "'" + resolvedUrl + "'" + post;
        });
    };
    return StyleUrlResolver;
})();
exports.StyleUrlResolver = StyleUrlResolver;
Object.defineProperty(StyleUrlResolver, "annotations", { get: function () {
        return [new di_1.Injectable()];
    } });
Object.defineProperty(StyleUrlResolver, "parameters", { get: function () {
        return [[url_resolver_1.UrlResolver]];
    } });
Object.defineProperty(StyleUrlResolver.prototype.resolveUrls, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(StyleUrlResolver.prototype._replaceUrls, "parameters", { get: function () {
        return [[assert.type.string], [lang_1.RegExp], [assert.type.string]];
    } });
var _cssUrlRe = lang_1.RegExpWrapper.create('(url\\()([^)]*)(\\))');
var _cssImportRe = lang_1.RegExpWrapper.create('(@import[\\s]+(?!url\\())[\'"]([^\'"]*)[\'"](.*;)');
var _quoteRe = lang_1.RegExpWrapper.create('[\'"]');
