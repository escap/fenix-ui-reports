define(['jquery', "fx-rp-config", 'amplify'], function ($, PluginCOFIG) {

    'use strict';


    var pluginChosen;


    var EXPORT_ACCESS_POINT = '/fenix/export';


    var o = {
        "success": ""
    };


    function FenixReports() {

        this.o = o;

        this.o.success = function (Plugin) {
            pluginChosen = new Plugin;
        };

        this.o.error = function () {
            console.error("Something went wrong on plugin creation");
        };
    };


    FenixReports.prototype.init = function (plugin) {

        if (typeof plugin !== 'undefined' && plugin !== null && plugin !== '' &&
            typeof  PluginCOFIG[plugin] !== 'undefined' && PluginCOFIG[plugin]) {
            require(['' + PluginCOFIG[plugin]], o.success, o.error);
        }
        else {
            throw new Error('please define a valid plugin name');
        }
    };


    FenixReports.prototype.exportData = function (config, url, successCallBack, errorCallback) {

        var payload = pluginChosen.process(config);


        var self = this;

        url += EXPORT_ACCESS_POINT;

        $.ajax({
            url: url,
            crossDomain: true,
            type: 'POST',
            data: JSON.stringify(payload),
            contentType: 'application/json',
            success: function (data) {

                var locUrl = url +'?'+ data.substr(data.indexOf('id'));
                
                if($.isFunction(successCallBack))
                    successCallBack(locUrl);

                window.location = locUrl;
            },
            beforeSend: function () {
               amplify.publish('fx.reports.hasSent');
            },
            complete : function() {
                amplify.publish('fx.reports.hasCompleted');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                
                alert("error occurred");

                if($.isFunction(errorCallback))
                    errorCallback({
                        'jqXHR': jqXHR,
                        'textStatus': textStatus,
                        'errorThrown': errorThrown
                    });
            }
        });
    };

    return FenixReports;
})