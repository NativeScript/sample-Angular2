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
exports.DOM;
function setRootDomAdapter(adapter) {
    exports.DOM = adapter;
}
exports.setRootDomAdapter = setRootDomAdapter;
Object.defineProperty(setRootDomAdapter, "parameters", { get: function () {
        return [[DomAdapter]];
    } });
function _abstract() {
    return new lang_1.BaseException('This method is abstract');
}
var DomAdapter = (function () {
    function DomAdapter() {
    }
    Object.defineProperty(DomAdapter.prototype, "attrToPropMap", {
        get: function () {
            throw _abstract();
        },
        enumerable: true,
        configurable: true
    });
    DomAdapter.prototype.parse = function (templateHtml) {
        throw _abstract();
    };
    DomAdapter.prototype.query = function (selector) {
        throw _abstract();
    };
    DomAdapter.prototype.querySelector = function (el, selector) {
        throw _abstract();
    };
    DomAdapter.prototype.querySelectorAll = function (el, selector) {
        throw _abstract();
    };
    DomAdapter.prototype.on = function (el, evt, listener) {
        throw _abstract();
    };
    DomAdapter.prototype.dispatchEvent = function (el, evt) {
        throw _abstract();
    };
    DomAdapter.prototype.createMouseEvent = function (eventType) {
        throw _abstract();
    };
    DomAdapter.prototype.createEvent = function (eventType) {
        throw _abstract();
    };
    DomAdapter.prototype.getInnerHTML = function (el) {
        throw _abstract();
    };
    DomAdapter.prototype.getOuterHTML = function (el) {
        throw _abstract();
    };
    DomAdapter.prototype.nodeName = function (node) {
        throw _abstract();
    };
    DomAdapter.prototype.nodeValue = function (node) {
        throw _abstract();
    };
    DomAdapter.prototype.type = function (node) {
        throw _abstract();
    };
    DomAdapter.prototype.content = function (node) {
        throw _abstract();
    };
    DomAdapter.prototype.firstChild = function (el) {
        throw _abstract();
    };
    DomAdapter.prototype.nextSibling = function (el) {
        throw _abstract();
    };
    DomAdapter.prototype.parentElement = function (el) {
        throw _abstract();
    };
    DomAdapter.prototype.childNodes = function (el) {
        throw _abstract();
    };
    DomAdapter.prototype.childNodesAsList = function (el) {
        throw _abstract();
    };
    DomAdapter.prototype.clearNodes = function (el) {
        throw _abstract();
    };
    DomAdapter.prototype.appendChild = function (el, node) {
        throw _abstract();
    };
    DomAdapter.prototype.removeChild = function (el, node) {
        throw _abstract();
    };
    DomAdapter.prototype.replaceChild = function (el, newNode, oldNode) {
        throw _abstract();
    };
    DomAdapter.prototype.remove = function (el) {
        throw _abstract();
    };
    DomAdapter.prototype.insertBefore = function (el, node) {
        throw _abstract();
    };
    DomAdapter.prototype.insertAllBefore = function (el, nodes) {
        throw _abstract();
    };
    DomAdapter.prototype.insertAfter = function (el, node) {
        throw _abstract();
    };
    DomAdapter.prototype.setInnerHTML = function (el, value) {
        throw _abstract();
    };
    DomAdapter.prototype.getText = function (el) {
        throw _abstract();
    };
    DomAdapter.prototype.setText = function (el, value) {
        throw _abstract();
    };
    DomAdapter.prototype.getValue = function (el) {
        throw _abstract();
    };
    DomAdapter.prototype.setValue = function (el, value) {
        throw _abstract();
    };
    DomAdapter.prototype.getChecked = function (el) {
        throw _abstract();
    };
    DomAdapter.prototype.setChecked = function (el, value) {
        throw _abstract();
    };
    DomAdapter.prototype.createTemplate = function (html) {
        throw _abstract();
    };
    DomAdapter.prototype.createElement = function (tagName, doc) {
        if (doc === void 0) { doc = null; }
        throw _abstract();
    };
    DomAdapter.prototype.createTextNode = function (text, doc) {
        if (doc === void 0) { doc = null; }
        throw _abstract();
    };
    DomAdapter.prototype.createScriptTag = function (attrName, attrValue, doc) {
        if (doc === void 0) { doc = null; }
        throw _abstract();
    };
    DomAdapter.prototype.createStyleElement = function (css, doc) {
        if (doc === void 0) { doc = null; }
        throw _abstract();
    };
    DomAdapter.prototype.createShadowRoot = function (el) {
        throw _abstract();
    };
    DomAdapter.prototype.getShadowRoot = function (el) {
        throw _abstract();
    };
    DomAdapter.prototype.getHost = function (el) {
        throw _abstract();
    };
    DomAdapter.prototype.getDistributedNodes = function (el) {
        throw _abstract();
    };
    DomAdapter.prototype.clone = function (node) {
        throw _abstract();
    };
    DomAdapter.prototype.hasProperty = function (element, name) {
        throw _abstract();
    };
    DomAdapter.prototype.getElementsByClassName = function (element, name) {
        throw _abstract();
    };
    DomAdapter.prototype.getElementsByTagName = function (element, name) {
        throw _abstract();
    };
    DomAdapter.prototype.classList = function (element) {
        throw _abstract();
    };
    DomAdapter.prototype.addClass = function (element, classname) {
        throw _abstract();
    };
    DomAdapter.prototype.removeClass = function (element, classname) {
        throw _abstract();
    };
    DomAdapter.prototype.hasClass = function (element, classname) {
        throw _abstract();
    };
    DomAdapter.prototype.setStyle = function (element, stylename, stylevalue) {
        throw _abstract();
    };
    DomAdapter.prototype.removeStyle = function (element, stylename) {
        throw _abstract();
    };
    DomAdapter.prototype.getStyle = function (element, stylename) {
        throw _abstract();
    };
    DomAdapter.prototype.tagName = function (element) {
        throw _abstract();
    };
    DomAdapter.prototype.attributeMap = function (element) {
        throw _abstract();
    };
    DomAdapter.prototype.getAttribute = function (element, attribute) {
        throw _abstract();
    };
    DomAdapter.prototype.setAttribute = function (element, name, value) {
        throw _abstract();
    };
    DomAdapter.prototype.removeAttribute = function (element, attribute) {
        throw _abstract();
    };
    DomAdapter.prototype.templateAwareRoot = function (el) {
        throw _abstract();
    };
    DomAdapter.prototype.createHtmlDocument = function () {
        throw _abstract();
    };
    DomAdapter.prototype.defaultDoc = function () {
        throw _abstract();
    };
    DomAdapter.prototype.getTitle = function () {
        throw _abstract();
    };
    DomAdapter.prototype.setTitle = function (newTitle) {
        throw _abstract();
    };
    DomAdapter.prototype.elementMatches = function (n, selector) {
        throw _abstract();
    };
    DomAdapter.prototype.isTemplateElement = function (el) {
        throw _abstract();
    };
    DomAdapter.prototype.isTextNode = function (node) {
        throw _abstract();
    };
    DomAdapter.prototype.isCommentNode = function (node) {
        throw _abstract();
    };
    DomAdapter.prototype.isElementNode = function (node) {
        throw _abstract();
    };
    DomAdapter.prototype.hasShadowRoot = function (node) {
        throw _abstract();
    };
    DomAdapter.prototype.isShadowRoot = function (node) {
        throw _abstract();
    };
    DomAdapter.prototype.importIntoDoc = function (node) {
        throw _abstract();
    };
    DomAdapter.prototype.isPageRule = function (rule) {
        throw _abstract();
    };
    DomAdapter.prototype.isStyleRule = function (rule) {
        throw _abstract();
    };
    DomAdapter.prototype.isMediaRule = function (rule) {
        throw _abstract();
    };
    DomAdapter.prototype.isKeyframesRule = function (rule) {
        throw _abstract();
    };
    DomAdapter.prototype.getHref = function (element) {
        throw _abstract();
    };
    DomAdapter.prototype.resolveAndSetHref = function (element, baseUrl, href) {
        throw _abstract();
    };
    DomAdapter.prototype.cssToRules = function (css) {
        throw _abstract();
    };
    DomAdapter.prototype.supportsDOMEvents = function () {
        throw _abstract();
    };
    DomAdapter.prototype.supportsNativeShadowDOM = function () {
        throw _abstract();
    };
    return DomAdapter;
})();
exports.DomAdapter = DomAdapter;
Object.defineProperty(DomAdapter, "annotations", { get: function () {
        return [new lang_1.ABSTRACT()];
    } });
