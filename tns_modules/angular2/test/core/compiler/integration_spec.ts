import {AsyncTestCompleter,
  beforeEach,
  ddescribe,
  xdescribe,
  describe,
  el,
  expect,
  iit,
  inject,
  it,
  xit} from 'angular2/test_lib';
import {DOM} from 'angular2/src/dom/dom_adapter';
import {Type,
  isPresent,
  BaseException,
  assertionsEnabled,
  isJsObject} from 'angular2/src/facade/lang';
import {PromiseWrapper} from 'angular2/src/facade/async';
import {Injector,
  bind} from 'angular2/di';
import {Lexer,
  Parser,
  dynamicChangeDetection,
  DynamicChangeDetection,
  Pipe,
  PipeRegistry,
  BindingPropagationConfig,
  ON_PUSH} from 'angular2/change_detection';
import {Compiler,
  CompilerCache} from 'angular2/src/core/compiler/compiler';
import {DirectiveMetadataReader} from 'angular2/src/core/compiler/directive_metadata_reader';
import {ShadowDomStrategy,
  EmulatedUnscopedShadowDomStrategy} from 'angular2/src/core/compiler/shadow_dom_strategy';
import {PrivateComponentLocation} from 'angular2/src/core/compiler/private_component_location';
import {PrivateComponentLoader} from 'angular2/src/core/compiler/private_component_loader';
import {TemplateLoader} from 'angular2/src/render/dom/compiler/template_loader';
import {MockTemplateResolver} from 'angular2/src/mock/template_resolver_mock';
import {ComponentUrlMapper} from 'angular2/src/core/compiler/component_url_mapper';
import {UrlResolver} from 'angular2/src/services/url_resolver';
import {StyleUrlResolver} from 'angular2/src/render/dom/shadow_dom/style_url_resolver';
import {EventManager} from 'angular2/src/render/dom/events/event_manager';
import {Decorator,
  Component,
  Viewport,
  DynamicComponent} from 'angular2/src/core/annotations/annotations';
import {Template} from 'angular2/src/core/annotations/template';
import {Parent,
  Ancestor} from 'angular2/src/core/annotations/visibility';
import {EventEmitter,
  Attribute} from 'angular2/src/core/annotations/di';
