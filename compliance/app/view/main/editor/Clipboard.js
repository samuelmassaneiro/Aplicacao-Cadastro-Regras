//@charset UTF-8
/*global Weg */
Ext.define('compliance.view.main.editor.Clipboard', {
    override: 'Ext.grid.plugin.Clipboard',
    
    // The default putCellData doesn't pay attention to the selection, or the editor. This is a fix
    putCellData: function(data, format) {
      
      var view = this.getCmp().getView();
      if(view.up()){
        view.up().fireEvent("putcelldatabegin");
      }
      
      // OVERRIDE Lines 141 to 157 in the ExtJS 6.2.0 source. This fixes a bug where the paste event starts where the
      // navigation position is, which may well be at the bottom of the selection.
      var destination = this.determineDestination(view);
      var modifiedColumns = [];
      
      var destinationStartColumn = destination.colIdx;
  
      // Decode the values into an m x n array (m rows, n columns)
      var values = Ext.util.TSV.decode(data);
      var recCount = values.length;
      for (var i = 1; i < recCount; i++){
        var rec = view.getStore().add({});
        var x = Ext.create('Ext.grid.CellContext');
        x.view = view
        x.record = rec;
        x.setPosition(view.getStore().count() - 1, 0);
      }
      var colCount = recCount ? values[0].length : 0;
      var maxRowIdx = view.dataSource.getCount() - 1;
      var maxColIdx = view.getVisibleColumnManager().getColumns().length - 1;
  
      for (var sourceRowIdx = 0; sourceRowIdx < recCount; sourceRowIdx++) {
        var row = values[sourceRowIdx];
        var dataObject = {}
        // Collect new values in dataObject
        for (var sourceColIdx = 0; sourceColIdx < colCount; sourceColIdx++) {
   
          // OVERRIDE lines 162 through to 181 of the ExtJS 6.2.0 version. This fixes bugs about not respecting the editor
          // when pasting values back in.
          if(this.transferValue(destination, dataObject, format, row, sourceColIdx)){
            if(!Ext.Array.contains(modifiedColumns, destination.column)){
              modifiedColumns.push(destination.column);
            }
          }
          // If we are at the end of the destination row, break the column loop.
          if (destination.colIdx === maxColIdx) {
           break;
          }
          destination.setColumn(destination.colIdx + 1);
        }
      
        // Update the record in one go.
        destination.record.set(dataObject);
      
        // If we are at the end of the destination store, break the row loop.
        if (destination.rowIdx === maxRowIdx) {
            break;
        }
      
        // Jump to next row in destination
        destination.setPosition(destination.rowIdx + 1, destinationStartColumn);
      }
      if(view.up()){
        view.up().fireEvent("putcelldataend", modifiedColumns);
        compliance.util.Config.getViewport().objectSync.executeServerRequest('applyRules');    
      }
    },
    
    privates: {
      determineDestination: function(view) {
        var selectionModel = this.getCmp().getSelectionModel();
        var selection = selectionModel.getSelected();
        var destination;
        if (selection) {
          destination = new Ext.grid.CellContext(view).setPosition(selection.getFirstRowIndex(), selection.getFirstColumnIndex());
        } else {
          var navModel = view.getNavigationModel();
          var currentPosition = navModel.getPosition();
          if (position) {
            // Create a new Context based upon the outermost View.
            // NavigationModel works on local views. TODO: remove this step when NavModel is fixed to use outermost view in locked grid.
            // At that point, we can use navModel.getPosition()
            destination = new Ext.grid.CellContext(view).setPosition(position.record, position.column); 
          } else {
            destination = new Ext.grid.CellContext(view).setPosition(0, 0);
          }
        }
        return destination;
      },
      
      transferValue: function(destination, dataObject, format, row, sourceColIdx) {
        if (format == 'html') { return false; }
        
        var column = destination.column;
        var editor = column.editor || column.getEditor();
        if (!editor) { return false; } // Thou shalt not edit a column that is not editable
        
        var dataIndex = column.dataIndex;
        if (!dataIndex) { return false; } // Thou shalt not edit a column that is not mapped.
  
        if (this.editIsVetoed(destination)) { return false; }
        var value = row[sourceColIdx];
        if (editor.rawToValue) { // If there is a convertor, apply it
          value = editor.rawToValue(value);
        }
        dataObject[dataIndex] = value ;
        return true;
      },
      
      editIsVetoed: function(destination) {
        var cmp = this.getCmp();
        var editorPlugin = Ext.Array.findBy(cmp.getPlugins(), function(plugin) { return plugin instanceof Ext.grid.plugin.Editing; });
        
        if (!editorPlugin) { return true; } // can't edit without an editor, right?
        
        var context = editorPlugin.getEditingContext(destination.record, destination.column);
        editorPlugin.fireEvent("beforeedit", editorPlugin, context);
        
        return context.cancel;
      }
    }
  })