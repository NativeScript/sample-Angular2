// Tests for RxJS-BackPressure TypeScript definitions
// Tests by Igor Oleinikov <https://github.com/Igorbek>
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
///<reference path="rx.d.ts" />
///<reference path="rx.backpressure.d.ts" />
function testPausable() {
    var o;
    var pauser = new Rx.Subject();
    var p = o.pausable(pauser);
    p = o.pausableBuffered(pauser);
}
function testControlled() {
    var o;
    var c = o.controlled();
    var d = c.request();
    d = c.request(5);
}
