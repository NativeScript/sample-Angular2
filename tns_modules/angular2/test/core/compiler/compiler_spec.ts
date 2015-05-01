import {AsyncTestCompleter,
  beforeEach,
  xdescribe,
  ddescribe,
  describe,
  el,
  expect,
  iit,
  inject,
  IS_DARTIUM,
  it} from 'angular2/test_lib';
import {List,
  ListWrapper,
  Map,
  MapWrapper,
  StringMapWrapper} from 'angular2/src/facade/collection';
import {Type,
  isBlank,
  stringify,
  isPresent} from 'angular2/src/facade/lang';
import {PromiseWrapper,
  Promise} from 'angular2/src/facade/async';
import {NewCompiler,
  CompilerCache} from 'angular2/src/core/compiler/compiler';
import {ProtoView} from 'angular2/src/core/compiler/view';
import {ElementBinder} from 'angular2/src/core/compiler/element_binder';
import {DirectiveMetadataReader} from 'angular2/src/core/compiler/directive_metadata_reader';
import {Component,
  DynamicComponent,
  Viewport,
  Decorator} from 'angular2/src/core/annotations/annotations';
import {PropertySetter,
  Attribute} from 'angular2/src/core/annotations/di';
import {Template} from 'angular2/src/core/annotations/template';
import {DirectiveBinding} from 'angular2/src/core/compiler/element_injector';
import {TemplateResolver} from 'angular2/src/core/compiler/template_resolver';
import {ComponentUrlMapper,
  RuntimeComponentUrlMapper} from 'angular2/src/core/compiler/component_url_mapper';
