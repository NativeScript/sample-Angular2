import {DOM} from 'angular2/src/dom/dom_adapter';
import {Promise} from 'angular2/src/facade/async';
import {ListWrapper,
  MapWrapper,
  Map,
  StringMapWrapper,
  List} from 'angular2/src/facade/collection';
import {AST,
  Locals,
  ChangeDispatcher,
  ProtoChangeDetector,
  ChangeDetector,
  ChangeRecord,
  BindingRecord,
  BindingPropagationConfig,
  uninitialized} from 'angular2/change_detection';
import {ProtoElementInjector,
  ElementInjector,
  PreBuiltObjects,
  DirectiveBinding} from './element_injector';
import {ElementBinder} from './element_binder';
import {SetterFn} from 'angular2/src/reflection/types';
import {IMPLEMENTS,
  int,
  isPresent,
  isBlank,
  BaseException} from 'angular2/src/facade/lang';
import {Injector} from 'angular2/di';
import {NgElement} from 'angular2/src/core/dom/element';
import {ViewContainer} from './view_container';
import {LightDom} from './shadow_dom_emulation/light_dom';
import {Content} from './shadow_dom_emulation/content_tag';
import {ShadowDomStrategy} from './shadow_dom_strategy';
import {ViewPool} from './view_pool';
import {EventManager} from 'angular2/src/render/dom/events/event_manager';
const NG_BINDING_CLASS = 'ng-binding';
const NG_BINDING_CLASS_SELECTOR = '.ng-binding';
var VIEW_POOL_CAPACITY = 10000;
var VIEW_POOL_PREFILL = 0;
export class View {
  constructor(proto, nodes, protoLocals) {
    this.proto = proto;
    this.nodes = nodes;
    this.changeDetector = null;
    this.elementInjectors = null;
    this.rootElementInjectors = null;
    this.textNodes = null;
    this.bindElements = null;
    this.componentChildViews = null;
    this.viewContainers = null;
    this.contentTags = null;
    this.preBuiltObjects = null;
    this.lightDoms = null;
    this.context = null;
    this.locals = new Locals(null, MapWrapper.clone(protoLocals));
  }
  init(changeDetector, elementInjectors, rootElementInjectors, textNodes, bindElements, viewContainers, contentTags, preBuiltObjects, componentChildViews, lightDoms) {
    this.changeDetector = changeDetector;
    this.elementInjectors = elementInjectors;
    this.rootElementInjectors = rootElementInjectors;
    this.textNodes = textNodes;
    this.bindElements = bindElements;
    this.viewContainers = viewContainers;
    this.contentTags = contentTags;
    this.preBuiltObjects = preBuiltObjects;
    this.componentChildViews = componentChildViews;
    this.lightDoms = lightDoms;
  }
  setLocal(contextName, value) {
    if (!this.hydrated())
      throw new BaseException('Cannot set locals on dehydrated view.');
    if (!MapWrapper.contains(this.proto.variableBindings, contextName)) {
      return ;
    }
    var templateName = MapWrapper.get(this.proto.variableBindings, contextName);
    this.locals.set(templateName, value);
  }
  hydrated() {
    return isPresent(this.context);
  }
  _hydrateContext(newContext, locals) {
    this.context = newContext;
    this.locals.parent = locals;
    this.changeDetector.hydrate(this.context, this.locals);
  }
  _dehydrateContext() {
    if (isPresent(this.locals)) {
      this.locals.clearValues();
    }
    this.context = null;
    this.changeDetector.dehydrate();
  }
  hydrate(appInjector, hostElementInjector, hostLightDom, context, locals) {
    if (this.hydrated())
      throw new BaseException('The view is already hydrated.');
    this._hydrateContext(context, locals);
    for (var i = 0; i < this.viewContainers.length; i++) {
      var vc = this.viewContainers[i];
      if (isPresent(vc)) {
        vc.hydrate(appInjector, hostElementInjector, hostLightDom);
      }
    }
    var binders = this.proto.elementBinders;
    var componentChildViewIndex = 0;
    for (var i = 0; i < binders.length; ++i) {
      var componentDirective = binders[i].componentDirective;
      var shadowDomAppInjector = null;
      if (isPresent(componentDirective)) {
        var services = componentDirective.annotation.services;
        if (isPresent(services))
          shadowDomAppInjector = appInjector.createChild(services);
        else {
          shadowDomAppInjector = appInjector;
        }
      } else {
        shadowDomAppInjector = null;
      }
      var elementInjector = this.elementInjectors[i];
      if (isPresent(elementInjector)) {
        elementInjector.instantiateDirectives(appInjector, shadowDomAppInjector, this.preBuiltObjects[i]);
        var exportImplicitName = elementInjector.getExportImplicitName();
        if (elementInjector.isExportingComponent()) {
          this.locals.set(exportImplicitName, elementInjector.getComponent());
        } else if (elementInjector.isExportingElement()) {
          this.locals.set(exportImplicitName, elementInjector.getNgElement().domElement);
        }
      }
      if (isPresent(binders[i].nestedProtoView) && isPresent(componentDirective)) {
        this.componentChildViews[componentChildViewIndex++].hydrate(shadowDomAppInjector, elementInjector, this.lightDoms[i], elementInjector.getComponent(), null);
      }
    }
    for (var i = 0; i < this.lightDoms.length; ++i) {
      var lightDom = this.lightDoms[i];
      if (isPresent(lightDom)) {
        lightDom.redistribute();
      }
    }
  }
  dehydrate() {
    for (var i = 0; i < this.componentChildViews.length; i++) {
      this.componentChildViews[i].dehydrate();
    }
    for (var i = 0; i < this.elementInjectors.length; i++) {
      if (isPresent(this.elementInjectors[i])) {
        this.elementInjectors[i].clearDirectives();
      }
    }
    if (isPresent(this.viewContainers)) {
      for (var i = 0; i < this.viewContainers.length; i++) {
        var vc = this.viewContainers[i];
        if (isPresent(vc)) {
          vc.dehydrate();
        }
      }
    }
    this._dehydrateContext();
  }
  triggerEventHandlers(eventName, eventObj, binderIndex) {
    var handlers = this.proto.eventHandlers[binderIndex];
    if (isBlank(handlers))
      return ;
    var handler = StringMapWrapper.get(handlers, eventName);
    if (isBlank(handler))
      return ;
    handler(eventObj, this);
  }
  onAllChangesDone(directiveMemento) {
    var dir = directiveMemento.directive(this.elementInjectors);
    dir.onAllChangesDone();
  }
  onChange(directiveMemento, changes) {
    var dir = directiveMemento.directive(this.elementInjectors);
    dir.onChange(changes);
  }
  invokeMementoFor(memento, currentValue) {
    if (memento instanceof DirectiveBindingMemento) {
      var directiveMemento = memento;
      directiveMemento.invoke(currentValue, this.elementInjectors);
    } else if (memento instanceof ElementBindingMemento) {
      var elementMemento = memento;
      elementMemento.invoke(currentValue, this.bindElements);
    } else {
      var textNodeIndex = memento;
      DOM.setText(this.textNodes[textNodeIndex], currentValue);
    }
  }
}
Object.defineProperty(View, "annotations", {get: function() {
    return [new IMPLEMENTS(ChangeDispatcher)];
  }});
