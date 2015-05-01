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
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var shadow_css_1 = require('./shadow_css');
function moveViewNodesIntoParent(parent, view) {
    for (var i = 0; i < view.rootNodes.length; ++i) {
        dom_adapter_1.DOM.appendChild(parent, view.rootNodes[i]);
    }
}
exports.moveViewNodesIntoParent = moveViewNodesIntoParent;
var _componentUIDs = collection_1.MapWrapper.create();
var _nextComponentUID = 0;
var _sharedStyleTexts = collection_1.MapWrapper.create();
var _lastInsertedStyleEl;
function getComponentId(componentStringId) {
    var id = collection_1.MapWrapper.get(_componentUIDs, componentStringId);
    if (lang_1.isBlank(id)) {
        id = _nextComponentUID++;
        collection_1.MapWrapper.set(_componentUIDs, componentStringId, id);
    }
    return id;
}
exports.getComponentId = getComponentId;
Object.defineProperty(getComponentId, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
function insertSharedStyleText(cssText, styleHost, styleEl) {
    if (!collection_1.MapWrapper.contains(_sharedStyleTexts, cssText)) {
        collection_1.MapWrapper.set(_sharedStyleTexts, cssText, true);
        insertStyleElement(styleHost, styleEl);
    }
}
exports.insertSharedStyleText = insertSharedStyleText;
function insertStyleElement(host, styleEl) {
    if (lang_1.isBlank(_lastInsertedStyleEl)) {
        var firstChild = dom_adapter_1.DOM.firstChild(host);
        if (lang_1.isPresent(firstChild)) {
            dom_adapter_1.DOM.insertBefore(firstChild, styleEl);
        }
        else {
            dom_adapter_1.DOM.appendChild(host, styleEl);
        }
    }
    else {
        dom_adapter_1.DOM.insertAfter(_lastInsertedStyleEl, styleEl);
    }
    _lastInsertedStyleEl = styleEl;
}
exports.insertStyleElement = insertStyleElement;
function getHostAttribute(id) {
    return "_nghost-" + id;
}
exports.getHostAttribute = getHostAttribute;
Object.defineProperty(getHostAttribute, "parameters", { get: function () {
        return [[lang_1.int]];
    } });
function getContentAttribute(id) {
    return "_ngcontent-" + id;
}
exports.getContentAttribute = getContentAttribute;
Object.defineProperty(getContentAttribute, "parameters", { get: function () {
        return [[lang_1.int]];
    } });
function shimCssForComponent(cssText, componentId) {
    var id = getComponentId(componentId);
    var shadowCss = new shadow_css_1.ShadowCss();
    return shadowCss.shimCssText(cssText, getContentAttribute(id), getHostAttribute(id));
}
exports.shimCssForComponent = shimCssForComponent;
Object.defineProperty(shimCssForComponent, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
function resetShadowDomCache() {
    collection_1.MapWrapper.clear(_componentUIDs);
    _nextComponentUID = 0;
    collection_1.MapWrapper.clear(_sharedStyleTexts);
    _lastInsertedStyleEl = null;
}
exports.resetShadowDomCache = resetShadowDomCache;
