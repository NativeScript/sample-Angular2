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
var async_1 = require('angular2/src/facade/async');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var compile_step_1 = require('../compiler/compile_step');
var compile_element_1 = require('../compiler/compile_element');
var compile_control_1 = require('../compiler/compile_control');
var api_1 = require('../../api');
var shadow_dom_strategy_1 = require('./shadow_dom_strategy');
var ShadowDomCompileStep = (function (_super) {
    __extends(ShadowDomCompileStep, _super);
    function ShadowDomCompileStep(shadowDomStrategy, template, subTaskPromises) {
        _super.call(this);
        this._shadowDomStrategy = shadowDomStrategy;
        this._template = template;
        this._subTaskPromises = subTaskPromises;
    }
    ShadowDomCompileStep.prototype.process = function (parent, current, control) {
        if (current.ignoreBindings) {
            return;
        }
        var tagName = dom_adapter_1.DOM.tagName(current.element).toUpperCase();
        if (tagName == 'STYLE') {
            this._processStyleElement(current);
        }
        else if (tagName == 'CONTENT') {
            this._processContentElement(current);
        }
        else {
            var componentId = current.isBound() ? current.inheritedElementBinder.componentId : null;
            this._shadowDomStrategy.processElement(this._template.componentId, componentId, current.element);
        }
    };
    ShadowDomCompileStep.prototype._processStyleElement = function (current) {
        current.ignoreBindings = true;
        var stylePromise = this._shadowDomStrategy.processStyleElement(this._template.componentId, this._template.absUrl, current.element);
        if (lang_1.isPresent(stylePromise) && async_1.PromiseWrapper.isPromise(stylePromise)) {
            collection_1.ListWrapper.push(this._subTaskPromises, stylePromise);
        }
    };
    ShadowDomCompileStep.prototype._processContentElement = function (current) {
        if (this._shadowDomStrategy.hasNativeContentElement()) {
            return;
        }
        var attrs = current.attrs();
        var selector = collection_1.MapWrapper.get(attrs, 'select');
        selector = lang_1.isPresent(selector) ? selector : '';
        var contentStart = dom_adapter_1.DOM.createScriptTag('type', 'ng/contentStart');
        if (lang_1.assertionsEnabled()) {
            dom_adapter_1.DOM.setAttribute(contentStart, 'select', selector);
        }
        var contentEnd = dom_adapter_1.DOM.createScriptTag('type', 'ng/contentEnd');
        dom_adapter_1.DOM.insertBefore(current.element, contentStart);
        dom_adapter_1.DOM.insertBefore(current.element, contentEnd);
        dom_adapter_1.DOM.remove(current.element);
        current.element = contentStart;
        current.bindElement().setContentTagSelector(selector);
    };
    return ShadowDomCompileStep;
})(compile_step_1.CompileStep);
exports.ShadowDomCompileStep = ShadowDomCompileStep;
Object.defineProperty(ShadowDomCompileStep, "parameters", { get: function () {
        return [[shadow_dom_strategy_1.ShadowDomStrategy], [api_1.Template], [assert.genericType(collection_1.List, async_1.Promise)]];
    } });
Object.defineProperty(ShadowDomCompileStep.prototype.process, "parameters", { get: function () {
        return [[compile_element_1.CompileElement], [compile_element_1.CompileElement], [compile_control_1.CompileControl]];
    } });
