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
var collection_1 = require('angular2/src/facade/collection');
var proto_record_1 = require('./proto_record');
function coalesce(records) {
    var res = collection_1.ListWrapper.create();
    var indexMap = collection_1.MapWrapper.create();
    for (var i = 0; i < records.length; ++i) {
        var r = records[i];
        var record = _replaceIndices(r, res.length + 1, indexMap);
        var matchingRecord = _findMatching(record, res);
        if (lang_1.isPresent(matchingRecord) && record.lastInBinding) {
            collection_1.ListWrapper.push(res, _selfRecord(record, matchingRecord.selfIndex, res.length + 1));
            collection_1.MapWrapper.set(indexMap, r.selfIndex, matchingRecord.selfIndex);
        }
        else if (lang_1.isPresent(matchingRecord) && !record.lastInBinding) {
            collection_1.MapWrapper.set(indexMap, r.selfIndex, matchingRecord.selfIndex);
        }
        else {
            collection_1.ListWrapper.push(res, record);
            collection_1.MapWrapper.set(indexMap, r.selfIndex, record.selfIndex);
        }
    }
    return res;
}
exports.coalesce = coalesce;
Object.defineProperty(coalesce, "parameters", { get: function () {
        return [[assert.genericType(collection_1.List, proto_record_1.ProtoRecord)]];
    } });
function _selfRecord(r, contextIndex, selfIndex) {
    return new proto_record_1.ProtoRecord(proto_record_1.RECORD_TYPE_SELF, "self", null, [], r.fixedArgs, contextIndex, selfIndex, r.bindingMemento, r.directiveMemento, r.expressionAsString, r.lastInBinding, r.lastInDirective);
}
Object.defineProperty(_selfRecord, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord], [assert.type.number], [assert.type.number]];
    } });
function _findMatching(r, rs) {
    return collection_1.ListWrapper.find(rs, function (rr) { return rr.mode === r.mode && rr.funcOrValue === r.funcOrValue && rr.contextIndex === r.contextIndex && collection_1.ListWrapper.equals(rr.args, r.args); });
}
Object.defineProperty(_findMatching, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord], [assert.genericType(collection_1.List, proto_record_1.ProtoRecord)]];
    } });
function _replaceIndices(r, selfIndex, indexMap) {
    var args = collection_1.ListWrapper.map(r.args, function (a) { return _map(indexMap, a); });
    var contextIndex = _map(indexMap, r.contextIndex);
    return new proto_record_1.ProtoRecord(r.mode, r.name, r.funcOrValue, args, r.fixedArgs, contextIndex, selfIndex, r.bindingMemento, r.directiveMemento, r.expressionAsString, r.lastInBinding, r.lastInDirective);
}
Object.defineProperty(_replaceIndices, "parameters", { get: function () {
        return [[proto_record_1.ProtoRecord], [assert.type.number], [collection_1.Map]];
    } });
function _map(indexMap, value) {
    var r = collection_1.MapWrapper.get(indexMap, value);
    return lang_1.isPresent(r) ? r : value;
}
Object.defineProperty(_map, "parameters", { get: function () {
        return [[collection_1.Map], [assert.type.number]];
    } });
