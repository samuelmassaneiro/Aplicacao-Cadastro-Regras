  Ext.define('compliance.view.filter.Panel', {
    extend: 'Ext.Panel',

	requires: [
		'Maestro.filter.model.*',
		'Maestro.filter.form.*'
	],

	controller: 'compliance.view.filter.controller',
	alias: 'widget.compliance.view.filter.panel',
	layout: 'vbox',
	objectTypeId: null,
	showCopyButton: false,

	listeners: {
		//afterrender: 'configure',
	},

	items: [
		{
			header: false,
			width: '100%',
			flex: 1,
			layout: 'hbox',
			items: [{
					xtype: 'filterpanel',
					minHeight: 320,
					height: 3000
				},{
					xtype: 'splitter',
					width: 8,
					//height: 800,
					autoHeight: true,
					collapseTarget: 'prev',
					//hidden: true,
					style: 'background-color: rgb(245, 245, 245);' +
						'border-left: 1px solid rgb(194, 194, 194);' +
						'border-right: 1px solid rgb(194, 194, 194);'
				},{
					xtype: 'maestro.multivaluedcharacgrid.panel',
					title: Weg.locale.compliance_dependencies_grid,
					itemId: 'maestrogridtwo',
					flex: 1,
/* 					width: 1070,
					maxWidth: 2000, */
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
								//PROD
								//globalThis.charId = 90214;
								//QA
								globalThis.charId = 85428;
								globalThis.value = '#characteristicdepfilter'
							}
							if (context == 1) {
								//PROD
								//globalThis.charId = 90216;
								//QA
								globalThis.charId = 85426;
								globalThis.value = '#operatordepfilter'
							}
							if (context == 2) {
								globalThis.charId = record.data.CHARACTERISTIC_DEP;
								globalThis.value = '#initialdepfilter'
							} if (context == 3) {
								globalThis.charId = record.data.CHARACTERISTIC_DEP;
								globalThis.value = '#finaldepfilter'
							}
							setTimeout(function(){
								compliance.util.Config.getViewport().objectSync.executeServerRequest('getCharacteristicValues', [globalThis.charId]);
							}, 100)
						},
						afterrender: function(){
							this.setWidth(Ext.getBody().getViewSize().width);
							if(Ext.getBody().getViewSize().height - 90 > 0){
								this.setHeight(Ext.getBody().getViewSize().height - 90);
							}
						}
					},
					border: 1,
					margin: 0,
					padding: '0 0 10 0',      
					tools: [
						{iconCls: 'fa fa-plus', tooltip: Weg.locale.compliance_add, handler: 'onAdd'},
						{iconCls: 'fa fa-minus', tooltip: Weg.locale.compliance_remove,  
						handler: function(){
							grid = Ext.first('#maestrogridtwo');
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
						itemId: 'characteristicdepfilter',
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
						itemId: 'operatordepfilter',
						node: 'RULE_HEADER->dependency',
						editor: {
							xtype: 'compliance.view.main.editor.combobox',
							valueField: 'valueDescription',
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
						itemId: 'initialdepfilter',
						node: 'RULE_HEADER->dependency',
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
						itemId: 'finaldepfilter',
						node: 'RULE_HEADER->dependency',
						editor: {
							xtype: 'compliance.view.main.editor.combobox',
							typeAhead: true,  
							typeAheadDelay: 0.01,
							minChars: 2, 
							valueField: 'valueDescription'
						},
					}  
				]
				}
				/* ,{  
					xtype: 'compliance.view.filter.filters',
					reference: 'filters',
					itemId: 'filterFilters',
					//minWidth: 400,
					width: 450,
					height: 320,
					hidden: true,
					collapsible: true,
					collapseDirection: 'left',
				},{
					xtype: 'splitter',
					width: 8,
					collapseTarget: 'prev',
					//hidden: true,
					style: 'background-color: rgb(245, 245, 245);' +
						'border-left: 1px solid rgb(194, 194, 194);' +
						'border-right: 1px solid rgb(194, 194, 194);'
				},{
					xtype: 'compliance.view.filter.criteria',
					reference: 'criteria',
					width: '100%',
					height: 320,
					flex: 1,
					//hidden: true,
				} */
			]
		}
		/* ,{
			xtype: 'splitter',
			height: 8,
			collapsible: true,
			collapseTarget: 'prev',
		
		},{
			xtype: 'compliance.view.filter.result',
			reference: 'result',
			width: '100%',
			height: 555,
			flex: 1
		} */
	]

});
