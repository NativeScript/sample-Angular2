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
var angular2_1 = require('angular2/angular2');
var forms_1 = require('angular2/forms');
var RequiredValidatorDirective = (function () {
    function RequiredValidatorDirective(c) {
        c.validator = forms_1.Validators.compose([c.validator, forms_1.Validators.required]);
    }
    return RequiredValidatorDirective;
})();
exports.RequiredValidatorDirective = RequiredValidatorDirective;
Object.defineProperty(RequiredValidatorDirective, "annotations", { get: function () {
        return [new angular2_1.Decorator({ selector: '[required]' })];
    } });
Object.defineProperty(RequiredValidatorDirective, "parameters", { get: function () {
        return [[forms_1.ControlDirective]];
    } });
