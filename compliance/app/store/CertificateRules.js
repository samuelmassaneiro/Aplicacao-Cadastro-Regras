Ext.define('compliance.store.CertificateRules', {
    extend: 'Ext.data.Store',

    alias: 'store.certificaterules',

    model: 'compliance.model.CertificateRules',

    data: { items: [
        { 
            name: "CHARACTERISTIC_DEP",
            node: 'RULE_HEADER->dependency', 
        },{
            name: "OPERATOR_DEP",
            node: 'RULE_HEADER->dependency', 
        },{
             name: "VALUE_INITIAL_DEP",
             node: 'RULE_HEADER->dependency', 
        },{
            name: "VALUE_FINAL_DEP",
            node: 'RULE_HEADER->dependency', 
        }
    ]},

});
