define(function () {

    var config = {
        paths: {
            'jquery': '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            'amplify' : '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',
            "fx-rp-config"      :  "./registry/PluginsRegistry",
            "fx-rp-metadata"    : "./plugins/metadata/MetadataValidator",
            "fx-rp-table"       : "./plugins/table/TableValidator",
            "fx-rp-surveyFMD"   : "./plugins/fmd/FMDValidator",
            "fx-report"         :  "./start"
        },
        shim: {
            'amplify' : {
                deps : ['jquery']
            }
        }
    };

    return config;
});