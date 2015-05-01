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
var compiler_1 = require('./compiler');
var shadow_dom_strategy_1 = require('./shadow_dom_strategy');
var di_1 = require('angular2/di');
var event_manager_1 = require('angular2/src/render/dom/events/event_manager');
var directive_metadata_reader_1 = require('angular2/src/core/compiler/directive_metadata_reader');
var annotations_1 = require('angular2/src/core/annotations/annotations');
var private_component_location_1 = require('./private_component_location');
var lang_1 = require('angular2/src/facade/lang');
var PrivateComponentLoader = (function () {
    function PrivateComponentLoader(compiler, shadowDomStrategy, eventManager, directiveMetadataReader) {
        this.compiler = compiler;
        this.shadowDomStrategy = shadowDomStrategy;
        this.eventManager = eventManager;
        this.directiveMetadataReader = directiveMetadataReader;
    }
    PrivateComponentLoader.prototype.load = function (type, location) {
        var _this = this;
        var annotation = this.directiveMetadataReader.read(type).annotation;
        if (!(annotation instanceof annotations_1.Component)) {
            throw new lang_1.BaseException("Could not load '" + lang_1.stringify(type) + "' because it is not a component.");
        }
        return this.compiler.compile(type).then(function (componentProtoView) {
            location.createComponent(type, annotation, componentProtoView, _this.eventManager, _this.shadowDomStrategy);
        });
    };
    return PrivateComponentLoader;
})();
exports.PrivateComponentLoader = PrivateComponentLoader;
Object.defineProperty(PrivateComponentLoader, "annotations", { get: function () {
        return [new di_1.Injectable()];
    } });
Object.defineProperty(PrivateComponentLoader, "parameters", { get: function () {
        return [[compiler_1.Compiler], [shadow_dom_strategy_1.ShadowDomStrategy], [event_manager_1.EventManager], [directive_metadata_reader_1.DirectiveMetadataReader]];
    } });
Object.defineProperty(PrivateComponentLoader.prototype.load, "parameters", { get: function () {
        return [[lang_1.Type], [private_component_location_1.PrivateComponentLocation]];
    } });
