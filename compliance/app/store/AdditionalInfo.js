Ext.define('compliance.store.AdditionalInfo', {
    extend: 'Ext.data.Store',

    alias: 'store.additionalinfo',

    fields: ['id', 'infos'],

    data: { items: [
        { "id": '1', "infos": 'Temp Code t1'},
        { "id": '2', "infos": 'Temp Code t2'},
        { "id": '3', "infos": 'Temp Code t3'},
        { "id": '4', "infos": 'Tempo tE t1'},
        { "id": '5', "infos": 'Tempo tE t2'},
        { "id": '6', "infos": 'Tempo tE t3'},
    ]},

    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'items'
        }
    }
});