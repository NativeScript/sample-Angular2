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
var collection_1 = require('angular2/src/facade/collection');
var binding_1 = require('./binding');
var exceptions_1 = require('./exceptions');
var lang_1 = require('angular2/src/facade/lang');
var async_1 = require('angular2/src/facade/async');
var key_1 = require('./key');
var _constructing = new Object();
var _notFound = new Object();
var _Waiting = (function () {
    function _Waiting(promise) {
        this.promise = promise;
    }
    return _Waiting;
})();
Object.defineProperty(_Waiting, "parameters", { get: function () {
        return [[async_1.Promise]];
    } });
function _isWaiting(obj) {
    return obj instanceof _Waiting;
}
var Injector = (function () {
    function Injector(bindings, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.parent, parent = _c === void 0 ? null : _c, _d = _b.defaultBindings, defaultBindings = _d === void 0 ? false : _d;
        var flatten = _flattenBindings(bindings, collection_1.MapWrapper.create());
        this._bindings = this._createListOfBindings(flatten);
        this._instances = this._createInstances();
        this._parent = parent;
        this._defaultBindings = defaultBindings;
        this._asyncStrategy = new _AsyncInjectorStrategy(this);
        this._syncStrategy = new _SyncInjectorStrategy(this);
    }
    Injector.prototype.get = function (token) {
        return this._getByKey(key_1.Key.get(token), false, false, false);
    };
    Injector.prototype.getOptional = function (token) {
        return this._getByKey(key_1.Key.get(token), false, false, true);
    };
    Injector.prototype.asyncGet = function (token) {
        return this._getByKey(key_1.Key.get(token), true, false, false);
    };
    Injector.prototype.createChild = function (bindings) {
        return new Injector(bindings, { parent: this });
    };
    Injector.prototype._createListOfBindings = function (flattenBindings) {
        var bindings = collection_1.ListWrapper.createFixedSize(key_1.Key.numberOfKeys + 1);
        collection_1.MapWrapper.forEach(flattenBindings, function (v, keyId) { return bindings[keyId] = v; });
        return bindings;
    };
    Injector.prototype._createInstances = function () {
        return collection_1.ListWrapper.createFixedSize(key_1.Key.numberOfKeys + 1);
    };
    Injector.prototype._getByKey = function (key, returnPromise, returnLazy, optional) {
        var _this = this;
        if (returnLazy) {
            return function () { return _this._getByKey(key, returnPromise, false, optional); };
        }
        var strategy = returnPromise ? this._asyncStrategy : this._syncStrategy;
        var instance = strategy.readFromCache(key);
        if (instance !== _notFound)
            return instance;
        instance = strategy.instantiate(key);
        if (instance !== _notFound)
            return instance;
        if (lang_1.isPresent(this._parent)) {
            return this._parent._getByKey(key, returnPromise, returnLazy, optional);
        }
        if (optional) {
            return null;
        }
        else {
            throw new exceptions_1.NoProviderError(key);
        }
    };
    Injector.prototype._resolveDependencies = function (key, binding, forceAsync) {
        var _this = this;
        try {
            var getDependency = function (d) { return _this._getByKey(d.key, forceAsync || d.asPromise, d.lazy, d.optional); };
            return collection_1.ListWrapper.map(binding.dependencies, getDependency);
        }
        catch (e) {
            this._clear(key);
            if (e instanceof exceptions_1.ProviderError)
                e.addKey(key);
            throw e;
        }
    };
    Injector.prototype._getInstance = function (key) {
        if (this._instances.length <= key.id)
            return null;
        return collection_1.ListWrapper.get(this._instances, key.id);
    };
    Injector.prototype._setInstance = function (key, obj) {
        collection_1.ListWrapper.set(this._instances, key.id, obj);
    };
    Injector.prototype._getBinding = function (key) {
        var binding = this._bindings.length <= key.id ? null : collection_1.ListWrapper.get(this._bindings, key.id);
        if (lang_1.isBlank(binding) && this._defaultBindings) {
            return binding_1.bind(key.token).toClass(key.token);
        }
        else {
            return binding;
        }
    };
    Injector.prototype._markAsConstructing = function (key) {
        this._setInstance(key, _constructing);
    };
    Injector.prototype._clear = function (key) {
        this._setInstance(key, null);
    };
    return Injector;
})();
exports.Injector = Injector;
Object.defineProperty(Injector, "parameters", { get: function () {
        return [[collection_1.List], []];
    } });
