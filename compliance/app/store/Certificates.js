Ext.define('compliance.store.Certificates', {
    extend: 'Ext.data.Store',

    alias: 'store.certificates',

    fields: ['id', 'certificate'],

    data: { items: [
        { "id": '1', "certificate": 'UL CLASS'},
        { "id": '2', "certificate": 'UL SAFE'},
        { "id": '3', "certificate": 'CSA CLASS'},
        { "id": '4', "certificate": 'CSA SAFE'},
    ]},

    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'items'
        }
    }
});