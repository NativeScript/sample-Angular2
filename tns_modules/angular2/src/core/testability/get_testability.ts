import {TestabilityRegistry,
  Testability} from 'angular2/src/core/testability/testability';
class PublicTestability {
  constructor(testability) {
    this._testability = testability;
  }
  whenStable(callback) {
    this._testability.whenStable(callback);
  }
  findBindings(using, binding, exactMatch) {
    return this._testability.findBindings(using, binding, exactMatch);
  }
}
Object.defineProperty(PublicTestability, "parameters", {get: function() {
    return [[Testability]];
  }});
Object.defineProperty(PublicTestability.prototype.whenStable, "parameters", {get: function() {
    return [[Function]];
  }});
Object.defineProperty(PublicTestability.prototype.findBindings, "parameters", {get: function() {
    return [[], [assert.type.string], [assert.type.boolean]];
  }});
export class GetTestability {
  static addToWindow(registry) {
    if (!global.angular2) {
      global.angular2 = {};
    }
    global.angular2.getTestability = function(elem) {
      var testability = registry.findTestabilityInTree(elem);
      if (testability == null) {
        throw new Error('Could not find testability for element.');
      }
      return new PublicTestability(testability);
    };
    global.angular2.resumeBootstrap = function() {};
  }
}
Object.defineProperty(GetTestability.addToWindow, "parameters", {get: function() {
    return [[TestabilityRegistry]];
  }});
//# sourceMappingURL=get_testability.es6.map

//# sourceMappingURL=./get_testability.map
