var label_1 = require("ui/label");
var button_1 = require("ui/button");
var vmModule = require("./main-view-model");
var angular2_1 = require('angular2/angular2');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var DOM = require('angular2/src/dom/dom_adapter');
var browser_adapter_1 = require('angular2/src/dom/browser_adapter');
var collection_1 = require('angular2/src/facade/collection');

var NativeScriptDomAdapter = (function (_super) {
    __extends(NativeScriptDomAdapter, _super);
    function NativeScriptDomAdapter() {
        console.log("NativeScriptDomAdapter constructor");
    }
    NativeScriptDomAdapter.prototype.defaultDoc = function () {
        console.log("defaultDoc");
        return document;
    };
    NativeScriptDomAdapter.prototype.parse = function (templateHtml) {
        console.log("parse");
    };
    Object.defineProperty(NativeScriptDomAdapter.prototype, "attrToPropMap", {
        get: function () {
            console.log("attrToPropMap");
            var _attrToPropMap = {
                'innerHtml': 'innerHTML',
                'readonly': 'readOnly',
                'tabindex': 'tabIndex'
            };
            return _attrToPropMap;
        },
        enumerable: true,
        configurable: true
    });
    NativeScriptDomAdapter.prototype.query = function (selector) {
        console.log("query", selector);
        return document.querySelector(selector);
    };
    NativeScriptDomAdapter.prototype.querySelector = function (el, selector) {
        console.log("querySelector", selector);
        return document;
    };
    NativeScriptDomAdapter.prototype.querySelectorAll = function (el, selector) {
        console.log("querySelectorAll", selector);
        return [label, button];
    };
    NativeScriptDomAdapter.prototype.on = function (el, evt, listener) {
        console.log("on", evt, listener.toString());
        el.on(evt, function () {
            console.log("tap handler");
            listener({ target: el });
        });
    };
    NativeScriptDomAdapter.prototype.dispatchEvent = function (el, evt) {
        console.log("dispatchEvent");
        el.dispatchEvent(evt);
    };
    NativeScriptDomAdapter.prototype.createMouseEvent = function (eventType) {
        console.log("createMouseEvent");
        var evt = new MouseEvent(eventType);
        evt.initEvent(eventType, true, true);
        return evt;
    };
    NativeScriptDomAdapter.prototype.createEvent = function (eventType) {
        console.log("createEvent");
        return new Event(eventType, true);
    };
    NativeScriptDomAdapter.prototype.getInnerHTML = function (el) {
        console.log("getInnerHTML");
        return el.innerHTML;
    };
    NativeScriptDomAdapter.prototype.getOuterHTML = function (el) {
        console.log("getOuterHTML");
        return el.outerHTML;
    };
    NativeScriptDomAdapter.prototype.nodeName = function (node) {
        console.log("nodeName");
        return node.nodeName;
    };
    NativeScriptDomAdapter.prototype.nodeValue = function (node) {
        console.log("nodeValue");
        return node.nodeValue;
    };
    NativeScriptDomAdapter.prototype.type = function (node) {
        console.log("type");
        return node.type;
    };
    NativeScriptDomAdapter.prototype.content = function (node) {
        console.log("content");
        if (this.hasProperty(node, "content")) {
            return node.content;
        }
        else {
            return this.childNodes(node);
        }
    };
    NativeScriptDomAdapter.prototype.firstChild = function (el) {
        console.log("firstChild", el == document);
        if (el === document) {
            return label;
        }
        return null;
    };
    NativeScriptDomAdapter.prototype.nextSibling = function (el) {
        if (el == label) {
            console.log("nextSibling label");
            return button;
        }
        if (el == button) {
            console.log("nextSibling button");
        }
        return null;
    };
    NativeScriptDomAdapter.prototype.parentElement = function (el) {
        console.log("parentElement");
        return el.parentElement;
    };
    NativeScriptDomAdapter.prototype.childNodes = function (el) {
        //TODO: childNodes for real
        if (el == label) {
            console.log("childNodes label");
            return [];
        }
        if (el == button) {
            console.log("childNodes button");
            return [];
        }
        if (el == document) {
            console.log("childNodes document");
            return [label, button];
        }
        return [];
    };
    NativeScriptDomAdapter.prototype.childNodesAsList = function (el) {
        console.log("childNodesAsList", el === label, el === document);
        var childNodes = this.childNodes(el);
        var res = collection_1.ListWrapper.createFixedSize(childNodes.length);
        for (var i = 0; i < childNodes.length; i++) {
            res[i] = childNodes[i];
        }
        return res;
    };
    NativeScriptDomAdapter.prototype.clearNodes = function (el) {
        console.log("clearNodes");
    };
    NativeScriptDomAdapter.prototype.appendChild = function (el, node) {
        console.log("appendChild");
    };
    NativeScriptDomAdapter.prototype.removeChild = function (el, node) {
        console.log("removeChild");
        el.removeChild(node);
    };
    NativeScriptDomAdapter.prototype.replaceChild = function (el, newChild, oldChild) {
        console.log("replaceChild");
        el.replaceChild(newChild, oldChild);
    };
    NativeScriptDomAdapter.prototype.remove = function (el) {
        console.log("remove");
        var parent = el.parentNode;
        parent.removeChild(el);
        return el;
    };
    NativeScriptDomAdapter.prototype.insertBefore = function (el, node) {
        console.log("insertBefore");
        el.parentNode.insertBefore(node, el);
    };
    NativeScriptDomAdapter.prototype.insertAllBefore = function (el, nodes) {
        console.log("insertAllBefore");
        collection_1.ListWrapper.forEach(nodes, function (n) {
            el.parentNode.insertBefore(n, el);
        });
    };
    NativeScriptDomAdapter.prototype.insertAfter = function (el, node) {
        console.log("insertAfter");
        el.parentNode.insertBefore(node, el.nextSibling);
    };
    NativeScriptDomAdapter.prototype.setInnerHTML = function (el, value) {
        console.log("setInnerHTML");
        el.innerHTML = value;
    };
    NativeScriptDomAdapter.prototype.getText = function (el) {
        console.log("getText");
        return el.textContent;
    };
    NativeScriptDomAdapter.prototype.setText = function (el, value) {
        console.log("setText");
        el.textContent = value;
    };
    NativeScriptDomAdapter.prototype.getValue = function (el) {
        console.log("getValue");
        return el.value;
    };
    NativeScriptDomAdapter.prototype.setValue = function (el, value) {
        console.log("setValue");
        el.value = value;
    };
    NativeScriptDomAdapter.prototype.getChecked = function (el) {
        console.log("getChecked");
        return el.checked;
    };
    NativeScriptDomAdapter.prototype.setChecked = function (el, value) {
        console.log("setChecked");
        el.checked = value;
    };
    NativeScriptDomAdapter.prototype.createTemplate = function (html) {
        console.log("createTemplate", html);
        label = new label_1.Label();
        label.text = "message";
        var stackLayout = view.getViewById(page, "stackLayout");
        stackLayout.addChild(label);
        button = new button_1.Button();
        button.text = "TAP";
        stackLayout.addChild(button);
        return document;
    };
    NativeScriptDomAdapter.prototype.createElement = function (tagName, doc) {
        if (doc === void 0) { doc = document; }
        console.log("createElement");
        return document;
    };
    NativeScriptDomAdapter.prototype.createTextNode = function (text, doc) {
        if (doc === void 0) { doc = document; }
        console.log("createTextNode");
        return doc.createTextNode(text);
    };
    NativeScriptDomAdapter.prototype.createScriptTag = function (attrName, attrValue, doc) {
        if (doc === void 0) { doc = document; }
        console.log("createScriptTag");
        var el = doc.createElement('SCRIPT');
        el.setAttribute(attrName, attrValue);
        return el;
    };
    NativeScriptDomAdapter.prototype.createStyleElement = function (css, doc) {
        if (doc === void 0) { doc = document; }
        console.log("createStyleElement");
        var style = doc.createElement('STYLE');
        style.innerText = css;
        return style;
    };
    NativeScriptDomAdapter.prototype.createShadowRoot = function (el) {
        console.log("createShadowRoot");
        return el.createShadowRoot();
    };
    NativeScriptDomAdapter.prototype.getShadowRoot = function (el) {
        console.log("getShadowRoot");
        return el.shadowRoot;
    };
    NativeScriptDomAdapter.prototype.getHost = function (el) {
        console.log("getHost");
        return el.host;
    };
    NativeScriptDomAdapter.prototype.clone = function (node) {
        console.log("clone");
        return node.cloneNode(true);
    };
    NativeScriptDomAdapter.prototype.hasProperty = function (element, name) {
        console.log("hasProperty", name);
        return name in element;
    };
    NativeScriptDomAdapter.prototype.getElementsByClassName = function (element, name) {
        console.log("getElementsByClassName", name, element === document);
        if (element === document) {
            return [label, button];
        }
        return [];
    };
    NativeScriptDomAdapter.prototype.getElementsByTagName = function (element, name) {
        console.log("getElementsByTagName");
        return element.getElementsByTagName(name);
    };
    NativeScriptDomAdapter.prototype.classList = function (element) {
        console.log("classList");
        if (!element.classList) {
            element.classList = [];
        }
        return element.classList;
    };
    NativeScriptDomAdapter.prototype.addClass = function (element, classname) {
        console.log("addClass", classname);
        this.classList(element).push(classname);
    };
    NativeScriptDomAdapter.prototype.removeClass = function (element, classname) {
        console.log("removeClass");
        element.classList.remove(classname);
    };
    NativeScriptDomAdapter.prototype.hasClass = function (element, classname) {
        console.log("hasClass", classname);
        return this.classList(element).indexOf(classname) >= 0;
    };
    NativeScriptDomAdapter.prototype.setStyle = function (element, stylename, stylevalue) {
        console.log("setStyle");
        element.style[stylename] = stylevalue;
    };
    NativeScriptDomAdapter.prototype.removeStyle = function (element, stylename) {
        console.log("removeStyle");
        element.style[stylename] = null;
    };
    NativeScriptDomAdapter.prototype.getStyle = function (element, stylename) {
        console.log("getStyle");
        return element.style[stylename];
    };
    NativeScriptDomAdapter.prototype.tagName = function (element) {
        if (element == label) {
            console.log("tagName label");
            return "Label";
        }
        if (element == button) {
            console.log("tagName button");
            return "Button";
        }
        return "null";
    };
    NativeScriptDomAdapter.prototype.attributeMap = function (element) {
        var res = collection_1.MapWrapper.create();
        if (element == label) {
            console.log("attributeMap label");
            collection_1.MapWrapper.set(res, "[text]", element.text);
        }
        if (element == button) {
            console.log("attributeMap button");
            collection_1.MapWrapper.set(res, "(tap)", "onTap()");
        }
        return res;
    };
    NativeScriptDomAdapter.prototype.getAttribute = function (element, attribute) {
        console.log("getAttribute");
        return element.getAttribute(attribute);
    };
    NativeScriptDomAdapter.prototype.setAttribute = function (element, name, value) {
        console.log("setAttribute");
        element.setAttribute(name, value);
    };
    NativeScriptDomAdapter.prototype.removeAttribute = function (element, attribute) {
        console.log("removeAttribute");
        return element.removeAttribute(attribute);
    };
    NativeScriptDomAdapter.prototype.templateAwareRoot = function (el) {
        console.log("templateAwareRoot");
        return this.isTemplateElement(el) ? this.content(el) : el;
    };
    NativeScriptDomAdapter.prototype.createHtmlDocument = function () {
        console.log("createHTMLDocument");
        return document.implementation.createHTMLDocument('fakeTitle');
    };
    NativeScriptDomAdapter.prototype.getTitle = function () {
        console.log("getTitle");
        return document.title;
    };
    NativeScriptDomAdapter.prototype.setTitle = function (newTitle) {
        console.log("setTitle");
        document.title = newTitle;
    };
    NativeScriptDomAdapter.prototype.elementMatches = function (n, selector) {
        console.log("elementMatches");
        return n instanceof HTMLElement && n.matches(selector);
    };
    NativeScriptDomAdapter.prototype.isTemplateElement = function (el) {
        console.log("isTemplateElement");
        return false;
    };
    NativeScriptDomAdapter.prototype.isTextNode = function (node) {
        console.log("isTextNode");
        return false;
    };
    NativeScriptDomAdapter.prototype.isCommentNode = function (node) {
        console.log("isCommentNode");
        return node.nodeType === Node.COMMENT_NODE;
    };
    NativeScriptDomAdapter.prototype.isElementNode = function (node) {
        console.log("isElementNode");
        return true;
    };
    NativeScriptDomAdapter.prototype.hasShadowRoot = function (node) {
        console.log("hasShadowRoot");
        return node instanceof HTMLElement && isPresent(node.shadowRoot);
    };
    NativeScriptDomAdapter.prototype.isShadowRoot = function (node) {
        console.log("isShadowRoot");
        return node instanceof ShadowRoot;
    };
    NativeScriptDomAdapter.prototype.importIntoDoc = function (node) {
        console.log("importIntoDoc");
        return node;
    };
    NativeScriptDomAdapter.prototype.isPageRule = function (rule) {
        console.log("isPageRule");
        return rule.type === CSSRule.PAGE_RULE;
    };
    NativeScriptDomAdapter.prototype.isStyleRule = function (rule) {
        console.log("isStyleRule");
        return rule.type === CSSRule.STYLE_RULE;
    };
    NativeScriptDomAdapter.prototype.isMediaRule = function (rule) {
        console.log("isMediaRule");
        return rule.type === CSSRule.MEDIA_RULE;
    };
    NativeScriptDomAdapter.prototype.isKeyframesRule = function (rule) {
        console.log("isKeyframesRule");
        return rule.type === CSSRule.KEYFRAMES_RULE;
    };
    NativeScriptDomAdapter.prototype.getHref = function (el) {
        console.log("getHref", el.href);
        return el.href;
    };
    NativeScriptDomAdapter.prototype.resolveAndSetHref = function (element, baseUrl, href) {
        console.log("resolveAndSetHref", baseUrl, href);
        element.href = href;
    };
    NativeScriptDomAdapter.prototype.supportsDOMEvents = function () {
        console.log("supportsDOMEvents");
        throw _abstract();
    };
    NativeScriptDomAdapter.prototype.supportsNativeShadowDOM = function () {
        console.log("supportsNativeShadowDOM");
        return false;
    };
    return NativeScriptDomAdapter;
})(DOM.DomAdapter);

exports.NativeScriptDomAdapter = NativeScriptDomAdapter;