Object.defineProperty(View, "parameters", {get: function() {
    return [[ProtoView], [List], [Map]];
  }});
Object.defineProperty(View.prototype.init, "parameters", {get: function() {
    return [[ChangeDetector], [List], [List], [List], [List], [List], [List], [List], [List], [assert.genericType(List, LightDom)]];
  }});
Object.defineProperty(View.prototype.setLocal, "parameters", {get: function() {
    return [[assert.type.string], []];
  }});
Object.defineProperty(View.prototype.hydrate, "parameters", {get: function() {
    return [[Injector], [ElementInjector], [LightDom], [Object], [Locals]];
  }});
Object.defineProperty(View.prototype.triggerEventHandlers, "parameters", {get: function() {
    return [[assert.type.string], [], [int]];
  }});
Object.defineProperty(View.prototype.onAllChangesDone, "parameters", {get: function() {
    return [[DirectiveMemento]];
  }});
Object.defineProperty(View.prototype.onChange, "parameters", {get: function() {
    return [[DirectiveMemento], []];
  }});
Object.defineProperty(View.prototype.invokeMementoFor, "parameters", {get: function() {
    return [[assert.type.any], [assert.type.any]];
  }});
export class ProtoView {
  constructor(template, protoChangeDetector, shadowDomStrategy, parentProtoView = null) {
    this.element = template;
    this.elementBinders = [];
    this.variableBindings = MapWrapper.create();
    this.protoLocals = MapWrapper.create();
    this.protoChangeDetector = protoChangeDetector;
    this.parentProtoView = parentProtoView;
    this.textNodesWithBindingCount = 0;
    this.elementsWithBindingCount = 0;
    this.instantiateInPlace = false;
    this.rootBindingOffset = (isPresent(this.element) && DOM.hasClass(this.element, NG_BINDING_CLASS)) ? 1 : 0;
    this.isTemplateElement = DOM.isTemplateElement(this.element);
    this.shadowDomStrategy = shadowDomStrategy;
    this._viewPool = new ViewPool(VIEW_POOL_CAPACITY);
    this.stylePromises = [];
    this.eventHandlers = [];
    this.bindingRecords = [];
    this._directiveMementosMap = MapWrapper.create();
    this._variableBindings = null;
    this._directiveMementos = null;
  }
  instantiate(hostElementInjector, eventManager) {
    if (this._viewPool.length() == 0)
      this._preFillPool(hostElementInjector, eventManager);
    var view = this._viewPool.pop();
    return isPresent(view) ? view : this._instantiate(hostElementInjector, eventManager);
  }
  _preFillPool(hostElementInjector, eventManager) {
    for (var i = 0; i < VIEW_POOL_PREFILL; i++) {
      this._viewPool.push(this._instantiate(hostElementInjector, eventManager));
    }
  }
  _getVariableBindings() {
    if (isPresent(this._variableBindings)) {
      return this._variableBindings;
    }
    this._variableBindings = isPresent(this.parentProtoView) ? ListWrapper.clone(this.parentProtoView._getVariableBindings()) : [];
    MapWrapper.forEach(this.protoLocals, (v, local) => {
      ListWrapper.push(this._variableBindings, local);
    });
    return this._variableBindings;
  }
  _getDirectiveMementos() {
    if (isPresent(this._directiveMementos)) {
      return this._directiveMementos;
    }
    this._directiveMementos = [];
    for (var injectorIndex = 0; injectorIndex < this.elementBinders.length; ++injectorIndex) {
      var pei = this.elementBinders[injectorIndex].protoElementInjector;
      if (isPresent(pei)) {
        for (var directiveIndex = 0; directiveIndex < pei.numberOfDirectives; ++directiveIndex) {
          ListWrapper.push(this._directiveMementos, this._getDirectiveMemento(injectorIndex, directiveIndex));
        }
      }
    }
    return this._directiveMementos;
  }
  _instantiate(hostElementInjector, eventManager) {
    var rootElementClone = this.instantiateInPlace ? this.element : DOM.importIntoDoc(this.element);
    var elementsWithBindingsDynamic;
    if (this.isTemplateElement) {
      elementsWithBindingsDynamic = DOM.querySelectorAll(DOM.content(rootElementClone), NG_BINDING_CLASS_SELECTOR);
    } else {
      elementsWithBindingsDynamic = DOM.getElementsByClassName(rootElementClone, NG_BINDING_CLASS);
    }
    var elementsWithBindings = ListWrapper.createFixedSize(elementsWithBindingsDynamic.length);
    for (var binderIdx = 0; binderIdx < elementsWithBindingsDynamic.length; ++binderIdx) {
      elementsWithBindings[binderIdx] = elementsWithBindingsDynamic[binderIdx];
    }
    var viewNodes;
    if (this.isTemplateElement) {
      var childNode = DOM.firstChild(DOM.content(rootElementClone));
      viewNodes = [];
      while (childNode != null) {
        ListWrapper.push(viewNodes, childNode);
        childNode = DOM.nextSibling(childNode);
      }
    } else {
      viewNodes = [rootElementClone];
    }
    var view = new View(this, viewNodes, this.protoLocals);
    var changeDetector = this.protoChangeDetector.instantiate(view, this.bindingRecords, this._getVariableBindings(), this._getDirectiveMementos());
    var binders = this.elementBinders;
    var elementInjectors = ListWrapper.createFixedSize(binders.length);
    var eventHandlers = ListWrapper.createFixedSize(binders.length);
    var rootElementInjectors = [];
    var textNodes = [];
    var elementsWithPropertyBindings = [];
    var preBuiltObjects = ListWrapper.createFixedSize(binders.length);
    var viewContainers = ListWrapper.createFixedSize(binders.length);
    var contentTags = ListWrapper.createFixedSize(binders.length);
    var componentChildViews = [];
    var lightDoms = ListWrapper.createFixedSize(binders.length);
    for (var binderIdx = 0; binderIdx < binders.length; binderIdx++) {
      var binder = binders[binderIdx];
      var element;
      if (binderIdx === 0 && this.rootBindingOffset === 1) {
        element = rootElementClone;
      } else {
        element = elementsWithBindings[binderIdx - this.rootBindingOffset];
      }
      var elementInjector = null;
      var protoElementInjector = binder.protoElementInjector;
      if (isPresent(protoElementInjector)) {
        if (isPresent(protoElementInjector.parent)) {
          var parentElementInjector = elementInjectors[protoElementInjector.parent.index];
          elementInjector = protoElementInjector.instantiate(parentElementInjector, null);
        } else {
          elementInjector = protoElementInjector.instantiate(null, hostElementInjector);
          ListWrapper.push(rootElementInjectors, elementInjector);
        }
      }
      elementInjectors[binderIdx] = elementInjector;
      if (binder.hasElementPropertyBindings) {
        ListWrapper.push(elementsWithPropertyBindings, element);
      }
      var textNodeIndices = binder.textNodeIndices;
      if (isPresent(textNodeIndices)) {
        var childNode = DOM.firstChild(DOM.templateAwareRoot(element));
        for (var j = 0,
            k = 0; j < textNodeIndices.length; j++) {
          for (var index = textNodeIndices[j]; k < index; k++) {
            childNode = DOM.nextSibling(childNode);
          }
          ListWrapper.push(textNodes, childNode);
        }
      }
      var lightDom = null;
      var bindingPropagationConfig = null;
      if (isPresent(binder.nestedProtoView) && isPresent(binder.componentDirective)) {
        var strategy = this.shadowDomStrategy;
        var childView = binder.nestedProtoView.instantiate(elementInjector, eventManager);
        changeDetector.addChild(childView.changeDetector);
        lightDom = strategy.constructLightDom(view, childView, element);
        strategy.attachTemplate(element, childView);
        bindingPropagationConfig = new BindingPropagationConfig(childView.changeDetector);
        ListWrapper.push(componentChildViews, childView);
      }
      lightDoms[binderIdx] = lightDom;
      var destLightDom = null;
      if (isPresent(binder.parent) && binder.distanceToParent === 1) {
        destLightDom = lightDoms[binder.parent.index];
      }
      var viewContainer = null;
      if (isPresent(binder.viewportDirective)) {
        viewContainer = new ViewContainer(view, element, binder.nestedProtoView, elementInjector, eventManager, destLightDom);
      }
      viewContainers[binderIdx] = viewContainer;
      var contentTag = null;
      if (isPresent(binder.contentTagSelector)) {
        contentTag = new Content(destLightDom, element, binder.contentTagSelector);
      }
      contentTags[binderIdx] = contentTag;
      if (isPresent(elementInjector)) {
        preBuiltObjects[binderIdx] = new PreBuiltObjects(view, new NgElement(element), viewContainer, bindingPropagationConfig);
      }
      if (isPresent(binder.events)) {
        eventHandlers[binderIdx] = StringMapWrapper.create();
        StringMapWrapper.forEach(binder.events, (eventMap, eventName) => {
          var handler = ProtoView.buildEventHandler(eventMap, binderIdx);
          StringMapWrapper.set(eventHandlers[binderIdx], eventName, handler);
          if (isBlank(elementInjector) || !elementInjector.hasEventEmitter(eventName)) {
            eventManager.addEventListener(element, eventName, (event) => {
              handler(event, view);
            });
          }
        });
      }
    }
    this.eventHandlers = eventHandlers;
    view.init(changeDetector, elementInjectors, rootElementInjectors, textNodes, elementsWithPropertyBindings, viewContainers, contentTags, preBuiltObjects, componentChildViews, lightDoms);
    return view;
  }
  returnToPool(view) {
    this._viewPool.push(view);
  }
  static buildEventHandler(eventMap, injectorIdx) {
    var locals = MapWrapper.create();
    return (event, view) => {
      if (view.hydrated()) {
        MapWrapper.set(locals, '$event', event);
        MapWrapper.forEach(eventMap, (expr, directiveIndex) => {
          var context;
          if (directiveIndex === -1) {
            context = view.context;
          } else {
            context = view.elementInjectors[injectorIdx].getDirectiveAtIndex(directiveIndex);
          }
          expr.eval(context, new Locals(view.locals, locals));
        });
      }
    };
  }
  bindVariable(contextName, templateName) {
    MapWrapper.set(this.variableBindings, contextName, templateName);
    MapWrapper.set(this.protoLocals, templateName, null);
  }
  bindElement(parent, distanceToParent, protoElementInjector, componentDirective = null, viewportDirective = null) {
    var elBinder = new ElementBinder(this.elementBinders.length, parent, distanceToParent, protoElementInjector, componentDirective, viewportDirective);
    ListWrapper.push(this.elementBinders, elBinder);
    return elBinder;
  }
  bindTextNode(indexInParent, expression) {
    var elBinder = this.elementBinders[this.elementBinders.length - 1];
    if (isBlank(elBinder.textNodeIndices)) {
      elBinder.textNodeIndices = ListWrapper.create();
    }
    ListWrapper.push(elBinder.textNodeIndices, indexInParent);
    var memento = this.textNodesWithBindingCount++;
    ListWrapper.push(this.bindingRecords, new BindingRecord(expression, memento, null));
  }
  bindElementProperty(expression, setterName, setter) {
    var elBinder = this.elementBinders[this.elementBinders.length - 1];
    if (!elBinder.hasElementPropertyBindings) {
      elBinder.hasElementPropertyBindings = true;
      this.elementsWithBindingCount++;
    }
    var memento = new ElementBindingMemento(this.elementsWithBindingCount - 1, setter);
    ListWrapper.push(this.bindingRecords, new BindingRecord(expression, memento, null));
  }
  bindEvent(eventName, expression, directiveIndex = -1) {
    var elBinder = this.elementBinders[this.elementBinders.length - 1];
    var events = elBinder.events;
    if (isBlank(events)) {
      events = StringMapWrapper.create();
      elBinder.events = events;
    }
    var event = StringMapWrapper.get(events, eventName);
    if (isBlank(event)) {
      event = MapWrapper.create();
      StringMapWrapper.set(events, eventName, event);
    }
    MapWrapper.set(event, directiveIndex, expression);
  }
  bindDirectiveProperty(directiveIndex, expression, setterName, setter) {
    var elementIndex = this.elementBinders.length - 1;
    var bindingMemento = new DirectiveBindingMemento(elementIndex, directiveIndex, setterName, setter);
    var directiveMemento = this._getDirectiveMemento(elementIndex, directiveIndex);
    ListWrapper.push(this.bindingRecords, new BindingRecord(expression, bindingMemento, directiveMemento));
  }
  _getDirectiveMemento(elementInjectorIndex, directiveIndex) {
    var id = elementInjectorIndex * 100 + directiveIndex;
    var protoElementInjector = this.elementBinders[elementInjectorIndex].protoElementInjector;
    if (!MapWrapper.contains(this._directiveMementosMap, id)) {
      var binding = protoElementInjector.getDirectiveBindingAtIndex(directiveIndex);
      MapWrapper.set(this._directiveMementosMap, id, new DirectiveMemento(elementInjectorIndex, directiveIndex, binding.callOnAllChangesDone, binding.callOnChange));
    }
    return MapWrapper.get(this._directiveMementosMap, id);
  }
  static createRootProtoView(protoView, insertionElement, rootComponentBinding, protoChangeDetector, shadowDomStrategy) {
    DOM.addClass(insertionElement, NG_BINDING_CLASS);
    var cmpType = rootComponentBinding.key.token;
    var rootProtoView = new ProtoView(insertionElement, protoChangeDetector, shadowDomStrategy);
    rootProtoView.instantiateInPlace = true;
    var binder = rootProtoView.bindElement(null, 0, new ProtoElementInjector(null, 0, [cmpType], true));
    binder.componentDirective = rootComponentBinding;
    binder.nestedProtoView = protoView;
    shadowDomStrategy.shimAppElement(cmpType, insertionElement);
    return rootProtoView;
  }
}
Object.defineProperty(ProtoView, "parameters", {get: function() {
    return [[], [ProtoChangeDetector], [ShadowDomStrategy], [ProtoView]];
  }});
