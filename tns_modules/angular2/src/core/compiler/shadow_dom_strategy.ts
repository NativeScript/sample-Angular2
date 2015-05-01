import {Injectable} from 'angular2/di';
import {stringify} from 'angular2/src/facade/lang';
import {DOM} from 'angular2/src/dom/dom_adapter';
import * as viewModule from './view';
import {LightDom} from './shadow_dom_emulation/light_dom';
import {StyleInliner} from 'angular2/src/render/dom/shadow_dom/style_inliner';
import {StyleUrlResolver} from 'angular2/src/render/dom/shadow_dom/style_url_resolver';
import * as sds from 'angular2/src/render/dom/shadow_dom/shadow_dom_strategy';
import * as nsds from 'angular2/src/render/dom/shadow_dom/native_shadow_dom_strategy';
import * as eusds from 'angular2/src/render/dom/shadow_dom/emulated_unscoped_shadow_dom_strategy';
import * as essds from 'angular2/src/render/dom/shadow_dom/emulated_scoped_shadow_dom_strategy';
export class ShadowDomStrategy {
  attachTemplate(el, view) {}
  constructLightDom(lightDomView, shadowDomView, el) {
    return null;
  }
  shimAppElement(componentType, insertionElement) {
    this.render.processElement(null, stringify(componentType), insertionElement);
  }
}
Object.defineProperty(ShadowDomStrategy.prototype.attachTemplate, "parameters", {get: function() {
    return [[], [viewModule.View]];
  }});
Object.defineProperty(ShadowDomStrategy.prototype.constructLightDom, "parameters", {get: function() {
    return [[viewModule.View], [viewModule.View], []];
  }});
export class EmulatedUnscopedShadowDomStrategy extends ShadowDomStrategy {
  constructor(styleUrlResolver, styleHost) {
    super();
    this.render = new eusds.EmulatedUnscopedShadowDomStrategy(styleUrlResolver, styleHost);
  }
  attachTemplate(el, view) {
    DOM.clearNodes(el);
    _moveViewNodesIntoParent(el, view);
  }
  constructLightDom(lightDomView, shadowDomView, el) {
    return new LightDom(lightDomView, shadowDomView, el);
  }
}
Object.defineProperty(EmulatedUnscopedShadowDomStrategy, "annotations", {get: function() {
    return [new Injectable()];
  }});
Object.defineProperty(EmulatedUnscopedShadowDomStrategy, "parameters", {get: function() {
    return [[StyleUrlResolver], []];
  }});
Object.defineProperty(EmulatedUnscopedShadowDomStrategy.prototype.attachTemplate, "parameters", {get: function() {
    return [[], [viewModule.View]];
  }});
Object.defineProperty(EmulatedUnscopedShadowDomStrategy.prototype.constructLightDom, "parameters", {get: function() {
    return [[viewModule.View], [viewModule.View], []];
  }});
export class EmulatedScopedShadowDomStrategy extends ShadowDomStrategy {
  constructor(styleInliner, styleUrlResolver, styleHost) {
    super();
    this.render = new essds.EmulatedScopedShadowDomStrategy(styleInliner, styleUrlResolver, styleHost);
  }
  attachTemplate(el, view) {
    DOM.clearNodes(el);
    _moveViewNodesIntoParent(el, view);
  }
  constructLightDom(lightDomView, shadowDomView, el) {
    return new LightDom(lightDomView, shadowDomView, el);
  }
}
Object.defineProperty(EmulatedScopedShadowDomStrategy, "annotations", {get: function() {
    return [new Injectable()];
  }});
Object.defineProperty(EmulatedScopedShadowDomStrategy, "parameters", {get: function() {
    return [[StyleInliner], [StyleUrlResolver], []];
  }});
Object.defineProperty(EmulatedScopedShadowDomStrategy.prototype.attachTemplate, "parameters", {get: function() {
    return [[], [viewModule.View]];
  }});
Object.defineProperty(EmulatedScopedShadowDomStrategy.prototype.constructLightDom, "parameters", {get: function() {
    return [[viewModule.View], [viewModule.View], []];
  }});
export class NativeShadowDomStrategy extends ShadowDomStrategy {
  constructor(styleUrlResolver) {
    super();
    this.render = new nsds.NativeShadowDomStrategy(styleUrlResolver);
  }
  attachTemplate(el, view) {
    _moveViewNodesIntoParent(DOM.createShadowRoot(el), view);
  }
}
Object.defineProperty(NativeShadowDomStrategy, "annotations", {get: function() {
    return [new Injectable()];
  }});
Object.defineProperty(NativeShadowDomStrategy, "parameters", {get: function() {
    return [[StyleUrlResolver]];
  }});
Object.defineProperty(NativeShadowDomStrategy.prototype.attachTemplate, "parameters", {get: function() {
    return [[], [viewModule.View]];
  }});
function _moveViewNodesIntoParent(parent, view) {
  for (var i = 0; i < view.nodes.length; ++i) {
    DOM.appendChild(parent, view.nodes[i]);
  }
}
//# sourceMappingURL=shadow_dom_strategy.js.map

//# sourceMappingURL=./shadow_dom_strategy.map