import {If} from 'angular2/src/directives/if';
import {ViewContainer} from 'angular2/src/core/compiler/view_container';
export function main() {
  describe('integration tests', function() {
    var directiveMetadataReader,
        shadowDomStrategy,
        compiler,
        tplResolver;
    function createCompiler(tplResolver, changedDetection) {
      var urlResolver = new UrlResolver();
      return new Compiler(changedDetection, new TemplateLoader(null, null), directiveMetadataReader, new Parser(new Lexer()), new CompilerCache(), shadowDomStrategy, tplResolver, new ComponentUrlMapper(), urlResolver);
    }
    beforeEach(() => {
      tplResolver = new MockTemplateResolver();
      directiveMetadataReader = new DirectiveMetadataReader();
      var urlResolver = new UrlResolver();
      shadowDomStrategy = new EmulatedUnscopedShadowDomStrategy(new StyleUrlResolver(urlResolver), null);
      compiler = createCompiler(tplResolver, dynamicChangeDetection);
    });
    describe('react to record changes', function() {
      var view,
          ctx,
          cd;
      function createView(pv) {
        ctx = new MyComp();
        view = pv.instantiate(null, null);
        view.hydrate(new Injector([bind(Compiler).toValue(compiler), bind(DirectiveMetadataReader).toValue(directiveMetadataReader), bind(ShadowDomStrategy).toValue(shadowDomStrategy), bind(EventManager).toValue(null), PrivateComponentLoader]), null, null, ctx, null);
        cd = view.changeDetector;
      }
      it('should consume text node changes', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({inline: '<div>{{ctxProp}}</div>'}));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          ctx.ctxProp = 'Hello World!';
          cd.detectChanges();
          expect(DOM.getInnerHTML(view.nodes[0])).toEqual('Hello World!');
          async.done();
        });
      }));
      it('should consume element binding changes', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({inline: '<div [id]="ctxProp"></div>'}));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          ctx.ctxProp = 'Hello World!';
          cd.detectChanges();
          expect(view.nodes[0].id).toEqual('Hello World!');
          async.done();
        });
      }));
      it('should consume binding to aria-* attributes', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({inline: '<div [attr.aria-label]="ctxProp"></div>'}));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          ctx.ctxProp = 'Initial aria label';
          cd.detectChanges();
          expect(DOM.getAttribute(view.nodes[0], 'aria-label')).toEqual('Initial aria label');
          ctx.ctxProp = 'Changed aria label';
          cd.detectChanges();
          expect(DOM.getAttribute(view.nodes[0], 'aria-label')).toEqual('Changed aria label');
          async.done();
        });
      }));
      it('should consume binding to property names where attr name and property name do not match', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({inline: '<div [tabindex]="ctxNumProp"></div>'}));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          cd.detectChanges();
          expect(view.nodes[0].tabIndex).toEqual(0);
          ctx.ctxNumProp = 5;
          cd.detectChanges();
          expect(view.nodes[0].tabIndex).toEqual(5);
          async.done();
        });
      }));
      it('should consume binding to camel-cased properties using dash-cased syntax in templates', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({inline: '<input [read-only]="ctxBoolProp">'}));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          cd.detectChanges();
          expect(view.nodes[0].readOnly).toBeFalsy();
          ctx.ctxBoolProp = true;
          cd.detectChanges();
          expect(view.nodes[0].readOnly).toBeTruthy();
          async.done();
        });
      }));
      it('should consume binding to inner-html', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({inline: '<div inner-html="{{ctxProp}}"></div>'}));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          ctx.ctxProp = 'Some <span>HTML</span>';
          cd.detectChanges();
          expect(DOM.getInnerHTML(view.nodes[0])).toEqual('Some <span>HTML</span>');
          ctx.ctxProp = 'Some other <div>HTML</div>';
          cd.detectChanges();
          expect(DOM.getInnerHTML(view.nodes[0])).toEqual('Some other <div>HTML</div>');
          async.done();
        });
      }));
      it('should ignore bindings to unknown properties', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({inline: '<div unknown="{{ctxProp}}"></div>'}));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          ctx.ctxProp = 'Some value';
          cd.detectChanges();
          expect(DOM.hasProperty(view.nodes[0], 'unknown')).toBeFalsy();
          async.done();
        });
      }));
      it('should consume directive watch expression change.', inject([AsyncTestCompleter], (async) => {
        var tpl = '<div>' + '<div my-dir [elprop]="ctxProp"></div>' + '<div my-dir elprop="Hi there!"></div>' + '<div my-dir elprop="Hi {{\'there!\'}}"></div>' + '<div my-dir elprop="One more {{ctxProp}}"></div>' + '</div>';
        tplResolver.setTemplate(MyComp, new Template({
          inline: tpl,
          directives: [MyDir]
        }));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          ctx.ctxProp = 'Hello World!';
          cd.detectChanges();
          expect(view.elementInjectors[0].get(MyDir).dirProp).toEqual('Hello World!');
          expect(view.elementInjectors[1].get(MyDir).dirProp).toEqual('Hi there!');
          expect(view.elementInjectors[2].get(MyDir).dirProp).toEqual('Hi there!');
          expect(view.elementInjectors[3].get(MyDir).dirProp).toEqual('One more Hello World!');
          async.done();
        });
      }));
      it("should support pipes in bindings and bind config", inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: '<component-with-pipes #comp [prop]="ctxProp | double"></component-with-pipes>',
          directives: [ComponentWithPipes]
        }));
        var registry = new PipeRegistry({"double": [new DoublePipeFactory()]});
        var changeDetection = new DynamicChangeDetection(registry);
        var compiler = createCompiler(tplResolver, changeDetection);
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          ctx.ctxProp = 'a';
          cd.detectChanges();
          var comp = view.locals.get("comp");
          expect(comp.prop).toEqual('aaaa');
          async.done();
        });
      }));
      it('should support nested components.', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: '<child-cmp></child-cmp>',
          directives: [ChildComp]
        }));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          cd.detectChanges();
          expect(view.nodes).toHaveText('hello');
          async.done();
        });
      }));
      it('should support different directive types on a single node', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: '<child-cmp my-dir [elprop]="ctxProp"></child-cmp>',
          directives: [MyDir, ChildComp]
        }));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          ctx.ctxProp = 'Hello World!';
          cd.detectChanges();
          var elInj = view.elementInjectors[0];
          expect(elInj.get(MyDir).dirProp).toEqual('Hello World!');
          expect(elInj.get(ChildComp).dirProp).toEqual(null);
          async.done();
        });
      }));
      it('should support directives where a binding attribute is not given', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: '<p my-dir></p>',
          directives: [MyDir]
        }));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          async.done();
        });
      }));
      it('should support directives where a selector matches property binding', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: '<p [id]="ctxProp"></p>',
          directives: [IdComponent]
        }));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          ctx.ctxProp = 'some_id';
          cd.detectChanges();
          expect(view.nodes[0].id).toEqual('some_id');
          expect(view.nodes).toHaveText('Matched on id with some_id');
          ctx.ctxProp = 'other_id';
          cd.detectChanges();
          expect(view.nodes[0].id).toEqual('other_id');
          expect(view.nodes).toHaveText('Matched on id with other_id');
          async.done();
        });
      }));
      it('should support template directives via `<template>` elements.', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: '<div><template some-viewport var-greeting="some-tmpl"><copy-me>{{greeting}}</copy-me></template></div>',
          directives: [SomeViewport]
        }));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          cd.detectChanges();
          var childNodesOfWrapper = view.nodes[0].childNodes;
          expect(childNodesOfWrapper.length).toBe(3);
          expect(childNodesOfWrapper[1].childNodes[0].nodeValue).toEqual('hello');
          expect(childNodesOfWrapper[2].childNodes[0].nodeValue).toEqual('again');
          async.done();
        });
      }));
      it('should support template directives via `template` attribute.', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: '<div><copy-me template="some-viewport: var greeting=some-tmpl">{{greeting}}</copy-me></div>',
          directives: [SomeViewport]
        }));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          cd.detectChanges();
          var childNodesOfWrapper = view.nodes[0].childNodes;
          expect(childNodesOfWrapper.length).toBe(3);
          expect(childNodesOfWrapper[1].childNodes[0].nodeValue).toEqual('hello');
          expect(childNodesOfWrapper[2].childNodes[0].nodeValue).toEqual('again');
          async.done();
        });
      }));
      it('should assign the component instance to a var-', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: '<p><child-cmp var-alice></child-cmp></p>',
          directives: [ChildComp]
        }));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          expect(view.locals).not.toBe(null);
          expect(view.locals.get('alice')).toBeAnInstanceOf(ChildComp);
          async.done();
        });
      }));
      it('should assign two component instances each with a var-', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: '<p><child-cmp var-alice></child-cmp><child-cmp var-bob></p>',
          directives: [ChildComp]
        }));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          expect(view.locals).not.toBe(null);
          expect(view.locals.get('alice')).toBeAnInstanceOf(ChildComp);
          expect(view.locals.get('bob')).toBeAnInstanceOf(ChildComp);
          expect(view.locals.get('alice')).not.toBe(view.locals.get('bob'));
          async.done();
        });
      }));
      it('should assign the component instance to a var- with shorthand syntax', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: '<child-cmp #alice></child-cmp>',
          directives: [ChildComp]
        }));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          expect(view.locals).not.toBe(null);
          expect(view.locals.get('alice')).toBeAnInstanceOf(ChildComp);
          async.done();
        });
      }));
      it('should assign the element instance to a user-defined variable', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({inline: '<p><div var-alice><i>Hello</i></div></p>'}));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          expect(view.locals).not.toBe(null);
          var value = view.locals.get('alice');
          expect(value).not.toBe(null);
          expect(value.tagName.toLowerCase()).toEqual('div');
          async.done();
        });
      }));
      it('should assign the element instance to a user-defined variable with camelCase using dash-case', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({inline: '<p><div var-super-alice><i>Hello</i></div></p>'}));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          expect(view.locals).not.toBe(null);
          var value = view.locals.get('superAlice');
          expect(value).not.toBe(null);
          expect(value.tagName.toLowerCase()).toEqual('div');
          async.done();
        });
      }));
      describe("BindingPropagationConfig", () => {
        it("can be used to disable the change detection of the component's template", inject([AsyncTestCompleter], (async) => {
          tplResolver.setTemplate(MyComp, new Template({
            inline: '<push-cmp #cmp></push-cmp>',
            directives: [[[PushBasedComp]]]
          }));
          compiler.compile(MyComp).then((pv) => {
            createView(pv);
            var cmp = view.locals.get('cmp');
            cd.detectChanges();
            expect(cmp.numberOfChecks).toEqual(1);
            cd.detectChanges();
            expect(cmp.numberOfChecks).toEqual(1);
            cmp.propagate();
            cd.detectChanges();
            expect(cmp.numberOfChecks).toEqual(2);
            async.done();
          });
        }));
        it('should not affect updating properties on the component', inject([AsyncTestCompleter], (async) => {
          tplResolver.setTemplate(MyComp, new Template({
            inline: '<push-cmp [prop]="ctxProp" #cmp></push-cmp>',
            directives: [[[PushBasedComp]]]
          }));
          compiler.compile(MyComp).then((pv) => {
            createView(pv);
            var cmp = view.locals.get('cmp');
            ctx.ctxProp = "one";
            cd.detectChanges();
            expect(cmp.prop).toEqual("one");
            ctx.ctxProp = "two";
            cd.detectChanges();
            expect(cmp.prop).toEqual("two");
            async.done();
          });
        }));
      });
      it('should create a component that injects a @Parent', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: '<some-directive><cmp-with-parent #child></cmp-with-parent></some-directive>',
          directives: [SomeDirective, CompWithParent]
        }));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          var childComponent = view.locals.get('child');
          expect(childComponent.myParent).toBeAnInstanceOf(SomeDirective);
          async.done();
        });
      }));
      it('should create a component that injects an @Ancestor', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: `
            <some-directive>
              <p>
                <cmp-with-ancestor #child></cmp-with-ancestor>
              </p>
            </some-directive>`,
          directives: [SomeDirective, CompWithAncestor]
        }));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          var childComponent = view.locals.get('child');
          expect(childComponent.myAncestor).toBeAnInstanceOf(SomeDirective);
          async.done();
        });
      }));
      it('should create a component that injects an @Ancestor through viewport directive', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: `
            <some-directive>
              <p *if="true">
                <cmp-with-ancestor #child></cmp-with-ancestor>
              </p>
            </some-directive>`,
          directives: [SomeDirective, CompWithAncestor, If]
        }));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          cd.detectChanges();
          var subview = view.viewContainers[1].get(0);
          var childComponent = subview.locals.get('child');
          expect(childComponent.myAncestor).toBeAnInstanceOf(SomeDirective);
          async.done();
        });
      }));
      it('should support events', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: '<div emitter listener></div>',
          directives: [DecoratorEmitingEvent, DecoratorListeningEvent]
        }));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          var injector = view.elementInjectors[0];
          var emitter = injector.get(DecoratorEmitingEvent);
          var listener = injector.get(DecoratorListeningEvent);
          expect(emitter.msg).toEqual('');
          expect(listener.msg).toEqual('');
          emitter.fireEvent('fired !');
          expect(emitter.msg).toEqual('fired !');
          expect(listener.msg).toEqual('fired !');
          async.done();
        });
      }));
      it('should support dynamic components', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: '<dynamic-comp #dynamic></dynamic-comp>',
          directives: [DynamicComp]
        }));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          var dynamicComponent = view.locals.get("dynamic");
          expect(dynamicComponent).toBeAnInstanceOf(DynamicComp);
          dynamicComponent.done.then((_) => {
            cd.detectChanges();
            expect(view.nodes).toHaveText('hello');
            async.done();
          });
        });
      }));
      it('should support static attributes', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: '<input static type="text" title></input>',
          directives: [NeedsAttribute]
        }));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          var injector = view.elementInjectors[0];
          var needsAttribute = injector.get(NeedsAttribute);
          expect(needsAttribute.typeAttribute).toEqual('text');
          expect(needsAttribute.titleAttribute).toEqual('');
          expect(needsAttribute.fooAttribute).toEqual(null);
          async.done();
        });
      }));
    });
    xdescribe('Missing directive checks', () => {
      if (assertionsEnabled()) {
        function expectCompileError(inlineTpl, errMessage, done) {
          tplResolver.setTemplate(MyComp, new Template({inline: inlineTpl}));
          PromiseWrapper.then(compiler.compile(MyComp), (value) => {
            throw new BaseException("Test failure: should not have come here as an exception was expected");
          }, (err) => {
            expect(err.message).toEqual(errMessage);
            done();
          });
        }
        it('should raise an error if no directive is registered for a template with template bindings', inject([AsyncTestCompleter], (async) => {
          expectCompileError('<div><div template="if: foo"></div></div>', 'Missing directive to handle \'if\' in <div template="if: foo">', () => async.done());
        }));
        it('should raise an error for missing template directive (1)', inject([AsyncTestCompleter], (async) => {
          expectCompileError('<div><template foo></template></div>', 'Missing directive to handle: <template foo>', () => async.done());
        }));
        it('should raise an error for missing template directive (2)', inject([AsyncTestCompleter], (async) => {
          expectCompileError('<div><template *if="condition"></template></div>', 'Missing directive to handle: <template *if="condition">', () => async.done());
        }));
        it('should raise an error for missing template directive (3)', inject([AsyncTestCompleter], (async) => {
          expectCompileError('<div *if="condition"></div>', 'Missing directive to handle \'if\' in MyComp: <div *if="condition">', () => async.done());
        }));
      }
    });
  });
}
class DynamicComp {
  constructor(loader, location) {
    this.done = loader.load(HelloCmp, location);
  }
}
Object.defineProperty(DynamicComp, "annotations", {get: function() {
    return [new DynamicComponent({selector: 'dynamic-comp'})];
  }});
