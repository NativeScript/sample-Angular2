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
var test_lib_1 = require('angular2/test_lib');
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var parser_1 = require('angular2/src/change_detection/parser/parser');
var lexer_1 = require('angular2/src/change_detection/parser/lexer');
var locals_1 = require('angular2/src/change_detection/parser/locals');
var change_detection_1 = require('angular2/change_detection');
var proto_change_detector_1 = require('angular2/src/change_detection/proto_change_detector');
function main() {
    test_lib_1.describe("change detection", function () {
        collection_1.StringMapWrapper.forEach({
            "dynamic": function (registry, strategy) {
                if (registry === void 0) { registry = null; }
                if (strategy === void 0) { strategy = null; }
                return new proto_change_detector_1.DynamicProtoChangeDetector(registry, strategy);
            },
            "JIT": function (registry, strategy) {
                if (registry === void 0) { registry = null; }
                if (strategy === void 0) { strategy = null; }
                return new proto_change_detector_1.JitProtoChangeDetector(registry, strategy);
            }
        }, function (createProtoChangeDetector, name) {
            if (name == "JIT" && test_lib_1.IS_DARTIUM)
                return;
            function ast(exp, location) {
                if (location === void 0) { location = 'location'; }
                var parser = new parser_1.Parser(new lexer_1.Lexer());
                return parser.parseBinding(exp, location);
            }
            Object.defineProperty(ast, "parameters", { get: function () {
                    return [[assert.type.string], [assert.type.string]];
                } });
            function convertLocalsToVariableBindings(locals) {
                var variableBindings = [];
                var loc = locals;
                while (lang_1.isPresent(loc)) {
                    collection_1.MapWrapper.forEach(loc.current, function (v, k) { return collection_1.ListWrapper.push(variableBindings, k); });
                    loc = loc.parent;
                }
                return variableBindings;
            }
            function createChangeDetector(memo, exp, context, locals, registry) {
                if (context === void 0) { context = null; }
                if (locals === void 0) { locals = null; }
                if (registry === void 0) { registry = null; }
                var pcd = createProtoChangeDetector(registry);
                var dispatcher = new TestDispatcher();
                var variableBindings = convertLocalsToVariableBindings(locals);
                var records = [new change_detection_1.BindingRecord(ast(exp), memo, new FakeDirectiveMemento(memo, false))];
                var cd = pcd.instantiate(dispatcher, records, variableBindings, []);
                cd.hydrate(context, locals);
                return {
                    "changeDetector": cd,
                    "dispatcher": dispatcher
                };
            }
            Object.defineProperty(createChangeDetector, "parameters", { get: function () {
                    return [[assert.type.string], [assert.type.string], [], [], []];
                } });
            function executeWatch(memo, exp, context, locals) {
                if (context === void 0) { context = null; }
                if (locals === void 0) { locals = null; }
                var res = createChangeDetector(memo, exp, context, locals);
                res["changeDetector"].detectChanges();
                return res["dispatcher"].log;
            }
            Object.defineProperty(executeWatch, "parameters", { get: function () {
                    return [[assert.type.string], [assert.type.string], [], []];
                } });
            function instantiate(protoChangeDetector, dispatcher, bindings) {
                return protoChangeDetector.instantiate(dispatcher, bindings, null, []);
            }
            test_lib_1.describe(name + " change detection", function () {
                var dispatcher;
                test_lib_1.beforeEach(function () {
                    dispatcher = new TestDispatcher();
                });
                test_lib_1.it('should do simple watching', function () {
                    var person = new Person("misko");
                    var c = createChangeDetector('name', 'name', person);
                    var cd = c["changeDetector"];
                    var dispatcher = c["dispatcher"];
                    cd.detectChanges();
                    test_lib_1.expect(dispatcher.log).toEqual(['name=misko']);
                    dispatcher.clear();
                    cd.detectChanges();
                    test_lib_1.expect(dispatcher.log).toEqual([]);
                    dispatcher.clear();
                    person.name = "Misko";
                    cd.detectChanges();
                    test_lib_1.expect(dispatcher.log).toEqual(['name=Misko']);
                });
                test_lib_1.it('should report all changes on the first run including uninitialized values', function () {
                    test_lib_1.expect(executeWatch('value', 'value', new Uninitialized())).toEqual(['value=null']);
                });
                test_lib_1.it('should report all changes on the first run including null values', function () {
                    var td = new TestData(null);
                    test_lib_1.expect(executeWatch('a', 'a', td)).toEqual(['a=null']);
                });
                test_lib_1.it("should support literals", function () {
                    test_lib_1.expect(executeWatch('const', '10')).toEqual(['const=10']);
                    test_lib_1.expect(executeWatch('const', '"str"')).toEqual(['const=str']);
                    test_lib_1.expect(executeWatch('const', '"a\n\nb"')).toEqual(['const=a\n\nb']);
                });
                test_lib_1.it('simple chained property access', function () {
                    var address = new Address('Grenoble');
                    var person = new Person('Victor', address);
                    test_lib_1.expect(executeWatch('address.city', 'address.city', person)).toEqual(['address.city=Grenoble']);
                });
                test_lib_1.it("should support method calls", function () {
                    var person = new Person('Victor');
                    test_lib_1.expect(executeWatch('m', 'sayHi("Jim")', person)).toEqual(['m=Hi, Jim']);
                });
                test_lib_1.it("should support function calls", function () {
                    var td = new TestData(function () { return function (a) { return a; }; });
                    test_lib_1.expect(executeWatch('value', 'a()(99)', td)).toEqual(['value=99']);
                });
                test_lib_1.it("should support chained method calls", function () {
                    var person = new Person('Victor');
                    var td = new TestData(person);
                    test_lib_1.expect(executeWatch('m', 'a.sayHi("Jim")', td)).toEqual(['m=Hi, Jim']);
                });
                test_lib_1.it("should support literal array", function () {
                    var c = createChangeDetector('array', '[1,2]');
                    c["changeDetector"].detectChanges();
                    test_lib_1.expect(c["dispatcher"].loggedValues).toEqual([[1, 2]]);
                    c = createChangeDetector('array', '[1,a]', new TestData(2));
                    c["changeDetector"].detectChanges();
                    test_lib_1.expect(c["dispatcher"].loggedValues).toEqual([[1, 2]]);
                });
                test_lib_1.it("should support literal maps", function () {
                    var c = createChangeDetector('map', '{z:1}');
                    c["changeDetector"].detectChanges();
                    test_lib_1.expect(c["dispatcher"].loggedValues[0]['z']).toEqual(1);
                    c = createChangeDetector('map', '{z:a}', new TestData(1));
                    c["changeDetector"].detectChanges();
                    test_lib_1.expect(c["dispatcher"].loggedValues[0]['z']).toEqual(1);
                });
                test_lib_1.it("should support binary operations", function () {
                    test_lib_1.expect(executeWatch('exp', '10 + 2')).toEqual(['exp=12']);
                    test_lib_1.expect(executeWatch('exp', '10 - 2')).toEqual(['exp=8']);
                    test_lib_1.expect(executeWatch('exp', '10 * 2')).toEqual(['exp=20']);
                    test_lib_1.expect(executeWatch('exp', '10 / 2')).toEqual([("exp=" + 5.0)]);
                    test_lib_1.expect(executeWatch('exp', '11 % 2')).toEqual(['exp=1']);
                    test_lib_1.expect(executeWatch('exp', '1 == 1')).toEqual(['exp=true']);
                    test_lib_1.expect(executeWatch('exp', '1 != 1')).toEqual(['exp=false']);
                    test_lib_1.expect(executeWatch('exp', '1 < 2')).toEqual(['exp=true']);
                    test_lib_1.expect(executeWatch('exp', '2 < 1')).toEqual(['exp=false']);
                    test_lib_1.expect(executeWatch('exp', '2 > 1')).toEqual(['exp=true']);
                    test_lib_1.expect(executeWatch('exp', '2 < 1')).toEqual(['exp=false']);
                    test_lib_1.expect(executeWatch('exp', '1 <= 2')).toEqual(['exp=true']);
                    test_lib_1.expect(executeWatch('exp', '2 <= 2')).toEqual(['exp=true']);
                    test_lib_1.expect(executeWatch('exp', '2 <= 1')).toEqual(['exp=false']);
                    test_lib_1.expect(executeWatch('exp', '2 >= 1')).toEqual(['exp=true']);
                    test_lib_1.expect(executeWatch('exp', '2 >= 2')).toEqual(['exp=true']);
                    test_lib_1.expect(executeWatch('exp', '1 >= 2')).toEqual(['exp=false']);
                    test_lib_1.expect(executeWatch('exp', 'true && true')).toEqual(['exp=true']);
                    test_lib_1.expect(executeWatch('exp', 'true && false')).toEqual(['exp=false']);
                    test_lib_1.expect(executeWatch('exp', 'true || false')).toEqual(['exp=true']);
                    test_lib_1.expect(executeWatch('exp', 'false || false')).toEqual(['exp=false']);
                });
                test_lib_1.it("should support negate", function () {
                    test_lib_1.expect(executeWatch('exp', '!true')).toEqual(['exp=false']);
                    test_lib_1.expect(executeWatch('exp', '!!true')).toEqual(['exp=true']);
                });
                test_lib_1.it("should support conditionals", function () {
                    test_lib_1.expect(executeWatch('m', '1 < 2 ? 1 : 2')).toEqual(['m=1']);
                    test_lib_1.expect(executeWatch('m', '1 > 2 ? 1 : 2')).toEqual(['m=2']);
                });
                test_lib_1.describe("keyed access", function () {
                    test_lib_1.it("should support accessing a list item", function () {
                        test_lib_1.expect(executeWatch('array[0]', '["foo", "bar"][0]')).toEqual(['array[0]=foo']);
                    });
                    test_lib_1.it("should support accessing a map item", function () {
                        test_lib_1.expect(executeWatch('map[foo]', '{"foo": "bar"}["foo"]')).toEqual(['map[foo]=bar']);
                    });
                });
                test_lib_1.it("should support interpolation", function () {
                    var parser = new parser_1.Parser(new lexer_1.Lexer());
                    var pcd = createProtoChangeDetector();
                    var ast = parser.parseInterpolation("B{{a}}A", "location");
                    var cd = instantiate(pcd, dispatcher, [new change_detection_1.BindingRecord(ast, "memo", null)]);
                    cd.hydrate(new TestData("value"), null);
                    cd.detectChanges();
                    test_lib_1.expect(dispatcher.log).toEqual(["memo=BvalueA"]);
                });
                test_lib_1.describe("change notification", function () {
                    test_lib_1.describe("simple checks", function () {
                        test_lib_1.it("should pass a change record to the dispatcher", function () {
                            var person = new Person('bob');
                            var c = createChangeDetector('name', 'name', person);
                            var cd = c["changeDetector"];
                            var dispatcher = c["dispatcher"];
                            cd.detectChanges();
                            test_lib_1.expect(dispatcher.loggedValues).toEqual(['bob']);
                        });
                    });
                    test_lib_1.describe("pipes", function () {
                        test_lib_1.it("should pass a change record to the dispatcher", function () {
                            var registry = new FakePipeRegistry('pipe', function () { return new CountingPipe(); });
                            var person = new Person('bob');
                            var c = createChangeDetector('name', 'name | pipe', person, null, registry);
                            var cd = c["changeDetector"];
                            var dispatcher = c["dispatcher"];
                            cd.detectChanges();
                            test_lib_1.expect(dispatcher.loggedValues).toEqual(['bob state:0']);
                        });
                    });
                    test_lib_1.describe("onChange", function () {
                        var dirMemento1 = new FakeDirectiveMemento(1, false, true);
                        var dirMemento2 = new FakeDirectiveMemento(2, false, true);
                        var dirMementoNoOnChange = new FakeDirectiveMemento(3, false, false);
                        var memo1 = new FakeBindingMemento("memo1");
                        var memo2 = new FakeBindingMemento("memo2");
                        test_lib_1.it("should notify the dispatcher when a group of records changes", function () {
                            var pcd = createProtoChangeDetector();
                            var cd = instantiate(pcd, dispatcher, [new change_detection_1.BindingRecord(ast("1 + 2"), memo1, dirMemento1), new change_detection_1.BindingRecord(ast("10 + 20"), memo2, dirMemento1), new change_detection_1.BindingRecord(ast("100 + 200"), memo1, dirMemento2)]);
                            cd.detectChanges();
                            test_lib_1.expect(dispatcher.loggedOnChange).toEqual([{
                                    'memo1': 3,
                                    'memo2': 30
                                }, { 'memo1': 300 }]);
                        });
                        test_lib_1.it("should not notify the dispatcher when callOnChange is false", function () {
                            var pcd = createProtoChangeDetector();
                            var cd = instantiate(pcd, dispatcher, [new change_detection_1.BindingRecord(ast("1"), memo1, dirMemento1), new change_detection_1.BindingRecord(ast("2"), memo1, dirMementoNoOnChange), new change_detection_1.BindingRecord(ast("3"), memo1, dirMemento2)]);
                            cd.detectChanges();
                            test_lib_1.expect(dispatcher.loggedOnChange).toEqual([{ 'memo1': 1 }, { 'memo1': 3 }]);
                        });
                    });
                    test_lib_1.describe("onAllChangesDone", function () {
                        test_lib_1.it("should notify the dispatcher about processing all the children", function () {
                            var memento1 = new FakeDirectiveMemento(1, false);
                            var memento2 = new FakeDirectiveMemento(2, true);
                            var pcd = createProtoChangeDetector();
                            var cd = pcd.instantiate(dispatcher, [], null, [memento1, memento2]);
                            cd.hydrate(null, null);
                            cd.detectChanges();
                            test_lib_1.expect(dispatcher.loggedValues).toEqual([["onAllChangesDone", memento2]]);
                        });
                        test_lib_1.it("should notify in reverse order so the child is always notified before the parent", function () {
                            var memento1 = new FakeDirectiveMemento(1, true);
                            var memento2 = new FakeDirectiveMemento(2, true);
                            var pcd = createProtoChangeDetector();
                            var cd = pcd.instantiate(dispatcher, [], null, [memento1, memento2]);
                            cd.hydrate(null, null);
                            cd.detectChanges();
                            test_lib_1.expect(dispatcher.loggedValues).toEqual([["onAllChangesDone", memento2], ["onAllChangesDone", memento1]]);
                        });
                        test_lib_1.it("should notify the dispatcher before processing shadow dom children", function () {
                            var memento = new FakeDirectiveMemento(1, true);
                            var pcd = createProtoChangeDetector();
                            var shadowDomChildPCD = createProtoChangeDetector();
                            var parent = pcd.instantiate(dispatcher, [], null, [memento]);
                            var child = shadowDomChildPCD.instantiate(dispatcher, [new change_detection_1.BindingRecord(ast("1"), "a", memento)], null, []);
                            parent.addShadowDomChild(child);
                            parent.hydrate(null, null);
                            child.hydrate(null, null);
                            parent.detectChanges();
                            test_lib_1.expect(dispatcher.loggedValues).toEqual([["onAllChangesDone", memento], 1]);
                        });
                    });
                });
                test_lib_1.describe("enforce no new changes", function () {
                    test_lib_1.it("should throw when a record gets changed after it has been checked", function () {
                        var pcd = createProtoChangeDetector();
                        pcd.addAst(ast("a"), "a", 1);
                        var dispatcher = new TestDispatcher();
                        var cd = instantiate(pcd, dispatcher, [new change_detection_1.BindingRecord(ast("a"), "a", 1)]);
                        cd.hydrate(new TestData('value'), null);
                        test_lib_1.expect(function () {
                            cd.checkNoChanges();
                        }).toThrowError(new RegExp("Expression 'a in location' has changed after it was checked"));
                    });
                });
                test_lib_1.describe("error handling", function () {
                    test_lib_1.xit("should wrap exceptions into ChangeDetectionError", function () {
                        var pcd = createProtoChangeDetector();
                        var cd = pcd.instantiate(new TestDispatcher(), [new change_detection_1.BindingRecord(ast("invalidProp", "someComponent"), "a", 1)], null, []);
                        cd.hydrate(null, null);
                        try {
                            cd.detectChanges();
                            throw new lang_1.BaseException("fail");
                        }
                        catch (e) {
                            test_lib_1.expect(e).toBeAnInstanceOf(change_detection_1.ChangeDetectionError);
                            test_lib_1.expect(e.location).toEqual("invalidProp in someComponent");
                        }
                    });
                });
                test_lib_1.describe("Locals", function () {
                    test_lib_1.it('should read a value from locals', function () {
                        var locals = new locals_1.Locals(null, collection_1.MapWrapper.createFromPairs([["key", "value"]]));
                        test_lib_1.expect(executeWatch('key', 'key', null, locals)).toEqual(['key=value']);
                    });
                    test_lib_1.it('should invoke a function from local', function () {
                        var locals = new locals_1.Locals(null, collection_1.MapWrapper.createFromPairs([["key", function () { return "value"; }]]));
                        test_lib_1.expect(executeWatch('key', 'key()', null, locals)).toEqual(['key=value']);
                    });
                    test_lib_1.it('should handle nested locals', function () {
                        var nested = new locals_1.Locals(null, collection_1.MapWrapper.createFromPairs([["key", "value"]]));
                        var locals = new locals_1.Locals(nested, collection_1.MapWrapper.create());
                        test_lib_1.expect(executeWatch('key', 'key', null, locals)).toEqual(['key=value']);
                    });
                    test_lib_1.it("should fall back to a regular field read when the locals map" + "does not have the requested field", function () {
                        var locals = new locals_1.Locals(null, collection_1.MapWrapper.createFromPairs([["key", "value"]]));
                        test_lib_1.expect(executeWatch('name', 'name', new Person("Jim"), locals)).toEqual(['name=Jim']);
                    });
                });
                test_lib_1.describe("handle children", function () {
                    var parent, child;
                    test_lib_1.beforeEach(function () {
                        var protoParent = createProtoChangeDetector();
                        parent = instantiate(protoParent, null, []);
                        var protoChild = createProtoChangeDetector();
                        child = instantiate(protoChild, null, []);
                    });
                    test_lib_1.it("should add light dom children", function () {
                        parent.addChild(child);
                        test_lib_1.expect(parent.lightDomChildren.length).toEqual(1);
                        test_lib_1.expect(parent.lightDomChildren[0]).toBe(child);
                    });
                    test_lib_1.it("should add shadow dom children", function () {
                        parent.addShadowDomChild(child);
                        test_lib_1.expect(parent.shadowDomChildren.length).toEqual(1);
                        test_lib_1.expect(parent.shadowDomChildren[0]).toBe(child);
                    });
                    test_lib_1.it("should remove light dom children", function () {
                        parent.addChild(child);
                        parent.removeChild(child);
                        test_lib_1.expect(parent.lightDomChildren).toEqual([]);
                    });
                });
            });
            test_lib_1.describe("mode", function () {
                test_lib_1.it("should set the mode to CHECK_ALWAYS when the default change detection is used", function () {
                    var proto = createProtoChangeDetector(null, change_detection_1.DEFAULT);
                    var cd = proto.instantiate(null, [], [], []);
                    test_lib_1.expect(cd.mode).toEqual(null);
                    cd.hydrate(null, null);
                    test_lib_1.expect(cd.mode).toEqual(change_detection_1.CHECK_ALWAYS);
                });
                test_lib_1.it("should set the mode to CHECK_ONCE when the push change detection is used", function () {
                    var proto = createProtoChangeDetector(null, change_detection_1.ON_PUSH);
                    var cd = proto.instantiate(null, [], [], []);
                    cd.hydrate(null, null);
                    test_lib_1.expect(cd.mode).toEqual(change_detection_1.CHECK_ONCE);
                });
                test_lib_1.it("should not check a detached change detector", function () {
                    var c = createChangeDetector('name', 'a', new TestData("value"));
                    var cd = c["changeDetector"];
                    var dispatcher = c["dispatcher"];
                    cd.mode = change_detection_1.DETACHED;
                    cd.detectChanges();
                    test_lib_1.expect(dispatcher.log).toEqual([]);
                });
                test_lib_1.it("should not check a checked change detector", function () {
                    var c = createChangeDetector('name', 'a', new TestData("value"));
                    var cd = c["changeDetector"];
                    var dispatcher = c["dispatcher"];
                    cd.mode = change_detection_1.CHECKED;
                    cd.detectChanges();
                    test_lib_1.expect(dispatcher.log).toEqual([]);
                });
                test_lib_1.it("should change CHECK_ONCE to CHECKED", function () {
                    var cd = instantiate(createProtoChangeDetector(), null, []);
                    cd.mode = change_detection_1.CHECK_ONCE;
                    cd.detectChanges();
                    test_lib_1.expect(cd.mode).toEqual(change_detection_1.CHECKED);
                });
                test_lib_1.it("should not change the CHECK_ALWAYS", function () {
                    var cd = instantiate(createProtoChangeDetector(), null, []);
                    cd.mode = change_detection_1.CHECK_ALWAYS;
                    cd.detectChanges();
                    test_lib_1.expect(cd.mode).toEqual(change_detection_1.CHECK_ALWAYS);
                });
            });
            test_lib_1.describe("markPathToRootAsCheckOnce", function () {
                function changeDetector(mode, parent) {
                    var cd = instantiate(createProtoChangeDetector(), null, []);
                    cd.mode = mode;
                    if (lang_1.isPresent(parent))
                        parent.addChild(cd);
                    return cd;
                }
                test_lib_1.it("should mark all checked detectors as CHECK_ONCE " + "until reaching a detached one", function () {
                    var root = changeDetector(change_detection_1.CHECK_ALWAYS, null);
                    var disabled = changeDetector(change_detection_1.DETACHED, root);
                    var parent = changeDetector(change_detection_1.CHECKED, disabled);
                    var checkAlwaysChild = changeDetector(change_detection_1.CHECK_ALWAYS, parent);
                    var checkOnceChild = changeDetector(change_detection_1.CHECK_ONCE, checkAlwaysChild);
                    var checkedChild = changeDetector(change_detection_1.CHECKED, checkOnceChild);
                    checkedChild.markPathToRootAsCheckOnce();
                    test_lib_1.expect(root.mode).toEqual(change_detection_1.CHECK_ALWAYS);
                    test_lib_1.expect(disabled.mode).toEqual(change_detection_1.DETACHED);
                    test_lib_1.expect(parent.mode).toEqual(change_detection_1.CHECK_ONCE);
                    test_lib_1.expect(checkAlwaysChild.mode).toEqual(change_detection_1.CHECK_ALWAYS);
                    test_lib_1.expect(checkOnceChild.mode).toEqual(change_detection_1.CHECK_ONCE);
                    test_lib_1.expect(checkedChild.mode).toEqual(change_detection_1.CHECK_ONCE);
                });
            });
            test_lib_1.describe("hydration", function () {
                test_lib_1.it("should be able to rehydrate a change detector", function () {
                    var c = createChangeDetector("memo", "name");
                    var cd = c["changeDetector"];
                    cd.hydrate("some context", null);
                    test_lib_1.expect(cd.hydrated()).toBe(true);
                    cd.dehydrate();
                    test_lib_1.expect(cd.hydrated()).toBe(false);
                    cd.hydrate("other context", null);
                    test_lib_1.expect(cd.hydrated()).toBe(true);
                });
                test_lib_1.it("should destroy all active pipes during dehyration", function () {
                    var pipe = new OncePipe();
                    var registry = new FakePipeRegistry('pipe', function () { return pipe; });
                    var c = createChangeDetector("memo", "name | pipe", new Person('bob'), null, registry);
                    var cd = c["changeDetector"];
                    cd.detectChanges();
                    cd.dehydrate();
                    test_lib_1.expect(pipe.destroyCalled).toBe(true);
                });
            });
            test_lib_1.describe("pipes", function () {
                test_lib_1.it("should support pipes", function () {
                    var registry = new FakePipeRegistry('pipe', function () { return new CountingPipe(); });
                    var ctx = new Person("Megatron");
                    var c = createChangeDetector("memo", "name | pipe", ctx, null, registry);
                    var cd = c["changeDetector"];
                    var dispatcher = c["dispatcher"];
                    cd.detectChanges();
                    test_lib_1.expect(dispatcher.log).toEqual(['memo=Megatron state:0']);
                    dispatcher.clear();
                    cd.detectChanges();
                    test_lib_1.expect(dispatcher.log).toEqual(['memo=Megatron state:1']);
                });
                test_lib_1.it("should lookup pipes in the registry when the context is not supported", function () {
                    var registry = new FakePipeRegistry('pipe', function () { return new OncePipe(); });
                    var ctx = new Person("Megatron");
                    var c = createChangeDetector("memo", "name | pipe", ctx, null, registry);
                    var cd = c["changeDetector"];
                    cd.detectChanges();
                    test_lib_1.expect(registry.numberOfLookups).toEqual(1);
                    ctx.name = "Optimus Prime";
                    cd.detectChanges();
                    test_lib_1.expect(registry.numberOfLookups).toEqual(2);
                });
                test_lib_1.it("should invoke onDestroy on a pipe before switching to another one", function () {
                    var pipe = new OncePipe();
                    var registry = new FakePipeRegistry('pipe', function () { return pipe; });
                    var ctx = new Person("Megatron");
                    var c = createChangeDetector("memo", "name | pipe", ctx, null, registry);
                    var cd = c["changeDetector"];
                    cd.detectChanges();
                    ctx.name = "Optimus Prime";
                    cd.detectChanges();
                    test_lib_1.expect(pipe.destroyCalled).toEqual(true);
                });
                test_lib_1.it("should inject the binding propagation configuration " + "of the encompassing component into a pipe", function () {
                    var registry = new FakePipeRegistry('pipe', function () { return new IdentityPipe(); });
                    var c = createChangeDetector("memo", "name | pipe", new Person('bob'), null, registry);
                    var cd = c["changeDetector"];
                    cd.detectChanges();
                    test_lib_1.expect(registry.bpc).toBe(cd.bindingPropagationConfig);
                });
            });
            test_lib_1.it("should do nothing when returns NO_CHANGE", function () {
                var registry = new FakePipeRegistry('pipe', function () { return new IdentityPipe(); });
                var ctx = new Person("Megatron");
                var c = createChangeDetector("memo", "name | pipe", ctx, null, registry);
                var cd = c["changeDetector"];
                var dispatcher = c["dispatcher"];
                cd.detectChanges();
                cd.detectChanges();
                test_lib_1.expect(dispatcher.log).toEqual(['memo=Megatron']);
                ctx.name = "Optimus Prime";
                dispatcher.clear();
                cd.detectChanges();
                test_lib_1.expect(dispatcher.log).toEqual(['memo=Optimus Prime']);
            });
        });
    });
}
exports.main = main;
var CountingPipe = (function (_super) {
    __extends(CountingPipe, _super);
    function CountingPipe() {
        _super.call(this);
        this.state = 0;
    }
    CountingPipe.prototype.supports = function (newValue) {
        return true;
    };
    CountingPipe.prototype.transform = function (value) {
        return value + " state:" + this.state++;
    };
    return CountingPipe;
})(change_detection_1.Pipe);
var OncePipe = (function (_super) {
    __extends(OncePipe, _super);
    function OncePipe() {
        _super.call(this);
        this.called = false;
        this.destroyCalled = false;
    }
    OncePipe.prototype.supports = function (newValue) {
        return !this.called;
    };
    OncePipe.prototype.onDestroy = function () {
        this.destroyCalled = true;
    };
    OncePipe.prototype.transform = function (value) {
        this.called = true;
        return value;
    };
    return OncePipe;
})(change_detection_1.Pipe);
var IdentityPipe = (function (_super) {
    __extends(IdentityPipe, _super);
    function IdentityPipe() {
        _super.apply(this, arguments);
    }
    IdentityPipe.prototype.supports = function (newValue) {
        return true;
    };
    IdentityPipe.prototype.transform = function (value) {
        if (this.state === value) {
            return change_detection_1.NO_CHANGE;
        }
        else {
            this.state = value;
            return value;
        }
    };
    return IdentityPipe;
})(change_detection_1.Pipe);
var FakePipeRegistry = (function (_super) {
    __extends(FakePipeRegistry, _super);
    function FakePipeRegistry(pipeType, factory) {
        _super.call(this, {});
        this.pipeType = pipeType;
        this.factory = factory;
        this.numberOfLookups = 0;
    }
    FakePipeRegistry.prototype.get = function (type, obj, bpc) {
        if (type != this.pipeType)
            return null;
        this.numberOfLookups++;
        this.bpc = bpc;
        return this.factory();
    };
    return FakePipeRegistry;
})(change_detection_1.PipeRegistry);
Object.defineProperty(FakePipeRegistry.prototype.get, "parameters", { get: function () {
        return [[assert.type.string], [], []];
    } });
