/**
 * @author Desar_6 on 11/12/2014.
 * @author Myax <mig_dj@hotmail.com> on 08/06/2016.
 * se refactoriza clase para compatiblilidad para sencha extjs 6.5
 *
 * @class Ext.ux.data.prototype.Proxy
 * @type Ext.data.proxy.Ajax
 */
Ext.define('Ext.ux.data.prototype.Proxy', {
    extend: 'Ext.data.proxy.Ajax',
    name: 'prototypeproxy',
    /**
     * guid string token session
     * @type {String}
     */
    token: null,
    /**
     * guid string datamanager identifier
     * @type {String}
     */
    idDatamanager: null,
    /*
     * @property {number} limit  `-1` Unlimited data to request
     */
    limit: -1,
    /**
     * TODO: validar si es valido el tener comentarios que delimitan las secciones de configuración
     * Function needed for the command "new" in the instantiation of this class
     * @method constructor
     * @protected
     * @override
     */
    /*
     * @cfg {Object} params  `{}` parameters
     */
    params: {},
    constructor: function () {
        var Ex = Ext,
            // ExAjax = Ex.Ajax,
            ExArray = Ex.Array,
            ExJSON = Ex.JSON;
        var me = this;

        /**
         * Override of the method doRequest, to perform a custom POST request at every request instead of GET request at read, and POST at write
         * @param operation {Object/Array} Metadata sent by the DataStore that is requesting some action.
         * @param callback {function} function invoked after the request action
         * @param scope {Ext.data.Store} current DataStore requesting some action.
         * @returns {Ext.data.Request} resultant configuration of current request.
         * -- se refactoriza clase para compatiblilidad para sencha extjs 6.5
         * @override
         * @private
         */
        me.doRequest = function (operation, callback, scope) {
            operation = operation || {};
            scope = scope || {};
            var
                writer = me.getWriter(),
                request = me.buildRequest(operation),
                // method = me.getMethod(request),
                method = 'POST',
                jsonData, params;

            // var writer = me.getWriter(),
            // request = me.buildRequest(operation, callback, scope);

            if (writer && operation.allowWrite()) {
                request = writer.write(request);
            }

            if (scope.model) {
                me.model = scope.model;
            }
            // var method = me.getMethod(request);

            me.params = scope.params || me.params;

            // BLOCK ACTION READ PARAMETERS
            if (operation.page) {
                me.params.page = operation.page;
            } else {
                delete me.params.page;
            }

            if (operation.filters) {
                me.params.filters = operation.filters;
            } else {
                delete me.params.filters;
            }

            if (operation.groupers) {
                me.params.groupers = operation.groupers;
            } else {
                delete me.params.groupers;
            }

            if (operation.sorters) {
                me.params.sorters = operation.sorters;
            } else {
                me.params.sorters = '';
            }

            if (operation.addRecords) {
                me.params.addRecords = operation.addRecords;
            } else {
                delete me.params.addRecords;
            }

            if (operation.start) {
                me.params.start = operation.start;
            } else {
                delete me.params.start;
            }

            if (operation.limit) {
                me.params.limit = operation.limit;
            } else {
                me.params.limit = me.getLimit();
            }

            if (typeof me.params.sorters !== 'string') {
                me.params.sorters = ExJSON.encode(me.params.sorters);
            }

            if (typeof me.params.filters !== 'string') {
                me.params.filters = ExJSON.encode(me.params.filters);
            }

            if (typeof me.params.groupers !== 'string') {
                me.params.groupers = ExJSON.encode(me.params.groupers);
            }



            // END BLOCK ACTION READ PARAMETERS

            // BLOCK ACTION CREATE/DESTROY PARAMETERS
            if (request._action) {
                me.params.action = request._action;
            } else {
                delete me.params.action;
            }

            // ACTION CREATE/DESTROY PARAMETERS

            if (request._action) {
                me.params.action = request._action;
            } else {
                delete me.params.action;
            }

            if (operation.records) {
                me.params.action = 'batchAction';
                var outputRecords = [];
                for (var y = 0; y < operation.batch.operations.length; y++) {
                    var actionArray = {};
                    var actionData = [];
                    actionArray.action = operation.batch.operations[y].action;
                    for (var x = 0; x < operation.batch.operations[y].records.length; x++) {
                        ExArray.push(actionData, operation.batch.operations[y].records[x].data);
                    }

                    actionArray.records = actionData;
                    ExArray.push(outputRecords, actionArray);
                }

                me.params.batch = ExJSON.encode(outputRecords);
            } else {
                delete me.params.records;
            }

            if (operation.running) {
                me.params.running = operation.running;
            } else {
                delete me.params.running;
            }

            if (operation.started) {
                me.params.started = operation.started;
            } else {
                delete me.params.started;
            }
            // END BLOCK ACTION CREATE/DESTROY PARAMETERS

            me.params.token = Ex.connectionToken || me.token;

            if (me.type) {
                me.params.connectionType = me.type;
            } else {
                delete me.params.connectionType;
            }


            request.setConfig({
                url: operation._proxy.url,
                binary: me.getBinary(),
                headers: me.getHeaders(),
                timeout: 3600000,
                scope: me,
                callback: me.createRequestCallback(request, operation),
                method: method,
                useDefaultXhrHeader: me.getUseDefaultXhrHeader(),
                disableCaching: false, // explicitly set it to false, ServerProxy handles caching
                params: me.params,
                // extraParams: scope.extraParams || {},
                jsonData: me.jsonData,
            });
            if (method.toUpperCase() !== 'GET' && me.getParamsAsJson()) {
                params = request.getParams();

                if (params) {
                    jsonData = request.getJsonData();
                    if (jsonData) {
                        jsonData = Ext.Object.merge({}, jsonData, params);
                    } else {
                        jsonData = params;
                    }
                    request.setJsonData(jsonData);
                    request.setParams(undefined);
                }
            }

            if (me.getWithCredentials()) {
                request.setWithCredentials(true);
                request.setUsername(me.getUsername());
                request.setPassword(me.getPassword());
            }
            return me.sendRequest(request);
        };

        me.callParent(arguments);
    },
    /**
     * Override of the default configuration for "read" action to POST
     */
    actionMethods: {
        read: 'POST'
    },
    reader: {
        type: 'json',
        rootProperty: 'rows'
    },
    /**
     * @param {Object} params  `{}` proxy configuration
     * @public
     */
    setParams: function (params) {
        var oldparams = this.params;
        if (params !== oldparams) {
            this.params = params;
            // this.updateParams(params, oldparams);
        }
    },
    /**
     * @return {Object} params `{}` proxy configuration
     * @public
     */
    getParams: function () {
        var params = this.params || {};

        return params;
    },
    /**
     * @method openConnection
     * @param  {Object} scope    [description]
     * @param  {Function} callback [description]
     * @param  {Boolean} silent   [description]
     * @event openConnection
     */
    openConnection: function (scope, callback, silent) {
        var me = this,
            Ex = Ext,
            ExAjax = Ex.Ajax,
            ExJSON = Ex.JSON,
            ExLocale = Ex.localization;
        me.configParams.requestType = 'openConnection';
        // <debug>
        console.log('openConnection', arguments);
        // </debug>
        ExAjax.request({
            params: me.configParams,
            url: Ext.manifest.handler.connectionUtil,
            method: 'POST',
            timeout: 3600000,
            success: function (response) {
                var result = ExJSON.decode(response.responseText);

                if (result.success) {
                    if (!silent) {
                        Ex.Notify.msg('<b>' + ExLocale.proxyPrototype.msgText.configurationLoadSuccessTitle + '</b>: ' + '  <cite>' + ExLocale.proxyPrototype.msgText.configurationLoadSuccess(scope.data.name) + '</cite>', {
                            layout: 'topright',
                            delay: 5000,
                            type: 'success'
                        });
                    }

                    me.setToken(result.token);
                    if (callback) {
                        callback(result.success);
                    }
                } else {
                    if (!silent) {
                        Ex.Notify.msg('<b>' + ExLocale.proxyPrototype.msgText.configurationLoadFailureTitle + '</b>: ' + '  <cite>' + ExLocale.proxyPrototype.msgText.configurationLoadFailure(scope.data.name) + '</cite>', {
                            layout: 'topright',
                            delay: 5000,
                            type: 'error'
                        });
                    }

                    if (callback) {
                        callback(false);
                    }
                }
            },
            failure: function (response) {
                if (!silent) {
                    if (response.timedout) {
                        Ex.Notify.msg('<b>' + ExLocale.proxyPrototype.msgText.configurationLoadFailureTitle + '</b>: ' + '  <cite>' + ExLocale.proxyPrototype.msgText.configurationLoadTimedOut(scope.data.name) + '</cite>', {
                            layout: 'topright',
                            delay: 5000,
                            type: 'error'
                        });
                    } else {
                        Ex.Notify.msg('<b>' + ExLocale.proxyPrototype.msgText.configurationLoadFailureTitle + '</b>: ' + '  <cite>' + ExLocale.proxyPrototype.msgText.configurationLoadFailure(scope.data.name) + '</cite>', {
                            layout: 'topright',
                            delay: 5000,
                            type: 'error'
                        });
                    }
                }

                if (callback) {
                    callback(false);
                }
            }
        });
    },
    /**
     * @method setToken
     * @param  {String} token [description]
     */
    setToken: function (token) {
        this.token = token;
        this.fireEvent('setToken', token);
    },
    /**
     * @param {number} limit  `1` limit to request
     * @public
     */
    setLimit: function (limit) {
        var oldlimit = this.limit;
        if (limit !== oldlimit) {
            this.limit = limit;
            this.updateLimit(limit, oldlimit);
        }
    },
    /**
     * @return {number} limit `1` limit to request
     * @public
     */
    getLimit: function () {
        var limit = this.limit || 1;

        return limit;
    },
    /**
     * @private
     */
    updateLimit: function (newLimit, oldLimit) {
        this.params.limit = newLimit;
    }
});
