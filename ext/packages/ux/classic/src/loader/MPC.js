/**
 * Created by Desar_6 on 19/12/2014.
 */
Ext.define('Ext.ux.loader.MPC', {
    loadDesign: function(designUUID, isNewRecord, type) {
        var me = this,
            instanceId = me.instanceId,
            Ex = Ext,
            scope = Ext.create('Ext.window.Window'),
            ELocale = Ext.localization.loadDesign.loadText,
            context = me.context, // Ex.getCurrentContext(instanceId),
            afterLoadDesign = function() {};

        var loadingWindow = Ex.create('Ext.window.MessageBox', {
            title: ELocale.loadingWindowTitle,
            msg: ELocale.loadingDesign,
            progressText: ELocale.initializing,
            width: 300
        });

        var progress = 0;
        progress = progress + 0.1;
        loadingWindow.updateProgress(progress, ELocale.gettingDesign);

        switch (type) {
            case 'design':
                me.requestAction = 'getDesign';
                var newRecordSourcesCallback = function() {
                        context.SourceStore.createNewRowsForAll(true);
                        loadingWindow.hide();
                    },
                    loadSourcesCallback = function() {
                        context.SourceStore.loadAllData(true);
                        loadingWindow.hide();
                    };

                context.SourceStore.on('alldataloaded', function() {
                    console.log('allDataLoaded');
                    me.getEl().unmask();
                }, me, {
                    single: true
                });

                scope.add(loadingWindow);
                if (scope.rendered) {
                    loadingWindow.show({
                        title: ELocale.loadingWindowTitle,
                        msg: ELocale.loadingDesign,
                        progressText: ELocale.initializing,
                        width: 300,
                        progress: true,
                        closable: false
                    });
                } else {
                    scope.on('activate', function() {
                        loadingWindow.show({
                            title: ELocale.loadingWindowTitle,
                            msg: ELocale.loadingDesign,
                            progressText: ELocale.initializing,
                            width: 300,
                            progress: true,
                            closable: false
                        });
                    }, me, {
                        single: true
                    });
                }

                /**
                 * @method afterLoadDesign
                 * @param {Object} content response del get config para el design
                 * @event
                 */
                afterLoadDesign = function(content) {
                    content = content.data[0];
                    if (context.LabelStore) {
                        context.LabelStore.loadData(content.Labels);
                    }

                    if (context.ConnectionStore.loadSerializedData(content.connections)) {
                        // progress = progress + 0.18;
                        // loadingWindow.updateProgress(progress, ELocale.loadingParameters);
                        context.ParameterManagerStore.loadSerializedData(content.parameters, function() {
                            var afterParameterCallback = function() {
                                // progress = progress + 0.18;
                                // loadingWindow.updateProgress(progress, ELocale.loadingDataSources);
                                var createDesignCallback = function() {
                                    // progress = progress + 0.18;
                                    // loadingWindow.updateProgress(progress, ELocale.chargingDesignData);
                                    setTimeout(function() {
                                        var serializedConfig = Ext.JSON.encode(Ext.JSON.decode(content.design));
                                        me.reopenConnections(context, function() {
                                            scope.on('afterjsonload', isNewRecord ? newRecordSourcesCallback : loadSourcesCallback, me, {
                                                single: true
                                            });

                                            if (serializedConfig !== '{}') {
                                                scope.setConfig(content.design);
                                            } else {
                                                scope.setConfig('');
                                            }
                                        });
                                    }, 500);
                                };

                                context.SourceStore.loadSerializedData(content.sources, createDesignCallback, instanceId);
                            };
                            // progress = progress + 0.18;
                            // loadingWindow.updateProgress(progress, ELocale.settingParameters);
                            if (!Ext.isEditMode && !isNewRecord) {
                                var showParamsWindow = function(params) {
                                    if (params.length > 0) {
                                        loadingWindow.hide();
                                        var parameterWindow = Ex.create('Ext.ux.widget.parameter.View', {
                                            constrain: true,
                                            modal: false,
                                            instanceId: instanceId,
                                            initParameterVector: params,
                                            callback: function(returnedParameters) {
                                                loadingWindow = Ex.create('Ext.window.MessageBox', {
                                                    title: ELocale.loadingWindowTitle,
                                                    msg: ELocale.loadingDesign,
                                                    progressText: ELocale.initializing,
                                                    width: 300
                                                });
                                                scope.add(loadingWindow);
                                                loadingWindow.show({
                                                    title: ELocale.loadingWindowTitle,
                                                    msg: ELocale.loadingDesign,
                                                    progressText: ELocale.initializing,
                                                    width: 300,
                                                    progress: true,
                                                    closable: false
                                                });
                                                context.ParameterManagerStore.loadParameterData(returnedParameters, afterParameterCallback);
                                            },
                                            closeCallback: function() {
                                                if (scope.closeCallback) {
                                                    scope.closeCallback();
                                                }
                                            }
                                        });

                                        scope.add(parameterWindow);
                                    } else {
                                        afterParameterCallback();
                                    }
                                };
                                if (me.parameters) {
                                    var verifyUnfilledParams = function() {
                                        var unfilledParams = context.ParameterManagerStore.getUnfilledParameters(true);
                                        showParamsWindow(unfilledParams);
                                    };
                                    context.ParameterManagerStore.loadParameterData(me.parameters, verifyUnfilledParams);
                                } else {
                                    var params = content.parameters;
                                    showParamsWindow(params);
                                }
                            } else {
                                afterParameterCallback();
                            }
                        }, instanceId);
                    }
                };
                break;
        }
        me.initDesign(me, designUUID, afterLoadDesign);
    },
    initDesign: function(that, id, callback) {
        var me = that,
            Ex = Ext;
        if (me.designConfig) {
            if (callback) callback(me.designConfig);
        } else {
            Ex.Ajax.request({
                params: {
                    action: me.requestAction,
                    uuid: id,
                    token: Ext.connectionToken || Ex.guid(),
                    instanceId: me.instanceId
                },
                url: Ex.manifest.handler.repositoryManager,
                method: 'POST',
                timeout: 300000,
                success: function(response) {
                    console.log('result ', response);
                    var result = Ex.JSON.decode(response.responseText);
                    if (result.success) {
                        Ex.apply(me, {
                            designConfig: result
                        });
                        console.log('LOADED DESIGN ', me.designConfig);
                        if (callback) callback(result);
                    } else {
                        me.showMessage(result.message);
                    }
                },
                failure: function(response) {
                    if (response.status === 500) {
                        Ex.Msg.alert(Ex.localization.apiName, Ex.localization.loadDesign.msgText.loadedDesignNoLongerExists, function() {
                            var loadMask = Ex.create('Ext.LoadMask', Ex.getBody(), {
                                msg: Ex.localization.jsonPanel.msgText.tryAgain
                            });
                            loadMask.show();
                        });
                    }
                    // that.loadMaskObject.hide();
                }
            });
        }
    },
    reopenConnections: function(context, callback) {
        var me = this;
        me.getEl().mask(Ext.localization.loadDesign.loadText.loadingDataSources);
        context.ConnectionStore.openAllConnections(null, {
            callback: callback,
            silent: true
        });
    },
    showMessage: function(msg, type, layout, delay) {
        Ext.Notify.msg(
            msg, {
                layout: layout || 'bottom',
                delay: delay || 5000,
                type: type || 'error'
            });
    }
});