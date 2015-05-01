import {Injectable} from 'angular2/di';
import {Type,
  isBlank,
  isPresent,
  BaseException,
  normalizeBlank,
  stringify} from 'angular2/src/facade/lang';
import {Promise,
  PromiseWrapper} from 'angular2/src/facade/async';
import {List,
  ListWrapper,
  Map,
  MapWrapper} from 'angular2/src/facade/collection';
import {ChangeDetection,
  Parser} from 'angular2/change_detection';
import {DirectiveMetadataReader} from './directive_metadata_reader';
import {Component,
  Viewport,
  DynamicComponent,
  Decorator} from '../annotations/annotations';
import {ProtoView} from './view';
import {DirectiveBinding} from './element_injector';
import {TemplateResolver} from './template_resolver';
import {Template} from '../annotations/template';
import {ShadowDomStrategy} from './shadow_dom_strategy';
import {ComponentUrlMapper} from './component_url_mapper';
import {ProtoViewFactory} from './proto_view_factory';
import {UrlResolver} from 'angular2/src/services/url_resolver';
import {TemplateLoader} from 'angular2/src/render/dom/compiler/template_loader';
import {DefaultStepFactory} from 'angular2/src/render/dom/compiler/compile_step_factory';
import {DirectDomRenderer} from 'angular2/src/render/dom/direct_dom_renderer';
import * as rc from 'angular2/src/render/dom/compiler/compiler';
import * as renderApi from 'angular2/src/render/api';
export class CompilerCache {
  constructor() {
    this._cache = MapWrapper.create();
  }
  set(component, protoView) {
    MapWrapper.set(this._cache, component, protoView);
  }
  get(component) {
    var result = MapWrapper.get(this._cache, component);
    return normalizeBlank(result);
  }
  clear() {
    MapWrapper.clear(this._cache);
  }
}
Object.defineProperty(CompilerCache, "annotations", {get: function() {
    return [new Injectable()];
  }});
Object.defineProperty(CompilerCache.prototype.set, "parameters", {get: function() {
    return [[Type], [ProtoView]];
  }});
Object.defineProperty(CompilerCache.prototype.get, "parameters", {get: function() {
    return [[Type]];
  }});
