import {isPresent,
  isBlank,
  BaseException} from 'angular2/src/facade/lang';
import {ListWrapper,
  MapWrapper,
  List} from 'angular2/src/facade/collection';
import {DOM} from 'angular2/src/dom/dom_adapter';
import * as viewModule from './view';
import * as ldModule from '../shadow_dom/light_dom';
import * as vfModule from './view_factory';
export class ViewContainer {
  constructor(viewFactory, templateElement) {
    this._viewFactory = viewFactory;
    this.templateElement = templateElement;
    this._views = [];
    this._hostLightDom = null;
    this._hydrated = false;
  }
  hydrate(destLightDom, hostLightDom) {
    this._hydrated = true;
    this._hostLightDom = hostLightDom;
    this._lightDom = destLightDom;
  }
  dehydrate() {
    if (isBlank(this._lightDom)) {
      for (var i = this._views.length - 1; i >= 0; i--) {
        var view = this._views[i];
        ViewContainer.removeViewNodesFromParent(this.templateElement.parentNode, view);
        this._viewFactory.returnView(view);
      }
      this._views = [];
    } else {
      for (var i = 0; i < this._views.length; i++) {
        var view = this._views[i];
        this._viewFactory.returnView(view);
      }
      this._views = [];
      this._lightDom.redistribute();
    }
    this._hostLightDom = null;
    this._lightDom = null;
    this._hydrated = false;
  }
  get(index) {
    return this._views[index];
  }
  size() {
    return this._views.length;
  }
  _siblingToInsertAfter(index) {
    if (index == 0)
      return this.templateElement;
    return ListWrapper.last(this._views[index - 1].rootNodes);
  }
  _checkHydrated() {
    if (!this._hydrated)
      throw new BaseException('Cannot change dehydrated ViewContainer');
  }
  insert(view, atIndex = -1) {
    this._checkHydrated();
    if (atIndex == -1)
      atIndex = this._views.length;
    ListWrapper.insert(this._views, atIndex, view);
    if (!view.hydrated()) {
      view.hydrate(this._hostLightDom);
    }
    if (isBlank(this._lightDom)) {
      ViewContainer.moveViewNodesAfterSibling(this._siblingToInsertAfter(atIndex), view);
    } else {
      this._lightDom.redistribute();
    }
    if (isPresent(this._hostLightDom)) {
      this._hostLightDom.redistribute();
    }
    return view;
  }
  detach(atIndex) {
    this._checkHydrated();
    var detachedView = this.get(atIndex);
    ListWrapper.removeAt(this._views, atIndex);
    if (isBlank(this._lightDom)) {
      ViewContainer.removeViewNodesFromParent(this.templateElement.parentNode, detachedView);
    } else {
      this._lightDom.redistribute();
    }
    if (isPresent(this._hostLightDom)) {
      this._hostLightDom.redistribute();
    }
    return detachedView;
  }
  contentTagContainers() {
    return this._views;
  }
  nodes() {
    var r = [];
    for (var i = 0; i < this._views.length; ++i) {
      r = ListWrapper.concat(r, this._views[i].rootNodes);
    }
    return r;
  }
  static moveViewNodesAfterSibling(sibling, view) {
    for (var i = view.rootNodes.length - 1; i >= 0; --i) {
      DOM.insertAfter(sibling, view.rootNodes[i]);
    }
  }
  static removeViewNodesFromParent(parent, view) {
    for (var i = view.rootNodes.length - 1; i >= 0; --i) {
      DOM.removeChild(parent, view.rootNodes[i]);
    }
  }
}
Object.defineProperty(ViewContainer, "parameters", {get: function() {
    return [[vfModule.ViewFactory], []];
  }});
Object.defineProperty(ViewContainer.prototype.hydrate, "parameters", {get: function() {
    return [[ldModule.LightDom], [ldModule.LightDom]];
  }});
Object.defineProperty(ViewContainer.prototype.get, "parameters", {get: function() {
    return [[assert.type.number]];
  }});
Object.defineProperty(ViewContainer.prototype._siblingToInsertAfter, "parameters", {get: function() {
    return [[assert.type.number]];
  }});
Object.defineProperty(ViewContainer.prototype.detach, "parameters", {get: function() {
    return [[assert.type.number]];
  }});
//# sourceMappingURL=view_container.js.map

//# sourceMappingURL=./view_container.map