Object.defineProperty(Injector.prototype.createChild, "parameters", { get: function () {
        return [[collection_1.List]];
    } });
Object.defineProperty(Injector.prototype._getByKey, "parameters", { get: function () {
        return [[key_1.Key], [assert.type.boolean], [assert.type.boolean], [assert.type.boolean]];
    } });
Object.defineProperty(Injector.prototype._resolveDependencies, "parameters", { get: function () {
        return [[key_1.Key], [binding_1.Binding], [assert.type.boolean]];
    } });
Object.defineProperty(Injector.prototype._getInstance, "parameters", { get: function () {
        return [[key_1.Key]];
    } });
Object.defineProperty(Injector.prototype._setInstance, "parameters", { get: function () {
        return [[key_1.Key], []];
    } });
Object.defineProperty(Injector.prototype._getBinding, "parameters", { get: function () {
        return [[key_1.Key]];
    } });
Object.defineProperty(Injector.prototype._markAsConstructing, "parameters", { get: function () {
        return [[key_1.Key]];
    } });
Object.defineProperty(Injector.prototype._clear, "parameters", { get: function () {
        return [[key_1.Key]];
    } });
var _SyncInjectorStrategy = (function () {
    function _SyncInjectorStrategy(injector) {
        this.injector = injector;
    }
    _SyncInjectorStrategy.prototype.readFromCache = function (key) {
        if (key.token === Injector) {
            return this.injector;
        }
        var instance = this.injector._getInstance(key);
        if (instance === _constructing) {
            throw new exceptions_1.CyclicDependencyError(key);
        }
        else if (lang_1.isPresent(instance) && !_isWaiting(instance)) {
            return instance;
        }
        else {
            return _notFound;
        }
    };
    _SyncInjectorStrategy.prototype.instantiate = function (key) {
        var binding = this.injector._getBinding(key);
        if (lang_1.isBlank(binding))
            return _notFound;
        if (binding.providedAsPromise)
            throw new exceptions_1.AsyncBindingError(key);
        this.injector._markAsConstructing(key);
        var deps = this.injector._resolveDependencies(key, binding, false);
        return this._createInstance(key, binding, deps);
    };
    _SyncInjectorStrategy.prototype._createInstance = function (key, binding, deps) {
        try {
            var instance = lang_1.FunctionWrapper.apply(binding.factory, deps);
            this.injector._setInstance(key, instance);
            return instance;
        }
        catch (e) {
            this.injector._clear(key);
            throw new exceptions_1.InstantiationError(e, key);
        }
    };
    return _SyncInjectorStrategy;
})();
Object.defineProperty(_SyncInjectorStrategy, "parameters", { get: function () {
        return [[Injector]];
    } });
Object.defineProperty(_SyncInjectorStrategy.prototype.readFromCache, "parameters", { get: function () {
        return [[key_1.Key]];
    } });
Object.defineProperty(_SyncInjectorStrategy.prototype.instantiate, "parameters", { get: function () {
        return [[key_1.Key]];
    } });
Object.defineProperty(_SyncInjectorStrategy.prototype._createInstance, "parameters", { get: function () {
        return [[key_1.Key], [binding_1.Binding], [collection_1.List]];
    } });
