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
var annotations_1 = require('angular2/src/core/annotations/annotations');
var directive_metadata_1 = require('angular2/src/core/compiler/directive_metadata');
var SomeDecorator = (function () {
    function SomeDecorator() {
    }
    return SomeDecorator;
})();
Object.defineProperty(SomeDecorator, "annotations", { get: function () {
        return [new annotations_1.Decorator({ selector: 'someDecorator' })];
    } });
var SomeComponent = (function () {
    function SomeComponent() {
    }
    return SomeComponent;
})();
Object.defineProperty(SomeComponent, "annotations", { get: function () {
        return [new annotations_1.Component({ selector: 'someComponent' })];
    } });
var SomeViewport = (function () {
    function SomeViewport() {
    }
    return SomeViewport;
})();
Object.defineProperty(SomeViewport, "annotations", { get: function () {
        return [new annotations_1.Viewport({ selector: 'someViewport' })];
    } });
var SomeDirectiveWithoutAnnotation = (function () {
    function SomeDirectiveWithoutAnnotation() {
    }
    return SomeDirectiveWithoutAnnotation;
})();
function main() {
    test_lib_1.describe("DirectiveMetadataReader", function () {
        var reader;
        test_lib_1.beforeEach(function () {
            reader = new directive_metadata_reader_1.DirectiveMetadataReader();
        });
        test_lib_1.it('should read out the Decorator annotation', function () {
            var directiveMetadata = reader.read(SomeDecorator);
            test_lib_1.expect(directiveMetadata).toEqual(new directive_metadata_1.DirectiveMetadata(SomeDecorator, new annotations_1.Decorator({ selector: 'someDecorator' })));
        });
        test_lib_1.it('should read out the Viewport annotation', function () {
            var directiveMetadata = reader.read(SomeViewport);
            test_lib_1.expect(directiveMetadata).toEqual(new directive_metadata_1.DirectiveMetadata(SomeViewport, new annotations_1.Viewport({ selector: 'someViewport' })));
        });
        test_lib_1.it('should read out the Component annotation', function () {
            var directiveMetadata = reader.read(SomeComponent);
            test_lib_1.expect(directiveMetadata).toEqual(new directive_metadata_1.DirectiveMetadata(SomeComponent, new annotations_1.Component({ selector: 'someComponent' })));
        });
        test_lib_1.it('should throw if not matching annotation is found', function () {
            test_lib_1.expect(function () {
                reader.read(SomeDirectiveWithoutAnnotation);
            }).toThrowError('No Directive annotation found on SomeDirectiveWithoutAnnotation');
        });
    });
}
exports.main = main;
