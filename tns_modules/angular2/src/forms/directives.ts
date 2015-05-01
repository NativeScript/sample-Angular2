import {Template,
  Component,
  Decorator,
  Ancestor,
  onChange,
  PropertySetter} from 'angular2/angular2';
import {Optional} from 'angular2/di';
import {isBlank,
  isPresent,
  isString,
  CONST} from 'angular2/src/facade/lang';
import {StringMapWrapper,
  ListWrapper} from 'angular2/src/facade/collection';
import {ControlGroup,
  Control} from './model';
import {Validators} from './validators';
export class DefaultValueAccessor {
  constructor(setValueProperty) {
    this._setValueProperty = setValueProperty;
    this.onChange = (_) => {};
  }
  writeValue(value) {
    this._setValueProperty(value);
  }
}
Object.defineProperty(DefaultValueAccessor, "annotations", {get: function() {
    return [new Decorator({
      selector: '[control]',
      events: {
        'change': 'onChange($event.target.value)',
        'input': 'onChange($event.target.value)'
      }
    })];
  }});
Object.defineProperty(DefaultValueAccessor, "parameters", {get: function() {
    return [[Function, new PropertySetter('value')]];
  }});
export class CheckboxControlValueAccessor {
  constructor(cd, setCheckedProperty) {
    this._setCheckedProperty = setCheckedProperty;
    this.onChange = (_) => {};
    cd.valueAccessor = this;
  }
  writeValue(value) {
    this._setCheckedProperty(value);
  }
}
Object.defineProperty(CheckboxControlValueAccessor, "annotations", {get: function() {
    return [new Decorator({
      selector: 'input[type=checkbox][control]',
      events: {'change': 'onChange($event.target.checked)'}
    })];
  }});
Object.defineProperty(CheckboxControlValueAccessor, "parameters", {get: function() {
    return [[ControlDirective], [Function, new PropertySetter('checked')]];
  }});
export class ControlDirective {
  constructor(groupDirective, valueAccessor) {
    this._groupDirective = groupDirective;
    this.controlOrName = null;
    this.valueAccessor = valueAccessor;
    this.validator = Validators.nullValidator;
  }
  onChange(_) {
    this._initialize();
  }
  _initialize() {
    if (isPresent(this._groupDirective)) {
      this._groupDirective.addDirective(this);
    }
    var c = this._control();
    c.validator = Validators.compose([c.validator, this.validator]);
    this._updateDomValue();
    this._setUpUpdateControlValue();
  }
  _updateDomValue() {
    this.valueAccessor.writeValue(this._control().value);
  }
  _setUpUpdateControlValue() {
    this.valueAccessor.onChange = (newValue) => this._control().updateValue(newValue);
  }
  _control() {
    if (isString(this.controlOrName)) {
      return this._groupDirective.findControl(this.controlOrName);
    } else {
      return this.controlOrName;
    }
  }
}
Object.defineProperty(ControlDirective, "annotations", {get: function() {
    return [new Decorator({
      lifecycle: [onChange],
      selector: '[control]',
      bind: {'controlOrName': 'control'}
    })];
  }});
Object.defineProperty(ControlDirective, "parameters", {get: function() {
    return [[ControlGroupDirective, new Optional(), new Ancestor()], [DefaultValueAccessor]];
  }});
export class ControlGroupDirective {
  constructor(groupDirective) {
    this._groupDirective = groupDirective;
    this._directives = ListWrapper.create();
  }
  set controlGroup(controlGroup) {
    if (isString(controlGroup)) {
      this._controlGroupName = controlGroup;
    } else {
      this._controlGroup = controlGroup;
    }
    this._updateDomValue();
  }
  _updateDomValue() {
    ListWrapper.forEach(this._directives, (cd) => cd._updateDomValue());
  }
  addDirective(c) {
    ListWrapper.push(this._directives, c);
  }
  findControl(name) {
    return this._getControlGroup().controls[name];
  }
  _getControlGroup() {
    if (isPresent(this._controlGroupName)) {
      return this._groupDirective.findControl(this._controlGroupName);
    } else {
      return this._controlGroup;
    }
  }
}
Object.defineProperty(ControlGroupDirective, "annotations", {get: function() {
    return [new Decorator({
      selector: '[control-group]',
      bind: {'controlGroup': 'control-group'}
    })];
  }});
Object.defineProperty(ControlGroupDirective, "parameters", {get: function() {
    return [[ControlGroupDirective, new Optional(), new Ancestor()]];
  }});
Object.defineProperty(ControlGroupDirective.prototype.addDirective, "parameters", {get: function() {
    return [[ControlDirective]];
  }});
Object.defineProperty(ControlGroupDirective.prototype.findControl, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export var FormDirectives = [ControlGroupDirective, ControlDirective, CheckboxControlValueAccessor, DefaultValueAccessor];
//# sourceMappingURL=directives.js.map

//# sourceMappingURL=./directives.map