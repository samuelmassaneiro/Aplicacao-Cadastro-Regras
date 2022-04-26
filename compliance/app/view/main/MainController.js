/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 */
Ext.define('compliance.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'compliance.store.CertificateRules'
    ],

    alias: 'controller.main',

    getObjectContextSynchronizer() {
        return compliance.util.Config.getViewport().objectSync;
    },

    onSaveBase: function(){
        let size = Ext.first('#maestrogrid').getStore().data.items.length;
        let save;
        if (size >= 1){
            save = true;
        } else {
            Ext.Msg.alert( Weg.locale.compliance_checkbox_message,  Weg.locale.compliance_dep_message, Ext.emptyFn);
            save = false;
            return;
        }
        if (Ext.first('#certificatebaserule').checked === false) {
            Ext.Msg.alert( Weg.locale.compliance_checkbox_message,  Weg.locale.compliance_rulecheck_message, Ext.emptyFn);
            save = false;
            return;
        } else if (Ext.first('#certificateCombo').getValue() == null || Ext.first('#certificateCombo').getValue() == "") {
            Ext.Msg.alert( Weg.locale.compliance_checkbox_message,  Weg.locale.compliance_certificate_message, Ext.emptyFn);
            save = false;
            return;
        } else if (Ext.first('#textDescription').getValue() == '') {
            Ext.Msg.alert( Weg.locale.compliance_checkbox_message, Weg.locale.compliance_desc_message, Ext.emptyFn);
            save = false;
            return;
        }
        for (var i = 0; i <size - globalThis.sizeDeleted; i++){
            if (Ext.first('#maestrogrid').getStore().data.items[i].data.OPERATOR_DEP == undefined ||
            Ext.first('#maestrogrid').getStore().data.items[i].data.CHARACTERISTIC_DEP == undefined ||
            Ext.first('#maestrogrid').getStore().data.items[i].data.VALUE_INITIAL_DEP == undefined) {
                if (Ext.first('#maestrogrid').getStore().data.items[i].data.OPERATOR_DEP == 7 || 
                    Ext.first('#maestrogrid').getStore().data.items[i].data.OPERATOR_DEP == 6 && 
                    Ext.first('#maestrogrid').getStore().data.items[i].data.CHARACTERISTIC_DEP != undefined){
                } else {
                    Ext.Msg.alert( Weg.locale.compliance_checkbox_message,  Weg.locale.compliance_dep_message_two, Ext.emptyFn);
                    save = false;
                }
            }
            if (Ext.first('#maestrogrid').getStore().data.items[i].data.OPERATOR_DEP == 8 && 
            Ext.first('#maestrogrid').getStore().data.items[i].data.VALUE_FINAL_DEP == undefined) {
                Ext.Msg.alert( Weg.locale.compliance_checkbox_message, Weg.locale.compliance_operator_message, Ext.emptyFn);
                save = false;
            }
        }
        if (save == true) {
            compliance.util.Config.getViewport().objectSync.executeServerRequest('saveBase');
        }
    },

    onSaveRule: function(){
        let size = Ext.first('#maestrogrid').getStore().data.items.length;
        let save;
        if (size >= 1){
            save = true;
        } else {
            Ext.Msg.alert(Weg.locale.compliance_checkbox_message,  Weg.locale.compliance_dep_message, Ext.emptyFn);
            save = false;
            return;
        }
        if (Ext.first('#characteristiclog').getValue() == ""){
            Ext.Msg.alert(Weg.locale.compliance_checkbox_message,  'Selecione uma caracteristica de LOG!', Ext.emptyFn);
            save = false;
            return;
        }
        if (Ext.first('#certificateCombo').getValue() == null || Ext.first('#certificateCombo').getValue() == "") {
            Ext.Msg.alert(Weg.locale.compliance_checkbox_message,  Weg.locale.compliance_certificate_message, Ext.emptyFn);
            save = false;
            return;
        }
        if (Ext.first('#logtype').getValue() == null) {
            Ext.Msg.alert(Weg.locale.compliance_checkbox_message,  'Falta tipo de log', Ext.emptyFn);
            save = false;
            return;
        }
        if (Ext.first('#logtype').getValue() == 0001) {
            if (Ext.first('#logpt').getValue() == '' || Ext.first('#logen').getValue() == '' || Ext.first('#loges').getValue() == '') {
                Ext.Msg.alert(Weg.locale.compliance_checkbox_message, Weg.locale.compliance_add_log, Ext.emptyFn);
                save = false;
                return;
            }
        }
        if (Ext.first('#baserulecombo').getValue() == 0001){
            Ext.Msg.alert(Weg.locale.compliance_checkbox_message, 'Use o botão salvar como base', Ext.emptyFn);
            save = false;
            return;
        }
        for (var i = 0; i <size - globalThis.sizeDeleted; i++){
            if (Ext.first('#maestrogrid').getStore().data.items[i].data.OPERATOR_DEP == undefined ||
            Ext.first('#maestrogrid').getStore().data.items[i].data.CHARACTERISTIC_DEP == undefined ||
            Ext.first('#maestrogrid').getStore().data.items[i].data.VALUE_INITIAL_DEP == undefined) {
                if (Ext.first('#maestrogrid').getStore().data.items[i].data.OPERATOR_DEP == 7 || 
                    Ext.first('#maestrogrid').getStore().data.items[i].data.OPERATOR_DEP == 6 && 
                    Ext.first('#maestrogrid').getStore().data.items[i].data.CHARACTERISTIC_DEP != undefined){
                } else {
                    Ext.Msg.alert( Weg.locale.compliance_checkbox_message,  Weg.locale.compliance_dep_message_two, Ext.emptyFn);
                    save = false;
                }
            }
            if (Ext.first('#maestrogrid').getStore().data.items[i].data.OPERATOR_DEP == 8 && 
            Ext.first('#maestrogrid').getStore().data.items[i].data.VALUE_FINAL_DEP == undefined) {
                Ext.Msg.alert( Weg.locale.compliance_checkbox_message, Weg.locale.compliance_operator_message, Ext.emptyFn);
                save = false;
            }
        }
        if (save == true) {
            compliance.util.Config.getViewport().objectSync.executeServerRequest('save');
        }
    },

    onSaveContext: function(){
        //compliance.util.Config.getViewport().objectSync.executeServerRequest('savenobutton');
        compliance.util.Config.getViewport().objectSync.executeServerRequest('testRequest');
        //compliance.util.Config.getViewport().objectSync.executeServerRequest('getBaseRules');
        //console.log(Ext.first('#baserulecombo').value);
    },

    onLoad: function(){
        compliance.util.Config.getViewport().objectSync.executeServerRequest('createMaestroRule');
    },

    onApplyChange(){
        compliance.util.Config.getViewport().objectSync.executeServerRequest('applyChanges');               
    },
    
    onChange: function(){
        compliance.util.Config.getViewport().objectSync.executeServerRequest('applyRules');               
    },
    
    onNewRule(){
        compliance.util.Config.getViewport().objectSync.executeServerRequest('newObjectContext');
        Ext.first('#certificatebaserule').setValue(false); 
        Ext.ComponentQuery.query('#maestrogrid')[0].getStore().removeAll();
    },

    onBlockRule(){
        if (Ext.first('#ruleid').getValue() != ''){
            compliance.util.Config.getViewport().objectSync.executeServerRequest('blockRule');
        } else {
            Ext.Msg.alert(Weg.locale.delete_, Weg.locale.compliance_blank_delete, Ext.emptyFn);
        }
    },

    onLoadSheet(){
        compliance.util.Config.getViewport().objectSync.executeServerRequest('loadSheet');
    },

    onCopyRules(){
        if (Ext.first('#ruleid').getValue() != ''){
            compliance.util.Config.getViewport().objectSync.executeServerRequest('copyRules');  
        } else {
            Ext.Msg.alert(Weg.locale.copy, Weg.locale.compliance_blank_copy, Ext.emptyFn);
        }
    }, 
    
    onCopyRuleGroup(){
        let copyRuleGroup = true;
        if  (Ext.first('#certificateReceiverCombo').getValue() == null || Ext.first('#certificateReceiverCombo').getValue() == ""
         & Ext.first('#certificateCombo').getValue() == null || Ext.first('#certificateCombo').getValue() == "" ){
            Ext.Msg.alert(Weg.locale.compliance_checkbox_message,  'Selecione um certificado doador e um outro receptor!', Ext.emptyFn);
            copyRuleGroup = false;
            return;
        }
        if  (Ext.first('#certificateReceiverCombo').getValue() == null || Ext.first('#certificateReceiverCombo').getValue() == ""){
            Ext.Msg.alert(Weg.locale.compliance_checkbox_message,  'Selecione uma certificado receptor!', Ext.emptyFn);
            copyRuleGroup = false;
            return;
        }
        if (Ext.first('#certificateCombo').getValue() == null || Ext.first('#certificateCombo').getValue() == "") {
            Ext.Msg.alert(Weg.locale.compliance_checkbox_message,  'Selecione um certificado doador!', Ext.emptyFn);
            copyRuleGroup = false;
            return;
        }
        if (copyRuleGroup == true) {
            compliance.util.Config.getViewport().objectSync.executeServerRequest('copyRuleGroup',[globalThis.sender,globalThis.receiver]);
        }
    },

    onChangeComboBox(){
        
        compliance.util.Config.getViewport().objectSync.executeServerRequest('comboBox'); 
    },

    onApplyRuleGroup(){
        compliance.util.Config.getViewport().objectSync.executeServerRequest('applyRules');
    },

    onSelectSheet: function(){
        var comboValue = Ext.first('#sheetCombo').rawValue;
        Ext.first('#sheetCombo').setWidth(200);
        if (comboValue == Weg.locale.yes){
            Ext.first('#loadExcelButton').setDisabled(false);
            Ext.first('#loadExcelButton').setHidden(false);
        } else if (comboValue == ''){
            Ext.first('#sheetCombo').setWidth(505);
            Ext.first('#loadExcelButton').setDisabled(true);
        } else {
            Ext.first('#loadExcelButton').setDisabled(true);
        }
    },

    onShowLogs: function(){
        let logPt = Ext.first('#logpt');
        let logEn = Ext.first('#logen');
        let logEs = Ext.first('#loges');
        if(Ext.first('#logtype').getValue() == 0001 || Ext.first('#logtype').getValue() == 'Adicionar'){
            logPt.setHidden(false);
            logEn.setHidden(false);
            logEs.setHidden(false);
        } else {
            logPt.setHidden(true);
            logEn.setHidden(true);
            logEs.setHidden(true);
        }
        Ext.first('#maestrogrid').fireEvent('afterrender');
    },

    onChangeMultiValue: function(){
        compliance.util.Config.getViewport().objectSync.executeServerRequest('applyRules');    
    },

    checkOperator: function (editEvent, context, e) {
        var record = context.record;
        var column = context.colIdx

        if(record.get('operador') !== 'Intervalo Entre' && column == 3) {
            return false;
        }
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
            Ext.Msg.alert('Confirmado', 'Está confirmado')
        }
    },

    baseRule: function(sender){
        store = Ext.first('#baserulecombo').getStore().load();
        setTimeout(function(){
            if(Ext.first('#certificatebaserule').checked === true) {
                Ext.first('#baserulecombo').select(store.getAt(1));
                //Ext.first('#infoCombo').setHidden(false);
                Ext.first('#logtype').setHidden(true);
                Ext.first('#logpt').setHidden(true);
                Ext.first('#logen').setHidden(true);
                Ext.first('#loges').setHidden(true);
                Ext.first('#characteristiclog').setHidden(true);
                Ext.first('#maestrogrid').fireEvent('afterrender');
            } else {
                Ext.first('#baserulecombo').select(store.getAt(0));
                //Ext.first('#infoCombo').setHidden(true);
                Ext.first('#logtype').setHidden(false);
                if(Ext.first('#logtype').getValue() == '0001'){
                    Ext.first('#logpt').setHidden(false);
                    Ext.first('#logen').setHidden(false);
                    Ext.first('#loges').setHidden(false);
                }
                Ext.first('#characteristiclog').setHidden(false);
                Ext.first('#maestrogrid').fireEvent('afterrender');
            }
        }, 100)
    },

    useBaseRule: function(sender){
        if(sender.checked === true) {
            Ext.first('#filterdescription').setHidden(false)
            Ext.first('#usebaserulebutton').setHidden(false)
        } else {
            Ext.first('#filterdescription').setHidden(true)
            Ext.first('#usebaserulebutton').setHidden(true)
        }
    },

    selectBaseRuleTow: function(record){
        console.log(record);
    },

    selectBaseRule: function(record){
		Ext.first('#criteriaPanel').getSelectionModel().select(3);
		var table = Ext.first('#criteriaPanel').getView();
		var recordCriteria = Ext.first('#criteriaPanel').getSelectionModel().getSelection()[0];
		globalThis.param = Ext.first('#filterdescription').value;
		Ext.create('compliance.view.filter.ConditionWindow', {
			currentRecord: recordCriteria,
			listeners: {
				destroy: function () {
					table.up('grid').reconfigure();
				}
			}
		}).show();
		setTimeout(function(){
			Ext.first('#applyCriteriaButton').fireEvent('click');
			setTimeout(function(){
				Ext.first('#filterButton').fireEvent('click');
                setTimeout(function(){
                    let headerID = Ext.first('#displayHeader').getValue();
                    if(Ext.isNumber(parseInt(headerID))) {
                        Ext.getBody().mask("LOADING...");
                        Ext.Ajax.request({ 
                            url: '/maestro/resources/mirror/load/' + headerID,
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json;charset=UTF-8',
                                'Accept': 'application/json;charset=UTF-8'
                            },
                            success: function (response) {
                                Ext.getBody().unmask();
                                let responseData = Ext.decode(response.responseText);
                                compliance.util.Config.getViewport().objectSync.executeServerRequest('copyRules');
                            },
                            failure: function(response){
                                console.log(response.responseText)
                            }
                        })
                    }
                }, 400)
			}, 200)
		}, 100) 
	},

    
    buttonName: function(){
        var button = Ext.first('#loadbutton');
    },

    renderRulesTab: function(){
        //Ext.first('#rulesPanel').fireEvent('afterrender');
        //Ext.first('#rulesPanelTeste').fireEvent('afterrender');
    },
    
	disableRules: function(){
		//Ext.first('#mainpanelPanel').disable();
	},

    setFormFieldTooltip: function(component) {
        if (component.getXType() == 'maestro.form.textfield') {    
            Ext.QuickTips.register({
                target: Ext.first('#infoCombo').getEl(),
                text: component.tooltipText,
                dismissDelay: 15000,
                title: ''
            });
        }
    },

    loadExcelSheet() {
        Ext.create('Ext.Window', {
            title: Weg.locale.compliance_load_sheet,
            width: 400,
            height: 200,
            layout: 'hbox',
            modal: true,
            referenceHolder: true,
            items: [{
                layout: 'vbox',
                items: [{
                    xtype: 'displayfield',
                    value: Weg.locale.compliance_load_sheet_window_text,
                    margin: 5
                },{
                    xtype: 'maestro.button.button',
                    text: Weg.locale.document_template,
                    cls: 'grid',
                    itemId: 'templateButton',
                    handler: function(){
                        var panel = Ext.create({
                            xtype: 'main.window'
                        });
                        panel.show(); 
                        //Ext.first('#mainpanelPanel').getController().windowTemplate();
                    } 
                },{
                    xtype: 'filefield',
                    name: 'spreadsheet',
                    flex: 1,
                    margin: 5,
                    width: 350,
                    fieldLabel: Weg.locale.file,
                }]
            }],
            bbar: [{
                xtype: 'maestro.button.button',
                text: Weg.locale.cancel,
                handler: (scope) => scope.up('window').destroy(),
            }, {
                xtype: 'maestro.button.button',
                cls: 'btn',
                text: Weg.locale.confirm,
                handler: (scope) => {
                    let window = scope.up('window'),
                    file = window.down('filefield').fileInputEl.dom.files[0];
                    if (file) {
                        globalThis.pathUrl = file.name;
                        this.getObjectContextSynchronizer().executeServerRequest('loadExcelSheet', [file, globalThis.pathUrl] );
                        window.destroy();
                    } else {
                        Ext.Msg.alert(Weg.locale.compliance_load_sheet_window, Weg.locale.compliance_load_sheet_window_msg, Ext.emptyFn)
                    }
                }
            }]
        }).show();
    },

    windowTemplate() {
        Ext.create('Ext.Window', {
            title:  Weg.locale.document_template,
            width: 400,
            height: 200,
            controller: 'main',
            layout: 'hbox',
            modal: true,
            referenceHolder: true,
            items: [{
                layout: 'vbox',
                items: [{
                    name: 'COMPLIANCE_TABELA_CERTIFICADO',  
                    xtype: 'maestro.form.combobox',
                    flex: 1,
                    border: 1,
                    itemId: 'certificateSheetCombo',
                    node: 'RULE_HEADER',
                    margin: 5
                },{
                    xtype: 'maestro.button.button',
                    text: Weg.locale.document_template,
                    cls: 'grid',
                },{
                    xtype: 'filefield',
                    name: 'spreadsheet',
                    flex: 1,
                    margin: 5,
                    width: 350,
                    fieldLabel: Weg.locale.file,
                }]
            }],
            bbar: [{
                xtype: 'maestro.button.button',
                text: Weg.locale.cancel,
                handler: (scope) => scope.up('window').destroy(),
            }, {
                xtype: 'maestro.button.button',
                cls: 'btn',
                text: Weg.locale.confirm,
                handler: (scope) => {
                    let window = scope.up('window'),
                    file = window.down('filefield').fileInputEl.dom.files[0];
                    if (file) {
                        globalThis.pathUrl = file.name;
                        this.getObjectContextSynchronizer().executeServerRequest('loadExcelSheet', [file, globalThis.pathUrl] );
                        window.destroy();
                    } else {
                        Ext.Msg.alert(Weg.locale.compliance_load_sheet_window, Weg.locale.compliance_load_sheet_window_msg, Ext.emptyFn)
                    }
                }
            }]
        }).show();
    }
});
