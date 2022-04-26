Ext.define('compliance.state.requests.FilterRules', {
    extend: 'compliance.state.Requests',

    singleton: true,

    setObjectContextSynchronizer: function() {
        this.callParent(arguments);
        this.requestObject = {
            method: 'POST',
            url: '/maestro/resources/compliance/filter/',
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
            //console.log(data.rules);
            resultGrid.setLoading(true);
            let store = Ext.create('Ext.data.Store', {
                data: data.rules,
                fields: ['versionId', 'version', 'description']
            });
            let columns = [
                {header: 'ID', dataIndex: 'versionId', width: 75}, 
                {header: Weg.locale.compliance_sequence, dataIndex: 'sequence',width: 90},
                {header: Weg.locale.compliance_description, dataIndex: 'description', width: 215}
            ];

            resultGrid.setLoading(false);
			//Reconfigura o grid com o Store e as Colunas
			resultGrid.reconfigure(store, columns);
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
            //var context = oc.getModifiedRecords();
                var store = oc.getStore();
                var allRecords = (store.getData().getSource() || store.getData()).getRange();
                let r = [];
                for (var i = 0; i < allRecords.length; i++){
                    if(allRecords[i].data.value.length == 0 || allRecords[i].data.value[0] == null){

                    } else {
                        r.push(allRecords[i])
                    }
                }
                var context = oc._convertToObjectContext(r)             
                me.requestObject.params = Ext.JSON.encode(context);
                Ext.Ajax.request(Ext.apply(me.requestObject, me.defaultRequestOpts));
                oc.fireEvent('save');
        };

        if (oc.fireEvent('beforeSave', oc) !== false) {
                makeRequest();
        }
    },

});
