Ext.define('compliance.view.filterresult.Header', {
    extend: 'Maestro.panel.Panel',

    alias: 'widget.filterresult.header',

    controller: 'compliance.view.filterresult.controller',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'compliance.view.filterresult.Controller'
    ],
      
    layout: 'hbox',
    height: 100,
    items: [{
        xtype: 'maestro.button.button',
		text: Weg.locale.compliance_new_rule_button,
		cls: 'buttonMargin',
        width: 100,
		handler: 'newRule'
	},{
	    xtype: 'maestro.button.button',
		text: Weg.locale.compliance_editrule_button,
		itemId: 'editRulesButton',
        width: 100,
		cls: 'buttonMargin',
		listeners: {
			click: 'editRules'
		}
	},{
		xtype: 'maestro.button.button',
		text: Weg.locale.compliance_export_button,
		cls: 'buttonMarginExport',
        width: 100,
		handler: 'xlsxExporter'
	},{
        xtype: 'splitter',
        width: 9,
        height: '100%',
        disabled: true,
        style: 'background-color: rgb(245, 245, 245);' +
        'border-left: 1px solid rgb(194, 194, 194);' +
        'border-right: 1px solid rgb(194, 194, 194);'
    },{
        layout: 'vbox',
        items: [{
            layout: 'hbox',
            items: [{
                xtype: 'displayfield',
                fieldLabel: 'ID',
                labelWidth: 20,
                itemId: 'displayId',
                cls: 'displayFieldMargin'
            },{
                xtype: 'displayfield',
                fieldLabel: Weg.locale.compliance_sequence,
                labelWidth: 65,
                itemId: 'displaySequence',
                cls: 'displayFieldMargin'
            },{
                xtype: 'displayfield',
                fieldLabel: Weg.locale.compliance_certificate,
                labelWidth: 65,
                itemId: 'displayCertificate',
                cls: 'displayFieldMargin'
            },{
                xtype: 'displayfield',
                fieldLabel: 'Header ID',
                itemId: 'displayHeader',
                cls: 'displayFieldMargin',
                hidden: true
            }],
        },{
            xtype: 'displayfield',
            fieldLabel: Weg.locale.compliance_description,
            labelWidth: 80,
            itemId: 'displayDescription',
            cls: 'displayFieldMargin'
        }]
    }]
});