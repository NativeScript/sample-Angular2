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
var xhr_1 = require('angular2/src/services/xhr');
var collection_1 = require('angular2/src/facade/collection');
var url_resolver_1 = require('angular2/src/services/url_resolver');
var style_url_resolver_1 = require('./style_url_resolver');
var lang_1 = require('angular2/src/facade/lang');
var async_1 = require('angular2/src/facade/async');
var StyleInliner = (function () {
    function StyleInliner(xhr, styleUrlResolver, urlResolver) {
        this._xhr = xhr;
        this._urlResolver = urlResolver;
        this._styleUrlResolver = styleUrlResolver;
    }
    StyleInliner.prototype.inlineImports = function (cssText, baseUrl) {
        return this._inlineImports(cssText, baseUrl, []);
    };
    StyleInliner.prototype._inlineImports = function (cssText, baseUrl, inlinedUrls) {
        var _this = this;
        var partIndex = 0;
        var parts = lang_1.StringWrapper.split(cssText, _importRe);
        if (parts.length === 1) {
            return cssText;
        }
        var promises = [];
        while (partIndex < parts.length - 1) {
            var prefix = parts[partIndex];
            var rule = parts[partIndex + 1];
            var url = _extractUrl(rule);
            if (lang_1.isPresent(url)) {
                url = this._urlResolver.resolve(baseUrl, url);
            }
            var mediaQuery = _extractMediaQuery(rule);
            var promise;
            if (lang_1.isBlank(url)) {
                promise = async_1.PromiseWrapper.resolve("/* Invalid import rule: \"@import " + rule + ";\" */");
            }
            else if (collection_1.ListWrapper.contains(inlinedUrls, url)) {
                promise = async_1.PromiseWrapper.resolve(prefix);
            }
            else {
                collection_1.ListWrapper.push(inlinedUrls, url);
                promise = async_1.PromiseWrapper.then(this._xhr.get(url), function (css) {
                    css = _this._inlineImports(css, url, inlinedUrls);
                    if (async_1.PromiseWrapper.isPromise(css)) {
                        return css.then(function (css) {
                            return prefix + _this._transformImportedCss(css, mediaQuery, url) + '\n';
                        });
                    }
                    else {
                        return prefix + _this._transformImportedCss(css, mediaQuery, url) + '\n';
                    }
                }, function (error) { return ("/* failed to import " + url + " */\n"); });
            }
            collection_1.ListWrapper.push(promises, promise);
            partIndex += 2;
        }
        return async_1.PromiseWrapper.all(promises).then(function (cssParts) {
            var cssText = cssParts.join('');
            if (partIndex < parts.length) {
                cssText += parts[partIndex];
            }
            return cssText;
        });
    };
    StyleInliner.prototype._transformImportedCss = function (css, mediaQuery, url) {
        css = this._styleUrlResolver.resolveUrls(css, url);
        return _wrapInMediaRule(css, mediaQuery);
    };
    return StyleInliner;
})();
exports.StyleInliner = StyleInliner;
Object.defineProperty(StyleInliner, "annotations", { get: function () {
        return [new di_1.Injectable()];
    } });
Object.defineProperty(StyleInliner, "parameters", { get: function () {
        return [[xhr_1.XHR], [style_url_resolver_1.StyleUrlResolver], [url_resolver_1.UrlResolver]];
    } });
Object.defineProperty(StyleInliner.prototype.inlineImports, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(StyleInliner.prototype._inlineImports, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string], [assert.genericType(List, assert.type.string)]];
    } });
Object.defineProperty(StyleInliner.prototype._transformImportedCss, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string], [assert.type.string]];
    } });
function _extractUrl(importRule) {
    var match = lang_1.RegExpWrapper.firstMatch(_urlRe, importRule);
    if (lang_1.isBlank(match))
        return null;
    return lang_1.isPresent(match[1]) ? match[1] : match[2];
}
Object.defineProperty(_extractUrl, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
function _extractMediaQuery(importRule) {
    var match = lang_1.RegExpWrapper.firstMatch(_mediaQueryRe, importRule);
    if (lang_1.isBlank(match))
        return null;
    var mediaQuery = match[1].trim();
    return (mediaQuery.length > 0) ? mediaQuery : null;
}
Object.defineProperty(_extractMediaQuery, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
function _wrapInMediaRule(css, query) {
    return (lang_1.isBlank(query)) ? css : "@media " + query + " {\n" + css + "\n}";
}
Object.defineProperty(_wrapInMediaRule, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
var _importRe = lang_1.RegExpWrapper.create('@import\\s+([^;]+);');
var _urlRe = lang_1.RegExpWrapper.create('url\\(\\s*?[\'"]?([^\'")]+)[\'"]?|' + '[\'"]([^\'")]+)[\'"]');
var _mediaQueryRe = lang_1.RegExpWrapper.create('[\'"][^\'"]+[\'"]\\s*\\)?\\s*(.*)');
