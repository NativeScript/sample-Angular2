var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
function findFirstClosedCycle(keys) {
    var res = [];
    for (var i = 0; i < keys.length; ++i) {
        if (collection_1.ListWrapper.contains(res, keys[i])) {
            collection_1.ListWrapper.push(res, keys[i]);
            return res;
        }
        else {
            collection_1.ListWrapper.push(res, keys[i]);
        }
    }
    return res;
}
Object.defineProperty(findFirstClosedCycle, "parameters", { get: function () {
        return [[collection_1.List]];
    } });
function constructResolvingPath(keys) {
    if (keys.length > 1) {
        var reversed = findFirstClosedCycle(collection_1.ListWrapper.reversed(keys));
        var tokenStrs = collection_1.ListWrapper.map(reversed, function (k) { return lang_1.stringify(k.token); });
        return " (" + tokenStrs.join(' -> ') + ")";
    }
    else {
        return "";
    }
}
Object.defineProperty(constructResolvingPath, "parameters", { get: function () {
        return [[collection_1.List]];
    } });
var KeyMetadataError = (function (_super) {
    __extends(KeyMetadataError, _super);
    function KeyMetadataError() {
        _super.apply(this, arguments);
    }
    return KeyMetadataError;
})(Error);
exports.KeyMetadataError = KeyMetadataError;
var ProviderError = (function (_super) {
    __extends(ProviderError, _super);
    function ProviderError(key, constructResolvingMessage) {
        _super.call(this);
        this.keys = [key];
        this.constructResolvingMessage = constructResolvingMessage;
        this.message = this.constructResolvingMessage(this.keys);
    }
    ProviderError.prototype.addKey = function (key) {
        collection_1.ListWrapper.push(this.keys, key);
        this.message = this.constructResolvingMessage(this.keys);
    };
    ProviderError.prototype.toString = function () {
        return this.message;
    };
    return ProviderError;
})(Error);
exports.ProviderError = ProviderError;
Object.defineProperty(ProviderError, "parameters", { get: function () {
        return [[], [Function]];
    } });
var NoProviderError = (function (_super) {
    __extends(NoProviderError, _super);
    function NoProviderError(key) {
        _super.call(this, key, function (keys) {
            var first = lang_1.stringify(collection_1.ListWrapper.first(keys).token);
            return "No provider for " + first + "!" + constructResolvingPath(keys);
        });
    }
    return NoProviderError;
})(ProviderError);
exports.NoProviderError = NoProviderError;
var AsyncBindingError = (function (_super) {
    __extends(AsyncBindingError, _super);
    function AsyncBindingError(key) {
        _super.call(this, key, function (keys) {
            var first = lang_1.stringify(collection_1.ListWrapper.first(keys).token);
            return ("Cannot instantiate " + first + " synchronously. ") + ("It is provided as a promise!" + constructResolvingPath(keys));
        });
    }
    return AsyncBindingError;
})(ProviderError);
exports.AsyncBindingError = AsyncBindingError;
var CyclicDependencyError = (function (_super) {
    __extends(CyclicDependencyError, _super);
    function CyclicDependencyError(key) {
        _super.call(this, key, function (keys) {
            return "Cannot instantiate cyclic dependency!" + constructResolvingPath(keys);
        });
    }
    return CyclicDependencyError;
})(ProviderError);
exports.CyclicDependencyError = CyclicDependencyError;
var InstantiationError = (function (_super) {
    __extends(InstantiationError, _super);
    function InstantiationError(originalException, key) {
        _super.call(this, key, function (keys) {
            var first = lang_1.stringify(collection_1.ListWrapper.first(keys).token);
            return ("Error during instantiation of " + first + "!" + constructResolvingPath(keys) + ".") + (" ORIGINAL ERROR: " + originalException);
        });
    }
    return InstantiationError;
})(ProviderError);
exports.InstantiationError = InstantiationError;
var InvalidBindingError = (function (_super) {
    __extends(InvalidBindingError, _super);
    function InvalidBindingError(binding) {
        _super.call(this);
        this.message = "Invalid binding " + binding;
    }
    InvalidBindingError.prototype.toString = function () {
        return this.message;
    };
    return InvalidBindingError;
})(Error);
exports.InvalidBindingError = InvalidBindingError;
var NoAnnotationError = (function (_super) {
    __extends(NoAnnotationError, _super);
    function NoAnnotationError(typeOrFunc) {
        _super.call(this);
        this.message = "Cannot resolve all parameters for " + lang_1.stringify(typeOrFunc);
    }
    NoAnnotationError.prototype.toString = function () {
        return this.message;
    };
    return NoAnnotationError;
})(Error);
exports.NoAnnotationError = NoAnnotationError;
