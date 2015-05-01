import {Decorator} from 'angular2/src/core/annotations/annotations';
import {isPresent} from 'angular2/src/facade/lang';
import {DOM} from 'angular2/src/dom/dom_adapter';
import {NgElement} from 'angular2/src/core/dom/element';
export class CSSClass {
  constructor(ngEl) {
    this._domEl = ngEl.domElement;
  }
  _toggleClass(className, enabled) {
    if (enabled) {
      DOM.addClass(this._domEl, className);
    } else {
      DOM.removeClass(this._domEl, className);
    }
  }
  set iterableChanges(changes) {
    if (isPresent(changes)) {
      changes.forEachAddedItem((record) => {
        this._toggleClass(record.key, record.currentValue);
      });
      changes.forEachChangedItem((record) => {
        this._toggleClass(record.key, record.currentValue);
      });
      changes.forEachRemovedItem((record) => {
        if (record.previousValue) {
          DOM.removeClass(this._domEl, record.key);
        }
      });
    }
  }
}
Object.defineProperty(CSSClass, "annotations", {get: function() {
    return [new Decorator({
      selector: '[class]',
      bind: {'iterableChanges': 'class | keyValDiff'}
    })];
  }});
Object.defineProperty(CSSClass, "parameters", {get: function() {
    return [[NgElement]];
  }});
//# sourceMappingURL=class.js.map

//# sourceMappingURL=./class.map