import {ProtoViewFactory} from 'angular2/src/core/compiler/proto_view_factory';
import {UrlResolver} from 'angular2/src/services/url_resolver';
import * as renderApi from 'angular2/src/render/api';
export function main() {
  describe('compiler', function() {
    var reader,
        tplResolver,
        renderer,
        protoViewFactory,
        cmpUrlMapper;
    beforeEach(() => {
      reader = new DirectiveMetadataReader();
      tplResolver = new FakeTemplateResolver();
      cmpUrlMapper = new RuntimeComponentUrlMapper();
    });
    function createCompiler(renderCompileResults, protoViewFactoryResults) {
      var urlResolver = new FakeUrlResolver();
      renderer = new FakeRenderer(renderCompileResults);
      protoViewFactory = new FakeProtoViewFactory(protoViewFactoryResults);
      return new NewCompiler(reader, new CompilerCache(), tplResolver, cmpUrlMapper, urlResolver, renderer, protoViewFactory);
    }
    Object.defineProperty(createCompiler, "parameters", {get: function() {
        return [[List], [assert.genericType(List, ProtoView)]];
      }});
    describe('serialize template', () => {
      function captureTemplate(template) {
        tplResolver.setTemplate(MainComponent, template);
        var compiler = createCompiler([createRenderProtoView()], [createProtoView()]);
        return compiler.compile(MainComponent).then((protoView) => {
          expect(renderer.requests.length).toBe(1);
          return renderer.requests[0];
        });
      }
      Object.defineProperty(captureTemplate, "parameters", {get: function() {
          return [[Template]];
        }});
      function captureDirective(directive) {
        return captureTemplate(new Template({
          inline: '<div></div>',
          directives: [directive]
        })).then((renderTpl) => {
          expect(renderTpl.directives.length).toBe(1);
          return renderTpl.directives[0];
        });
      }
      it('should fill the componentId', inject([AsyncTestCompleter], (async) => {
        captureTemplate(new Template({inline: '<div></div>'})).then((renderTpl) => {
          expect(renderTpl.componentId).toEqual(stringify(MainComponent));
          async.done();
        });
      }));
      it('should fill inline', inject([AsyncTestCompleter], (async) => {
        captureTemplate(new Template({inline: '<div></div>'})).then((renderTpl) => {
          expect(renderTpl.inline).toEqual('<div></div>');
          async.done();
        });
      }));
      it('should fill absUrl given inline templates', inject([AsyncTestCompleter], (async) => {
        cmpUrlMapper.setComponentUrl(MainComponent, '/mainComponent');
        captureTemplate(new Template({inline: '<div></div>'})).then((renderTpl) => {
          expect(renderTpl.absUrl).toEqual('http://www.app.com/mainComponent');
          async.done();
        });
      }));
      it('should fill absUrl given url template', inject([AsyncTestCompleter], (async) => {
        cmpUrlMapper.setComponentUrl(MainComponent, '/mainComponent');
        captureTemplate(new Template({url: '/someTemplate'})).then((renderTpl) => {
          expect(renderTpl.absUrl).toEqual('http://www.app.com/mainComponent/someTemplate');
          async.done();
        });
      }));
      it('should fill directive.id', inject([AsyncTestCompleter], (async) => {
        captureDirective(MainComponent).then((renderDir) => {
          expect(renderDir.id).toEqual(stringify(MainComponent));
          async.done();
        });
      }));
      it('should fill directive.selector', inject([AsyncTestCompleter], (async) => {
        captureDirective(MainComponent).then((renderDir) => {
          expect(renderDir.selector).toEqual('main-comp');
          async.done();
        });
      }));
      it('should fill directive.type for components', inject([AsyncTestCompleter], (async) => {
        captureDirective(MainComponent).then((renderDir) => {
          expect(renderDir.type).toEqual(renderApi.DirectiveMetadata.COMPONENT_TYPE);
          async.done();
        });
      }));
      it('should fill directive.type for dynamic components', inject([AsyncTestCompleter], (async) => {
        captureDirective(SomeDynamicComponentDirective).then((renderDir) => {
          expect(renderDir.type).toEqual(renderApi.DirectiveMetadata.COMPONENT_TYPE);
          async.done();
        });
      }));
      it('should fill directive.type for viewport directives', inject([AsyncTestCompleter], (async) => {
        captureDirective(SomeViewportDirective).then((renderDir) => {
          expect(renderDir.type).toEqual(renderApi.DirectiveMetadata.VIEWPORT_TYPE);
          async.done();
        });
      }));
      it('should fill directive.type for decorator directives', inject([AsyncTestCompleter], (async) => {
        captureDirective(SomeDecoratorDirective).then((renderDir) => {
          expect(renderDir.type).toEqual(renderApi.DirectiveMetadata.DECORATOR_TYPE);
          async.done();
        });
      }));
      it('should set directive.compileChildren to false for other directives', inject([AsyncTestCompleter], (async) => {
        captureDirective(MainComponent).then((renderDir) => {
          expect(renderDir.compileChildren).toEqual(true);
          async.done();
        });
      }));
      it('should set directive.compileChildren to true for decorator directives', inject([AsyncTestCompleter], (async) => {
        captureDirective(SomeDecoratorDirective).then((renderDir) => {
          expect(renderDir.compileChildren).toEqual(true);
          async.done();
        });
      }));
      it('should set directive.compileChildren to false for decorator directives', inject([AsyncTestCompleter], (async) => {
        captureDirective(IgnoreChildrenDecoratorDirective).then((renderDir) => {
          expect(renderDir.compileChildren).toEqual(false);
          async.done();
        });
      }));
      it('should set directive.events', inject([AsyncTestCompleter], (async) => {
        captureDirective(DirectiveWithEvents).then((renderDir) => {
          expect(renderDir.events).toEqual(MapWrapper.createFromStringMap({'someEvent': 'someAction'}));
          async.done();
        });
      }));
      it('should set directive.bind', inject([AsyncTestCompleter], (async) => {
        captureDirective(DirectiveWithBind).then((renderDir) => {
          expect(renderDir.bind).toEqual(MapWrapper.createFromStringMap({'a': 'b'}));
          async.done();
        });
      }));
      it('should read @PropertySetter', inject([AsyncTestCompleter], (async) => {
        captureDirective(DirectiveWithPropertySetters).then((renderDir) => {
          expect(renderDir.setters).toEqual(['someProp']);
          async.done();
        });
      }));
      it('should read @Attribute', inject([AsyncTestCompleter], (async) => {
        captureDirective(DirectiveWithAttributes).then((renderDir) => {
          expect(renderDir.readAttributes).toEqual(['someAttr']);
          async.done();
        });
      }));
    });
    describe('call ProtoViewFactory', () => {
      it('should pass the render protoView', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MainComponent, new Template({inline: '<div></div>'}));
        var renderProtoView = createRenderProtoView();
        var expectedProtoView = createProtoView();
        var compiler = createCompiler([renderProtoView], [expectedProtoView]);
        compiler.compile(MainComponent).then((protoView) => {
          var request = protoViewFactory.requests[0];
          expect(request[1]).toBe(renderProtoView);
          async.done();
        });
      }));
      it('should pass the component annotation', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MainComponent, new Template({inline: '<div></div>'}));
        var compiler = createCompiler([createRenderProtoView()], [createProtoView()]);
        compiler.compile(MainComponent).then((protoView) => {
          var request = protoViewFactory.requests[0];
          expect(request[0]).toEqual(new Component({selector: 'main-comp'}));
          async.done();
        });
      }));
      it('should pass the directive bindings', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MainComponent, new Template({
          inline: '<div></div>',
          directives: [SomeDecoratorDirective]
        }));
        var compiler = createCompiler([createRenderProtoView()], [createProtoView()]);
        compiler.compile(MainComponent).then((protoView) => {
          var request = protoViewFactory.requests[0];
          var binding = request[2][0];
          expect(binding.key.token).toBe(SomeDecoratorDirective);
          async.done();
        });
      }));
      it('should use the protoView of the ProtoViewFactory', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MainComponent, new Template({inline: '<div></div>'}));
        var renderProtoView = createRenderProtoView();
        var expectedProtoView = createProtoView();
        var compiler = createCompiler([renderProtoView], [expectedProtoView]);
        compiler.compile(MainComponent).then((protoView) => {
          expect(protoView).toBe(expectedProtoView);
          async.done();
        });
      }));
    });
    it('should load nested components in root ProtoView', inject([AsyncTestCompleter], (async) => {
      tplResolver.setTemplate(MainComponent, new Template({inline: '<div></div>'}));
      tplResolver.setTemplate(NestedComponent, new Template({inline: '<div></div>'}));
      var mainProtoView = createProtoView([createComponentElementBinder(reader, NestedComponent)]);
      var nestedProtoView = createProtoView();
      var compiler = createCompiler([createRenderProtoView(), createRenderProtoView()], [mainProtoView, nestedProtoView]);
      compiler.compile(MainComponent).then((protoView) => {
        expect(protoView).toBe(mainProtoView);
        expect(mainProtoView.elementBinders[0].nestedProtoView).toBe(nestedProtoView);
        async.done();
      });
    }));
    it('should load nested components in viewport ProtoView', inject([AsyncTestCompleter], (async) => {
      tplResolver.setTemplate(MainComponent, new Template({inline: '<div></div>'}));
      tplResolver.setTemplate(NestedComponent, new Template({inline: '<div></div>'}));
      var mainProtoView = createProtoView([createViewportElementBinder(createProtoView([createComponentElementBinder(reader, NestedComponent)]))]);
      var nestedProtoView = createProtoView();
      var compiler = createCompiler([createRenderProtoView(), createRenderProtoView()], [mainProtoView, nestedProtoView]);
      compiler.compile(MainComponent).then((protoView) => {
        expect(protoView).toBe(mainProtoView);
        expect(mainProtoView.elementBinders[0].nestedProtoView.elementBinders[0].nestedProtoView).toBe(nestedProtoView);
        async.done();
      });
    }));
    it('should cache compiled components', inject([AsyncTestCompleter], (async) => {
      tplResolver.setTemplate(MainComponent, new Template({inline: '<div></div>'}));
      var renderProtoView = createRenderProtoView();
      var expectedProtoView = createProtoView();
      var compiler = createCompiler([renderProtoView], [expectedProtoView]);
      compiler.compile(MainComponent).then((protoView) => {
        expect(protoView).toBe(expectedProtoView);
        return compiler.compile(MainComponent);
      }).then((protoView) => {
        expect(protoView).toBe(expectedProtoView);
        async.done();
      });
    }));
    it('should re-use components being compiled', inject([AsyncTestCompleter], (async) => {
      tplResolver.setTemplate(MainComponent, new Template({inline: '<div></div>'}));
      var renderProtoViewCompleter = PromiseWrapper.completer();
      var expectedProtoView = createProtoView();
      var compiler = createCompiler([renderProtoViewCompleter.promise], [expectedProtoView]);
      renderProtoViewCompleter.resolve(createRenderProtoView());
      PromiseWrapper.all([compiler.compile(MainComponent), compiler.compile(MainComponent)]).then((protoViews) => {
        expect(protoViews[0]).toBe(expectedProtoView);
        expect(protoViews[1]).toBe(expectedProtoView);
        async.done();
      });
    }));
    it('should allow recursive components', inject([AsyncTestCompleter], (async) => {
      tplResolver.setTemplate(MainComponent, new Template({inline: '<div></div>'}));
      var mainProtoView = createProtoView([createComponentElementBinder(reader, MainComponent)]);
      var compiler = createCompiler([createRenderProtoView()], [mainProtoView]);
      compiler.compile(MainComponent).then((protoView) => {
        expect(protoView).toBe(mainProtoView);
        expect(mainProtoView.elementBinders[0].nestedProtoView).toBe(mainProtoView);
        async.done();
      });
    }));
  });
}
function createProtoView(elementBinders = null) {
  var pv = new ProtoView(null, null, null, null);
  if (isPresent(elementBinders)) {
    pv.elementBinders = elementBinders;
  }
  return pv;
}
function createComponentElementBinder(reader, type) {
  var meta = reader.read(type);
  var binding = DirectiveBinding.createFromType(meta.type, meta.annotation);
  return new ElementBinder(0, null, 0, null, binding, null);
}
function createViewportElementBinder(nestedProtoView) {
  var elBinder = new ElementBinder(0, null, 0, null, null, null);
  elBinder.nestedProtoView = nestedProtoView;
  return elBinder;
}
function createRenderProtoView() {
  return new renderApi.ProtoView();
}
class MainComponent {}
Object.defineProperty(MainComponent, "annotations", {get: function() {
    return [new Component({selector: 'main-comp'})];
  }});
