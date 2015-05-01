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
var test_lib_1 = require('angular2/test_lib');
var directive_metadata_reader_1 = require('angular2/src/core/compiler/directive_metadata_reader');
var private_component_loader_1 = require('angular2/src/core/compiler/private_component_loader');
var annotations_1 = require('angular2/src/core/annotations/annotations');
var SomeDecorator = (function () {
    function SomeDecorator() {
    }
    return SomeDecorator;
})();
Object.defineProperty(SomeDecorator, "annotations", { get: function () {
        return [new annotations_1.Decorator({ selector: 'someDecorator' })];
    } });
var SomeViewport = (function () {
    function SomeViewport() {
    }
    return SomeViewport;
})();
Object.defineProperty(SomeViewport, "annotations", { get: function () {
        return [new annotations_1.Viewport({ selector: 'someViewport' })];
    } });
function main() {
    test_lib_1.describe("PrivateComponentLoader", function () {
        var loader;
        test_lib_1.beforeEach(function () {
            loader = new private_component_loader_1.PrivateComponentLoader(null, null, null, new directive_metadata_reader_1.DirectiveMetadataReader());
        });
        test_lib_1.describe('Load errors', function () {
            test_lib_1.it('should throw when trying to load a decorator', function () {
                test_lib_1.expect(function () { return loader.load(SomeDecorator, null); }).toThrowError("Could not load 'SomeDecorator' because it is not a component.");
            });
            test_lib_1.it('should throw when trying to load a viewport', function () {
                test_lib_1.expect(function () { return loader.load(SomeViewport, null); }).toThrowError("Could not load 'SomeViewport' because it is not a component.");
            });
        });
    });
}
exports.main = main;
