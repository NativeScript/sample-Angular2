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
var async_1 = require('angular2/src/facade/async');
var xhr_1 = require('./xhr');
var XHRImpl = (function (_super) {
    __extends(XHRImpl, _super);
    function XHRImpl() {
        _super.apply(this, arguments);
    }
    XHRImpl.prototype.get = function (url) {
        var completer = async_1.PromiseWrapper.completer();
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'text';
        xhr.onload = function () {
            var status = xhr.status;
            if (200 <= status && status <= 300) {
                completer.resolve(xhr.responseText);
            }
            else {
                completer.reject("Failed to load " + url);
            }
        };
        xhr.onerror = function () {
            completer.reject("Failed to load " + url);
        };
        xhr.send();
        return completer.promise;
    };
    return XHRImpl;
})(xhr_1.XHR);
exports.XHRImpl = XHRImpl;
Object.defineProperty(XHRImpl, "annotations", { get: function () {
        return [new di_1.Injectable()];
    } });
Object.defineProperty(XHRImpl.prototype.get, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
