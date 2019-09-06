/**
 * Created by MYAX on 6/5/2015.
 */
Ext.define('Ext.ux.util.Configuration',
    // {  singleton: true},

    (function() {
        var Ex = Ext;

        Ex.logFn = function(message) {
            console.log(message);
        };
        Ex.logger = (function() {
            var oldConsoleLog = null;
            var pub = {};

            pub.enableLogger = function enableLogger() {
                if (oldConsoleLog == null) {
                    return;
                }
                window['console']['log'] = oldConsoleLog;
            };

            pub.disableLogger = function disableLogger() {
                oldConsoleLog = console.log;
                delete window['console']['log'];
            };
            pub.disableLogger();
            return pub;
        }());

        String.format = function() {
            // The string containing the format items (e.g. "{0}")
            // will and always has to be the first argument.
            var theString = arguments[0];
            // start with the second argument (i = 1)
            for (var i = 1; i < arguments.length; i++) {
                // "gm" = RegEx options for Global search (more than one instance)
                // and for Multiline search
                var regEx = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
                theString = theString.replace(regEx, arguments[i]);
            }
            return theString;
        };

        Ex.guid = function() {
            // http://www.ietf.org/rfc/rfc4122.txt
            var s = [];
            var hexDigits = '0123456789abcdef';
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = '-';

            return s.join('');
        };
        return {
            // requires: ['Ext.ux.util.*']
        };
    })());