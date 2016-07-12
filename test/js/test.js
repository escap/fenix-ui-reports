define([
    'loglevel',
    'jquery',
    'underscore',
    'fx-reports/start',
], function (log, $, _, Reports) {

    'use strict';

    var s = { },
        instances = [],
        environment = "develop"; //"develop" || "production"

    function Test() { }

    Test.prototype.start = function () {

        log.trace("Test started");

        this._render();

    };

    Test.prototype._render = function () {

        console.log(Reports)

    };

    Test.prototype._createInstance = function (params) {

        var instance = new Reports(params);

        instances.push(instance);

        return instance;
    };

    return new Test();

});