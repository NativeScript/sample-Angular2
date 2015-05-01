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
var iterable_changes_1 = require('angular2/src/change_detection/pipes/iterable_changes');
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var iterable_1 = require('./iterable');
var util_1 = require('./util');
function main() {
    test_lib_1.describe('collection_changes', function () {
        test_lib_1.describe('CollectionChanges', function () {
            var changes;
            var l;
            test_lib_1.beforeEach(function () {
                changes = new iterable_changes_1.IterableChanges();
            });
            test_lib_1.afterEach(function () {
                changes = null;
            });
            test_lib_1.it('should support list and iterables', function () {
                test_lib_1.expect(iterable_changes_1.IterableChanges.supportsObj([])).toBeTruthy();
                test_lib_1.expect(iterable_changes_1.IterableChanges.supportsObj(new iterable_1.TestIterable())).toBeTruthy();
                test_lib_1.expect(iterable_changes_1.IterableChanges.supportsObj(collection_1.MapWrapper.create())).toBeFalsy();
                test_lib_1.expect(iterable_changes_1.IterableChanges.supportsObj(null)).toBeFalsy();
            });
            test_lib_1.it('should support iterables', function () {
                l = new iterable_1.TestIterable();
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({ collection: [] }));
                l.list = [1];
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['1[null->0]'],
                    additions: ['1[null->0]']
                }));
                l.list = [2, 1];
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['2[null->0]', '1[0->1]'],
                    previous: ['1[0->1]'],
                    additions: ['2[null->0]'],
                    moves: ['1[0->1]']
                }));
            });
            test_lib_1.it('should detect additions', function () {
                l = [];
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({ collection: [] }));
                collection_1.ListWrapper.push(l, 'a');
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['a[null->0]'],
                    additions: ['a[null->0]']
                }));
                collection_1.ListWrapper.push(l, 'b');
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['a', 'b[null->1]'],
                    previous: ['a'],
                    additions: ['b[null->1]']
                }));
            });
            test_lib_1.it('should support changing the reference', function () {
                l = [0];
                changes.check(l);
                l = [1, 0];
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['1[null->0]', '0[0->1]'],
                    previous: ['0[0->1]'],
                    additions: ['1[null->0]'],
                    moves: ['0[0->1]']
                }));
                l = [2, 1, 0];
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['2[null->0]', '1[0->1]', '0[1->2]'],
                    previous: ['1[0->1]', '0[1->2]'],
                    additions: ['2[null->0]'],
                    moves: ['1[0->1]', '0[1->2]']
                }));
            });
            test_lib_1.it('should handle swapping element', function () {
                l = [1, 2];
                changes.check(l);
                collection_1.ListWrapper.clear(l);
                collection_1.ListWrapper.push(l, 2);
                collection_1.ListWrapper.push(l, 1);
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['2[1->0]', '1[0->1]'],
                    previous: ['1[0->1]', '2[1->0]'],
                    moves: ['2[1->0]', '1[0->1]']
                }));
            });
            test_lib_1.it('should handle swapping element', function () {
                l = ['a', 'b', 'c'];
                changes.check(l);
                collection_1.ListWrapper.removeAt(l, 1);
                collection_1.ListWrapper.insert(l, 0, 'b');
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['b[1->0]', 'a[0->1]', 'c'],
                    previous: ['a[0->1]', 'b[1->0]', 'c'],
                    moves: ['b[1->0]', 'a[0->1]']
                }));
                collection_1.ListWrapper.removeAt(l, 1);
                collection_1.ListWrapper.push(l, 'a');
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['b', 'c[2->1]', 'a[1->2]'],
                    previous: ['b', 'a[1->2]', 'c[2->1]'],
                    moves: ['c[2->1]', 'a[1->2]']
                }));
            });
            test_lib_1.it('should detect changes in list', function () {
                l = [];
                changes.check(l);
                collection_1.ListWrapper.push(l, 'a');
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['a[null->0]'],
                    additions: ['a[null->0]']
                }));
                collection_1.ListWrapper.push(l, 'b');
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['a', 'b[null->1]'],
                    previous: ['a'],
                    additions: ['b[null->1]']
                }));
                collection_1.ListWrapper.push(l, 'c');
                collection_1.ListWrapper.push(l, 'd');
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['a', 'b', 'c[null->2]', 'd[null->3]'],
                    previous: ['a', 'b'],
                    additions: ['c[null->2]', 'd[null->3]']
                }));
                collection_1.ListWrapper.removeAt(l, 2);
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['a', 'b', 'd[3->2]'],
                    previous: ['a', 'b', 'c[2->null]', 'd[3->2]'],
                    moves: ['d[3->2]'],
                    removals: ['c[2->null]']
                }));
                collection_1.ListWrapper.clear(l);
                collection_1.ListWrapper.push(l, 'd');
                collection_1.ListWrapper.push(l, 'c');
                collection_1.ListWrapper.push(l, 'b');
                collection_1.ListWrapper.push(l, 'a');
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['d[2->0]', 'c[null->1]', 'b[1->2]', 'a[0->3]'],
                    previous: ['a[0->3]', 'b[1->2]', 'd[2->0]'],
                    additions: ['c[null->1]'],
                    moves: ['d[2->0]', 'b[1->2]', 'a[0->3]']
                }));
            });
            test_lib_1.it('should test string by value rather than by reference (Dart)', function () {
                l = ['a', 'boo'];
                changes.check(l);
                var b = 'b';
                var oo = 'oo';
                collection_1.ListWrapper.set(l, 1, b + oo);
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['a', 'boo'],
                    previous: ['a', 'boo']
                }));
            });
            test_lib_1.it('should ignore [NaN] != [NaN] (JS)', function () {
                l = [lang_1.NumberWrapper.NaN];
                changes.check(l);
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: [lang_1.NumberWrapper.NaN],
                    previous: [lang_1.NumberWrapper.NaN]
                }));
            });
            test_lib_1.it('should detect [NaN] moves', function () {
                l = [lang_1.NumberWrapper.NaN, lang_1.NumberWrapper.NaN];
                changes.check(l);
                collection_1.ListWrapper.insert(l, 0, 'foo');
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['foo[null->0]', 'NaN[0->1]', 'NaN[1->2]'],
                    previous: ['NaN[0->1]', 'NaN[1->2]'],
                    additions: ['foo[null->0]'],
                    moves: ['NaN[0->1]', 'NaN[1->2]']
                }));
            });
            test_lib_1.it('should remove and add same item', function () {
                l = ['a', 'b', 'c'];
                changes.check(l);
                collection_1.ListWrapper.removeAt(l, 1);
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['a', 'c[2->1]'],
                    previous: ['a', 'b[1->null]', 'c[2->1]'],
                    moves: ['c[2->1]'],
                    removals: ['b[1->null]']
                }));
                collection_1.ListWrapper.insert(l, 1, 'b');
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['a', 'b[null->1]', 'c[1->2]'],
                    previous: ['a', 'c[1->2]'],
                    additions: ['b[null->1]'],
                    moves: ['c[1->2]']
                }));
            });
            test_lib_1.it('should support duplicates', function () {
                l = ['a', 'a', 'a', 'b', 'b'];
                changes.check(l);
                collection_1.ListWrapper.removeAt(l, 0);
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['a', 'a', 'b[3->2]', 'b[4->3]'],
                    previous: ['a', 'a', 'a[2->null]', 'b[3->2]', 'b[4->3]'],
                    moves: ['b[3->2]', 'b[4->3]'],
                    removals: ['a[2->null]']
                }));
            });
            test_lib_1.it('should support insertions/moves', function () {
                l = ['a', 'a', 'b', 'b'];
                changes.check(l);
                collection_1.ListWrapper.insert(l, 0, 'b');
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['b[2->0]', 'a[0->1]', 'a[1->2]', 'b', 'b[null->4]'],
                    previous: ['a[0->1]', 'a[1->2]', 'b[2->0]', 'b'],
                    additions: ['b[null->4]'],
                    moves: ['b[2->0]', 'a[0->1]', 'a[1->2]']
                }));
            });
            test_lib_1.it('should not report unnecessary moves', function () {
                l = ['a', 'b', 'c'];
                changes.check(l);
                collection_1.ListWrapper.clear(l);
                collection_1.ListWrapper.push(l, 'b');
                collection_1.ListWrapper.push(l, 'a');
                collection_1.ListWrapper.push(l, 'c');
                changes.check(l);
                test_lib_1.expect(changes.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['b[1->0]', 'a[0->1]', 'c'],
                    previous: ['a[0->1]', 'b[1->0]', 'c'],
                    moves: ['b[1->0]', 'a[0->1]']
                }));
            });
        });
    });
}
exports.main = main;
