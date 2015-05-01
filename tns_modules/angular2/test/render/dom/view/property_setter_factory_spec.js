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
var property_setter_factory_1 = require('angular2/src/render/dom/view/property_setter_factory');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
function main() {
    var div;
    test_lib_1.beforeEach(function () {
        div = test_lib_1.el('<div></div>');
    });
    test_lib_1.describe('property setter factory', function () {
        test_lib_1.it('should return a setter for a property', function () {
            var setterFn = property_setter_factory_1.setterFactory('title');
            setterFn(div, 'Hello');
            test_lib_1.expect(div.title).toEqual('Hello');
            var otherSetterFn = property_setter_factory_1.setterFactory('title');
            test_lib_1.expect(setterFn).toBe(otherSetterFn);
        });
        test_lib_1.it('should return a setter for an attribute', function () {
            var setterFn = property_setter_factory_1.setterFactory('attr.role');
            setterFn(div, 'button');
            test_lib_1.expect(dom_adapter_1.DOM.getAttribute(div, 'role')).toEqual('button');
            setterFn(div, null);
            test_lib_1.expect(dom_adapter_1.DOM.getAttribute(div, 'role')).toEqual(null);
            test_lib_1.expect(function () {
                setterFn(div, 4);
            }).toThrowError("Invalid role attribute, only string values are allowed, got '4'");
            var otherSetterFn = property_setter_factory_1.setterFactory('attr.role');
            test_lib_1.expect(setterFn).toBe(otherSetterFn);
        });
        test_lib_1.it('should return a setter for a class', function () {
            var setterFn = property_setter_factory_1.setterFactory('class.active');
            setterFn(div, true);
            test_lib_1.expect(dom_adapter_1.DOM.hasClass(div, 'active')).toEqual(true);
            setterFn(div, false);
            test_lib_1.expect(dom_adapter_1.DOM.hasClass(div, 'active')).toEqual(false);
            var otherSetterFn = property_setter_factory_1.setterFactory('class.active');
            test_lib_1.expect(setterFn).toBe(otherSetterFn);
        });
        test_lib_1.it('should return a setter for a style', function () {
            var setterFn = property_setter_factory_1.setterFactory('style.width');
            setterFn(div, '40px');
            test_lib_1.expect(dom_adapter_1.DOM.getStyle(div, 'width')).toEqual('40px');
            setterFn(div, null);
            test_lib_1.expect(dom_adapter_1.DOM.getStyle(div, 'width')).toEqual('');
            var otherSetterFn = property_setter_factory_1.setterFactory('style.width');
            test_lib_1.expect(setterFn).toBe(otherSetterFn);
        });
        test_lib_1.it('should return a setter for a style with a unit', function () {
            var setterFn = property_setter_factory_1.setterFactory('style.height.px');
            setterFn(div, 40);
            test_lib_1.expect(dom_adapter_1.DOM.getStyle(div, 'height')).toEqual('40px');
            setterFn(div, null);
            test_lib_1.expect(dom_adapter_1.DOM.getStyle(div, 'height')).toEqual('');
            var otherSetterFn = property_setter_factory_1.setterFactory('style.height.px');
            test_lib_1.expect(setterFn).toBe(otherSetterFn);
        });
        test_lib_1.it('should return a setter for innerHtml', function () {
            var setterFn = property_setter_factory_1.setterFactory('innerHtml');
            setterFn(div, '<span></span>');
            test_lib_1.expect(dom_adapter_1.DOM.getInnerHTML(div)).toEqual('<span></span>');
            var otherSetterFn = property_setter_factory_1.setterFactory('innerHtml');
            test_lib_1.expect(setterFn).toBe(otherSetterFn);
        });
    });
}
exports.main = main;
