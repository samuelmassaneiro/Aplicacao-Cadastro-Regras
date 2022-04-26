Ext.define('compliance.store.Operators', {
    extend: 'Ext.data.Store',

    alias: 'store.operators',

    fields: ['id', 'operator'],

    data: { items: [
        { "id": '1', "operator": 'Igual(=)'},
        { "id": '2', "operator": 'Valor Diferente (!=)'},
        { "id": '3', "operator": 'Valor Maior(>)'},
        { "id": '4', "operator": 'Valor Maior(>=)'},
        { "id": '5', "operator": 'Valor Menor(<)'},
        { "id": '6', "operator": 'Valor Menor(<=)'},
        { "id": '7', "operator": 'Contém texto'},
        { "id": '8', "operator": 'Vazio'},
        { "id": '9', "operator": 'Obrigatório'},
        { "id": '10', "operator": 'Intervalo Entre'},
    ]},

    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'items'
        }
    }
});