Object.defineProperty(ProtoView.prototype.instantiate, "parameters", {get: function() {
    return [[ElementInjector], [EventManager]];
  }});
Object.defineProperty(ProtoView.prototype._preFillPool, "parameters", {get: function() {
    return [[ElementInjector], [EventManager]];
  }});
Object.defineProperty(ProtoView.prototype._instantiate, "parameters", {get: function() {
    return [[ElementInjector], [EventManager]];
  }});
Object.defineProperty(ProtoView.prototype.returnToPool, "parameters", {get: function() {
    return [[View]];
  }});
Object.defineProperty(ProtoView.buildEventHandler, "parameters", {get: function() {
    return [[Map], [int]];
  }});
Object.defineProperty(ProtoView.prototype.bindVariable, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string]];
  }});
Object.defineProperty(ProtoView.prototype.bindElement, "parameters", {get: function() {
    return [[ElementBinder], [int], [ProtoElementInjector], [DirectiveBinding], [DirectiveBinding]];
  }});
Object.defineProperty(ProtoView.prototype.bindTextNode, "parameters", {get: function() {
    return [[int], [AST]];
  }});
Object.defineProperty(ProtoView.prototype.bindElementProperty, "parameters", {get: function() {
    return [[AST], [assert.type.string], [SetterFn]];
  }});
