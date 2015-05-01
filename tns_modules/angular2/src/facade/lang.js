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
var _global = typeof window === 'undefined' ? global : window;
exports.global = _global;
exports.Type = Function;
exports.Math = _global.Math;
exports.Date = _global.Date;
var assertionsEnabled_ = typeof assert !== 'undefined';
var int;
exports.int = int;
if (assertionsEnabled_) {
    _global.assert = assert;
    int = assert.define('int', function (value) {
        return typeof value === 'number' && value % 1 === 0;
    });
}
else {
    int = {};
    _global.assert = function () { };
}
var CONST = (function () {
    function CONST() {
    }
    return CONST;
})();
exports.CONST = CONST;
var ABSTRACT = (function () {
    function ABSTRACT() {
    }
    return ABSTRACT;
})();
exports.ABSTRACT = ABSTRACT;
var IMPLEMENTS = (function () {
    function IMPLEMENTS() {
    }
    return IMPLEMENTS;
})();
exports.IMPLEMENTS = IMPLEMENTS;
function isPresent(obj) {
    return obj !== undefined && obj !== null;
}
exports.isPresent = isPresent;
function isBlank(obj) {
    return obj === undefined || obj === null;
}
exports.isBlank = isBlank;
function isString(obj) {
    return typeof obj === "string";
}
exports.isString = isString;
function isFunction(obj) {
    return typeof obj === "function";
}
exports.isFunction = isFunction;
function stringify(token) {
    if (typeof token === 'string') {
        return token;
    }
    if (token === undefined || token === null) {
        return '' + token;
    }
    if (token.name) {
        return token.name;
    }
    return token.toString();
}
exports.stringify = stringify;
var StringWrapper = (function () {
    function StringWrapper() {
    }
    StringWrapper.fromCharCode = function (code) {
        return String.fromCharCode(code);
    };
    StringWrapper.charCodeAt = function (s, index) {
        return s.charCodeAt(index);
    };
    StringWrapper.split = function (s, regExp) {
        return s.split(regExp);
    };
    StringWrapper.equals = function (s, s2) {
        return s === s2;
    };
    StringWrapper.replace = function (s, from, replace) {
        return s.replace(from, replace);
    };
    StringWrapper.replaceAll = function (s, from, replace) {
        return s.replace(from, replace);
    };
    StringWrapper.startsWith = function (s, start) {
        return s.startsWith(start);
    };
    StringWrapper.substring = function (s, start, end) {
        if (end === void 0) { end = null; }
        return s.substring(start, end === null ? undefined : end);
    };
    StringWrapper.replaceAllMapped = function (s, from, cb) {
        return s.replace(from, function () {
            var matches = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                matches[_i - 0] = arguments[_i];
            }
            matches.splice(-2, 2);
            return cb(matches);
        });
    };
    StringWrapper.contains = function (s, substr) {
        return s.indexOf(substr) != -1;
    };
    return StringWrapper;
})();
exports.StringWrapper = StringWrapper;
Object.defineProperty(StringWrapper.fromCharCode, "parameters", { get: function () {
        return [[int]];
    } });
Object.defineProperty(StringWrapper.charCodeAt, "parameters", { get: function () {
        return [[assert.type.string], [int]];
    } });
Object.defineProperty(StringWrapper.split, "parameters", { get: function () {
        return [[assert.type.string], []];
    } });
