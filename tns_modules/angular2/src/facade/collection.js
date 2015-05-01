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
exports.List = lang_1.global.Array;
exports.Map = lang_1.global.Map;
exports.Set = lang_1.global.Set;
exports.StringMap = lang_1.global.Object;
var MapWrapper = (function () {
    function MapWrapper() {
    }
    MapWrapper.create = function () {
        return new exports.Map();
    };
    MapWrapper.clone = function (m) {
        return new exports.Map(m);
    };
    MapWrapper.createFromStringMap = function (stringMap) {
        var result = MapWrapper.create();
        for (var prop in stringMap) {
            MapWrapper.set(result, prop, stringMap[prop]);
        }
        return result;
    };
    MapWrapper.createFromPairs = function (pairs) {
        return new exports.Map(pairs);
    };
    MapWrapper.get = function (m, k) {
        return m.get(k);
    };
    MapWrapper.set = function (m, k, v) {
        m.set(k, v);
    };
    MapWrapper.contains = function (m, k) {
        return m.has(k);
    };
    MapWrapper.forEach = function (m, fn) {
        m.forEach(fn);
    };
    MapWrapper.size = function (m) {
        return m.size;
    };
    MapWrapper.delete = function (m, k) {
        m.delete(k);
    };
    MapWrapper.clear = function (m) {
        m.clear();
    };
    MapWrapper.clearValues = function (m) {
        var keyIterator = m.keys();
        var k;
        while (!((k = keyIterator.next()).done)) {
            m.set(k.value, null);
        }
    };
    MapWrapper.iterable = function (m) {
        return m;
    };
    MapWrapper.keys = function (m) {
        return m.keys();
    };
    MapWrapper.values = function (m) {
        return m.values();
    };
    return MapWrapper;
})();
exports.MapWrapper = MapWrapper;
Object.defineProperty(MapWrapper.clone, "parameters", { get: function () {
        return [[exports.Map]];
    } });
Object.defineProperty(MapWrapper.createFromPairs, "parameters", { get: function () {
        return [[exports.List]];
    } });
var StringMapWrapper = (function () {
    function StringMapWrapper() {
    }
    StringMapWrapper.create = function () {
        return {};
    };
    StringMapWrapper.contains = function (map, key) {
        return map.hasOwnProperty(key);
    };
    StringMapWrapper.get = function (map, key) {
        return map.hasOwnProperty(key) ? map[key] : undefined;
    };
    StringMapWrapper.set = function (map, key, value) {
        map[key] = value;
    };
    StringMapWrapper.isEmpty = function (map) {
        for (var prop in map) {
            return false;
        }
        return true;
    };
    StringMapWrapper.delete = function (map, key) {
        delete map[key];
    };
    StringMapWrapper.forEach = function (map, callback) {
        for (var prop in map) {
            if (map.hasOwnProperty(prop)) {
                callback(map[prop], prop);
            }
        }
    };
    StringMapWrapper.merge = function (m1, m2) {
        var m = {};
        for (var attr in m1) {
            if (m1.hasOwnProperty(attr)) {
                m[attr] = m1[attr];
            }
        }
        for (var attr in m2) {
            if (m2.hasOwnProperty(attr)) {
                m[attr] = m2[attr];
            }
        }
        return m;
    };
    return StringMapWrapper;
})();
exports.StringMapWrapper = StringMapWrapper;
var ListWrapper = (function () {
    function ListWrapper() {
    }
    ListWrapper.create = function () {
        return new exports.List();
    };
    ListWrapper.createFixedSize = function (size) {
        return new exports.List(size);
    };
    ListWrapper.get = function (m, k) {
        return m[k];
    };
    ListWrapper.set = function (m, k, v) {
        m[k] = v;
    };
    ListWrapper.clone = function (array) {
        return array.slice(0);
    };
    ListWrapper.map = function (array, fn) {
        return array.map(fn);
    };
    ListWrapper.forEach = function (array, fn) {
        for (var i = 0; i < array.length; i++) {
            fn(array[i]);
        }
    };
    ListWrapper.push = function (array, el) {
        array.push(el);
    };
    ListWrapper.first = function (array) {
        if (!array)
            return null;
        return array[0];
    };
    ListWrapper.last = function (array) {
        if (!array || array.length == 0)
            return null;
        return array[array.length - 1];
    };
    ListWrapper.find = function (list, pred) {
        for (var i = 0; i < list.length; ++i) {
            if (pred(list[i]))
                return list[i];
        }
        return null;
    };
    ListWrapper.reduce = function (list, fn, init) {
        return list.reduce(fn, init);
    };
    ListWrapper.filter = function (array, pred) {
        return array.filter(pred);
    };
    ListWrapper.any = function (list, pred) {
        for (var i = 0; i < list.length; ++i) {
            if (pred(list[i]))
                return true;
        }
        return false;
    };
    ListWrapper.contains = function (list, el) {
        return list.indexOf(el) !== -1;
    };
    ListWrapper.reversed = function (array) {
        var a = ListWrapper.clone(array);
        return a.reverse();
    };
    ListWrapper.concat = function (a, b) {
        return a.concat(b);
    };
    ListWrapper.isList = function (list) {
        return Array.isArray(list);
    };
    ListWrapper.insert = function (list, index, value) {
        list.splice(index, 0, value);
    };
    ListWrapper.removeAt = function (list, index) {
        var res = list[index];
        list.splice(index, 1);
        return res;
    };
    ListWrapper.removeAll = function (list, items) {
        for (var i = 0; i < items.length; ++i) {
            var index = list.indexOf(items[i]);
            list.splice(index, 1);
        }
    };
    ListWrapper.removeLast = function (list) {
        return list.pop();
    };
    ListWrapper.remove = function (list, el) {
        var index = list.indexOf(el);
        if (index > -1) {
            list.splice(index, 1);
            return true;
        }
        return false;
    };
    ListWrapper.clear = function (list) {
        list.splice(0, list.length);
    };
    ListWrapper.join = function (list, s) {
        return list.join(s);
    };
    ListWrapper.isEmpty = function (list) {
        return list.length == 0;
    };
    ListWrapper.fill = function (list, value, start, end) {
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = null; }
        list.fill(value, start, end === null ? undefined : end);
    };
    ListWrapper.equals = function (a, b) {
        if (a.length != b.length)
            return false;
        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i])
                return false;
        }
        return true;
    };
    ListWrapper.slice = function (l, from, to) {
        return l.slice(from, to);
    };
    ListWrapper.sort = function (l, compareFn) {
        l.sort(compareFn);
    };
    return ListWrapper;
})();
exports.ListWrapper = ListWrapper;
Object.defineProperty(ListWrapper.clone, "parameters", { get: function () {
        return [[exports.List]];
    } });