var TestRecord = (function () {
    function TestRecord() {
    }
    return TestRecord;
})();
var Person = (function () {
    function Person(name, address) {
        if (address === void 0) { address = null; }
        this.name = name;
        this.address = address;
    }
    Person.prototype.sayHi = function (m) {
        return "Hi, " + m;
    };
    Person.prototype.toString = function () {
        var address = this.address == null ? '' : ' address=' + this.address.toString();
        return 'name=' + this.name + address;
    };
    return Person;
})();
Object.defineProperty(Person, "parameters", { get: function () {
        return [[assert.type.string], [Address]];
    } });
var Address = (function () {
    function Address(city) {
        this.city = city;
    }
    Address.prototype.toString = function () {
        return this.city;
    };
    return Address;
})();
Object.defineProperty(Address, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
var Uninitialized = (function () {
    function Uninitialized() {
    }
    return Uninitialized;
})();
var TestData = (function () {
    function TestData(a) {
        this.a = a;
    }
    return TestData;
})();
var FakeDirectiveMemento = (function () {
    function FakeDirectiveMemento(value, callOnAllChangesDone, callOnChange) {
        if (callOnAllChangesDone === void 0) { callOnAllChangesDone = false; }
        if (callOnChange === void 0) { callOnChange = false; }
        this.value = value;
        this.callOnAllChangesDone = callOnAllChangesDone;
        this.callOnChange = callOnChange;
    }
    return FakeDirectiveMemento;
})();
Object.defineProperty(FakeDirectiveMemento, "parameters", { get: function () {
        return [[], [assert.type.boolean], [assert.type.boolean]];
    } });
var FakeBindingMemento = (function () {
    function FakeBindingMemento(propertyName) {
        this.propertyName = propertyName;
    }
    return FakeBindingMemento;
})();
Object.defineProperty(FakeBindingMemento, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
var TestDispatcher = (function (_super) {
    __extends(TestDispatcher, _super);
    function TestDispatcher() {
        _super.call(this);
        this.clear();
    }
    TestDispatcher.prototype.clear = function () {
        this.log = collection_1.ListWrapper.create();
        this.loggedValues = collection_1.ListWrapper.create();
        this.loggedOnChange = collection_1.ListWrapper.create();
    };
    TestDispatcher.prototype.onChange = function (directiveMemento, changes) {
        var r = {};
        collection_1.StringMapWrapper.forEach(changes, function (c, key) { return r[key] = c.currentValue; });
        collection_1.ListWrapper.push(this.loggedOnChange, r);
    };
    TestDispatcher.prototype.onAllChangesDone = function (directiveMemento) {
        collection_1.ListWrapper.push(this.loggedValues, ["onAllChangesDone", directiveMemento]);
    };
    TestDispatcher.prototype.invokeMementoFor = function (memento, value) {
        collection_1.ListWrapper.push(this.log, memento + "=" + this._asString(value));
        collection_1.ListWrapper.push(this.loggedValues, value);
    };
    TestDispatcher.prototype._asString = function (value) {
        return (lang_1.isBlank(value) ? 'null' : value.toString());
    };
    return TestDispatcher;
})(change_detection_1.ChangeDispatcher);
