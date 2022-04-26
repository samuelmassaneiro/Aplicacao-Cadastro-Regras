Ext.define('compliance.state.requests.CopyRules', {
    extend: 'compliance.state.Requests',

    singleton: true,

    setObjectContextSynchronizer: function() {
        this.callParent(arguments);
        this.requestObject = {
            method: 'POST',
            url: '/maestro/resources/compliance/copy',
            success: this.successCallback.bind(this),
            failure: this.errorHandler.bind(this)
        }
    },

    successCallback: function(response) {
        var me = this,
            oc = this.getObjectContextSynchronizer(),
            data;
        Ext.Ajax.request({
            url: '/maestro/resources/mirror/values/' + 'RULE_HEADER->dependency',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Accept': 'application/json;charset=UTF-8'
            },
            success: function(response){					
                    let ov = Ext.decode(response.responseText);
                    var characteristicArray = [];
                    var operatorArray = [];
                    var initialArray = [];
                    var finalArray = [];
                    let storeArray = [];
                    let cont = 0;
                    let lastName = '';
                    ov.objectValues.forEach(function(meta, index){
                        if(meta.characteristic.Name === 'CHARACTERISTIC_DEP') {
                            if (lastName != meta.characteristic.Name) {
                                cont = 0;
                            }
                            characteristicIndex = meta.characteristic.Name;
                            characteristicArray[cont] = {[meta.characteristic.Name]: meta.propertyValue.Description};
                            lastName = meta.characteristic.Name;
                            cont++;
                        };
                        if(meta.characteristic.Name === 'OPERATOR_DEP') {
                            if (lastName != meta.characteristic.Name) {
                                cont = 0;
                            }
                            operatorIndex = meta.characteristic.Name;
                            operatorArray[cont] = {[meta.characteristic.Name]: meta.propertyValue.Value};
                            lastName = meta.characteristic.Name;
                            cont++;
                        };
                        if(meta.characteristic.Name === 'VALUE_INITIAL_DEP') {
                            if (lastName != meta.characteristic.Name) {
                                cont = 0;
                            }
                            valueInitialIndex = meta.characteristic.Name;
                            initialArray[cont] = {[meta.characteristic.Name]: meta.propertyValue.Description};
                            lastName = meta.characteristic.Name;
                            cont++;
                        };
                        if(meta.characteristic.Name === 'VALUE_FINAL_DEP') {
                            if (lastName != meta.characteristic.Name) {
                                    cont = 0;
                                }
                                valueFinalIndex = meta.characteristic.Name;
                                if (meta.propertyValue.Value === undefined){
                                    finalArray[cont] = {[meta.characteristic.Name]: ''};
                                } else {
                                    finalArray[cont] = {[meta.characteristic.Name]: meta.propertyValue.Value};
                                }
                                lastName = meta.characteristic.Name;
                                cont++;
                            };
                        });
                        for (k = 0; k < characteristicArray.length; k++){
                            if (k < finalArray.length && (operatorArray[k][operatorIndex] != Weg.locale.compliance_required 
                                || operatorArray[k][operatorIndex] != Weg.locale.compliance_empty)) {
                                storeArray[k] = {[characteristicIndex]: characteristicArray[k][characteristicIndex],
                                [operatorIndex]: operatorArray[k][operatorIndex],
                                [valueInitialIndex]: initialArray[k][valueInitialIndex],
                                [valueFinalIndex]: finalArray[k][valueFinalIndex]};
                            } else if (k < finalArray.length && (operatorArray[k][operatorIndex] != Weg.locale.compliance_required 
                                || operatorArray[k][operatorIndex] != Weg.locale.compliance_empty)) {
                                    storeArray[k] = {[characteristicIndex]: characteristicArray[k][characteristicIndex],
                                        [operatorIndex]: operatorArray[k][operatorIndex],
                                        [valueInitialIndex]: "",
                                        [valueFinalIndex]: ""};
                            } else if (k > finalArray.length && (operatorArray[k][operatorIndex] == Weg.locale.compliance_required 
                                || operatorArray[k][operatorIndex] == Weg.locale.compliance_empty))  {
                                    storeArray[k] = {[characteristicIndex]: characteristicArray[k][characteristicIndex],
                                        [operatorIndex]: operatorArray[k][operatorIndex],
                                        [valueInitialIndex]: "",
                                        [valueFinalIndex]: ""};
                            } else {
                                storeArray[k] = {[characteristicIndex]: characteristicArray[k][characteristicIndex],
                                    [operatorIndex]: operatorArray[k][operatorIndex],
                                    [valueInitialIndex]: initialArray[k][valueInitialIndex],
                                    [valueFinalIndex]: ""};
                            }
                        }
                        let grid = Ext.first('#maestrogrid');
                        let store = Ext.first('#maestrogrid').getStore();
                        store.removeAll();
                        store.add(storeArray);
                        grid.reconfigure(store);
                        compliance.util.Config.getViewport().objectSync.executeServerRequest('savenobutton');
                        Ext.first('#usebaserule').setValue(false)
                        Ext.Msg.alert(Weg.locale.copy, 'A regra foi copiada com sucesso!', Ext.emptyFn);
                },
                failure: function(response) {
                    Ext.Msg.alert(Weg.locale.copy, 'A regra não foi copiada!', Ext.emptyFn);
                }
            })
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
            me.requestObject.params = Ext.JSON.encode(context);
            Ext.Ajax.request(Ext.apply(me.requestObject, me.defaultRequestOpts));
        };

        if (oc.fireEvent('beforeSave', oc) !== false) {
            Ext.Msg.show({
                title: Weg.locale.copy,
                message: Weg.locale.compliance_copy_message,
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                fn: function(btn) {
                    if (btn === 'yes') {
                        makeRequest();
                    } else {
                        oc.fireEvent('save', oc);
                    }
                }
            });
        }
    }
});
