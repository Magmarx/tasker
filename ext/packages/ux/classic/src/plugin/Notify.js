/**
 * mostrar notifiaciones implementadas para Ext JS
 * @author Miguel Yax <mig_dj@hotmail.com> on  01/25/2018
 * @class Ext.ux.plugin.Notify
 * @alias xNotify
 */
Ext.define('Ext.ux.plugin.Notify', {
    // mixins: ['Ext.mixin.Observable'],
    xtype: 'xNotify',
    // config: {
    defaultLayout: 'bottomright',
    staticLayout: null,
    initLayout: null,
    prefix: 'jum',
    sufix: '-flat',
    tpl: null,
    /*
     * @cfg {Object} task  `null` Ext.TaskRunner.Task
     * @private
     */
    task: null,
    tick: 1000,
    notifyTypes: ['information', 'alert', 'error', 'success', 'warning'],
    icons: {
        information: 'x-fa fa-info',
        alert: 'x-fa fa-lightbulb-o',
        error: 'x-fa fa-ban',
        success: 'x-fa fa-check',
        warning: 'x-fa fa-exclamation-triangle'
    },
    store: null,
    // },
    privates: {
        /**
         * checkNotification decrementa el contador actual - tick de la tarea de manejo de alertas
         * @private
         */
        checkNotification: function() {
            var me = this,
                notifyResult = me.getStore().query('autoclose', true),
                notifyList = notifyResult ? notifyResult.items : [];

            for (var i = 0; i < notifyList.length; i++) {
                var rec = notifyList[i];
                var current = rec.get('current');
                var value = current - me.tick;
                if (value < 0) {
                    me.animateClose(rec);
                } else {
                    rec.set('current', value);
                }
            }
        },
        /**
         * containerFactory
         * @param {Element} renderTo  ``
         * @param {Element} target  ``
         * @param {Object} config  `` datos de configuracion de la notificacion
         * @private
         */
        containerFactory: function(renderTo, target, config) {
            if (Ext.isObject(config)) {
                var me = this;
                var containerCf = {
                    renderTo: renderTo,
                    target: target
                };
                if (!config.items) {
                    config.iconCls = Ext.isEmpty(config.iconCls) ? me.icons[config.type] : config.iconCls;
                    Ext.apply(containerCf, {
                        // html: me.createBox(config.title, config.msg, config.sticky, config.type, config.iconCls),
                        html: me.applyTemplate(config)
                        // listeners: {
                        //     afterrender: function (container, eOpts) {
                        //         // target.insertFirst({
                        //         //     tag: 'div',
                        //         //     cls: 'notifymask',
                        //         //     style: 'position: absolute; top:-5px; left:-15px; bottom: -10px; right: -12px; z-index: 9999;'
                        //         // });
                        //     }
                        // }
                    });
                } else {
                    Ext.apply(containerCf, {
                        items: config.items
                    });
                }
                return Ext.widget('container', containerCf);
            }
        },
        /**
         * applyTemplate
         * @param {Object} config  `{}` datos de configuracion de la notificacion
         * @private
         */
        applyTemplate: function(config) {
            // applyTemplate: function (title, message, o, notificationType, iconCls) {
            var me = this,
                notificationTpl = me.getTemplate();

            var rawHtml = notificationTpl.apply({
                prefix: me.prefix,
                sufix: me.sufix,
                type: config.type,
                message: config.msg,
                iconCls: config.iconCls,
                badge: config.badge
            });

            return rawHtml;
        },
        /**
         * animateClose  destruye la notificacion y asocia la animacion encontrada en el modelo.
         * @param {Object} record  `Ext.data.Model` registro de notificacion
         * @private
         */
        animateClose: function(record) {
            if (record) {
                var me = this,
                    data = record.getData();
                me.getStore().remove(data.notify.record);

                if (data.notify) {
                    if (data.notify.rendered) {
                        if (data.target) {
                            if (!data.target.destroyed) {
                                data.target.slideOut(data.layout.directionOut, {
                                    easing: 'backIn',
                                    duration: 500,
                                    listeners: {
                                        afteranimate: function() {
                                            if (!data.target.destroyed) {
                                                data.target.destroy();
                                            }
                                            if (data.notify.rendered) {
                                                data.notify.destroy();
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        },
        /**
         * getTask retorna una tarea para manejar tick de conteo de cierre de notificacion
         * @private
         */
        getTask: function() {
            var me = this;
            var task = me.task;
            if (Ext.isEmpty(task)) {
                var taskRunner = new Ext.util.TaskRunner();
                task = taskRunner.newTask({
                    run: function() {
                        me.checkNotification();
                    },
                    interval: me.tick
                });
                me.task = task;
            }
            return task;
        },

        /**
         * getStore devuelve la plantilla para las notificaciones.
         * @private
         */
        getTemplate: function() {
            var me = this;

            if (Ext.isEmpty(me.tpl)) {
                me.tpl = new Ext.XTemplate(
                    '<div class="msg {prefix}{type}{sufix} msjNodeElement {badge:this.hasBadge}" style="padding:3px !important;" total-notify="{badge}">' +
                        // '<span class="channel-column channel-badge {0}"  style="color:{1}; font-size:18px; margin-left: 5px;" total-alerts="{2}" data-qalign="bl-tl" data-qtitle="{4}" data-qtip="{3} ({2})"></span>',
                        '<div style="position: relative">' +
                        '<table style="width:100%" border=0>' +
                        '<tr>' +
                        // '<td style="width:20px;background: #EB5757; color: black; border-radius: 50%; text-align: center; "><div">2</div></td>' +
                        '<tpl if="iconCls != null">' +
                        '<td style="width:20px"><div class="{iconCls}" ></div></td>' +
                        '</tpl>' +
                        '<td>' +
                        '<span>{message}</span>' +
                        '</td>' +
                        '<td style="width:20px" align="right" ><div class="x-fa fa-close" ></div></td>' +
                        '</tr>' +
                        '</table>' +
                        '</div>' +
                        '</div>',
                    {
                        hasBadge: function(badge) {
                            if (Ext.isString(badge)) {
                                badge = parseInt(badge) || 0;
                            }
                            if (badge > 0) {
                                return ' notify-badge';
                            }
                        }
                    }
                );
            }
            return me.tpl;
        },
        /**
         * getStore retorna el almacen para las notificaciones
         * @private
         */
        getStore: function() {
            var me = this;
            if (!me.store) {
                me.store = Ext.create('Ext.data.Store', {
                    fields: [
                        'id',
                        'notify',
                        {
                            name: 'current',
                            type: 'int',
                            convert: function(value, model) {
                                if (Ext.isEmpty(value)) {
                                    return model.get('delay');
                                } else {
                                    return value;
                                }
                            }
                        },
                        {
                            name: 'delay',
                            type: 'int'
                        },
                        {
                            name: 'autoclose',
                            type: 'boolean',
                            defaultValue: true
                        },
                        {
                            name: 'layout'
                        }
                    ],
                    data: [],
                    proxy: {
                        type: 'memory',
                        reader: {
                            type: 'json'
                        }
                    },
                    listeners: {
                        add: function(store, records, index, eOpts) {
                            var task = me.getTask();
                            if (store.count()) {
                                task.start();
                            }
                        },
                        remove: function(store, records, index, isMove, eOpts) {
                            var task = me.getTask();
                            if (!store.count()) {
                                task.stop();
                            }
                        }
                    }
                    // destroy: function (record) {
                    //     var container = record.get('notify');

                    //     me.getStore().remove(record);
                    //     debugger;
                    //     if (container.redered) {
                    //         container.destroy();
                    //     }
                    // }
                });
            }
            return me.store;
        },
        /**
         * getLayoutConfig retorna la configuracion inicial de referencia de contenedores en base a posicion rtl
         * @private
         */
        getLayoutConfig: function() {
            var me = this;

            if (!me.layoutConfig) {
                var msgCtc, msgCtl, msgCtr, msgCt, msgBtc, msgBtl, msgBtr, msgBt;

                // if (!msgCtc) {
                // It's better to create the msg-div here in order to avoid re-layouts
                // later that could interfere with the HtmlEditor and reset its iFrame.
                msgCtc = Ext.DomHelper.insertFirst(
                    document.body,
                    {
                        id: 'msg-tcdiv'
                    },
                    true
                );
                // }
                // if (!msgCtl) {
                // It's better to create the msg-div here in order to avoid re-layouts
                // later that could interfere with the HtmlEditor and reset its iFrame.
                msgCtl = Ext.DomHelper.insertFirst(
                    document.body,
                    {
                        id: 'msg-tldiv'
                    },
                    true
                );
                // }
                // if (!msgCtr) {
                // It's better to create the msg-div here in order to avoid re-layouts
                // later that could interfere with the HtmlEditor and reset its iFrame.
                msgCtr = Ext.DomHelper.insertFirst(
                    document.body,
                    {
                        id: 'msg-trdiv'
                    },
                    true
                );
                // }
                // if (!msgCt) {
                // It's better to create the msg-div here in order to avoid re-layouts
                // later that could interfere with the HtmlEditor and reset its iFrame.
                msgCt = Ext.DomHelper.insertFirst(
                    document.body,
                    {
                        id: 'msg-tdiv'
                    },
                    true
                );
                // }
                // if (!msgBtc) {
                // It's better to create the msg-div here in order to avoid re-layouts
                // later that could interfere with the HtmlEditor and reset its iFrame.
                msgBtc = Ext.DomHelper.insertFirst(
                    document.body,
                    {
                        id: 'msg-bcdiv'
                    },
                    true
                );
                // }
                // if (!msgBtl) {
                // It's better to create the msg-div here in order to avoid re-layouts
                // later that could interfere with the HtmlEditor and reset its iFrame.
                msgBtl = Ext.DomHelper.insertFirst(
                    document.body,
                    {
                        id: 'msg-bldiv'
                    },
                    true
                );
                // }
                // if (!msgBtr) {
                // It's better to create the msg-div here in order to avoid re-layouts
                // later that could interfere with the HtmlEditor and reset its iFrame.
                msgBtr = Ext.DomHelper.insertFirst(
                    document.body,
                    {
                        id: 'msg-brdiv'
                    },
                    true
                );
                // }
                // if (!msgBt) {
                // It's better to create the msg-div here in order to avoid re-layouts
                // later that could interfere with the HtmlEditor and reset its iFrame.
                msgBt = Ext.DomHelper.insertFirst(
                    document.body,
                    {
                        id: 'msg-bdiv'
                    },
                    true
                );
                // }

                me.layoutConfig = {
                    top: {
                        containerId: 'msg-tdiv',
                        directionIn: 't',
                        directionOut: 't',
                        containerObject: msgCt
                    },
                    topright: {
                        containerId: 'msg-trdiv',
                        directionIn: 'r',
                        directionOut: 'r',
                        containerObject: msgCtr
                    },
                    topleft: {
                        containerId: 'msg-tldiv',
                        directionIn: 'l',
                        directionOut: 'l',
                        containerObject: msgCtl
                    },
                    topcenter: {
                        containerId: 'msg-tcdiv',
                        directionIn: 't',
                        directionOut: 't',
                        containerObject: msgCtc
                    },
                    bottom: {
                        containerId: 'msg-bdiv',
                        directionIn: 'b',
                        directionOut: 'b',
                        containerObject: msgBt
                    },
                    bottomright: {
                        containerId: 'msg-brdiv',
                        directionIn: 'r',
                        directionOut: 'r',
                        containerObject: msgBtr
                    },
                    bottomleft: {
                        containerId: 'msg-bldiv',
                        directionIn: 'l',
                        directionOut: 'l',
                        containerObject: msgBtl
                    },
                    bottomcenter: {
                        containerId: 'msg-bcdiv',
                        directionIn: 'b',
                        directionOut: 'b',
                        containerObject: msgBtc
                    }
                };
            }
            return me.layoutConfig;
        },
        /**
         * getLayout retorna una configuracion de posicion definada basada en el rtl
         * @param {String} layout  `''` nombre de la configuracion de posicion para mostrar la notificacion
         * @private
         */
        getLayout: function(layout) {
            var me = this;
            var layoutConfig = me.getLayoutConfig();

            if (!Ext.isEmpty(me.staticLayout)) {
                layout = me.staticLayout;
            }
            return layoutConfig[layout] || layoutConfig[me.defaultLayout];
        },
        /**
         * afterAnimateAction  registra los eventos asociados a la notifiacion despues de mostrarse.
         * @param {Object} record  `Ext.data.Model` registro de notificacion
         * @private
         */
        afterAnimateAction: function(record) {
            var me = this;

            if (record) {
                var data = record.getData(),
                    notify = data.notify,
                    target = data.target,
                    preventEndAnimation = false;

                if (Ext.get(notify.id)) {
                    var notifyMask = notify.getEl();

                    if (notifyMask) {
                        var closeEl = Ext.get(notifyMask.dom.querySelector('.fa-close'));

                        var rec = notify.record;

                        if (closeEl) {
                            closeEl.on('click', function() {
                                me.animateClose(rec);
                            });
                        }
                        notifyMask.on(
                            'mouseout',
                            Ext.bind(function() {
                                rec.set({
                                    autoclose: true,
                                    current: rec.get('delay')
                                });
                            }, me)
                        );

                        notifyMask.on(
                            'mouseover',
                            function() {
                                rec.set('autoclose', false);
                            },
                            me
                        );

                        // if (onClick) {
                        //     notifyMask.on("click", function () {
                        //         // me.store.destroy(notify.record);
                        //         me.animateClose(notify.record);
                        //         // notify.destroy();
                        //         onClick();

                        //     });
                        // }
                    }
                }
            }
        }
    },
    /**
     * msg muestra una notificacion con un mensaje y una configuracion asociada a este
     * @param {String} message  `''` mensaje a mostrar en la notificacion
     * @param {Object} config  `{}` propiedades para aplicar a la notificacion
     * @public
     */
    msg: function(message, config) {
        if (!Ext.isEmpty(message) || !Ext.isEmpty(config.items)) {
            var me = this;
            config.msg = message;
            config = Ext.isObject(config) ? config : {};
            config.onClick = typeof config.onClick === 'function' ? config.onClick : null;
            var items = config.items;

            if (!me.notifyTypes.includes(config.type)) {
                config.type = 'information';
            }

            if (config.title === null) {
                config.title = 'Monitor Plus Architect - ' + config.type.toString().toUpperCase();
            }

            if (Ext.isEmpty(config.delay)) {
                config.delay = 5000;
            } else if (config.delay === 0) {
                config.sticky = true;
            }

            var notificationConfig = me.getLayout(config.layout);
            var target;
            if (notificationConfig) {
                var containerObject = notificationConfig.containerObject;
                if (!containerObject) {
                    notificationConfig.containerObject = Ext.DomHelper.insertFirst(
                        document.body,
                        {
                            id: notificationConfig.containerId
                        },
                        true
                    );
                }

                var notification,
                    list = Ext.get(notificationConfig.containerId);
                if (list.first()) {
                    target = list.insertFirst({
                        tag: 'div',
                        style: 'position: relative',
                        children: [
                            {
                                tag: 'div'
                            }
                        ]
                    });
                    notification = me.containerFactory(Ext.get(target.dom.lastChild), target, config);
                } else {
                    target = list.appendChild({
                        tag: 'div',
                        style: 'position: relative',
                        children: [
                            {
                                tag: 'div'
                            }
                        ]
                    });
                    notification = me.containerFactory(Ext.get(target.dom.lastChild), target, config);
                }

                target.hide();

                var rec = me.getStore().add({
                    id: notification.id,
                    notify: notification,
                    delay: config.delay,
                    layout: notificationConfig,
                    target: target
                });
                notification.record = rec[0];
                /**
                 * @todo implementacion de eventos de movil (pan, pinch, press, rotate, swipe y tap)
                 */

                /* var mc=new Hammer(notification.getEl().dom);
                mc.on("panleft panright", function(ev) {
                    console.log(ev.type +" gesture detected.");
                });
                mc.on("panstart", function(ev) {
                    console.log('panstart', arguments);
                    notification.record.set({
                        'autoclose': false                        
                    });
                });
                mc.on("panend", function(ev) {
                    console.log('panend', arguments);
                    me.animateClose(notification.record); 
                }); */

                if (config.sticky) {
                    target.slideIn(notificationConfig.directionIn, {
                        easing: 'backOut',
                        duration: 200
                    });
                } else {
                    target.slideIn(notificationConfig.directionIn, {
                        easing: 'backOut',
                        duration: 200,
                        listeners: {
                            afteranimate: Ext.bind(me.afterAnimateAction, me, [notification.record])
                        }
                    });
                }
            }
        }
    },
    /**
     * msg muestra una notificacion basado en la configuracion como un objeto general de entrada
     * @param {Object} config  `{}` propiedades para aplicar a la notificacion
     * @public
     */
    show: function(msg, type, layout, delay, iconCls, badge) {
        this.quick({
            msg: msg,
            type: type,
            layout: layout,
            delay: delay,
            iconCls: iconCls,
            badge: badge
        });
    },
    /**
     * msg muestra una notificacion basado en la configuracion como un objeto general de entrada
     * @param {Object} config  `{}` propiedades para aplicar a la notificacion
     * @public
     */
    quick: function(args) {
        if (Ext.isObject(args)) {
            var conf = Ext.applyIf(args, {
                msg: '',
                layout: '',
                delay: 5000,
                type: 'success',
                iconCls: '',
                badge: 0
            });
            this.msg(conf.msg, conf);
        }
    },
    /**
     * container: muestra una notificacion basado en la configuracion como un objeto general de entrada
     * utilizando un Ext.container.Container
     * @param {Object} config  `{}` propiedades para aplicar a la notificacion
     * @public
     */
    container: function(args) {
        if (Ext.isObject(args)) {
            if (args.items) {
                this.msg(args.msg, args);
            }
            //<debug>
            else {
                console.log('Requiere la propiedad de "items"');
            }
            //</debug>
        }
    }
});
