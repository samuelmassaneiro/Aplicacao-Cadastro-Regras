Ext.define('compliance.view.main.Window', {
	extend: 'Ext.Window',
	
    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'compliance.view.main.templateWindow.Controller',
        'compliance.view.main.editor.Clipboard',
        'compliance.util.Config',
		'compliance.view.main.editor.ComboBox'
    ],

	alias: 'widget.main.window',
	itemId: 'docTemplate',
	title:  Weg.locale.document_template,
	width: 500,
	height: 200,
	controller: 'view.main.template',
	layout: 'hbox',
	modal: true,
	items: [{
		layout: 'vbox',
		items: [{
			name: 'COMPLIANCE_TABELA_CERTIFICADO',  
			xtype: 'maestro.form.combobox',
			node: 'RULE_HEADER',
			width: 400,
			flex: 1,
			border: 1,
			editable: true,
			listeners:{
				'change': function(scope, value){
					globalThis.sheetValue = Number(value);
				}
			},
			typeAhead: true,
			typeAheadDelay: 10,
			margin: 5
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
			//compliance.util.Config.getViewport().objectSync.executeServerRequest('savenobutton');
			//compliance.util.Config.getViewport().objectSync.executeServerRequest('testRequest');
			compliance.util.Config.getViewport().objectSync.executeServerRequest('downloadSheet', [globalThis.sheetValue]);
		}
	}],

	listeners: {
        element: 'body',          
        render: {
            fn: 'initComponent',
            scope: 'controller'
          },
    
    }


});