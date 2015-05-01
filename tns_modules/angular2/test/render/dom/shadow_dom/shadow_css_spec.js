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
var shadow_css_1 = require('angular2/src/render/dom/shadow_dom/shadow_css');
var lang_1 = require('angular2/src/facade/lang');
function main() {
    test_lib_1.describe('ShadowCss', function () {
        function s(css, contentAttr, hostAttr) {
            if (hostAttr === void 0) { hostAttr = ''; }
            var shadowCss = new shadow_css_1.ShadowCss();
            var shim = shadowCss.shimCssText(css, contentAttr, hostAttr);
            var nlRegexp = lang_1.RegExpWrapper.create('\\n');
            return lang_1.StringWrapper.replaceAll(shim, nlRegexp, '');
        }
        Object.defineProperty(s, "parameters", { get: function () {
                return [[assert.type.string], [assert.type.string], [assert.type.string]];
            } });
        test_lib_1.it('should handle empty string', function () {
            test_lib_1.expect(s('', 'a')).toEqual('');
        });
        test_lib_1.it('should add an attribute to every rule', function () {
            var css = 'one {color: red;}two {color: red;}';
            var expected = 'one[a] {color: red;}two[a] {color: red;}';
            test_lib_1.expect(s(css, 'a')).toEqual(expected);
        });
        test_lib_1.it('should hanlde invalid css', function () {
            var css = 'one {color: red;}garbage';
            var expected = 'one[a] {color: red;}';
            test_lib_1.expect(s(css, 'a')).toEqual(expected);
        });
        test_lib_1.it('should add an attribute to every selector', function () {
            var css = 'one, two {color: red;}';
            var expected = 'one[a], two[a] {color: red;}';
            test_lib_1.expect(s(css, 'a')).toEqual(expected);
        });
        test_lib_1.it('should handle media rules', function () {
            var css = '@media screen and (max-width: 800px) {div {font-size: 50px;}}';
            var expected = '@media screen and (max-width: 800px) {div[a] {font-size: 50px;}}';
            test_lib_1.expect(s(css, 'a')).toEqual(expected);
        });
        test_lib_1.it('should handle media rules with simple rules', function () {
            var css = '@media screen and (max-width: 800px) {div {font-size: 50px;}} div {}';
            var expected = '@media screen and (max-width: 800px) {div[a] {font-size: 50px;}}div[a] {}';
            test_lib_1.expect(s(css, 'a')).toEqual(expected);
        });
        test_lib_1.it('should handle complicated selectors', function () {
            test_lib_1.expect(s('one::before {}', 'a')).toEqual('one[a]::before {}');
            test_lib_1.expect(s('one two {}', 'a')).toEqual('one[a] two[a] {}');
            test_lib_1.expect(s('one>two {}', 'a')).toEqual('one[a] > two[a] {}');
            test_lib_1.expect(s('one+two {}', 'a')).toEqual('one[a] + two[a] {}');
            test_lib_1.expect(s('one~two {}', 'a')).toEqual('one[a] ~ two[a] {}');
            test_lib_1.expect(s('.one.two > three {}', 'a')).toEqual('.one.two[a] > three[a] {}');
            test_lib_1.expect(s('one[attr="value"] {}', 'a')).toEqual('one[attr="value"][a] {}');
            test_lib_1.expect(s('one[attr=value] {}', 'a')).toEqual('one[attr="value"][a] {}');
            test_lib_1.expect(s('one[attr^="value"] {}', 'a')).toEqual('one[attr^="value"][a] {}');
            test_lib_1.expect(s('one[attr$="value"] {}', 'a')).toEqual('one[attr$="value"][a] {}');
            test_lib_1.expect(s('one[attr*="value"] {}', 'a')).toEqual('one[attr*="value"][a] {}');
            test_lib_1.expect(s('one[attr|="value"] {}', 'a')).toEqual('one[attr|="value"][a] {}');
            test_lib_1.expect(s('one[attr] {}', 'a')).toEqual('one[attr][a] {}');
            test_lib_1.expect(s('[is="one"] {}', 'a')).toEqual('[is="one"][a] {}');
        });
        test_lib_1.it('should handle :host', function () {
            test_lib_1.expect(s(':host {}', 'a', 'a-host')).toEqual('[a-host] {}');
            test_lib_1.expect(s(':host(.x,.y) {}', 'a', 'a-host')).toEqual('[a-host].x, [a-host].y {}');
            test_lib_1.expect(s(':host(.x,.y) > .z {}', 'a', 'a-host')).toEqual('[a-host].x > .z, [a-host].y > .z {}');
        });
        test_lib_1.it('should handle :host-context', function () {
            test_lib_1.expect(s(':host-context(.x) {}', 'a', 'a-host')).toEqual('[a-host].x, .x [a-host] {}');
            test_lib_1.expect(s(':host-context(.x) > .y {}', 'a', 'a-host')).toEqual('[a-host].x > .y, .x [a-host] > .y {}');
        });
        test_lib_1.it('should support polyfill-next-selector', function () {
            var css = s("polyfill-next-selector {content: 'x > y'} z {}", 'a');
            test_lib_1.expect(css).toEqual('x[a] > y[a] {}');
            css = s('polyfill-next-selector {content: "x > y"} z {}', 'a');
            test_lib_1.expect(css).toEqual('x[a] > y[a] {}');
        });
        test_lib_1.it('should support polyfill-unscoped-rule', function () {
            var css = s("polyfill-unscoped-rule {content: '#menu > .bar';background: blue;}", 'a');
            test_lib_1.expect(lang_1.StringWrapper.contains(css, '#menu > .bar {;background: blue;}')).toBeTruthy();
            css = s('polyfill-unscoped-rule {content: "#menu > .bar";background: blue;}', 'a');
            test_lib_1.expect(lang_1.StringWrapper.contains(css, '#menu > .bar {;background: blue;}')).toBeTruthy();
        });
        test_lib_1.it('should support polyfill-rule', function () {
            var css = s("polyfill-rule {content: ':host.foo .bar';background: blue;}", 'a', 'a-host');
            test_lib_1.expect(css).toEqual('[a-host].foo .bar {background: blue;}');
            css = s('polyfill-rule {content: ":host.foo .bar";background: blue;}', 'a', 'a-host');
            test_lib_1.expect(css).toEqual('[a-host].foo .bar {background: blue;}');
        });
        test_lib_1.it('should handle ::shadow', function () {
            var css = s('x::shadow > y {}', 'a');
            test_lib_1.expect(css).toEqual('x[a] > y[a] {}');
        });
        test_lib_1.it('should handle /deep/', function () {
            var css = s('x /deep/ y {}', 'a');
            test_lib_1.expect(css).toEqual('x[a] y[a] {}');
        });
        test_lib_1.it('should handle >>>', function () {
            var css = s('x >>> y {}', 'a');
            test_lib_1.expect(css).toEqual('x[a] y[a] {}');
        });
    });
}
exports.main = main;
