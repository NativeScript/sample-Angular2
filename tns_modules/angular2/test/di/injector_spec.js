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
var di_1 = require('angular2/di');
var Engine = (function () {
    function Engine() {
    }
    return Engine;
})();
var BrokenEngine = (function () {
    function BrokenEngine() {
        throw "Broken Engine";
    }
    return BrokenEngine;
})();
var DashboardSoftware = (function () {
    function DashboardSoftware() {
    }
    return DashboardSoftware;
})();
var Dashboard = (function () {
    function Dashboard(software) {
    }
    return Dashboard;
})();
Object.defineProperty(Dashboard, "parameters", { get: function () {
        return [[DashboardSoftware]];
    } });
var TurboEngine = (function (_super) {
    __extends(TurboEngine, _super);
    function TurboEngine() {
        _super.apply(this, arguments);
    }
    return TurboEngine;
})(Engine);
var Car = (function () {
    function Car(engine) {
        this.engine = engine;
    }
    return Car;
})();
Object.defineProperty(Car, "parameters", { get: function () {
        return [[Engine]];
    } });
var CarWithLazyEngine = (function () {
    function CarWithLazyEngine(engineFactory) {
        this.engineFactory = engineFactory;
    }
    return CarWithLazyEngine;
})();
Object.defineProperty(CarWithLazyEngine, "parameters", { get: function () {
        return [[new di_1.InjectLazy(Engine)]];
    } });
var CarWithOptionalEngine = (function () {
    function CarWithOptionalEngine(engine) {
        this.engine = engine;
    }
    return CarWithOptionalEngine;
})();
Object.defineProperty(CarWithOptionalEngine, "parameters", { get: function () {
        return [[Engine, new di_1.Optional()]];
    } });
var CarWithDashboard = (function () {
    function CarWithDashboard(engine, dashboard) {
        this.engine = engine;
        this.dashboard = dashboard;
    }
    return CarWithDashboard;
})();
Object.defineProperty(CarWithDashboard, "parameters", { get: function () {
        return [[Engine], [Dashboard]];
    } });
var SportsCar = (function (_super) {
    __extends(SportsCar, _super);
    function SportsCar(engine) {
        _super.call(this, engine);
    }
    return SportsCar;
})(Car);
Object.defineProperty(SportsCar, "parameters", { get: function () {
        return [[Engine]];
    } });
var CarWithInject = (function () {
    function CarWithInject(engine) {
        this.engine = engine;
    }
    return CarWithInject;
})();
Object.defineProperty(CarWithInject, "parameters", { get: function () {
        return [[Engine, new di_1.Inject(TurboEngine)]];
    } });
var CyclicEngine = (function () {
    function CyclicEngine(car) {
    }
    return CyclicEngine;
})();
Object.defineProperty(CyclicEngine, "parameters", { get: function () {
        return [[Car]];
    } });
