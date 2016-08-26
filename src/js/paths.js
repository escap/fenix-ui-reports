if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(function () {

    var config = {

        paths: {
            jquery: '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            loglevel: '{FENIX_CDN}/js/loglevel/1.4.0/loglevel',

            "fx-reports/start": "./reports",
            "fx-reports/config": "../../config",
            "fx-reports/validators": "./validators",
            
        },

        shim : {}

    };

    return config;
});