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
var collection_1 = require("angular2/src/facade/collection");
var lang_1 = require("angular2/src/facade/lang");
exports.TOKEN_TYPE_CHARACTER = 1;
exports.TOKEN_TYPE_IDENTIFIER = 2;
exports.TOKEN_TYPE_KEYWORD = 3;
exports.TOKEN_TYPE_STRING = 4;
exports.TOKEN_TYPE_OPERATOR = 5;
exports.TOKEN_TYPE_NUMBER = 6;
var Lexer = (function () {
    function Lexer() {
    }
    Lexer.prototype.tokenize = function (text) {
        var scanner = new _Scanner(text);
        var tokens = [];
        var token = scanner.scanToken();
        while (token != null) {
            collection_1.ListWrapper.push(tokens, token);
            token = scanner.scanToken();
        }
        return tokens;
    };
    return Lexer;
})();
exports.Lexer = Lexer;
Object.defineProperty(Lexer, "annotations", { get: function () {
        return [new di_1.Injectable()];
    } });
Object.defineProperty(Lexer.prototype.tokenize, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
var Token = (function () {
    function Token(index, type, numValue, strValue) {
        this.index = index;
        this.type = type;
        this._numValue = numValue;
        this._strValue = strValue;
    }
    Token.prototype.isCharacter = function (code) {
        return (this.type == exports.TOKEN_TYPE_CHARACTER && this._numValue == code);
    };
    Token.prototype.isNumber = function () {
        return (this.type == exports.TOKEN_TYPE_NUMBER);
    };
    Token.prototype.isString = function () {
        return (this.type == exports.TOKEN_TYPE_STRING);
    };
    Token.prototype.isOperator = function (operater) {
        return (this.type == exports.TOKEN_TYPE_OPERATOR && this._strValue == operater);
    };
    Token.prototype.isIdentifier = function () {
        return (this.type == exports.TOKEN_TYPE_IDENTIFIER);
    };
    Token.prototype.isKeyword = function () {
        return (this.type == exports.TOKEN_TYPE_KEYWORD);
    };
    Token.prototype.isKeywordVar = function () {
        return (this.type == exports.TOKEN_TYPE_KEYWORD && this._strValue == "var");
    };
    Token.prototype.isKeywordNull = function () {
        return (this.type == exports.TOKEN_TYPE_KEYWORD && this._strValue == "null");
    };
    Token.prototype.isKeywordUndefined = function () {
        return (this.type == exports.TOKEN_TYPE_KEYWORD && this._strValue == "undefined");
    };
    Token.prototype.isKeywordTrue = function () {
        return (this.type == exports.TOKEN_TYPE_KEYWORD && this._strValue == "true");
    };
    Token.prototype.isKeywordFalse = function () {
        return (this.type == exports.TOKEN_TYPE_KEYWORD && this._strValue == "false");
    };
    Token.prototype.toNumber = function () {
        return (this.type == exports.TOKEN_TYPE_NUMBER) ? this._numValue : -1;
    };
    Token.prototype.toString = function () {
        var type = this.type;
        if (type >= exports.TOKEN_TYPE_CHARACTER && type <= exports.TOKEN_TYPE_STRING) {
            return this._strValue;
        }
        else if (type == exports.TOKEN_TYPE_NUMBER) {
            return this._numValue.toString();
        }
        else {
            return null;
        }
    };
    return Token;
})();
exports.Token = Token;
Object.defineProperty(Token, "parameters", { get: function () {
        return [[lang_1.int], [lang_1.int], [assert.type.number], [assert.type.string]];
    } });
Object.defineProperty(Token.prototype.isCharacter, "parameters", { get: function () {
        return [[lang_1.int]];
    } });
Object.defineProperty(Token.prototype.isOperator, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
function newCharacterToken(index, code) {
    return new Token(index, exports.TOKEN_TYPE_CHARACTER, code, lang_1.StringWrapper.fromCharCode(code));
}
Object.defineProperty(newCharacterToken, "parameters", { get: function () {
        return [[lang_1.int], [lang_1.int]];
    } });
function newIdentifierToken(index, text) {
    return new Token(index, exports.TOKEN_TYPE_IDENTIFIER, 0, text);
}
Object.defineProperty(newIdentifierToken, "parameters", { get: function () {
        return [[lang_1.int], [assert.type.string]];
    } });
function newKeywordToken(index, text) {
    return new Token(index, exports.TOKEN_TYPE_KEYWORD, 0, text);
}
Object.defineProperty(newKeywordToken, "parameters", { get: function () {
        return [[lang_1.int], [assert.type.string]];
    } });
function newOperatorToken(index, text) {
    return new Token(index, exports.TOKEN_TYPE_OPERATOR, 0, text);
}
Object.defineProperty(newOperatorToken, "parameters", { get: function () {
        return [[lang_1.int], [assert.type.string]];
    } });
function newStringToken(index, text) {
    return new Token(index, exports.TOKEN_TYPE_STRING, 0, text);
}
Object.defineProperty(newStringToken, "parameters", { get: function () {
        return [[lang_1.int], [assert.type.string]];
    } });
function newNumberToken(index, n) {
    return new Token(index, exports.TOKEN_TYPE_NUMBER, n, "");
}
Object.defineProperty(newNumberToken, "parameters", { get: function () {
        return [[lang_1.int], [assert.type.number]];
    } });
exports.EOF = new Token(-1, 0, 0, "");
exports.$EOF = 0;
exports.$TAB = 9;
exports.$LF = 10;
exports.$VTAB = 11;
exports.$FF = 12;
exports.$CR = 13;
exports.$SPACE = 32;
exports.$BANG = 33;
exports.$DQ = 34;
exports.$HASH = 35;
exports.$$ = 36;
exports.$PERCENT = 37;
exports.$AMPERSAND = 38;
exports.$SQ = 39;
exports.$LPAREN = 40;
exports.$RPAREN = 41;
exports.$STAR = 42;
exports.$PLUS = 43;
exports.$COMMA = 44;
exports.$MINUS = 45;
exports.$PERIOD = 46;
exports.$SLASH = 47;
exports.$COLON = 58;
exports.$SEMICOLON = 59;
exports.$LT = 60;
exports.$EQ = 61;
exports.$GT = 62;
exports.$QUESTION = 63;
var $0 = 48;
var $9 = 57;
var $A = 65, $B = 66, $C = 67, $D = 68, $E = 69, $F = 70, $G = 71, $H = 72, $I = 73, $J = 74, $K = 75, $L = 76, $M = 77, $N = 78, $O = 79, $P = 80, $Q = 81, $R = 82, $S = 83, $T = 84, $U = 85, $V = 86, $W = 87, $X = 88, $Y = 89, $Z = 90;
exports.$LBRACKET = 91;
exports.$BACKSLASH = 92;
exports.$RBRACKET = 93;
var $CARET = 94;
var $_ = 95;
var $a = 97, $b = 98, $c = 99, $d = 100, $e = 101, $f = 102, $g = 103, $h = 104, $i = 105, $j = 106, $k = 107, $l = 108, $m = 109, $n = 110, $o = 111, $p = 112, $q = 113, $r = 114, $s = 115, $t = 116, $u = 117, $v = 118, $w = 119, $x = 120, $y = 121, $z = 122;
exports.$LBRACE = 123;
exports.$BAR = 124;
exports.$RBRACE = 125;
var $TILDE = 126;
var $NBSP = 160;
var ScannerError = (function (_super) {
    __extends(ScannerError, _super);
    function ScannerError(message) {
        _super.call(this);
        this.message = message;
    }
    ScannerError.prototype.toString = function () {
        return this.message;
    };
    return ScannerError;
})(Error);
exports.ScannerError = ScannerError;
var _Scanner = (function () {
    function _Scanner(input) {
        this.input = input;
        this.length = input.length;
        this.peek = 0;
        this.index = -1;
        this.advance();
    }
    _Scanner.prototype.advance = function () {
        this.peek = ++this.index >= this.length ? exports.$EOF : lang_1.StringWrapper.charCodeAt(this.input, this.index);
    };
    _Scanner.prototype.scanToken = function () {
        var input = this.input, length = this.length, peek = this.peek, index = this.index;
        while (peek <= exports.$SPACE) {
            if (++index >= length) {
                peek = exports.$EOF;
                break;
            }
            else {
                peek = lang_1.StringWrapper.charCodeAt(input, index);
            }
        }
        this.peek = peek;
        this.index = index;
        if (index >= length) {
            return null;
        }
        if (isIdentifierStart(peek))
            return this.scanIdentifier();
        if (isDigit(peek))
            return this.scanNumber(index);
        var start = index;
        switch (peek) {
            case exports.$PERIOD:
                this.advance();
                return isDigit(this.peek) ? this.scanNumber(start) : newCharacterToken(start, exports.$PERIOD);
            case exports.$LPAREN:
            case exports.$RPAREN:
            case exports.$LBRACE:
            case exports.$RBRACE:
            case exports.$LBRACKET:
            case exports.$RBRACKET:
            case exports.$COMMA:
            case exports.$COLON:
            case exports.$SEMICOLON:
                return this.scanCharacter(start, peek);
            case exports.$SQ:
            case exports.$DQ:
                return this.scanString();
            case exports.$HASH:
                return this.scanOperator(start, lang_1.StringWrapper.fromCharCode(peek));
            case exports.$PLUS:
            case exports.$MINUS:
            case exports.$STAR:
            case exports.$SLASH:
            case exports.$PERCENT:
            case $CARET:
            case exports.$QUESTION:
                return this.scanOperator(start, lang_1.StringWrapper.fromCharCode(peek));
            case exports.$LT:
            case exports.$GT:
            case exports.$BANG:
            case exports.$EQ:
                return this.scanComplexOperator(start, exports.$EQ, lang_1.StringWrapper.fromCharCode(peek), '=');
            case exports.$AMPERSAND:
                return this.scanComplexOperator(start, exports.$AMPERSAND, '&', '&');
            case exports.$BAR:
                return this.scanComplexOperator(start, exports.$BAR, '|', '|');
            case $TILDE:
                return this.scanComplexOperator(start, exports.$SLASH, '~', '/');
            case $NBSP:
                while (isWhitespace(this.peek))
                    this.advance();
                return this.scanToken();
        }
        this.error("Unexpected character [" + lang_1.StringWrapper.fromCharCode(peek) + "]", 0);
        return null;
    };
    _Scanner.prototype.scanCharacter = function (start, code) {
        assert(this.peek == code);
        this.advance();
        return newCharacterToken(start, code);
    };
    _Scanner.prototype.scanOperator = function (start, str) {
        assert(this.peek == lang_1.StringWrapper.charCodeAt(str, 0));
        assert(collection_1.SetWrapper.has(OPERATORS, str));
        this.advance();
        return newOperatorToken(start, str);
    };
    _Scanner.prototype.scanComplexOperator = function (start, code, one, two) {
        assert(this.peek == lang_1.StringWrapper.charCodeAt(one, 0));
        this.advance();
        var str = one;
        if (this.peek == code) {
            this.advance();
            str += two;
        }
        assert(collection_1.SetWrapper.has(OPERATORS, str));
        return newOperatorToken(start, str);
    };
    _Scanner.prototype.scanIdentifier = function () {
        assert(isIdentifierStart(this.peek));
        var start = this.index;
        this.advance();
        while (isIdentifierPart(this.peek))
            this.advance();
        var str = this.input.substring(start, this.index);
        if (collection_1.SetWrapper.has(KEYWORDS, str)) {
            return newKeywordToken(start, str);
        }
        else {
            return newIdentifierToken(start, str);
        }
    };
    _Scanner.prototype.scanNumber = function (start) {
        assert(isDigit(this.peek));
        var simple = (this.index === start);
        this.advance();
        while (true) {
            if (isDigit(this.peek)) { }
            else if (this.peek == exports.$PERIOD) {
                simple = false;
            }
            else if (isExponentStart(this.peek)) {
                this.advance();
                if (isExponentSign(this.peek))
                    this.advance();
                if (!isDigit(this.peek))
                    this.error('Invalid exponent', -1);
                simple = false;
            }
            else {
                break;
            }
            this.advance();
        }
        var str = this.input.substring(start, this.index);
        var value = simple ? lang_1.NumberWrapper.parseIntAutoRadix(str) : lang_1.NumberWrapper.parseFloat(str);
        return newNumberToken(start, value);
    };
    _Scanner.prototype.scanString = function () {
        assert(this.peek == exports.$SQ || this.peek == exports.$DQ);
        var start = this.index;
        var quote = this.peek;
        this.advance();
        var buffer;
        var marker = this.index;
        var input = this.input;
        while (this.peek != quote) {
            if (this.peek == exports.$BACKSLASH) {
                if (buffer == null)
                    buffer = new lang_1.StringJoiner();
                buffer.add(input.substring(marker, this.index));
                this.advance();
                var unescapedCode;
                if (this.peek == $u) {
                    var hex = input.substring(this.index + 1, this.index + 5);
                    try {
                        unescapedCode = lang_1.NumberWrapper.parseInt(hex, 16);
                    }
                    catch (e) {
                        this.error("Invalid unicode escape [\\u" + hex + "]", 0);
                    }
                    for (var i = 0; i < 5; i++) {
                        this.advance();
                    }
                }
                else {
                    unescapedCode = unescape(this.peek);
                    this.advance();
                }
                buffer.add(lang_1.StringWrapper.fromCharCode(unescapedCode));
                marker = this.index;
            }
            else if (this.peek == exports.$EOF) {
                this.error('Unterminated quote', 0);
            }
            else {
                this.advance();
            }
        }
        var last = input.substring(marker, this.index);
        this.advance();
        var unescaped = last;
        if (buffer != null) {
            buffer.add(last);
            unescaped = buffer.toString();
        }
        return newStringToken(start, unescaped);
    };
    _Scanner.prototype.error = function (message, offset) {
        var position = this.index + offset;
        throw new ScannerError("Lexer Error: " + message + " at column " + position + " in expression [" + this.input + "]");
    };
    return _Scanner;
})();
Object.defineProperty(_Scanner, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(_Scanner.prototype.scanCharacter, "parameters", { get: function () {
        return [[lang_1.int], [lang_1.int]];
    } });
Object.defineProperty(_Scanner.prototype.scanOperator, "parameters", { get: function () {
        return [[lang_1.int], [assert.type.string]];
    } });
Object.defineProperty(_Scanner.prototype.scanComplexOperator, "parameters", { get: function () {
        return [[lang_1.int], [lang_1.int], [assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(_Scanner.prototype.scanNumber, "parameters", { get: function () {
        return [[lang_1.int]];
    } });
Object.defineProperty(_Scanner.prototype.error, "parameters", { get: function () {
        return [[assert.type.string], [lang_1.int]];
    } });
function isWhitespace(code) {
    return (code >= exports.$TAB && code <= exports.$SPACE) || (code == $NBSP);
}
Object.defineProperty(isWhitespace, "parameters", { get: function () {
        return [[lang_1.int]];
    } });
function isIdentifierStart(code) {
    return ($a <= code && code <= $z) || ($A <= code && code <= $Z) || (code == $_) || (code == exports.$$);
}
Object.defineProperty(isIdentifierStart, "parameters", { get: function () {
        return [[lang_1.int]];
    } });
function isIdentifierPart(code) {
    return ($a <= code && code <= $z) || ($A <= code && code <= $Z) || ($0 <= code && code <= $9) || (code == $_) || (code == exports.$$);
}
Object.defineProperty(isIdentifierPart, "parameters", { get: function () {
        return [[lang_1.int]];
    } });
function isDigit(code) {
    return $0 <= code && code <= $9;
}
Object.defineProperty(isDigit, "parameters", { get: function () {
        return [[lang_1.int]];
    } });
function isExponentStart(code) {
    return code == $e || code == $E;
}
Object.defineProperty(isExponentStart, "parameters", { get: function () {
        return [[lang_1.int]];
    } });
function isExponentSign(code) {
    return code == exports.$MINUS || code == exports.$PLUS;
}
Object.defineProperty(isExponentSign, "parameters", { get: function () {
        return [[lang_1.int]];
    } });
function unescape(code) {
    switch (code) {
        case $n:
            return exports.$LF;
        case $f:
            return exports.$FF;
        case $r:
            return exports.$CR;
        case $t:
            return exports.$TAB;
        case $v:
            return exports.$VTAB;
        default:
            return code;
    }
}
Object.defineProperty(unescape, "parameters", { get: function () {
        return [[lang_1.int]];
    } });
var OPERATORS = collection_1.SetWrapper.createFromList(['+', '-', '*', '/', '~/', '%', '^', '=', '==', '!=', '<', '>', '<=', '>=', '&&', '||', '&', '|', '!', '?', '#']);
var KEYWORDS = collection_1.SetWrapper.createFromList(['var', 'null', 'undefined', 'true', 'false']);
