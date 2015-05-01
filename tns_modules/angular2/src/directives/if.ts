import {Viewport} from 'angular2/src/core/annotations/annotations';
import {ViewContainer} from 'angular2/src/core/compiler/view_container';
import {isBlank} from 'angular2/src/facade/lang';
export class If {
  constructor(viewContainer) {
    this.viewContainer = viewContainer;
    this.prevCondition = null;
  }
  set condition(newCondition) {
    if (newCondition && (isBlank(this.prevCondition) || !this.prevCondition)) {
      this.prevCondition = true;
      this.viewContainer.create();
    } else if (!newCondition && (isBlank(this.prevCondition) || this.prevCondition)) {
      this.prevCondition = false;
      this.viewContainer.clear();
    }
  }
}
Object.defineProperty(If, "annotations", {get: function() {
    return [new Viewport({
      selector: '[if]',
      bind: {'condition': 'if'}
    })];
  }});
Object.defineProperty(If, "parameters", {get: function() {
    return [[ViewContainer]];
  }});
//# sourceMappingURL=if.js.map

//# sourceMappingURL=./if.map