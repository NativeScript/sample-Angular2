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
var browser_adapter_1 = require('angular2/src/dom/browser_adapter');
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var compiler_1 = require('./compiler/compiler');
var view_1 = require('./compiler/view');
var reflection_1 = require('angular2/src/reflection/reflection');
var change_detection_1 = require('angular2/change_detection');
var exception_handler_1 = require('./exception_handler');
var template_loader_1 = require('angular2/src/render/dom/compiler/template_loader');
var template_resolver_1 = require('./compiler/template_resolver');
var directive_metadata_reader_1 = require('./compiler/directive_metadata_reader');
var element_injector_1 = require('./compiler/element_injector');
var collection_1 = require('angular2/src/facade/collection');
var async_1 = require('angular2/src/facade/async');
var vm_turn_zone_1 = require('angular2/src/core/zone/vm_turn_zone');
var life_cycle_1 = require('angular2/src/core/life_cycle/life_cycle');
var shadow_dom_strategy_1 = require('angular2/src/core/compiler/shadow_dom_strategy');
var xhr_1 = require('angular2/src/services/xhr');
var xhr_impl_1 = require('angular2/src/services/xhr_impl');
var event_manager_1 = require('angular2/src/render/dom/events/event_manager');
var binding_1 = require('angular2/src/di/binding');
var component_url_mapper_1 = require('angular2/src/core/compiler/component_url_mapper');
var url_resolver_1 = require('angular2/src/services/url_resolver');
var style_url_resolver_1 = require('angular2/src/render/dom/shadow_dom/style_url_resolver');
var style_inliner_1 = require('angular2/src/render/dom/shadow_dom/style_inliner');
var annotations_1 = require('angular2/src/core/annotations/annotations');
var private_component_loader_1 = require('angular2/src/core/compiler/private_component_loader');
var testability_1 = require('angular2/src/core/testability/testability');
var application_tokens_1 = require('./application_tokens');
var _rootInjector;
var _rootBindings = [di_1.bind(reflection_1.Reflector).toValue(reflection_1.reflector), testability_1.TestabilityRegistry];
function _injectorBindings(appComponentType) {
    return [di_1.bind(application_tokens_1.appDocumentToken).toValue(dom_adapter_1.DOM.defaultDoc()), di_1.bind(application_tokens_1.appComponentAnnotatedTypeToken).toFactory(function (reader) {
            return reader.read(appComponentType);
        }, [directive_metadata_reader_1.DirectiveMetadataReader]), di_1.bind(application_tokens_1.appElementToken).toFactory(function (appComponentAnnotatedType, appDocument) {
            var selector = appComponentAnnotatedType.annotation.selector;
            var element = dom_adapter_1.DOM.querySelector(appDocument, selector);
            if (lang_1.isBlank(element)) {
                throw new lang_1.BaseException("The app selector \"" + selector + "\" did not match any elements");
            }
            return element;
        }, [application_tokens_1.appComponentAnnotatedTypeToken, application_tokens_1.appDocumentToken]), di_1.bind(application_tokens_1.appViewToken).toAsyncFactory(function (changeDetection, compiler, injector, appElement, appComponentAnnotatedType, strategy, eventManager, testability, registry) {
            registry.registerApplication(appElement, testability);
            var annotation = appComponentAnnotatedType.annotation;
            if (!lang_1.isBlank(annotation) && !(annotation instanceof annotations_1.Component)) {
                var type = appComponentAnnotatedType.type;
                throw new lang_1.BaseException("Only Components can be bootstrapped; " + ("Directive of " + lang_1.stringify(type) + " is not a Component"));
            }
            return compiler.compile(appComponentAnnotatedType.type).then(function (protoView) {
                var appProtoView = view_1.ProtoView.createRootProtoView(protoView, appElement, element_injector_1.DirectiveBinding.createFromType(appComponentAnnotatedType.type, appComponentAnnotatedType.annotation), changeDetection.createProtoChangeDetector('root'), strategy);
                var view = appProtoView.instantiate(null, eventManager);
                view.hydrate(injector, null, null, new Object(), null);
                return view;
            });
        }, [change_detection_1.ChangeDetection, compiler_1.Compiler, di_1.Injector, application_tokens_1.appElementToken, application_tokens_1.appComponentAnnotatedTypeToken, shadow_dom_strategy_1.ShadowDomStrategy, event_manager_1.EventManager, testability_1.Testability, testability_1.TestabilityRegistry]), di_1.bind(application_tokens_1.appChangeDetectorToken).toFactory(function (rootView) { return rootView.changeDetector; }, [application_tokens_1.appViewToken]), di_1.bind(appComponentType).toFactory(function (rootView) { return rootView.elementInjectors[0].getComponent(); }, [application_tokens_1.appViewToken]), di_1.bind(life_cycle_1.LifeCycle).toFactory(function (exceptionHandler) { return new life_cycle_1.LifeCycle(exceptionHandler, null, lang_1.assertionsEnabled()); }, [exception_handler_1.ExceptionHandler]), di_1.bind(event_manager_1.EventManager).toFactory(function (zone) {
            var plugins = [new event_manager_1.DomEventsPlugin()];
            return new event_manager_1.EventManager(plugins, zone);
        }, [vm_turn_zone_1.VmTurnZone]), di_1.bind(shadow_dom_strategy_1.ShadowDomStrategy).toFactory(function (styleUrlResolver, doc) { return new shadow_dom_strategy_1.EmulatedUnscopedShadowDomStrategy(styleUrlResolver, doc.head); }, [style_url_resolver_1.StyleUrlResolver, application_tokens_1.appDocumentToken]), compiler_1.Compiler, compiler_1.CompilerCache, template_resolver_1.TemplateResolver, di_1.bind(change_detection_1.ChangeDetection).toValue(change_detection_1.dynamicChangeDetection), template_loader_1.TemplateLoader, directive_metadata_reader_1.DirectiveMetadataReader, change_detection_1.Parser, change_detection_1.Lexer, exception_handler_1.ExceptionHandler, di_1.bind(xhr_1.XHR).toValue(new xhr_impl_1.XHRImpl()), component_url_mapper_1.ComponentUrlMapper, url_resolver_1.UrlResolver, style_url_resolver_1.StyleUrlResolver, style_inliner_1.StyleInliner, private_component_loader_1.PrivateComponentLoader, testability_1.Testability];
}
function _createVmZone(givenReporter) {
    var defaultErrorReporter = function (exception, stackTrace) {
        var longStackTrace = collection_1.ListWrapper.join(stackTrace, "\n\n-----async gap-----\n");
        lang_1.print(exception + "\n\n" + longStackTrace);
        throw exception;
    };
    var reporter = lang_1.isPresent(givenReporter) ? givenReporter : defaultErrorReporter;
    var zone = new vm_turn_zone_1.VmTurnZone({ enableLongStackTrace: lang_1.assertionsEnabled() });
    zone.initCallbacks({ onErrorHandler: reporter });
    return zone;
}
Object.defineProperty(_createVmZone, "parameters", { get: function () {
        return [[Function]];
    } });
