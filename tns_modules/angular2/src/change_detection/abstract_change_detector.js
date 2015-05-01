var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
var binding_propagation_config_1 = require('./binding_propagation_config');
var interfaces_1 = require('./interfaces');
var constants_1 = require('./constants');
var AbstractChangeDetector = (function (_super) {
    __extends(AbstractChangeDetector, _super);
    function AbstractChangeDetector() {
        _super.call(this);
        this.lightDomChildren = [];
        this.shadowDomChildren = [];
        this.bindingPropagationConfig = new binding_propagation_config_1.BindingPropagationConfig(this);
        this.mode = null;
    }
    AbstractChangeDetector.prototype.addChild = function (cd) {
        collection_1.ListWrapper.push(this.lightDomChildren, cd);
        cd.parent = this;
    };
    AbstractChangeDetector.prototype.removeChild = function (cd) {
        collection_1.ListWrapper.remove(this.lightDomChildren, cd);
    };
    AbstractChangeDetector.prototype.addShadowDomChild = function (cd) {
        collection_1.ListWrapper.push(this.shadowDomChildren, cd);
        cd.parent = this;
    };
    AbstractChangeDetector.prototype.remove = function () {
        this.parent.removeChild(this);
    };
    AbstractChangeDetector.prototype.detectChanges = function () {
        this._detectChanges(false);
    };
    AbstractChangeDetector.prototype.checkNoChanges = function () {
        this._detectChanges(true);
    };
    AbstractChangeDetector.prototype._detectChanges = function (throwOnChange) {
        if (this.mode === constants_1.DETACHED || this.mode === constants_1.CHECKED)
            return;
        this.detectChangesInRecords(throwOnChange);
        this._detectChangesInLightDomChildren(throwOnChange);
        this.callOnAllChangesDone();
        this._detectChangesInShadowDomChildren(throwOnChange);
        if (this.mode === constants_1.CHECK_ONCE)
            this.mode = constants_1.CHECKED;
    };
    AbstractChangeDetector.prototype.detectChangesInRecords = function (throwOnChange) { };
    AbstractChangeDetector.prototype.callOnAllChangesDone = function () { };
    AbstractChangeDetector.prototype._detectChangesInLightDomChildren = function (throwOnChange) {
        var c = this.lightDomChildren;
        for (var i = 0; i < c.length; ++i) {
            c[i]._detectChanges(throwOnChange);
        }
    };
    AbstractChangeDetector.prototype._detectChangesInShadowDomChildren = function (throwOnChange) {
        var c = this.shadowDomChildren;
        for (var i = 0; i < c.length; ++i) {
            c[i]._detectChanges(throwOnChange);
        }
    };
    AbstractChangeDetector.prototype.markPathToRootAsCheckOnce = function () {
        var c = this;
        while (lang_1.isPresent(c) && c.mode != constants_1.DETACHED) {
            if (c.mode === constants_1.CHECKED)
                c.mode = constants_1.CHECK_ONCE;
            c = c.parent;
        }
    };
    return AbstractChangeDetector;
})(interfaces_1.ChangeDetector);
exports.AbstractChangeDetector = AbstractChangeDetector;
Object.defineProperty(AbstractChangeDetector.prototype.addChild, "parameters", { get: function () {
        return [[interfaces_1.ChangeDetector]];
    } });
Object.defineProperty(AbstractChangeDetector.prototype.removeChild, "parameters", { get: function () {
        return [[interfaces_1.ChangeDetector]];
    } });
Object.defineProperty(AbstractChangeDetector.prototype.addShadowDomChild, "parameters", { get: function () {
        return [[interfaces_1.ChangeDetector]];
    } });
Object.defineProperty(AbstractChangeDetector.prototype._detectChanges, "parameters", { get: function () {
        return [[assert.type.boolean]];
    } });
Object.defineProperty(AbstractChangeDetector.prototype.detectChangesInRecords, "parameters", { get: function () {
        return [[assert.type.boolean]];
    } });
Object.defineProperty(AbstractChangeDetector.prototype._detectChangesInLightDomChildren, "parameters", { get: function () {
        return [[assert.type.boolean]];
    } });
Object.defineProperty(AbstractChangeDetector.prototype._detectChangesInShadowDomChildren, "parameters", { get: function () {
        return [[assert.type.boolean]];
    } });
