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
var lang_1 = require('angular2/src/facade/lang');
var binding_propagation_config_1 = require('../binding_propagation_config');
var PipeRegistry = (function () {
    function PipeRegistry(config) {
        this.config = config;
    }
    PipeRegistry.prototype.get = function (type, obj, bpc) {
        var listOfConfigs = this.config[type];
        if (lang_1.isBlank(listOfConfigs)) {
            throw new lang_1.BaseException("Cannot find a pipe for type '" + type + "' object '" + obj + "'");
        }
        var matchingConfig = collection_1.ListWrapper.find(listOfConfigs, function (pipeConfig) { return pipeConfig.supports(obj); });
        if (lang_1.isBlank(matchingConfig)) {
            throw new lang_1.BaseException("Cannot find a pipe for type '" + type + "' object '" + obj + "'");
        }
        return matchingConfig.create(bpc);
    };
    return PipeRegistry;
})();
exports.PipeRegistry = PipeRegistry;
Object.defineProperty(PipeRegistry.prototype.get, "parameters", { get: function () {
        return [[assert.type.string], [], [binding_propagation_config_1.BindingPropagationConfig]];
    } });
