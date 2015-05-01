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
var compiler_1 = require('angular2/src/core/compiler/compiler');
var reflection_1 = require('angular2/src/reflection/reflection');
var change_detection_1 = require('angular2/change_detection');
var exception_handler_1 = require('angular2/src/core/exception_handler');
var template_loader_1 = require('angular2/src/render/dom/compiler/template_loader');
var template_resolver_1 = require('angular2/src/core/compiler/template_resolver');
var directive_metadata_reader_1 = require('angular2/src/core/compiler/directive_metadata_reader');
var shadow_dom_strategy_1 = require('angular2/src/core/compiler/shadow_dom_strategy');
var xhr_1 = require('angular2/src/services/xhr');
var component_url_mapper_1 = require('angular2/src/core/compiler/component_url_mapper');
var url_resolver_1 = require('angular2/src/services/url_resolver');
var style_url_resolver_1 = require('angular2/src/render/dom/shadow_dom/style_url_resolver');
var style_inliner_1 = require('angular2/src/render/dom/shadow_dom/style_inliner');
var vm_turn_zone_1 = require('angular2/src/core/zone/vm_turn_zone');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var application_tokens_1 = require('angular2/src/core/application_tokens');
var event_manager_1 = require('angular2/src/render/dom/events/event_manager');
var template_resolver_mock_1 = require('angular2/src/mock/template_resolver_mock');
var xhr_mock_1 = require('angular2/src/mock/xhr_mock');
var vm_turn_zone_mock_1 = require('angular2/src/mock/vm_turn_zone_mock');
var test_bed_1 = require('./test_bed');
var di_2 = require('angular2/di');
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
function _getRootBindings() {
    return [di_1.bind(reflection_1.Reflector).toValue(reflection_1.reflector)];
}
function _getAppBindings() {
    var appDoc;
    try {
        appDoc = dom_adapter_1.DOM.defaultDoc();
    }
    catch (e) {
        appDoc = null;
    }
    return [di_1.bind(application_tokens_1.appDocumentToken).toValue(appDoc), di_1.bind(shadow_dom_strategy_1.ShadowDomStrategy).toFactory(function (styleUrlResolver, doc) { return new shadow_dom_strategy_1.EmulatedUnscopedShadowDomStrategy(styleUrlResolver, doc.head); }, [style_url_resolver_1.StyleUrlResolver, application_tokens_1.appDocumentToken]), compiler_1.Compiler, compiler_1.CompilerCache, di_1.bind(template_resolver_1.TemplateResolver).toClass(template_resolver_mock_1.MockTemplateResolver), di_1.bind(change_detection_1.ChangeDetection).toValue(change_detection_1.dynamicChangeDetection), template_loader_1.TemplateLoader, directive_metadata_reader_1.DirectiveMetadataReader, change_detection_1.Parser, change_detection_1.Lexer, exception_handler_1.ExceptionHandler, di_1.bind(xhr_1.XHR).toClass(xhr_mock_1.MockXHR), component_url_mapper_1.ComponentUrlMapper, url_resolver_1.UrlResolver, style_url_resolver_1.StyleUrlResolver, style_inliner_1.StyleInliner, test_bed_1.TestBed, di_1.bind(vm_turn_zone_1.VmTurnZone).toClass(vm_turn_zone_mock_1.MockVmTurnZone), di_1.bind(event_manager_1.EventManager).toFactory(function (zone) {
            var plugins = [new event_manager_1.DomEventsPlugin()];
            return new event_manager_1.EventManager(plugins, zone);
        }, [vm_turn_zone_1.VmTurnZone])];
}
function createTestInjector(bindings) {
    var rootInjector = new di_2.Injector(_getRootBindings());
    return rootInjector.createChild(collection_1.ListWrapper.concat(_getAppBindings(), bindings));
}
exports.createTestInjector = createTestInjector;
Object.defineProperty(createTestInjector, "parameters", { get: function () {
        return [[collection_1.List]];
    } });
function inject(tokens, fn) {
    return new FunctionWithParamTokens(tokens, fn);
}
exports.inject = inject;
Object.defineProperty(inject, "parameters", { get: function () {
        return [[collection_1.List], [Function]];
    } });
var FunctionWithParamTokens = (function () {
    function FunctionWithParamTokens(tokens, fn) {
        this._tokens = tokens;
        this._fn = fn;
    }
    FunctionWithParamTokens.prototype.execute = function (injector) {
        var params = collection_1.ListWrapper.map(this._tokens, function (t) { return injector.get(t); });
        lang_1.FunctionWrapper.apply(this._fn, params);
    };
    return FunctionWithParamTokens;
})();
exports.FunctionWithParamTokens = FunctionWithParamTokens;
Object.defineProperty(FunctionWithParamTokens, "parameters", { get: function () {
        return [[collection_1.List], [Function]];
    } });
Object.defineProperty(FunctionWithParamTokens.prototype.execute, "parameters", { get: function () {
        return [[di_2.Injector]];
    } });
