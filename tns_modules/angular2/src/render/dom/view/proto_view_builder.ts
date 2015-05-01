import {isPresent,
  isBlank,
  BaseException} from 'angular2/src/facade/lang';
import {ListWrapper,
  MapWrapper,
  Set,
  SetWrapper} from 'angular2/src/facade/collection';
import {DOM} from 'angular2/src/dom/dom_adapter';
import {ASTWithSource,
  AST,
  AstTransformer,
  AccessMember,
  LiteralArray,
  ImplicitReceiver} from 'angular2/change_detection';
import {SetterFn} from 'angular2/src/reflection/types';
import {ProtoView} from './proto_view';
import {ElementBinder} from './element_binder';
import {setterFactory} from './property_setter_factory';
import * as api from '../../api';
import * as directDomRenderer from '../direct_dom_renderer';
import {NG_BINDING_CLASS} from '../util';
export class ProtoViewBuilder {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.elements = [];
    this.isRootView = false;
    this.variableBindings = MapWrapper.create();
  }
  bindElement(element, description = null) {
    var builder = new ElementBinderBuilder(this.elements.length, element, description);
    ListWrapper.push(this.elements, builder);
    DOM.addClass(element, NG_BINDING_CLASS);
    return builder;
  }
  bindVariable(name, value) {
    MapWrapper.set(this.variableBindings, value, name);
  }
  setIsRootView(value) {
    this.isRootView = value;
  }
  build() {
    var renderElementBinders = [];
    var apiElementBinders = [];
    ListWrapper.forEach(this.elements, (ebb) => {
      var propertySetters = MapWrapper.create();
      var eventLocalsAstSplitter = new EventLocalsAstSplitter();
      var apiDirectiveBinders = ListWrapper.map(ebb.directives, (db) => {
        return new api.DirectiveBinder({
          directiveIndex: db.directiveIndex,
          propertyBindings: db.propertyBindings,
          eventBindings: eventLocalsAstSplitter.splitEventAstIntoLocals(db.eventBindings)
        });
      });
      MapWrapper.forEach(ebb.propertySetters, (setter, propertyName) => {
        MapWrapper.set(propertySetters, propertyName, setter);
      });
      var nestedProtoView = isPresent(ebb.nestedProtoView) ? ebb.nestedProtoView.build() : null;
      var parentIndex = isPresent(ebb.parent) ? ebb.parent.index : -1;
      ListWrapper.push(apiElementBinders, new api.ElementBinder({
        index: ebb.index,
        parentIndex: parentIndex,
        distanceToParent: ebb.distanceToParent,
        directives: apiDirectiveBinders,
        nestedProtoView: nestedProtoView,
        propertyBindings: ebb.propertyBindings,
        variableBindings: ebb.variableBindings,
        eventBindings: eventLocalsAstSplitter.splitEventAstIntoLocals(ebb.eventBindings),
        textBindings: ebb.textBindings,
        readAttributes: ebb.readAttributes
      }));
      ListWrapper.push(renderElementBinders, new ElementBinder({
        textNodeIndices: ebb.textBindingIndices,
        contentTagSelector: ebb.contentTagSelector,
        parentIndex: parentIndex,
        distanceToParent: ebb.distanceToParent,
        nestedProtoView: isPresent(nestedProtoView) ? nestedProtoView.render.delegate : null,
        componentId: ebb.componentId,
        eventLocals: eventLocalsAstSplitter.buildEventLocals(),
        eventNames: eventLocalsAstSplitter.buildEventNames(),
        propertySetters: propertySetters
      }));
    });
    return new api.ProtoView({
      render: new directDomRenderer.DirectDomProtoViewRef(new ProtoView({
        element: this.rootElement,
        elementBinders: renderElementBinders,
        isRootView: this.isRootView
      })),
      elementBinders: apiElementBinders,
      variableBindings: this.variableBindings
    });
  }
}
export class ElementBinderBuilder {
  constructor(index, element, description) {
    this.element = element;
    this.index = index;
    this.parent = null;
    this.distanceToParent = 0;
    this.directives = [];
    this.nestedProtoView = null;
    this.propertyBindings = MapWrapper.create();
    this.variableBindings = MapWrapper.create();
    this.eventBindings = MapWrapper.create();
    this.textBindings = [];
    this.textBindingIndices = [];
    this.contentTagSelector = null;
    this.propertySetters = MapWrapper.create();
    this.componentId = null;
    this.readAttributes = MapWrapper.create();
  }
  setParent(parent, distanceToParent) {
    this.parent = parent;
    if (isPresent(parent)) {
      this.distanceToParent = distanceToParent;
    }
    return this;
  }
  readAttribute(attrName) {
    if (isBlank(MapWrapper.get(this.readAttributes, attrName))) {
      MapWrapper.set(this.readAttributes, attrName, DOM.getAttribute(this.element, attrName));
    }
  }
  bindDirective(directiveIndex) {
    var directive = new DirectiveBuilder(directiveIndex);
    ListWrapper.push(this.directives, directive);
    return directive;
  }
  bindNestedProtoView(rootElement) {
    if (isPresent(this.nestedProtoView)) {
      throw new BaseException('Only one nested view per element is allowed');
    }
    this.nestedProtoView = new ProtoViewBuilder(rootElement);
    return this.nestedProtoView;
  }
  bindProperty(name, expression) {
    MapWrapper.set(this.propertyBindings, name, expression);
    this.bindPropertySetter(name);
  }
  bindPropertySetter(name) {
    MapWrapper.set(this.propertySetters, name, setterFactory(name));
  }
  bindVariable(name, value) {
    if (isPresent(this.nestedProtoView)) {
      this.nestedProtoView.bindVariable(name, value);
    } else {
      MapWrapper.set(this.variableBindings, value, name);
    }
  }
  bindEvent(name, expression) {
    MapWrapper.set(this.eventBindings, name, expression);
  }
  bindText(index, expression) {
    ListWrapper.push(this.textBindingIndices, index);
    ListWrapper.push(this.textBindings, expression);
  }
  setContentTagSelector(value) {
    this.contentTagSelector = value;
  }
  setComponentId(componentId) {
    this.componentId = componentId;
  }
}
Object.defineProperty(ElementBinderBuilder.prototype.setParent, "parameters", {get: function() {
    return [[ElementBinderBuilder], []];
  }});
