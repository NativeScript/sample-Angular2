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
var collection_1 = require('angular2/src/facade/collection');
var async_1 = require('angular2/src/facade/async');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var xhr_1 = require('angular2/src/services/xhr');
var api_1 = require('../../api');
var url_resolver_1 = require('angular2/src/services/url_resolver');
var TemplateLoader = (function () {
    function TemplateLoader(xhr, urlResolver) {
        this._xhr = xhr;
        this._htmlCache = collection_1.StringMapWrapper.create();
    }
    TemplateLoader.prototype.load = function (template) {
        if (lang_1.isPresent(template.inline)) {
            return async_1.PromiseWrapper.resolve(dom_adapter_1.DOM.createTemplate(template.inline));
        }
        var url = template.absUrl;
        if (lang_1.isPresent(url)) {
            var promise = collection_1.StringMapWrapper.get(this._htmlCache, url);
            if (lang_1.isBlank(promise)) {
                promise = this._xhr.get(url).then(function (html) {
                    var template = dom_adapter_1.DOM.createTemplate(html);
                    return template;
                });
                collection_1.StringMapWrapper.set(this._htmlCache, url, promise);
            }
            return promise;
        }
        throw new lang_1.BaseException('Templates should have either their url or inline property set');
    };
    return TemplateLoader;
})();
exports.TemplateLoader = TemplateLoader;
Object.defineProperty(TemplateLoader, "annotations", { get: function () {
        return [new di_1.Injectable()];
    } });
Object.defineProperty(TemplateLoader, "parameters", { get: function () {
        return [[xhr_1.XHR], [url_resolver_1.UrlResolver]];
    } });
Object.defineProperty(TemplateLoader.prototype.load, "parameters", { get: function () {
        return [[api_1.Template]];
    } });
