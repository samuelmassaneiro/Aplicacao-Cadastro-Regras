Ext.define('compliance.state.requests.FilterBaseRules', {
    extend: 'compliance.state.Requests',

    singleton: true,

    setObjectContextSynchronizer: function() {
        this.callParent(arguments);
        this.requestObject = {
            method: 'POST',
            url: '/maestro/resources/compliance/filterbase/',
            success: this.successCallback.bind(this),
            failure: this.errorHandler.bind(this)
        }
    },

    successCallback: function(response) {
        var me = this,
            oc = this.getObjectContextSynchronizer(),
            data;
        if (this.isValidJson(response.responseText)) {
            var data = Ext.decode(response.responseText);
            let resultGrid = Ext.first('#rulesResultGrid');
            resultGrid.setLoading(true);
            let store = Ext.create('Ext.data.Store', {
                data: data.rules,
                fields: ['versionId', 'version', 'description']
            });
            let columns = [
                {header: 'ID', dataIndex: 'versionId', width: 100}, 
                {header: Weg.locale.compliance_sequence, dataIndex: 'sequence',width: 100 },
                {header: Weg.locale.compliance_description, dataIndex: 'description', width: 200}
            ];

            resultGrid.setLoading(false);
			//Reconfigura o grid com o Store e as Colunas
			resultGrid.reconfigure(store, columns);
			//Atualiza tamanho das colunas
/* 			resultGrid.getColumns().forEach(function (col) {
				col.autoSize();
			}); */
            //oc.processObjectContext(obj);
        } else {
            me.errorHandler(response);
            oc.clearProcessingServerRequest();
        }
        oc.fireEvent('save');
    },

    execute: function(status, note) {
        var me = this,
            oc = this.getObjectContextSynchronizer(),
            context;

        var makeRequest = function() {
            var context = oc.getModifiedRecords();
            if (!context.ObjectHeader) {
                context.ObjectHeader = {
                    ObjectType: {
                        'Id': this.objectTypeId
                    },
                    ObjectVariant: [{
                        'ObjectValue': []
                    }]
                };
            }
            if (status) context.ObjectHeader.ObjectVariant[0].Status = status;
            //if (note) context.ObjectHeader.ObjectVariant[0].Note = note;
            //console.log(Ext.getCmp("charid").getValue() + ' Valor da linha')
            //context.ObjectHeader.ObjectVariant[0].Note = Ext.getCmp("charid").getValue();
            me.requestObject.params = Ext.JSON.encode(context);
            Ext.Ajax.request(Ext.apply(me.requestObject, me.defaultRequestOpts));
        };

        if (oc.fireEvent('beforeSave', oc) !== false) {
                makeRequest();
        }
    }
});
