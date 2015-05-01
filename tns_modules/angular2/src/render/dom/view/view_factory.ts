import {OpaqueToken} from 'angular2/di';
import {int,
  isPresent,
  isBlank,
  BaseException} from 'angular2/src/facade/lang';
import {ListWrapper,
  MapWrapper,
  Map,
  StringMapWrapper,
  List} from 'angular2/src/facade/collection';
import {DOM} from 'angular2/src/dom/dom_adapter';
import {Content} from '../shadow_dom/content_tag';
import {ShadowDomStrategy} from '../shadow_dom/shadow_dom_strategy';
import {EventManager} from 'angular2/src/render/dom/events/event_manager';
import {ViewContainer} from './view_container';
import {ProtoView} from './proto_view';
import {View} from './view';
import {NG_BINDING_CLASS_SELECTOR,
  NG_BINDING_CLASS} from '../util';
export var VIEW_POOL_CAPACITY = new OpaqueToken('ViewFactory.viewPoolCapacity');
export class ViewFactory {
  constructor(capacity, eventManager, shadowDomStrategy) {
    this._poolCapacity = capacity;
    this._pooledViews = ListWrapper.create();
    this._eventManager = eventManager;
    this._shadowDomStrategy = shadowDomStrategy;
  }
  getView(protoView) {
    var view;
    for (var i = 0; i < this._pooledViews.length; i++) {
      var pooledView = this._pooledViews[i];
      if (pooledView.proto === protoView) {
        view = ListWrapper.removeAt(this._pooledViews, i);
      }
    }
    if (isBlank(view)) {
      view = this._createView(protoView);
    }
    return view;
  }
  returnView(view) {
    if (view.hydrated()) {
      view.dehydrate();
    }
    ListWrapper.push(this._pooledViews, view);
    while (this._pooledViews.length > this._poolCapacity) {
      ListWrapper.removeAt(this._pooledViews, 0);
    }
  }
  _createView(protoView) {
    var rootElementClone = protoView.isRootView ? protoView.element : DOM.importIntoDoc(protoView.element);
    var elementsWithBindingsDynamic;
    if (protoView.isTemplateElement) {
      elementsWithBindingsDynamic = DOM.querySelectorAll(DOM.content(rootElementClone), NG_BINDING_CLASS_SELECTOR);
    } else {
      elementsWithBindingsDynamic = DOM.getElementsByClassName(rootElementClone, NG_BINDING_CLASS);
    }
    var elementsWithBindings = ListWrapper.createFixedSize(elementsWithBindingsDynamic.length);
    for (var binderIdx = 0; binderIdx < elementsWithBindingsDynamic.length; ++binderIdx) {
      elementsWithBindings[binderIdx] = elementsWithBindingsDynamic[binderIdx];
    }
    var viewRootNodes;
    if (protoView.isTemplateElement) {
      var childNode = DOM.firstChild(DOM.content(rootElementClone));
      viewRootNodes = [];
      while (childNode != null) {
        ListWrapper.push(viewRootNodes, childNode);
        childNode = DOM.nextSibling(childNode);
      }
    } else {
      viewRootNodes = [rootElementClone];
    }
    var binders = protoView.elementBinders;
    var boundTextNodes = [];
    var boundElements = ListWrapper.createFixedSize(binders.length);
    var viewContainers = ListWrapper.createFixedSize(binders.length);
    var contentTags = ListWrapper.createFixedSize(binders.length);
    for (var binderIdx = 0; binderIdx < binders.length; binderIdx++) {
      var binder = binders[binderIdx];
      var element;
      if (binderIdx === 0 && protoView.rootBindingOffset === 1) {
        element = rootElementClone;
      } else {
        element = elementsWithBindings[binderIdx - protoView.rootBindingOffset];
      }
      boundElements[binderIdx] = element;
      var childNodes = DOM.childNodes(DOM.templateAwareRoot(element));
      var textNodeIndices = binder.textNodeIndices;
      for (var i = 0; i < textNodeIndices.length; i++) {
        ListWrapper.push(boundTextNodes, childNodes[textNodeIndices[i]]);
      }
      var viewContainer = null;
      if (isBlank(binder.componentId) && isPresent(binder.nestedProtoView)) {
        viewContainer = new ViewContainer(this, element);
      }
      viewContainers[binderIdx] = viewContainer;
      var contentTag = null;
      if (isPresent(binder.contentTagSelector)) {
        contentTag = new Content(element, binder.contentTagSelector);
      }
      contentTags[binderIdx] = contentTag;
    }
    var view = new View(protoView, viewRootNodes, boundTextNodes, boundElements, viewContainers, contentTags);
    for (var binderIdx = 0; binderIdx < binders.length; binderIdx++) {
      var binder = binders[binderIdx];
      var element = boundElements[binderIdx];
      if (isPresent(binder.componentId) && isPresent(binder.nestedProtoView)) {
        var childView = this._createView(binder.nestedProtoView);
        view.setComponentView(this._shadowDomStrategy, binderIdx, childView);
      }
      if (isPresent(binder.eventLocals)) {
        ListWrapper.forEach(binder.eventNames, (eventName) => {
          this._createEventListener(view, element, binderIdx, eventName, binder.eventLocals);
        });
      }
    }
    if (protoView.isRootView) {
      view.hydrate(null);
    }
    return view;
  }
  _createEventListener(view, element, elementIndex, eventName, eventLocals) {
    this._eventManager.addEventListener(element, eventName, (event) => {
      view.dispatchEvent(elementIndex, eventName, event);
    });
  }
}
Object.defineProperty(ViewFactory.prototype.getView, "parameters", {get: function() {
    return [[ProtoView]];
  }});
Object.defineProperty(ViewFactory.prototype.returnView, "parameters", {get: function() {
    return [[View]];
  }});
Object.defineProperty(ViewFactory.prototype._createView, "parameters", {get: function() {
    return [[ProtoView]];
  }});
//# sourceMappingURL=view_factory.js.map

//# sourceMappingURL=./view_factory.map