class NestedComponent {}
Object.defineProperty(NestedComponent, "annotations", {get: function() {
    return [new Component()];
  }});
class RecursiveComponent {}
class SomeDynamicComponentDirective {}
Object.defineProperty(SomeDynamicComponentDirective, "annotations", {get: function() {
    return [new DynamicComponent()];
  }});
class SomeViewportDirective {}
Object.defineProperty(SomeViewportDirective, "annotations", {get: function() {
    return [new Viewport()];
  }});
class SomeDecoratorDirective {}
Object.defineProperty(SomeDecoratorDirective, "annotations", {get: function() {
    return [new Decorator()];
  }});
class IgnoreChildrenDecoratorDirective {}
Object.defineProperty(IgnoreChildrenDecoratorDirective, "annotations", {get: function() {
    return [new Decorator({compileChildren: false})];
  }});
class DirectiveWithEvents {}
Object.defineProperty(DirectiveWithEvents, "annotations", {get: function() {
    return [new Decorator({events: {'someEvent': 'someAction'}})];
  }});
class DirectiveWithBind {}
Object.defineProperty(DirectiveWithBind, "annotations", {get: function() {
    return [new Decorator({bind: {'a': 'b'}})];
  }});
class DirectiveWithPropertySetters {
  constructor(someProp) {}
}
Object.defineProperty(DirectiveWithPropertySetters, "annotations", {get: function() {
    return [new Decorator()];
  }});
