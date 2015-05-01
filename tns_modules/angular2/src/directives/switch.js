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
var annotations_1 = require('angular2/src/core/annotations/annotations');
var view_container_1 = require('angular2/src/core/compiler/view_container');
var element_1 = require('angular2/src/core/dom/element');
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var visibility_1 = require('angular2/src/core/annotations/visibility');
var Switch = (function () {
    function Switch() {
        this._valueViewContainers = collection_1.MapWrapper.create();
        this._activeViewContainers = collection_1.ListWrapper.create();
        this._useDefault = false;
    }
    Object.defineProperty(Switch.prototype, "value", {
        set: function (value) {
            this._emptyAllActiveViewContainers();
            this._useDefault = false;
            var containers = collection_1.MapWrapper.get(this._valueViewContainers, value);
            if (lang_1.isBlank(containers)) {
                this._useDefault = true;
                containers = lang_1.normalizeBlank(collection_1.MapWrapper.get(this._valueViewContainers, _whenDefault));
            }
            this._activateViewContainers(containers);
            this._switchValue = value;
        },
        enumerable: true,
        configurable: true
    });
    Switch.prototype._onWhenValueChanged = function (oldWhen, newWhen, viewContainer) {
        this._deregisterViewContainer(oldWhen, viewContainer);
        this._registerViewContainer(newWhen, viewContainer);
        if (oldWhen === this._switchValue) {
            viewContainer.remove();
            collection_1.ListWrapper.remove(this._activeViewContainers, viewContainer);
        }
        else if (newWhen === this._switchValue) {
            if (this._useDefault) {
                this._useDefault = false;
                this._emptyAllActiveViewContainers();
            }
            viewContainer.create();
            collection_1.ListWrapper.push(this._activeViewContainers, viewContainer);
        }
        if (this._activeViewContainers.length === 0 && !this._useDefault) {
            this._useDefault = true;
            this._activateViewContainers(collection_1.MapWrapper.get(this._valueViewContainers, _whenDefault));
        }
    };
    Switch.prototype._emptyAllActiveViewContainers = function () {
        var activeContainers = this._activeViewContainers;
        for (var i = 0; i < activeContainers.length; i++) {
            activeContainers[i].remove();
        }
        this._activeViewContainers = collection_1.ListWrapper.create();
    };
    Switch.prototype._activateViewContainers = function (containers) {
        if (lang_1.isPresent(containers)) {
            for (var i = 0; i < containers.length; i++) {
                containers[i].create();
            }
            this._activeViewContainers = containers;
        }
    };
    Switch.prototype._registerViewContainer = function (value, container) {
        var containers = collection_1.MapWrapper.get(this._valueViewContainers, value);
        if (lang_1.isBlank(containers)) {
            containers = collection_1.ListWrapper.create();
            collection_1.MapWrapper.set(this._valueViewContainers, value, containers);
        }
        collection_1.ListWrapper.push(containers, container);
    };
    Switch.prototype._deregisterViewContainer = function (value, container) {
        if (value == _whenDefault)
            return;
        var containers = collection_1.MapWrapper.get(this._valueViewContainers, value);
        if (containers.length == 1) {
            collection_1.MapWrapper.delete(this._valueViewContainers, value);
        }
        else {
            collection_1.ListWrapper.remove(containers, container);
        }
    };
    return Switch;
})();
exports.Switch = Switch;
Object.defineProperty(Switch, "annotations", { get: function () {
        return [new annotations_1.Decorator({
                selector: '[switch]',
                bind: { 'value': 'switch' }
            })];
    } });
Object.defineProperty(Switch.prototype._onWhenValueChanged, "parameters", { get: function () {
        return [[], [], [view_container_1.ViewContainer]];
    } });
Object.defineProperty(Switch.prototype._activateViewContainers, "parameters", { get: function () {
        return [[assert.genericType(collection_1.List, view_container_1.ViewContainer)]];
    } });
Object.defineProperty(Switch.prototype._registerViewContainer, "parameters", { get: function () {
        return [[], [view_container_1.ViewContainer]];
    } });
Object.defineProperty(Switch.prototype._deregisterViewContainer, "parameters", { get: function () {
        return [[], [view_container_1.ViewContainer]];
    } });
var SwitchWhen = (function () {
    function SwitchWhen(el, viewContainer, sswitch) {
        this._value = _whenDefault;
        this._switch = sswitch;
        this._viewContainer = viewContainer;
    }
    Object.defineProperty(SwitchWhen.prototype, "when", {
        set: function (value) {
            this._switch._onWhenValueChanged(this._value, value, this._viewContainer);
            this._value = value;
        },
        enumerable: true,
        configurable: true
    });
    return SwitchWhen;
})();
exports.SwitchWhen = SwitchWhen;
Object.defineProperty(SwitchWhen, "annotations", { get: function () {
        return [new annotations_1.Viewport({
                selector: '[switch-when]',
                bind: { 'when': 'switch-when' }
            })];
    } });
Object.defineProperty(SwitchWhen, "parameters", { get: function () {
        return [[element_1.NgElement], [view_container_1.ViewContainer], [Switch, new visibility_1.Parent()]];
    } });
var SwitchDefault = (function () {
    function SwitchDefault(viewContainer, sswitch) {
        sswitch._registerViewContainer(_whenDefault, viewContainer);
    }
    return SwitchDefault;
})();
exports.SwitchDefault = SwitchDefault;
Object.defineProperty(SwitchDefault, "annotations", { get: function () {
        return [new annotations_1.Viewport({ selector: '[switch-default]' })];
    } });
Object.defineProperty(SwitchDefault, "parameters", { get: function () {
        return [[view_container_1.ViewContainer], [Switch, new visibility_1.Parent()]];
    } });
var _whenDefault = new Object();