Object.defineProperty(DynamicComp, "parameters", {get: function() {
    return [[PrivateComponentLoader], [PrivateComponentLocation]];
  }});
class HelloCmp {
  constructor() {
    this.greeting = "hello";
  }
}
Object.defineProperty(HelloCmp, "annotations", {get: function() {
    return [new Component({selector: 'hello-cmp'}), new Template({inline: "{{greeting}}"})];
  }});
class MyDir {
  constructor() {
    this.dirProp = '';
  }
}
Object.defineProperty(MyDir, "annotations", {get: function() {
    return [new Decorator({
      selector: '[my-dir]',
      bind: {'dirProp': 'elprop'}
    })];
  }});
class PushBasedComp {
  constructor(bpc) {
    this.numberOfChecks = 0;
    this.bpc = bpc;
  }
  get field() {
    this.numberOfChecks++;
    return "fixed";
  }
  propagate() {
    this.bpc.shouldBePropagatedFromRoot();
  }
}
Object.defineProperty(PushBasedComp, "annotations", {get: function() {
    return [new Component({
      selector: 'push-cmp',
      bind: {'prop': 'prop'},
      changeDetection: ON_PUSH
    }), new Template({inline: '{{field}}'})];
  }});
Object.defineProperty(PushBasedComp, "parameters", {get: function() {
    return [[BindingPropagationConfig]];
  }});
