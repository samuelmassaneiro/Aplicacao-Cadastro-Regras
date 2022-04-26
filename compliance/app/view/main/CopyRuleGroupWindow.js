Ext.define('compliance.view.main.CopyFileWindow', {
	extend: 'Ext.Window',
	
    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'compliance.view.main.copyGroupWindow.Controller',
        'compliance.view.main.editor.Clipboard',
        'compliance.util.Config',
		'compliance.view.main.editor.ComboBox'
    ],

	alias: 'widget.main.rulewindow',
	itemId: 'copyRuleGroup',
	title:  'Copiar Grupo de Regras',
	width: 450,
	height: 220,
	controller: 'view.main.copygroup',
	layout: 'hbox',
	modal: true,
	resizable: false,
	closable: true,
	handler: console.log("handlado"),
	items: [{
		layout: 'vbox',
		items: [{
			xtype: 'displayfield',
			value: "Copia todas as regras um grupo e envia para um outro grupo escolhido",
			margin: 3
		},
		{
			name: 'COMPLIANCE_CERTIFICADO',
			width: 100,
			xtype: 'maestro.form.combobox',
			itemId: 'certificateCombo',
			node: 'RULE_HEADER->action',
			cls: 'comboCertificate',
			allowNullValue: true,
			labelWidth: 90,
			editable: true,
			typeAhead: true,
			typeAheadDelay: 10,
			width: 400,
			listeners: {
				'change': function(e, value){
					globalThis.sender = value;
				}
			}
		},
		{
			name: 'COMPLIANCE_CERTIFICADO_RECEIVER',
			xtype: 'maestro.form.combobox',
			itemId: 'certificateReceiverCombo',
			node: 'RULE_HEADER->action',
			cls: 'comboCertificate',
			allowNullValue: true,
			labelWidth: 90,
			editable: true,
			typeAhead: true,
			typeAheadDelay: 10,
			width: 400,
			listeners: {
				'change': function(e, value){
					globalThis.receiver = value;
				}
			}
		}]
	}],
	bbar: [{
		xtype: 'maestro.button.button',
		text: Weg.locale.cancel,
		handler: (scope) => scope.up('window').destroy(),
	},
	{
		xtype: 'maestro.button.button',
		text: 'Limpar',
		handler: 'onNewRule',
	},
	{
		xtype: 'maestro.button.button',
		text: Weg.locale.confirm,
		handler: 'onCopyRuleGroup',
		
	}],

	listeners: {
        element: 'body',          
        render: {
            fn: 'initComponent',
            scope: 'controller'
          },
    
    }


});