/**
 * Created by roy wang on 2015/11/26.
 */
requirejs.config({
    baseUrl: base_path+"/",
    paths : {
        jquery : "bower_components/jquery/dist/jquery",
        form : 'javascripts/lib/form',
        http : 'javascripts/lib/requirejs-http',
        utils : 'javascripts/lib/requirejs-utils',
        window : 'javascripts/lib/window',
        css : 'javascripts/lib/requirejs-css',
        'jquery.validate' : 'bower_components/jquery.validate/jquery.validate',
        'jquery.validate.zh' : 'bower_components/jquery.validate/localization/messages_zh'
    },
    shim : {
        jquery : {
            exports : '$'
        },
        'jquery.validate' : {
            deps : ['jquery','css!stylesheets/jquery.validate.css'],
            exports : '$.fn.validate'
        },
        'jquery.validate.zh' : ['jquery.validate']
    }
});