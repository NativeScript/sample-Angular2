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
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
function main() {
    test_lib_1.describe('RegExp', function () {
        test_lib_1.it('should expose the index for each match', function () {
            var re = lang_1.RegExpWrapper.create('(!)');
            var matcher = lang_1.RegExpWrapper.matcher(re, '0!23!567!!');
            var indexes = [];
            var m;
            while (lang_1.isPresent(m = lang_1.RegExpMatcherWrapper.next(matcher))) {
                collection_1.ListWrapper.push(indexes, m.index);
                test_lib_1.expect(m[0]).toEqual('!');
                test_lib_1.expect(m[1]).toEqual('!');
                test_lib_1.expect(m.length).toBe(2);
            }
            test_lib_1.expect(indexes).toEqual([1, 4, 8, 9]);
        });
    });
}
exports.main = main;