function bootstrap(appComponentType, componentServiceBindings, errorReporter) {
    if (componentServiceBindings === void 0) { componentServiceBindings = null; }
    if (errorReporter === void 0) { errorReporter = null; }
    browser_adapter_1.BrowserDomAdapter.makeCurrent();
    var bootstrapProcess = async_1.PromiseWrapper.completer();
    var zone = _createVmZone(errorReporter);
    zone.run(function () {
        var appInjector = _createAppInjector(appComponentType, componentServiceBindings, zone);
        async_1.PromiseWrapper.then(appInjector.asyncGet(application_tokens_1.appViewToken), function (rootView) {
            var lc = appInjector.get(life_cycle_1.LifeCycle);
            lc.registerWith(zone, rootView.changeDetector);
            lc.tick();
            bootstrapProcess.resolve(appInjector);
        }, function (err) {
            bootstrapProcess.reject(err);
        });
    });
    return bootstrapProcess.promise;
}
exports.bootstrap = bootstrap;
Object.defineProperty(bootstrap, "parameters", { get: function () {
        return [[lang_1.Type], [assert.genericType(collection_1.List, binding_1.Binding)], [Function]];
    } });
function _createAppInjector(appComponentType, bindings, zone) {
    if (lang_1.isBlank(_rootInjector))
        _rootInjector = new di_1.Injector(_rootBindings);
    var mergedBindings = lang_1.isPresent(bindings) ? collection_1.ListWrapper.concat(_injectorBindings(appComponentType), bindings) : _injectorBindings(appComponentType);
    collection_1.ListWrapper.push(mergedBindings, di_1.bind(vm_turn_zone_1.VmTurnZone).toValue(zone));
    return _rootInjector.createChild(mergedBindings);
}
Object.defineProperty(_createAppInjector, "parameters", { get: function () {
        return [[lang_1.Type], [assert.genericType(collection_1.List, binding_1.Binding)], [vm_turn_zone_1.VmTurnZone]];
    } });
