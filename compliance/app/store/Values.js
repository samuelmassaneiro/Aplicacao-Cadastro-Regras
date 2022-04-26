Ext.define('compliance.store.Values', {
    extend: 'Ext.data.Store',

    alias: 'store.values',

    fields: ['id', 'value', 'valueDescription'],

    data: { items: [
    ]},

    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'items'
        }
    }
});