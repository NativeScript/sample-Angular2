export var NO_CHANGE = new Object();
export class Pipe {
  supports(obj) {
    return false;
  }
  onDestroy() {}
  transform(value) {
    return null;
  }
}
Object.defineProperty(Pipe.prototype.transform, "parameters", {get: function() {
    return [[assert.type.any]];
  }});
//# sourceMappingURL=pipe.js.map

//# sourceMappingURL=./pipe.map