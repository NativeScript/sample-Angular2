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
var annotations_1 = require('./src/di/annotations');
exports.Inject = annotations_1.Inject;
exports.InjectPromise = annotations_1.InjectPromise;
exports.InjectLazy = annotations_1.InjectLazy;
exports.Injectable = annotations_1.Injectable;
exports.Optional = annotations_1.Optional;
exports.DependencyAnnotation = annotations_1.DependencyAnnotation;
var injector_1 = require('./src/di/injector');
exports.Injector = injector_1.Injector;
var binding_1 = require('./src/di/binding');
exports.Binding = binding_1.Binding;
exports.Dependency = binding_1.Dependency;
exports.bind = binding_1.bind;
var key_1 = require('./src/di/key');
exports.Key = key_1.Key;
exports.KeyRegistry = key_1.KeyRegistry;
var exceptions_1 = require('./src/di/exceptions');
exports.KeyMetadataError = exceptions_1.KeyMetadataError;
exports.NoProviderError = exceptions_1.NoProviderError;
exports.ProviderError = exceptions_1.ProviderError;
exports.AsyncBindingError = exceptions_1.AsyncBindingError;
exports.CyclicDependencyError = exceptions_1.CyclicDependencyError;
exports.InstantiationError = exceptions_1.InstantiationError;
exports.InvalidBindingError = exceptions_1.InvalidBindingError;
exports.NoAnnotationError = exceptions_1.NoAnnotationError;
var opaque_token_1 = require('./src/di/opaque_token');
exports.OpaqueToken = opaque_token_1.OpaqueToken;
