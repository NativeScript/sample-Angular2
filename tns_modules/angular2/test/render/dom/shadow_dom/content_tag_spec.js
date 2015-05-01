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
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var content_tag_1 = require('angular2/src/render/dom/shadow_dom/content_tag');
var light_dom_1 = require('angular2/src/render/dom/shadow_dom/light_dom');
var DummyLightDom = (function (_super) {
    __extends(DummyLightDom, _super);
    function DummyLightDom() {
        _super.apply(this, arguments);
    }
    DummyLightDom.prototype.noSuchMethod = function (m) {
        _super.prototype.noSuchMethod.call(this, m);
    };
    return DummyLightDom;
})(test_lib_1.SpyObject);
Object.defineProperty(DummyLightDom, "annotations", { get: function () {
        return [new test_lib_1.proxy, new lang_1.IMPLEMENTS(light_dom_1.LightDom)];
    } });
var _scriptStart = "<script start=\"\"></script>";
var _scriptEnd = "<script end=\"\"></script>";
function main() {
    test_lib_1.describe('Content', function () {
        var parent;
        var content;
        test_lib_1.beforeEach(function () {
            parent = test_lib_1.el("<div>" + _scriptStart + _scriptEnd);
            content = dom_adapter_1.DOM.firstChild(parent);
        });
        test_lib_1.it("should insert the nodes", function () {
            var c = new content_tag_1.Content(content, '');
            c.hydrate(null);
            c.insert([test_lib_1.el("<a></a>"), test_lib_1.el("<b></b>")]);
            test_lib_1.expect(dom_adapter_1.DOM.getInnerHTML(parent)).toEqual(_scriptStart + "<a></a><b></b>" + _scriptEnd);
        });
        test_lib_1.it("should remove the nodes from the previous insertion", function () {
            var c = new content_tag_1.Content(content, '');
            c.hydrate(null);
            c.insert([test_lib_1.el("<a></a>")]);
            c.insert([test_lib_1.el("<b></b>")]);
            test_lib_1.expect(dom_adapter_1.DOM.getInnerHTML(parent)).toEqual(_scriptStart + "<b></b>" + _scriptEnd);
        });
        test_lib_1.it("should insert empty list", function () {
            var c = new content_tag_1.Content(content, '');
            c.hydrate(null);
            c.insert([test_lib_1.el("<a></a>")]);
            c.insert([]);
            test_lib_1.expect(dom_adapter_1.DOM.getInnerHTML(parent)).toEqual("" + _scriptStart + _scriptEnd);
        });
    });
}
exports.main = main;
