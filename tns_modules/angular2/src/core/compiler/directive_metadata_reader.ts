import {Injectable} from 'angular2/di';
import {Type,
  isPresent,
  BaseException,
  stringify} from 'angular2/src/facade/lang';
import {Directive} from '../annotations/annotations';
import {DirectiveMetadata} from './directive_metadata';
import {reflector} from 'angular2/src/reflection/reflection';
export class DirectiveMetadataReader {
  read(type) {
    var annotations = reflector.annotations(type);
    if (isPresent(annotations)) {
      for (var i = 0; i < annotations.length; i++) {
        var annotation = annotations[i];
        if (annotation instanceof Directive) {
          return new DirectiveMetadata(type, annotation);
        }
      }
    }
    throw new BaseException(`No Directive annotation found on ${stringify(type)}`);
  }
}
Object.defineProperty(DirectiveMetadataReader, "annotations", {get: function() {
    return [new Injectable()];
  }});
Object.defineProperty(DirectiveMetadataReader.prototype.read, "parameters", {get: function() {
    return [[Type]];
  }});
//# sourceMappingURL=directive_metadata_reader.js.map

//# sourceMappingURL=./directive_metadata_reader.map