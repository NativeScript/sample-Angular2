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
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var content_tag_1 = require('angular2/src/core/compiler/shadow_dom_emulation/content_tag');
var light_dom_1 = require('angular2/src/core/compiler/shadow_dom_emulation/light_dom');
var view_1 = require('angular2/src/core/compiler/view');
var view_container_1 = require('angular2/src/core/compiler/view_container');
var FakeView = (function () {
    function FakeView(containers) {
        var _this = this;
        if (containers === void 0) { containers = null; }
        this.contentTags = [];
        this.viewContainers = [];
        if (lang_1.isPresent(containers)) {
            collection_1.ListWrapper.forEach(containers, function (c) {
                if (c instanceof FakeContentTag) {
                    collection_1.ListWrapper.push(_this.contentTags, c);
                }
                else {
                    collection_1.ListWrapper.push(_this.contentTags, null);
                }
                if (c instanceof FakeViewContainer) {
                    collection_1.ListWrapper.push(_this.viewContainers, c);
                }
                else {
                    collection_1.ListWrapper.push(_this.viewContainers, null);
                }
            });
        }
    }
    FakeView.prototype.noSuchMethod = function (i) {
        _super.noSuchMethod.call(this, i);
    };
    return FakeView;
})();
Object.defineProperty(FakeView, "annotations", { get: function () {
        return [new test_lib_1.proxy, new lang_1.IMPLEMENTS(view_1.View)];
    } });
var FakeViewContainer = (function () {
    function FakeViewContainer(templateEl, nodes, views) {
        if (nodes === void 0) { nodes = null; }
        if (views === void 0) { views = null; }
        this.templateElement = templateEl;
        this._nodes = nodes;
        this._contentTagContainers = views;
    }
    FakeViewContainer.prototype.nodes = function () {
        return this._nodes;
    };
    FakeViewContainer.prototype.contentTagContainers = function () {
        return this._contentTagContainers;
    };
    FakeViewContainer.prototype.noSuchMethod = function (i) {
        _super.noSuchMethod.call(this, i);
    };
    return FakeViewContainer;
})();
Object.defineProperty(FakeViewContainer, "annotations", { get: function () {
        return [new test_lib_1.proxy, new lang_1.IMPLEMENTS(view_container_1.ViewContainer)];
    } });
var FakeContentTag = (function () {
    function FakeContentTag(contentEl, select, nodes) {
        if (select === void 0) { select = ''; }
        if (nodes === void 0) { nodes = null; }
        this.contentStartElement = contentEl;
        this.select = select;
        this._nodes = nodes;
    }
    FakeContentTag.prototype.insert = function (nodes) {
        this._nodes = collection_1.ListWrapper.clone(nodes);
    };
    FakeContentTag.prototype.nodes = function () {
        return this._nodes;
    };
    FakeContentTag.prototype.noSuchMethod = function (i) {
        _super.noSuchMethod.call(this, i);
    };
    return FakeContentTag;
})();
Object.defineProperty(FakeContentTag, "annotations", { get: function () {
        return [new test_lib_1.proxy, new lang_1.IMPLEMENTS(content_tag_1.Content)];
    } });
function main() {
    test_lib_1.describe('LightDom', function () {
        var lightDomView;
        test_lib_1.beforeEach(function () {
            lightDomView = new FakeView();
        });
        test_lib_1.describe("contentTags", function () {
            test_lib_1.it("should collect content tags from element injectors", function () {
                var tag = new FakeContentTag(test_lib_1.el('<script></script>'));
                var shadowDomView = new FakeView([tag]);
                var lightDom = new light_dom_1.LightDom(lightDomView, shadowDomView, test_lib_1.el("<div></div>"));
                test_lib_1.expect(lightDom.contentTags()).toEqual([tag]);
            });
            test_lib_1.it("should collect content tags from ViewContainers", function () {
                var tag = new FakeContentTag(test_lib_1.el('<script></script>'));
                var vc = new FakeViewContainer(null, null, [new FakeView([tag])]);
                var shadowDomView = new FakeView([vc]);
                var lightDom = new light_dom_1.LightDom(lightDomView, shadowDomView, test_lib_1.el("<div></div>"));
                test_lib_1.expect(lightDom.contentTags()).toEqual([tag]);
            });
        });
        test_lib_1.describe("expandedDomNodes", function () {
            test_lib_1.it("should contain root nodes", function () {
                var lightDomEl = test_lib_1.el("<div><a></a></div>");
                var lightDom = new light_dom_1.LightDom(lightDomView, new FakeView(), lightDomEl);
                test_lib_1.expect(toHtml(lightDom.expandedDomNodes())).toEqual(["<a></a>"]);
            });
            test_lib_1.it("should include view container nodes", function () {
                var lightDomEl = test_lib_1.el("<div><template></template></div>");
                var lightDom = new light_dom_1.LightDom(new FakeView([new FakeViewContainer(dom_adapter_1.DOM.firstChild(lightDomEl), [test_lib_1.el('<a></a>')])]), null, lightDomEl);
                test_lib_1.expect(toHtml(lightDom.expandedDomNodes())).toEqual(["<a></a>"]);
            });
            test_lib_1.it("should include content nodes", function () {
                var lightDomEl = test_lib_1.el("<div><content></content></div>");
                var lightDom = new light_dom_1.LightDom(new FakeView([new FakeContentTag(dom_adapter_1.DOM.firstChild(lightDomEl), '', [test_lib_1.el('<a></a>')])]), null, lightDomEl);
                test_lib_1.expect(toHtml(lightDom.expandedDomNodes())).toEqual(["<a></a>"]);
            });
            test_lib_1.it("should work when the element injector array contains nulls", function () {
                var lightDomEl = test_lib_1.el("<div><a></a></div>");
                var lightDomView = new FakeView();
                var lightDom = new light_dom_1.LightDom(lightDomView, new FakeView(), lightDomEl);
                test_lib_1.expect(toHtml(lightDom.expandedDomNodes())).toEqual(["<a></a>"]);
            });
        });
        test_lib_1.describe("redistribute", function () {
            test_lib_1.it("should redistribute nodes between content tags with select property set", function () {
                var contentA = new FakeContentTag(null, "a");
                var contentB = new FakeContentTag(null, "b");
                var lightDomEl = test_lib_1.el("<div><a>1</a><b>2</b><a>3</a></div>");
                var lightDom = new light_dom_1.LightDom(lightDomView, new FakeView([contentA, contentB]), lightDomEl);
                lightDom.redistribute();
                test_lib_1.expect(toHtml(contentA.nodes())).toEqual(["<a>1</a>", "<a>3</a>"]);
                test_lib_1.expect(toHtml(contentB.nodes())).toEqual(["<b>2</b>"]);
            });
            test_lib_1.it("should support wildcard content tags", function () {
                var wildcard = new FakeContentTag(null, '');
                var contentB = new FakeContentTag(null, "b");
                var lightDomEl = test_lib_1.el("<div><a>1</a><b>2</b><a>3</a></div>");
                var lightDom = new light_dom_1.LightDom(lightDomView, new FakeView([wildcard, contentB]), lightDomEl);
                lightDom.redistribute();
                test_lib_1.expect(toHtml(wildcard.nodes())).toEqual(["<a>1</a>", "<b>2</b>", "<a>3</a>"]);
                test_lib_1.expect(toHtml(contentB.nodes())).toEqual([]);
            });
        });
    });
}
exports.main = main;
function toHtml(nodes) {
    if (lang_1.isBlank(nodes))
        return [];
    return collection_1.ListWrapper.map(nodes, dom_adapter_1.DOM.getOuterHTML);
}
