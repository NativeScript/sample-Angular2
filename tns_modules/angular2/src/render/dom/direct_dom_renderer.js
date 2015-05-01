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
var api = require('../api');
var view_1 = require('./view/view');
var proto_view_1 = require('./view/proto_view');
var view_factory_1 = require('./view/view_factory');
var compiler_1 = require('./compiler/compiler');
var shadow_dom_strategy_1 = require('./shadow_dom/shadow_dom_strategy');
var proto_view_builder_1 = require('./view/proto_view_builder');
function _resolveViewContainer(vc) {
    return _resolveView(vc.view).viewContainers[vc.elementIndex];
}
Object.defineProperty(_resolveViewContainer, "parameters", { get: function () {
        return [[api.ViewContainerRef]];
    } });
function _resolveView(viewRef) {
    return lang_1.isPresent(viewRef) ? viewRef.delegate : null;
}
Object.defineProperty(_resolveView, "parameters", { get: function () {
        return [[_DirectDomViewRef]];
    } });
function _resolveProtoView(protoViewRef) {
    return lang_1.isPresent(protoViewRef) ? protoViewRef.delegate : null;
}
Object.defineProperty(_resolveProtoView, "parameters", { get: function () {
        return [[DirectDomProtoViewRef]];
    } });
function _wrapView(view) {
    return new _DirectDomViewRef(view);
}
Object.defineProperty(_wrapView, "parameters", { get: function () {
        return [[view_1.View]];
    } });
function _wrapProtoView(protoView) {
    return new DirectDomProtoViewRef(protoView);
}
Object.defineProperty(_wrapProtoView, "parameters", { get: function () {
        return [[proto_view_1.ProtoView]];
    } });
function _collectComponentChildViewRefs(view, target) {
    if (target === void 0) { target = null; }
    if (lang_1.isBlank(target)) {
        target = [];
    }
    collection_1.ListWrapper.push(target, _wrapView(view));
    collection_1.ListWrapper.forEach(view.componentChildViews, function (view) {
        if (lang_1.isPresent(view)) {
            _collectComponentChildViewRefs(view, target);
        }
    });
    return target;
}
var DirectDomProtoViewRef = (function (_super) {
    __extends(DirectDomProtoViewRef, _super);
    function DirectDomProtoViewRef(delegate) {
        _super.call(this);
        this.delegate = delegate;
    }
    return DirectDomProtoViewRef;
})(api.ProtoViewRef);
exports.DirectDomProtoViewRef = DirectDomProtoViewRef;
Object.defineProperty(DirectDomProtoViewRef, "parameters", { get: function () {
        return [[proto_view_1.ProtoView]];
    } });
var _DirectDomViewRef = (function (_super) {
    __extends(_DirectDomViewRef, _super);
    function _DirectDomViewRef(delegate) {
        _super.call(this);
        this.delegate = delegate;
    }
    return _DirectDomViewRef;
})(api.ViewRef);
Object.defineProperty(_DirectDomViewRef, "parameters", { get: function () {
        return [[view_1.View]];
    } });
