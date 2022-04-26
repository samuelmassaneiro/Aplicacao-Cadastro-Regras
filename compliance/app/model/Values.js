Ext.define('compliance.model.Values', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id',
        type: 'int'
    },{
        name: 'value', 
        type: 'string'
    },{
        name: 'valueDescritption', 
        type: 'string'
    }
],        
    proxy: {
    type: 'rest',
}

});
