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
var test_lib_1 = require('angular2/test_lib');
var lang_1 = require('angular2/src/facade/lang');
var reflection_1 = require('angular2/src/reflection/reflection');
var collection_1 = require('angular2/src/facade/collection');
var parser_1 = require('angular2/src/change_detection/parser/parser');
var lexer_1 = require('angular2/src/change_detection/parser/lexer');
var locals_1 = require('angular2/src/change_detection/parser/locals');
var ast_1 = require('angular2/src/change_detection/parser/ast');
var TestData = (function () {
    function TestData(a, b, fnReturnValue) {
        this.a = a;
        this.b = b;
        this.fnReturnValue = fnReturnValue;
    }
    TestData.prototype.fn = function () {
        return this.fnReturnValue;
    };
    TestData.prototype.add = function (a, b) {
        return a + b;
    };
    return TestData;
})();
function main() {
    function td(a, b, fnReturnValue) {
        if (a === void 0) { a = 0; }
        if (b === void 0) { b = 0; }
        if (fnReturnValue === void 0) { fnReturnValue = "constant"; }
        return new TestData(a, b, fnReturnValue);
    }
    function createParser() {
        return new parser_1.Parser(new lexer_1.Lexer(), reflection_1.reflector);
    }
    function parseAction(text, location) {
        if (location === void 0) { location = null; }
        return createParser().parseAction(text, location);
    }
    function parseBinding(text, location) {
        if (location === void 0) { location = null; }
        return createParser().parseBinding(text, location);
    }
    function parseTemplateBindings(text, location) {
        if (location === void 0) { location = null; }
        return createParser().parseTemplateBindings(text, location);
    }
    function parseInterpolation(text, location) {
        if (location === void 0) { location = null; }
        return createParser().parseInterpolation(text, location);
    }
    function addPipes(ast, pipes) {
        return createParser().addPipes(ast, pipes);
    }
    function emptyLocals() {
        return new locals_1.Locals(null, collection_1.MapWrapper.create());
    }
    function expectEval(text, passedInContext, passedInLocals) {
        if (passedInContext === void 0) { passedInContext = null; }
        if (passedInLocals === void 0) { passedInLocals = null; }
        var c = lang_1.isBlank(passedInContext) ? td() : passedInContext;
        var l = lang_1.isBlank(passedInLocals) ? emptyLocals() : passedInLocals;
        return test_lib_1.expect(parseAction(text).eval(c, l));
    }
    function expectEvalError(text, passedInContext, passedInLocals) {
        if (passedInContext === void 0) { passedInContext = null; }
        if (passedInLocals === void 0) { passedInLocals = null; }
        var c = lang_1.isBlank(passedInContext) ? td() : passedInContext;
        var l = lang_1.isBlank(passedInLocals) ? emptyLocals() : passedInLocals;
        return test_lib_1.expect(function () { return parseAction(text).eval(c, l); });
    }
    function evalAsts(asts, passedInContext) {
        if (passedInContext === void 0) { passedInContext = null; }
        var c = lang_1.isBlank(passedInContext) ? td() : passedInContext;
        var res = [];
        for (var i = 0; i < asts.length; i++) {
            collection_1.ListWrapper.push(res, asts[i].eval(c, emptyLocals()));
        }
        return res;
    }
    test_lib_1.describe("parser", function () {
        test_lib_1.describe("parseAction", function () {
            test_lib_1.describe("basic expressions", function () {
                test_lib_1.it('should parse numerical expressions', function () {
                    expectEval("1").toEqual(1);
                });
                test_lib_1.it('should parse strings', function () {
                    expectEval("'1'").toEqual('1');
                    expectEval('"1"').toEqual('1');
                });
                test_lib_1.it('should parse null', function () {
                    expectEval("null").toBe(null);
                });
                test_lib_1.it('should parse unary - expressions', function () {
                    expectEval("-1").toEqual(-1);
                    expectEval("+1").toEqual(1);
                });
                test_lib_1.it('should parse unary ! expressions', function () {
                    expectEval("!true").toEqual(!true);
                    expectEval("!!true").toEqual(!!true);
                });
                test_lib_1.it('should parse multiplicative expressions', function () {
                    expectEval("3*4/2%5").toEqual(3 * 4 / 2 % 5);
                });
                test_lib_1.it('should parse additive expressions', function () {
                    expectEval("3+6-2").toEqual(3 + 6 - 2);
                });
                test_lib_1.it('should parse relational expressions', function () {
                    expectEval("2<3").toEqual(2 < 3);
                    expectEval("2>3").toEqual(2 > 3);
                    expectEval("2<=2").toEqual(2 <= 2);
                    expectEval("2>=2").toEqual(2 >= 2);
                });
                test_lib_1.it('should parse equality expressions', function () {
                    expectEval("2==3").toEqual(2 == 3);
                    expectEval("2!=3").toEqual(2 != 3);
                });
                test_lib_1.it('should parse logicalAND expressions', function () {
                    expectEval("true&&true").toEqual(true && true);
                    expectEval("true&&false").toEqual(true && false);
                });
                test_lib_1.it('should parse logicalOR expressions', function () {
                    expectEval("false||true").toEqual(false || true);
                    expectEval("false||false").toEqual(false || false);
                });
                test_lib_1.it('should short-circuit AND operator', function () {
                    expectEval('false && a()', td(function () {
                        throw "BOOM";
                    })).toBe(false);
                });
                test_lib_1.it('should short-circuit OR operator', function () {
                    expectEval('true || a()', td(function () {
                        throw "BOOM";
                    })).toBe(true);
                });
                test_lib_1.it('should evaluate grouped expressions', function () {
                    expectEval("(1+2)*3").toEqual((1 + 2) * 3);
                });
                test_lib_1.it('should parse an empty string', function () {
                    expectEval('').toBeNull();
                });
            });
            test_lib_1.describe("literals", function () {
                test_lib_1.it('should evaluate array', function () {
                    expectEval("[1][0]").toEqual(1);
                    expectEval("[[1]][0][0]").toEqual(1);
                    expectEval("[]").toEqual([]);
                    expectEval("[].length").toEqual(0);
                    expectEval("[1, 2].length").toEqual(2);
                });
                test_lib_1.it('should evaluate map', function () {
                    expectEval("{}").toEqual({});
                    expectEval("{a:'b'}['a']").toEqual('b');
                    expectEval("{'a':'b'}['a']").toEqual('b');
                    expectEval("{\"a\":'b'}['a']").toEqual('b');
                    expectEval("{\"a\":'b'}['a']").toEqual("b");
                    expectEval("{}['a']").not.toBeDefined();
                    expectEval("{\"a\":'b'}['invalid']").not.toBeDefined();
                });
                test_lib_1.it('should only allow identifier, string, or keyword as map key', function () {
                    expectEvalError('{(:0}').toThrowError(new RegExp('expected identifier, keyword, or string'));
                    expectEvalError('{1234:0}').toThrowError(new RegExp('expected identifier, keyword, or string'));
                });
            });
            test_lib_1.describe("member access", function () {
                test_lib_1.it("should parse field access", function () {
                    expectEval("a", td(999)).toEqual(999);
                    expectEval("a.a", td(td(999))).toEqual(999);
                });
                test_lib_1.it('should throw when accessing a field on null', function () {
                    expectEvalError("a.a.a").toThrowError();
                });
                test_lib_1.it('should only allow identifier or keyword as member names', function () {
                    expectEvalError('x.(').toThrowError(new RegExp('identifier or keyword'));
                    expectEvalError('x. 1234').toThrowError(new RegExp('identifier or keyword'));
                    expectEvalError('x."foo"').toThrowError(new RegExp('identifier or keyword'));
                });
                test_lib_1.it("should read a field from Locals", function () {
                    var locals = new locals_1.Locals(null, collection_1.MapWrapper.createFromPairs([["key", "value"]]));
                    expectEval("key", null, locals).toEqual("value");
                });
                test_lib_1.it("should handle nested Locals", function () {
                    var nested = new locals_1.Locals(null, collection_1.MapWrapper.createFromPairs([["key", "value"]]));
                    var locals = new locals_1.Locals(nested, collection_1.MapWrapper.create());
                    expectEval("key", null, locals).toEqual("value");
                });
                test_lib_1.it("should fall back to a regular field read when Locals " + "does not have the requested field", function () {
                    var locals = new locals_1.Locals(null, collection_1.MapWrapper.create());
                    expectEval("a", td(999), locals).toEqual(999);
                });
            });
            test_lib_1.describe("method calls", function () {
                test_lib_1.it("should evaluate method calls", function () {
                    expectEval("fn()", td(0, 0, "constant")).toEqual("constant");
                    expectEval("add(1,2)").toEqual(3);
                    expectEval("a.add(1,2)", td(td())).toEqual(3);
                    expectEval("fn().add(1,2)", td(0, 0, td())).toEqual(3);
                });
                test_lib_1.it('should throw when more than 10 arguments', function () {
                    expectEvalError("fn(1,2,3,4,5,6,7,8,9,10,11)").toThrowError(new RegExp('more than'));
                });
                test_lib_1.it('should throw when no method', function () {
                    expectEvalError("blah()").toThrowError();
                });
                test_lib_1.it('should evaluate a method from Locals', function () {
                    var locals = new locals_1.Locals(null, collection_1.MapWrapper.createFromPairs([['fn', function () { return 'child'; }]]));
                    expectEval("fn()", td(0, 0, 'parent'), locals).toEqual('child');
                });
                test_lib_1.it('should fall back to the parent context when Locals does not ' + 'have the requested method', function () {
                    var locals = new locals_1.Locals(null, collection_1.MapWrapper.create());
                    expectEval("fn()", td(0, 0, 'parent'), locals).toEqual('parent');
                });
            });
            test_lib_1.describe("functional calls", function () {
                test_lib_1.it("should evaluate function calls", function () {
                    expectEval("fn()(1,2)", td(0, 0, function (a, b) { return a + b; })).toEqual(3);
                });
                test_lib_1.it('should throw on non-function function calls', function () {
                    expectEvalError("4()").toThrowError(new RegExp('4 is not a function'));
                });
                test_lib_1.it('should parse functions for object indices', function () {
                    expectEval('a[b()]()', td([function () { return 6; }], function () { return 0; })).toEqual(6);
                });
            });
            test_lib_1.describe("conditional", function () {
                test_lib_1.it('should parse ternary/conditional expressions', function () {
                    expectEval("7==3+4?10:20").toEqual(10);
                    expectEval("false?10:20").toEqual(20);
                });
                test_lib_1.it('should throw on incorrect ternary operator syntax', function () {
                    expectEvalError("true?1").toThrowError(new RegExp('Parser Error: Conditional expression true\\?1 requires all 3 expressions'));
                });
            });
            test_lib_1.describe("assignment", function () {
                test_lib_1.it("should support field assignments", function () {
                    var context = td();
                    expectEval("a=12", context).toEqual(12);
                    test_lib_1.expect(context.a).toEqual(12);
                });
                test_lib_1.it("should support nested field assignments", function () {
                    var context = td(td(td()));
                    expectEval("a.a.a=123;", context).toEqual(123);
                    test_lib_1.expect(context.a.a.a).toEqual(123);
                });
                test_lib_1.it("should support multiple assignments", function () {
                    var context = td();
                    expectEval("a=123; b=234", context).toEqual(234);
                    test_lib_1.expect(context.a).toEqual(123);
                    test_lib_1.expect(context.b).toEqual(234);
                });
                test_lib_1.it("should support array updates", function () {
                    var context = td([100]);
                    expectEval('a[0] = 200', context).toEqual(200);
                    test_lib_1.expect(context.a[0]).toEqual(200);
                });
                test_lib_1.it("should support map updates", function () {
                    var context = td({ "key": 100 });
                    expectEval('a["key"] = 200', context).toEqual(200);
                    test_lib_1.expect(context.a["key"]).toEqual(200);
                });
                test_lib_1.it("should support array/map updates", function () {
                    var context = td([{ "key": 100 }]);
                    expectEval('a[0]["key"] = 200', context).toEqual(200);
                    test_lib_1.expect(context.a[0]["key"]).toEqual(200);
                });
                test_lib_1.it('should allow assignment after array dereference', function () {
                    var context = td([td()]);
                    expectEval('a[0].a = 200', context).toEqual(200);
                    test_lib_1.expect(context.a[0].a).toEqual(200);
                });
                test_lib_1.it('should throw on bad assignment', function () {
                    expectEvalError("5=4").toThrowError(new RegExp("Expression 5 is not assignable"));
                });
                test_lib_1.it('should reassign when no variable binding with the given name', function () {
                    var context = td();
                    var locals = new locals_1.Locals(null, collection_1.MapWrapper.create());
                    expectEval('a = 200', context, locals).toEqual(200);
                    test_lib_1.expect(context.a).toEqual(200);
                });
                test_lib_1.it('should throw when reassigning a variable binding', function () {
                    var locals = new locals_1.Locals(null, collection_1.MapWrapper.createFromPairs([["key", "value"]]));
                    expectEvalError('key = 200', null, locals).toThrowError(new RegExp("Cannot reassign a variable binding"));
                });
            });
            test_lib_1.describe("general error handling", function () {
                test_lib_1.it("should throw on an unexpected token", function () {
                    expectEvalError("[1,2] trac").toThrowError(new RegExp('Unexpected token \'trac\''));
                });
                test_lib_1.it('should throw a reasonable error for unconsumed tokens', function () {
                    expectEvalError(")").toThrowError(new RegExp("Unexpected token \\) at column 1 in \\[\\)\\]"));
                });
                test_lib_1.it('should throw on missing expected token', function () {
                    expectEvalError("a(b").toThrowError(new RegExp("Missing expected \\) at the end of the expression \\[a\\(b\\]"));
                });
            });
            test_lib_1.it("should error when using pipes", function () {
                expectEvalError('x|blah').toThrowError(new RegExp('Cannot have a pipe'));
            });
            test_lib_1.it('should pass exceptions', function () {
                test_lib_1.expect(function () {
                    parseAction('a()').eval(td(function () {
                        throw new lang_1.BaseException("boo to you");
                    }), emptyLocals());
                }).toThrowError('boo to you');
            });
            test_lib_1.describe("multiple statements", function () {
                test_lib_1.it("should return the last non-blank value", function () {
                    expectEval("a=1;b=3;a+b").toEqual(4);
                    expectEval("1;;").toEqual(1);
                });
            });
            test_lib_1.it('should store the source in the result', function () {
                test_lib_1.expect(parseAction('someExpr').source).toBe('someExpr');
            });
            test_lib_1.it('should store the passed-in location', function () {
                test_lib_1.expect(parseAction('someExpr', 'location').location).toBe('location');
            });
        });
        test_lib_1.describe("parseBinding", function () {
            test_lib_1.describe("pipes", function () {
                test_lib_1.it("should parse pipes", function () {
                    var exp = parseBinding("'Foo'|uppercase").ast;
                    test_lib_1.expect(exp).toBeAnInstanceOf(ast_1.Pipe);
                    test_lib_1.expect(exp.name).toEqual("uppercase");
                });
                test_lib_1.it("should parse pipes with args", function () {
                    var exp = parseBinding("1|increment:2").ast;
                    test_lib_1.expect(exp).toBeAnInstanceOf(ast_1.Pipe);
                    test_lib_1.expect(exp.name).toEqual("increment");
                    test_lib_1.expect(exp.args[0]).toBeAnInstanceOf(ast_1.LiteralPrimitive);
                });
                test_lib_1.it('should only allow identifier or keyword as formatter names', function () {
                    test_lib_1.expect(function () { return parseBinding('"Foo"|('); }).toThrowError(new RegExp('identifier or keyword'));
                    test_lib_1.expect(function () { return parseBinding('"Foo"|1234'); }).toThrowError(new RegExp('identifier or keyword'));
                    test_lib_1.expect(function () { return parseBinding('"Foo"|"uppercase"'); }).toThrowError(new RegExp('identifier or keyword'));
                });
            });
            test_lib_1.it('should store the source in the result', function () {
                test_lib_1.expect(parseBinding('someExpr').source).toBe('someExpr');
            });
            test_lib_1.it('should store the passed-in location', function () {
                test_lib_1.expect(parseBinding('someExpr', 'location').location).toBe('location');
            });
            test_lib_1.it('should throw on chain expressions', function () {
                test_lib_1.expect(function () { return parseBinding("1;2"); }).toThrowError(new RegExp("contain chained expression"));
            });
            test_lib_1.it('should throw on assignmnt', function () {
                test_lib_1.expect(function () { return parseBinding("1;2"); }).toThrowError(new RegExp("contain chained expression"));
            });
        });
        test_lib_1.describe('parseTemplateBindings', function () {
            function keys(templateBindings) {
                return collection_1.ListWrapper.map(templateBindings, function (binding) { return binding.key; });
            }
            function keyValues(templateBindings) {
                return collection_1.ListWrapper.map(templateBindings, function (binding) {
                    if (binding.keyIsVar) {
                        return '#' + binding.key + (lang_1.isBlank(binding.name) ? '' : '=' + binding.name);
                    }
                    else {
                        return binding.key + (lang_1.isBlank(binding.expression) ? '' : "=" + binding.expression);
                    }
                });
            }
            function exprSources(templateBindings) {
                return collection_1.ListWrapper.map(templateBindings, function (binding) { return lang_1.isPresent(binding.expression) ? binding.expression.source : null; });
            }
            function exprAsts(templateBindings) {
                return collection_1.ListWrapper.map(templateBindings, function (binding) { return lang_1.isPresent(binding.expression) ? binding.expression : null; });
            }
            test_lib_1.it('should parse an empty string', function () {
                var bindings = parseTemplateBindings('');
                test_lib_1.expect(bindings).toEqual([]);
            });
            test_lib_1.it('should parse a string without a value', function () {
                var bindings = parseTemplateBindings('a');
                test_lib_1.expect(keys(bindings)).toEqual(['a']);
            });
            test_lib_1.it('should only allow identifier, string, or keyword including dashes as keys', function () {
                var bindings = parseTemplateBindings("a:'b'");
                test_lib_1.expect(keys(bindings)).toEqual(['a']);
                bindings = parseTemplateBindings("'a':'b'");
                test_lib_1.expect(keys(bindings)).toEqual(['a']);
                bindings = parseTemplateBindings("\"a\":'b'");
                test_lib_1.expect(keys(bindings)).toEqual(['a']);
                bindings = parseTemplateBindings("a-b:'c'");
                test_lib_1.expect(keys(bindings)).toEqual(['a-b']);
                test_lib_1.expect(function () {
                    parseTemplateBindings('(:0');
                }).toThrowError(new RegExp('expected identifier, keyword, or string'));
                test_lib_1.expect(function () {
                    parseTemplateBindings('1234:0');
                }).toThrowError(new RegExp('expected identifier, keyword, or string'));
            });
            test_lib_1.it('should detect expressions as value', function () {
                var bindings = parseTemplateBindings("a:b");
                test_lib_1.expect(exprSources(bindings)).toEqual(['b']);
                test_lib_1.expect(evalAsts(exprAsts(bindings), td(0, 23))).toEqual([23]);
                bindings = parseTemplateBindings("a:1+1");
                test_lib_1.expect(exprSources(bindings)).toEqual(['1+1']);
                test_lib_1.expect(evalAsts(exprAsts(bindings))).toEqual([2]);
            });
            test_lib_1.it('should detect names as value', function () {
                var bindings = parseTemplateBindings("a:#b");
                test_lib_1.expect(keyValues(bindings)).toEqual(['a', '#b']);
            });
            test_lib_1.it('should allow space and colon as separators', function () {
                var bindings = parseTemplateBindings("a:b");
                test_lib_1.expect(keys(bindings)).toEqual(['a']);
                test_lib_1.expect(exprSources(bindings)).toEqual(['b']);
                bindings = parseTemplateBindings("a b");
                test_lib_1.expect(keys(bindings)).toEqual(['a']);
                test_lib_1.expect(exprSources(bindings)).toEqual(['b']);
            });
            test_lib_1.it('should allow multiple pairs', function () {
                var bindings = parseTemplateBindings("a 1 b 2");
                test_lib_1.expect(keys(bindings)).toEqual(['a', 'b']);
                test_lib_1.expect(exprSources(bindings)).toEqual(['1 ', '2']);
            });
            test_lib_1.it('should store the sources in the result', function () {
                var bindings = parseTemplateBindings("a 1,b 2");
                test_lib_1.expect(bindings[0].expression.source).toEqual('1');
                test_lib_1.expect(bindings[1].expression.source).toEqual('2');
            });
            test_lib_1.it('should store the passed-in location', function () {
                var bindings = parseTemplateBindings("a 1,b 2", 'location');
                test_lib_1.expect(bindings[0].expression.location).toEqual('location');
            });
            test_lib_1.it('should support var/# notation', function () {
                var bindings = parseTemplateBindings("var i");
                test_lib_1.expect(keyValues(bindings)).toEqual(['#i']);
                bindings = parseTemplateBindings("#i");
                test_lib_1.expect(keyValues(bindings)).toEqual(['#i']);
                bindings = parseTemplateBindings("var i-a = k-a");
                test_lib_1.expect(keyValues(bindings)).toEqual(['#i-a=k-a']);
                bindings = parseTemplateBindings("keyword var item; var i = k");
                test_lib_1.expect(keyValues(bindings)).toEqual(['keyword', '#item=\$implicit', '#i=k']);
                bindings = parseTemplateBindings("keyword: #item; #i = k");
                test_lib_1.expect(keyValues(bindings)).toEqual(['keyword', '#item=\$implicit', '#i=k']);
                bindings = parseTemplateBindings("directive: var item in expr; var a = b", 'location');
                test_lib_1.expect(keyValues(bindings)).toEqual(['directive', '#item=\$implicit', 'in=expr in location', '#a=b']);
            });
            test_lib_1.it('should parse pipes', function () {
                var bindings = parseTemplateBindings('key value|pipe');
                var ast = bindings[0].expression.ast;
                test_lib_1.expect(ast).toBeAnInstanceOf(ast_1.Pipe);
            });
        });
        test_lib_1.describe('parseInterpolation', function () {
            test_lib_1.it('should return null if no interpolation', function () {
                test_lib_1.expect(parseInterpolation('nothing')).toBe(null);
            });
            test_lib_1.it('should parse no prefix/suffix interpolation', function () {
                var ast = parseInterpolation('{{a}}').ast;
                test_lib_1.expect(ast.strings).toEqual(['', '']);
                test_lib_1.expect(ast.expressions.length).toEqual(1);
                test_lib_1.expect(ast.expressions[0].name).toEqual('a');
            });
            test_lib_1.it('should parse prefix/suffix with multiple interpolation', function () {
                var ast = parseInterpolation('before{{a}}middle{{b}}after').ast;
                test_lib_1.expect(ast.strings).toEqual(['before', 'middle', 'after']);
                test_lib_1.expect(ast.expressions.length).toEqual(2);
                test_lib_1.expect(ast.expressions[0].name).toEqual('a');
                test_lib_1.expect(ast.expressions[1].name).toEqual('b');
            });
        });
        test_lib_1.describe('addPipes', function () {
            test_lib_1.it('should return the given ast whe the list of pipes is empty', function () {
                var ast = parseBinding("1 + 1", "Location");
                var transformedAst = addPipes(ast, []);
                test_lib_1.expect(transformedAst).toBe(ast);
            });
            test_lib_1.it('should append pipe ast nodes', function () {
                var ast = parseBinding("1 + 1", "Location");
                var transformedAst = addPipes(ast, ['one', 'two']);
                test_lib_1.expect(transformedAst.ast.name).toEqual("two");
                test_lib_1.expect(transformedAst.ast.exp.name).toEqual("one");
                test_lib_1.expect(transformedAst.ast.exp.exp.operation).toEqual("+");
            });
            test_lib_1.it('should preserve location and source', function () {
                var ast = parseBinding("1 + 1", "Location");
                var transformedAst = addPipes(ast, ['one', 'two']);
                test_lib_1.expect(transformedAst.source).toEqual("1 + 1");
                test_lib_1.expect(transformedAst.location).toEqual("Location");
            });
        });
        test_lib_1.describe('wrapLiteralPrimitive', function () {
            test_lib_1.it('should wrap a literal primitive', function () {
                test_lib_1.expect(createParser().wrapLiteralPrimitive("foo", null).eval(null, emptyLocals())).toEqual("foo");
            });
        });
    });
}
exports.main = main;
