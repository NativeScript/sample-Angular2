import {Type,
  isBlank,
  isPresent} from 'angular2/src/facade/lang';
import {List,
  MapWrapper,
  ListWrapper} from 'angular2/src/facade/collection';
import {reflector} from 'angular2/src/reflection/reflection';
import {Key} from './key';
import {Inject,
  InjectLazy,
  InjectPromise,
  Optional,
  DependencyAnnotation} from './annotations';
import {NoAnnotationError} from './exceptions';
export class Dependency {
  constructor(key, asPromise, lazy, optional, properties) {
    this.key = key;
    this.asPromise = asPromise;
    this.lazy = lazy;
    this.optional = optional;
    this.properties = properties;
  }
  static fromKey(key) {
    return new Dependency(key, false, false, false, []);
  }
}
Object.defineProperty(Dependency, "parameters", {get: function() {
    return [[Key], [assert.type.boolean], [assert.type.boolean], [assert.type.boolean], [List]];
  }});
Object.defineProperty(Dependency.fromKey, "parameters", {get: function() {
    return [[Key]];
  }});
export class Binding {
  constructor(key, factory, dependencies, providedAsPromise) {
    this.key = key;
    this.factory = factory;
    this.dependencies = dependencies;
    this.providedAsPromise = providedAsPromise;
  }
}
Object.defineProperty(Binding, "parameters", {get: function() {
    return [[Key], [Function], [List], [assert.type.boolean]];
  }});
export function bind(token) {
  return new BindingBuilder(token);
}
export class BindingBuilder {
  constructor(token) {
    this.token = token;
  }
  toClass(type) {
    return new Binding(Key.get(this.token), reflector.factory(type), _dependenciesFor(type), false);
  }
  toValue(value) {
    return new Binding(Key.get(this.token), () => value, [], false);
  }
  toAlias(aliasToken) {
    return new Binding(Key.get(this.token), (aliasInstance) => aliasInstance, [Dependency.fromKey(Key.get(aliasToken))], false);
  }
  toFactory(factoryFunction, dependencies = null) {
    return new Binding(Key.get(this.token), factoryFunction, this._constructDependencies(factoryFunction, dependencies), false);
  }
  toAsyncFactory(factoryFunction, dependencies = null) {
    return new Binding(Key.get(this.token), factoryFunction, this._constructDependencies(factoryFunction, dependencies), true);
  }
  _constructDependencies(factoryFunction, dependencies) {
    return isBlank(dependencies) ? _dependenciesFor(factoryFunction) : ListWrapper.map(dependencies, (t) => Dependency.fromKey(Key.get(t)));
  }
}
Object.defineProperty(BindingBuilder.prototype.toClass, "parameters", {get: function() {
    return [[Type]];
  }});
Object.defineProperty(BindingBuilder.prototype.toFactory, "parameters", {get: function() {
    return [[Function], [List]];
  }});
Object.defineProperty(BindingBuilder.prototype.toAsyncFactory, "parameters", {get: function() {
    return [[Function], [List]];
  }});
Object.defineProperty(BindingBuilder.prototype._constructDependencies, "parameters", {get: function() {
    return [[Function], [List]];
  }});
function _dependenciesFor(typeOrFunc) {
  var params = reflector.parameters(typeOrFunc);
  if (isBlank(params))
    return [];
  if (ListWrapper.any(params, (p) => isBlank(p)))
    throw new NoAnnotationError(typeOrFunc);
  return ListWrapper.map(params, (p) => _extractToken(typeOrFunc, p));
}
function _extractToken(typeOrFunc, annotations) {
  var depProps = [];
  var token = null;
  var optional = false;
  var lazy = false;
  var asPromise = false;
  for (var i = 0; i < annotations.length; ++i) {
    var paramAnnotation = annotations[i];
    if (paramAnnotation instanceof Type) {
      token = paramAnnotation;
    } else if (paramAnnotation instanceof Inject) {
      token = paramAnnotation.token;
    } else if (paramAnnotation instanceof InjectPromise) {
      token = paramAnnotation.token;
      asPromise = true;
    } else if (paramAnnotation instanceof InjectLazy) {
      token = paramAnnotation.token;
      lazy = true;
    } else if (paramAnnotation instanceof Optional) {
      optional = true;
    } else if (paramAnnotation instanceof DependencyAnnotation) {
      if (isPresent(paramAnnotation.token)) {
        token = paramAnnotation.token;
      }
      ListWrapper.push(depProps, paramAnnotation);
    }
  }
  if (isPresent(token)) {
    return _createDependency(token, asPromise, lazy, optional, depProps);
  } else {
    throw new NoAnnotationError(typeOrFunc);
  }
}
function _createDependency(token, asPromise, lazy, optional, depProps) {
  return new Dependency(Key.get(token), asPromise, lazy, optional, depProps);
}
//# sourceMappingURL=binding.js.map

//# sourceMappingURL=./binding.map