var NoAnnotations = (function () {
    function NoAnnotations(secretDependency) {
    }
    return NoAnnotations;
})();
function main() {
    test_lib_1.describe('injector', function () {
        test_lib_1.it('should instantiate a class without dependencies', function () {
            var injector = new di_1.Injector([Engine]);
            var engine = injector.get(Engine);
            test_lib_1.expect(engine).toBeAnInstanceOf(Engine);
        });
        test_lib_1.it('should resolve dependencies based on type information', function () {
            var injector = new di_1.Injector([Engine, Car]);
            var car = injector.get(Car);
            test_lib_1.expect(car).toBeAnInstanceOf(Car);
            test_lib_1.expect(car.engine).toBeAnInstanceOf(Engine);
        });
        test_lib_1.it('should resolve dependencies based on @Inject annotation', function () {
            var injector = new di_1.Injector([TurboEngine, Engine, CarWithInject]);
            var car = injector.get(CarWithInject);
            test_lib_1.expect(car).toBeAnInstanceOf(CarWithInject);
            test_lib_1.expect(car.engine).toBeAnInstanceOf(TurboEngine);
        });
        test_lib_1.it('should throw when no type and not @Inject', function () {
            test_lib_1.expect(function () { return new di_1.Injector([NoAnnotations]); }).toThrowError('Cannot resolve all parameters for NoAnnotations');
        });
        test_lib_1.it('should cache instances', function () {
            var injector = new di_1.Injector([Engine]);
            var e1 = injector.get(Engine);
            var e2 = injector.get(Engine);
            test_lib_1.expect(e1).toBe(e2);
        });
        test_lib_1.it('should bind to a value', function () {
            var injector = new di_1.Injector([di_1.bind(Engine).toValue("fake engine")]);
            var engine = injector.get(Engine);
            test_lib_1.expect(engine).toEqual("fake engine");
        });
        test_lib_1.it('should bind to a factory', function () {
            function sportsCarFactory(e) {
                return new SportsCar(e);
            }
            Object.defineProperty(sportsCarFactory, "parameters", { get: function () {
                    return [[Engine]];
                } });
            var injector = new di_1.Injector([Engine, di_1.bind(Car).toFactory(sportsCarFactory)]);
            var car = injector.get(Car);
            test_lib_1.expect(car).toBeAnInstanceOf(SportsCar);
            test_lib_1.expect(car.engine).toBeAnInstanceOf(Engine);
        });
        test_lib_1.it('should bind to an alias', function () {
            var injector = new di_1.Injector([Engine, di_1.bind(SportsCar).toClass(SportsCar), di_1.bind(Car).toAlias(SportsCar)]);
            var car = injector.get(Car);
            var sportsCar = injector.get(SportsCar);
            test_lib_1.expect(car).toBeAnInstanceOf(SportsCar);
            test_lib_1.expect(car).toBe(sportsCar);
        });
        test_lib_1.it('should throw when the aliased binding does not exist', function () {
            var injector = new di_1.Injector([di_1.bind('car').toAlias(SportsCar)]);
            test_lib_1.expect(function () { return injector.get('car'); }).toThrowError('No provider for SportsCar! (car -> SportsCar)');
        });
        test_lib_1.it('should support overriding factory dependencies', function () {
            var injector = new di_1.Injector([Engine, di_1.bind(Car).toFactory(function (e) { return new SportsCar(e); }, [Engine])]);
            var car = injector.get(Car);
            test_lib_1.expect(car).toBeAnInstanceOf(SportsCar);
            test_lib_1.expect(car.engine).toBeAnInstanceOf(Engine);
        });
        test_lib_1.it('should support optional dependencies', function () {
            var injector = new di_1.Injector([CarWithOptionalEngine]);
            var car = injector.get(CarWithOptionalEngine);
            test_lib_1.expect(car.engine).toEqual(null);
        });
        test_lib_1.it("should flatten passed-in bindings", function () {
            var injector = new di_1.Injector([[[Engine, Car]]]);
            var car = injector.get(Car);
            test_lib_1.expect(car).toBeAnInstanceOf(Car);
        });
        test_lib_1.it("should use the last binding " + "when there are mutliple bindings for same token", function () {
            var injector = new di_1.Injector([di_1.bind(Engine).toClass(Engine), di_1.bind(Engine).toClass(TurboEngine)]);
            test_lib_1.expect(injector.get(Engine)).toBeAnInstanceOf(TurboEngine);
        });
        test_lib_1.it('should use non-type tokens', function () {
            var injector = new di_1.Injector([di_1.bind('token').toValue('value')]);
            test_lib_1.expect(injector.get('token')).toEqual('value');
        });
        test_lib_1.it('should throw when given invalid bindings', function () {
            test_lib_1.expect(function () { return new di_1.Injector(["blah"]); }).toThrowError('Invalid binding blah');
            test_lib_1.expect(function () { return new di_1.Injector([di_1.bind("blah")]); }).toThrowError('Invalid binding blah');
        });
        test_lib_1.it('should provide itself', function () {
            var parent = new di_1.Injector([]);
            var child = parent.createChild([]);
            test_lib_1.expect(child.get(di_1.Injector)).toBe(child);
        });
        test_lib_1.it('should throw when no provider defined', function () {
            var injector = new di_1.Injector([]);
            test_lib_1.expect(function () { return injector.get('NonExisting'); }).toThrowError('No provider for NonExisting!');
        });
        test_lib_1.it('should show the full path when no provider', function () {
            var injector = new di_1.Injector([CarWithDashboard, Engine, Dashboard]);
            test_lib_1.expect(function () { return injector.get(CarWithDashboard); }).toThrowError('No provider for DashboardSoftware! (CarWithDashboard -> Dashboard -> DashboardSoftware)');
        });
        test_lib_1.it('should throw when trying to instantiate a cyclic dependency', function () {
            var injector = new di_1.Injector([Car, di_1.bind(Engine).toClass(CyclicEngine)]);
            test_lib_1.expect(function () { return injector.get(Car); }).toThrowError('Cannot instantiate cyclic dependency! (Car -> Engine -> Car)');
            test_lib_1.expect(function () { return injector.asyncGet(Car); }).toThrowError('Cannot instantiate cyclic dependency! (Car -> Engine -> Car)');
        });
        test_lib_1.it('should show the full path when error happens in a constructor', function () {
            var injector = new di_1.Injector([Car, di_1.bind(Engine).toClass(BrokenEngine)]);
            try {
                injector.get(Car);
                throw "Must throw";
            }
            catch (e) {
                test_lib_1.expect(e.message).toContain("Error during instantiation of Engine! (Car -> Engine)");
            }
        });
        test_lib_1.it('should instantiate an object after a failed attempt', function () {
            var isBroken = true;
            var injector = new di_1.Injector([Car, di_1.bind(Engine).toFactory(function () { return isBroken ? new BrokenEngine() : new Engine(); })]);
            test_lib_1.expect(function () { return injector.get(Car); }).toThrowError(new RegExp("Error"));
            isBroken = false;
            test_lib_1.expect(injector.get(Car)).toBeAnInstanceOf(Car);
        });
        test_lib_1.it('should support null values', function () {
            var injector = new di_1.Injector([di_1.bind('null').toValue(null)]);
            test_lib_1.expect(injector.get('null')).toBe(null);
        });
        test_lib_1.describe("default bindings", function () {
            test_lib_1.it("should be used when no matching binding found", function () {
                var injector = new di_1.Injector([], { defaultBindings: true });
                var car = injector.get(Car);
                test_lib_1.expect(car).toBeAnInstanceOf(Car);
            });
            test_lib_1.it("should use the matching binding when it is available", function () {
                var injector = new di_1.Injector([di_1.bind(Car).toClass(SportsCar)], { defaultBindings: true });
                var car = injector.get(Car);
                test_lib_1.expect(car).toBeAnInstanceOf(SportsCar);
            });
        });
        test_lib_1.describe("child", function () {
            test_lib_1.it('should load instances from parent injector', function () {
                var parent = new di_1.Injector([Engine]);
                var child = parent.createChild([]);
                var engineFromParent = parent.get(Engine);
                var engineFromChild = child.get(Engine);
                test_lib_1.expect(engineFromChild).toBe(engineFromParent);
            });
            test_lib_1.it("should not use the child bindings when resolving the dependencies of a parent binding", function () {
                var parent = new di_1.Injector([Car, Engine]);
                var child = parent.createChild([di_1.bind(Engine).toClass(TurboEngine)]);
                var carFromChild = child.get(Car);
                test_lib_1.expect(carFromChild.engine).toBeAnInstanceOf(Engine);
            });
            test_lib_1.it('should create new instance in a child injector', function () {
                var parent = new di_1.Injector([Engine]);
                var child = parent.createChild([di_1.bind(Engine).toClass(TurboEngine)]);
                var engineFromParent = parent.get(Engine);
                var engineFromChild = child.get(Engine);
                test_lib_1.expect(engineFromParent).not.toBe(engineFromChild);
                test_lib_1.expect(engineFromChild).toBeAnInstanceOf(TurboEngine);
            });
            test_lib_1.it("should create child injectors without default bindings", function () {
                var parent = new di_1.Injector([], { defaultBindings: true });
                var child = parent.createChild([]);
                var childCar = child.get(Car);
                var parentCar = parent.get(Car);
                test_lib_1.expect(childCar).toBe(parentCar);
            });
        });
        test_lib_1.describe("lazy", function () {
            test_lib_1.it("should create dependencies lazily", function () {
                var injector = new di_1.Injector([Engine, CarWithLazyEngine]);
                var car = injector.get(CarWithLazyEngine);
                test_lib_1.expect(car.engineFactory()).toBeAnInstanceOf(Engine);
            });
            test_lib_1.it("should cache instance created lazily", function () {
                var injector = new di_1.Injector([Engine, CarWithLazyEngine]);
                var car = injector.get(CarWithLazyEngine);
                var e1 = car.engineFactory();
                var e2 = car.engineFactory();
                test_lib_1.expect(e1).toBe(e2);
            });
        });
    });
}
exports.main = main;
