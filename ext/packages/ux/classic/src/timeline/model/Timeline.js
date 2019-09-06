/**
 * Created by hmorjan on 14-Dec-15.
 */
Ext.define('Ext.ux.timeline.model.Timeline', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'attachUuid',
        type: 'string'
    }, {
        name: 'uuid',
        type: 'string'
    }, {
        name: 'rowId',
        type: 'string'
    }, {
        name: 'start',
        type: 'date'
    }, {
        name: 'startDate',
        type: 'date'
    }, {
        name: 'startTime',
        type: 'date'
    }, {
        name: 'content',
        type: 'object',
        fields: [{
            name: 'username',
            type: 'string'
        }, {
            name: 'userThumbnail',
            type: 'string'
        }, {
            name: 'name',
            type: 'string'
        }, {
            name: 'description',
            type: 'string'
        }, {
            name: 'comment',
            type: 'string'
        }, {
            name: 'thumbnail',
            type: 'string'
        }, {
            name: 'type',
            type: 'string'
        }, {
            name: 'fileType',
            type: 'string'
        }, {
            name: 'status',
            type: 'integer'
        }, {
            name: 'version',
            type: 'float'
        }, {
            name: 'from',
            type: 'object'
        }, {
            name: 'thru',
            type: 'object'
        }]
    }, {
        name: 'group',
        type: 'string'
    }]
});