export class NewCompiler {
  constructor(reader, cache, templateResolver, componentUrlMapper, urlResolver, renderer, protoViewFactory) {
    this._reader = reader;
    this._compilerCache = cache;
    this._compiling = MapWrapper.create();
    this._templateResolver = templateResolver;
    this._componentUrlMapper = componentUrlMapper;
    this._urlResolver = urlResolver;
    this._appUrl = urlResolver.resolve(null, './');
    this._renderer = renderer;
    this._protoViewFactory = protoViewFactory;
  }
  _bindDirective(directive) {
    var meta = this._reader.read(directive);
    return DirectiveBinding.createFromType(meta.type, meta.annotation);
  }
  compile(component) {
    var protoView = this._compile(this._bindDirective(component));
    return PromiseWrapper.isPromise(protoView) ? protoView : PromiseWrapper.resolve(protoView);
  }
  _compile(componentBinding) {
    var component = componentBinding.key.token;
    var protoView = this._compilerCache.get(component);
    if (isPresent(protoView)) {
      return protoView;
    }
    var pvPromise = MapWrapper.get(this._compiling, component);
    if (isPresent(pvPromise)) {
      return pvPromise;
    }
    var template = this._templateResolver.resolve(component);
    var directives = ListWrapper.map(this._flattenDirectives(template), (directive) => this._bindDirective(directive));
    pvPromise = this._compileNoRecurse(componentBinding, template, directives).then((protoView) => {
      this._compilerCache.set(component, protoView);
      MapWrapper.delete(this._compiling, component);
      var nestedPVPromises = this._compileNestedComponents(protoView);
      if (nestedPVPromises.length > 0) {
        return PromiseWrapper.then(PromiseWrapper.all(nestedPVPromises), (_) => protoView, (e) => {
          throw new BaseException(`${e} -> Failed to compile ${stringify(component)}`);
        });
      }
      return protoView;
    });
    MapWrapper.set(this._compiling, component, pvPromise);
    return pvPromise;
  }
  _compileNoRecurse(componentBinding, template, directives) {
    var component = componentBinding.key.token;
    var componentUrl = this._urlResolver.resolve(this._appUrl, this._componentUrlMapper.getUrl(component));
    var templateAbsUrl = null;
    if (isPresent(template.url)) {
      templateAbsUrl = this._urlResolver.resolve(componentUrl, template.url);
    } else {
      templateAbsUrl = componentUrl;
    }
    var renderTemplate = new renderApi.Template({
      componentId: stringify(component),
      absUrl: templateAbsUrl,
      inline: template.inline,
      directives: ListWrapper.map(directives, this._buildRenderDirective)
    });
    return this._renderer.compile(renderTemplate).then((renderPv) => {
      return this._protoViewFactory.createProtoView(componentBinding.annotation, renderPv, directives);
    });
  }
  _compileNestedComponents(protoView, nestedPVPromises = null) {
    if (isBlank(nestedPVPromises)) {
      nestedPVPromises = [];
    }
    ListWrapper.map(protoView.elementBinders, (elementBinder) => {
      var nestedComponent = elementBinder.componentDirective;
      if (isPresent(nestedComponent) && !(nestedComponent.annotation instanceof DynamicComponent)) {
        var nestedCall = this._compile(nestedComponent);
        if (PromiseWrapper.isPromise(nestedCall)) {
          ListWrapper.push(nestedPVPromises, nestedCall.then((nestedPv) => {
            elementBinder.nestedProtoView = nestedPv;
          }));
        } else {
          elementBinder.nestedProtoView = nestedCall;
        }
      } else if (isPresent(elementBinder.nestedProtoView)) {
        this._compileNestedComponents(elementBinder.nestedProtoView, nestedPVPromises);
      }
    });
    return nestedPVPromises;
  }
  _buildRenderDirective(directiveBinding) {
    var ann = directiveBinding.annotation;
    var renderType;
    var compileChildren = true;
    if ((ann instanceof Component) || (ann instanceof DynamicComponent)) {
      renderType = renderApi.DirectiveMetadata.COMPONENT_TYPE;
    } else if (ann instanceof Viewport) {
      renderType = renderApi.DirectiveMetadata.VIEWPORT_TYPE;
    } else if (ann instanceof Decorator) {
      renderType = renderApi.DirectiveMetadata.DECORATOR_TYPE;
      compileChildren = ann.compileChildren;
    }
    var setters = [];
    var readAttributes = [];
    ListWrapper.forEach(directiveBinding.dependencies, (dep) => {
      if (isPresent(dep.propSetterName)) {
        ListWrapper.push(setters, dep.propSetterName);
      }
      if (isPresent(dep.attributeName)) {
        ListWrapper.push(readAttributes, dep.attributeName);
      }
    });
    return new renderApi.DirectiveMetadata({
      id: stringify(directiveBinding.key.token),
      type: renderType,
      selector: ann.selector,
      compileChildren: compileChildren,
      events: isPresent(ann.events) ? MapWrapper.createFromStringMap(ann.events) : null,
      bind: isPresent(ann.bind) ? MapWrapper.createFromStringMap(ann.bind) : null,
      setters: setters,
      readAttributes: readAttributes
    });
  }
  _flattenDirectives(template) {
    if (isBlank(template.directives))
      return [];
    var directives = [];
    this._flattenList(template.directives, directives);
    return directives;
  }
  _flattenList(tree, out) {
    for (var i = 0; i < tree.length; i++) {
      var item = tree[i];
      if (ListWrapper.isList(item)) {
        this._flattenList(item, out);
      } else {
        ListWrapper.push(out, item);
      }
    }
  }
}
Object.defineProperty(NewCompiler, "parameters", {get: function() {
    return [[DirectiveMetadataReader], [CompilerCache], [TemplateResolver], [ComponentUrlMapper], [UrlResolver], [renderApi.Renderer], [ProtoViewFactory]];
  }});
Object.defineProperty(NewCompiler.prototype.compile, "parameters", {get: function() {
    return [[Type]];
  }});
Object.defineProperty(NewCompiler.prototype._compile, "parameters", {get: function() {
    return [[DirectiveBinding]];
  }});
Object.defineProperty(NewCompiler.prototype._flattenDirectives, "parameters", {get: function() {
    return [[Template]];
  }});
Object.defineProperty(NewCompiler.prototype._flattenList, "parameters", {get: function() {
    return [[assert.genericType(List, assert.type.any)], [assert.genericType(List, Type)]];
  }});
export class Compiler extends NewCompiler {
  constructor(changeDetection, templateLoader, reader, parser, cache, shadowDomStrategy, templateResolver, componentUrlMapper, urlResolver) {
    super(reader, cache, templateResolver, componentUrlMapper, urlResolver, new DirectDomRenderer(new rc.Compiler(new DefaultStepFactory(parser, shadowDomStrategy.render), templateLoader), null, null), new ProtoViewFactory(changeDetection, shadowDomStrategy));
  }
}
Object.defineProperty(Compiler, "annotations", {get: function() {
    return [new Injectable()];
  }});
Object.defineProperty(Compiler, "parameters", {get: function() {
    return [[ChangeDetection], [TemplateLoader], [DirectiveMetadataReader], [Parser], [CompilerCache], [ShadowDomStrategy], [TemplateResolver], [ComponentUrlMapper], [UrlResolver]];
  }});
//# sourceMappingURL=compiler.js.map

//# sourceMappingURL=./compiler.map