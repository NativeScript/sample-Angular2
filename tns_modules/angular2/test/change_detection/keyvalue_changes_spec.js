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
var keyvalue_changes_1 = require('angular2/src/change_detection/pipes/keyvalue_changes');
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var util_1 = require('./util');
function main() {
    test_lib_1.describe('keyvalue_changes', function () {
        test_lib_1.describe('KeyValueChanges', function () {
            var changes;
            var m;
            test_lib_1.beforeEach(function () {
                changes = new keyvalue_changes_1.KeyValueChanges();
                m = collection_1.MapWrapper.create();
            });
            test_lib_1.afterEach(function () {
                changes = null;
            });
            test_lib_1.it('should detect additions', function () {
                changes.check(m);
                collection_1.MapWrapper.set(m, 'a', 1);
                changes.check(m);
                test_lib_1.expect(changes.toString()).toEqual(util_1.kvChangesAsString({
                    map: ['a[null->1]'],
                    additions: ['a[null->1]']
                }));
                collection_1.MapWrapper.set(m, 'b', 2);
                changes.check(m);
                test_lib_1.expect(changes.toString()).toEqual(util_1.kvChangesAsString({
                    map: ['a', 'b[null->2]'],
                    previous: ['a'],
                    additions: ['b[null->2]']
                }));
            });
            test_lib_1.it('should handle changing key/values correctly', function () {
                collection_1.MapWrapper.set(m, 1, 10);
                collection_1.MapWrapper.set(m, 2, 20);
                changes.check(m);
                collection_1.MapWrapper.set(m, 2, 10);
                collection_1.MapWrapper.set(m, 1, 20);
                changes.check(m);
                test_lib_1.expect(changes.toString()).toEqual(util_1.kvChangesAsString({
                    map: ['1[10->20]', '2[20->10]'],
                    previous: ['1[10->20]', '2[20->10]'],
                    changes: ['1[10->20]', '2[20->10]']
                }));
            });
            test_lib_1.it('should expose previous and current value', function () {
                var previous, current;
                collection_1.MapWrapper.set(m, 1, 10);
                changes.check(m);
                collection_1.MapWrapper.set(m, 1, 20);
                changes.check(m);
                changes.forEachChangedItem(function (record) {
                    previous = record.previousValue;
                    current = record.currentValue;
                });
                test_lib_1.expect(previous).toEqual(10);
                test_lib_1.expect(current).toEqual(20);
            });
            test_lib_1.it('should do basic map watching', function () {
                changes.check(m);
                collection_1.MapWrapper.set(m, 'a', 'A');
                changes.check(m);
                test_lib_1.expect(changes.toString()).toEqual(util_1.kvChangesAsString({
                    map: ['a[null->A]'],
                    additions: ['a[null->A]']
                }));
                collection_1.MapWrapper.set(m, 'b', 'B');
                changes.check(m);
                test_lib_1.expect(changes.toString()).toEqual(util_1.kvChangesAsString({
                    map: ['a', 'b[null->B]'],
                    previous: ['a'],
                    additions: ['b[null->B]']
                }));
                collection_1.MapWrapper.set(m, 'b', 'BB');
                collection_1.MapWrapper.set(m, 'd', 'D');
                changes.check(m);
                test_lib_1.expect(changes.toString()).toEqual(util_1.kvChangesAsString({
                    map: ['a', 'b[B->BB]', 'd[null->D]'],
                    previous: ['a', 'b[B->BB]'],
                    additions: ['d[null->D]'],
                    changes: ['b[B->BB]']
                }));
                collection_1.MapWrapper.delete(m, 'b');
                changes.check(m);
                test_lib_1.expect(changes.toString()).toEqual(util_1.kvChangesAsString({
                    map: ['a', 'd'],
                    previous: ['a', 'b[BB->null]', 'd'],
                    removals: ['b[BB->null]']
                }));
                collection_1.MapWrapper.clear(m);
                changes.check(m);
                test_lib_1.expect(changes.toString()).toEqual(util_1.kvChangesAsString({
                    previous: ['a[A->null]', 'd[D->null]'],
                    removals: ['a[A->null]', 'd[D->null]']
                }));
            });
            test_lib_1.it('should test string by value rather than by reference (DART)', function () {
                collection_1.MapWrapper.set(m, 'foo', 'bar');
                changes.check(m);
                var f = 'f';
                var oo = 'oo';
                var b = 'b';
                var ar = 'ar';
                collection_1.MapWrapper.set(m, f + oo, b + ar);
                changes.check(m);
                test_lib_1.expect(changes.toString()).toEqual(util_1.kvChangesAsString({
                    map: ['foo'],
                    previous: ['foo']
                }));
            });
            test_lib_1.it('should not see a NaN value as a change (JS)', function () {
                collection_1.MapWrapper.set(m, 'foo', lang_1.NumberWrapper.NaN);
                changes.check(m);
                changes.check(m);
                test_lib_1.expect(changes.toString()).toEqual(util_1.kvChangesAsString({
                    map: ['foo'],
                    previous: ['foo']
                }));
            });
            if (lang_1.isJsObject({})) {
                test_lib_1.describe('JsObject changes', function () {
                    test_lib_1.it('should support JS Object', function () {
                        test_lib_1.expect(keyvalue_changes_1.KeyValueChanges.supportsObj({})).toBeTruthy();
                        test_lib_1.expect(keyvalue_changes_1.KeyValueChanges.supportsObj("not supported")).toBeFalsy();
                        test_lib_1.expect(keyvalue_changes_1.KeyValueChanges.supportsObj(0)).toBeFalsy();
                        test_lib_1.expect(keyvalue_changes_1.KeyValueChanges.supportsObj(null)).toBeFalsy();
                    });
                    test_lib_1.it('should do basic object watching', function () {
                        m = {};
                        changes.check(m);
                        m['a'] = 'A';
                        changes.check(m);
                        test_lib_1.expect(changes.toString()).toEqual(util_1.kvChangesAsString({
                            map: ['a[null->A]'],
                            additions: ['a[null->A]']
                        }));
                        m['b'] = 'B';
                        changes.check(m);
                        test_lib_1.expect(changes.toString()).toEqual(util_1.kvChangesAsString({
                            map: ['a', 'b[null->B]'],
                            previous: ['a'],
                            additions: ['b[null->B]']
                        }));
                        m['b'] = 'BB';
                        m['d'] = 'D';
                        changes.check(m);
                        test_lib_1.expect(changes.toString()).toEqual(util_1.kvChangesAsString({
                            map: ['a', 'b[B->BB]', 'd[null->D]'],
                            previous: ['a', 'b[B->BB]'],
                            additions: ['d[null->D]'],
                            changes: ['b[B->BB]']
                        }));
                        m = {};
                        m['a'] = 'A';
                        m['d'] = 'D';
                        changes.check(m);
                        test_lib_1.expect(changes.toString()).toEqual(util_1.kvChangesAsString({
                            map: ['a', 'd'],
                            previous: ['a', 'b[BB->null]', 'd'],
                            removals: ['b[BB->null]']
                        }));
                        m = {};
                        changes.check(m);
                        test_lib_1.expect(changes.toString()).toEqual(util_1.kvChangesAsString({
                            previous: ['a[A->null]', 'd[D->null]'],
                            removals: ['a[A->null]', 'd[D->null]']
                        }));
                    });
                });
            }
        });
    });
}
exports.main = main;
