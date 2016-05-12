define([
    'jquery', 
    "fx-rp-plugins-factory", 
    "fx-reports/config/config",
    "fx-reports/config/config-default",
    "q",
    'amplify'], function ($, PluginFactory, C, DC, Q) {

    'use strict';


    var EXPORT_ACCESS_POINT = '/fenix/export';


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


    FenixReports.prototype.exportData = function ( obj ) {

        var url = '';

        if (obj.url) {
            url += EXPORT_ACCESS_POINT;
        } else {
            url = (C.EXPORT_URL || DC.EXPORT_URL) + EXPORT_ACCESS_POINT
        }

        var payload = this._$pluginChosen.process(obj.config);

        $.ajax({
            url: url,
            crossDomain: true,
            type: 'POST',
            data: JSON.stringify(payload),
            contentType: 'application/json',
            success: function (data) {

                var locUrl = url + '?' + data.substr(data.indexOf('id'));

                if ($.isFunction(obj.success))
                    obj.success(locUrl);

                window.location = locUrl;
            },
            beforeSend: function () {
                amplify.publish('fx.reports.hasSent');
            },
            complete: function () {
                amplify.publish('fx.reports.hasCompleted');
            },
            error: function (jqXHR, textStatus, errorThrown) {

                alert("error occurred");

                if ($.isFunction(obj.error))
                    obj.error({
                        'jqXHR': jqXHR,
                        'textStatus': textStatus,
                        'errorThrown': errorThrown
                    });
                }
        });
    };

    return FenixReports;
})