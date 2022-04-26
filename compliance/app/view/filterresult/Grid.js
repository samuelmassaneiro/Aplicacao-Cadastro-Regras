Ext.define('compliance.view.filterresult.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.compliance.view.filterresult.grid',
	itemId: 'rulesResultGrid',
	title: Weg.locale.compliance_ruleresult_grid,
	width: 400,
	height: '100%',
	btXlsExportIsHidden: true,
	flex: 1,
	//cls: 'rulesResultGrid',
	requires: [
		'compliance.plugin.ExportGridToCsv',
	],
	plugins: [{
		ptype: 'compliance.exportGridToCsv',
	}],

	listeners: {
		cellclick: 'onCellClick',
		afterrender: function(){
			var me = this;
			if(Ext.getBody().getViewSize().height - 202 > 0){
				me.setHeight(Ext.getBody().getViewSize().height - 202);
			}
		}
	}
})