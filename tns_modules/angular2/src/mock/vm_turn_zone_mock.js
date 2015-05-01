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
var vm_turn_zone_1 = require('angular2/src/core/zone/vm_turn_zone');
var MockVmTurnZone = (function (_super) {
    __extends(MockVmTurnZone, _super);
    function MockVmTurnZone() {
        _super.call(this, { enableLongStackTrace: false });
    }
    MockVmTurnZone.prototype.run = function (fn) {
        fn();
    };
    MockVmTurnZone.prototype.runOutsideAngular = function (fn) {
        fn();
    };
    return MockVmTurnZone;
})(vm_turn_zone_1.VmTurnZone);
exports.MockVmTurnZone = MockVmTurnZone;
