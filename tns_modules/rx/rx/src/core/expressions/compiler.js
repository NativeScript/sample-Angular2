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
var Expression = (function () {
    function Expression(nodeType) {
        this.nodeType = nodeType;
    }
    Expression.prototype.Accept = function (visitor) {
        throw new Error("not implemented");
    };
    Expression.Constant = function (value) {
        return new ConstantExpression(value);
    };
    Expression.Parameter = function (name) {
        return new ParameterExpression(name);
    };
    Expression.Condition = function (test, ifTrue, ifFalse) {
        return new ConditionalExpression(test, ifTrue, ifFalse);
    };
    Expression.Add = function (left, right) {
        return new BinaryExpression(ExpressionType.Add, left, right);
    };
    Expression.Subtract = function (left, right) {
        return new BinaryExpression(ExpressionType.Subtract, left, right);
    };
    Expression.Multiply = function (left, right) {
        return new BinaryExpression(ExpressionType.Multiply, left, right);
    };
    Expression.Divide = function (left, right) {
        return new BinaryExpression(ExpressionType.Divide, left, right);
    };
    Expression.Modulo = function (left, right) {
        return new BinaryExpression(ExpressionType.Modulo, left, right);
    };
    Expression.And = function (left, right) {
        return new BinaryExpression(ExpressionType.And, left, right);
    };
    Expression.AndAlso = function (left, right) {
        return new BinaryExpression(ExpressionType.AndAlso, left, right);
    };
    Expression.Or = function (left, right) {
        return new BinaryExpression(ExpressionType.Or, left, right);
    };
    Expression.OrElse = function (left, right) {
        return new BinaryExpression(ExpressionType.OrElse, left, right);
    };
    Expression.ExclusiveOr = function (left, right) {
        return new BinaryExpression(ExpressionType.ExclusiveOr, left, right);
    };
    Expression.Equal = function (left, right) {
        return new BinaryExpression(ExpressionType.Equal, left, right);
    };
    Expression.NotEqual = function (left, right) {
        return new BinaryExpression(ExpressionType.NotEqual, left, right);
    };
    Expression.LessThan = function (left, right) {
        return new BinaryExpression(ExpressionType.LessThan, left, right);
    };
    Expression.LessThanOrEqual = function (left, right) {
        return new BinaryExpression(ExpressionType.LessThanOrEqual, left, right);
    };
    Expression.GreaterThan = function (left, right) {
        return new BinaryExpression(ExpressionType.GreaterThan, left, right);
    };
    Expression.GreaterThanOrEqual = function (left, right) {
        return new BinaryExpression(ExpressionType.GreaterThanOrEqual, left, right);
    };
    Expression.LeftShift = function (left, right) {
        return new BinaryExpression(ExpressionType.LeftShift, left, right);
    };
    Expression.RightShift = function (left, right) {
        return new BinaryExpression(ExpressionType.RightShift, left, right);
    };
    Expression.Not = function (operand) {
        return new UnaryExpression(ExpressionType.Not, operand);
    };
    Expression.UnaryPlus = function (operand) {
        return new UnaryExpression(ExpressionType.UnaryPlus, operand);
    };
    Expression.Negate = function (operand) {
        return new UnaryExpression(ExpressionType.Negate, operand);
    };
    Expression.OnesComplement = function (operand) {
        return new UnaryExpression(ExpressionType.OnesComplement, operand);
    };
    Expression.Lambda = function (body) {
        var parameters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parameters[_i - 1] = arguments[_i];
        }
        return new LambdaExpression(body, parameters);
    };
    Expression.Invoke = function (expression) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new InvocationExpression(expression, args);
    };
    Expression.New = function (typeName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new NewExpression(typeName, args);
    };
    Expression.Call = function (obj, methodName) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return new CallExpression(obj, methodName, args);
    };
    Expression.Member = function (obj, memberName) {
        return new MemberExpression(obj, memberName);
    };
    Expression.Index = function (obj) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new IndexExpression(obj, args);
    };
    return Expression;
})();
var ExpressionVisitor = (function () {
    function ExpressionVisitor() {
    }
    ExpressionVisitor.prototype.Visit = function (node) {
        if (node === null) {
            return null;
        }
        return node.Accept(this);
    };
    ExpressionVisitor.prototype.VisitConstant = function (node) {
        return node;
    };
    ExpressionVisitor.prototype.VisitParameter = function (node) {
        return node;
    };
    ExpressionVisitor.prototype.VisitBinary = function (node) {
        return node.Update(this.Visit(node.left), this.Visit(node.right));
    };
    ExpressionVisitor.prototype.VisitUnary = function (node) {
        return node.Update(this.Visit(node.operand));
    };
    ExpressionVisitor.prototype.VisitConditional = function (node) {
        return node.Update(this.Visit(node.test), this.Visit(node.ifTrue), this.Visit(node.ifFalse));
    };
    ExpressionVisitor.prototype.VisitLambda = function (node) {
        return node.Update(this.Visit(node.body), this.VisitMany(node.parameters));
    };
    ExpressionVisitor.prototype.VisitInvoke = function (node) {
        return node.Update(this.Visit(node.expression), this.VisitMany(node.args));
    };
    ExpressionVisitor.prototype.VisitCall = function (node) {
        return node.Update(this.Visit(node.obj), this.VisitMany(node.args));
    };
    ExpressionVisitor.prototype.VisitNew = function (node) {
        return node.Update(this.VisitMany(node.args));
    };
    ExpressionVisitor.prototype.VisitMember = function (node) {
        return node.Update(this.Visit(node.obj));
    };
    ExpressionVisitor.prototype.VisitIndex = function (node) {
        return node.Update(this.Visit(node.obj), this.VisitMany(node.args));
    };
    ExpressionVisitor.prototype.VisitMany = function (nodes) {
        var res = new Array(nodes.length);
        for (var i = 0; i < nodes.length; i++) {
            var oldNode = nodes[i];
            var newNode = this.Visit(oldNode);
            res[i] = newNode;
        }
        return res;
    };
    return ExpressionVisitor;
})();
var ConstantExpression = (function (_super) {
    __extends(ConstantExpression, _super);
    function ConstantExpression(value) {
        _super.call(this, ExpressionType.Constant);
        this._value = value;
    }
    Object.defineProperty(ConstantExpression.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    ConstantExpression.prototype.Accept = function (visitor) {
        return visitor.VisitConstant(this);
    };
    return ConstantExpression;
})(Expression);
var ParameterExpression = (function (_super) {
    __extends(ParameterExpression, _super);
    function ParameterExpression(name) {
        _super.call(this, ExpressionType.Parameter);
        this._name = name;
    }
    Object.defineProperty(ParameterExpression.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    ParameterExpression.prototype.Accept = function (visitor) {
        return visitor.VisitParameter(this);
    };
    return ParameterExpression;
})(Expression);
var UnaryExpression = (function (_super) {
    __extends(UnaryExpression, _super);
    function UnaryExpression(nodeType, operand) {
        _super.call(this, nodeType);
        this._operand = operand;
    }
    Object.defineProperty(UnaryExpression.prototype, "operand", {
        get: function () {
            return this._operand;
        },
        enumerable: true,
        configurable: true
    });
    UnaryExpression.prototype.Accept = function (visitor) {
        return visitor.VisitUnary(this);
    };
    UnaryExpression.prototype.Update = function (operand) {
        if (operand !== this._operand) {
            return new UnaryExpression(this.nodeType, operand);
        }
        return this;
    };
    return UnaryExpression;
})(Expression);
var BinaryExpression = (function (_super) {
    __extends(BinaryExpression, _super);
    function BinaryExpression(nodeType, left, right) {
        _super.call(this, nodeType);
        this._left = left;
        this._right = right;
    }
    Object.defineProperty(BinaryExpression.prototype, "left", {
        get: function () {
            return this._left;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BinaryExpression.prototype, "right", {
        get: function () {
            return this._right;
        },
        enumerable: true,
        configurable: true
    });
    BinaryExpression.prototype.Accept = function (visitor) {
        return visitor.VisitBinary(this);
    };
    BinaryExpression.prototype.Update = function (left, right) {
        if (left !== this._left || right !== this._right) {
            return new BinaryExpression(this.nodeType, left, right);
        }
        return this;
    };
    return BinaryExpression;
})(Expression);
var ConditionalExpression = (function (_super) {
    __extends(ConditionalExpression, _super);
    function ConditionalExpression(test, ifTrue, ifFalse) {
        _super.call(this, ExpressionType.Condition);
        this._test = test;
        this._ifTrue = ifTrue;
        this._ifFalse = ifFalse;
    }
    Object.defineProperty(ConditionalExpression.prototype, "test", {
        get: function () {
            return this._test;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConditionalExpression.prototype, "ifTrue", {
        get: function () {
            return this._ifTrue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConditionalExpression.prototype, "ifFalse", {
        get: function () {
            return this._ifTrue;
        },
        enumerable: true,
        configurable: true
    });
    ConditionalExpression.prototype.Accept = function (visitor) {
        return visitor.VisitConditional(this);
    };
    ConditionalExpression.prototype.Update = function (test, ifTrue, ifFalse) {
        if (test !== this._test || ifTrue !== this._ifTrue || ifFalse !== this._ifFalse) {
            return new ConditionalExpression(test, ifTrue, ifFalse);
        }
        return this;
    };
    return ConditionalExpression;
})(Expression);
var LambdaExpression = (function (_super) {
    __extends(LambdaExpression, _super);
    function LambdaExpression(body, parameters) {
        _super.call(this, ExpressionType.Lambda);
        this._body = body;
        this._parameters = parameters;
    }
    Object.defineProperty(LambdaExpression.prototype, "body", {
        get: function () {
            return this._body;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaExpression.prototype, "parameters", {
        get: function () {
            return this._parameters;
        },
        enumerable: true,
        configurable: true
    });
    LambdaExpression.prototype.Accept = function (visitor) {
        return visitor.VisitLambda(this);
    };
    LambdaExpression.prototype.Update = function (body, parameters) {
        if (body !== this._body || parameters !== this._parameters) {
            return new LambdaExpression(body, parameters);
        }
        return this;
    };
    LambdaExpression.prototype.Compile = function () {
        var comp = new LambdaCompiler();
        comp.Visit(this);
        var code = comp.code;
        code = code.replace(/\"/g, "\\\"");
        code = "new Function(\"return " + code + ";\")";
        code = code.replace(/\r?\n|\r/g, "");
        alert(code);
        return eval(code)();
    };
    return LambdaExpression;
})(Expression);
var InvocationExpression = (function (_super) {
    __extends(InvocationExpression, _super);
    function InvocationExpression(expression, args) {
        _super.call(this, ExpressionType.Invoke);
        this._expression = expression;
        this._args = args;
    }
    Object.defineProperty(InvocationExpression.prototype, "expression", {
        get: function () {
            return this._expression;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InvocationExpression.prototype, "args", {
        get: function () {
            return this._args;
        },
        enumerable: true,
        configurable: true
    });
    InvocationExpression.prototype.Accept = function (visitor) {
        return visitor.VisitInvoke(this);
    };
    InvocationExpression.prototype.Update = function (expression, args) {
        if (expression !== this._expression || args !== this._args) {
            return new InvocationExpression(expression, args);
        }
        return this;
    };
    return InvocationExpression;
})(Expression);
var CallExpression = (function (_super) {
    __extends(CallExpression, _super);
    function CallExpression(expression, methodName, args) {
        _super.call(this, ExpressionType.Call);
        this._expression = expression;
        this._method = methodName;
        this._args = args;
    }
    Object.defineProperty(CallExpression.prototype, "obj", {
        get: function () {
            return this._expression;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CallExpression.prototype, "method", {
        get: function () {
            return this._method;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CallExpression.prototype, "args", {
        get: function () {
            return this._args;
        },
        enumerable: true,
        configurable: true
    });
    CallExpression.prototype.Accept = function (visitor) {
        return visitor.VisitCall(this);
    };
    CallExpression.prototype.Update = function (expression, args) {
        if (expression !== this._expression || args !== this._args) {
            return new CallExpression(expression, this._method, args);
        }
        return this;
    };
    return CallExpression;
})(Expression);
var IndexExpression = (function (_super) {
    __extends(IndexExpression, _super);
    function IndexExpression(expression, args) {
        _super.call(this, ExpressionType.Index);
        this._expression = expression;
        this._args = args;
    }
    Object.defineProperty(IndexExpression.prototype, "obj", {
        get: function () {
            return this._expression;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndexExpression.prototype, "args", {
        get: function () {
            return this._args;
        },
        enumerable: true,
        configurable: true
    });
    IndexExpression.prototype.Accept = function (visitor) {
        return visitor.VisitIndex(this);
    };
    IndexExpression.prototype.Update = function (expression, args) {
        if (expression !== this._expression || args !== this._args) {
            return new IndexExpression(expression, args);
        }
        return this;
    };
    return IndexExpression;
})(Expression);
var NewExpression = (function (_super) {
    __extends(NewExpression, _super);
    function NewExpression(typeName, args) {
        _super.call(this, ExpressionType.New);
        this._type = typeName;
        this._args = args;
    }
    Object.defineProperty(NewExpression.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NewExpression.prototype, "args", {
        get: function () {
            return this._args;
        },
        enumerable: true,
        configurable: true
    });
    NewExpression.prototype.Accept = function (visitor) {
        return visitor.VisitNew(this);
    };
    NewExpression.prototype.Update = function (args) {
        if (args !== this._args) {
            return new NewExpression(this._type, args);
        }
        return this;
    };
    return NewExpression;
})(Expression);
var MemberExpression = (function (_super) {
    __extends(MemberExpression, _super);
    function MemberExpression(obj, memberName) {
        _super.call(this, ExpressionType.Member);
        this._obj = obj;
        this._member = memberName;
    }
    Object.defineProperty(MemberExpression.prototype, "obj", {
        get: function () {
            return this._obj;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MemberExpression.prototype, "member", {
        get: function () {
            return this._member;
        },
        enumerable: true,
        configurable: true
    });
    MemberExpression.prototype.Accept = function (visitor) {
        return visitor.VisitMember(this);
    };
    MemberExpression.prototype.Update = function (obj) {
        if (obj !== this._obj) {
            return new MemberExpression(obj, this._member);
        }
        return this;
    };
    return MemberExpression;
})(Expression);
var LambdaCompiler = (function (_super) {
    __extends(LambdaCompiler, _super);
    function LambdaCompiler() {
        _super.call(this);
        this._stack = new Array();
    }
    Object.defineProperty(LambdaCompiler.prototype, "code", {
        get: function () {
            if (this._stack.length != 1)
                throw new Error("invalid code generation");
            return this._stack[0];
        },
        enumerable: true,
        configurable: true
    });
    LambdaCompiler.prototype.VisitConstant = function (node) {
        var value = "";
        if (typeof node.value == "string") {
            value = "\"" + node.value + "\"";
        }
        else if (node.value instanceof Array) {
            value = JSON.stringify(node.value);
        }
        else if (node.value === undefined) {
            value = "undefined";
        }
        else {
            value = node.value.toString();
        }
        this._stack.push(value);
        return node;
    };
    LambdaCompiler.prototype.VisitUnary = function (node) {
        this.Visit(node.operand);
        var o = this._stack.pop();
        var i = "";
        switch (node.nodeType) {
            case ExpressionType.Negate:
                i = "-";
                break;
            case ExpressionType.UnaryPlus:
                i = "+";
                break;
            case ExpressionType.Not:
                i = "!";
                break;
            case ExpressionType.OnesComplement:
                i = "~";
                break;
        }
        var res = "(" + i + "" + o + ")";
        this._stack.push(res);
        return node;
    };
    LambdaCompiler.prototype.VisitBinary = function (node) {
        this.Visit(node.left);
        this.Visit(node.right);
        var r = this._stack.pop();
        var l = this._stack.pop();
        var i = "";
        switch (node.nodeType) {
            case ExpressionType.Add:
                i = "+";
                break;
            case ExpressionType.Subtract:
                i = "-";
                break;
            case ExpressionType.Multiply:
                i = "*";
                break;
            case ExpressionType.Divide:
                i = "/";
                break;
            case ExpressionType.Modulo:
                i = "%";
                break;
            case ExpressionType.And:
                i = "&";
                break;
            case ExpressionType.Or:
                i = "|";
                break;
            case ExpressionType.AndAlso:
                i = "&&";
                break;
            case ExpressionType.OrElse:
                i = "||";
                break;
            case ExpressionType.ExclusiveOr:
                i = "^";
                break;
            case ExpressionType.Equal:
                i = "===";
                break;
            case ExpressionType.NotEqual:
                i = "!==";
                break;
            case ExpressionType.LessThan:
                i = "<";
                break;
            case ExpressionType.LessThanOrEqual:
                i = "<=";
                break;
            case ExpressionType.GreaterThan:
                i = ">";
                break;
            case ExpressionType.GreaterThanOrEqual:
                i = ">=";
                break;
            case ExpressionType.LeftShift:
                i = "<<";
                break;
            case ExpressionType.RightShift:
                i = ">>";
                break;
        }
        var res = "(" + l + " " + i + " " + r + ")";
        this._stack.push(res);
        return node;
    };
    LambdaCompiler.prototype.VisitConditional = function (node) {
        this.Visit(node.test);
        this.Visit(node.ifTrue);
        this.Visit(node.ifFalse);
        var f = this._stack.pop();
        var t = this._stack.pop();
        var c = this._stack.pop();
        var res = "(" + c + " ? " + t + " : " + f + ")";
        this._stack.push(res);
        return node;
    };
    LambdaCompiler.prototype.VisitParameter = function (node) {
        this._stack.push(node.name);
        return node;
    };
    LambdaCompiler.prototype.VisitLambda = function (node) {
        this.VisitMany(node.parameters);
        this.Visit(node.body);
        var body = this._stack.pop();
        var n = node.parameters.length;
        var args = new Array(n);
        for (var i = 0; i < n; i++) {
            args[n - i - 1] = this._stack.pop();
        }
        var allArgs = args.join(", ");
        var res = "function(" + allArgs + ") { return " + body + "; }";
        this._stack.push(res);
        return node;
    };
    LambdaCompiler.prototype.VisitInvoke = function (node) {
        this.Visit(node.expression);
        this.VisitMany(node.args);
        var n = node.args.length;
        var args = new Array(n);
        for (var i = 0; i < n; i++) {
            args[n - i - 1] = this._stack.pop();
        }
        var argList = args.join(", ");
        var func = this._stack.pop();
        var res = func + "(" + argList + ")";
        this._stack.push(res);
        return node;
    };
    LambdaCompiler.prototype.VisitCall = function (node) {
        var res = "";
        if (node.obj !== null) {
            this.Visit(node.obj);
            res = this._stack.pop() + ".";
        }
        this.VisitMany(node.args);
        var n = node.args.length;
        var args = new Array(n);
        for (var i = 0; i < n; i++) {
            args[n - i - 1] = this._stack.pop();
        }
        var argList = args.join(", ");
        res += node.method + "(" + argList + ")";
        this._stack.push(res);
        return node;
    };
    LambdaCompiler.prototype.VisitNew = function (node) {
        this.VisitMany(node.args);
        var n = node.args.length;
        var args = new Array(n);
        for (var i = 0; i < n; i++) {
            args[n - i - 1] = this._stack.pop();
        }
        var argList = args.join(", ");
        var res = "new " + node.type + "(" + argList + ")";
        this._stack.push(res);
        return node;
    };
    LambdaCompiler.prototype.VisitMember = function (node) {
        var res = "";
        if (node.obj !== null) {
            this.Visit(node.obj);
            res = this._stack.pop() + ".";
        }
        res += node.member;
        this._stack.push(res);
        return node;
    };
    LambdaCompiler.prototype.VisitIndex = function (node) {
        this.Visit(node.obj);
        var res = this._stack.pop();
        this.VisitMany(node.args);
        var n = node.args.length;
        var args = new Array(n);
        for (var i = 0; i < n; i++) {
            args[n - i - 1] = this._stack.pop();
        }
        var argList = args.join(", ");
        res += "[" + argList + "]";
        this._stack.push(res);
        return node;
    };
    return LambdaCompiler;
})(ExpressionVisitor);
var FreeVariableScanner = (function (_super) {
    __extends(FreeVariableScanner, _super);
    function FreeVariableScanner() {
        _super.call(this);
        this._stack = new Array();
        this._result = new Array();
    }
    Object.defineProperty(FreeVariableScanner.prototype, "result", {
        get: function () {
            return this._result;
        },
        enumerable: true,
        configurable: true
    });
    FreeVariableScanner.prototype.VisitParameter = function (node) {
        var found = false;
        for (var i = this._stack.length - 1; i >= 0; i--) {
            if (this._stack[i].indexOf(node) >= 0) {
                found = true;
                break;
            }
        }
        if (!found) {
            this._result.push(node);
        }
        return node;
    };
    FreeVariableScanner.prototype.VisitLambda = function (node) {
        this._stack.push(node.parameters);
        this.Visit(node.body);
        this._stack.pop();
        return node;
    };
    return FreeVariableScanner;
})(ExpressionVisitor);
var ExpressionType;
(function (ExpressionType) {
    ExpressionType[ExpressionType["Constant"] = 0] = "Constant";
    ExpressionType[ExpressionType["Parameter"] = 1] = "Parameter";
    ExpressionType[ExpressionType["Lambda"] = 2] = "Lambda";
    ExpressionType[ExpressionType["Add"] = 3] = "Add";
    ExpressionType[ExpressionType["Subtract"] = 4] = "Subtract";
    ExpressionType[ExpressionType["Multiply"] = 5] = "Multiply";
    ExpressionType[ExpressionType["Divide"] = 6] = "Divide";
    ExpressionType[ExpressionType["Modulo"] = 7] = "Modulo";
    ExpressionType[ExpressionType["And"] = 8] = "And";
    ExpressionType[ExpressionType["Or"] = 9] = "Or";
    ExpressionType[ExpressionType["AndAlso"] = 10] = "AndAlso";
    ExpressionType[ExpressionType["OrElse"] = 11] = "OrElse";
    ExpressionType[ExpressionType["ExclusiveOr"] = 12] = "ExclusiveOr";
    ExpressionType[ExpressionType["Equal"] = 13] = "Equal";
    ExpressionType[ExpressionType["NotEqual"] = 14] = "NotEqual";
    ExpressionType[ExpressionType["LessThan"] = 15] = "LessThan";
    ExpressionType[ExpressionType["LessThanOrEqual"] = 16] = "LessThanOrEqual";
    ExpressionType[ExpressionType["GreaterThan"] = 17] = "GreaterThan";
    ExpressionType[ExpressionType["GreaterThanOrEqual"] = 18] = "GreaterThanOrEqual";
    ExpressionType[ExpressionType["LeftShift"] = 19] = "LeftShift";
    ExpressionType[ExpressionType["RightShift"] = 20] = "RightShift";
    ExpressionType[ExpressionType["Invoke"] = 21] = "Invoke";
    ExpressionType[ExpressionType["Not"] = 22] = "Not";
    ExpressionType[ExpressionType["Negate"] = 23] = "Negate";
    ExpressionType[ExpressionType["UnaryPlus"] = 24] = "UnaryPlus";
    ExpressionType[ExpressionType["OnesComplement"] = 25] = "OnesComplement";
    ExpressionType[ExpressionType["Condition"] = 26] = "Condition";
    ExpressionType[ExpressionType["New"] = 27] = "New";
    ExpressionType[ExpressionType["Call"] = 28] = "Call";
    ExpressionType[ExpressionType["Member"] = 29] = "Member";
    ExpressionType[ExpressionType["Index"] = 30] = "Index";
})(ExpressionType || (ExpressionType = {}));
var Binder = (function (_super) {
    __extends(Binder, _super);
    function Binder(resources) {
        _super.call(this);
        this._stack = new Array();
        this._resources = resources;
    }
    Binder.prototype.VisitParameter = function (node) {
        var found = false;
        for (var i = this._stack.length - 1; i >= 0; i--) {
            if (this._stack[i].indexOf(node) >= 0) {
                found = true;
                break;
            }
        }
        if (!found) {
            return Expression.Constant(this._resources[node.name]);
        }
        return node;
    };
    Binder.prototype.VisitLambda = function (node) {
        this._stack.push(node.parameters);
        this.Visit(node.body);
        this._stack.pop();
        return node;
    };
    return Binder;
})(ExpressionVisitor);
var resources = {
    "my://xs": [1, 2, 3, 4, 5],
    "my://ss": ["bar", "foo", "qux"],
    "rx://operators/filter": function (xs, f) { return xs.filter(f); },
    "rx://operators/map": function (xs, f) { return xs.map(f); },
};
var x = Expression.Parameter("x");
var f1 = Expression.Invoke(Expression.Parameter("rx://operators/map"), Expression.Invoke(Expression.Parameter("rx://operators/filter"), Expression.Parameter("my://xs"), Expression.Lambda(Expression.Equal(Expression.Modulo(x, Expression.Constant(2)), Expression.Constant(0)), x)), Expression.Lambda(Expression.Multiply(x, x), x));
var f2 = Expression.Invoke(Expression.Parameter("rx://operators/map"), Expression.Parameter("my://ss"), Expression.Lambda(Expression.Call(x, "substring", Expression.Constant(1)), x));
var binder = new Binder(resources);
var b1 = Expression.Lambda(binder.Visit(f1));
var c1 = b1.Compile();
var r1 = c1();
alert(r1.join(", "));
var b2 = Expression.Lambda(binder.Visit(f2));
var c2 = b2.Compile();
var r2 = c2();
alert(r2.join(", "));
