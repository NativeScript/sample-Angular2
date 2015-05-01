var __decorate = this.__decorate || function (decorators, target, key, value) {
    var kind = typeof (arguments.length == 2 ? value = target : value);
    for (var i = decorators.length - 1; i >= 0; --i) {
        var decorator = decorators[i];
        switch (kind) {
            case "function": value = decorator(value) || value; break;
            case "number": decorator(target, key, value); break;
            case "undefined": decorator(target, key); break;
            case "object": value = decorator(target, key, value) || value; break;
        }
    }
    return value;
};
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var reflection_1 = require('angular2/src/reflection/reflection');
var key_1 = require('./key');
var annotations_1 = require('./annotations');
var exceptions_1 = require('./exceptions');
var Dependency = (function () {
    function Dependency(key, asPromise, lazy, optional, properties) {
        this.key = key;
        this.asPromise = asPromise;
        this.lazy = lazy;
        this.optional = optional;
        this.properties = properties;
    }
    Dependency.fromKey = function (key) {
        return new Dependency(key, false, false, false, []);
    };
    return Dependency;
})();
exports.Dependency = Dependency;
Object.defineProperty(Dependency, "parameters", { get: function () {
        return [[key_1.Key], [assert.type.boolean], [assert.type.boolean], [assert.type.boolean], [collection_1.List]];
    } });
Object.defineProperty(Dependency.fromKey, "parameters", { get: function () {
        return [[key_1.Key]];
    } });
var Binding = (function () {
    function Binding(key, factory, dependencies, providedAsPromise) {
        this.key = key;
        this.factory = factory;
        this.dependencies = dependencies;
        this.providedAsPromise = providedAsPromise;
    }
    return Binding;
})();
exports.Binding = Binding;
Object.defineProperty(Binding, "parameters", { get: function () {
        return [[key_1.Key], [Function], [collection_1.List], [assert.type.boolean]];
    } });
function bind(token) {
    return new BindingBuilder(token);
}
exports.bind = bind;
var BindingBuilder = (function () {
    function BindingBuilder(token) {
        this.token = token;
    }
    BindingBuilder.prototype.toClass = function (type) {
        return new Binding(key_1.Key.get(this.token), reflection_1.reflector.factory(type), _dependenciesFor(type), false);
    };
    BindingBuilder.prototype.toValue = function (value) {
        return new Binding(key_1.Key.get(this.token), function () { return value; }, [], false);
    };
    BindingBuilder.prototype.toAlias = function (aliasToken) {
        return new Binding(key_1.Key.get(this.token), function (aliasInstance) { return aliasInstance; }, [Dependency.fromKey(key_1.Key.get(aliasToken))], false);
    };
    BindingBuilder.prototype.toFactory = function (factoryFunction, dependencies) {
        if (dependencies === void 0) { dependencies = null; }
        return new Binding(key_1.Key.get(this.token), factoryFunction, this._constructDependencies(factoryFunction, dependencies), false);
    };
    BindingBuilder.prototype.toAsyncFactory = function (factoryFunction, dependencies) {
        if (dependencies === void 0) { dependencies = null; }
        return new Binding(key_1.Key.get(this.token), factoryFunction, this._constructDependencies(factoryFunction, dependencies), true);
    };
    BindingBuilder.prototype._constructDependencies = function (factoryFunction, dependencies) {
        return lang_1.isBlank(dependencies) ? _dependenciesFor(factoryFunction) : collection_1.ListWrapper.map(dependencies, function (t) { return Dependency.fromKey(key_1.Key.get(t)); });
    };
    return BindingBuilder;
})();
exports.BindingBuilder = BindingBuilder;
Object.defineProperty(BindingBuilder.prototype.toClass, "parameters", { get: function () {
        return [[lang_1.Type]];
    } });
Object.defineProperty(BindingBuilder.prototype.toFactory, "parameters", { get: function () {
        return [[Function], [collection_1.List]];
    } });
Object.defineProperty(BindingBuilder.prototype.toAsyncFactory, "parameters", { get: function () {
        return [[Function], [collection_1.List]];
    } });
Object.defineProperty(BindingBuilder.prototype._constructDependencies, "parameters", { get: function () {
        return [[Function], [collection_1.List]];
    } });
function _dependenciesFor(typeOrFunc) {
    var params = reflection_1.reflector.parameters(typeOrFunc);
    if (lang_1.isBlank(params))
        return [];
    if (collection_1.ListWrapper.any(params, function (p) { return lang_1.isBlank(p); }))
        throw new exceptions_1.NoAnnotationError(typeOrFunc);
    return collection_1.ListWrapper.map(params, function (p) { return _extractToken(typeOrFunc, p); });
}
function _extractToken(typeOrFunc, annotations) {
    var depProps = [];
    var token = null;
    var optional = false;
    var lazy = false;
    var asPromise = false;
    for (var i = 0; i < annotations.length; ++i) {
        var paramAnnotation = annotations[i];
        if (paramAnnotation instanceof lang_1.Type) {
            token = paramAnnotation;
        }
        else if (paramAnnotation instanceof annotations_1.Inject) {
            token = paramAnnotation.token;
        }
        else if (paramAnnotation instanceof annotations_1.InjectPromise) {
            token = paramAnnotation.token;
            asPromise = true;
        }
        else if (paramAnnotation instanceof annotations_1.InjectLazy) {
            token = paramAnnotation.token;
            lazy = true;
        }
        else if (paramAnnotation instanceof annotations_1.Optional) {
            optional = true;
        }
        else if (paramAnnotation instanceof annotations_1.DependencyAnnotation) {
            if (lang_1.isPresent(paramAnnotation.token)) {
                token = paramAnnotation.token;
            }
            collection_1.ListWrapper.push(depProps, paramAnnotation);
        }
    }
    if (lang_1.isPresent(token)) {
        return _createDependency(token, asPromise, lazy, optional, depProps);
    }
    else {
        throw new exceptions_1.NoAnnotationError(typeOrFunc);
    }
}
function _createDependency(token, asPromise, lazy, optional, depProps) {
    return new Dependency(key_1.Key.get(token), asPromise, lazy, optional, depProps);
}
