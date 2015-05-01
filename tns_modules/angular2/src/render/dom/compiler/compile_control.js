var __decorate = this.__decorate || function (decorators, target, key, value) {
    var kind = typeof (arguments.length == 2 ? value = target : value);
    for (var i = decorators.length - 1; i >= 0; --i) {
        var decorator = decorators[i];
        switch (kind) {
            case "function": value = decorator(value) || value; break;
            case "number": decorator(target, key, value); break;
            case "undefined": decorator(target, key); break;
            case "object": value = decorator(target, key, value) || value; break;
        }
    }
    return value;
};
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var compile_element_1 = require('./compile_element');
var CompileControl = (function () {
    function CompileControl(steps) {
        this._steps = steps;
        this._currentStepIndex = 0;
        this._parent = null;
        this._results = null;
        this._additionalChildren = null;
    }
    CompileControl.prototype.internalProcess = function (results, startStepIndex, parent, current) {
        this._results = results;
        var previousStepIndex = this._currentStepIndex;
        var previousParent = this._parent;
        for (var i = startStepIndex; i < this._steps.length; i++) {
            var step = this._steps[i];
            this._parent = parent;
            this._currentStepIndex = i;
            step.process(parent, current, this);
            parent = this._parent;
        }
        collection_1.ListWrapper.push(results, current);
        this._currentStepIndex = previousStepIndex;
        this._parent = previousParent;
        var localAdditionalChildren = this._additionalChildren;
        this._additionalChildren = null;
        return localAdditionalChildren;
    };
    CompileControl.prototype.addParent = function (newElement) {
        this.internalProcess(this._results, this._currentStepIndex + 1, this._parent, newElement);
        this._parent = newElement;
    };
    CompileControl.prototype.addChild = function (element) {
        if (lang_1.isBlank(this._additionalChildren)) {
            this._additionalChildren = collection_1.ListWrapper.create();
        }
        collection_1.ListWrapper.push(this._additionalChildren, element);
    };
    return CompileControl;
})();
exports.CompileControl = CompileControl;
Object.defineProperty(CompileControl.prototype.internalProcess, "parameters", { get: function () {
        return [[], [], [compile_element_1.CompileElement], [compile_element_1.CompileElement]];
    } });
Object.defineProperty(CompileControl.prototype.addParent, "parameters", { get: function () {
        return [[compile_element_1.CompileElement]];
    } });
Object.defineProperty(CompileControl.prototype.addChild, "parameters", { get: function () {
        return [[compile_element_1.CompileElement]];
    } });