Object.defineProperty(DirectiveWithPropertySetters, "parameters", {get: function() {
    return [[new PropertySetter('someProp')]];
  }});
class DirectiveWithAttributes {
  constructor(someAttr) {}
}
Object.defineProperty(DirectiveWithAttributes, "annotations", {get: function() {
    return [new Decorator()];
  }});
Object.defineProperty(DirectiveWithAttributes, "parameters", {get: function() {
    return [[assert.type.string, new Attribute('someAttr')]];
  }});
class FakeRenderer extends renderApi.Renderer {
  constructor(results) {
    super();
    this._results = results;
    this.requests = [];
  }
  compile(template) {
    ListWrapper.push(this.requests, template);
    return PromiseWrapper.resolve(ListWrapper.removeAt(this._results, 0));
  }
}
Object.defineProperty(FakeRenderer.prototype.compile, "parameters", {get: function() {
    return [[renderApi.Template]];
  }});
class FakeUrlResolver extends UrlResolver {
  constructor() {
    super();
  }
  resolve(baseUrl, url) {
    if (baseUrl === null && url == './') {
      return 'http://www.app.com';
    }
    ;
    return baseUrl + url;
  }
}
Object.defineProperty(FakeUrlResolver.prototype.resolve, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string]];
  }});
class FakeTemplateResolver extends TemplateResolver {
  constructor() {
    super();
    this._cmpTemplates = MapWrapper.create();
  }
  resolve(component) {
    var template = MapWrapper.get(this._cmpTemplates, component);
    if (isBlank(template)) {
      throw 'No template';
    }
    return template;
  }
  setTemplate(component, template) {
    MapWrapper.set(this._cmpTemplates, component, template);
  }
}
Object.defineProperty(FakeTemplateResolver.prototype.resolve, "parameters", {get: function() {
    return [[Type]];
  }});
Object.defineProperty(FakeTemplateResolver.prototype.setTemplate, "parameters", {get: function() {
    return [[Type], [Template]];
  }});
class FakeProtoViewFactory extends ProtoViewFactory {
  constructor(results) {
    super(null, null);
    this.requests = [];
    this._results = results;
  }
  createProtoView(componentAnnotation, renderProtoView, directives) {
    ListWrapper.push(this.requests, [componentAnnotation, renderProtoView, directives]);
    return ListWrapper.removeAt(this._results, 0);
  }
}
Object.defineProperty(FakeProtoViewFactory.prototype.createProtoView, "parameters", {get: function() {
    return [[Component], [renderApi.ProtoView], [assert.genericType(List, DirectiveBinding)]];
  }});
//# sourceMappingURL=compiler_spec.js.map

//# sourceMappingURL=./compiler_spec.map