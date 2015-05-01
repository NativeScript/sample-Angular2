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
var dom_adapter_1 = require('./dom_adapter');
var generic_browser_adapter_1 = require('./generic_browser_adapter');
var _attrToPropMap = {
    'innerHtml': 'innerHTML',
    'readonly': 'readOnly',
    'tabindex': 'tabIndex'
};
var BrowserDomAdapter = (function (_super) {
    __extends(BrowserDomAdapter, _super);
    function BrowserDomAdapter() {
        _super.apply(this, arguments);
    }
    BrowserDomAdapter.makeCurrent = function () {
        dom_adapter_1.setRootDomAdapter(new BrowserDomAdapter());
    };
    Object.defineProperty(BrowserDomAdapter.prototype, "attrToPropMap", {
        get: function () {
            return _attrToPropMap;
        },
        enumerable: true,
        configurable: true
    });
    BrowserDomAdapter.prototype.query = function (selector) {
        return document.querySelector(selector);
    };
    BrowserDomAdapter.prototype.querySelector = function (el, selector) {
        return el.querySelector(selector);
    };
    BrowserDomAdapter.prototype.querySelectorAll = function (el, selector) {
        return el.querySelectorAll(selector);
    };
    BrowserDomAdapter.prototype.on = function (el, evt, listener) {
        el.addEventListener(evt, listener, false);
    };
    BrowserDomAdapter.prototype.dispatchEvent = function (el, evt) {
        el.dispatchEvent(evt);
    };
    BrowserDomAdapter.prototype.createMouseEvent = function (eventType) {
        var evt = new MouseEvent(eventType);
        evt.initEvent(eventType, true, true);
        return evt;
    };
    BrowserDomAdapter.prototype.createEvent = function (eventType) {
        return new Event(eventType, true);
    };
    BrowserDomAdapter.prototype.getInnerHTML = function (el) {
        return el.innerHTML;
    };
    BrowserDomAdapter.prototype.getOuterHTML = function (el) {
        return el.outerHTML;
    };
    BrowserDomAdapter.prototype.nodeName = function (node) {
        return node.nodeName;
    };
    BrowserDomAdapter.prototype.nodeValue = function (node) {
        return node.nodeValue;
    };
    BrowserDomAdapter.prototype.type = function (node) {
        return node.type;
    };
    BrowserDomAdapter.prototype.content = function (node) {
        if (this.hasProperty(node, "content")) {
            return node.content;
        }
        else {
            return node;
        }
    };
    BrowserDomAdapter.prototype.firstChild = function (el) {
        return el.firstChild;
    };
    BrowserDomAdapter.prototype.nextSibling = function (el) {
        return el.nextSibling;
    };
    BrowserDomAdapter.prototype.parentElement = function (el) {
        return el.parentElement;
    };
    BrowserDomAdapter.prototype.childNodes = function (el) {
        return el.childNodes;
    };
    BrowserDomAdapter.prototype.childNodesAsList = function (el) {
        var childNodes = el.childNodes;
        var res = collection_1.ListWrapper.createFixedSize(childNodes.length);
        for (var i = 0; i < childNodes.length; i++) {
            res[i] = childNodes[i];
        }
        return res;
    };
    BrowserDomAdapter.prototype.clearNodes = function (el) {
        for (var i = 0; i < el.childNodes.length; i++) {
            this.remove(el.childNodes[i]);
        }
    };
    BrowserDomAdapter.prototype.appendChild = function (el, node) {
        el.appendChild(node);
    };
    BrowserDomAdapter.prototype.removeChild = function (el, node) {
        el.removeChild(node);
    };
    BrowserDomAdapter.prototype.replaceChild = function (el, newChild, oldChild) {
        el.replaceChild(newChild, oldChild);
    };
    BrowserDomAdapter.prototype.remove = function (el) {
        var parent = el.parentNode;
        parent.removeChild(el);
        return el;
    };
    BrowserDomAdapter.prototype.insertBefore = function (el, node) {
        el.parentNode.insertBefore(node, el);
    };
    BrowserDomAdapter.prototype.insertAllBefore = function (el, nodes) {
        collection_1.ListWrapper.forEach(nodes, function (n) {
            el.parentNode.insertBefore(n, el);
        });
    };
    BrowserDomAdapter.prototype.insertAfter = function (el, node) {
        el.parentNode.insertBefore(node, el.nextSibling);
    };
    BrowserDomAdapter.prototype.setInnerHTML = function (el, value) {
        el.innerHTML = value;
    };
    BrowserDomAdapter.prototype.getText = function (el) {
        return el.textContent;
    };
    BrowserDomAdapter.prototype.setText = function (el, value) {
        el.textContent = value;
    };
    BrowserDomAdapter.prototype.getValue = function (el) {
        return el.value;
    };
    BrowserDomAdapter.prototype.setValue = function (el, value) {
        el.value = value;
    };
    BrowserDomAdapter.prototype.getChecked = function (el) {
        return el.checked;
    };
    BrowserDomAdapter.prototype.setChecked = function (el, value) {
        el.checked = value;
    };
    BrowserDomAdapter.prototype.createTemplate = function (html) {
        var t = document.createElement('template');
        t.innerHTML = html;
        return t;
    };
    BrowserDomAdapter.prototype.createElement = function (tagName, doc) {
        if (doc === void 0) { doc = document; }
        return doc.createElement(tagName);
    };
    BrowserDomAdapter.prototype.createTextNode = function (text, doc) {
        if (doc === void 0) { doc = document; }
        return doc.createTextNode(text);
    };
    BrowserDomAdapter.prototype.createScriptTag = function (attrName, attrValue, doc) {
        if (doc === void 0) { doc = document; }
        var el = doc.createElement('SCRIPT');
        el.setAttribute(attrName, attrValue);
        return el;
    };
    BrowserDomAdapter.prototype.createStyleElement = function (css, doc) {
        if (doc === void 0) { doc = document; }
        var style = doc.createElement('STYLE');
        style.innerText = css;
        return style;
    };
    BrowserDomAdapter.prototype.createShadowRoot = function (el) {
        return el.createShadowRoot();
    };
    BrowserDomAdapter.prototype.getShadowRoot = function (el) {
        return el.shadowRoot;
    };
    BrowserDomAdapter.prototype.getHost = function (el) {
        return el.host;
    };
    BrowserDomAdapter.prototype.clone = function (node) {
        return node.cloneNode(true);
    };
    BrowserDomAdapter.prototype.hasProperty = function (element, name) {
        return name in element;
    };
    BrowserDomAdapter.prototype.getElementsByClassName = function (element, name) {
        return element.getElementsByClassName(name);
    };
    BrowserDomAdapter.prototype.getElementsByTagName = function (element, name) {
        return element.getElementsByTagName(name);
    };
    BrowserDomAdapter.prototype.classList = function (element) {
        return Array.prototype.slice.call(element.classList, 0);
    };
    BrowserDomAdapter.prototype.addClass = function (element, classname) {
        element.classList.add(classname);
    };
    BrowserDomAdapter.prototype.removeClass = function (element, classname) {
        element.classList.remove(classname);
    };
    BrowserDomAdapter.prototype.hasClass = function (element, classname) {
        return element.classList.contains(classname);
    };
    BrowserDomAdapter.prototype.setStyle = function (element, stylename, stylevalue) {
        element.style[stylename] = stylevalue;
    };
    BrowserDomAdapter.prototype.removeStyle = function (element, stylename) {
        element.style[stylename] = null;
    };
    BrowserDomAdapter.prototype.getStyle = function (element, stylename) {
        return element.style[stylename];
    };
    BrowserDomAdapter.prototype.tagName = function (element) {
        return element.tagName;
    };
    BrowserDomAdapter.prototype.attributeMap = function (element) {
        var res = collection_1.MapWrapper.create();
        var elAttrs = element.attributes;
        for (var i = 0; i < elAttrs.length; i++) {
            var attrib = elAttrs[i];
            collection_1.MapWrapper.set(res, attrib.name, attrib.value);
        }
        return res;
    };
    BrowserDomAdapter.prototype.getAttribute = function (element, attribute) {
        return element.getAttribute(attribute);
    };
    BrowserDomAdapter.prototype.setAttribute = function (element, name, value) {
        element.setAttribute(name, value);
    };
    BrowserDomAdapter.prototype.removeAttribute = function (element, attribute) {
        return element.removeAttribute(attribute);
    };
    BrowserDomAdapter.prototype.templateAwareRoot = function (el) {
        return this.isTemplateElement(el) ? this.content(el) : el;
    };
    BrowserDomAdapter.prototype.createHtmlDocument = function () {
        return document.implementation.createHTMLDocument('fakeTitle');
    };
    BrowserDomAdapter.prototype.defaultDoc = function () {
        return document;
    };
    BrowserDomAdapter.prototype.getTitle = function () {
        return document.title;
    };
    BrowserDomAdapter.prototype.setTitle = function (newTitle) {
        document.title = newTitle;
    };
    BrowserDomAdapter.prototype.elementMatches = function (n, selector) {
        return n instanceof HTMLElement && n.matches(selector);
    };
    BrowserDomAdapter.prototype.isTemplateElement = function (el) {
        return el instanceof HTMLElement && el.nodeName == "TEMPLATE";
    };
    BrowserDomAdapter.prototype.isTextNode = function (node) {
        return node.nodeType === Node.TEXT_NODE;
    };
    BrowserDomAdapter.prototype.isCommentNode = function (node) {
        return node.nodeType === Node.COMMENT_NODE;
    };
    BrowserDomAdapter.prototype.isElementNode = function (node) {
        return node.nodeType === Node.ELEMENT_NODE;
    };
    BrowserDomAdapter.prototype.hasShadowRoot = function (node) {
        return node instanceof HTMLElement && lang_1.isPresent(node.shadowRoot);
    };
    BrowserDomAdapter.prototype.isShadowRoot = function (node) {
        return node instanceof ShadowRoot;
    };
    BrowserDomAdapter.prototype.importIntoDoc = function (node) {
        var result = document.importNode(node, true);
        if (this.isTemplateElement(result) && !this.content(result).childNodes.length && this.content(node).childNodes.length) {
            var childNodes = this.content(node).childNodes;
            for (var i = 0; i < childNodes.length; ++i) {
                this.content(result).appendChild(this.importIntoDoc(childNodes[i]));
            }
        }
        return result;
    };
    BrowserDomAdapter.prototype.isPageRule = function (rule) {
        return rule.type === CSSRule.PAGE_RULE;
    };
    BrowserDomAdapter.prototype.isStyleRule = function (rule) {
        return rule.type === CSSRule.STYLE_RULE;
    };
    BrowserDomAdapter.prototype.isMediaRule = function (rule) {
        return rule.type === CSSRule.MEDIA_RULE;
    };
    BrowserDomAdapter.prototype.isKeyframesRule = function (rule) {
        return rule.type === CSSRule.KEYFRAMES_RULE;
    };
    BrowserDomAdapter.prototype.getHref = function (el) {
        return el.href;
    };
    return BrowserDomAdapter;
})(generic_browser_adapter_1.GenericBrowserDomAdapter);
exports.BrowserDomAdapter = BrowserDomAdapter;
Object.defineProperty(BrowserDomAdapter.prototype.query, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.querySelector, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.querySelectorAll, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.nodeName, "parameters", { get: function () {
        return [[Node]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.nodeValue, "parameters", { get: function () {
        return [[Node]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.type, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.content, "parameters", { get: function () {
        return [[HTMLElement]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.replaceChild, "parameters", { get: function () {
        return [[Node], [], []];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.setText, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.setValue, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.setChecked, "parameters", { get: function () {
        return [[], [assert.type.boolean]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.createTextNode, "parameters", { get: function () {
        return [[assert.type.string], []];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.createScriptTag, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string], []];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.createStyleElement, "parameters", { get: function () {
        return [[assert.type.string], []];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.createShadowRoot, "parameters", { get: function () {
        return [[HTMLElement]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.getShadowRoot, "parameters", { get: function () {
        return [[HTMLElement]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.getHost, "parameters", { get: function () {
        return [[HTMLElement]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.clone, "parameters", { get: function () {
        return [[Node]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.hasProperty, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.getElementsByClassName, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.getElementsByTagName, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.addClass, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.removeClass, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.hasClass, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.setStyle, "parameters", { get: function () {
        return [[], [assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.removeStyle, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.getStyle, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.getAttribute, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.setAttribute, "parameters", { get: function () {
        return [[], [assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.removeAttribute, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.setTitle, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.elementMatches, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.isTemplateElement, "parameters", { get: function () {
        return [[assert.type.any]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.isTextNode, "parameters", { get: function () {
        return [[Node]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.isCommentNode, "parameters", { get: function () {
        return [[Node]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.isElementNode, "parameters", { get: function () {
        return [[Node]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.importIntoDoc, "parameters", { get: function () {
        return [[Node]];
    } });
Object.defineProperty(BrowserDomAdapter.prototype.getHref, "parameters", { get: function () {
        return [[Element]];
    } });
