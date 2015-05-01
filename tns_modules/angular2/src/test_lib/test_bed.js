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
var lang_2 = require('angular2/src/facade/lang');
var template_1 = require('angular2/src/core/annotations/template');
var template_resolver_1 = require('angular2/src/core/compiler/template_resolver');
var compiler_1 = require('angular2/src/core/compiler/compiler');
var view_1 = require('angular2/src/core/compiler/view');
var event_manager_1 = require('angular2/src/render/dom/events/event_manager');
var utils_1 = require('./utils');
var lang_utils_1 = require('./lang_utils');
var TestBed = (function () {
    function TestBed(injector) {
        this._injector = injector;
    }
    TestBed.prototype.overrideTemplate = function (component, template) {
        this._injector.get(template_resolver_1.TemplateResolver).setTemplate(component, template);
    };
    TestBed.prototype.setInlineTemplate = function (component, html) {
        this._injector.get(template_resolver_1.TemplateResolver).setInlineTemplate(component, html);
    };
    TestBed.prototype.overrideDirective = function (component, from, to) {
        this._injector.get(template_resolver_1.TemplateResolver).overrideTemplateDirective(component, from, to);
    };
    TestBed.prototype.createView = function (component, _a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, _c = _b.context, context = _c === void 0 ? null : _c, _d = _b.html, html = _d === void 0 ? null : _d;
        if (lang_2.isBlank(component) && lang_2.isBlank(context)) {
            throw new lang_1.BaseException('You must specified at least a component or a context');
        }
        if (lang_2.isBlank(component)) {
            component = lang_utils_1.getTypeOf(context);
        }
        else if (lang_2.isBlank(context)) {
            context = lang_utils_1.instantiateType(component);
        }
        if (lang_1.isPresent(html)) {
            this.setInlineTemplate(component, html);
        }
        return this._injector.get(compiler_1.Compiler).compile(component).then(function (pv) {
            var eventManager = _this._injector.get(event_manager_1.EventManager);
            var view = pv.instantiate(null, eventManager);
            view.hydrate(_this._injector, null, null, context, null);
            return new ViewProxy(view);
        });
    };
    return TestBed;
})();
exports.TestBed = TestBed;
Object.defineProperty(TestBed, "parameters", { get: function () {
        return [[di_1.Injector]];
    } });
Object.defineProperty(TestBed.prototype.overrideTemplate, "parameters", { get: function () {
        return [[lang_1.Type], [template_1.Template]];
    } });
Object.defineProperty(TestBed.prototype.setInlineTemplate, "parameters", { get: function () {
        return [[lang_1.Type], [assert.type.string]];
    } });
Object.defineProperty(TestBed.prototype.overrideDirective, "parameters", { get: function () {
        return [[lang_1.Type], [lang_1.Type], [lang_1.Type]];
    } });
Object.defineProperty(TestBed.prototype.createView, "parameters", { get: function () {
        return [[lang_1.Type], []];
    } });
var ViewProxy = (function () {
    function ViewProxy(view) {
        this._view = view;
    }
    Object.defineProperty(ViewProxy.prototype, "context", {
        get: function () {
            return this._view.context;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewProxy.prototype, "nodes", {
        get: function () {
            return this._view.nodes;
        },
        enumerable: true,
        configurable: true
    });
    ViewProxy.prototype.detectChanges = function () {
        this._view.changeDetector.detectChanges();
    };
    ViewProxy.prototype.querySelector = function (selector) {
        return utils_1.queryView(this._view, selector);
    };
    Object.defineProperty(ViewProxy.prototype, "rawView", {
        get: function () {
            return this._view;
        },
        enumerable: true,
        configurable: true
    });
    return ViewProxy;
})();
exports.ViewProxy = ViewProxy;
Object.defineProperty(ViewProxy, "parameters", { get: function () {
        return [[view_1.View]];
    } });
