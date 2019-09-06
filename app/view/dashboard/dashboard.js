/**
 * @Author Miguel Porras
 * @Date 28/06/2019
 * @xtype dashboard
 */
Ext.define('Tasker.view.dashboard.dashboard', {
    extend: 'Ext.panel.Panel',
    xtype: 'dashboard',
    controller: 'gauge-basic',
    // viewModel: {
    //     data: []
    // },

    width: 650,

    profiles: {
        classic: {
            insetPadding: 20
        },
        neptune: {
            insetPadding: 20
        },
        graphite: {
            insetPadding: 25
        }
    },

    tbar: [
        '->',
        {
            text: 'Refresh',
            handler: 'onRefresh'
        }
    ],

    items: [{
        xtype: 'panel',
        width: '100%',
        flex: 1,
        layout: {
            type: 'hbox',
            pack: 'center'
        },
        items: [
            {
                xtype: 'cartesian',
                height: 400,
                width: 400,
                store: {
                    fields: ['mph', 'fuel', 'temp', 'rpm' ],
                    data: [
                        { mph: 65, fuel: 50, temp: 150, rpm: 6000 }
                    ]
                },
                axes: [{
                    type: 'numeric',
                    position: 'left',
                    title: {
                        text: 'Sample Values',
                        fontSize: 15
                    },
                    fields: 'mph'
                }, {
                    type: 'category',
                    position: 'bottom',
                    title: {
                        text: 'Sample Values',
                        fontSize: 15
                    },
                    fields: 'fuel'
                }],
                series: {
                    type: 'bar',
                    xField: 'mph',
                    yField: 'fuel'
                }
            }
        ]
    }],

    // listeners: {
    //     afterrender: 'onAfterRender'
    // }
});