Object.defineProperty(StringWrapper.equals, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(StringWrapper.replace, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(StringWrapper.replaceAll, "parameters", { get: function () {
        return [[assert.type.string], [exports.RegExp], [assert.type.string]];
    } });
Object.defineProperty(StringWrapper.startsWith, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(StringWrapper.substring, "parameters", { get: function () {
        return [[assert.type.string], [int], [int]];
    } });
Object.defineProperty(StringWrapper.replaceAllMapped, "parameters", { get: function () {
        return [[assert.type.string], [exports.RegExp], [Function]];
    } });
Object.defineProperty(StringWrapper.contains, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
var StringJoiner = (function () {
    function StringJoiner() {
        this.parts = [];
    }
    StringJoiner.prototype.add = function (part) {
        this.parts.push(part);
    };
    StringJoiner.prototype.toString = function () {
        return this.parts.join("");
    };
    return StringJoiner;
})();
exports.StringJoiner = StringJoiner;
Object.defineProperty(StringJoiner.prototype.add, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
var NumberParseError = (function (_super) {
    __extends(NumberParseError, _super);
    function NumberParseError(message) {
        _super.call(this);
        this.message = message;
    }
    NumberParseError.prototype.toString = function () {
        return this.message;
    };
    return NumberParseError;
})(Error);
exports.NumberParseError = NumberParseError;
var NumberWrapper = (function () {
    function NumberWrapper() {
    }
    NumberWrapper.toFixed = function (n, fractionDigits) {
        return n.toFixed(fractionDigits);
    };
    NumberWrapper.equal = function (a, b) {
        return a === b;
    };
    NumberWrapper.parseIntAutoRadix = function (text) {
        var result = parseInt(text);
        if (isNaN(result)) {
            throw new NumberParseError("Invalid integer literal when parsing " + text);
        }
        return result;
    };
    NumberWrapper.parseInt = function (text, radix) {
        if (radix == 10) {
            if (/^(\-|\+)?[0-9]+$/.test(text)) {
                return parseInt(text, radix);
            }
        }
        else if (radix == 16) {
            if (/^(\-|\+)?[0-9ABCDEFabcdef]+$/.test(text)) {
                return parseInt(text, radix);
            }
        }
        else {
            var result = parseInt(text, radix);
            if (!isNaN(result)) {
                return result;
            }
        }
        throw new NumberParseError("Invalid integer literal when parsing " + text + " in base " + radix);
    };
    NumberWrapper.parseFloat = function (text) {
        return parseFloat(text);
    };
    Object.defineProperty(NumberWrapper, "NaN", {
        get: function () {
            return NaN;
        },
        enumerable: true,
        configurable: true
    });
    NumberWrapper.isNaN = function (value) {
        return isNaN(value);
    };
    NumberWrapper.isInteger = function (value) {
        return Number.isInteger(value);
    };
    return NumberWrapper;
})();
exports.NumberWrapper = NumberWrapper;
Object.defineProperty(NumberWrapper.toFixed, "parameters", { get: function () {
        return [[assert.type.number], [int]];
    } });
Object.defineProperty(NumberWrapper.parseIntAutoRadix, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(NumberWrapper.parseInt, "parameters", { get: function () {
        return [[assert.type.string], [int]];
    } });
Object.defineProperty(NumberWrapper.parseFloat, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
exports.RegExp = _global.RegExp;
var RegExpWrapper = (function () {
    function RegExpWrapper() {
    }
    RegExpWrapper.create = function (regExpStr, flags) {
        if (flags === void 0) { flags = ''; }
        flags = flags.replace(/g/g, '');
        return new _global.RegExp(regExpStr, flags + 'g');
    };
    RegExpWrapper.firstMatch = function (regExp, input) {
        regExp.lastIndex = 0;
        return regExp.exec(input);
    };
    RegExpWrapper.matcher = function (regExp, input) {
        regExp.lastIndex = 0;
        return {
            re: regExp,
            input: input
        };
    };
    return RegExpWrapper;
})();
exports.RegExpWrapper = RegExpWrapper;
Object.defineProperty(RegExpWrapper.create, "parameters", { get: function () {
        return [[], [assert.type.string]];
    } });
var RegExpMatcherWrapper = (function () {
    function RegExpMatcherWrapper() {
    }
    RegExpMatcherWrapper.next = function (matcher) {
        return matcher.re.exec(matcher.input);
    };
    return RegExpMatcherWrapper;
})();
exports.RegExpMatcherWrapper = RegExpMatcherWrapper;
var FunctionWrapper = (function () {
    function FunctionWrapper() {
    }
    FunctionWrapper.apply = function (fn, posArgs) {
        return fn.apply(null, posArgs);
    };
    return FunctionWrapper;
})();
exports.FunctionWrapper = FunctionWrapper;
Object.defineProperty(FunctionWrapper.apply, "parameters", { get: function () {
        return [[Function], []];
    } });
exports.BaseException = Error;
function looseIdentical(a, b) {
    return a === b || typeof a === "number" && typeof b === "number" && isNaN(a) && isNaN(b);
}
exports.looseIdentical = looseIdentical;
function getMapKey(value) {
    return value;
}
exports.getMapKey = getMapKey;
function normalizeBlank(obj) {
    return isBlank(obj) ? null : obj;
}
exports.normalizeBlank = normalizeBlank;
function isJsObject(o) {
    return o !== null && (typeof o === "function" || typeof o === "object");
}
exports.isJsObject = isJsObject;
function assertionsEnabled() {
    return assertionsEnabled_;
}
exports.assertionsEnabled = assertionsEnabled;
function print(obj) {
    if (obj instanceof Error) {
        console.log(obj.stack);
    }
    else {
        console.log(obj);
    }
}
exports.print = print;
exports.Json = _global.JSON;
var DateWrapper = (function () {
    function DateWrapper() {
    }
    DateWrapper.fromMillis = function (ms) {
        return new exports.Date(ms);
    };
    DateWrapper.toMillis = function (date) {
        return date.getTime();
    };
    DateWrapper.now = function () {
        return new exports.Date();
    };
    DateWrapper.toJson = function (date) {
        return date.toJSON();
    };
    return DateWrapper;
})();
exports.DateWrapper = DateWrapper;
Object.defineProperty(DateWrapper.toMillis, "parameters", { get: function () {
        return [[exports.Date]];
    } });
