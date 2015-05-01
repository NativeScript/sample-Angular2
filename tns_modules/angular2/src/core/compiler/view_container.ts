import * as viewModule from './view';
import {DOM} from 'angular2/src/dom/dom_adapter';
import {ListWrapper,
  MapWrapper,
  List} from 'angular2/src/facade/collection';
import {BaseException} from 'angular2/src/facade/lang';
import {Injector} from 'angular2/di';
import * as eiModule from 'angular2/src/core/compiler/element_injector';
import {isPresent,
  isBlank} from 'angular2/src/facade/lang';
import {EventManager} from 'angular2/src/render/dom/events/event_manager';
import {LightDom} from './shadow_dom_emulation/light_dom';
export class ViewContainer {
  constructor(parentView, templateElement, defaultProtoView, elementInjector, eventManager, lightDom = null) {
    this.parentView = parentView;
    this.templateElement = templateElement;
    this.defaultProtoView = defaultProtoView;
    this.elementInjector = elementInjector;
    this._lightDom = lightDom;
    this._views = [];
    this.appInjector = null;
    this.hostElementInjector = null;
    this.hostLightDom = null;
    this._eventManager = eventManager;
  }
  hydrate(appInjector, hostElementInjector, hostLightDom) {
    this.appInjector = appInjector;
    this.hostElementInjector = hostElementInjector;
    this.hostLightDom = hostLightDom;
  }
  dehydrate() {
    this.appInjector = null;
    this.hostElementInjector = null;
    this.hostLightDom = null;
    this.clear();
  }
  clear() {
    for (var i = this._views.length - 1; i >= 0; i--) {
      this.remove(i);
    }
  }
  get(index) {
    return this._views[index];
  }
  get length() {
    return this._views.length;
  }
  _siblingToInsertAfter(index) {
    if (index == 0)
      return this.templateElement;
    return ListWrapper.last(this._views[index - 1].nodes);
  }
  hydrated() {
    return isPresent(this.appInjector);
  }
  create(atIndex = -1) {
    if (!this.hydrated())
      throw new BaseException('Cannot create views on a dehydrated ViewContainer');
    var newView = this.defaultProtoView.instantiate(this.hostElementInjector, this._eventManager);
    this.insert(newView, atIndex);
    newView.hydrate(this.appInjector, this.hostElementInjector, this.hostLightDom, this.parentView.context, this.parentView.locals);
    if (isPresent(this.hostLightDom)) {
      this.hostLightDom.redistribute();
    }
    return newView;
  }
  insert(view, atIndex = -1) {
    if (atIndex == -1)
      atIndex = this._views.length;
    ListWrapper.insert(this._views, atIndex, view);
    if (isBlank(this._lightDom)) {
      ViewContainer.moveViewNodesAfterSibling(this._siblingToInsertAfter(atIndex), view);
    } else {
      this._lightDom.redistribute();
    }
    this.parentView.changeDetector.addChild(view.changeDetector);
    this._linkElementInjectors(view);
    return view;
  }
  remove(atIndex = -1) {
    if (atIndex == -1)
      atIndex = this._views.length - 1;
    var view = this.detach(atIndex);
    view.dehydrate();
    this.defaultProtoView.returnToPool(view);
  }
  detach(atIndex = -1) {
    if (atIndex == -1)
      atIndex = this._views.length - 1;
    var detachedView = this.get(atIndex);
    ListWrapper.removeAt(this._views, atIndex);
    if (isBlank(this._lightDom)) {
      ViewContainer.removeViewNodes(detachedView);
    } else {
      this._lightDom.redistribute();
    }
    if (isPresent(this.hostLightDom)) {
      this.hostLightDom.redistribute();
    }
    detachedView.changeDetector.remove();
    this._unlinkElementInjectors(detachedView);
    return detachedView;
  }
  contentTagContainers() {
    return this._views;
  }
  nodes() {
    var r = [];
    for (var i = 0; i < this._views.length; ++i) {
      r = ListWrapper.concat(r, this._views[i].nodes);
    }
    return r;
  }
  _linkElementInjectors(view) {
    for (var i = 0; i < view.rootElementInjectors.length; ++i) {
      view.rootElementInjectors[i].parent = this.elementInjector;
    }
  }
  _unlinkElementInjectors(view) {
    for (var i = 0; i < view.rootElementInjectors.length; ++i) {
      view.rootElementInjectors[i].parent = null;
    }
  }
  static moveViewNodesAfterSibling(sibling, view) {
    for (var i = view.nodes.length - 1; i >= 0; --i) {
      DOM.insertAfter(sibling, view.nodes[i]);
    }
  }
  static removeViewNodes(view) {
    var len = view.nodes.length;
    if (len == 0)
      return ;
    var parent = view.nodes[0].parentNode;
    for (var i = len - 1; i >= 0; --i) {
      DOM.removeChild(parent, view.nodes[i]);
    }
  }
}
Object.defineProperty(ViewContainer, "parameters", {get: function() {
    return [[viewModule.View], [], [viewModule.ProtoView], [eiModule.ElementInjector], [EventManager], []];
  }});
Object.defineProperty(ViewContainer.prototype.hydrate, "parameters", {get: function() {
    return [[Injector], [eiModule.ElementInjector], [LightDom]];
  }});
Object.defineProperty(ViewContainer.prototype.get, "parameters", {get: function() {
    return [[assert.type.number]];
  }});
Object.defineProperty(ViewContainer.prototype._siblingToInsertAfter, "parameters", {get: function() {
    return [[assert.type.number]];
  }});
//# sourceMappingURL=view_container.js.map

//# sourceMappingURL=./view_container.map