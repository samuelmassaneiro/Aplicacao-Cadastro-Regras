Ext.define('compliance.view.main.editor.ComboRender',{
    override: 'Maestro.multivaluedcharacgrid.Column',
    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
		var style = '',
			column = view.up('grid').getColumnByIndex(colIndex);
		if(column['isReadOnly']){
			style += ' background-color: #e4e4e4;';
		}else if(column['isBackgroundYellow']){
		//	style += ' background-color: #fffcd9;';
		}
		if(column['isBorderRed']){
			style += ' border-color: #cf4c35;';
		}else if(column['isBorderBlue']){
			style += ' border-color: #157fcc;';
		}
		if(column['isBorderRed'] || column['isBorderBlue']){
			style += ' border-style: solid; border-width: thin;';
		}
		style += 'border-color: rgba(215, 215, 215);';
		style += ' border-style: solid; border-width: thin;';
		metaData.style = style;
		column.updateEditorConfig();
		return value && !column.getDisplayValue()[rowIndex] ? value : column.getDisplayValue()[rowIndex];
	},
});