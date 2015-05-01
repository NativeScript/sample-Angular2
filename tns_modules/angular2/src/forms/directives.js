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
var di_1 = require('angular2/di');
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var validators_1 = require('./validators');
var DefaultValueAccessor = (function () {
    function DefaultValueAccessor(setValueProperty) {
        this._setValueProperty = setValueProperty;
        this.onChange = function (_) { };
    }
    DefaultValueAccessor.prototype.writeValue = function (value) {
        this._setValueProperty(value);
    };
    return DefaultValueAccessor;
})();
exports.DefaultValueAccessor = DefaultValueAccessor;
Object.defineProperty(DefaultValueAccessor, "annotations", { get: function () {
        return [new angular2_1.Decorator({
                selector: '[control]',
                events: {
                    'change': 'onChange($event.target.value)',
                    'input': 'onChange($event.target.value)'
                }
            })];
    } });
Object.defineProperty(DefaultValueAccessor, "parameters", { get: function () {
        return [[Function, new angular2_1.PropertySetter('value')]];
    } });
var CheckboxControlValueAccessor = (function () {
    function CheckboxControlValueAccessor(cd, setCheckedProperty) {
        this._setCheckedProperty = setCheckedProperty;
        this.onChange = function (_) { };
        cd.valueAccessor = this;
    }
    CheckboxControlValueAccessor.prototype.writeValue = function (value) {
        this._setCheckedProperty(value);
    };
    return CheckboxControlValueAccessor;
})();
exports.CheckboxControlValueAccessor = CheckboxControlValueAccessor;
Object.defineProperty(CheckboxControlValueAccessor, "annotations", { get: function () {
        return [new angular2_1.Decorator({
                selector: 'input[type=checkbox][control]',
                events: { 'change': 'onChange($event.target.checked)' }
            })];
    } });
Object.defineProperty(CheckboxControlValueAccessor, "parameters", { get: function () {
        return [[ControlDirective], [Function, new angular2_1.PropertySetter('checked')]];
    } });
var ControlDirective = (function () {
    function ControlDirective(groupDirective, valueAccessor) {
        this._groupDirective = groupDirective;
        this.controlOrName = null;
        this.valueAccessor = valueAccessor;
        this.validator = validators_1.Validators.nullValidator;
    }
    ControlDirective.prototype.onChange = function (_) {
        this._initialize();
    };
    ControlDirective.prototype._initialize = function () {
        if (lang_1.isPresent(this._groupDirective)) {
            this._groupDirective.addDirective(this);
        }
        var c = this._control();
        c.validator = validators_1.Validators.compose([c.validator, this.validator]);
        this._updateDomValue();
        this._setUpUpdateControlValue();
    };
    ControlDirective.prototype._updateDomValue = function () {
        this.valueAccessor.writeValue(this._control().value);
    };
    ControlDirective.prototype._setUpUpdateControlValue = function () {
        var _this = this;
        this.valueAccessor.onChange = function (newValue) { return _this._control().updateValue(newValue); };
    };
    ControlDirective.prototype._control = function () {
        if (lang_1.isString(this.controlOrName)) {
            return this._groupDirective.findControl(this.controlOrName);
        }
        else {
            return this.controlOrName;
        }
    };
    return ControlDirective;
})();
exports.ControlDirective = ControlDirective;
Object.defineProperty(ControlDirective, "annotations", { get: function () {
        return [new angular2_1.Decorator({
                lifecycle: [angular2_1.onChange],
                selector: '[control]',
                bind: { 'controlOrName': 'control' }
            })];
    } });
Object.defineProperty(ControlDirective, "parameters", { get: function () {
        return [[ControlGroupDirective, new di_1.Optional(), new angular2_1.Ancestor()], [DefaultValueAccessor]];
    } });
var ControlGroupDirective = (function () {
    function ControlGroupDirective(groupDirective) {
        this._groupDirective = groupDirective;
        this._directives = collection_1.ListWrapper.create();
    }
    Object.defineProperty(ControlGroupDirective.prototype, "controlGroup", {
        set: function (controlGroup) {
            if (lang_1.isString(controlGroup)) {
                this._controlGroupName = controlGroup;
            }
            else {
                this._controlGroup = controlGroup;
            }
            this._updateDomValue();
        },
        enumerable: true,
        configurable: true
    });
    ControlGroupDirective.prototype._updateDomValue = function () {
        collection_1.ListWrapper.forEach(this._directives, function (cd) { return cd._updateDomValue(); });
    };
    ControlGroupDirective.prototype.addDirective = function (c) {
        collection_1.ListWrapper.push(this._directives, c);
    };
    ControlGroupDirective.prototype.findControl = function (name) {
        return this._getControlGroup().controls[name];
    };
    ControlGroupDirective.prototype._getControlGroup = function () {
        if (lang_1.isPresent(this._controlGroupName)) {
            return this._groupDirective.findControl(this._controlGroupName);
        }
        else {
            return this._controlGroup;
        }
    };
    return ControlGroupDirective;
})();
exports.ControlGroupDirective = ControlGroupDirective;
Object.defineProperty(ControlGroupDirective, "annotations", { get: function () {
        return [new angular2_1.Decorator({
                selector: '[control-group]',
                bind: { 'controlGroup': 'control-group' }
            })];
    } });
Object.defineProperty(ControlGroupDirective, "parameters", { get: function () {
        return [[ControlGroupDirective, new di_1.Optional(), new angular2_1.Ancestor()]];
    } });
Object.defineProperty(ControlGroupDirective.prototype.addDirective, "parameters", { get: function () {
        return [[ControlDirective]];
    } });
Object.defineProperty(ControlGroupDirective.prototype.findControl, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
exports.FormDirectives = [ControlGroupDirective, ControlDirective, CheckboxControlValueAccessor, DefaultValueAccessor];
