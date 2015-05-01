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
var annotations_1 = require('angular2/src/core/annotations/annotations');
var view_container_1 = require('angular2/src/core/compiler/view_container');
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var For = (function () {
    function For(viewContainer) {
        this.viewContainer = viewContainer;
    }
    Object.defineProperty(For.prototype, "iterableChanges", {
        set: function (changes) {
            if (lang_1.isBlank(changes)) {
                this.viewContainer.clear();
                return;
            }
            var recordViewTuples = [];
            changes.forEachRemovedItem(function (removedRecord) { return collection_1.ListWrapper.push(recordViewTuples, new RecordViewTuple(removedRecord, null)); });
            changes.forEachMovedItem(function (movedRecord) { return collection_1.ListWrapper.push(recordViewTuples, new RecordViewTuple(movedRecord, null)); });
            var insertTuples = For.bulkRemove(recordViewTuples, this.viewContainer);
            changes.forEachAddedItem(function (addedRecord) { return collection_1.ListWrapper.push(insertTuples, new RecordViewTuple(addedRecord, null)); });
            For.bulkInsert(insertTuples, this.viewContainer);
            for (var i = 0; i < insertTuples.length; i++) {
                this.perViewChange(insertTuples[i].view, insertTuples[i].record);
            }
        },
        enumerable: true,
        configurable: true
    });
    For.prototype.perViewChange = function (view, record) {
        view.setLocal('\$implicit', record.item);
        view.setLocal('index', record.currentIndex);
    };
    For.bulkRemove = function (tuples, viewContainer) {
        tuples.sort(function (a, b) { return a.record.previousIndex - b.record.previousIndex; });
        var movedTuples = [];
        for (var i = tuples.length - 1; i >= 0; i--) {
            var tuple = tuples[i];
            if (lang_1.isPresent(tuple.record.currentIndex)) {
                tuple.view = viewContainer.detach(tuple.record.previousIndex);
                collection_1.ListWrapper.push(movedTuples, tuple);
            }
            else {
                viewContainer.remove(tuple.record.previousIndex);
            }
        }
        return movedTuples;
    };
    For.bulkInsert = function (tuples, viewContainer) {
        tuples.sort(function (a, b) { return a.record.currentIndex - b.record.currentIndex; });
        for (var i = 0; i < tuples.length; i++) {
            var tuple = tuples[i];
            if (lang_1.isPresent(tuple.view)) {
                viewContainer.insert(tuple.view, tuple.record.currentIndex);
            }
            else {
                tuple.view = viewContainer.create(tuple.record.currentIndex);
            }
        }
        return tuples;
    };
    return For;
})();
exports.For = For;
Object.defineProperty(For, "annotations", { get: function () {
        return [new annotations_1.Viewport({
                selector: '[for][of]',
                bind: { 'iterableChanges': 'of | iterableDiff' }
            })];
    } });
Object.defineProperty(For, "parameters", { get: function () {
        return [[view_container_1.ViewContainer]];
    } });
var RecordViewTuple = (function () {
    function RecordViewTuple(record, view) {
        this.record = record;
        this.view = view;
    }
    return RecordViewTuple;
})();
