if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'loglevel',
    'jquery',
    'underscore',
    'fx-reports/start',
    'text!test/json/uneca_population.json'
], function (log, $, _, Reports, Model) {

    'use strict';

    var instances = [],
        lang = "EN",
        cache = false,
        model = JSON.parse(Model),
        uid = "UNECA_Health",
        template = "fao",
        environment = "production"; //"develop" || "production",

    function Test() {
    }

    Test.prototype.start = function () {

        log.trace("Test started");

        this._render();

    };

    Test.prototype._render = function () {

        var self = this;

        $("[data-format]").each(function () {

            var $this = $(this),
                format = $this.data("format");

            $this.on("click", {format: format}, function (e) {
                e.preventDefault();

                log.info("Export as: " + format);

                self._export(format)

            });
        });

    };

    Test.prototype._export = function (format) {

        this.report = this._createInstance({
            environment: environment,
            cache: cache
        });

        switch (format) {
            case "table" :

                var payload = {
                    resource: model,
                    input: {
                        config: {}
                    },
                    output: {
                        config: {
                            lang: lang.toUpperCase()
                        }
                    }
                };

                log.info("Configure FENIX export: table");

                log.info(payload);

                this.report.export({
                    format: "table",
                    config: payload
                });

                break;
            case "metadata" :

                var payload = {
                    resource: {
                        metadata: {
                            uid: uid
                        },
                        data: []
                    },
                    input: {
                        config: {}
                    },
                    output: {
                        config: {
                            template: template,
                            lang: lang.toUpperCase(),
                            fileName: 'fx_report_test.pdf'
                        }
                    }
                };

                log.info("Configure FENIX export: metadata");

                log.info(payload);

                this.report.export({
                    format: "metadata",
                    config: payload
                });

                break;
            default:
                alert(format + " is not valid format");
        }
    };

    Test.prototype._createInstance = function (params) {

        var instance = new Reports(params);

        instances.push(instance);

        return instance;
    };

    return new Test();

});