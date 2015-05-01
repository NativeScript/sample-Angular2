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
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var selector_1 = require('angular2/src/render/dom/compiler/selector');
var selector_2 = require('angular2/src/render/dom/compiler/selector');
var collection_1 = require('angular2/src/facade/collection');
function main() {
    test_lib_1.describe('SelectorMatcher', function () {
        var matcher, matched, selectableCollector, s1, s2, s3, s4;
        function reset() {
            matched = collection_1.ListWrapper.create();
        }
        test_lib_1.beforeEach(function () {
            reset();
            s1 = s2 = s3 = s4 = null;
            selectableCollector = function (selector, context) {
                collection_1.ListWrapper.push(matched, selector);
                collection_1.ListWrapper.push(matched, context);
            };
            matcher = new selector_1.SelectorMatcher();
        });
        test_lib_1.it('should select by element name case insensitive', function () {
            matcher.addSelectables(s1 = selector_2.CssSelector.parse('someTag'), 1);
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('SOMEOTHERTAG')[0], selectableCollector)).toEqual(false);
            test_lib_1.expect(matched).toEqual([]);
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('SOMETAG')[0], selectableCollector)).toEqual(true);
            test_lib_1.expect(matched).toEqual([s1[0], 1]);
        });
        test_lib_1.it('should select by class name case insensitive', function () {
            matcher.addSelectables(s1 = selector_2.CssSelector.parse('.someClass'), 1);
            matcher.addSelectables(s2 = selector_2.CssSelector.parse('.someClass.class2'), 2);
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('.SOMEOTHERCLASS')[0], selectableCollector)).toEqual(false);
            test_lib_1.expect(matched).toEqual([]);
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('.SOMECLASS')[0], selectableCollector)).toEqual(true);
            test_lib_1.expect(matched).toEqual([s1[0], 1]);
            reset();
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('.someClass.class2')[0], selectableCollector)).toEqual(true);
            test_lib_1.expect(matched).toEqual([s1[0], 1, s2[0], 2]);
        });
        test_lib_1.it('should select by attr name case insensitive independent of the value', function () {
            matcher.addSelectables(s1 = selector_2.CssSelector.parse('[someAttr]'), 1);
            matcher.addSelectables(s2 = selector_2.CssSelector.parse('[someAttr][someAttr2]'), 2);
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('[SOMEOTHERATTR]')[0], selectableCollector)).toEqual(false);
            test_lib_1.expect(matched).toEqual([]);
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('[SOMEATTR]')[0], selectableCollector)).toEqual(true);
            test_lib_1.expect(matched).toEqual([s1[0], 1]);
            reset();
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('[SOMEATTR=someValue]')[0], selectableCollector)).toEqual(true);
            test_lib_1.expect(matched).toEqual([s1[0], 1]);
            reset();
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('[someAttr][someAttr2]')[0], selectableCollector)).toEqual(true);
            test_lib_1.expect(matched).toEqual([s1[0], 1, s2[0], 2]);
        });
        test_lib_1.it('should select by attr name only once if the value is from the DOM', function () {
            matcher.addSelectables(s1 = selector_2.CssSelector.parse('[some-decor]'), 1);
            var elementSelector = new selector_2.CssSelector();
            var element = test_lib_1.el('<div attr></div>');
            var empty = dom_adapter_1.DOM.getAttribute(element, 'attr');
            elementSelector.addAttribute('some-decor', empty);
            matcher.match(elementSelector, selectableCollector);
            test_lib_1.expect(matched).toEqual([s1[0], 1]);
        });
        test_lib_1.it('should select by attr name and value case insensitive', function () {
            matcher.addSelectables(s1 = selector_2.CssSelector.parse('[someAttr=someValue]'), 1);
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('[SOMEATTR=SOMEOTHERATTR]')[0], selectableCollector)).toEqual(false);
            test_lib_1.expect(matched).toEqual([]);
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('[SOMEATTR=SOMEVALUE]')[0], selectableCollector)).toEqual(true);
            test_lib_1.expect(matched).toEqual([s1[0], 1]);
        });
        test_lib_1.it('should select by element name, class name and attribute name with value', function () {
            matcher.addSelectables(s1 = selector_2.CssSelector.parse('someTag.someClass[someAttr=someValue]'), 1);
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('someOtherTag.someOtherClass[someOtherAttr]')[0], selectableCollector)).toEqual(false);
            test_lib_1.expect(matched).toEqual([]);
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('someTag.someOtherClass[someOtherAttr]')[0], selectableCollector)).toEqual(false);
            test_lib_1.expect(matched).toEqual([]);
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('someTag.someClass[someOtherAttr]')[0], selectableCollector)).toEqual(false);
            test_lib_1.expect(matched).toEqual([]);
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('someTag.someClass[someAttr]')[0], selectableCollector)).toEqual(false);
            test_lib_1.expect(matched).toEqual([]);
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('someTag.someClass[someAttr=someValue]')[0], selectableCollector)).toEqual(true);
            test_lib_1.expect(matched).toEqual([s1[0], 1]);
        });
        test_lib_1.it('should select by many attributes and independent of the value', function () {
            matcher.addSelectables(s1 = selector_2.CssSelector.parse('input[type=text][control]'), 1);
            var cssSelector = new selector_2.CssSelector();
            cssSelector.setElement('input');
            cssSelector.addAttribute('type', 'text');
            cssSelector.addAttribute('control', 'one');
            test_lib_1.expect(matcher.match(cssSelector, selectableCollector)).toEqual(true);
            test_lib_1.expect(matched).toEqual([s1[0], 1]);
        });
        test_lib_1.it('should select independent of the order in the css selector', function () {
            matcher.addSelectables(s1 = selector_2.CssSelector.parse('[someAttr].someClass'), 1);
            matcher.addSelectables(s2 = selector_2.CssSelector.parse('.someClass[someAttr]'), 2);
            matcher.addSelectables(s3 = selector_2.CssSelector.parse('.class1.class2'), 3);
            matcher.addSelectables(s4 = selector_2.CssSelector.parse('.class2.class1'), 4);
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('[someAttr].someClass')[0], selectableCollector)).toEqual(true);
            test_lib_1.expect(matched).toEqual([s1[0], 1, s2[0], 2]);
            reset();
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('.someClass[someAttr]')[0], selectableCollector)).toEqual(true);
            test_lib_1.expect(matched).toEqual([s1[0], 1, s2[0], 2]);
            reset();
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('.class1.class2')[0], selectableCollector)).toEqual(true);
            test_lib_1.expect(matched).toEqual([s3[0], 3, s4[0], 4]);
            reset();
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('.class2.class1')[0], selectableCollector)).toEqual(true);
            test_lib_1.expect(matched).toEqual([s4[0], 4, s3[0], 3]);
        });
        test_lib_1.it('should not select with a matching :not selector', function () {
            matcher.addSelectables(selector_2.CssSelector.parse('p:not(.someClass)'), 1);
            matcher.addSelectables(selector_2.CssSelector.parse('p:not([someAttr])'), 2);
            matcher.addSelectables(selector_2.CssSelector.parse(':not(.someClass)'), 3);
            matcher.addSelectables(selector_2.CssSelector.parse(':not(p)'), 4);
            matcher.addSelectables(selector_2.CssSelector.parse(':not(p[someAttr])'), 5);
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('p.someClass[someAttr]')[0], selectableCollector)).toEqual(false);
            test_lib_1.expect(matched).toEqual([]);
        });
        test_lib_1.it('should select with a non matching :not selector', function () {
            matcher.addSelectables(s1 = selector_2.CssSelector.parse('p:not(.someClass)'), 1);
            matcher.addSelectables(s2 = selector_2.CssSelector.parse('p:not(.someOtherClass[someAttr])'), 2);
            matcher.addSelectables(s3 = selector_2.CssSelector.parse(':not(.someClass)'), 3);
            matcher.addSelectables(s4 = selector_2.CssSelector.parse(':not(.someOtherClass[someAttr])'), 4);
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('p[someOtherAttr].someOtherClass')[0], selectableCollector)).toEqual(true);
            test_lib_1.expect(matched).toEqual([s1[0], 1, s2[0], 2, s3[0], 3, s4[0], 4]);
        });
        test_lib_1.it('should select with one match in a list', function () {
            matcher.addSelectables(s1 = selector_2.CssSelector.parse('input[type=text], textbox'), 1);
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('textbox')[0], selectableCollector)).toEqual(true);
            test_lib_1.expect(matched).toEqual([s1[1], 1]);
            reset();
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('input[type=text]')[0], selectableCollector)).toEqual(true);
            test_lib_1.expect(matched).toEqual([s1[0], 1]);
        });
        test_lib_1.it('should not select twice with two matches in a list', function () {
            matcher.addSelectables(s1 = selector_2.CssSelector.parse('input, .someClass'), 1);
            test_lib_1.expect(matcher.match(selector_2.CssSelector.parse('input.someclass')[0], selectableCollector)).toEqual(true);
            test_lib_1.expect(matched.length).toEqual(2);
            test_lib_1.expect(matched).toEqual([s1[0], 1]);
        });
    });
    test_lib_1.describe('CssSelector.parse', function () {
        test_lib_1.it('should detect element names', function () {
            var cssSelector = selector_2.CssSelector.parse('sometag')[0];
            test_lib_1.expect(cssSelector.element).toEqual('sometag');
            test_lib_1.expect(cssSelector.toString()).toEqual('sometag');
        });
        test_lib_1.it('should detect class names', function () {
            var cssSelector = selector_2.CssSelector.parse('.someClass')[0];
            test_lib_1.expect(cssSelector.classNames).toEqual(['someclass']);
            test_lib_1.expect(cssSelector.toString()).toEqual('.someclass');
        });
        test_lib_1.it('should detect attr names', function () {
            var cssSelector = selector_2.CssSelector.parse('[attrname]')[0];
            test_lib_1.expect(cssSelector.attrs).toEqual(['attrname', '']);
            test_lib_1.expect(cssSelector.toString()).toEqual('[attrname]');
        });
        test_lib_1.it('should detect attr values', function () {
            var cssSelector = selector_2.CssSelector.parse('[attrname=attrvalue]')[0];
            test_lib_1.expect(cssSelector.attrs).toEqual(['attrname', 'attrvalue']);
            test_lib_1.expect(cssSelector.toString()).toEqual('[attrname=attrvalue]');
        });
        test_lib_1.it('should detect multiple parts', function () {
            var cssSelector = selector_2.CssSelector.parse('sometag[attrname=attrvalue].someclass')[0];
            test_lib_1.expect(cssSelector.element).toEqual('sometag');
            test_lib_1.expect(cssSelector.attrs).toEqual(['attrname', 'attrvalue']);
            test_lib_1.expect(cssSelector.classNames).toEqual(['someclass']);
            test_lib_1.expect(cssSelector.toString()).toEqual('sometag.someclass[attrname=attrvalue]');
        });
        test_lib_1.it('should detect multiple attributes', function () {
            var cssSelector = selector_2.CssSelector.parse('input[type=text][control]')[0];
            test_lib_1.expect(cssSelector.element).toEqual('input');
            test_lib_1.expect(cssSelector.attrs).toEqual(['type', 'text', 'control', '']);
            test_lib_1.expect(cssSelector.toString()).toEqual('input[type=text][control]');
        });
        test_lib_1.it('should detect :not', function () {
            var cssSelector = selector_2.CssSelector.parse('sometag:not([attrname=attrvalue].someclass)')[0];
            test_lib_1.expect(cssSelector.element).toEqual('sometag');
            test_lib_1.expect(cssSelector.attrs.length).toEqual(0);
            test_lib_1.expect(cssSelector.classNames.length).toEqual(0);
            var notSelector = cssSelector.notSelector;
            test_lib_1.expect(notSelector.element).toEqual(null);
            test_lib_1.expect(notSelector.attrs).toEqual(['attrname', 'attrvalue']);
            test_lib_1.expect(notSelector.classNames).toEqual(['someclass']);
            test_lib_1.expect(cssSelector.toString()).toEqual('sometag:not(.someclass[attrname=attrvalue])');
        });
        test_lib_1.it('should detect :not without truthy', function () {
            var cssSelector = selector_2.CssSelector.parse(':not([attrname=attrvalue].someclass)')[0];
            test_lib_1.expect(cssSelector.element).toEqual("*");
            var notSelector = cssSelector.notSelector;
            test_lib_1.expect(notSelector.attrs).toEqual(['attrname', 'attrvalue']);
            test_lib_1.expect(notSelector.classNames).toEqual(['someclass']);
            test_lib_1.expect(cssSelector.toString()).toEqual('*:not(.someclass[attrname=attrvalue])');
        });
        test_lib_1.it('should throw when nested :not', function () {
            test_lib_1.expect(function () {
                selector_2.CssSelector.parse('sometag:not(:not([attrname=attrvalue].someclass))')[0];
            }).toThrowError('Nesting :not is not allowed in a selector');
        });
        test_lib_1.it('should detect lists of selectors', function () {
            var cssSelectors = selector_2.CssSelector.parse('.someclass,[attrname=attrvalue], sometag');
            test_lib_1.expect(cssSelectors.length).toEqual(3);
            test_lib_1.expect(cssSelectors[0].classNames).toEqual(['someclass']);
            test_lib_1.expect(cssSelectors[1].attrs).toEqual(['attrname', 'attrvalue']);
            test_lib_1.expect(cssSelectors[2].element).toEqual('sometag');
        });
        test_lib_1.it('should detect lists of selectors with :not', function () {
            var cssSelectors = selector_2.CssSelector.parse('input[type=text], :not(textarea), textbox:not(.special)');
            test_lib_1.expect(cssSelectors.length).toEqual(3);
            test_lib_1.expect(cssSelectors[0].element).toEqual('input');
            test_lib_1.expect(cssSelectors[0].attrs).toEqual(['type', 'text']);
            test_lib_1.expect(cssSelectors[1].element).toEqual('*');
            test_lib_1.expect(cssSelectors[1].notSelector.element).toEqual('textarea');
            test_lib_1.expect(cssSelectors[2].element).toEqual('textbox');
            test_lib_1.expect(cssSelectors[2].notSelector.classNames).toEqual(['special']);
        });
    });
}
exports.main = main;
