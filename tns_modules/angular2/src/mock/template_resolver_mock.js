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
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var template_1 = require('angular2/src/core/annotations/template');
var template_resolver_1 = require('angular2/src/core/compiler/template_resolver');
var MockTemplateResolver = (function (_super) {
    __extends(MockTemplateResolver, _super);
    function MockTemplateResolver() {
        _super.call(this);
        this._templates = collection_1.MapWrapper.create();
        this._inlineTemplates = collection_1.MapWrapper.create();
        this._templateCache = collection_1.MapWrapper.create();
        this._directiveOverrides = collection_1.MapWrapper.create();
    }
    MockTemplateResolver.prototype.setTemplate = function (component, template) {
        this._checkOverrideable(component);
        collection_1.MapWrapper.set(this._templates, component, template);
    };
    MockTemplateResolver.prototype.setInlineTemplate = function (component, template) {
        this._checkOverrideable(component);
        collection_1.MapWrapper.set(this._inlineTemplates, component, template);
    };
    MockTemplateResolver.prototype.overrideTemplateDirective = function (component, from, to) {
        this._checkOverrideable(component);
        var overrides = collection_1.MapWrapper.get(this._directiveOverrides, component);
        if (lang_1.isBlank(overrides)) {
            overrides = collection_1.MapWrapper.create();
            collection_1.MapWrapper.set(this._directiveOverrides, component, overrides);
        }
        collection_1.MapWrapper.set(overrides, from, to);
    };
    MockTemplateResolver.prototype.resolve = function (component) {
        var template = collection_1.MapWrapper.get(this._templateCache, component);
        if (lang_1.isPresent(template))
            return template;
        template = collection_1.MapWrapper.get(this._templates, component);
        if (lang_1.isBlank(template)) {
            template = _super.prototype.resolve.call(this, component);
        }
        var directives = template.directives;
        var overrides = collection_1.MapWrapper.get(this._directiveOverrides, component);
        if (lang_1.isPresent(overrides) && lang_1.isPresent(directives)) {
            directives = collection_1.ListWrapper.clone(template.directives);
            collection_1.MapWrapper.forEach(overrides, function (to, from) {
                var srcIndex = directives.indexOf(from);
                if (srcIndex == -1) {
                    throw new lang_1.BaseException("Overriden directive " + lang_1.stringify(from) + " not found in the template of " + lang_1.stringify(component));
                }
                directives[srcIndex] = to;
            });
            template = new template_1.Template({
                inline: template.inline,
                url: template.url,
                directives: directives,
                formatters: template.formatters,
                source: template.source,
                locale: template.locale,
                device: template.device
            });
        }
        var inlineTemplate = collection_1.MapWrapper.get(this._inlineTemplates, component);
        if (lang_1.isPresent(inlineTemplate)) {
            template = new template_1.Template({
                inline: inlineTemplate,
                url: null,
                directives: template.directives,
                formatters: template.formatters,
                source: template.source,
                locale: template.locale,
                device: template.device
            });
        }
        collection_1.MapWrapper.set(this._templateCache, component, template);
        return template;
    };
    MockTemplateResolver.prototype._checkOverrideable = function (component) {
        var cached = collection_1.MapWrapper.get(this._templateCache, component);
        if (lang_1.isPresent(cached)) {
            throw new lang_1.BaseException("The component " + lang_1.stringify(component) + " has already been compiled, its configuration can not be changed");
        }
    };
    return MockTemplateResolver;
})(template_resolver_1.TemplateResolver);
exports.MockTemplateResolver = MockTemplateResolver;
Object.defineProperty(MockTemplateResolver.prototype.setTemplate, "parameters", { get: function () {
        return [[lang_1.Type], [template_1.Template]];
    } });
Object.defineProperty(MockTemplateResolver.prototype.setInlineTemplate, "parameters", { get: function () {
        return [[lang_1.Type], [assert.type.string]];
    } });
Object.defineProperty(MockTemplateResolver.prototype.overrideTemplateDirective, "parameters", { get: function () {
        return [[lang_1.Type], [lang_1.Type], [lang_1.Type]];
    } });
Object.defineProperty(MockTemplateResolver.prototype.resolve, "parameters", { get: function () {
        return [[lang_1.Type]];
    } });
Object.defineProperty(MockTemplateResolver.prototype._checkOverrideable, "parameters", { get: function () {
        return [[lang_1.Type]];
    } });
