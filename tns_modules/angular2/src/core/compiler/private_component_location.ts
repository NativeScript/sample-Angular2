import {Directive} from 'angular2/src/core/annotations/annotations';
import {NgElement} from 'angular2/src/core/dom/element';
import * as viewModule from './view';
import * as eiModule from './element_injector';
import {ShadowDomStrategy} from './shadow_dom_strategy';
import {EventManager} from 'angular2/src/render/dom/events/event_manager';
import {ListWrapper} from 'angular2/src/facade/collection';
import {Type} from 'angular2/src/facade/lang';
export class PrivateComponentLocation {
  constructor(elementInjector, elt, view) {
    this._elementInjector = elementInjector;
    this._elt = elt;
    this._view = view;
  }
  createComponent(type, annotation, componentProtoView, eventManager, shadowDomStrategy) {
    var context = this._elementInjector.createPrivateComponent(type, annotation);
    var view = componentProtoView.instantiate(this._elementInjector, eventManager);
    view.hydrate(this._elementInjector.getShadowDomAppInjector(), this._elementInjector, null, context, null);
    shadowDomStrategy.attachTemplate(this._elt.domElement, view);
    ListWrapper.push(this._view.componentChildViews, view);
    this._view.changeDetector.addChild(view.changeDetector);
  }
}
Object.defineProperty(PrivateComponentLocation, "parameters", {get: function() {
    return [[eiModule.ElementInjector], [NgElement], [viewModule.View]];
  }});
Object.defineProperty(PrivateComponentLocation.prototype.createComponent, "parameters", {get: function() {
    return [[Type], [Directive], [viewModule.ProtoView], [EventManager], [ShadowDomStrategy]];
  }});
//# sourceMappingURL=private_component_location.js.map

//# sourceMappingURL=./private_component_location.map