import {List,
  ListWrapper} from 'angular2/src/facade/collection';
import {isBlank,
  isPresent,
  BaseException,
  CONST} from 'angular2/src/facade/lang';
import {Pipe} from './pipe';
import {BindingPropagationConfig} from '../binding_propagation_config';
export class PipeRegistry {
  constructor(config) {
    this.config = config;
  }
  get(type, obj, bpc) {
    var listOfConfigs = this.config[type];
    if (isBlank(listOfConfigs)) {
      throw new BaseException(`Cannot find a pipe for type '${type}' object '${obj}'`);
    }
    var matchingConfig = ListWrapper.find(listOfConfigs, (pipeConfig) => pipeConfig.supports(obj));
    if (isBlank(matchingConfig)) {
      throw new BaseException(`Cannot find a pipe for type '${type}' object '${obj}'`);
    }
    return matchingConfig.create(bpc);
  }
}
Object.defineProperty(PipeRegistry.prototype.get, "parameters", {get: function() {
    return [[assert.type.string], [], [BindingPropagationConfig]];
  }});
//# sourceMappingURL=pipe_registry.js.map

//# sourceMappingURL=./pipe_registry.map