import {Decorator} from 'angular2/src/core/annotations/annotations';
export class NonBindable {}
Object.defineProperty(NonBindable, "annotations", {get: function() {
    return [new Decorator({
      selector: '[non-bindable]',
      compileChildren: false
    })];
  }});
//# sourceMappingURL=non_bindable.js.map

//# sourceMappingURL=./non_bindable.map