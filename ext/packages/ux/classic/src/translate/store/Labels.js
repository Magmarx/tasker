Ext.define('Ext.ux.translate.store.Labels', {
    extend: 'Ext.data.Store',
    model: 'Ext.ux.translate.model.Label',
    groupField: 'typeLabel',
    autoLoad: true,
    uuidLanguage: null,
    uuidModule: null, // set instantiation
    proxy: {
        type: 'ajax',
        url: Ext.manifest.handler.translateDesign,
        extraParams: {
            requestType: 'glp',
            uuidDesign: null, // model.get('uuidDesign'),
            uuidLanguage: null, // the value is set dynamic
            uuidMenu: null, // model.get('id'),
            uuidModule: this.uuidModule,
            uuidReference: null // the value is set dynamic
        },
        reader: {
            type: 'json'
        },
        listeners: {
            exception: function(that, response, operation) {
                console.log(response);
            },
            load: function(view, record, operation, modifiedFieldNames, eOpts) {}
        }
    },
    setUuidModule: function(uuid, load) {
        var me = this;
        if (uuid && typeof uuid === 'string' && me.uuidModule !== uuid) {
            me.uuidModule = uuid;
            me.proxy.extraParams.uuidModule = uuid;
            if (load) {
                me.load();
            }
        }
    },
    setParams: function(uuidDesign, uuidMenu, uuidLanguage, uuidReference, load) {
        var me = this;
        if (uuidMenu && uuidLanguage) {
            me.proxy.extraParams.uuidDesign = uuidDesign;
            me.proxy.extraParams.uuidMenu = uuidMenu;
            me.proxy.extraParams.uuidLanguage = uuidLanguage;
            me.uuidLanguage = uuidLanguage;
            me.proxy.extraParams.uuidReference = uuidReference;
            if (load) {
                me.load();
            }
        }
    },
    getUuidModule: function() {
        return this.uuidModule;
    },
    getUuidLanguage: function() {
        return this.uuidLanguage;
    }
});