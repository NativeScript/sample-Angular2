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
var locals_1 = require('angular2/src/change_detection/parser/locals');
var collection_1 = require('angular2/src/facade/collection');
function main() {
    test_lib_1.describe('Locals', function () {
        var locals;
        test_lib_1.beforeEach(function () {
            locals = new locals_1.Locals(null, collection_1.MapWrapper.createFromPairs([['key', 'value'], ['nullKey', null]]));
        });
        test_lib_1.it('should support getting values', function () {
            test_lib_1.expect(locals.get('key')).toBe('value');
            test_lib_1.expect(function () { return locals.get('notPresent'); }).toThrowError(new RegExp("Cannot find"));
        });
        test_lib_1.it('should support checking if key is present', function () {
            test_lib_1.expect(locals.contains('key')).toBe(true);
            test_lib_1.expect(locals.contains('nullKey')).toBe(true);
            test_lib_1.expect(locals.contains('notPresent')).toBe(false);
        });
        test_lib_1.it('should support setting keys', function () {
            locals.set('key', 'bar');
            test_lib_1.expect(locals.get('key')).toBe('bar');
        });
        test_lib_1.it('should not support setting keys that are not present already', function () {
            test_lib_1.expect(function () { return locals.set('notPresent', 'bar'); }).toThrowError();
        });
        test_lib_1.it('should clearValues', function () {
            locals.clearValues();
            test_lib_1.expect(locals.get('key')).toBe(null);
        });
    });
}
exports.main = main;
