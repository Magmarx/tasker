/**
 * Los singletons se cargan al leer los requires de la aplicación
 * @author esanchez
 * @class M5.singletons.Utils
 */
Ext.define(
    'Tasker.singletons.Utils',
    (function() {
        Ext = Ext || {};

        /**
         * Enable cros
         * @type {Boolean}
         */
        Ext.Ajax.setConfig('cors', true);
        Ext.Ajax.setConfig('useDefaultXhrHeader :', false);
        // TODO: Este feature se activara en la version 5.1
        document.addEventListener(
            'contextmenu',
            function(e) {
                e.preventDefault();
            },
            false
        );
        /**
         * M5AsyncForEach
         *Función para realizar un recorrido asincrono
         */
        Ext.M5AsyncForEach = async (array, callback) => {
            for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array);
            }
        };

        /**
         * @param title
         * @param msg
         * @returns {Ext.Promise}
         * @constructor
         */
        Ext.M5Confirm = (title, msg) => {
            return new Ext.Promise(function(resolve, reject) {
                try {
                    Ext.Msg.confirm(title, msg, async function(btn) {
                        resolve(btn);
                    });
                } catch (e) {
                    reject(e);
                }
            });
        };

        /**
         * @param  {} title
         * @param  {} msg
         * @param  {} buttons
         * @param  {} buttonText
         */
        Ext.M5CustomMsg = (title, msg, buttons, buttonText) => {
            return new Ext.Promise(function(resolve, reject) {
                try {
                    Ext.create('Ext.window.MessageBox', {
                        closable: false
                    }).show({
                        title: title || Ext.localization.generic.question,
                        message: msg,
                        buttons: buttons || Ext.Msg.YESNO,
                        icon: Ext.Msg.QUESTION,
                        buttonText: buttonText,
                        fn: function(btn) {
                            resolve(btn);
                        }
                    });
                } catch (e) {
                    reject(e);
                }
            });
        };

        /**
         * @param  {} title
         * @param  {} msg
         */
        Ext.M5AlertMsg = (title, msg) => {
            return new Ext.Promise(function(resolve, reject) {
                try {
                    Ext.Msg.alert(title, msg, function(btn) {
                        resolve(btn);
                    });
                } catch (e) {
                    reject(e);
                }
            });
        };

        Ext.String.isBase64 = function test(param) {
            let opts = Object.assign({}, param);
            var regex = '(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)';
            let rg = opts.exact ? new RegExp('(?:^' + regex + '?$)') : new RegExp(regex, 'g');

            return rg.test(param);
        };
        /**
         * generaliza los espacios en blanco
         * @param {String} str
         */
        Ext.String.normalizeSpace = function(str) {
            return str.replace(/\s+/g, ' ');
        };

        /**
         * Validate value is not empty
         * @param value
         * @returns {boolean}
         */
        Ext.isNotEmpty = value => {
            let result = value == null || value === '' || (Ext.isArray(value) && value.length === 0);
            if (Ext.isObject(value)) {
                return Ext.Object.getKeys(value).length > 0;
            }

            return !result;
        };
        /**
         * Normalize text
         * @param str
         */
        Ext.normalize = function(str, lower) {
            if (typeof str !== 'string') {
                return str;
            }

            let accents = 'ÀÁÂÃÄÅĄàáâãäåąßÒÓÔÕÕÖØŐòóôőõöøĎďDŽdžÈÉÊËĘèéêëęðÇçČčĆćÐÌÍÎÏìíîïÙÚÛÜŰùűúûüĽĹŁľĺłÑŇŃňñńŔŕŠŚšśŤťŸÝÿýŽŻŹžżź';
            let accentsOut = 'AAAAAAAaaaaaaasOOOOOOOOoooooooDdDZdzEEEEEeeeeeeCcCcCcDIIIIiiiiUUUUUuuuuuLLLlllNNNnnnRrSSssTtYYyyZZZzzz';
            str = str.split('');
            str.forEach((letter, index) => {
                let i = accents.indexOf(letter);
                if (i !== -1) {
                    str[index] = accentsOut[i];
                }
            });

            if (lower) return str.join('').toLowerCase();

            return str.join('');
        };

        /**
         * @param hex
         * @returns {*[]}
         */
        Ext.getRgbByHex = function(hex) {
            if (typeof hex !== 'string') {
                throw new TypeError('Expected a string');
            }

            hex = hex.replace(/^#/, '');

            if (hex.length === 3) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }

            let num = parseInt(hex, 16);

            return [num >> 16, (num >> 8) & 255, num & 255];
        };
        /**
         * @param  {String} colour only name color
         * @return {String} hexcolor
         */
        Ext.colorNameToHex = function(colour) {
            let colours = Ext.manifest.paletteText;

            if (typeof colours[colour.toLowerCase()] !== 'undefined') {
                return colours[colour.toLowerCase()];
            }

            return false;
        };

        /**
         * @param  {String} col name color or hex
         * @param  {Integer} amt [description]
         * @return {String}     [description]
         */
        Ext.lightenDarkenColor = function(col, amt) {
            let usePound = false;

            if (col[0] === '#') {
                col = col.slice(1);
                usePound = true;
            }

            let num = parseInt(col, 16);

            let r = (num >> 16) + amt;

            if (r > 255) r = 255;
            else if (r < 0) r = 0;

            let b = ((num >> 8) & 0x00ff) + amt;

            if (b > 255) b = 255;
            else if (b < 0) b = 0;

            let g = (num & 0x0000ff) + amt;

            if (g > 255) g = 255;
            else if (g < 0) g = 0;

            return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
        };

        /**
         * convierte color en formato rgb a hsl con luminusidad
         * @return {array} color hsla
         */
        Ext.getRgbToHsl = function(r, g, b) {
            (r /= 255), (g /= 255), (b /= 255);
            let max = Math.max(r, g, b),
                min = Math.min(r, g, b);
            let h,
                s,
                l = (max + min) / 2;

            if (max === min) {
                h = s = 0;
            } else {
                let d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }

                h /= 6;
            }

            return [(h * 100 + 0.5) | 0, ((s * 100 + 0.5) | 0) + '%', ((l * 100 + 0.5) | 0) + '%'];
        };
        /**
         * Genera color en base a una paleta de colores
         * @param  {int|null} index get specific color
         * @param  {int|null} alpha for color
         * @param  {boolean|null} hslConvert transform color standar
         * @param  {boolean} onlyBase return only base color
         * @return {string} hsla or rgba
         */
        Ext.getColorPalette = function(index, alpha, hslConvert, onlyBase) {
            if (onlyBase) {
                return Ext.manifest.baseColor;
            }

            alpha = Ext.isEmpty(alpha) ? '0.5' : alpha;
            let h = Ext.manifest.palette[index];

            /**
             * Default color is base color
             */
            if (Ext.isEmpty(h)) {
                h = Ext.manifest.baseColor;
            }

            let [r, g, b] = Ext.getRgbByHex(h);

            if (hslConvert) {
                return `hsla(${Ext.getRgbToHsl(r, g, b)}, ${alpha})`;
            } else {
                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            }
        };

        if (!String.prototype.splice) {
            /**
             * {JSDoc}
             *
             * The splice() method changes the content of a string by removing a range of
             * characters and/or adding new characters.
             *
             * @this {String}
             * @param {number} start Index at which to start changing the string.
             * @param {number} delCount An integer indicating the number of old chars to remove.
             * @param {string} newSubStr The String that is spliced in.
             * @return {string} A new string with the spliced substring.
             */
            String.prototype.splice = function(start, delCount, newSubStr) {
                return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
            };
        }


        // For Upload image IE
        document.write(
            "<script type='text/vbscript'>\r\n" +
            'Function IEBinary_getByteAt(strBinary, offset)\r\n' +
            '	IEBinary_getByteAt = AscB(MidB(strBinary,offset+1,1))\r\n' +
            'End Function\r\n' +
            'Function IEBinary_getLength(strBinary)\r\n' +
            '	IEBinary_getLength = LenB(strBinary)\r\n' +
            'End Function\r\n' +
            '</script>\r\n'
        );
        /**
         * @param data
         * @param dataOffset
         * @param dataLength
         * @constructor
         */
        Ext.BinaryFile = function(data, dataOffset, dataLength) {
            dataOffset = dataOffset || 0;
            dataLength = 0;

            this.getRawData = function() {
                return data;
            };

            if (typeof data == 'string') {
                dataLength = dataLength || data.length;

                this.getByteAt = function(offset) {
                    return data.charCodeAt(offset + dataOffset) & 0xff;
                };
            } else if (typeof data == 'unknown') {
                dataLength = dataLength || IEBinary_getLength(data);

                this.getByteAt = function(offset) {
                    return IEBinary_getByteAt(data, offset + dataOffset);
                };
            }

            this.getLength = function() {
                return dataLength;
            };

            this.getSByteAt = function(offset) {
                var byte = this.getByteAt(offset);
                if (byte > 127) return byte - 256;
                else return byte;
            };

            this.getShortAt = function(offset, bigEndian) {
                var short = bigEndian
                    ? (this.getByteAt(offset) << 8) + this.getByteAt(offset + 1)
                    : (this.getByteAt(offset + 1) << 8) + this.getByteAt(offset);
                if (short < 0) short += 65536;
                return short;
            };
            this.getSShortAt = function(offset, bigEndian) {
                var ushort = this.getShortAt(offset, bigEndian);
                if (ushort > 32767) return ushort - 65536;
                else return ushort;
            };
            this.getLongAt = function(offset, bigEndian) {
                var byte1 = this.getByteAt(offset),
                    byte2 = this.getByteAt(offset + 1),
                    byte3 = this.getByteAt(offset + 2),
                    byte4 = this.getByteAt(offset + 3);

                var long = bigEndian
                    ? (((((byte1 << 8) + byte2) << 8) + byte3) << 8) + byte4
                    : (((((byte4 << 8) + byte3) << 8) + byte2) << 8) + byte1;
                if (long < 0) long += 4294967296;
                return long;
            };
            this.getSLongAt = function(offset, bigEndian) {
                var ulong = this.getLongAt(offset, bigEndian);
                if (ulong > 2147483647) return ulong - 4294967296;
                else return ulong;
            };
            this.getStringAt = function(offset, length) {
                var chars = [];
                for (var i = offset, j = 0; i < offset + length; i++, j++) {
                    chars[j] = String.fromCharCode(this.getByteAt(i));
                }
                return chars.join('');
            };

            this.getCharAt = function(offset) {
                return String.fromCharCode(this.getByteAt(offset));
            };
            this.toBase64 = function() {
                return window.btoa(data);
            };
            this.fromBase64 = function(str) {
                data = window.atob(str);
            };
        };
        /**
         *
         * @param recordUpdate
         * @param record
         */
        Ext.fieldSync = function(recordUpdate, record) {
            try {
                var attrname;
                recordUpdate.beginEdit();

                for (attrname in record) {
                    if (record.hasOwnProperty(attrname)) {
                        if (typeof record[attrname] !== 'undefined') {
                            recordUpdate.set(attrname, record[attrname]);
                        }
                    }
                }

                recordUpdate.endEdit();
            } catch (e) {
                console.error(e);
            }
        };

        /**
         * Ref: https://github.com/afram/is-uuid/blob/master/lib/is-uuid.js
         * @param  {string}  value valor a validar
         * @return {Boolean}
         */
        Ext.isGuuid = function(value) {
            var pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

            if (Ext.isString(value)) {
                value = value.toLowerCase();
            }

            return pattern.test(value);
        };


        /**
         * Retorna una funcion asincrona que tambien se pude usar como promesa
         * @param {string} method [POST|GET|DELETE|PUT]
         * @param {string} url
         * @param {object} _data
         * @param {boolean} silenceError
         * @param {boolean} directReturn
         * @param {boolean} isForm
         * @returns {Promise<any>}
         * @constructor
         */
        Ext.M5Request = async function(method, url, _data, silenceError, directReturn, isForm) {
            let data = {};
            if (typeof window.fetch === 'function') {
                let response = await fetch(url, {
                    method: method,
                    mode: 'cors',
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json, application/xml, text/plain, text/html, *.*',
                        'Content-Type': isForm ? 'application/x-www-form-urlencoded; charset=utf-8' : 'application/json'
                    },
                    cache: 'default',
                    body: isForm ? _data : JSON.stringify(_data)
                });

                data = await response.json();
            } else {
                let response = await Ext.Ajax.request({
                    url: url,
                    method: method,
                    timeout: 36000000,
                    jsonData: JSON.stringify(_data)
                });

                data = JSON.parse(response.responseText);
            }
            if (directReturn) {
                return data;
            } else if (data.success || data.status) {
                return data;
            } else {
                if (!silenceError) {
                    Ext.M5Message.show(data.message, 'warning');
                }

                throw data.message || JSON.stringify(data);
            }
        };
        /**
         * Get base url
         * @return {String}          [description]
         */
        Ext.getBaseUrl = () => {
            return Ext.manifest.gatewayBase.baseUrl;
        };


        /**
         * showMessage, show message with notify component
         * @param {String} msg `` message to show
         * @param {String} type  `success` color to display message ['succes', 'error', 'warning', 'information']
         * @param {String} layout  `bottom` position to show message ["bottom", 'top', 'right', 'left'] ... others
         * @param {Number} delay  `500` milliseconds to show message before hide.
         * @param {String} iconCls  `bottom` x-fa => "font awesome" icons catalog.
         */
        Ext.M5Message = {
            show: function(msg, type, layout, delay, iconCls) {
                Ext.Notify.show(msg, type, layout, delay, iconCls);
            }
        };
        /**
         * Recursive get raw data for tree store
         * @param  {Ext.data.NodeInterface} node tree.getRoot()
         * @return {Array}
         */
        Ext.Object.getDataTree = function(node) {
            var data = [];

            function getData(node, data) {
                Ext.each(node.childNodes, function(n) {
                    var temp = n.getData();
                    if (temp.isGroup || temp.root) {
                        getData(n, data);
                    } else {
                        data.push(temp);
                    }
                });

                return data;
            }

            return getData(node, data);
        };
        /**
         * Return only diffs
         * @returns {{}}
         * @constructor
         */
        Ext.M5Diff = function() {
            let length = arguments.length;
            let ref = arguments[0];
            let diff = {};
            let c;
            let keys;
            let keysLength;
            let key;
            let u;

            for (let i = 1; i < length; i++) {
                c = arguments[i];
                keys = Object.keys(c);
                keysLength = keys.length;

                for (u = 0; u < keysLength; u++) {
                    key = keys[u];

                    if (c[key] !== ref[key]) diff[key] = c[key];
                }
            }

            return diff;
        };

        /**
         * @param  {[type]} prev [description]
         * @param  {[type]} now  [description]
         * @return {[type]}      [description]
         */
        Ext.Object.getChanges = function(prev, now) {
            function getChanges(prev, now) {
                var changes = {},
                    prop,
                    c;

                for (prop in now) {
                    if (!prev || prev[prop] !== now[prop]) {
                        if (typeof now[prop] === 'object' && prev.hasOwnProperty(prop)) {
                            if ((c = getChanges(prev[prop], now[prop]))) changes[prop] = c;
                        } else {
                            changes[prop] = now[prop];
                        }
                    }
                }

                for (prop in changes) {
                    return changes;
                }

                return false; // false when unchanged
            }

            return getChanges(prev, now);
        };

        /**
         * Myax: 09/01/2018 Se agrega la funcion de find al prototipo de Array para navegador ie 11
         * https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/find
         * https://tc39.github.io/ecma262/#sec-array.prototype.find
         */
        if (!Array.prototype.find) {
            Object.defineProperty(Array.prototype, 'find', {
                value: function(predicate) {
                    // 1. Let O be ? ToObject(this value).
                    if (this == null) {
                        throw new TypeError('"this" is null or not defined');
                    }

                    var o = Object(this);

                    // 2. Let len be ? ToLength(? Get(O, "length")).
                    var len = o.length >>> 0;

                    // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                    if (typeof predicate !== 'function') {
                        throw new TypeError('predicate must be a function');
                    }

                    // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                    var thisArg = arguments[1];

                    // 5. Let k be 0.
                    var k = 0;

                    // 6. Repeat, while k < len
                    while (k < len) {
                        // a. Let Pk be ! ToString(k).
                        // b. Let kValue be ? Get(O, Pk).
                        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                        // d. If testResult is true, return kValue.
                        var kValue = o[k];
                        if (predicate.call(thisArg, kValue, k, o)) {
                            return kValue;
                        }
                        // e. Increase k by 1.
                        k++;
                    }

                    // 7. Return undefined.
                    return undefined;
                }
            });
        }

        /**
         * Myax: 09/01/2018 Se agrega la funcion de includes al prototipo de Array para navegador ie 11
         * https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/includes
         */

        if (!Array.prototype.includes) {
            Array.prototype.includes = function(searchElement /*, fromIndex*/) {
                'use strict';
                var O = Object(this);
                var len = parseInt(O.length) || 0;
                if (len === 0) {
                    return false;
                }
                var n = parseInt(arguments[1]) || 0;
                var k;
                if (n >= 0) {
                    k = n;
                } else {
                    k = len + n;
                    if (k < 0) {
                        k = 0;
                    }
                }
                var currentElement;
                while (k < len) {
                    currentElement = O[k];
                    if (searchElement === currentElement || (searchElement !== searchElement && currentElement !== currentElement)) {
                        return true;
                    }
                    k++;
                }
                return false;
            };
        }

        /**
         * @method
         * myax: Shallow compares the contents of 2 objects using strict equality Objects are
         * considered equal if they both have the same set of properties and the
         * value for those properties equals the other in the corresponding object.
         *
         *     // Returns true
         *     Ext.Object.compare({
         *         foo: 1,
         *         bar: 2,
         *         acctionMode: ['new', 'update', 'remove', 'view']
         *     }, {
         *         foo: 1,
         *         bar: 2,
         *         acctionMode: ['new', 'update', 'remove', 'view']
         *     });
         *
         * @param {Object} object1
         * @param {Object} object2
         * @return {Boolean} `true` if the objects are equal.
         */
        Ext.Object.compare = (function() {
            /**
             * adapted
             * angular.js/src/Angular.js
             * https://github.com/angular/angular.js/blob/6c59e770084912d2345e7f83f983092a2d305ae3/src/Angular.js#L670
             */
            var toString = Object.prototype.toString,
                isFunction = function(object) {
                    return typeof object === 'function';
                },
                isScope = function(obj) {
                    return obj && obj.$evalAsync && obj.$watch;
                },
                isWindow = function(obj) {
                    return obj && obj.document && obj.location && obj.alert && obj.setInterval;
                },
                isArray = Array.isArray,
                isDate = function(value) {
                    return toString.apply(value) == '[object Date]';
                },
                isRegExp = function(value) {
                    return toString.apply(value) == '[object RegExp]';
                };

            var _compare = function(o1, o2) {
                if (o1 === o2) return true;
                if (o1 === null || o2 === null) return false;
                if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
                var t1 = typeof o1,
                    t2 = typeof o2,
                    length,
                    key,
                    keySet;
                if (t1 == t2) {
                    if (t1 == 'object') {
                        if (Array.isArray(o1)) {
                            if (!Array.isArray(o2)) return false;
                            if ((length = o1.length) == o2.length) {
                                for (key = 0; key < length; key++) {
                                    if (!_compare(o1[key], o2[key])) return false;
                                }
                                return true;
                            }
                        } else if (isDate(o1)) {
                            return isDate(o2) && o1.getTime() == o2.getTime();
                        } else if (isRegExp(o1) && isRegExp(o2)) {
                            return o1.toString() == o2.toString();
                        } else {
                            if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) || isArray(o2)) return false;
                            keySet = {};
                            for (key in o1) {
                                if (key.charAt(0) === '$' || isFunction(o1[key])) continue;
                                if (!_compare(o1[key], o2[key])) return false;
                                keySet[key] = true;
                            }
                            for (key in o2) {
                                if (!keySet.hasOwnProperty(key) && key.charAt(0) !== '$' && o2[key] !== undefined && !isFunction(o2[key]))
                                    return false;
                            }
                            return true;
                        }
                    }
                }
                return false;
            };
            return _compare;
        })();

        Ext.Array.sortList = function(list, property) {
            return list.sort(function compare(a, b) {
                const genreA = a[property];
                const genreB = b[property];

                let comparison = 0;
                if (genreA > genreB) {
                    comparison = 1;
                } else if (genreA < genreB) {
                    comparison = -1;
                }
                return comparison;
            });
        };

        Ext.Number.add_zero = function(your_number, length) {
            var num = '' + your_number;
            while (num.length < length) {
                num = '0' + num;
            }
            return num;
        };

        return {};
    })()
);
