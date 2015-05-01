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
var test_lib_1 = require('angular2/test_lib');
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var async_1 = require('angular2/src/facade/async');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var change_detection_1 = require('angular2/change_detection');
var direct_dom_renderer_1 = require('angular2/src/render/dom/direct_dom_renderer');
var compiler_1 = require('angular2/src/render/dom/compiler/compiler');
var api_1 = require('angular2/src/render/api');
var compile_step_factory_1 = require('angular2/src/render/dom/compiler/compile_step_factory');
var template_loader_1 = require('angular2/src/render/dom/compiler/template_loader');
var url_resolver_1 = require('angular2/src/services/url_resolver');
var emulated_unscoped_shadow_dom_strategy_1 = require('angular2/src/render/dom/shadow_dom/emulated_unscoped_shadow_dom_strategy');
var event_manager_1 = require('angular2/src/render/dom/events/event_manager');
var vm_turn_zone_1 = require('angular2/src/core/zone/vm_turn_zone');
var style_url_resolver_1 = require('angular2/src/render/dom/shadow_dom/style_url_resolver');
var view_factory_1 = require('angular2/src/render/dom/view/view_factory');
var IntegrationTestbed = (function () {
    function IntegrationTestbed(_a) {
        var _this = this;
        var urlData = _a.urlData, viewCacheCapacity = _a.viewCacheCapacity, shadowDomStrategy = _a.shadowDomStrategy, templates = _a.templates;
        this._templates = collection_1.MapWrapper.create();
        if (lang_1.isPresent(templates)) {
            collection_1.ListWrapper.forEach(templates, function (template) {
                collection_1.MapWrapper.set(_this._templates, template.componentId, template);
            });
        }
        this._compileCache = collection_1.MapWrapper.create();
        var parser = new change_detection_1.Parser(new change_detection_1.Lexer());
        var urlResolver = new url_resolver_1.UrlResolver();
        if (lang_1.isBlank(shadowDomStrategy)) {
            shadowDomStrategy = new emulated_unscoped_shadow_dom_strategy_1.EmulatedUnscopedShadowDomStrategy(new style_url_resolver_1.StyleUrlResolver(urlResolver), null);
        }
        var compiler = new compiler_1.Compiler(new compile_step_factory_1.DefaultStepFactory(parser, shadowDomStrategy), new FakeTemplateLoader(urlResolver, urlData));
        if (lang_1.isBlank(viewCacheCapacity)) {
            viewCacheCapacity = 1;
        }
        if (lang_1.isBlank(urlData)) {
            urlData = collection_1.MapWrapper.create();
        }
        this.eventPlugin = new FakeEventManagerPlugin();
        var eventManager = new event_manager_1.EventManager([this.eventPlugin], new FakeVmTurnZone());
        var viewFactory = new view_factory_1.ViewFactory(viewCacheCapacity, eventManager, shadowDomStrategy);
        this.renderer = new direct_dom_renderer_1.DirectDomRenderer(compiler, viewFactory, shadowDomStrategy);
        this.rootEl = test_lib_1.el('<div></div>');
        this.rootProtoViewRef = this.renderer.createRootProtoView(this.rootEl);
    }
    IntegrationTestbed.prototype.compile = function (templateHtml, directives) {
        var _this = this;
        return this._compileRecurse(new api_1.Template({
            componentId: 'root',
            inline: templateHtml,
            directives: directives
        })).then(function (protoViewRefs) {
            return _this._flattenList([_this.renderer.mergeChildComponentProtoViews(_this.rootProtoViewRef, [protoViewRefs[0]]), protoViewRefs]);
        });
    };
    IntegrationTestbed.prototype._compileRecurse = function (template) {
        var _this = this;
        var result = collection_1.MapWrapper.get(this._compileCache, template.componentId);
        if (lang_1.isPresent(result)) {
            return result;
        }
        result = this.renderer.compile(template).then(function (pv) {
            var childComponentPromises = collection_1.ListWrapper.map(_this._findNestedComponentIds(template, pv), function (componentId) {
                var childTemplate = collection_1.MapWrapper.get(_this._templates, componentId);
                if (lang_1.isBlank(childTemplate)) {
                    throw new lang_1.BaseException("Could not find template for " + componentId + "!");
                }
                return _this._compileRecurse(childTemplate);
            });
            return async_1.PromiseWrapper.all(childComponentPromises).then(function (protoViewRefsWithChildren) {
                var protoViewRefs = collection_1.ListWrapper.map(protoViewRefsWithChildren, function (arr) { return arr[0]; });
                return _this._flattenList([_this.renderer.mergeChildComponentProtoViews(pv.render, protoViewRefs), protoViewRefsWithChildren]);
            });
        });
        collection_1.MapWrapper.set(this._compileCache, template.componentId, result);
        return result;
    };
    IntegrationTestbed.prototype._findNestedComponentIds = function (template, pv, target) {
        if (target === void 0) { target = null; }
        if (lang_1.isBlank(target)) {
            target = [];
        }
        for (var binderIdx = 0; binderIdx < pv.elementBinders.length; binderIdx++) {
            var eb = pv.elementBinders[binderIdx];
            var componentDirective;
            collection_1.ListWrapper.forEach(eb.directives, function (db) {
                var meta = template.directives[db.directiveIndex];
                if (meta.type === api_1.DirectiveMetadata.COMPONENT_TYPE) {
                    componentDirective = meta;
                }
            });
            if (lang_1.isPresent(componentDirective)) {
                collection_1.ListWrapper.push(target, componentDirective.id);
            }
            else if (lang_1.isPresent(eb.nestedProtoView)) {
                this._findNestedComponentIds(template, eb.nestedProtoView, target);
            }
        }
        return target;
    };
    IntegrationTestbed.prototype._flattenList = function (tree, out) {
        if (out === void 0) { out = null; }
        if (lang_1.isBlank(out)) {
            out = [];
        }
        for (var i = 0; i < tree.length; i++) {
            var item = tree[i];
            if (collection_1.ListWrapper.isList(item)) {
                this._flattenList(item, out);
            }
            else {
                collection_1.ListWrapper.push(out, item);
            }
        }
        return out;
    };
    return IntegrationTestbed;
})();
exports.IntegrationTestbed = IntegrationTestbed;
Object.defineProperty(IntegrationTestbed.prototype._flattenList, "parameters", { get: function () {
        return [[collection_1.List], [collection_1.List]];
    } });
