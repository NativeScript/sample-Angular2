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
exports.CHECK_ONCE = "CHECK_ONCE";
exports.CHECKED = "CHECKED";
exports.CHECK_ALWAYS = "ALWAYS_CHECK";
exports.DETACHED = "DETACHED";
exports.ON_PUSH = "ON_PUSH";
exports.DEFAULT = "DEFAULT";
