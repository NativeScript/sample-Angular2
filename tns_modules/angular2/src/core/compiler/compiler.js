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
var di_1 = require('angular2/di');
var lang_1 = require('angular2/src/facade/lang');
var async_1 = require('angular2/src/facade/async');
var collection_1 = require('angular2/src/facade/collection');
var change_detection_1 = require('angular2/change_detection');
var directive_metadata_reader_1 = require('./directive_metadata_reader');
var annotations_1 = require('../annotations/annotations');
var view_1 = require('./view');
var element_injector_1 = require('./element_injector');
var template_resolver_1 = require('./template_resolver');
var template_1 = require('../annotations/template');
var shadow_dom_strategy_1 = require('./shadow_dom_strategy');
var component_url_mapper_1 = require('./component_url_mapper');
var proto_view_factory_1 = require('./proto_view_factory');
var url_resolver_1 = require('angular2/src/services/url_resolver');
var template_loader_1 = require('angular2/src/render/dom/compiler/template_loader');
var compile_step_factory_1 = require('angular2/src/render/dom/compiler/compile_step_factory');
var direct_dom_renderer_1 = require('angular2/src/render/dom/direct_dom_renderer');
var rc = require('angular2/src/render/dom/compiler/compiler');
var renderApi = require('angular2/src/render/api');
var CompilerCache = (function () {
    function CompilerCache() {
        this._cache = collection_1.MapWrapper.create();
    }
    CompilerCache.prototype.set = function (component, protoView) {
        collection_1.MapWrapper.set(this._cache, component, protoView);
    };
    CompilerCache.prototype.get = function (component) {
        var result = collection_1.MapWrapper.get(this._cache, component);
        return lang_1.normalizeBlank(result);
    };
    CompilerCache.prototype.clear = function () {
        collection_1.MapWrapper.clear(this._cache);
    };
    return CompilerCache;
})();
exports.CompilerCache = CompilerCache;
Object.defineProperty(CompilerCache, "annotations", { get: function () {
        return [new di_1.Injectable()];
    } });
Object.defineProperty(CompilerCache.prototype.set, "parameters", { get: function () {
        return [[lang_1.Type], [view_1.ProtoView]];
    } });
Object.defineProperty(CompilerCache.prototype.get, "parameters", { get: function () {
        return [[lang_1.Type]];
    } });
