import {Decorator} from 'angular2/angular2';
import {ControlDirective,
  Validators} from 'angular2/forms';
export class RequiredValidatorDirective {
  constructor(c) {
    c.validator = Validators.compose([c.validator, Validators.required]);
  }
}
Object.defineProperty(RequiredValidatorDirective, "annotations", {get: function() {
    return [new Decorator({selector: '[required]'})];
  }});
Object.defineProperty(RequiredValidatorDirective, "parameters", {get: function() {
    return [[ControlDirective]];
  }});
//# sourceMappingURL=validator_directives.js.map

//# sourceMappingURL=./validator_directives.map