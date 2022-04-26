Ext.define('compliance.store.CertificateFor', {
    extend: 'Ext.data.Store',

    alias: 'store.certificatefor',

    fields: ['id', 'type'],

    data: { items: [
        { "id": '1', "type": 'Motor'},
        { "id": '2', "type": 'Naval'},
        { "id": '3', "type": 'Eficiência'},
    ]},

    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'items'
        }
    }
});