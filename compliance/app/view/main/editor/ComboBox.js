//@charset UTF-8
/*global Weg */
Ext.define('compliance.view.main.editor.ComboBox', {
    extend: 'Ext.form.ComboBox',

    alias: 'widget.compliance.view.main.editor.combobox',
    typeAhead: false,

    requires: [
        'Maestro.data.reader.ComboBox',
        'Maestro.state.model.PropertyValue'
    ],

    typeAhead: false,
    triggerAction: 'all',
    valueField: 'value',
    displayField: 'valueDescription',
    hideLabel: true,
    hideEmptyLabel: true,
    queryMode: 'local',
    anyMatch: true,
    queryCaching: false,
    remoteSort: false, //true for server sorting

    initComponent: function() {
        var me = this;
        Ext.apply(me, Ext.apply(me.initialConfig, {
            store: {
                model: 'Maestro.state.model.PropertyValue',
                sorters: [{
                    property: 'valueDescription',
                    direction: 'ASC'
                  }],
                proxy: {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Accept': 'application/json;charset=UTF-8'
                    },
                    url: `/maestro/resources/objectcontext/ruleactions/objecttypenode/${this.node}/characteristics/characteristicname/${this.name}/validvalues`,
                    type: 'ajax',
                    noCache: false,
                    filterParam: undefined,
                    groupParam: undefined,
                    pageParam: undefined,
                    startParam: undefined,
                    sortParam: undefined,
                    limitParam: undefined,
                    query: undefined,
                    reader: Ext.create('Maestro.data.reader.ComboBox', {
                        rootProperty: 'characteristicMap',
                        id: `${this.node}->${this.name}`,
                        allowNullValue: false
                    })
                }
            }
        }));
        me.callParent(arguments);
    },

    updateConfigs: function(node, name) {
        this.node = node;
        if (name) this.name = name;
        //this.initComponent();
    }

});
