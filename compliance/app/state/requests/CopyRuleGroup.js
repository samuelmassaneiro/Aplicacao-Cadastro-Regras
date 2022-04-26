//@charset UTF-8
Ext.define('compliance.state.requests.CopyRuleGroup', {
    extend: 'compliance.state.Requests',

    singleton: true,

    setObjectContextSynchronizer: function() {
        this.callParent(arguments);
        this.requestObject = {
            method: 'GET',
            url: '/maestro/resources/compliance/copyrulegroup',
            success: this.successCallback.bind(this),
            failure: this.errorHandler.bind(this)
        }
    },

    successCallback: function(response) {
        var me = this,
            oc = this.getObjectContextSynchronizer(),
            obj;
        if (this.isValidJson(response.responseText)) {
            var obj = Ext.decode(response.responseText);
            oc.processObjectContext(obj);
            //compliance.util.Config.getViewport().objectSync.executeServerRequest('createMaestroRule');
        } else {
            me.errorHandler(response);
            oc.clearProcessingServerRequest();
        }
        oc.fireEvent('onNewRule');
    },

    execute: function(sender, receiver) {
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
            console.log(sender);
            console.log(receiver);
            var param = {'senderId': sender,'receiverId': receiver};
            me.requestObject.params = param;
            //Ext.MessageBox.wait('Loading ...');
            Ext.Ajax.request(Ext.apply(me.requestObject, me.defaultRequestOpts));
        };

        if (oc.fireEvent('beforeSave', oc) !== false) {
            Ext.Msg.show({
                title: 'Copiar Grupo de Regras',
                message: 'Deseja copiar as regras de um certificado para o outro?',
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                fn: function(btn) {
                    if (btn === 'yes') {
                        makeRequest() & fireEvent('onNewRule');
                    } else {
                        oc.fireEvent('save', oc);
                    }
                }
            });
        }
        oc.fireEvent('onNewRule');
    }

});
