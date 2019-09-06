Ext.define('Tasker.view.dashboard.widgetsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.widgets',

    onFuelAxisLabelRender: function (axis, label, layoutContext) {
        if (label === 0) return 'F';
        if (label === 25) return 'S';
        if (label === 50) return 'T';
        if (label === 75) return 'Fo';
        if (label === 100) return 'Fi';
        return ' ';
    },

    onAxisLabelRender: function (axis, label, layoutContext) {
        return layoutContext.renderer(label) + '%';
    },

    onSeriesTooltipRender: function (tooltip, record, item) {
        tooltip.setHtml(record.get('month') + ': ' + record.get('data1') + '%');
    },

    onItemHighlight: function (chart, newHighlightItem, oldHighlightItem) {
        this.setSeriesLineWidth(newHighlightItem, 4);
        this.setSeriesLineWidth(oldHighlightItem, 2);
    },

    setSeriesLineWidth: function (item, lineWidth) {
        if (item) {
            item.series.setStyle({
                lineWidth: lineWidth
            });
        }
    },

    onAxisRangeChange: function (axis, range) {
        var chart = axis.getChart(),
            store = chart.getStore(),
            average = store.average('highF');

        if (average) {
            axis.setLimits({
                value: average,
                line: {
                    title: {
                        text: 'Average high: ' + average.toFixed(2) + '°F'
                    },
                    lineDash: [2,2]
                }
            });
        } else {
            axis.setLimits(null);
        }
    },

    onSeriesLabelRender: function (value) {
        return value.toFixed(1);
    },

});