var FakeTemplateLoader = (function (_super) {
    __extends(FakeTemplateLoader, _super);
    function FakeTemplateLoader(urlResolver, urlData) {
        _super.call(this, null, urlResolver);
        this._urlData = urlData;
    }
    FakeTemplateLoader.prototype.load = function (template) {
        if (lang_1.isPresent(template.inline)) {
            return async_1.PromiseWrapper.resolve(dom_adapter_1.DOM.createTemplate(template.inline));
        }
        if (lang_1.isPresent(template.absUrl)) {
            var content = this._urlData[template.absUrl];
            if (lang_1.isPresent(content)) {
                return async_1.PromiseWrapper.resolve(dom_adapter_1.DOM.createTemplate(content));
            }
        }
        return async_1.PromiseWrapper.reject('Load failed');
    };
    return FakeTemplateLoader;
})(template_loader_1.TemplateLoader);
Object.defineProperty(FakeTemplateLoader.prototype.load, "parameters", { get: function () {
        return [[api_1.Template]];
    } });
var FakeVmTurnZone = (function (_super) {
    __extends(FakeVmTurnZone, _super);
    function FakeVmTurnZone() {
        _super.call(this, { enableLongStackTrace: false });
    }
    FakeVmTurnZone.prototype.run = function (fn) {
        fn();
    };
    FakeVmTurnZone.prototype.runOutsideAngular = function (fn) {
        fn();
    };
    return FakeVmTurnZone;
})(vm_turn_zone_1.VmTurnZone);
exports.FakeVmTurnZone = FakeVmTurnZone;
var FakeEventManagerPlugin = (function (_super) {
    __extends(FakeEventManagerPlugin, _super);
    function FakeEventManagerPlugin() {
        _super.call(this);
        this._eventHandlers = collection_1.MapWrapper.create();
    }
    FakeEventManagerPlugin.prototype.dispatchEvent = function (eventName, event) {
        collection_1.MapWrapper.get(this._eventHandlers, eventName)(event);
    };
    FakeEventManagerPlugin.prototype.supports = function (eventName) {
        return true;
    };
    FakeEventManagerPlugin.prototype.addEventListener = function (element, eventName, handler, shouldSupportBubble) {
        collection_1.MapWrapper.set(this._eventHandlers, eventName, handler);
    };
    return FakeEventManagerPlugin;
})(event_manager_1.EventManagerPlugin);
exports.FakeEventManagerPlugin = FakeEventManagerPlugin;
Object.defineProperty(FakeEventManagerPlugin.prototype.supports, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(FakeEventManagerPlugin.prototype.addEventListener, "parameters", { get: function () {
        return [[], [assert.type.string], [Function], [assert.type.boolean]];
    } });
var LoggingEventDispatcher = (function (_super) {
    __extends(LoggingEventDispatcher, _super);
    function LoggingEventDispatcher() {
        _super.call(this);
        this.log = [];
    }
    LoggingEventDispatcher.prototype.dispatchEvent = function (elementIndex, eventName, locals) {
        collection_1.ListWrapper.push(this.log, [elementIndex, eventName, locals]);
    };
    return LoggingEventDispatcher;
})(api_1.EventDispatcher);
exports.LoggingEventDispatcher = LoggingEventDispatcher;
Object.defineProperty(LoggingEventDispatcher.prototype.dispatchEvent, "parameters", { get: function () {
        return [[assert.type.number], [assert.type.string], [assert.genericType(collection_1.List, assert.type.any)]];
    } });
var FakeEvent = (function () {
    function FakeEvent(target) {
        this.target = target;
    }
    return FakeEvent;
})();
exports.FakeEvent = FakeEvent;
