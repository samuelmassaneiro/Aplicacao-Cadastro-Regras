/**
 * Window para seleção dos valores de critérios.
 */
Ext.define('compliance.view.filter.ConditionWindow', {
    extend: 'Maestro.filter.form.ConditionWindow',

    alias: 'widget.compliance.view.filter.conditionwindow',
    itemId: 'windows',
    controller: 'compliance.view.filter.controller',

    currentRecord: undefined,

    width: 800,
    height: 500,
    minWidth: 600,
    minHeight: 300,
    layout: 'fit',

    requires: [
        'Ext.grid.filters.Filters',
        'Maestro.filter.plugin.ClipboardCriteriaValues'
    ],

    bbar: [
        '->',
        {
            xtype: 'button',
            text: Weg.locale.apply,
            iconCls: 'fa fa-check',
            itemId: 'applyCriteriaButton',
            /**
             * Quando as selecões do grid de critérias são salvas, os valores selecionados são sincronizados no
             * record em edição do grid, ou seja os valores que estão selecionados na window e não estão presentes no
             * record são adicionados ao record e os valores que estão no record e não estão selecionados na window
             * são removidos do record */
            listeners: {
                click: 'buttonApplyChanges'
            },
        }
    ],

    tbar: [
        {
            xtype: 'button',
            text: Weg.locale.add,
            iconCls: 'fa fa-plus',
            handler: function (scope) {
                let grid = scope.up('window').down('grid'),
                    idxInsert = 0;

                grid.getStore().insert(idxInsert, {});
                grid.getSelectionModel().doSelect(grid.getStore().getData().items[idxInsert], true);
                grid.getPlugins()[0].startEditByPosition({row: idxInsert, column: 1});
            }
        },{
            xtype: 'textfield',
            
            fieldLabel: Weg.locale.filter,
            labelWidth: 50,
            enableKeyEvents: true,
            listeners: {
                change: function(scope, val) {
                    let grid = scope.up().up().down('grid');
                    grid.getStore().clearFilter();
                    if (val) {
                        val = val.toUpperCase();
                        var values = val.split('|');
                        grid.getStore().filterBy(function(rec) {
                            var value = rec.get('value');
                            var valueDescription = rec.get('valueDescription');
                            if (value) {
                                value = value.toUpperCase();
                                if (valueDescription) valueDescription = valueDescription.toUpperCase();
                                for (var idx in values) {
                                    if (values[idx]) {
                                        if (value.indexOf(values[idx]) !== -1) return true;
                                        if (valueDescription.indexOf(values[idx]) !== -1) return true;
                                    }
                                }
                            }
                            return false;
                        });
                    }
                },
                render: function(scope) {
                    Ext.create('Ext.tip.ToolTip', {
                        target: scope.getEl(),
                        html: 'Filter by description or value.'
                    });
                }
            }
        }
    ],

    items: [
        {
            xtype: 'grid',
            layout: 'fit',
            store: {
                fields: ['value', 'valueDescription'],
                autoLoad: false,
                proxy: {
                    type: 'ajax',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Accept': 'application/json;charset=UTF-8'
                    },
                    url: '/maestro/api/objecttypes/validvalues',
                    reader: {
                        type: 'json',
                        rootProperty: 'list'
                    },
                    writer: {
                        type: 'json',
                        rootProperty: 'list'
                    }
                }
            },
            plugins: [
                {
                    ptype: 'cellediting',
                    clicksToEdit: 2
                },
                'gridfilters',
                'maestro.filter.plugin.clipboardcriteriavalues',
            ],
            columns: [
                {
                    header: '#',
                    dataIndex: 'id',
                    hidden: true,
                    flex: 1
                },
                {
                    header: 'Value',
                    dataIndex: 'value',
                    editor: 'textfield',
                    filter: {type: 'string'},
                    flex: 3
                },
                {
                    header: 'Description',
                    dataIndex: 'valueDescription',
                    editor: 'textfield',
                    filter: {type: 'string'},
                    flex: 3
                }
            ],
            selModel: {
                selType: 'checkboxmodel'
            },
            listeners: {
                beforeedit: function (editor, e) {
                    return !Ext.isNumeric(e.record.get('id'));
                }
            }
        }
    ],

    listeners: {
        /**
         * Carrega a window com os valores válidos da característica pelo tipo de objeto,
         * e marca os valores do critério*/
        show: function (scope) {
            let selectedValue = globalThis.param;
            let rec = scope.currentRecord;
            if (!rec.get('objectTypeId')) {
                scope.destroy();
                Ext.Msg.alert(Weg.locale.info, Weg.locale.object_type_must_be_informed);
            } else if (!rec.get('characteristicId')) {
                scope.destroy();
                Ext.Msg.alert(Weg.locale.info, Weg.locale.characteristic_must_be_informed);
            } else {
                scope.down('grid').getStore().load({
                    params: {
                        objectTypeId: rec.get('objectTypeId'),
                        characteristicId: rec.get('characteristicId')
                    },
                    callback: function () {
                        let gridStore = rec.conditions();
                        let gridWin = scope.down('grid');
                        let winStore = gridWin.getStore();
                        let toSelect = [];
                        if (gridStore.getData().items.length == 0) {
                            let index = winStore.findExact('value', selectedValue);
                            if (index >= 0) {
                                toSelect.push(winStore.getAt(index));
                            } else {
                                let model = winStore.insert(0, {value: selectedValue});
                                toSelect.push(model[0]);
                            }
                        }
                        gridStore.each(function (record) {
                            let index = winStore.findExact('value', selectedValue);
                            if (index >= 0) {
                                toSelect.push(winStore.getAt(index));
                            } else {
                                let model = winStore.insert(0, {value: selectedValue});
                                toSelect.push(model[0]);
                            }
                        });
                        gridWin.getSelectionModel().select(toSelect);
                        gridWin.getView().focusRow(0);
                    }
                });
            }
        }
    }

});
