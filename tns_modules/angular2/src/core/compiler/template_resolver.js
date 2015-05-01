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
var template_1 = require('angular2/src/core/annotations/template');
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var reflection_1 = require('angular2/src/reflection/reflection');
var TemplateResolver = (function () {
    function TemplateResolver() {
        this._cache = collection_1.MapWrapper.create();
    }
    TemplateResolver.prototype.resolve = function (component) {
        var template = collection_1.MapWrapper.get(this._cache, component);
        if (lang_1.isBlank(template)) {
            template = this._resolve(component);
            collection_1.MapWrapper.set(this._cache, component, template);
        }
        return template;
    };
    TemplateResolver.prototype._resolve = function (component) {
        var annotations = reflection_1.reflector.annotations(component);
        for (var i = 0; i < annotations.length; i++) {
            var annotation = annotations[i];
            if (annotation instanceof template_1.Template) {
                return annotation;
            }
        }
        throw new lang_1.BaseException("No template found for " + lang_1.stringify(component));
    };
    return TemplateResolver;
})();
exports.TemplateResolver = TemplateResolver;
Object.defineProperty(TemplateResolver, "annotations", { get: function () {
        return [new di_1.Injectable()];
    } });
Object.defineProperty(TemplateResolver.prototype.resolve, "parameters", { get: function () {
        return [[lang_1.Type]];
    } });
Object.defineProperty(TemplateResolver.prototype._resolve, "parameters", { get: function () {
        return [[lang_1.Type]];
    } });
