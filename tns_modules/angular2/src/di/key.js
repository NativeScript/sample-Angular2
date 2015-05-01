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
var exceptions_1 = require('./exceptions');
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var Key = (function () {
    function Key(token, id) {
        this.token = token;
        this.id = id;
        this.metadata = null;
    }
    Key.setMetadata = function (key, metadata) {
        if (lang_1.isPresent(key.metadata) && key.metadata !== metadata) {
            throw new exceptions_1.KeyMetadataError();
        }
        key.metadata = metadata;
        return key;
    };
    Key.get = function (token) {
        return _globalKeyRegistry.get(token);
    };
    Object.defineProperty(Key, "numberOfKeys", {
        get: function () {
            return _globalKeyRegistry.numberOfKeys;
        },
        enumerable: true,
        configurable: true
    });
    return Key;
})();
exports.Key = Key;
Object.defineProperty(Key, "parameters", { get: function () {
        return [[], [lang_1.int]];
    } });
Object.defineProperty(Key.setMetadata, "parameters", { get: function () {
        return [[Key], []];
    } });
var KeyRegistry = (function () {
    function KeyRegistry() {
        this._allKeys = collection_1.MapWrapper.create();
    }
    KeyRegistry.prototype.get = function (token) {
        if (token instanceof Key)
            return token;
        if (collection_1.MapWrapper.contains(this._allKeys, token)) {
            return collection_1.MapWrapper.get(this._allKeys, token);
        }
        var newKey = new Key(token, Key.numberOfKeys);
        collection_1.MapWrapper.set(this._allKeys, token, newKey);
        return newKey;
    };
    Object.defineProperty(KeyRegistry.prototype, "numberOfKeys", {
        get: function () {
            return collection_1.MapWrapper.size(this._allKeys);
        },
        enumerable: true,
        configurable: true
    });
    return KeyRegistry;
})();
exports.KeyRegistry = KeyRegistry;
var _globalKeyRegistry = new KeyRegistry();