var DirectDomRenderer = (function (_super) {
    __extends(DirectDomRenderer, _super);
    function DirectDomRenderer(compiler, viewFactory, shadowDomStrategy) {
        _super.call(this);
        this._compiler = compiler;
        this._viewFactory = viewFactory;
        this._shadowDomStrategy = shadowDomStrategy;
    }
    DirectDomRenderer.prototype.compile = function (template) {
        return this._compiler.compile(template);
    };
    DirectDomRenderer.prototype.mergeChildComponentProtoViews = function (protoViewRef, protoViewRefs) {
        var protoViews = [];
        _resolveProtoView(protoViewRef).mergeChildComponentProtoViews(collection_1.ListWrapper.map(protoViewRefs, _resolveProtoView), protoViews);
        return collection_1.ListWrapper.map(protoViews, _wrapProtoView);
    };
    DirectDomRenderer.prototype.createRootProtoView = function (selectorOrElement) {
        var element = selectorOrElement;
        var rootProtoViewBuilder = new proto_view_builder_1.ProtoViewBuilder(element);
        rootProtoViewBuilder.setIsRootView(true);
        rootProtoViewBuilder.bindElement(element, 'root element').setComponentId('root');
        this._shadowDomStrategy.processElement(null, 'root', element);
        return rootProtoViewBuilder.build().render;
    };
    DirectDomRenderer.prototype.createView = function (protoViewRef) {
        return _collectComponentChildViewRefs(this._viewFactory.getView(_resolveProtoView(protoViewRef)));
    };
    DirectDomRenderer.prototype.destroyView = function (viewRef) {
        this._viewFactory.returnView(_resolveView(viewRef));
    };
    DirectDomRenderer.prototype.insertViewIntoContainer = function (vcRef, viewRef, atIndex) {
        if (atIndex === void 0) { atIndex = -1; }
        _resolveViewContainer(vcRef).insert(_resolveView(viewRef), atIndex);
    };
    DirectDomRenderer.prototype.detachViewFromContainer = function (vcRef, atIndex) {
        _resolveViewContainer(vcRef).detach(atIndex);
    };
    DirectDomRenderer.prototype.setElementProperty = function (viewRef, elementIndex, propertyName, propertyValue) {
        _resolveView(viewRef).setElementProperty(elementIndex, propertyName, propertyValue);
    };
    DirectDomRenderer.prototype.setDynamicComponentView = function (viewRef, elementIndex, nestedViewRef) {
        _resolveView(viewRef).setComponentView(this._shadowDomStrategy, elementIndex, _resolveView(nestedViewRef));
    };
    DirectDomRenderer.prototype.setText = function (viewRef, textNodeIndex, text) {
        _resolveView(viewRef).setText(textNodeIndex, text);
    };
    DirectDomRenderer.prototype.setEventDispatcher = function (viewRef, dispatcher) {
        _resolveView(viewRef).setEventDispatcher(dispatcher);
    };
    return DirectDomRenderer;
})(api.Renderer);
exports.DirectDomRenderer = DirectDomRenderer;
Object.defineProperty(DirectDomRenderer, "parameters", { get: function () {
        return [[compiler_1.Compiler], [view_factory_1.ViewFactory], [shadow_dom_strategy_1.ShadowDomStrategy]];
    } });
Object.defineProperty(DirectDomRenderer.prototype.compile, "parameters", { get: function () {
        return [[api.Template]];
    } });
Object.defineProperty(DirectDomRenderer.prototype.mergeChildComponentProtoViews, "parameters", { get: function () {
        return [[api.ProtoViewRef], [assert.genericType(collection_1.List, api.ProtoViewRef)]];
    } });
Object.defineProperty(DirectDomRenderer.prototype.createView, "parameters", { get: function () {
        return [[api.ProtoViewRef]];
    } });
Object.defineProperty(DirectDomRenderer.prototype.destroyView, "parameters", { get: function () {
        return [[api.ViewRef]];
    } });
Object.defineProperty(DirectDomRenderer.prototype.insertViewIntoContainer, "parameters", { get: function () {
        return [[api.ViewContainerRef], [api.ViewRef], []];
    } });
Object.defineProperty(DirectDomRenderer.prototype.detachViewFromContainer, "parameters", { get: function () {
        return [[api.ViewContainerRef], [assert.type.number]];
    } });
Object.defineProperty(DirectDomRenderer.prototype.setElementProperty, "parameters", { get: function () {
        return [[api.ViewRef], [assert.type.number], [assert.type.string], [assert.type.any]];
    } });
Object.defineProperty(DirectDomRenderer.prototype.setDynamicComponentView, "parameters", { get: function () {
        return [[api.ViewRef], [assert.type.number], [api.ViewRef]];
    } });
Object.defineProperty(DirectDomRenderer.prototype.setText, "parameters", { get: function () {
        return [[api.ViewRef], [assert.type.number], [assert.type.string]];
    } });
Object.defineProperty(DirectDomRenderer.prototype.setEventDispatcher, "parameters", { get: function () {
        return [[api.ViewRef], [api.EventDispatcher]];
    } });