Object.defineProperty(ProtoView.prototype.bindEvent, "parameters", {get: function() {
    return [[assert.type.string], [AST], [int]];
  }});
Object.defineProperty(ProtoView.prototype.bindDirectiveProperty, "parameters", {get: function() {
    return [[assert.type.number], [AST], [assert.type.string], [SetterFn]];
  }});
Object.defineProperty(ProtoView.prototype._getDirectiveMemento, "parameters", {get: function() {
    return [[assert.type.number], [assert.type.number]];
  }});
Object.defineProperty(ProtoView.createRootProtoView, "parameters", {get: function() {
    return [[ProtoView], [], [DirectiveBinding], [ProtoChangeDetector], [ShadowDomStrategy]];
  }});
export class ElementBindingMemento {
  constructor(elementIndex, setter) {
    this._elementIndex = elementIndex;
    this._setter = setter;
  }
  invoke(currentValue, bindElements) {
    var element = bindElements[this._elementIndex];
    this._setter(element, currentValue);
  }
}
Object.defineProperty(ElementBindingMemento, "parameters", {get: function() {
    return [[int], [SetterFn]];
  }});
Object.defineProperty(ElementBindingMemento.prototype.invoke, "parameters", {get: function() {
    return [[assert.type.any], [List]];
  }});
