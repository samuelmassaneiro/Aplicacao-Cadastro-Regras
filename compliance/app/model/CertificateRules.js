Ext.define('compliance.model.CertificateRules', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'CHARACTERISTIC_DEP',

        type: 'string'
    },{
        name: 'OPERATOR_DEP', 
        type: 'string'
    },{
        name: 'VALUE_INITIAL_DEP', 
        type: 'string'
    },{
        name: 'VALUE_FINAL_DEP', 
        type: 'string'
    }
],
    idProperty: 'certificateRules',

    

});


