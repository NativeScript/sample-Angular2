import {Map,
  MapWrapper,
  ListWrapper} from 'angular2/src/facade/collection';
import {Type,
  isPresent,
  BaseException,
  stringify,
  isBlank} from 'angular2/src/facade/lang';
import {Template} from 'angular2/src/core/annotations/template';
import {TemplateResolver} from 'angular2/src/core/compiler/template_resolver';
export class MockTemplateResolver extends TemplateResolver {
  constructor() {
    super();
    this._templates = MapWrapper.create();
    this._inlineTemplates = MapWrapper.create();
    this._templateCache = MapWrapper.create();
    this._directiveOverrides = MapWrapper.create();
  }
  setTemplate(component, template) {
    this._checkOverrideable(component);
    MapWrapper.set(this._templates, component, template);
  }
  setInlineTemplate(component, template) {
    this._checkOverrideable(component);
    MapWrapper.set(this._inlineTemplates, component, template);
  }
  overrideTemplateDirective(component, from, to) {
    this._checkOverrideable(component);
    var overrides = MapWrapper.get(this._directiveOverrides, component);
    if (isBlank(overrides)) {
      overrides = MapWrapper.create();
      MapWrapper.set(this._directiveOverrides, component, overrides);
    }
    MapWrapper.set(overrides, from, to);
  }
  resolve(component) {
    var template = MapWrapper.get(this._templateCache, component);
    if (isPresent(template))
      return template;
    template = MapWrapper.get(this._templates, component);
    if (isBlank(template)) {
      template = super.resolve(component);
    }
    var directives = template.directives;
    var overrides = MapWrapper.get(this._directiveOverrides, component);
    if (isPresent(overrides) && isPresent(directives)) {
      directives = ListWrapper.clone(template.directives);
      MapWrapper.forEach(overrides, (to, from) => {
        var srcIndex = directives.indexOf(from);
        if (srcIndex == -1) {
          throw new BaseException(`Overriden directive ${stringify(from)} not found in the template of ${stringify(component)}`);
        }
        directives[srcIndex] = to;
      });
      template = new Template({
        inline: template.inline,
        url: template.url,
        directives: directives,
        formatters: template.formatters,
        source: template.source,
        locale: template.locale,
        device: template.device
      });
    }
    var inlineTemplate = MapWrapper.get(this._inlineTemplates, component);
    if (isPresent(inlineTemplate)) {
      template = new Template({
        inline: inlineTemplate,
        url: null,
        directives: template.directives,
        formatters: template.formatters,
        source: template.source,
        locale: template.locale,
        device: template.device
      });
    }
    MapWrapper.set(this._templateCache, component, template);
    return template;
  }
  _checkOverrideable(component) {
    var cached = MapWrapper.get(this._templateCache, component);
    if (isPresent(cached)) {
      throw new BaseException(`The component ${stringify(component)} has already been compiled, its configuration can not be changed`);
    }
  }
}
Object.defineProperty(MockTemplateResolver.prototype.setTemplate, "parameters", {get: function() {
    return [[Type], [Template]];
  }});
Object.defineProperty(MockTemplateResolver.prototype.setInlineTemplate, "parameters", {get: function() {
    return [[Type], [assert.type.string]];
  }});
Object.defineProperty(MockTemplateResolver.prototype.overrideTemplateDirective, "parameters", {get: function() {
    return [[Type], [Type], [Type]];
  }});
Object.defineProperty(MockTemplateResolver.prototype.resolve, "parameters", {get: function() {
    return [[Type]];
  }});
Object.defineProperty(MockTemplateResolver.prototype._checkOverrideable, "parameters", {get: function() {
    return [[Type]];
  }});
//# sourceMappingURL=template_resolver_mock.js.map

//# sourceMappingURL=./template_resolver_mock.map