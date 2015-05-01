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
var di_1 = require('angular2/di');
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var ComponentUrlMapper = (function () {
    function ComponentUrlMapper() {
    }
    ComponentUrlMapper.prototype.getUrl = function (component) {
        return './';
    };
    return ComponentUrlMapper;
})();
exports.ComponentUrlMapper = ComponentUrlMapper;
Object.defineProperty(ComponentUrlMapper, "annotations", { get: function () {
        return [new di_1.Injectable()];
    } });
Object.defineProperty(ComponentUrlMapper.prototype.getUrl, "parameters", { get: function () {
        return [[lang_1.Type]];
    } });
var RuntimeComponentUrlMapper = (function (_super) {
    __extends(RuntimeComponentUrlMapper, _super);
    function RuntimeComponentUrlMapper() {
        _super.call(this);
        this._componentUrls = collection_1.MapWrapper.create();
    }
    RuntimeComponentUrlMapper.prototype.setComponentUrl = function (component, url) {
        collection_1.MapWrapper.set(this._componentUrls, component, url);
    };
    RuntimeComponentUrlMapper.prototype.getUrl = function (component) {
        var url = collection_1.MapWrapper.get(this._componentUrls, component);
        if (lang_1.isPresent(url))
            return url;
        return _super.prototype.getUrl.call(this, component);
    };
    return RuntimeComponentUrlMapper;
})(ComponentUrlMapper);
exports.RuntimeComponentUrlMapper = RuntimeComponentUrlMapper;
Object.defineProperty(RuntimeComponentUrlMapper.prototype.setComponentUrl, "parameters", { get: function () {
        return [[lang_1.Type], [assert.type.string]];
    } });
Object.defineProperty(RuntimeComponentUrlMapper.prototype.getUrl, "parameters", { get: function () {
        return [[lang_1.Type]];
    } });
