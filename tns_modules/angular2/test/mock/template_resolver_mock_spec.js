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
var template_resolver_mock_1 = require('angular2/src/mock/template_resolver_mock');
var annotations_1 = require('angular2/src/core/annotations/annotations');
var template_1 = require('angular2/src/core/annotations/template');
var lang_1 = require('angular2/src/facade/lang');
function main() {
    test_lib_1.describe('MockTemplateResolver', function () {
        var resolver;
        test_lib_1.beforeEach(function () {
            resolver = new template_resolver_mock_1.MockTemplateResolver();
        });
        test_lib_1.describe('Template overriding', function () {
            test_lib_1.it('should fallback to the default TemplateResolver when templates are not overridden', function () {
                var template = resolver.resolve(SomeComponent);
                test_lib_1.expect(template.inline).toEqual('template');
                test_lib_1.expect(template.directives).toEqual([SomeDirective]);
            });
            test_lib_1.it('should allow overriding a template', function () {
                resolver.setTemplate(SomeComponent, new template_1.Template({ inline: 'overridden template' }));
                var template = resolver.resolve(SomeComponent);
                test_lib_1.expect(template.inline).toEqual('overridden template');
                test_lib_1.expect(lang_1.isBlank(template.directives)).toBe(true);
            });
            test_lib_1.it('should not allow overriding a template after it has been resolved', function () {
                resolver.resolve(SomeComponent);
                test_lib_1.expect(function () {
                    resolver.setTemplate(SomeComponent, new template_1.Template({ inline: 'overridden template' }));
                }).toThrowError('The component SomeComponent has already been compiled, its configuration can not be changed');
            });
        });
        test_lib_1.describe('inline definition overriding', function () {
            test_lib_1.it('should allow overriding the default Template', function () {
                resolver.setInlineTemplate(SomeComponent, 'overridden template');
                var template = resolver.resolve(SomeComponent);
                test_lib_1.expect(template.inline).toEqual('overridden template');
                test_lib_1.expect(template.directives).toEqual([SomeDirective]);
            });
            test_lib_1.it('should allow overriding an overriden template', function () {
                resolver.setTemplate(SomeComponent, new template_1.Template({ inline: 'overridden template' }));
                resolver.setInlineTemplate(SomeComponent, 'overridden template x 2');
                var template = resolver.resolve(SomeComponent);
                test_lib_1.expect(template.inline).toEqual('overridden template x 2');
            });
            test_lib_1.it('should not allow overriding a template after it has been resolved', function () {
                resolver.resolve(SomeComponent);
                test_lib_1.expect(function () {
                    resolver.setInlineTemplate(SomeComponent, 'overridden template');
                }).toThrowError('The component SomeComponent has already been compiled, its configuration can not be changed');
            });
        });
        test_lib_1.describe('Directive overriding', function () {
            test_lib_1.it('should allow overriding a directive from the default template', function () {
                resolver.overrideTemplateDirective(SomeComponent, SomeDirective, SomeOtherDirective);
                var template = resolver.resolve(SomeComponent);
                test_lib_1.expect(template.directives.length).toEqual(1);
                test_lib_1.expect(template.directives[0]).toBe(SomeOtherDirective);
            });
            test_lib_1.it('should allow overriding a directive from an overriden template', function () {
                resolver.setTemplate(SomeComponent, new template_1.Template({ directives: [SomeOtherDirective] }));
                resolver.overrideTemplateDirective(SomeComponent, SomeOtherDirective, SomeComponent);
                var template = resolver.resolve(SomeComponent);
                test_lib_1.expect(template.directives.length).toEqual(1);
                test_lib_1.expect(template.directives[0]).toBe(SomeComponent);
            });
            test_lib_1.it('should throw when the overridden directive is not present', function () {
                resolver.overrideTemplateDirective(SomeComponent, SomeOtherDirective, SomeDirective);
                test_lib_1.expect(function () {
                    resolver.resolve(SomeComponent);
                }).toThrowError('Overriden directive SomeOtherDirective not found in the template of SomeComponent');
            });
            test_lib_1.it('should not allow overriding a directive after its template has been resolved', function () {
                resolver.resolve(SomeComponent);
                test_lib_1.expect(function () {
                    resolver.overrideTemplateDirective(SomeComponent, SomeDirective, SomeOtherDirective);
                }).toThrowError('The component SomeComponent has already been compiled, its configuration can not be changed');
            });
        });
    });
}
exports.main = main;
var SomeComponent = (function () {
    function SomeComponent() {
    }
    return SomeComponent;
})();
Object.defineProperty(SomeComponent, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'cmp' }), new template_1.Template({
                inline: 'template',
                directives: [SomeDirective]
            })];
    } });
var SomeDirective = (function () {
    function SomeDirective() {
    }
    return SomeDirective;
})();
var SomeOtherDirective = (function () {
    function SomeOtherDirective() {
    }
    return SomeOtherDirective;
})();
