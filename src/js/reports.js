define([
    'jquery',
    "fx-rp-plugins-factory",
    "fx-reports/config/config",
    "fx-reports/config/config-default",
    "fx-common/bridge",
    "q",
    'amplify'], function ($, PluginFactory, C, DC, Bridge, Q) {

    'use strict';

    function FenixReports() {
        this._$pluginChosen = null;
    };

    FenixReports.prototype.init = function (plugin) {
        if (typeof plugin !== 'undefined' && plugin !== null && plugin !== '') {
            this._$pluginChosen = PluginFactory(plugin);
        }
        else {
            throw new Error('please define a valid plugin name');
        }
    };


    FenixReports.prototype.exportData = function (obj) {

        var self = this;
        amplify.publish('fx.reports.hasSent');
        var payload = this._$pluginChosen.process(obj.config)

        Bridge.exportResource(payload).then(
            self._fullfillRequest,
            self._rejectResponse);
    };


    FenixReports.prototype._rejectResponse = function (value) {
        amplify.publish('fx.reports.hasError');
        alert("error occurred");
    };

    FenixReports.prototype._fullfillRequest = function (value) {

        amplify.publish('fx.reports.hasCompleted');

        var locUrl = value.url + '?' + value.data.substr(value.data.indexOf('id'));

        window.location = locUrl;
    };

    return FenixReports;
})