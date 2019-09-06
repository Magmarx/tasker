Ext.define('Tasker.view.dashboard.widgets', {
    extend: 'Ext.panel.Panel',

    xtype: 'widgets',

    requires: [
        'Tasker.view.dashboard.widgetsController',
        'Tasker.view.dashboard.widgetsModel'
    ],

    controller: 'widgets',
    viewModel: {
        type: 'widgets'
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'panel',
        width: '100%',
        flex: 1,
        layout: {
            type: 'hbox',
            pack: 'center'
        },
        defaults: {
            height: '100%',
            width: '30%'
        },
        items: [
            {
                xtype: 'polar',
                insetPadding: 20,
                captions: {
                    title: {
                        text: 'Time to finish active task',
                        style: {
                            fontWeight: '300',
                            fontSize: 25,
                            color: '#A7A6A6'
                        }
                    }
                },
                store: {
                    fields: ['time', 'finished'],
                    data: [
                        {time: 80, finished: false}
                    ]
                },
                padding: '0 0 0 10',
                axes: {
                    type: 'numeric',
                    position: 'gauge',
                    majorTickSteps: 4,
                    renderer: 'onFuelAxisLabelRender'
                },
                series: {
                    type: 'gauge',
                    angleField: 'time',
                    donut: 50
                }
            },
            {
                xtype: 'polar',
                reference: 'chart',
                store: {
                    fields: ['month', 'data1', 'data2', 'data3', 'data4', 'other'],
                    data: [
                        {month: 'Jan', data1: 20, data2: 37, data3: 35, data4: 4, other: 4},
                        {month: 'Feb', data1: 20, data2: 37, data3: 36, data4: 5, other: 2},
                        {month: 'Mar', data1: 19, data2: 36, data3: 37, data4: 4, other: 4},
                        {month: 'Apr', data1: 18, data2: 36, data3: 38, data4: 5, other: 3},
                        {month: 'May', data1: 18, data2: 35, data3: 39, data4: 4, other: 4},
                        {month: 'Jun', data1: 17, data2: 34, data3: 42, data4: 4, other: 3},
                        {month: 'Jul', data1: 16, data2: 34, data3: 43, data4: 4, other: 3},
                        {month: 'Aug', data1: 16, data2: 33, data3: 44, data4: 4, other: 3},
                        {month: 'Sep', data1: 16, data2: 32, data3: 44, data4: 4, other: 4},
                        {month: 'Oct', data1: 16, data2: 32, data3: 45, data4: 4, other: 3},
                        {month: 'Nov', data1: 15, data2: 31, data3: 46, data4: 4, other: 4},
                        {month: 'Dec', data1: 15, data2: 31, data3: 47, data4: 4, other: 3}
                    ]
                },
                insetPadding: 20,
                interactions: ['rotate'],
                captions: {
                    title: {
                        text: 'Task by Project',
                        style: {
                            fontWeight: '300',
                            fontSize: 25,
                            color: '#A7A6A6'
                        }
                    }
                },
                axes: [{
                    type: 'numeric',
                    position: 'radial',
                    fields: 'data1',
                    renderer: 'onAxisLabelRender',
                    grid: true,
                    minimum: 0,
                    maximum: 25,
                    majorTickSteps: 4
                }, {
                    type: 'category',
                    position: 'angular',
                    grid: true
                }],
                series: [{
                    type: 'radar',
                    angleField: 'month',
                    radiusField: 'data1',
                    style: {
                        opacity: 0.80
                    },
                    highlight: {
                        fillStyle: '#000',
                        lineWidth: 2,
                        strokeStyle: '#fff'
                    }
                }]
            },
            {
                xtype: 'polar',
                reference: 'chart',
                captions: {
                    title: {
                        text: 'Priorities by project',
                        style: {
                            fontWeight: '300',
                            fontSize: 25,
                            color: '#A7A6A6'
                        }
                    }
                },
                insetPadding: 40,
                innerPadding: 20,
                store: {
                    fields: ['os', 'data1' ],
                    data: [
                        { os: 'Android', data1: 68.3 },
                        { os: 'BlackBerry', data1: 1.7 },
                        { os: 'iOS', data1: 17.9 },
                        { os: 'Windows Phone', data1: 10.2 },
                        { os: 'Others', data1: 1.9 }
                    ]
                },
                
                interactions: ['rotate'],
                series: [{
                    type: 'pie',
                    angleField: 'data1',
                    label: {
                        field: 'os',
                        calloutLine: {
                            length: 60,
                            width: 3
                            // specifying 'color' is also possible here
                        }
                    },
                    highlight: true,
                    tooltip: {
                        trackMouse: true,
                        renderer: 'onSeriesTooltipRender'
                    }
                }]
            }

        ]
    }, {
        xtype: 'panel',
        width: '100%',
        flex: 1,
        layout: {
            type: 'hbox',
            pack: 'center'
        },
        defaults: {
            height: '100%',
            width: '50%'
        },
        items: [
            {
                xtype: 'cartesian',
                reference: 'chart',
                interactions: {
                    type: 'panzoom',
                    zoomOnPanGesture: true
                },
                animation: {
                    duration: 200
                },
                store: {
                    fields: ['month', 'data1', 'data2', 'data3', 'data4', 'other'],
                    data: [
                        { month: 'Jan', data1: 20, data2: 37, data3: 35, data4: 4, other: 4 },
                        { month: 'Feb', data1: 20, data2: 37, data3: 36, data4: 5, other: 2 },
                        { month: 'Mar', data1: 19, data2: 36, data3: 37, data4: 4, other: 4 },
                        { month: 'Apr', data1: 18, data2: 36, data3: 38, data4: 5, other: 3 },
                        { month: 'May', data1: 18, data2: 35, data3: 39, data4: 4, other: 4 },
                        { month: 'Jun', data1: 17, data2: 34, data3: 42, data4: 4, other: 3 },
                        { month: 'Jul', data1: 16, data2: 34, data3: 43, data4: 4, other: 3 },
                        { month: 'Aug', data1: 16, data2: 33, data3: 44, data4: 4, other: 3 },
                        { month: 'Sep', data1: 16, data2: 32, data3: 44, data4: 4, other: 4 },
                        { month: 'Oct', data1: 16, data2: 32, data3: 45, data4: 4, other: 3 },
                        { month: 'Nov', data1: 15, data2: 31, data3: 46, data4: 4, other: 4 },
                        { month: 'Dec', data1: 15, data2: 31, data3: 47, data4: 4, other: 3 }
                    ]
                },
                innerPadding: {
                    left: 40,
                    right: 40
                },
                captions: {
                    title: {
                        text: 'Resolved Task By day',
                        style: {
                            fontWeight: '300',
                            fontSize: 25,
                            color: '#A7A6A6'
                        }
                    }
                },
                axes: [{
                    type: 'numeric',
                    position: 'left',
                    grid: true,
                    minimum: 0,
                    maximum: 24,
                    renderer: 'onAxisLabelRender'
                }, {
                    type: 'category',
                    position: 'bottom',
                    grid: true,
                    label: {
                        rotate: {
                            degrees: -45
                        }
                    }
                }],
                series: [{
                    type: 'line',
                    xField: 'month',
                    yField: 'data1',
                    style: {
                        lineWidth: 2
                    },
                    marker: {
                        radius: 4,
                        lineWidth: 2
                    },
                    label: {
                        field: 'data1',
                        display: 'over'
                    },
                    highlight: {
                        fillStyle: '#000',
                        radius: 5,
                        lineWidth: 2,
                        strokeStyle: '#fff'
                    },
                    tooltip: {
                        trackMouse: true,
                        showDelay: 0,
                        dismissDelay: 0,
                        hideDelay: 0,
                        renderer: 'onSeriesTooltipRender'
                    }
                }],
                listeners: {
                    itemhighlight: 'onItemHighlight'
                }
            },
            {
                xtype: 'cartesian',
                reference: 'chart',
                captions: {
                    title: {
                        text: 'Story points by week',
                        style: {
                            fontWeight: '300',
                            fontSize: 25,
                            color: '#A7A6A6'
                        }
                    }
                },
                store: {
                    fields: [
                        'month',
                        'high',
                        'low',
                        {
                            name: 'highF',
                            calculate: function (data) {
                                return data.high * 1.8 + 32;
                            }
                        },
                        {
                            name: 'lowF',
                            calculate: function (data) {
                                return data.low * 1.8 + 32;
                            }
                        }
                    ],
                    data: [
                        { month: 'Jan', high: 14.7, low: 5.6  },
                        { month: 'Feb', high: 16.5, low: 6.6  },
                        { month: 'Mar', high: 18.6, low: 7.3  },
                        { month: 'Apr', high: 20.8, low: 8.1  },
                        { month: 'May', high: 23.3, low: 9.9  },
                        { month: 'Jun', high: 26.2, low: 11.9 },
                        { month: 'Jul', high: 27.7, low: 13.3 },
                        { month: 'Aug', high: 27.6, low: 13.2 },
                        { month: 'Sep', high: 26.4, low: 12.1 },
                        { month: 'Oct', high: 23.6, low: 9.9  },
                        { month: 'Nov', high: 17  , low: 6.8  },
                        { month: 'Dec', high: 14.7, low: 5.8  }
                    ]
                },
                axes: [{
                    type: 'numeric',
                    position: 'left',
                    minimum: 30,
                    titleMargin: 20,
                    title: {
                        text: 'Temperature in °F'
                    },
                    listeners: {
                        rangechange: 'onAxisRangeChange'
                    }
                }, {
                    type: 'category',
                    position: 'bottom'
                }],
                animation: Ext.isIE8 ? false : true,
                series: {
                    type: 'bar',
                    xField: 'month',
                    yField: 'highF',
                    style: {
                        minGapWidth: 20
                    },
                    highlight: {
                        strokeStyle: 'black',
                        fillStyle: 'gold'
                    },
                    label: {
                        field: 'highF',
                        display: 'insideEnd',
                        renderer: 'onSeriesLabelRender'
                    }
                }
            }
        ]
    }],
});