var _AsyncInjectorStrategy = (function () {
    function _AsyncInjectorStrategy(injector) {
        this.injector = injector;
    }
    _AsyncInjectorStrategy.prototype.readFromCache = function (key) {
        if (key.token === Injector) {
            return async_1.PromiseWrapper.resolve(this.injector);
        }
        var instance = this.injector._getInstance(key);
        if (instance === _constructing) {
            throw new exceptions_1.CyclicDependencyError(key);
        }
        else if (_isWaiting(instance)) {
            return instance.promise;
        }
        else if (lang_1.isPresent(instance)) {
            return async_1.PromiseWrapper.resolve(instance);
        }
        else {
            return _notFound;
        }
    };
    _AsyncInjectorStrategy.prototype.instantiate = function (key) {
        var _this = this;
        var binding = this.injector._getBinding(key);
        if (lang_1.isBlank(binding))
            return _notFound;
        this.injector._markAsConstructing(key);
        var deps = this.injector._resolveDependencies(key, binding, true);
        var depsPromise = async_1.PromiseWrapper.all(deps);
        var promise = async_1.PromiseWrapper.then(depsPromise, null, function (e) { return _this._errorHandler(key, e); }).then(function (deps) { return _this._findOrCreate(key, binding, deps); }).then(function (instance) { return _this._cacheInstance(key, instance); });
        this.injector._setInstance(key, new _Waiting(promise));
        return promise;
    };
    _AsyncInjectorStrategy.prototype._errorHandler = function (key, e) {
        if (e instanceof exceptions_1.ProviderError)
            e.addKey(key);
        return async_1.PromiseWrapper.reject(e);
    };
    _AsyncInjectorStrategy.prototype._findOrCreate = function (key, binding, deps) {
        try {
            var instance = this.injector._getInstance(key);
            if (!_isWaiting(instance))
                return instance;
            return lang_1.FunctionWrapper.apply(binding.factory, deps);
        }
        catch (e) {
            console.log("_findOrCreate", e.stack);
            this.injector._clear(key);
            throw new exceptions_1.InstantiationError(e, key);
        }
    };
    _AsyncInjectorStrategy.prototype._cacheInstance = function (key, instance) {
        this.injector._setInstance(key, instance);
        return instance;
    };
    return _AsyncInjectorStrategy;
})();
Object.defineProperty(_AsyncInjectorStrategy, "parameters", { get: function () {
        return [[Injector]];
    } });
Object.defineProperty(_AsyncInjectorStrategy.prototype.readFromCache, "parameters", { get: function () {
        return [[key_1.Key]];
    } });
Object.defineProperty(_AsyncInjectorStrategy.prototype.instantiate, "parameters", { get: function () {
        return [[key_1.Key]];
    } });
Object.defineProperty(_AsyncInjectorStrategy.prototype._errorHandler, "parameters", { get: function () {
        return [[key_1.Key], []];
    } });
Object.defineProperty(_AsyncInjectorStrategy.prototype._findOrCreate, "parameters", { get: function () {
        return [[key_1.Key], [binding_1.Binding], [collection_1.List]];
    } });
function _flattenBindings(bindings, res) {
    collection_1.ListWrapper.forEach(bindings, function (b) {
        if (b instanceof binding_1.Binding) {
            collection_1.MapWrapper.set(res, b.key.id, b);
        }
        else if (b instanceof lang_1.Type) {
            var s = binding_1.bind(b).toClass(b);
            collection_1.MapWrapper.set(res, s.key.id, s);
        }
        else if (b instanceof collection_1.List) {
            _flattenBindings(b, res);
        }
        else if (b instanceof binding_1.BindingBuilder) {
            throw new exceptions_1.InvalidBindingError(b.token);
        }
        else {
            throw new exceptions_1.InvalidBindingError(b);
        }
    });
    return res;
}
Object.defineProperty(_flattenBindings, "parameters", { get: function () {
        return [[collection_1.List], [collection_1.Map]];
    } });
