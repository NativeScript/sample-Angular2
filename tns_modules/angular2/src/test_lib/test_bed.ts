import {Injector} from 'angular2/di';
import {Type,
  isPresent,
  BaseException} from 'angular2/src/facade/lang';
import {Promise} from 'angular2/src/facade/async';
import {isBlank} from 'angular2/src/facade/lang';
import {List} from 'angular2/src/facade/collection';
import {Template} from 'angular2/src/core/annotations/template';
import {TemplateResolver} from 'angular2/src/core/compiler/template_resolver';
import {Compiler} from 'angular2/src/core/compiler/compiler';
import {View} from 'angular2/src/core/compiler/view';
import {EventManager} from 'angular2/src/render/dom/events/event_manager';
import {queryView} from './utils';
import {instantiateType,
  getTypeOf} from './lang_utils';
export class TestBed {
  constructor(injector) {
    this._injector = injector;
  }
  overrideTemplate(component, template) {
    this._injector.get(TemplateResolver).setTemplate(component, template);
  }
  setInlineTemplate(component, html) {
    this._injector.get(TemplateResolver).setInlineTemplate(component, html);
  }
  overrideDirective(component, from, to) {
    this._injector.get(TemplateResolver).overrideTemplateDirective(component, from, to);
  }
  createView(component, {context = null,
    html = null} = {}) {
    if (isBlank(component) && isBlank(context)) {
      throw new BaseException('You must specified at least a component or a context');
    }
    if (isBlank(component)) {
      component = getTypeOf(context);
    } else if (isBlank(context)) {
      context = instantiateType(component);
    }
    if (isPresent(html)) {
      this.setInlineTemplate(component, html);
    }
    return this._injector.get(Compiler).compile(component).then((pv) => {
      var eventManager = this._injector.get(EventManager);
      var view = pv.instantiate(null, eventManager);
      view.hydrate(this._injector, null, null, context, null);
      return new ViewProxy(view);
    });
  }
}
Object.defineProperty(TestBed, "parameters", {get: function() {
    return [[Injector]];
  }});
Object.defineProperty(TestBed.prototype.overrideTemplate, "parameters", {get: function() {
    return [[Type], [Template]];
  }});
Object.defineProperty(TestBed.prototype.setInlineTemplate, "parameters", {get: function() {
    return [[Type], [assert.type.string]];
  }});
Object.defineProperty(TestBed.prototype.overrideDirective, "parameters", {get: function() {
    return [[Type], [Type], [Type]];
  }});
Object.defineProperty(TestBed.prototype.createView, "parameters", {get: function() {
    return [[Type], []];
  }});
export class ViewProxy {
  constructor(view) {
    this._view = view;
  }
  get context() {
    return this._view.context;
  }
  get nodes() {
    return this._view.nodes;
  }
  detectChanges() {
    this._view.changeDetector.detectChanges();
  }
  querySelector(selector) {
    return queryView(this._view, selector);
  }
  get rawView() {
    return this._view;
  }
}
Object.defineProperty(ViewProxy, "parameters", {get: function() {
    return [[View]];
  }});
//# sourceMappingURL=test_bed.js.map

//# sourceMappingURL=./test_bed.map