Object.defineProperty(DomAdapter.prototype.parse, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(DomAdapter.prototype.query, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(DomAdapter.prototype.querySelector, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(DomAdapter.prototype.querySelectorAll, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(DomAdapter.prototype.setText, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(DomAdapter.prototype.setValue, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(DomAdapter.prototype.setChecked, "parameters", { get: function () {
        return [[], [assert.type.boolean]];
    } });
Object.defineProperty(DomAdapter.prototype.createTextNode, "parameters", { get: function () {
        return [[assert.type.string], []];
    } });
Object.defineProperty(DomAdapter.prototype.createScriptTag, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string], []];
    } });
Object.defineProperty(DomAdapter.prototype.createStyleElement, "parameters", { get: function () {
        return [[assert.type.string], []];
    } });
Object.defineProperty(DomAdapter.prototype.hasProperty, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(DomAdapter.prototype.getElementsByClassName, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(DomAdapter.prototype.getElementsByTagName, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(DomAdapter.prototype.addClass, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(DomAdapter.prototype.removeClass, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(DomAdapter.prototype.hasClass, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(DomAdapter.prototype.setStyle, "parameters", { get: function () {
        return [[], [assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(DomAdapter.prototype.removeStyle, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(DomAdapter.prototype.getStyle, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(DomAdapter.prototype.getAttribute, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(DomAdapter.prototype.setAttribute, "parameters", { get: function () {
        return [[], [assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(DomAdapter.prototype.removeAttribute, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(DomAdapter.prototype.setTitle, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(DomAdapter.prototype.elementMatches, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(DomAdapter.prototype.isTemplateElement, "parameters", { get: function () {
        return [[assert.type.any]];
    } });
Object.defineProperty(DomAdapter.prototype.resolveAndSetHref, "parameters", { get: function () {
        return [[], [assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(DomAdapter.prototype.cssToRules, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
