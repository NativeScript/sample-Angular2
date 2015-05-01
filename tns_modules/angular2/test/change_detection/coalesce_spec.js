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
var coalesce_1 = require('angular2/src/change_detection/coalesce');
var proto_record_1 = require('angular2/src/change_detection/proto_record');
function main() {
    function r(funcOrValue, args, contextIndex, selfIndex, lastInBinding) {
        if (lastInBinding === void 0) { lastInBinding = false; }
        return new proto_record_1.ProtoRecord(99, "name", funcOrValue, args, null, contextIndex, selfIndex, null, null, null, lastInBinding, false);
    }
    test_lib_1.describe("change detection - coalesce", function () {
        test_lib_1.it("should work with an empty list", function () {
            test_lib_1.expect(coalesce_1.coalesce([])).toEqual([]);
        });
        test_lib_1.it("should remove non-terminal duplicate records" + " and update the context indices referencing them", function () {
            var rs = coalesce_1.coalesce([r("user", [], 0, 1), r("first", [], 1, 2), r("user", [], 0, 3), r("last", [], 3, 4)]);
            test_lib_1.expect(rs).toEqual([r("user", [], 0, 1), r("first", [], 1, 2), r("last", [], 1, 3)]);
        });
        test_lib_1.it("should update indices of other records", function () {
            var rs = coalesce_1.coalesce([r("dup", [], 0, 1), r("dup", [], 0, 2), r("user", [], 0, 3), r("first", [3], 3, 4)]);
            test_lib_1.expect(rs).toEqual([r("dup", [], 0, 1), r("user", [], 0, 2), r("first", [2], 2, 3)]);
        });
        test_lib_1.it("should remove non-terminal duplicate records" + " and update the args indices referencing them", function () {
            var rs = coalesce_1.coalesce([r("user1", [], 0, 1), r("user2", [], 0, 2), r("hi", [1], 0, 3), r("hi", [1], 0, 4), r("hi", [2], 0, 5)]);
            test_lib_1.expect(rs).toEqual([r("user1", [], 0, 1), r("user2", [], 0, 2), r("hi", [1], 0, 3), r("hi", [2], 0, 4)]);
        });
        test_lib_1.it("should replace duplicate terminal records with" + " self records", function () {
            var rs = coalesce_1.coalesce([r("user", [], 0, 1, true), r("user", [], 0, 2, true)]);
            test_lib_1.expect(rs[1]).toEqual(new proto_record_1.ProtoRecord(proto_record_1.RECORD_TYPE_SELF, "self", null, [], null, 1, 2, null, null, null, true, false));
        });
    });
}
exports.main = main;
