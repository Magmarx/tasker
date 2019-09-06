/**
 * Created by Desar_6 on 04/08/2014.
 */
Ext.define('Ext.ux.Msg.DetailBubble', {
    extend: 'Ext.ux.callout.Callout',
    xtype: 'detailBubbleCallout',
    requires: ['Ext.grid.Panel', /**/
        'Ext.container.Container', /**/
        'Ext.panel.Panel', /**/
        'Ext.grid.feature.Grouping'
    ],
    form: {}, //  form evaluate and resume obtained  on  this.getForm()
    data: [], // List of raw data error [{ group: 'field', text: 'This field is required '}]
    initComponent: function() {
        var me = this,
            Ex = Ext,
            ExArray = Ex.Array,
            ExLocale = Ext.localization;
        Ex.applyIf(me, {
            type: 'error',
            //  form: null,
            //  data: [],
            message: ExLocale.detailBubble.defaultTitle
        });
        var typeCls;
        switch (me.type) {
            case 'error':
                typeCls = 'red';
                break;
        }
        Ex.define('bubbleDetailModel', {
            extend: 'Ext.data.Model',
            fields: ['group', 'text']
        });

        var detailStore = Ex.create('Ext.data.Store', {
            model: 'bubbleDetailModel',
            // groupers: ['group'],
            groupField: 'group',
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            }
        });

        if (me.data.length && me.form) {
            detailStore.loadData(
                ExArray.merge(
                    me.getErrorForm(me.form),
                    me.data
                )
            );
        } else if (me.data.length) {
            detailStore.loadData(me.data);
        } else {
            detailStore.loadData(me.getErrorForm(me.form));
        }
        /*
                function columnWrap(val){
                    return '<div style="white-space:normal !important;">'+ val +'</div>';
                }
        */
        var contentGrid = Ex.widget('gridpanel', {
            // title: 'The following errors prevent to continue the process',
            store: detailStore,
            region: 'center',
            features: [{
                // groupHeaderTpl:':{group}',
                ftype: 'grouping'
            }],
            width: 200,
            height: 275,
            columns: [{
                text: 'Description',
                dataIndex: 'text',
                flex: 1,
                xtype: 'templatecolumn',
                tpl: '<div style="white-space:normal !important;"> {text} </div>'
                    // renderer: columnWrap
            }]
        });

        var headerMessage = Ex.widget('container', {
            region: 'north',
            // heigth: 40,
            html: '<table style="width:100%" border=0>' +
                '<tr>' +
                '<td style="width: 34px">' +
                // '<img src= "../../resources/images/monitorLogoHD.png" class ="monitorLogoHD" />'+
                '</td>' +
                '<td >' +
                // '<b>' + t + '</b>' +
                '<p>' + me.message + '</p>' +
                '</td>' +
                '<td style="width:20px" align="right">' +
                '</td>' +
                '</tr>' +
                '</table>'
        });

        var contentBody = Ex.widget('panel', {
            border: 0,
            // title: Ext.localization.apiName+" - "+Ext.localization.msgText.errorHeader,
            layout: 'border',
            bodyCls: 'jumerror',
            items: [headerMessage, contentGrid],
            width: 400,
            height: 300
        });

        Ext.applyIf(me, {
            // cls: 'red',
            items: [contentBody]
        });
        me.callParent(arguments);
        // }
    },
    getErrorForm: function(form) {
        var Ex = Ext,
            ExArray = Ex.Array,
            errorData = [];
        Ex.suspendLayouts();
        var invalid = form.getFields().filterBy(function(field) {
            return !field.validate();
        });
        Ex.resumeLayouts(true);
        if (invalid.length) {
            ExArray.each(invalid.items, function(item) {
                ExArray.each(item.activeErrors, function(error) {
                    ExArray.push(errorData, {
                        text: error,
                        group: item.fieldLabel
                    });
                });
            });
        }
        return errorData;
    }
});