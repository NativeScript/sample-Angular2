import {Compiler} from './compiler';
import {ShadowDomStrategy} from './shadow_dom_strategy';
import {Injectable} from 'angular2/di';
import {EventManager} from 'angular2/src/render/dom/events/event_manager';
import {DirectiveMetadataReader} from 'angular2/src/core/compiler/directive_metadata_reader';
import {Component} from 'angular2/src/core/annotations/annotations';
import {PrivateComponentLocation} from './private_component_location';
import {Type,
  stringify,
  BaseException} from 'angular2/src/facade/lang';
export class PrivateComponentLoader {
  constructor(compiler, shadowDomStrategy, eventManager, directiveMetadataReader) {
    this.compiler = compiler;
    this.shadowDomStrategy = shadowDomStrategy;
    this.eventManager = eventManager;
    this.directiveMetadataReader = directiveMetadataReader;
  }
  load(type, location) {
    var annotation = this.directiveMetadataReader.read(type).annotation;
    if (!(annotation instanceof Component)) {
      throw new BaseException(`Could not load '${stringify(type)}' because it is not a component.`);
    }
    return this.compiler.compile(type).then((componentProtoView) => {
      location.createComponent(type, annotation, componentProtoView, this.eventManager, this.shadowDomStrategy);
    });
  }
}
Object.defineProperty(PrivateComponentLoader, "annotations", {get: function() {
    return [new Injectable()];
  }});
Object.defineProperty(PrivateComponentLoader, "parameters", {get: function() {
    return [[Compiler], [ShadowDomStrategy], [EventManager], [DirectiveMetadataReader]];
  }});
Object.defineProperty(PrivateComponentLoader.prototype.load, "parameters", {get: function() {
    return [[Type], [PrivateComponentLocation]];
  }});
//# sourceMappingURL=private_component_loader.js.map

//# sourceMappingURL=./private_component_loader.map