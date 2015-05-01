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
exports.NG_BINDING_CLASS_SELECTOR = '.ng-binding';
exports.NG_BINDING_CLASS = 'ng-binding';
var CAMEL_CASE_REGEXP = lang_1.RegExpWrapper.create('([A-Z])');
var DASH_CASE_REGEXP = lang_1.RegExpWrapper.create('-([a-z])');
function camelCaseToDashCase(input) {
    return lang_1.StringWrapper.replaceAllMapped(input, CAMEL_CASE_REGEXP, function (m) {
        return '-' + m[1].toLowerCase();
    });
}
exports.camelCaseToDashCase = camelCaseToDashCase;
Object.defineProperty(camelCaseToDashCase, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
function dashCaseToCamelCase(input) {
    return lang_1.StringWrapper.replaceAllMapped(input, DASH_CASE_REGEXP, function (m) {
        return m[1].toUpperCase();
    });
}
exports.dashCaseToCamelCase = dashCaseToCamelCase;
Object.defineProperty(dashCaseToCamelCase, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
