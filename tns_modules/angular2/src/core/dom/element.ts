import {DOM} from 'angular2/src/dom/dom_adapter';
import {normalizeBlank} from 'angular2/src/facade/lang';
export class NgElement {
  constructor(domElement) {
    this.domElement = domElement;
  }
  getAttribute(name) {
    return normalizeBlank(DOM.getAttribute(this.domElement, name));
  }
}
Object.defineProperty(NgElement.prototype.getAttribute, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
//# sourceMappingURL=element.js.map

//# sourceMappingURL=./element.map