import {ChangeDetector} from './interfaces';
import {CHECK_ONCE,
  DETACHED,
  CHECK_ALWAYS} from './constants';
export class BindingPropagationConfig {
  constructor(cd) {
    this._cd = cd;
  }
  shouldBePropagated() {
    this._cd.mode = CHECK_ONCE;
  }
  shouldBePropagatedFromRoot() {
    this._cd.markPathToRootAsCheckOnce();
  }
  shouldNotPropagate() {
    this._cd.mode = DETACHED;
  }
  shouldAlwaysPropagate() {
    this._cd.mode = CHECK_ALWAYS;
  }
}
Object.defineProperty(BindingPropagationConfig, "parameters", {get: function() {
    return [[ChangeDetector]];
  }});
//# sourceMappingURL=binding_propagation_config.js.map

//# sourceMappingURL=./binding_propagation_config.map