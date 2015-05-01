import {Injectable} from 'angular2/di';
import {Template} from 'angular2/src/core/annotations/template';
import {Type,
  stringify,
  isBlank,
  BaseException} from 'angular2/src/facade/lang';
import {Map,
  MapWrapper,
  List,
  ListWrapper} from 'angular2/src/facade/collection';
import {reflector} from 'angular2/src/reflection/reflection';
export class TemplateResolver {
  constructor() {
    this._cache = MapWrapper.create();
  }
  resolve(component) {
    var template = MapWrapper.get(this._cache, component);
    if (isBlank(template)) {
      template = this._resolve(component);
      MapWrapper.set(this._cache, component, template);
    }
    return template;
  }
  _resolve(component) {
    var annotations = reflector.annotations(component);
    for (var i = 0; i < annotations.length; i++) {
      var annotation = annotations[i];
      if (annotation instanceof Template) {
        return annotation;
      }
    }
    throw new BaseException(`No template found for ${stringify(component)}`);
  }
}
Object.defineProperty(TemplateResolver, "annotations", {get: function() {
    return [new Injectable()];
  }});
Object.defineProperty(TemplateResolver.prototype.resolve, "parameters", {get: function() {
    return [[Type]];
  }});
Object.defineProperty(TemplateResolver.prototype._resolve, "parameters", {get: function() {
    return [[Type]];
  }});
//# sourceMappingURL=template_resolver.js.map

//# sourceMappingURL=./template_resolver.map