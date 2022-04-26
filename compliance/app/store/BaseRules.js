Ext.define('compliance.store.BaseRules', {
    extend: 'Ext.data.Store',

    alias: 'store.baserules',

    fields: ['id', 'certificates'],

    data: { items: [
        { "id": '1', "certificates": 'UL CLASS'},
        { "id": '2', "certificates": 'UL SAFE'},
        { "id": '3', "certificates": 'CSA CLASS'},
        { "id": '4', "certificates": 'CSA SAFE'},
    ]},

    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'items'
        }
    }
});