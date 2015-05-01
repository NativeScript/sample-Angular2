var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var pipe_1 = require('./pipe');
var KeyValueChangesFactory = (function () {
    function KeyValueChangesFactory() {
    }
    KeyValueChangesFactory.prototype.supports = function (obj) {
        return KeyValueChanges.supportsObj(obj);
    };
    KeyValueChangesFactory.prototype.create = function (bpc) {
        return new KeyValueChanges();
    };
    return KeyValueChangesFactory;
})();
exports.KeyValueChangesFactory = KeyValueChangesFactory;
var KeyValueChanges = (function (_super) {
    __extends(KeyValueChanges, _super);
    function KeyValueChanges() {
        _super.call(this);
        this._records = collection_1.MapWrapper.create();
        this._mapHead = null;
        this._previousMapHead = null;
        this._changesHead = null;
        this._changesTail = null;
        this._additionsHead = null;
        this._additionsTail = null;
        this._removalsHead = null;
        this._removalsTail = null;
    }
    KeyValueChanges.supportsObj = function (obj) {
        return obj instanceof Map || lang_1.isJsObject(obj);
    };
    KeyValueChanges.prototype.supports = function (obj) {
        return KeyValueChanges.supportsObj(obj);
    };
    KeyValueChanges.prototype.transform = function (map) {
        if (this.check(map)) {
            return this;
        }
        else {
            return pipe_1.NO_CHANGE;
        }
    };
    Object.defineProperty(KeyValueChanges.prototype, "isDirty", {
        get: function () {
            return this._additionsHead !== null || this._changesHead !== null || this._removalsHead !== null;
        },
        enumerable: true,
        configurable: true
    });
    KeyValueChanges.prototype.forEachItem = function (fn) {
        var record;
        for (record = this._mapHead; record !== null; record = record._next) {
            fn(record);
        }
    };
    KeyValueChanges.prototype.forEachPreviousItem = function (fn) {
        var record;
        for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
            fn(record);
        }
    };
    KeyValueChanges.prototype.forEachChangedItem = function (fn) {
        var record;
        for (record = this._changesHead; record !== null; record = record._nextChanged) {
            fn(record);
        }
    };
    KeyValueChanges.prototype.forEachAddedItem = function (fn) {
        var record;
        for (record = this._additionsHead; record !== null; record = record._nextAdded) {
            fn(record);
        }
    };
    KeyValueChanges.prototype.forEachRemovedItem = function (fn) {
        var record;
        for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
            fn(record);
        }
    };
    KeyValueChanges.prototype.check = function (map) {
        var _this = this;
        this._reset();
        var records = this._records;
        var oldSeqRecord = this._mapHead;
        var lastOldSeqRecord = null;
        var lastNewSeqRecord = null;
        var seqChanged = false;
        this._forEach(map, function (value, key) {
            var newSeqRecord;
            if (oldSeqRecord !== null && key === oldSeqRecord.key) {
                newSeqRecord = oldSeqRecord;
                if (!lang_1.looseIdentical(value, oldSeqRecord.currentValue)) {
                    oldSeqRecord.previousValue = oldSeqRecord.currentValue;
                    oldSeqRecord.currentValue = value;
                    _this._addToChanges(oldSeqRecord);
                }
            }
            else {
                seqChanged = true;
                if (oldSeqRecord !== null) {
                    oldSeqRecord._next = null;
                    _this._removeFromSeq(lastOldSeqRecord, oldSeqRecord);
                    _this._addToRemovals(oldSeqRecord);
                }
                if (collection_1.MapWrapper.contains(records, key)) {
                    newSeqRecord = collection_1.MapWrapper.get(records, key);
                }
                else {
                    newSeqRecord = new KVChangeRecord(key);
                    collection_1.MapWrapper.set(records, key, newSeqRecord);
                    newSeqRecord.currentValue = value;
                    _this._addToAdditions(newSeqRecord);
                }
            }
            if (seqChanged) {
                if (_this._isInRemovals(newSeqRecord)) {
                    _this._removeFromRemovals(newSeqRecord);
                }
                if (lastNewSeqRecord == null) {
                    _this._mapHead = newSeqRecord;
                }
                else {
                    lastNewSeqRecord._next = newSeqRecord;
                }
            }
            lastOldSeqRecord = oldSeqRecord;
            lastNewSeqRecord = newSeqRecord;
            oldSeqRecord = oldSeqRecord === null ? null : oldSeqRecord._next;
        });
        this._truncate(lastOldSeqRecord, oldSeqRecord);
        return this.isDirty;
    };
    KeyValueChanges.prototype._reset = function () {
        if (this.isDirty) {
            var record;
            for (record = this._previousMapHead = this._mapHead; record !== null; record = record._next) {
                record._nextPrevious = record._next;
            }
            for (record = this._changesHead; record !== null; record = record._nextChanged) {
                record.previousValue = record.currentValue;
            }
            for (record = this._additionsHead; record != null; record = record._nextAdded) {
                record.previousValue = record.currentValue;
            }
            this._changesHead = this._changesTail = null;
            this._additionsHead = this._additionsTail = null;
            this._removalsHead = this._removalsTail = null;
        }
    };
    KeyValueChanges.prototype._truncate = function (lastRecord, record) {
        while (record !== null) {
            if (lastRecord === null) {
                this._mapHead = null;
            }
            else {
                lastRecord._next = null;
            }
            var nextRecord = record._next;
            this._addToRemovals(record);
            lastRecord = record;
            record = nextRecord;
        }
        for (var rec = this._removalsHead; rec !== null; rec = rec._nextRemoved) {
            rec.previousValue = rec.currentValue;
            rec.currentValue = null;
            collection_1.MapWrapper.delete(this._records, rec.key);
        }
    };
    KeyValueChanges.prototype._isInRemovals = function (record) {
        return record === this._removalsHead || record._nextRemoved !== null || record._prevRemoved !== null;
    };
    KeyValueChanges.prototype._addToRemovals = function (record) {
        if (this._removalsHead === null) {
            this._removalsHead = this._removalsTail = record;
        }
        else {
            this._removalsTail._nextRemoved = record;
            record._prevRemoved = this._removalsTail;
            this._removalsTail = record;
        }
    };
    KeyValueChanges.prototype._removeFromSeq = function (prev, record) {
        var next = record._next;
        if (prev === null) {
            this._mapHead = next;
        }
        else {
            prev._next = next;
        }
    };
    KeyValueChanges.prototype._removeFromRemovals = function (record) {
        var prev = record._prevRemoved;
        var next = record._nextRemoved;
        if (prev === null) {
            this._removalsHead = next;
        }
        else {
            prev._nextRemoved = next;
        }
        if (next === null) {
            this._removalsTail = prev;
        }
        else {
            next._prevRemoved = prev;
        }
        record._prevRemoved = record._nextRemoved = null;
    };
    KeyValueChanges.prototype._addToAdditions = function (record) {
        if (this._additionsHead === null) {
            this._additionsHead = this._additionsTail = record;
        }
        else {
            this._additionsTail._nextAdded = record;
            this._additionsTail = record;
        }
    };
    KeyValueChanges.prototype._addToChanges = function (record) {
        if (this._changesHead === null) {
            this._changesHead = this._changesTail = record;
        }
        else {
            this._changesTail._nextChanged = record;
            this._changesTail = record;
        }
    };
    KeyValueChanges.prototype.toString = function () {
        var items = [];
        var previous = [];
        var changes = [];
        var additions = [];
        var removals = [];
        var record;
        for (record = this._mapHead; record !== null; record = record._next) {
            collection_1.ListWrapper.push(items, lang_1.stringify(record));
        }
        for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
            collection_1.ListWrapper.push(previous, lang_1.stringify(record));
        }
        for (record = this._changesHead; record !== null; record = record._nextChanged) {
            collection_1.ListWrapper.push(changes, lang_1.stringify(record));
        }
        for (record = this._additionsHead; record !== null; record = record._nextAdded) {
            collection_1.ListWrapper.push(additions, lang_1.stringify(record));
        }
        for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
            collection_1.ListWrapper.push(removals, lang_1.stringify(record));
        }
        return "map: " + items.join(', ') + "\n" + "previous: " + previous.join(', ') + "\n" + "additions: " + additions.join(', ') + "\n" + "changes: " + changes.join(', ') + "\n" + "removals: " + removals.join(', ') + "\n";
    };
    KeyValueChanges.prototype._forEach = function (obj, fn) {
        if (obj instanceof Map) {
            collection_1.MapWrapper.forEach(obj, fn);
        }
        else {
            collection_1.StringMapWrapper.forEach(obj, fn);
        }
    };
    return KeyValueChanges;
})(pipe_1.Pipe);
exports.KeyValueChanges = KeyValueChanges;
Object.defineProperty(KeyValueChanges.prototype.forEachItem, "parameters", { get: function () {
        return [[Function]];
    } });
