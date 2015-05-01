import {DOM} from 'angular2/src/dom/dom_adapter';
import {ListWrapper,
  MapWrapper,
  Map,
  StringMapWrapper,
  List} from 'angular2/src/facade/collection';
import {int,
  isPresent,
  isBlank,
  BaseException} from 'angular2/src/facade/lang';
import {Locals} from 'angular2/change_detection';
import {ViewContainer} from './view_container';
import {ProtoView} from './proto_view';
import {LightDom} from '../shadow_dom/light_dom';
import {Content} from '../shadow_dom/content_tag';
import {ShadowDomStrategy} from '../shadow_dom/shadow_dom_strategy';
import {EventDispatcher} from '../../api';
const NG_BINDING_CLASS = 'ng-binding';
export class View {
  constructor(proto, rootNodes, boundTextNodes, boundElements, viewContainers, contentTags) {
    this.proto = proto;
    this.rootNodes = rootNodes;
    this.boundTextNodes = boundTextNodes;
    this.boundElements = boundElements;
    this.viewContainers = viewContainers;
    this.contentTags = contentTags;
    this.lightDoms = ListWrapper.createFixedSize(boundElements.length);
    this.componentChildViews = ListWrapper.createFixedSize(boundElements.length);
    this._hydrated = false;
  }
  hydrated() {
    return this._hydrated;
  }
  setElementProperty(elementIndex, propertyName, value) {
    var setter = MapWrapper.get(this.proto.elementBinders[elementIndex].propertySetters, propertyName);
    setter(this.boundElements[elementIndex], value);
  }
  setText(textIndex, value) {
    DOM.setText(this.boundTextNodes[textIndex], value);
  }
  setComponentView(strategy, elementIndex, childView) {
    var element = this.boundElements[elementIndex];
    var lightDom = strategy.constructLightDom(this, childView, element);
    strategy.attachTemplate(element, childView);
    this.lightDoms[elementIndex] = lightDom;
    this.componentChildViews[elementIndex] = childView;
    if (this._hydrated) {
      childView.hydrate(lightDom);
    }
  }
  getViewContainer(index) {
    return this.viewContainers[index];
  }
  _getDestLightDom(binderIndex) {
    var binder = this.proto.elementBinders[binderIndex];
    var destLightDom = null;
    if (binder.parentIndex !== -1 && binder.distanceToParent === 1) {
      destLightDom = this.lightDoms[binder.parentIndex];
    }
    return destLightDom;
  }
  hydrate(hostLightDom) {
    if (this._hydrated)
      throw new BaseException('The view is already hydrated.');
    this._hydrated = true;
    for (var i = 0; i < this.viewContainers.length; i++) {
      var vc = this.viewContainers[i];
      var destLightDom = this._getDestLightDom(i);
      if (isPresent(vc)) {
        vc.hydrate(destLightDom, hostLightDom);
      }
      var ct = this.contentTags[i];
      if (isPresent(ct)) {
        ct.hydrate(destLightDom);
      }
    }
    for (var i = 0; i < this.componentChildViews.length; i++) {
      var cv = this.componentChildViews[i];
      if (isPresent(cv)) {
        cv.hydrate(this.lightDoms[i]);
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
    if (isPresent(this.viewContainers)) {
      for (var i = 0; i < this.viewContainers.length; i++) {
        var vc = this.viewContainers[i];
        if (isPresent(vc)) {
          vc.dehydrate();
        }
        var ct = this.contentTags[i];
        if (isPresent(ct)) {
          ct.dehydrate();
        }
      }
    }
    this._hydrated = false;
  }
  setEventDispatcher(dispatcher) {
    this._eventDispatcher = dispatcher;
  }
  dispatchEvent(elementIndex, eventName, event) {
    if (isPresent(this._eventDispatcher)) {
      var evalLocals = MapWrapper.create();
      MapWrapper.set(evalLocals, '$event', event);
      var localValues = this.proto.elementBinders[elementIndex].eventLocals.eval(null, new Locals(null, evalLocals));
      this._eventDispatcher.dispatchEvent(elementIndex, eventName, localValues);
    }
  }
}
Object.defineProperty(View, "parameters", {get: function() {
    return [[ProtoView], [List], [List], [List], [List], [List]];
  }});
Object.defineProperty(View.prototype.setElementProperty, "parameters", {get: function() {
    return [[assert.type.number], [assert.type.string], [assert.type.any]];
  }});
Object.defineProperty(View.prototype.setText, "parameters", {get: function() {
    return [[assert.type.number], [assert.type.string]];
  }});
Object.defineProperty(View.prototype.setComponentView, "parameters", {get: function() {
    return [[ShadowDomStrategy], [assert.type.number], [View]];
  }});
Object.defineProperty(View.prototype.getViewContainer, "parameters", {get: function() {
    return [[assert.type.number]];
  }});
Object.defineProperty(View.prototype.hydrate, "parameters", {get: function() {
    return [[LightDom]];
  }});
Object.defineProperty(View.prototype.setEventDispatcher, "parameters", {get: function() {
    return [[EventDispatcher]];
  }});
//# sourceMappingURL=view.js.map

//# sourceMappingURL=./view.map