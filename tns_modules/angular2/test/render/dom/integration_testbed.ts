import {el} from 'angular2/test_lib';
import {isBlank,
  isPresent,
  BaseException} from 'angular2/src/facade/lang';
import {MapWrapper,
  ListWrapper,
  List} from 'angular2/src/facade/collection';
import {PromiseWrapper,
  Promise} from 'angular2/src/facade/async';
import {DOM} from 'angular2/src/dom/dom_adapter';
import {Parser,
  Lexer} from 'angular2/change_detection';
import {DirectDomRenderer} from 'angular2/src/render/dom/direct_dom_renderer';
import {Compiler} from 'angular2/src/render/dom/compiler/compiler';
import {ProtoViewRef,
  ProtoView,
  Template,
  ViewContainerRef,
  EventDispatcher,
  DirectiveMetadata} from 'angular2/src/render/api';
import {DefaultStepFactory} from 'angular2/src/render/dom/compiler/compile_step_factory';
import {TemplateLoader} from 'angular2/src/render/dom/compiler/template_loader';
import {UrlResolver} from 'angular2/src/services/url_resolver';
import {EmulatedUnscopedShadowDomStrategy} from 'angular2/src/render/dom/shadow_dom/emulated_unscoped_shadow_dom_strategy';
import {EventManager,
  EventManagerPlugin} from 'angular2/src/render/dom/events/event_manager';
import {VmTurnZone} from 'angular2/src/core/zone/vm_turn_zone';
import {StyleUrlResolver} from 'angular2/src/render/dom/shadow_dom/style_url_resolver';
import {ViewFactory} from 'angular2/src/render/dom/view/view_factory';
export class IntegrationTestbed {
  constructor({urlData,
    viewCacheCapacity,
    shadowDomStrategy,
    templates}) {
    this._templates = MapWrapper.create();
    if (isPresent(templates)) {
      ListWrapper.forEach(templates, (template) => {
        MapWrapper.set(this._templates, template.componentId, template);
      });
    }
    this._compileCache = MapWrapper.create();
    var parser = new Parser(new Lexer());
    var urlResolver = new UrlResolver();
    if (isBlank(shadowDomStrategy)) {
      shadowDomStrategy = new EmulatedUnscopedShadowDomStrategy(new StyleUrlResolver(urlResolver), null);
    }
    var compiler = new Compiler(new DefaultStepFactory(parser, shadowDomStrategy), new FakeTemplateLoader(urlResolver, urlData));
    if (isBlank(viewCacheCapacity)) {
      viewCacheCapacity = 1;
    }
    if (isBlank(urlData)) {
      urlData = MapWrapper.create();
    }
    this.eventPlugin = new FakeEventManagerPlugin();
    var eventManager = new EventManager([this.eventPlugin], new FakeVmTurnZone());
    var viewFactory = new ViewFactory(viewCacheCapacity, eventManager, shadowDomStrategy);
    this.renderer = new DirectDomRenderer(compiler, viewFactory, shadowDomStrategy);
    this.rootEl = el('<div></div>');
    this.rootProtoViewRef = this.renderer.createRootProtoView(this.rootEl);
  }
  compile(templateHtml, directives) {
    return this._compileRecurse(new Template({
      componentId: 'root',
      inline: templateHtml,
      directives: directives
    })).then((protoViewRefs) => {
      return this._flattenList([this.renderer.mergeChildComponentProtoViews(this.rootProtoViewRef, [protoViewRefs[0]]), protoViewRefs]);
    });
  }
  _compileRecurse(template) {
    var result = MapWrapper.get(this._compileCache, template.componentId);
    if (isPresent(result)) {
      return result;
    }
    result = this.renderer.compile(template).then((pv) => {
      var childComponentPromises = ListWrapper.map(this._findNestedComponentIds(template, pv), (componentId) => {
        var childTemplate = MapWrapper.get(this._templates, componentId);
        if (isBlank(childTemplate)) {
          throw new BaseException(`Could not find template for ${componentId}!`);
        }
        return this._compileRecurse(childTemplate);
      });
      return PromiseWrapper.all(childComponentPromises).then((protoViewRefsWithChildren) => {
        var protoViewRefs = ListWrapper.map(protoViewRefsWithChildren, (arr) => arr[0]);
        return this._flattenList([this.renderer.mergeChildComponentProtoViews(pv.render, protoViewRefs), protoViewRefsWithChildren]);
      });
    });
    MapWrapper.set(this._compileCache, template.componentId, result);
    return result;
  }
  _findNestedComponentIds(template, pv, target = null) {
    if (isBlank(target)) {
      target = [];
    }
    for (var binderIdx = 0; binderIdx < pv.elementBinders.length; binderIdx++) {
      var eb = pv.elementBinders[binderIdx];
      var componentDirective;
      ListWrapper.forEach(eb.directives, (db) => {
        var meta = template.directives[db.directiveIndex];
        if (meta.type === DirectiveMetadata.COMPONENT_TYPE) {
          componentDirective = meta;
        }
      });
      if (isPresent(componentDirective)) {
        ListWrapper.push(target, componentDirective.id);
      } else if (isPresent(eb.nestedProtoView)) {
        this._findNestedComponentIds(template, eb.nestedProtoView, target);
      }
    }
    return target;
  }
  _flattenList(tree, out = null) {
    if (isBlank(out)) {
      out = [];
    }
    for (var i = 0; i < tree.length; i++) {
      var item = tree[i];
      if (ListWrapper.isList(item)) {
        this._flattenList(item, out);
      } else {
        ListWrapper.push(out, item);
      }
    }
    return out;
  }
}
Object.defineProperty(IntegrationTestbed.prototype._flattenList, "parameters", {get: function() {
    return [[List], [List]];
  }});
