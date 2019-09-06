/**
 * Desar_6 on 10/12/2014.
 * @param  {[type]} Ext [description]
 * @param  {[type]} Ext [description]
 * @param  {[type]} Ext [description]
 * @return {[type]}     [description]
 */
Ext.uxWidgetList = Ext.Array.merge(Ext.uxWidgetList || [], ['Ext.toolbar.Toolbar', 'Ext.ux.widget.form.field.Universal']);
Ext.define('Ext.ux.panel.JsonPanel', {
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.toolbar.Toolbar',
        'Ext.ux.widget.form.field.Universal',
        'Ext.ux.widget.form.FieldSet',
        'Ext.ux.widget.panel.Panel'
    ],
    xtype: 'jsonPanel',
    mixins: {
        mxsJson: 'Ext.ux.plugin.Json',
        loadUtil: 'Ext.ux.loader.MPC'
    },
    /**
     * Array with items which should be blocked during init
     * @type {Array}
     */
    blockedJsonInit: ['alignTo', 'anchorTo', 'items'],
    layout: 'fit',
    bodyBorder: false,
    single: true,
    json: null,
    nocache: false,
    instanceId: '',
    jsonScopeHand: null,
    actionQueue: [],
    width: 900,
    height: 600,
    instanceMode: 'view',
    toolbarPosition: 'c',
    parameters: [],
    titleText: '',
    onSuccess: Ext.emptyFn,
    constructor: function(config) {
        var me = this;
        // region private variables (no getter & setter available)
        me._floatingToolbar = undefined;
        // endregion private variables

        // region private events
        me._afterRender = function() {
            if (me._floatingToolbar) me._floatingToolbar.show();
        };
        // endregion private events
        // region private functions
        me._updateFloatBtnPos = function() {
            if (me._floatingToolbar) {
                var bodySize = me.body.getSize(),
                    toolbarSize = me._floatingToolbar.getSize(), // get toolbar height
                    toolbarPosition = me._floatingToolbar.getPosition(); // get toolbar position on drop

                if (me._floatingToolbar && me._floatingToolbar.el) {
                    var posX = 0,
                        posY = bodySize.height - toolbarSize.height; // position variable initialator does not matter what number it had
                    switch (me.toolbarPosition) {
                        case 'l':
                            posX = 1; // if the position of the toolbar is on the left the static coordinate is 1
                            break;
                        case 'c':
                            posX = (bodySize.width / 2) - (toolbarSize.width / 2); // if the position is in the middle it place right on the middle of the page
                            break;
                        case 'r':
                            posX = bodySize.width - toolbarSize.width - 10; // if the position is right the static coordinate is the same width of the hole page
                            break;
                    }
                    me._floatingToolbar.setPosition(posX, posY); // show the toolbar
                }
            }
        };
        // endregion private functions
        return me.callParent(arguments);
    },
    initComponent: function() {
        var me = this;
        // console.log(me.designConfig);
        if (me.autoLoad) {
            if (typeof me.autoLoad !== 'object') {
                me.autoload = {
                    url: me.autoLoad
                };
            }
            if (typeof me.autoLoad.nocache === 'undefined') {
                me.autoLoad.nocache = me.nocache;
            }
        }

        me.jsonScope = me.scope || me;
        me.callParent(arguments);
    },
    addActionToQueue: function(action) {
        var me = this;
        Ext.Array.push(me.actionQueue, action);
        return action;
    },
    processQueue: function(callback) {
        var Ex = Ext,
            me = this,
            idPrefix = me.instanceId ? me.instanceId + '-' : '';
        Ex.Array.each(me.actionQueue, function(actionItem) {
            var idTokens = actionItem.id.split('-');
            var actionItemId = '';
            if (idTokens.length) {
                actionItemId = idPrefix + idTokens[idTokens.length - 1];
            }

            var affectedCmp = Ex.getCmp(actionItemId);
            if (affectedCmp) {
                if (actionItem.criteria) {
                    var criteriaData = Ex.JSON.decode(actionItem.criteria),
                        criteriaToApply = '(';
                    if (criteriaData.length) {
                        Ex.Array.each(criteriaData, function(item) {
                            var controlType = actionItem.controlType,
                                getConditionValue = function(controlType, value) {
                                    switch (controlType) {
                                        case 0:
                                            return '"' + value + '"';
                                        case 1:
                                            return value;
                                        default:
                                            return '"' + value + '"';
                                    }
                                };
                            if (item.criteriaIndex > 0) {
                                switch (item.connector) {
                                    case 'AND':
                                        criteriaToApply += ' && ';
                                        break;
                                    case 'OR':
                                        criteriaToApply += ' || ';
                                        break;
                                }
                            }
                            if (item.parenthesisI === 1) {
                                criteriaToApply += '(';
                            }
                            // if (actionItem.textValue)
                            criteriaToApply += getConditionValue(controlType, actionItem.textValue); // '"' + actionItem.textValue + '"';
                            if (item.operator) {
                                switch (item.operator) {
                                    case '=':
                                        criteriaToApply += ' == ';
                                        break;
                                    case '<>':
                                        criteriaToApply += ' !== ';
                                        break;
                                    default:
                                        criteriaToApply += ' ' + item.operator + ' ';
                                        break;
                                }
                            }
                            if (criteriaToApply) {
                                criteriaToApply += getConditionValue(controlType, item.value);
                            } // '"' + item.value + '"';
                            else {
                                criteriaToApply += '"" ';
                            }
                            if (item.parenthesisF === 1) {
                                criteriaToApply += ')';
                            }
                        });
                        criteriaToApply += ')';
                        // 'affectedCmp.setVisible(false);}';
                        var actionArray = actionItem.action.split(';'),
                            method = actionArray[2].split(':')[1],
                            successValue = actionArray[3].split(':')[1],
                            executeMethod = 'if (affectedCmp.' + method + ') affectedCmp.' + method + '(' + criteriaToApply + '? ' + successValue + ': !' + successValue + ');';
                        eval(executeMethod);
                        if (callback) callback();
                    }
                }
                // affectedCmp.setVisible(false);
            }
        });
        // this.actionQueue = [];
    },
    setConfig: function(config, callback) {
        var toolbarWidth;
        var me = this,
            Ex = Ext,
            ExLocale = Ex.localization,
            dragged = false;
        me.fireEvent('beforejsonload', config);
        // me.el.mask('Drawing Design...');
        try {
            me.actionQueue = [];
            me.removeAll();
            me.apply(me, config);
            setTimeout(function() {
                me.fireEvent('afterjsonload', config);
                // me.el.unmask();
            }, 50);

            me.setTitle(me.titleText + '[' + Ext.localization.jsonPanel.instanceMode[me.instanceMode + 'Mode'] + ']');

            // Add listeners
            if (callback) callback();
        } catch (Error) {
            console.log(Error);
            return false;
        }
    },
    refresh: function() {
        var me = this;
        me.setConfig(me.getCode());
    },
    getCode: function(el) {
        var me = this;
        return me.encode(me.getConfig(el));
    },
    getConfig: function(el) {
        var me = this,
            Ex = Ext,
            ExArray = Ex.Array;
        if (!el && me.items) {
            el = me.items.items;
            if (el.length) {
                var drillDownItems = [];
                ExArray.each(el, function(item) {
                    ExArray.push(drillDownItems, me.getConfig(item));
                });
                return drillDownItems;
            }
            el = el[0];
        }
        if (!el) return {};
        if (!el.codeConfig) {
            var findIn = Ex.bind(function(scope) {
                if (!scope) {
                    return null;
                }
                if (scope.items) {
                    for (var E = 0; E < scope.items.length; E++) {
                        var F = findIn(scope.items[E]);
                        if (F) {
                            return F;
                        }
                    }
                }
                return null;
            }, me);
            el.codeConfig = findIn(me.codeConfig);
        }
        return el.codeConfig || el.initialConfig;
    },
    showMessage: function(msg, type, layout, delay) {
        Ext.Notify.msg(
            msg, {
                layout: layout || 'bottomright',
                delay: delay || 5000,
                type: type || 'success'
            });
    }
});