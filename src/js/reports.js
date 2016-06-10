define([
    'jquery',
    "underscore",
    "fx-rp-plugins-factory",
    "fx-reports/config/config",
    "fx-common/bridge",
    'amplify'
],
    function ($, _, PluginFactory, C, Bridge) {

    'use strict';

    function FenixReports(o) {
        var opts = o || {};
        this._$pluginChosen = null;
        this.channels = {};
        this.cache = opts.cache;
        this.environment = opts.environment;
        this.bridge = new Bridge({
            cache : this.cache,
            environment : this.environment
        })
    }

    /**
     * pub/sub
     * @return {Object} component instance
     */
    FenixReports.prototype.on = function (channel, fn, context) {
        var _context = context || this;
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: _context, callback: fn});
        return this;
    };

    FenixReports.prototype._trigger = function (channel) {
        if (!this.channels[channel]) {
            return false;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, l = this.channels[channel].length; i < l; i++) {
            var subscription = this.channels[channel][i];
            subscription.callback.apply(subscription.context, args);
        }
        return this;
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

        amplify.publish('fx.reports.hasSent');

        var payload = this._$pluginChosen.process(obj.config);

        this.bridge.exportResource(payload).then(
            _.bind(this._fulfillRequest, this),
                _.bind(this._rejectResponse, this));
    };


    FenixReports.prototype._rejectResponse = function (value) {
        amplify.publish('fx.reports.hasError');

        this._trigger("error");

        alert("Error occurred during download resource");

    };

    FenixReports.prototype._fulfillRequest = function (value) {

        amplify.publish('fx.reports.hasCompleted');

        this._trigger("complete");

        var locUrl = value.url + '?' + value.data.substr(value.data.indexOf('id'));

        window.location = locUrl;

    };

    return FenixReports;
});