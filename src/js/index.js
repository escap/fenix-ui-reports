define([
    "jquery",
    "fenix-ui-bridge",
    "./validators/metadata",
    "./validators/table",
    "loglevel"
], function ($, Bridge, Metadata, Table, log) {

    'use strict';

    var PluginRegistry = {
        'metadata': Metadata,
        'table': Table
    };

    function Reports(o) {
        log.info("FENIX reports");
        log.info(o);

        var opts = o || {};

        this.channels = {};

        this.cache = opts.cache;

        this.environment = opts.environment;

        this.bridge = new Bridge({
            cache: this.cache,
            environment: this.environment
        })
    }

    /**
     * pub/sub
     * @return {Object} component instance
     */
    Reports.prototype.on = function (channel, fn, context) {
        var _context = context || this;
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: _context, callback: fn});
        return this;
    };

    /**
     * Export resource
     * @param obj {Object}
     * @return {Promise}
     */
    Reports.prototype.export = function (obj) {
        log.info("Export resource");
        log.info(obj);

        if (PluginRegistry.hasOwnProperty(obj.format)) {
            log.info("format: " + obj.format);
            this._$pluginChosen = new PluginRegistry[obj.format];
        } else {
            log.error("Invalid format: " + obj.format);
            throw new Error('please define a valid plugin name');
        }

        var payload = this._$pluginChosen.process(obj.config);

        this._trigger("export.start", payload);

        return this.bridge.export(payload).then(
            $.proxy(this._fulfillRequest, this),
            $.proxy(this._rejectResponse, this));
    };

    // end of API

    Reports.prototype._trigger = function (channel) {
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

    Reports.prototype._rejectResponse = function (value) {

        this._trigger("export.error");

        log.error("Error on resource export");
        log.error(value);

        alert("Error occurred during resource export.");

    };

    Reports.prototype._fulfillRequest = function (value) {

        this._trigger("export.success");

        log.info("Resource export success");
        log.info(value);

        var locUrl = value.url + '?' + value.data.substr(value.data.indexOf('id'));

        window.location = locUrl;

    };

    return Reports;
});