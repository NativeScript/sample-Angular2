import {PromiseWrapper,
  Promise} from 'angular2/src/facade/async';
import {BaseException} from 'angular2/src/facade/lang';
import {Template,
  ProtoView} from '../../api';
import {CompilePipeline} from './compile_pipeline';
import {TemplateLoader} from 'angular2/src/render/dom/compiler/template_loader';
import {CompileStepFactory} from './compile_step_factory';
export class Compiler {
  constructor(stepFactory, templateLoader) {
    this._templateLoader = templateLoader;
    this._stepFactory = stepFactory;
  }
  compile(template) {
    var tplPromise = this._templateLoader.load(template);
    return PromiseWrapper.then(tplPromise, (el) => this._compileTemplate(template, el), (_) => {
      throw new BaseException(`Failed to load the template "${template.componentId}"`);
    });
  }
  _compileTemplate(template, tplElement) {
    var subTaskPromises = [];
    var pipeline = new CompilePipeline(this._stepFactory.createSteps(template, subTaskPromises));
    var compileElements;
    compileElements = pipeline.process(tplElement, template.componentId);
    var protoView = compileElements[0].inheritedProtoView.build();
    if (subTaskPromises.length > 0) {
      return PromiseWrapper.all(subTaskPromises).then((_) => protoView);
    } else {
      return PromiseWrapper.resolve(protoView);
    }
  }
}
Object.defineProperty(Compiler, "parameters", {get: function() {
    return [[CompileStepFactory], [TemplateLoader]];
  }});
Object.defineProperty(Compiler.prototype.compile, "parameters", {get: function() {
    return [[Template]];
  }});
Object.defineProperty(Compiler.prototype._compileTemplate, "parameters", {get: function() {
    return [[Template], []];
  }});
//# sourceMappingURL=compiler.js.map

//# sourceMappingURL=./compiler.map