class MyComp {
  constructor() {
    this.ctxProp = 'initial value';
    this.ctxNumProp = 0;
    this.ctxBoolProp = false;
  }
}
Object.defineProperty(MyComp, "annotations", {get: function() {
    return [new Component()];
  }});
class ComponentWithPipes {}
Object.defineProperty(ComponentWithPipes, "annotations", {get: function() {
    return [new Component({
      selector: 'component-with-pipes',
      bind: {"prop": "prop | double"}
    }), new Template({inline: ''})];
  }});
class ChildComp {
  constructor(service) {
    this.ctxProp = service.greeting;
    this.dirProp = null;
  }
}
Object.defineProperty(ChildComp, "annotations", {get: function() {
    return [new Component({
      selector: 'child-cmp',
      services: [MyService]
    }), new Template({
      directives: [MyDir],
      inline: '{{ctxProp}}'
    })];
  }});
Object.defineProperty(ChildComp, "parameters", {get: function() {
    return [[MyService]];
  }});
class SomeDirective {}
Object.defineProperty(SomeDirective, "annotations", {get: function() {
    return [new Decorator({selector: 'some-directive'})];
  }});
class CompWithParent {
  constructor(someComp) {
    this.myParent = someComp;
  }
}
Object.defineProperty(CompWithParent, "annotations", {get: function() {
    return [new Component({selector: 'cmp-with-parent'}), new Template({
      inline: '<p>Component with an injected parent</p>',
      directives: [SomeDirective]
    })];
  }});
