Ext.define('compliance.plugin.ExportGridToCsv', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.compliance.exportGridToCsv',
    validate: false,

    download: function (c) {
        var grid = Ext.first('#dependenciesResultGrid')
        var fileTitle = 'Export';
        var headers = {};
        var headersOrder = [];
        for (var i = 0; i < grid.getColumns().length; i++) {
            tmpVal = grid.getColumns()[i].text
            headers[grid.getColumns()[i].dataIndex] = tmpVal;
            headersOrder.push(grid.getColumns()[i].dataIndex);
        }

        var itemsFormatted = []
        itemsStore = grid.store.data.items;

        for (var i = 0; i < itemsStore.length; i++) {
            data = itemsStore[i].data;
            var item = {};
            for(var k = 0; k < headersOrder.length; k++){
                tmpHeader = headersOrder[k];
                item[tmpHeader] = data[tmpHeader]
            }
            itemsFormatted.push(item);
        }

        this.exportCSVFile(headers, itemsFormatted, fileTitle);
    },



    exportCSVFile: function (headers, items, fileTitle) {
        if (headers) {
            items.unshift(headers);
        }

        // Convert Object to JSON
        var jsonObject = JSON.stringify(items);

        var csv = this.convertToCSV(jsonObject);

        var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, exportedFilenmae);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", exportedFilenmae);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    },

    convertToCSV: function (objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','

                line += array[i][index];
            }

            str += line + '\r\n';
        }

        return str;
    }

});


function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
};

