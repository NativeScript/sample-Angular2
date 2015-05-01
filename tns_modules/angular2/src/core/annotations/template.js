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
var Template = (function () {
    function Template(_a) {
        var url = _a.url, inline = _a.inline, directives = _a.directives, formatters = _a.formatters, source = _a.source, locale = _a.locale, device = _a.device;
        this.url = url;
        this.inline = inline;
        this.directives = directives;
        this.formatters = formatters;
        this.source = source;
        this.locale = locale;
        this.device = device;
    }
    return Template;
})();
exports.Template = Template;
Object.defineProperty(Template, "annotations", { get: function () {
        return [new lang_1.CONST()];
    } });