Object.defineProperty(CompWithParent, "parameters", {get: function() {
    return [[SomeDirective, new Parent()]];
  }});
class CompWithAncestor {
  constructor(someComp) {
    this.myAncestor = someComp;
  }
}
Object.defineProperty(CompWithAncestor, "annotations", {get: function() {
    return [new Component({selector: 'cmp-with-ancestor'}), new Template({
      inline: '<p>Component with an injected ancestor</p>',
      directives: [SomeDirective]
    })];
  }});
Object.defineProperty(CompWithAncestor, "parameters", {get: function() {
    return [[SomeDirective, new Ancestor()]];
  }});
class ChildComp2 {
  constructor(service) {
    this.ctxProp = service.greeting;
    this.dirProp = null;
  }
}
Object.defineProperty(ChildComp2, "annotations", {get: function() {
    return [new Component({
      selector: '[child-cmp2]',
      services: [MyService]
    })];
  }});
Object.defineProperty(ChildComp2, "parameters", {get: function() {
    return [[MyService]];
  }});
class SomeViewport {
  constructor(container) {
    container.create().setLocal('some-tmpl', 'hello');
    container.create().setLocal('some-tmpl', 'again');
  }
}
Object.defineProperty(SomeViewport, "annotations", {get: function() {
    return [new Viewport({selector: '[some-viewport]'})];
  }});
