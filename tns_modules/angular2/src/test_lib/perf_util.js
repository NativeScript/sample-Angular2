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
var testUtil = require('./e2e_util');
var benchpress = require('benchpress/benchpress');
module.exports = {
    runClickBenchmark: runClickBenchmark,
    runBenchmark: runBenchmark,
    verifyNoBrowserErrors: testUtil.verifyNoBrowserErrors
};
function runClickBenchmark(config) {
    var buttons = config.buttons.map(function (selector) {
        return $(selector);
    });
    config.work = function () {
        buttons.forEach(function (button) {
            button.click();
        });
    };
    return runBenchmark(config);
}
function runBenchmark(config) {
    return getScaleFactor(browser.params.benchmark.scaling).then(function (scaleFactor) {
        var description = {};
        var urlParams = [];
        if (config.params) {
            config.params.forEach(function (param) {
                var name = param.name;
                var value = applyScaleFactor(param.value, scaleFactor, param.scale);
                urlParams.push(name + '=' + value);
                description[name] = value;
            });
        }
        var url = encodeURI(config.url + '?' + urlParams.join('&'));
        browser.get(url);
        return benchpressRunner.sample({
            id: config.id,
            execute: config.work,
            prepare: config.prepare,
            microMetrics: config.microMetrics,
            bindings: [benchpress.bind(benchpress.Options.SAMPLE_DESCRIPTION).toValue(description)]
        });
    });
}
function getScaleFactor(possibleScalings) {
    return browser.executeScript('return navigator.userAgent').then(function (userAgent) {
        var scaleFactor = 1;
        possibleScalings.forEach(function (entry) {
            if (userAgent.match(entry.userAgent)) {
                scaleFactor = entry.value;
            }
        });
        return scaleFactor;
    });
}
function applyScaleFactor(value, scaleFactor, method) {
    if (method === 'log2') {
        return value + Math.log2(scaleFactor);
    }
    else if (method === 'sqrt') {
        return value * Math.sqrt(scaleFactor);
    }
    else if (method === 'linear') {
        return value * scaleFactor;
    }
    else {
        return value;
    }
}