class FakeTemplateLoader extends TemplateLoader {
  constructor(urlResolver, urlData) {
    super(null, urlResolver);
    this._urlData = urlData;
  }
  load(template) {
    if (isPresent(template.inline)) {
      return PromiseWrapper.resolve(DOM.createTemplate(template.inline));
    }
    if (isPresent(template.absUrl)) {
      var content = this._urlData[template.absUrl];
      if (isPresent(content)) {
        return PromiseWrapper.resolve(DOM.createTemplate(content));
      }
    }
    return PromiseWrapper.reject('Load failed');
  }
}
Object.defineProperty(FakeTemplateLoader.prototype.load, "parameters", {get: function() {
    return [[Template]];
  }});
export class FakeVmTurnZone extends VmTurnZone {
  constructor() {
    super({enableLongStackTrace: false});
  }
  run(fn) {
    fn();
  }
  runOutsideAngular(fn) {
    fn();
  }
}
export class FakeEventManagerPlugin extends EventManagerPlugin {
  constructor() {
    super();
    this._eventHandlers = MapWrapper.create();
  }
  dispatchEvent(eventName, event) {
    MapWrapper.get(this._eventHandlers, eventName)(event);
  }
  supports(eventName) {
    return true;
  }
  addEventListener(element, eventName, handler, shouldSupportBubble) {
    MapWrapper.set(this._eventHandlers, eventName, handler);
  }
}
Object.defineProperty(FakeEventManagerPlugin.prototype.supports, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(FakeEventManagerPlugin.prototype.addEventListener, "parameters", {get: function() {
    return [[], [assert.type.string], [Function], [assert.type.boolean]];
  }});
export class LoggingEventDispatcher extends EventDispatcher {
  constructor() {
    super();
    this.log = [];
  }
  dispatchEvent(elementIndex, eventName, locals) {
    ListWrapper.push(this.log, [elementIndex, eventName, locals]);
  }
}
Object.defineProperty(LoggingEventDispatcher.prototype.dispatchEvent, "parameters", {get: function() {
    return [[assert.type.number], [assert.type.string], [assert.genericType(List, assert.type.any)]];
  }});
export class FakeEvent {
  constructor(target) {
    this.target = target;
  }
}
//# sourceMappingURL=integration_testbed.js.map

//# sourceMappingURL=./integration_testbed.map