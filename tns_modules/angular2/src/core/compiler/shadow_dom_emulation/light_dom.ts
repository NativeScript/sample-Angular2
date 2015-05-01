import {DOM} from 'angular2/src/dom/dom_adapter';
import {List,
  ListWrapper} from 'angular2/src/facade/collection';
import {isBlank,
  isPresent} from 'angular2/src/facade/lang';
import * as viewModule from '../view';
import {Content} from './content_tag';
export class DestinationLightDom {}
class _Root {
  constructor(node, viewContainer, content) {
    this.node = node;
    this.viewContainer = viewContainer;
    this.content = content;
  }
}
export class LightDom {
  constructor(lightDomView, shadowDomView, element) {
    this.lightDomView = lightDomView;
    this.shadowDomView = shadowDomView;
    this.nodes = DOM.childNodesAsList(element);
    this.roots = null;
  }
  redistribute() {
    var tags = this.contentTags();
    if (tags.length > 0) {
      redistributeNodes(tags, this.expandedDomNodes());
    }
  }
  contentTags() {
    return this._collectAllContentTags(this.shadowDomView, []);
  }
  _collectAllContentTags(view, acc) {
    var contentTags = view.contentTags;
    var vcs = view.viewContainers;
    for (var i = 0; i < vcs.length; i++) {
      var vc = vcs[i];
      var contentTag = contentTags[i];
      if (isPresent(contentTag)) {
        ListWrapper.push(acc, contentTag);
      }
      if (isPresent(vc)) {
        ListWrapper.forEach(vc.contentTagContainers(), (view) => {
          this._collectAllContentTags(view, acc);
        });
      }
    }
    return acc;
  }
  expandedDomNodes() {
    var res = [];
    var roots = this._roots();
    for (var i = 0; i < roots.length; ++i) {
      var root = roots[i];
      if (isPresent(root.viewContainer)) {
        res = ListWrapper.concat(res, root.viewContainer.nodes());
      } else if (isPresent(root.content)) {
        res = ListWrapper.concat(res, root.content.nodes());
      } else {
        ListWrapper.push(res, root.node);
      }
    }
    return res;
  }
  _roots() {
    if (isPresent(this.roots))
      return this.roots;
    var viewContainers = this.lightDomView.viewContainers;
    var contentTags = this.lightDomView.contentTags;
    this.roots = ListWrapper.map(this.nodes, (n) => {
      var foundVc = null;
      var foundContentTag = null;
      for (var i = 0; i < viewContainers.length; i++) {
        var vc = viewContainers[i];
        var contentTag = contentTags[i];
        if (isPresent(vc) && vc.templateElement === n) {
          foundVc = vc;
        }
        if (isPresent(contentTag) && contentTag.contentStartElement === n) {
          foundContentTag = contentTag;
        }
      }
      return new _Root(n, foundVc, foundContentTag);
    });
    return this.roots;
  }
}
Object.defineProperty(LightDom, "parameters", {get: function() {
    return [[viewModule.View], [viewModule.View], []];
  }});
Object.defineProperty(LightDom.prototype._collectAllContentTags, "parameters", {get: function() {
    return [[viewModule.View], [assert.genericType(List, Content)]];
  }});
function redistributeNodes(contents, nodes) {
  for (var i = 0; i < contents.length; ++i) {
    var content = contents[i];
    var select = content.select;
    var matchSelector = (n) => DOM.elementMatches(n, select);
    if (select.length === 0) {
      content.insert(nodes);
      ListWrapper.clear(nodes);
    } else {
      var matchingNodes = ListWrapper.filter(nodes, matchSelector);
      content.insert(matchingNodes);
      ListWrapper.removeAll(nodes, matchingNodes);
    }
  }
}
Object.defineProperty(redistributeNodes, "parameters", {get: function() {
    return [[assert.genericType(List, Content)], [List]];
  }});
//# sourceMappingURL=light_dom.js.map

//# sourceMappingURL=./light_dom.map