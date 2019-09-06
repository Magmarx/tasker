/**
 * Created by MYAX on 6/5/2015.
 */
Ext.define('Ext.ux.util.Compatibility', {
    singleton: true,
    constructor: function() {
            /* overcharged object */
            if (typeof Object.keys !== 'function') {
                (function() {
                    Object.keys = Object_keys;

                    function Object_keys(obj) {
                        var keys = [],
                            name;
                        for (name in obj) {
                            if (obj.hasOwnProperty(name)) {
                                keys.push(name);
                            }
                        }
                        return keys;
                    }
                })();
            }

            /* overcharged functions */
            if (Array) {
                if (Array.prototype) {
                    // add function remove to array
                    if (!Array.prototype.remove) {
                        Array.prototype.remove = function(e) {
                            var t, _ref;
                            if ((t = this.indexOf(e)) > -1) {
                                return ([].splice.apply(this, [t, t - t + 1].concat(_ref = [])), _ref);
                            }
                        };
                    }
                    if (!Array.prototype.indexOf) {
                        Array.prototype.indexOf = function(obj) {
                            for (var i = 0; i < this.length; i++) {
                                if (this[i] == obj) {
                                    return i;
                                }
                            }
                            return -1;
                        };
                    }
                    // add function array contains value
                    if (!Array.prototype.contains) {
                        Array.prototype.contains = function(obj) {
                            for (var i = 0; i < this.length; i++) {
                                if (this[i] === obj) {
                                    return true;
                                }
                            }
                            return false;
                        };
                    }
                }
                if (!Array.isArray) {
                    Array.isArray = function(obj) {
                        return Object.prototype.toString.call(obj) === '[object Array]' ? true : false;
                    };
                }
            }

            // string
            if (String) {
                if (!String.prototype.trim) {
                    String.prototype.trim = function() {
                        return this.replace(/^\s+|\s+$/g, '');
                    };
                }
                if (!String.prototype.ltrim) {
                    String.prototype.ltrim = function() {
                        return this.replace(/^\s+/, '');
                    };
                }
                if (!String.prototype.rtrim) {
                    String.prototype.rtrim = function() {
                        return this.replace(/\s+$/, '');
                    };
                }
            }

            if (Ext.isIE9m) {
                (function() {
                    if (!window.console) {
                        window.console = {};
                    }
                    // union of Chrome, FF, IE, and Safari console methods
                    var m = [
                        'log', 'info', 'warn', 'error', 'debug', 'trace', 'dir', 'group',
                        'groupCollapsed', 'groupEnd', 'time', 'timeEnd', 'profile', 'profileEnd',
                        'dirxml', 'assert', 'count', 'markTimeline', 'timeStamp', 'clear'
                    ];
                    // define undefined methods as noops to prevent errors
                    for (var i = 0; i < m.length; i++) {
                        if (!window.console[m[i]]) {
                            window.console[m[i]] = function() {};
                        }
                    }
                })();
                if ('document' in self && !('classList' in document.createElement('_'))) {
                    (function(view) {
                        'use strict';
                        if (!('Element' in view)) return;
                        var
                            classListProp = 'classList',
                            protoProp = 'prototype',
                            elemCtrProto = view.Element[protoProp],
                            objCtr = Object,
                            strTrim = String[protoProp].trim || function() {
                                return this.replace(/^\s+|\s+$/g, '');
                            },
                            arrIndexOf = Array[protoProp].indexOf || function(item) {
                                var
                                    i = 0,
                                    len = this.length;
                                for (; i < len; i++) {
                                    if (i in this && this[i] === item) {
                                        return i;
                                    }
                                }
                                return -1;
                            },
                            // Vendors: please allow content code to instantiate DOMExceptions
                            DOMEx = function(type, message) {
                                this.name = type;
                                this.code = DOMException[type];
                                this.message = message;
                            },
                            checkTokenAndGetIndex = function(classList, token) {
                                if (token === '') {
                                    throw new DOMEx(
                                        'SYNTAX_ERR', 'An invalid or illegal string was specified'
                                    );
                                }
                                if (/\s/.test(token)) {
                                    throw new DOMEx(
                                        'INVALID_CHARACTER_ERR', 'String contains an invalid character'
                                    );
                                }
                                return arrIndexOf.call(classList, token);
                            },
                            ClassList = function(elem) {
                                var
                                    trimmedClasses = strTrim.call(elem.getAttribute('class') || ''),
                                    classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
                                    i = 0,
                                    len = classes.length;
                                for (; i < len; i++) {
                                    this.push(classes[i]);
                                }
                                this._updateClassName = function() {
                                    elem.setAttribute('class', this.toString());
                                };
                            },
                            classListProto = ClassList[protoProp] = [],
                            classListGetter = function() {
                                return new ClassList(this);
                            };
                        // Most DOMException implementations don't allow calling DOMException's toString()
                        // on non-DOMExceptions. Error's toString() is sufficient here.
                        DOMEx[protoProp] = Error[protoProp];
                        classListProto.item = function(i) {
                            return this[i] || null;
                        };
                        classListProto.contains = function(token) {
                            token += '';
                            return checkTokenAndGetIndex(this, token) !== -1;
                        };
                        classListProto.add = function() {
                            var
                                tokens = arguments,
                                i = 0,
                                l = tokens.length,
                                token,
                                updated = false;
                            do {
                                token = tokens[i] + '';
                                if (checkTokenAndGetIndex(this, token) === -1) {
                                    this.push(token);
                                    updated = true;
                                }
                            }
                            while (++i < l);

                            if (updated) {
                                this._updateClassName();
                            }
                        };
                        classListProto.remove = function() {
                            var
                                tokens = arguments,
                                i = 0,
                                l = tokens.length,
                                token,
                                updated = false;
                            do {
                                token = tokens[i] + '';
                                var index = checkTokenAndGetIndex(this, token);
                                if (index !== -1) {
                                    this.splice(index, 1);
                                    updated = true;
                                }
                            }
                            while (++i < l);

                            if (updated) {
                                this._updateClassName();
                            }
                        };
                        classListProto.toggle = function(token, force) {
                            token += '';

                            var
                                result = this.contains(token),
                                method = result ?
                                force !== true && 'remove' :
                                force !== false && 'add';

                            if (method) {
                                this[method](token);
                            }

                            return !result;
                        };
                        classListProto.toString = function() {
                            return this.join(' ');
                        };

                        if (objCtr.defineProperty) {
                            var classListPropDesc = {
                                get: classListGetter,
                                enumerable: true,
                                configurable: true
                            };
                            try {
                                objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                            } catch (ex) { // IE 8 doesn't support enumerable:true
                                if (ex.number === -0x7FF5EC54) {
                                    classListPropDesc.enumerable = false;
                                    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                                }
                            }
                        } else if (objCtr[protoProp].__defineGetter__) {
                            elemCtrProto.__defineGetter__(classListProp, classListGetter);
                        }
                    }(self));
                }
            }
            return {};
        }
        //   })()
});