Object.defineProperty(ElementBinderBuilder.prototype.readAttribute, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(ElementBinderBuilder.prototype.bindDirective, "parameters", {get: function() {
    return [[assert.type.number]];
  }});
Object.defineProperty(ElementBinderBuilder.prototype.setContentTagSelector, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(ElementBinderBuilder.prototype.setComponentId, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export class DirectiveBuilder {
  constructor(directiveIndex) {
    this.directiveIndex = directiveIndex;
    this.propertyBindings = MapWrapper.create();
    this.eventBindings = MapWrapper.create();
  }
  bindProperty(name, expression) {
    MapWrapper.set(this.propertyBindings, name, expression);
  }
  bindEvent(name, expression) {
    MapWrapper.set(this.eventBindings, name, expression);
  }
}
export class EventLocalsAstSplitter extends AstTransformer {
  constructor() {
    super();
    this.locals = [];
    this.eventNames = [];
    this._implicitReceiver = new ImplicitReceiver();
  }
  splitEventAstIntoLocals(eventBindings) {
    return eventBindings;
  }
  visitAccessMember(ast) {
    var isEventAccess = false;
    var current = ast;
    while (!isEventAccess && (current instanceof AccessMember)) {
      if (current.name == '$event') {
        isEventAccess = true;
      }
      current = current.receiver;
    }
    if (isEventAccess) {
      ListWrapper.push(this.locals, ast);
      var index = this.locals.length - 1;
      return new AccessMember(this._implicitReceiver, `${index}`, (arr) => arr[index], null);
    } else {
      return ast;
    }
  }
  buildEventLocals() {
    return new LiteralArray(this.locals);
  }
  buildEventNames() {
    return this.eventNames;
  }
}
Object.defineProperty(EventLocalsAstSplitter.prototype.splitEventAstIntoLocals, "parameters", {get: function() {
    return [[assert.genericType(Map, assert.type.string, ASTWithSource)]];
  }});
Object.defineProperty(EventLocalsAstSplitter.prototype.visitAccessMember, "parameters", {get: function() {
    return [[AccessMember]];
  }});
//# sourceMappingURL=proto_view_builder.js.map

//# sourceMappingURL=./proto_view_builder.map