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
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var viewModule = require('../view');
var content_tag_1 = require('./content_tag');
var DestinationLightDom = (function () {
    function DestinationLightDom() {
    }
    return DestinationLightDom;
})();
exports.DestinationLightDom = DestinationLightDom;
var _Root = (function () {
    function _Root(node, viewContainer, content) {
        this.node = node;
        this.viewContainer = viewContainer;
        this.content = content;
    }
    return _Root;
})();
var LightDom = (function () {
    function LightDom(lightDomView, shadowDomView, element) {
        this.lightDomView = lightDomView;
        this.shadowDomView = shadowDomView;
        this.nodes = dom_adapter_1.DOM.childNodesAsList(element);
        this.roots = null;
    }
    LightDom.prototype.redistribute = function () {
        var tags = this.contentTags();
        if (tags.length > 0) {
            redistributeNodes(tags, this.expandedDomNodes());
        }
    };
    LightDom.prototype.contentTags = function () {
        return this._collectAllContentTags(this.shadowDomView, []);
    };
    LightDom.prototype._collectAllContentTags = function (view, acc) {
        var _this = this;
        var contentTags = view.contentTags;
        var vcs = view.viewContainers;
        for (var i = 0; i < vcs.length; i++) {
            var vc = vcs[i];
            var contentTag = contentTags[i];
            if (lang_1.isPresent(contentTag)) {
                collection_1.ListWrapper.push(acc, contentTag);
            }
            if (lang_1.isPresent(vc)) {
                collection_1.ListWrapper.forEach(vc.contentTagContainers(), function (view) {
                    _this._collectAllContentTags(view, acc);
                });
            }
        }
        return acc;
    };
    LightDom.prototype.expandedDomNodes = function () {
        var res = [];
        var roots = this._roots();
        for (var i = 0; i < roots.length; ++i) {
            var root = roots[i];
            if (lang_1.isPresent(root.viewContainer)) {
                res = collection_1.ListWrapper.concat(res, root.viewContainer.nodes());
            }
            else if (lang_1.isPresent(root.content)) {
                res = collection_1.ListWrapper.concat(res, root.content.nodes());
            }
            else {
                collection_1.ListWrapper.push(res, root.node);
            }
        }
        return res;
    };
    LightDom.prototype._roots = function () {
        if (lang_1.isPresent(this.roots))
            return this.roots;
        var viewContainers = this.lightDomView.viewContainers;
        var contentTags = this.lightDomView.contentTags;
        this.roots = collection_1.ListWrapper.map(this.nodes, function (n) {
            var foundVc = null;
            var foundContentTag = null;
            for (var i = 0; i < viewContainers.length; i++) {
                var vc = viewContainers[i];
                var contentTag = contentTags[i];
                if (lang_1.isPresent(vc) && vc.templateElement === n) {
                    foundVc = vc;
                }
                if (lang_1.isPresent(contentTag) && contentTag.contentStartElement === n) {
                    foundContentTag = contentTag;
                }
            }
            return new _Root(n, foundVc, foundContentTag);
        });
        return this.roots;
    };
    return LightDom;
})();
exports.LightDom = LightDom;
Object.defineProperty(LightDom, "parameters", { get: function () {
        return [[viewModule.View], [viewModule.View], []];
    } });
Object.defineProperty(LightDom.prototype._collectAllContentTags, "parameters", { get: function () {
        return [[viewModule.View], [assert.genericType(collection_1.List, content_tag_1.Content)]];
    } });
function redistributeNodes(contents, nodes) {
    for (var i = 0; i < contents.length; ++i) {
        var content = contents[i];
        var select = content.select;
        var matchSelector = function (n) { return dom_adapter_1.DOM.elementMatches(n, select); };
        if (select.length === 0) {
            content.insert(nodes);
            collection_1.ListWrapper.clear(nodes);
        }
        else {
            var matchingNodes = collection_1.ListWrapper.filter(nodes, matchSelector);
            content.insert(matchingNodes);
            collection_1.ListWrapper.removeAll(nodes, matchingNodes);
        }
    }
}
Object.defineProperty(redistributeNodes, "parameters", { get: function () {
        return [[assert.genericType(collection_1.List, content_tag_1.Content)], [collection_1.List]];
    } });
