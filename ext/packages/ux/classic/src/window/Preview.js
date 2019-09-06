/**
 * Created by hmorjan on 09-Feb-16.
 */
Ext.define('Ext.ux.window.Preview', {
    extend: 'Ext.window.Window',
    requires: [
        'Ext.ux.grid.property.Grid'
    ],
    xtype: 'previewWindow',
    modal: true,
    // width: '90%',
    // height: '75%',
    layout: 'fit',
    draggable: false,
    resizable: false,
    // closeAction:"hide",
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
    },
    onEsc: function() {
        Ext.log({
            msg: 'DEBUG',
            level: 'info',
            stack: true,
            indent: 0,
            dump: 'ESC'
        });
    },
    setFilePreview: function(record, parentPanel) {
        var me = this;
        var values = {
            file: record.get('fileStored'),
            fileName: record.get('name')
        };
        Ext.Ajax.request({
            url: Ext.manifest.handler.fileUpload,
            method: 'POST',
            timeout: 3600000,
            params: {
                values: Ext.JSON.encode(values),
                requestType: 'createByteFile'
            },
            callback: function() {},
            success: function(response) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    var data = [{
                        'editable': false,
                        'text': 'Description',
                        'value': record.get('description'),
                        'group': record.get('name')
                    }, {
                        'editable': false,
                        'text': 'State',
                        'value': record.get('currentStateName'),
                        'group': record.get('name')
                    }, {
                        'editable': false,
                        'text': 'Type',
                        'value': record.get('type'),
                        'group': record.get('name'),
                        renderer: function(value) {
                            var typeRecord = me.attachmentTypeStore.findRecord('uuid', value);
                            return typeRecord.get('name');
                        }
                    }, {
                        'editable': false,
                        'text': 'From',
                        'value': Ext.getFormatDate(record.get('from')),
                        'group': record.get('name')
                    }, {
                        'editable': false,
                        'text': 'Thru',
                        'value': Ext.getFormatDate(record.get('thru')),
                        'group': record.get('name')
                    }, {
                        'editable': false,
                        'text': 'Validity',
                        'value': record.get('validity'),
                        'group': record.get('name')
                    }, {
                        'editable': false,
                        'text': 'Comment',
                        'value': record.get('comment'),
                        'group': record.get('name')
                    }, {
                        'editable': false,
                        'text': 'Uploaded',
                        'value': record.get('approvedUser'),
                        'group': record.get('name')
                    }];
                    var propertiesGrid = Ext.create('Ext.ux.grid.property.Grid', {
                        layout: 'fit',
                        hideHeaders: true,
                        groupingConfig: {
                            groupHeaderTpl: 'File properties:',
                            disabled: false,
                            startCollapsed: false
                        },
                        autoScroll: true,
                        sortable: false,
                        listeners: {
                            afterrender: function() {
                                var columns = this.columns;
                                columns[0].setWidth(100);
                            }
                        },
                        source: data
                    });
                    var typeRecord = me.attachmentTypeStore.findRecord('uuid', record.get('type'));
                    var htmlUse = '';
                    switch (typeRecord.get('name')) {
                        case '.xlsx':
                            htmlUse = '<iframe style="background-image: url(' + record.get('thumbnail') + ');' +
                                'background-size:contain; ' +
                                'background-repeat:no-repeat;' +
                                'width:100%; ' +
                                'height:550px;" src="' + Ext.manifest.globals.fontBasePrefix + record.get('name') + '" width="100%" height="575px"></iframe>';
                            break;
                        case '.jpg':
                            htmlUse = '<iframe style="background-image: url(' + Ext.manifest.globals.fontBasePrefix + record.get('name') + ');' +
                                'background-size:contain; ' +
                                'background-repeat:no-repeat;' +
                                'width:100%; ' +
                                'height:550px;"></iframe>';
                            break;
                        case '.png':
                            htmlUse = '<iframe style="background-image: url(' + Ext.manifest.globals.fontBasePrefix + record.get('name') + ');' +
                                'background-size:contain; ' +
                                'background-repeat:no-repeat;' +
                                'width:100%; ' +
                                'height:550px;"></iframe>';
                            break;
                        case '.pdf':
                            htmlUse = '<iframe src="' + Ext.manifest.globals.fontBasePrefix + record.get('name') + '" width="100%" height="575px"></iframe>';
                            break;

                    }
                    var window = Ext.widget('previewWindow', {
                        title: record.get('description'),
                        items: [{
                            xtype: 'panel',
                            layout: 'hbox',
                            align: 'stretch',
                            items: [{
                                xtype: 'component',
                                html: htmlUse,
                                flex: 2
                            }, {
                                xtype: 'panel',
                                flex: 1,
                                items: [
                                    propertiesGrid
                                ]
                            }]
                        }],
                        listeners: {
                            beforeclose: function(view, eOpts) {
                                Ext.Ajax.request({
                                    url: Ext.manifest.handler.fileUpload,
                                    method: 'POST',
                                    timeout: 3600000,
                                    params: {
                                        fileName: values.fileName,
                                        requestType: 'removeFile'
                                    }
                                });
                                parentPanel.remove(window);
                            }
                        }
                    });
                    window.on('itemcontextmenu', function(view, record, item, index, e) {
                        e.preventDefault();
                    });
                    window.show();
                    parentPanel.add(window);
                }
            }
        });
    }
});
