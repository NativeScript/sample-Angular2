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
var modelModule = require('./model');
var Validators = (function () {
    function Validators() {
    }
    Validators.required = function (c) {
        return lang_1.isBlank(c.value) || c.value == "" ? { "required": true } : null;
    };
    Validators.nullValidator = function (c) {
        return null;
    };
    Validators.compose = function (validators) {
        return function (c) {
            var res = collection_1.ListWrapper.reduce(validators, function (res, validator) {
                var errors = validator(c);
                return lang_1.isPresent(errors) ? collection_1.StringMapWrapper.merge(res, errors) : res;
            }, {});
            return collection_1.StringMapWrapper.isEmpty(res) ? null : res;
        };
    };
    Validators.group = function (c) {
        var res = {};
        collection_1.StringMapWrapper.forEach(c.controls, function (control, name) {
            if (c.contains(name) && lang_1.isPresent(control.errors)) {
                Validators._mergeErrors(control, res);
            }
        });
        return collection_1.StringMapWrapper.isEmpty(res) ? null : res;
    };
    Validators.array = function (c) {
        var res = {};
        collection_1.ListWrapper.forEach(c.controls, function (control) {
            if (lang_1.isPresent(control.errors)) {
                Validators._mergeErrors(control, res);
            }
        });
        return collection_1.StringMapWrapper.isEmpty(res) ? null : res;
    };
    Validators._mergeErrors = function (control, res) {
        collection_1.StringMapWrapper.forEach(control.errors, function (value, error) {
            if (!collection_1.StringMapWrapper.contains(res, error)) {
                res[error] = [];
            }
            collection_1.ListWrapper.push(res[error], control);
        });
    };
    return Validators;
})();
exports.Validators = Validators;
Object.defineProperty(Validators.required, "parameters", { get: function () {
        return [[modelModule.Control]];
    } });
Object.defineProperty(Validators.nullValidator, "parameters", { get: function () {
        return [[assert.type.any]];
    } });
Object.defineProperty(Validators.compose, "parameters", { get: function () {
        return [[assert.genericType(collection_1.List, Function)]];
    } });
Object.defineProperty(Validators.group, "parameters", { get: function () {
        return [[modelModule.ControlGroup]];
    } });
Object.defineProperty(Validators.array, "parameters", { get: function () {
        return [[modelModule.ControlArray]];
    } });