Object.defineProperty(ListWrapper.forEach, "parameters", { get: function () {
        return [[exports.List], [Function]];
    } });
Object.defineProperty(ListWrapper.find, "parameters", { get: function () {
        return [[exports.List], [Function]];
    } });
Object.defineProperty(ListWrapper.reduce, "parameters", { get: function () {
        return [[exports.List], [Function], []];
    } });
Object.defineProperty(ListWrapper.filter, "parameters", { get: function () {
        return [[], [Function]];
    } });
Object.defineProperty(ListWrapper.any, "parameters", { get: function () {
        return [[exports.List], [Function]];
    } });
Object.defineProperty(ListWrapper.contains, "parameters", { get: function () {
        return [[exports.List], []];
    } });
Object.defineProperty(ListWrapper.insert, "parameters", { get: function () {
        return [[], [lang_1.int], []];
    } });
Object.defineProperty(ListWrapper.removeAt, "parameters", { get: function () {
        return [[], [lang_1.int]];
    } });
Object.defineProperty(ListWrapper.removeLast, "parameters", { get: function () {
        return [[exports.List]];
    } });
Object.defineProperty(ListWrapper.fill, "parameters", { get: function () {
        return [[exports.List], [], [lang_1.int], [lang_1.int]];
    } });
Object.defineProperty(ListWrapper.equals, "parameters", { get: function () {
        return [[exports.List], [exports.List]];
    } });
Object.defineProperty(ListWrapper.slice, "parameters", { get: function () {
        return [[exports.List], [lang_1.int], [lang_1.int]];
    } });
Object.defineProperty(ListWrapper.sort, "parameters", { get: function () {
        return [[exports.List], [Function]];
    } });
function isListLikeIterable(obj) {
    if (!lang_1.isJsObject(obj))
        return false;
    return ListWrapper.isList(obj) || (!(obj instanceof exports.Map) && Symbol.iterator in obj);
}
exports.isListLikeIterable = isListLikeIterable;
function iterateListLike(obj, fn) {
    if (ListWrapper.isList(obj)) {
        for (var i = 0; i < obj.length; i++) {
            fn(obj[i]);
        }
    }
    else {
        var iterator = obj[Symbol.iterator]();
        var item;
        while (!((item = iterator.next()).done)) {
            fn(item.value);
        }
    }
}
exports.iterateListLike = iterateListLike;
Object.defineProperty(iterateListLike, "parameters", { get: function () {
        return [[], [Function]];
    } });
var SetWrapper = (function () {
    function SetWrapper() {
    }
    SetWrapper.createFromList = function (lst) {
        return new exports.Set(lst);
    };
    SetWrapper.has = function (s, key) {
        return s.has(key);
    };
    return SetWrapper;
})();
exports.SetWrapper = SetWrapper;
Object.defineProperty(SetWrapper.createFromList, "parameters", { get: function () {
        return [[exports.List]];
    } });
Object.defineProperty(SetWrapper.has, "parameters", { get: function () {
        return [[exports.Set], []];
    } });
