/*
 * ajax-helpers.js
 *
 * Some rudimentary helpers for making ajax requests.
 *
 * See usage instructions, including limitations, here:
 * https://github.com/amirkour/instructor_code_challenge/wiki
 *
 * Assumes window.JSON is present (which is true for modern browsers.)
 * 
 * For JSON support in older browsers, please see:
 * https://github.com/douglascrockford/JSON-js
 *
 * For a definition of "older browsers" (and support for window.JSON) please see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
 */
var ajaxHelpers = (function(window,document,JSON,undefined){

    if(window.ajaxHelpers) return window.ajaxHelpers;
    if(JSON == null) throw "Ajax helpers require JSON object/support - cannot continue, please see https://github.com/douglascrockford/JSON-js";

    // for now, only support the bare-minimum for demo purposes
    var supportedAjaxRequestTypes = ['get','post'];

    // just an empty helper function, for utility
    function cbEmpty(){}

    var exports = {
        request:function(options){
            var xmlhttp,
                options = options || {},
                cbSuccess = typeof options.success === 'function' ? options.success : cbEmpty,
                cbError = typeof options.error === 'function' ? options.error : cbEmpty,
                type = options.type || 'get',
                url = options.url,
                data = options.data;

            if(typeof url !== 'string') throw "Cannot make ajax request - missing required 'url' parameter";
            if(typeof type !== 'string' || type.length <= 0) throw "Cannot make ajax request - missing required 'type' parameter";

            type = type.toLowerCase();
            if(supportedAjaxRequestTypes.indexOf(type) < 0) throw "Cannot make ajax request of type '" + type + "' - must be one of " + supportedAjaxRequestTypes.join(',');

            // code for IE7+, Firefox, Chrome, Opera, Safari
            if (window.XMLHttpRequest)
            {
                xmlhttp=new XMLHttpRequest();
            }

            // code for IE6, IE5
            else
            {
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }

            xmlhttp.onreadystatechange = function(){
                if (xmlhttp.readyState === 4){ // request is finished, response is ready
                    switch(xmlhttp.status){
                        case 200:
                            cbSuccess.call(xmlhttp, xmlhttp.responseText);
                            break;
                        default:
                            cbError.call(xmlhttp, xmlhttp.status, xmlhttp);
                            break;
                    }
                }
            };

            xmlhttp.open(type,url,true);
            if(type === 'post') xmlhttp.setRequestHeader("Content-type","application/json");
            if(data != null)
                xmlhttp.send(JSON.stringify(data));
            else
                xmlhttp.send();
        }
    };

    return exports;

})(window,document,JSON);