var NewCompiler = (function () {
    function NewCompiler(reader, cache, templateResolver, componentUrlMapper, urlResolver, renderer, protoViewFactory) {
        this._reader = reader;
        this._compilerCache = cache;
        this._compiling = collection_1.MapWrapper.create();
        this._templateResolver = templateResolver;
        this._componentUrlMapper = componentUrlMapper;
        this._urlResolver = urlResolver;
        this._appUrl = urlResolver.resolve(null, './');
        this._renderer = renderer;
        this._protoViewFactory = protoViewFactory;
    }
    NewCompiler.prototype._bindDirective = function (directive) {
        var meta = this._reader.read(directive);
        return element_injector_1.DirectiveBinding.createFromType(meta.type, meta.annotation);
    };
    NewCompiler.prototype.compile = function (component) {
        var protoView = this._compile(this._bindDirective(component));
        return async_1.PromiseWrapper.isPromise(protoView) ? protoView : async_1.PromiseWrapper.resolve(protoView);
    };
    NewCompiler.prototype._compile = function (componentBinding) {
        var _this = this;
        var component = componentBinding.key.token;
        var protoView = this._compilerCache.get(component);
        if (lang_1.isPresent(protoView)) {
            return protoView;
        }
        var pvPromise = collection_1.MapWrapper.get(this._compiling, component);
        if (lang_1.isPresent(pvPromise)) {
            return pvPromise;
        }
        var template = this._templateResolver.resolve(component);
        var directives = collection_1.ListWrapper.map(this._flattenDirectives(template), function (directive) { return _this._bindDirective(directive); });
        pvPromise = this._compileNoRecurse(componentBinding, template, directives).then(function (protoView) {
            _this._compilerCache.set(component, protoView);
            collection_1.MapWrapper.delete(_this._compiling, component);
            var nestedPVPromises = _this._compileNestedComponents(protoView);
            if (nestedPVPromises.length > 0) {
                return async_1.PromiseWrapper.then(async_1.PromiseWrapper.all(nestedPVPromises), function (_) { return protoView; }, function (e) {
                    throw new lang_1.BaseException(e + " -> Failed to compile " + lang_1.stringify(component));
                });
            }
            return protoView;
        });
        collection_1.MapWrapper.set(this._compiling, component, pvPromise);
        return pvPromise;
    };
    NewCompiler.prototype._compileNoRecurse = function (componentBinding, template, directives) {
        var _this = this;
        var component = componentBinding.key.token;
        var componentUrl = this._urlResolver.resolve(this._appUrl, this._componentUrlMapper.getUrl(component));
        var templateAbsUrl = null;
        if (lang_1.isPresent(template.url)) {
            templateAbsUrl = this._urlResolver.resolve(componentUrl, template.url);
        }
        else {
            templateAbsUrl = componentUrl;
        }
        var renderTemplate = new renderApi.Template({
            componentId: lang_1.stringify(component),
            absUrl: templateAbsUrl,
            inline: template.inline,
            directives: collection_1.ListWrapper.map(directives, this._buildRenderDirective)
        });
        return this._renderer.compile(renderTemplate).then(function (renderPv) {
            return _this._protoViewFactory.createProtoView(componentBinding.annotation, renderPv, directives);
        });
    };
    NewCompiler.prototype._compileNestedComponents = function (protoView, nestedPVPromises) {
        var _this = this;
        if (nestedPVPromises === void 0) { nestedPVPromises = null; }
        if (lang_1.isBlank(nestedPVPromises)) {
            nestedPVPromises = [];
        }
        collection_1.ListWrapper.map(protoView.elementBinders, function (elementBinder) {
            var nestedComponent = elementBinder.componentDirective;
            if (lang_1.isPresent(nestedComponent) && !(nestedComponent.annotation instanceof annotations_1.DynamicComponent)) {
                var nestedCall = _this._compile(nestedComponent);
                if (async_1.PromiseWrapper.isPromise(nestedCall)) {
                    collection_1.ListWrapper.push(nestedPVPromises, nestedCall.then(function (nestedPv) {
                        elementBinder.nestedProtoView = nestedPv;
                    }));
                }
                else {
                    elementBinder.nestedProtoView = nestedCall;
                }
            }
            else if (lang_1.isPresent(elementBinder.nestedProtoView)) {
                _this._compileNestedComponents(elementBinder.nestedProtoView, nestedPVPromises);
            }
        });
        return nestedPVPromises;
    };
    NewCompiler.prototype._buildRenderDirective = function (directiveBinding) {
        var ann = directiveBinding.annotation;
        var renderType;
        var compileChildren = true;
        if ((ann instanceof annotations_1.Component) || (ann instanceof annotations_1.DynamicComponent)) {
            renderType = renderApi.DirectiveMetadata.COMPONENT_TYPE;
        }
        else if (ann instanceof annotations_1.Viewport) {
            renderType = renderApi.DirectiveMetadata.VIEWPORT_TYPE;
        }
        else if (ann instanceof annotations_1.Decorator) {
            renderType = renderApi.DirectiveMetadata.DECORATOR_TYPE;
            compileChildren = ann.compileChildren;
        }
        var setters = [];
        var readAttributes = [];
        collection_1.ListWrapper.forEach(directiveBinding.dependencies, function (dep) {
            if (lang_1.isPresent(dep.propSetterName)) {
                collection_1.ListWrapper.push(setters, dep.propSetterName);
            }
            if (lang_1.isPresent(dep.attributeName)) {
                collection_1.ListWrapper.push(readAttributes, dep.attributeName);
            }
        });
        return new renderApi.DirectiveMetadata({
            id: lang_1.stringify(directiveBinding.key.token),
            type: renderType,
            selector: ann.selector,
            compileChildren: compileChildren,
            events: lang_1.isPresent(ann.events) ? collection_1.MapWrapper.createFromStringMap(ann.events) : null,
            bind: lang_1.isPresent(ann.bind) ? collection_1.MapWrapper.createFromStringMap(ann.bind) : null,
            setters: setters,
            readAttributes: readAttributes
        });
    };
    NewCompiler.prototype._flattenDirectives = function (template) {
        if (lang_1.isBlank(template.directives))
            return [];
        var directives = [];
        this._flattenList(template.directives, directives);
        return directives;
    };
    NewCompiler.prototype._flattenList = function (tree, out) {
        for (var i = 0; i < tree.length; i++) {
            var item = tree[i];
            if (collection_1.ListWrapper.isList(item)) {
                this._flattenList(item, out);
            }
            else {
                collection_1.ListWrapper.push(out, item);
            }
        }
    };
    return NewCompiler;
})();
exports.NewCompiler = NewCompiler;
Object.defineProperty(NewCompiler, "parameters", { get: function () {
        return [[directive_metadata_reader_1.DirectiveMetadataReader], [CompilerCache], [template_resolver_1.TemplateResolver], [component_url_mapper_1.ComponentUrlMapper], [url_resolver_1.UrlResolver], [renderApi.Renderer], [proto_view_factory_1.ProtoViewFactory]];
    } });
Object.defineProperty(NewCompiler.prototype.compile, "parameters", { get: function () {
        return [[lang_1.Type]];
    } });
Object.defineProperty(NewCompiler.prototype._compile, "parameters", { get: function () {
        return [[element_injector_1.DirectiveBinding]];
    } });
Object.defineProperty(NewCompiler.prototype._flattenDirectives, "parameters", { get: function () {
        return [[template_1.Template]];
    } });
Object.defineProperty(NewCompiler.prototype._flattenList, "parameters", { get: function () {
        return [[assert.genericType(collection_1.List, assert.type.any)], [assert.genericType(collection_1.List, lang_1.Type)]];
    } });
var Compiler = (function (_super) {
    __extends(Compiler, _super);
    function Compiler(changeDetection, templateLoader, reader, parser, cache, shadowDomStrategy, templateResolver, componentUrlMapper, urlResolver) {
        _super.call(this, reader, cache, templateResolver, componentUrlMapper, urlResolver, new direct_dom_renderer_1.DirectDomRenderer(new rc.Compiler(new compile_step_factory_1.DefaultStepFactory(parser, shadowDomStrategy.render), templateLoader), null, null), new proto_view_factory_1.ProtoViewFactory(changeDetection, shadowDomStrategy));
    }
    return Compiler;
})(NewCompiler);
exports.Compiler = Compiler;
Object.defineProperty(Compiler, "annotations", { get: function () {
        return [new di_1.Injectable()];
    } });
Object.defineProperty(Compiler, "parameters", { get: function () {
        return [[change_detection_1.ChangeDetection], [template_loader_1.TemplateLoader], [directive_metadata_reader_1.DirectiveMetadataReader], [change_detection_1.Parser], [CompilerCache], [shadow_dom_strategy_1.ShadowDomStrategy], [template_resolver_1.TemplateResolver], [component_url_mapper_1.ComponentUrlMapper], [url_resolver_1.UrlResolver]];
    } });
