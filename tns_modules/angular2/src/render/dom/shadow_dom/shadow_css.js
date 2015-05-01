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
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var ShadowCss = (function () {
    function ShadowCss() {
        this.strictStyling = true;
    }
    ShadowCss.prototype.shimStyle = function (style, selector, hostSelector) {
        if (hostSelector === void 0) { hostSelector = ''; }
        var cssText = dom_adapter_1.DOM.getText(style);
        return this.shimCssText(cssText, selector, hostSelector);
    };
    ShadowCss.prototype.shimCssText = function (cssText, selector, hostSelector) {
        if (hostSelector === void 0) { hostSelector = ''; }
        cssText = this._insertDirectives(cssText);
        return this._scopeCssText(cssText, selector, hostSelector);
    };
    ShadowCss.prototype._insertDirectives = function (cssText) {
        cssText = this._insertPolyfillDirectivesInCssText(cssText);
        return this._insertPolyfillRulesInCssText(cssText);
    };
    ShadowCss.prototype._insertPolyfillDirectivesInCssText = function (cssText) {
        return lang_1.StringWrapper.replaceAllMapped(cssText, _cssContentNextSelectorRe, function (m) {
            return m[1] + '{';
        });
    };
    ShadowCss.prototype._insertPolyfillRulesInCssText = function (cssText) {
        return lang_1.StringWrapper.replaceAllMapped(cssText, _cssContentRuleRe, function (m) {
            var rule = m[0];
            rule = lang_1.StringWrapper.replace(rule, m[1], '');
            rule = lang_1.StringWrapper.replace(rule, m[2], '');
            return m[3] + rule;
        });
    };
    ShadowCss.prototype._scopeCssText = function (cssText, scopeSelector, hostSelector) {
        var _this = this;
        var unscoped = this._extractUnscopedRulesFromCssText(cssText);
        cssText = this._insertPolyfillHostInCssText(cssText);
        cssText = this._convertColonHost(cssText);
        cssText = this._convertColonHostContext(cssText);
        cssText = this._convertShadowDOMSelectors(cssText);
        if (lang_1.isPresent(scopeSelector)) {
            _withCssRules(cssText, function (rules) {
                cssText = _this._scopeRules(rules, scopeSelector, hostSelector);
            });
        }
        cssText = cssText + '\n' + unscoped;
        return cssText.trim();
    };
    ShadowCss.prototype._extractUnscopedRulesFromCssText = function (cssText) {
        var r = '', m;
        var matcher = lang_1.RegExpWrapper.matcher(_cssContentUnscopedRuleRe, cssText);
        while (lang_1.isPresent(m = lang_1.RegExpMatcherWrapper.next(matcher))) {
            var rule = m[0];
            rule = lang_1.StringWrapper.replace(rule, m[2], '');
            rule = lang_1.StringWrapper.replace(rule, m[1], m[3]);
            r = rule + '\n\n';
        }
        return r;
    };
    ShadowCss.prototype._convertColonHost = function (cssText) {
        return this._convertColonRule(cssText, _cssColonHostRe, this._colonHostPartReplacer);
    };
    ShadowCss.prototype._convertColonHostContext = function (cssText) {
        return this._convertColonRule(cssText, _cssColonHostContextRe, this._colonHostContextPartReplacer);
    };
    ShadowCss.prototype._convertColonRule = function (cssText, regExp, partReplacer) {
        return lang_1.StringWrapper.replaceAllMapped(cssText, regExp, function (m) {
            if (lang_1.isPresent(m[2])) {
                var parts = m[2].split(','), r = [];
                for (var i = 0; i < parts.length; i++) {
                    var p = parts[i];
                    if (lang_1.isBlank(p))
                        break;
                    p = p.trim();
                    collection_1.ListWrapper.push(r, partReplacer(_polyfillHostNoCombinator, p, m[3]));
                }
                return r.join(',');
            }
            else {
                return _polyfillHostNoCombinator + m[3];
            }
        });
    };
    ShadowCss.prototype._colonHostContextPartReplacer = function (host, part, suffix) {
        if (lang_1.StringWrapper.contains(part, _polyfillHost)) {
            return this._colonHostPartReplacer(host, part, suffix);
        }
        else {
            return host + part + suffix + ', ' + part + ' ' + host + suffix;
        }
    };
    ShadowCss.prototype._colonHostPartReplacer = function (host, part, suffix) {
        return host + lang_1.StringWrapper.replace(part, _polyfillHost, '') + suffix;
    };
    ShadowCss.prototype._convertShadowDOMSelectors = function (cssText) {
        for (var i = 0; i < _shadowDOMSelectorsRe.length; i++) {
            cssText = lang_1.StringWrapper.replaceAll(cssText, _shadowDOMSelectorsRe[i], ' ');
        }
        return cssText;
    };
    ShadowCss.prototype._scopeRules = function (cssRules, scopeSelector, hostSelector) {
        var cssText = '';
        if (lang_1.isPresent(cssRules)) {
            for (var i = 0; i < cssRules.length; i++) {
                var rule = cssRules[i];
                if (dom_adapter_1.DOM.isStyleRule(rule) || dom_adapter_1.DOM.isPageRule(rule)) {
                    cssText += this._scopeSelector(rule.selectorText, scopeSelector, hostSelector, this.strictStyling) + ' {\n';
                    cssText += this._propertiesFromRule(rule) + '\n}\n\n';
                }
                else if (dom_adapter_1.DOM.isMediaRule(rule)) {
                    cssText += '@media ' + rule.media.mediaText + ' {\n';
                    cssText += this._scopeRules(rule.cssRules, scopeSelector, hostSelector);
                    cssText += '\n}\n\n';
                }
                else {
                    try {
                        if (lang_1.isPresent(rule.cssText)) {
                            cssText += rule.cssText + '\n\n';
                        }
                    }
                    catch (x) {
                        if (dom_adapter_1.DOM.isKeyframesRule(rule) && lang_1.isPresent(rule.cssRules)) {
                            cssText += this._ieSafeCssTextFromKeyFrameRule(rule);
                        }
                    }
                }
            }
        }
        return cssText;
    };
    ShadowCss.prototype._ieSafeCssTextFromKeyFrameRule = function (rule) {
        var cssText = '@keyframes ' + rule.name + ' {';
        for (var i = 0; i < rule.cssRules.length; i++) {
            var r = rule.cssRules[i];
            cssText += ' ' + r.keyText + ' {' + r.style.cssText + '}';
        }
        cssText += ' }';
        return cssText;
    };
    ShadowCss.prototype._scopeSelector = function (selector, scopeSelector, hostSelector, strict) {
        var r = [], parts = selector.split(',');
        for (var i = 0; i < parts.length; i++) {
            var p = parts[i];
            p = p.trim();
            if (this._selectorNeedsScoping(p, scopeSelector)) {
                p = strict && !lang_1.StringWrapper.contains(p, _polyfillHostNoCombinator) ? this._applyStrictSelectorScope(p, scopeSelector) : this._applySelectorScope(p, scopeSelector, hostSelector);
            }
            collection_1.ListWrapper.push(r, p);
        }
        return r.join(', ');
    };
    ShadowCss.prototype._selectorNeedsScoping = function (selector, scopeSelector) {
        var re = this._makeScopeMatcher(scopeSelector);
        return !lang_1.isPresent(lang_1.RegExpWrapper.firstMatch(re, selector));
    };
    ShadowCss.prototype._makeScopeMatcher = function (scopeSelector) {
        var lre = lang_1.RegExpWrapper.create('\\[');
        var rre = lang_1.RegExpWrapper.create('\\]');
        scopeSelector = lang_1.StringWrapper.replaceAll(scopeSelector, lre, '\\[');
        scopeSelector = lang_1.StringWrapper.replaceAll(scopeSelector, rre, '\\]');
        return lang_1.RegExpWrapper.create('^(' + scopeSelector + ')' + _selectorReSuffix, 'm');
    };
    ShadowCss.prototype._applySelectorScope = function (selector, scopeSelector, hostSelector) {
        return this._applySimpleSelectorScope(selector, scopeSelector, hostSelector);
    };
    ShadowCss.prototype._applySimpleSelectorScope = function (selector, scopeSelector, hostSelector) {
        if (lang_1.isPresent(lang_1.RegExpWrapper.firstMatch(_polyfillHostRe, selector))) {
            var replaceBy = this.strictStyling ? "[" + hostSelector + "]" : scopeSelector;
            selector = lang_1.StringWrapper.replace(selector, _polyfillHostNoCombinator, replaceBy);
            return lang_1.StringWrapper.replaceAll(selector, _polyfillHostRe, replaceBy + ' ');
        }
        else {
            return scopeSelector + ' ' + selector;
        }
    };
    ShadowCss.prototype._applyStrictSelectorScope = function (selector, scopeSelector) {
        var isRe = lang_1.RegExpWrapper.create('\\[is=([^\\]]*)\\]');
        scopeSelector = lang_1.StringWrapper.replaceAllMapped(scopeSelector, isRe, function (m) { return m[1]; });
        var splits = [' ', '>', '+', '~'], scoped = selector, attrName = '[' + scopeSelector + ']';
        for (var i = 0; i < splits.length; i++) {
            var sep = splits[i];
            var parts = scoped.split(sep);
            scoped = collection_1.ListWrapper.map(parts, function (p) {
                var t = lang_1.StringWrapper.replaceAll(p.trim(), _polyfillHostRe, '');
                if (t.length > 0 && !collection_1.ListWrapper.contains(splits, t) && !lang_1.StringWrapper.contains(t, attrName)) {
                    var re = lang_1.RegExpWrapper.create('([^:]*)(:*)(.*)');
                    var m = lang_1.RegExpWrapper.firstMatch(re, t);
                    if (lang_1.isPresent(m)) {
                        p = m[1] + attrName + m[2] + m[3];
                    }
                }
                return p;
            }).join(sep);
        }
        return scoped;
    };
    ShadowCss.prototype._insertPolyfillHostInCssText = function (selector) {
        selector = lang_1.StringWrapper.replaceAll(selector, _colonHostContextRe, _polyfillHostContext);
        selector = lang_1.StringWrapper.replaceAll(selector, _colonHostRe, _polyfillHost);
        return selector;
    };
    ShadowCss.prototype._propertiesFromRule = function (rule) {
        var cssText = rule.style.cssText;
        var attrRe = lang_1.RegExpWrapper.create('[\'"]+|attr');
        if (rule.style.content.length > 0 && !lang_1.isPresent(lang_1.RegExpWrapper.firstMatch(attrRe, rule.style.content))) {
            var contentRe = lang_1.RegExpWrapper.create('content:[^;]*;');
            cssText = lang_1.StringWrapper.replaceAll(cssText, contentRe, 'content: \'' + rule.style.content + '\';');
        }
        return cssText;
    };
    return ShadowCss;
})();
exports.ShadowCss = ShadowCss;
Object.defineProperty(ShadowCss.prototype.shimStyle, "parameters", { get: function () {
        return [[], [assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(ShadowCss.prototype.shimCssText, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(ShadowCss.prototype._insertDirectives, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(ShadowCss.prototype._insertPolyfillDirectivesInCssText, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(ShadowCss.prototype._insertPolyfillRulesInCssText, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(ShadowCss.prototype._scopeCssText, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(ShadowCss.prototype._extractUnscopedRulesFromCssText, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(ShadowCss.prototype._convertColonHost, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(ShadowCss.prototype._convertColonHostContext, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(ShadowCss.prototype._convertColonRule, "parameters", { get: function () {
        return [[assert.type.string], [lang_1.RegExp], [Function]];
    } });
Object.defineProperty(ShadowCss.prototype._colonHostContextPartReplacer, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(ShadowCss.prototype._colonHostPartReplacer, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(ShadowCss.prototype._convertShadowDOMSelectors, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(ShadowCss.prototype._scopeRules, "parameters", { get: function () {
        return [[], [assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(ShadowCss.prototype._scopeSelector, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string], [assert.type.string], [assert.type.boolean]];
    } });
Object.defineProperty(ShadowCss.prototype._selectorNeedsScoping, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(ShadowCss.prototype._makeScopeMatcher, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
Object.defineProperty(ShadowCss.prototype._applySelectorScope, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(ShadowCss.prototype._applySimpleSelectorScope, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(ShadowCss.prototype._applyStrictSelectorScope, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(ShadowCss.prototype._insertPolyfillHostInCssText, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
var _cssContentNextSelectorRe = lang_1.RegExpWrapper.create('polyfill-next-selector[^}]*content:[\\s]*?[\'"](.*?)[\'"][;\\s]*}([^{]*?){', 'im');
var _cssContentRuleRe = lang_1.RegExpWrapper.create('(polyfill-rule)[^}]*(content:[\\s]*[\'"](.*?)[\'"])[;\\s]*[^}]*}', 'im');
var _cssContentUnscopedRuleRe = lang_1.RegExpWrapper.create('(polyfill-unscoped-rule)[^}]*(content:[\\s]*[\'"](.*?)[\'"])[;\\s]*[^}]*}', 'im');
var _polyfillHost = '-shadowcsshost';
var _polyfillHostContext = '-shadowcsscontext';
var _parenSuffix = ')(?:\\((' + '(?:\\([^)(]*\\)|[^)(]*)+?' + ')\\))?([^,{]*)';
var _cssColonHostRe = lang_1.RegExpWrapper.create('(' + _polyfillHost + _parenSuffix, 'im');
var _cssColonHostContextRe = lang_1.RegExpWrapper.create('(' + _polyfillHostContext + _parenSuffix, 'im');
var _polyfillHostNoCombinator = _polyfillHost + '-no-combinator';
var _shadowDOMSelectorsRe = [lang_1.RegExpWrapper.create('>>>'), lang_1.RegExpWrapper.create('::shadow'), lang_1.RegExpWrapper.create('::content'), lang_1.RegExpWrapper.create('/deep/'), lang_1.RegExpWrapper.create('/shadow-deep/'), lang_1.RegExpWrapper.create('/shadow/')];
var _selectorReSuffix = '([>\\s~+\[.,{:][\\s\\S]*)?$';
var _polyfillHostRe = lang_1.RegExpWrapper.create(_polyfillHost, 'im');
var _colonHostRe = lang_1.RegExpWrapper.create(':host', 'im');
var _colonHostContextRe = lang_1.RegExpWrapper.create(':host-context', 'im');
function _cssToRules(cssText) {
    return dom_adapter_1.DOM.cssToRules(cssText);
}
Object.defineProperty(_cssToRules, "parameters", { get: function () {
        return [[assert.type.string]];
    } });
function _withCssRules(cssText, callback) {
    if (lang_1.isBlank(callback))
        return;
    var rules = _cssToRules(cssText);
    callback(rules);
}
Object.defineProperty(_withCssRules, "parameters", { get: function () {
        return [[assert.type.string], [Function]];
    } });