export class DirectiveBindingMemento {
  constructor(elementInjectorIndex, directiveIndex, propertyName, setter) {
    this._elementInjectorIndex = elementInjectorIndex;
    this._directiveIndex = directiveIndex;
    this.propertyName = propertyName;
    this._setter = setter;
  }
  invoke(currentValue, elementInjectors) {
    var elementInjector = elementInjectors[this._elementInjectorIndex];
    var directive = elementInjector.getDirectiveAtIndex(this._directiveIndex);
    this._setter(directive, currentValue);
  }
}
Object.defineProperty(DirectiveBindingMemento, "parameters", {get: function() {
    return [[assert.type.number], [assert.type.number], [assert.type.string], [SetterFn]];
  }});
Object.defineProperty(DirectiveBindingMemento.prototype.invoke, "parameters", {get: function() {
    return [[assert.type.any], [assert.genericType(List, ElementInjector)]];
  }});
class DirectiveMemento {
  constructor(elementInjectorIndex, directiveIndex, callOnAllChangesDone, callOnChange) {
    this._elementInjectorIndex = elementInjectorIndex;
    this._directiveIndex = directiveIndex;
    this.callOnAllChangesDone = callOnAllChangesDone;
    this.callOnChange = callOnChange;
  }
  directive(elementInjectors) {
    var elementInjector = elementInjectors[this._elementInjectorIndex];
    return elementInjector.getDirectiveAtIndex(this._directiveIndex);
  }
}
Object.defineProperty(DirectiveMemento, "parameters", {get: function() {
    return [[assert.type.number], [assert.type.number], [assert.type.boolean], [assert.type.boolean]];
  }});
Object.defineProperty(DirectiveMemento.prototype.directive, "parameters", {get: function() {
    return [[assert.genericType(List, ElementInjector)]];
  }});
//# sourceMappingURL=view.js.map

//# sourceMappingURL=./view.map