Object.defineProperty(KeyValueChanges.prototype.forEachPreviousItem, "parameters", { get: function () {
        return [[Function]];
    } });
Object.defineProperty(KeyValueChanges.prototype.forEachChangedItem, "parameters", { get: function () {
        return [[Function]];
    } });
Object.defineProperty(KeyValueChanges.prototype.forEachAddedItem, "parameters", { get: function () {
        return [[Function]];
    } });
Object.defineProperty(KeyValueChanges.prototype.forEachRemovedItem, "parameters", { get: function () {
        return [[Function]];
    } });
Object.defineProperty(KeyValueChanges.prototype._truncate, "parameters", { get: function () {
        return [[KVChangeRecord], [KVChangeRecord]];
    } });
Object.defineProperty(KeyValueChanges.prototype._isInRemovals, "parameters", { get: function () {
        return [[KVChangeRecord]];
    } });
Object.defineProperty(KeyValueChanges.prototype._addToRemovals, "parameters", { get: function () {
        return [[KVChangeRecord]];
    } });
Object.defineProperty(KeyValueChanges.prototype._removeFromSeq, "parameters", { get: function () {
        return [[KVChangeRecord], [KVChangeRecord]];
    } });
Object.defineProperty(KeyValueChanges.prototype._removeFromRemovals, "parameters", { get: function () {
        return [[KVChangeRecord]];
    } });
Object.defineProperty(KeyValueChanges.prototype._addToAdditions, "parameters", { get: function () {
        return [[KVChangeRecord]];
    } });
Object.defineProperty(KeyValueChanges.prototype._addToChanges, "parameters", { get: function () {
        return [[KVChangeRecord]];
    } });
Object.defineProperty(KeyValueChanges.prototype._forEach, "parameters", { get: function () {
        return [[], [Function]];
    } });
var KVChangeRecord = (function () {
    function KVChangeRecord(key) {
        this.key = key;
        this.previousValue = null;
        this.currentValue = null;
        this._nextPrevious = null;
        this._next = null;
        this._nextAdded = null;
        this._nextRemoved = null;
        this._prevRemoved = null;
        this._nextChanged = null;
    }
    KVChangeRecord.prototype.toString = function () {
        return lang_1.looseIdentical(this.previousValue, this.currentValue) ? lang_1.stringify(this.key) : (lang_1.stringify(this.key) + '[' + lang_1.stringify(this.previousValue) + '->' + lang_1.stringify(this.currentValue) + ']');
    };
    return KVChangeRecord;
})();
exports.KVChangeRecord = KVChangeRecord;
