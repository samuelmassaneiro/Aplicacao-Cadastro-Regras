/**
 * Painel principal do filtro.
    ___________________________________________________________
 * |                                                           |
 * |                 maestro.filterresult.header               |
 * |___________________________________________________________|
 * |                           |                               |
 * | maestro.filterresult.grid |  maestro.filterresult.result  |
 * |___________________________|_______________________________|
 */
Ext.define('compliance.view.filterresult.PanelTeste', {
    extend: 'Ext.Panel',

	requires: [
		'Maestro.filter.model.*',
		'Maestro.filter.form.*'
	],

	controller: 'compliance.view.filterresult.controller',
	alias: 'widget.compliance.view.filterresult.panelteste',
	layout: 'vbox',
	width: '100%',
	height: '100%',
	objectTypeId: null,
	showCopyButton: false,
	itemId: 'rulesPanelTeste',
	
	listeners: {
		afterrender: 'configure',
	},

	items: [{
			xtype: 'filterresult.header'
		},{  
			xtype: 'compliance.view.filter.filters',
			itemid: 'compliancefilter',
			reference: 'filters',
			width: 1,
			height: 1,
			hidden: true,
		},{
			xtype: 'compliance.view.filter.criteria',
			itemid: 'compliancecriteria',
			reference: 'criteria',
			width: 1400,
			height: 600,
			flex: 1,
			hidden: true,        
		},{
			layout: 'hbox',
			items: [{
				xtype: 'compliance.view.filterresult.grid',
				flex: 1,
				style: 'background-color: rgb(245, 245, 245);' +
				'border-left: 1px solid rgb(194, 194, 194);' +
				'border-right: 1px solid rgb(194, 194, 194);'
			},{
				xtype: 'splitter',
				height: '100%',
				width: 8,
				disabled: true,
 				style: 'background-color: rgb(245, 245, 245);' +
				//'border-left: 1px solid rgb(194, 194, 194);' +
				'border-right: 1px solid rgb(194, 194, 194);' +
				'border-bottom: 1px solid rgb(194, 194, 194);'
			},{
				xtype: 'compliance.view.filter.result',
				reference: 'result',
				listeners: {
					afterrender: function(){
						var me = this;
						if(Ext.getBody().getViewSize().width - Ext.first('#rulesResultGrid').getWidth() > 0){
							me.setWidth(Ext.getBody().getViewSize().width - Ext.first('#rulesResultGrid').getWidth() - 5);
							me.getColumns().forEach(function(col, index){
								col.setWidth(me.getWidth()/4);
							});
						}
						if(Ext.getBody().getViewSize().height - 200 > 0){
							me.setHeight(Ext.getBody().getViewSize().height - 200);
						}
					}
				},
				style: 'border-right: 1px solid rgb(194, 194, 194);' +
				'border-bottom: 1px solid rgb(194, 194, 194);'
			} 
		]
		}]

});