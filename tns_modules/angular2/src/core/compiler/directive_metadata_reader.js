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
var di_1 = require('angular2/di');
var lang_1 = require('angular2/src/facade/lang');
var annotations_1 = require('../annotations/annotations');
var directive_metadata_1 = require('./directive_metadata');
var reflection_1 = require('angular2/src/reflection/reflection');
var DirectiveMetadataReader = (function () {
    function DirectiveMetadataReader() {
    }
    DirectiveMetadataReader.prototype.read = function (type) {
        var annotations = reflection_1.reflector.annotations(type);
        if (lang_1.isPresent(annotations)) {
            for (var i = 0; i < annotations.length; i++) {
                var annotation = annotations[i];
                if (annotation instanceof annotations_1.Directive) {
                    return new directive_metadata_1.DirectiveMetadata(type, annotation);
                }
            }
        }
        throw new lang_1.BaseException("No Directive annotation found on " + lang_1.stringify(type));
    };
    return DirectiveMetadataReader;
})();
exports.DirectiveMetadataReader = DirectiveMetadataReader;
Object.defineProperty(DirectiveMetadataReader, "annotations", { get: function () {
        return [new di_1.Injectable()];
    } });
Object.defineProperty(DirectiveMetadataReader.prototype.read, "parameters", { get: function () {
        return [[lang_1.Type]];
    } });