Object.defineProperty(SomeViewport, "parameters", {get: function() {
    return [[ViewContainer]];
  }});
class MyService {
  constructor() {
    this.greeting = 'hello';
  }
}
class DoublePipe extends Pipe {
  supports(obj) {
    return true;
  }
  transform(value) {
    return `${value}${value}`;
  }
}
class DoublePipeFactory {
  supports(obj) {
    return true;
  }
  create(bpc) {
    return new DoublePipe();
  }
}
class DecoratorEmitingEvent {
  constructor(emitter) {
    this.msg = '';
    this.emitter = emitter;
  }
  fireEvent(msg) {
    this.emitter(msg);
  }
  onEvent(msg) {
    this.msg = msg;
  }
}
Object.defineProperty(DecoratorEmitingEvent, "annotations", {get: function() {
    return [new Decorator({
      selector: '[emitter]',
      events: {'event': 'onEvent($event)'}
    })];
  }});
Object.defineProperty(DecoratorEmitingEvent, "parameters", {get: function() {
    return [[Function, new EventEmitter('event')]];
  }});
Object.defineProperty(DecoratorEmitingEvent.prototype.fireEvent, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(DecoratorEmitingEvent.prototype.onEvent, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
class DecoratorListeningEvent {
  constructor() {
    this.msg = '';
  }
  onEvent(msg) {
    this.msg = msg;
  }
}
Object.defineProperty(DecoratorListeningEvent, "annotations", {get: function() {
    return [new Decorator({
      selector: '[listener]',
      events: {'event': 'onEvent($event)'}
    })];
  }});
Object.defineProperty(DecoratorListeningEvent.prototype.onEvent, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
class IdComponent {}
Object.defineProperty(IdComponent, "annotations", {get: function() {
    return [new Component({
      selector: '[id]',
      bind: {'id': 'id'}
    }), new Template({inline: '<div>Matched on id with {{id}}</div>'})];
  }});
class NeedsAttribute {
  constructor(typeAttribute, titleAttribute, fooAttribute) {
    this.typeAttribute = typeAttribute;
    this.titleAttribute = titleAttribute;
    this.fooAttribute = fooAttribute;
  }
}
Object.defineProperty(NeedsAttribute, "annotations", {get: function() {
    return [new Decorator({selector: '[static]'})];
  }});
Object.defineProperty(NeedsAttribute, "parameters", {get: function() {
    return [[assert.type.string, new Attribute('type')], [assert.type.string, new Attribute('title')], [assert.type.string, new Attribute('foo')]];
  }});
//# sourceMappingURL=integration_spec.js.map

//# sourceMappingURL=./integration_spec.map