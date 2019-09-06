Ext.define('Ext.ux.translate.store.Percentages', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    fields: [{
        name: 'name',
        type: 'string'
    }, {
        name: 'description',
        type: 'string'
    }, {
        name: 'initials',
        type: 'string'
    }, {
        name: 'uuidLanguage',
        type: 'string'
    }, {
        name: 'label',
        type: 'string'
    }, {
        name: 'progress',
        type: 'string'
    }],
    proxy: {
        type: 'ajax',
        url: Ext.manifest.handler.translateDesign,
        extraParams: {
            requestType: 'ptl',
            uuidDesign: null, // model.get('uuidDesign'),
            uuidMenu: null // model.get('id')
        },
        reader: {
            type: 'json'
        }
    },
    setParams: function(uuidDesign, uuidMenu, loadStore) {
        var me = this;
        if (uuidMenu && uuidMenu != me.proxy.extraParams.uuidMenu) {
            me.proxy.extraParams.uuidDesign = uuidDesign;
            me.proxy.extraParams.uuidMenu = uuidMenu;
            if (loadStore) {
                me.load();
            }
        }
    },
    getUuidMenu: function() {
        return this.proxy.extraParams.uuidMenu;
    }
});