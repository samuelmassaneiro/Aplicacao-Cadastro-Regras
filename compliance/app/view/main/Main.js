/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('compliance.view.main.Main', {
    extend: 'Maestro.panel.Panel',

    alias: 'widget.mainpanel',
    itemId: 'mainpanel',
    controller: 'main',
    autoHeight: true,

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'compliance.view.main.MainController',
        'compliance.view.main.editor.Clipboard',
        'compliance.util.Config'
    ],

    listeners: {
        afterrender: 'renderRulesTab'
    },
        
    items: [{
        cls: 'bottomContainerBorder',
        items: [{
            layout: 'hbox',
            defaultType: 'checkboxfield',
            xtype:'maestro.form.fieldcontainer',
            items: [{
                name: 'COMPLIANCE_RULE_BASE_TO_CERTIFICATE',
                boxLabel: Weg.locale.compliance_base_rule_certificate,
                node: 'RULE_HEADER',
                cls: 'baseRuleCheckbox',
                inputValue: '1',
                itemId: 'certificatebaserule',
                listeners: {
                    change: 'baseRule'
                }
            },{
                fieldLabel: '',
                xtype: 'maestro.form.combobox',
                node: 'RULE_HEADER',
                name: 'COMPLIANCE_RULE_BASE_TO_CERTIFICATE',
                itemId: 'baserulecombo',
                hidden: true,
                editable: true,
                typeAhead: true,
                typeAheadDelay: 100,
                minChars: 2,
                width: 100,
                maxWidth: 150,
                flex: 1,
                cls: 'rulesComboBox',
                 listeners: {
                    expand: 'selectBaseRuleTow'
                }
            }],
        },{
            xtype: 'maestro.button.button',
            text: Weg.locale.compliance_base_button,
            listeners: {
                click: 'onSaveBase'
            },
            cls: 'buttonMargin',           
        },{
            xtype: 'maestro.button.button',
            text: Weg.locale.compliance_save_button,
            cls: 'buttonMarginSave',
            handler: 'onSaveRule'
        },{
            xtype: 'maestro.button.button',
            text: Weg.locale.compliance_new_rule_button,
            handler : 'onNewRule',
            cls: 'buttonMarginNew',
        },{
            xtype: 'maestro.button.button',
            text: Weg.locale.compliance_copy_button,
            handler: 'onCopyRules',
            cls: 'buttonMargin',
            hidden: false,
        },{
            xtype: 'maestro.button.button',
            text: "Copiar Grupo de Regras",
            handler: function(){
                var panel = Ext.create({
                    xtype: 'main.rulewindow'
                });
                panel.show(); 
                //Ext.first('#mainpanelPanel').getController().windowTemplate();
            }, 
            cls: 'buttonMargin',
            hidden: false,
        },{
            xtype: 'maestro.button.button',
            text: Weg.locale.compliance_delete_button,
            handler: 'onBlockRule',
            cls: 'buttonMargin',
            hidden: false,
        },{
            xtype: 'maestro.button.button',
            text: 'Botão Teste',
            handler: 'onSaveContext',
            cls: 'buttonMargin',
            hidden: true,
        }],
    },{
        items: [{
            cls: 'bottomContainerBorder',
            layout: {
                type: 'vbox',
            },
            items: [{
                xtype: 'container',
                layout: {
                    type: 'hbox',
                },
                defaults:{
                    node: 'RULE_HEADER->action',
                },
                flex: 1,
                items:[{
                    vertical: true,
                    items: [{
                        name: 'COMPLIANCE_CERTIFICADO',
                        xtype: 'maestro.form.combobox',
                        itemId: 'certificateCombo',
                        node: 'RULE_HEADER->action',
                        cls: 'comboCertificate',
                        allowNullValue: true,
                        labelWidth: 90,
                        editable: true,
                        typeAhead: true,
                        typeAheadDelay: 10,
                        width: 300,
                        flex: 1
                    },{
                        name: 'COMPLIANCE_INFO_ADICIONAL',
                        xtype: 'maestro.form.textfield',
                        emptyText: Weg.locale.compliance_certificate_extra,
                        tooltipText: 'Ex: CSA SEGURA = CSA SEG',
                        itemId: 'infoCombo',
                        node: 'RULE_HEADER->dependency',
                        cls: 'comboAddInfo',
                        /*listeners: {
                            render: 'setFormFieldTooltip'
                        }, */
                        labelWidth: 90,
                        editable: true,
                        typeAhead: true,
                        typeAheadDelay: 10,
                        flex: 1,
                        width: 300,
                        hidden: true,
                    }]
                },{
                    xtype: 'maestro.form.textfield',
                    hidden: true,
                    id: 'charid',
                    cls: 'charId'
                },{
                    xtype: 'maestro.form.textarea',
                    name: 'COMPLIANCE_RULE_DESCRIPTION',
                    node: 'RULE_HEADER',
                    itemId: 'textDescription',
                    labelWidth: 70,
                    width: 300,
                    //multiline: true,
                    cls: 'description' 
                },{
                    vertical: true,
                    items: [{
                        name: 'CHARACTERISTIC_LOG',
                        xtype: 'maestro.form.tag',
                        itemId: 'characteristiclog',
                        emptyText: Weg.locale.compliance_empty_characteristic,
                        node: 'RULE_HEADER',
                        cls: 'comboCertificate',
                        listeners: {
                            change: 'baseRule'
                        },
                        labelWidth: 85,
                        editable: true,
                        width: 600,
                        growMax: 20,
                        flex: 1
                    },{
                        name: 'COMPLIANCE_RULE_ID',
                        xtype: 'maestro.form.textfield',
                        node: 'RULE_HEADER',
                        itemId: 'ruleid',
                        disabled: true,
                        editable: false,
                        width: 150,
                        labelWidth: 65,
                        disabledCls: 'idRule',
                    }]
                }
            ],
            },{
                items: [{
                    xtype: 'container',
                    layout: {
                        type: 'hbox'
                    },
                    flex: 1,
                    items: [{
                        name: 'COMPLIANCE_LOG_TYPE',
                        xtype: 'maestro.form.combobox',
                        itemId: 'logtype',
                        node: 'RULE_HEADER',
                        listeners: {
                            change: 'onShowLogs',
                        } ,
                        cls: 'comboCertificate',             
                        labelWidth: 90,
                        width: 200
                    },{
                        name: 'COMPLIANCE_LOG_PT',
                        xtype: 'maestro.form.textarea',
                        node: 'RULE_HEADER->action',
                        itemId: 'logpt',
                        cls: 'comboFor',
                        labelWidth: 90,
                        width: 450,
                        hidden: true,
                    },{
                        name: 'COMPLIANCE_LOG_EN',
                        xtype: 'maestro.form.textarea',
                        node: 'RULE_HEADER->action',
                        itemId: 'logen',
                        cls: 'comboFor',
                        labelWidth: 90,
                        width: 450,
                        hidden: true,
                    },{
                        name: 'COMPLIANCE_LOG_ES',
                        xtype: 'maestro.form.textarea',
                        node: 'RULE_HEADER->action',
                        itemId: 'loges',
                        cls: 'comboFor',
                        labelWidth: 90,
                        width: 450,
                        hidden: true,
                    }]
                }]
            },{
                xtype: 'maestro.button.button',
                text: Weg.locale.compliance_load_sheet,
                itemId: 'loadExcelButton',
                listeners: {
                    'click': function(){
                        Ext.first('#mainpanelPanel').getController().loadExcelSheet();
                    },
                },
                cls: 'buttonMarginLoadSheet',
            }]
        }]
    },{
        xtype: 'maestro.multivaluedcharacgrid.panel',
        title: Weg.locale.compliance_dependencies_grid,
        itemId: 'maestrogrid',
        plugins: [{
            ptype: 'cellediting',
            clicksToEdit: 2,
            id: 'cellediting'
        },{
            ptype: 'clipboard',
            format: 'raw',
            id: 'clipboard'
        },{
            ptype: 'rowediting'
        }], 
        flex: 1,
        disableToolsOnColumnsReadOnly: false,   
        scrollable: true,
        node: 'RULE_HEADER->dependency',
        listeners: {
            'edit': function(e, context){
                if(context.colIdx == 1 && context.value == 7){
                    //console.log(context);
                    context.record.data.VALUE_INITIAL_DEP = " ";
                    //console.log(context);
                }
                if(context.colIdx == 1 && context.record.data.OPERATOR_DEP == 8){
                    globalThis.operator = context.record.data.OPERATOR_DEP;
                    globalThis.row = context.rowIdx;
                } else {
                    globalThis.operator = context.record.data.OPERATOR_DEP;
                }
                compliance.util.Config.getViewport().objectSync.executeServerRequest('applyRules');
            },
            'beforeedit': function(e, context){
                if(context.colIdx == 3 && globalThis.operator != 8 && context.rowIdx != globalThis.row) {
                    return false;
                }
                if(context.colIdx == 2 && globalThis.operator == 7 && context.rowIdx != globalThis.row) {
                    return false;
                }
            },
            cellclick: function(e, a, context, record){
                    if (context == 0) {
					    globalThis.charId = compliance.util.Config.getCharacteristicDep();
                        globalThis.value = '#characteristicdep'
                    }
                    if (context == 1) {
					    globalThis.charId = compliance.util.Config.getOperatorDep();
                        globalThis.value = '#operatordep'
                    }
                    if (context == 2) {
                        globalThis.charId = record.data.CHARACTERISTIC_DEP;
                        globalThis.value = '#valueinitial'
                    } 
                    if (context == 3) {
                        globalThis.charId = record.data.CHARACTERISTIC_DEP;
                        globalThis.value = '#valuefinal'
                    }
                    setTimeout(function(){
                        compliance.util.Config.getViewport().objectSync.executeServerRequest('getCharacteristicValues', [globalThis.charId]);
                    }, 100)
            },
            afterrender: function(){
                var height = 0;
                if (Ext.first("#certificatebaserule").checked == true){
                    height = 430;
                    applyHeight = 328;
                } else {
                    if (Ext.first('#logtype').getValue() == "0001"){
                        height = 360;
                        applyHeight = 400;
                    } else {
                        height = 360;
                        applyHeight = 367;
                    }
                }
                let logpt = Ext.first('#logpt')
                let logen = Ext.first('#logen')
                let loges = Ext.first('#loges')
                logpt.setWidth(Ext.getBody().getViewSize().width*0.2083);
                logen.setWidth(Ext.getBody().getViewSize().width*0.2083);
                loges.setWidth(Ext.getBody().getViewSize().width*0.2083);
                this.setWidth(Ext.getBody().getViewSize().width);
                if(Ext.getBody().getViewSize().height - height > 0){
                    this.setHeight(Ext.getBody().getViewSize().height - applyHeight);
                }
                globalThis.sizeDeleted = 0;
            }
        },
        border: 1,
        margin: 0,
        padding: '0 0 10 0',        
        tools: [
            {iconCls: 'fa fa-plus', tooltip: Weg.locale.compliance_add, handler: 'onAdd'},
            {iconCls: 'fa fa-minus', tooltip: Weg.locale.compliance_remove,  
            handler: function(){
                grid = Ext.first('#maestrogrid');
                var me = grid.getController();
                store = grid.getStore();
                var i = grid.getSelectionModel().getSelected().startCell.rowIdx;
                var j = grid.getSelectionModel().getSelected().endCell.rowIdx;
                var selection = me.getSelectionRange();
                if(selection != null && !grid.isBeingEdited){
                    grid.startMultipleColumnAction();
                    store.setData(me.getClearRecords(me.getSelectedRecords(me.getSelectionRange()).map(c => c.getData())));
                    grid.finishMultipleColumnAction();
                    for (var k = 0; k <= Math.abs(i-j); k++) {
                        globalThis.sizeDeleted = globalThis.sizeDeleted + 1;
                    }
                }
            }}, 
            {iconCls: 'fa fa-chevron-up', handler: 'onUp'},
            {iconCls: 'fa fa-chevron-down', handler: 'onDown'}
        ],
        columnConfigs: [{
            name: 'CHARACTERISTIC_DEP',          
            flex: 1,
            border: 1,
            itemId: 'characteristicdep',
            node: 'RULE_HEADER->dependency',
            editor: {
                xtype: 'compliance.view.main.editor.combobox',
                typeAhead: true,  
                typeAheadDelay: 1,
                minChars: 2,
            },
        },{
            name: 'OPERATOR_DEP',            
            flex: 1,
            border: 1,
            node: 'RULE_HEADER->dependency',
            itemId: 'operatordep',
            editor: {
                xtype: 'compliance.view.main.editor.combobox',
                //valueField: 'valueDescription',
                typeAhead: true,  
                typeAheadDelay: 1,
                minChars: 2,   
            },
        }
         ,{
            name: 'VALUE_INITIAL_DEP', 
            store: 'values',           
            flex: 1,
            border: 1,            
            node: 'RULE_HEADER->dependency',
            queryMode: 'local',
            itemId: 'valueinitial',
            editor: {
                xtype: 'compliance.view.main.editor.combobox',
                typeAhead: true,  
                minChars: 2, 
                valueField: 'valueDescription',
            },
        },{
            name: 'VALUE_FINAL_DEP',
            flex: 1,
            border: 1,            
            node: 'RULE_HEADER->dependency',
            itemId: 'valuefinal',
            editor: {
                xtype: 'compliance.view.main.editor.combobox',
                typeAhead: true,  
                typeAheadDelay: 0.01,
                minChars: 2, 
                valueField: 'valueDescription'
            },
        }  
    ]
    }]
});
