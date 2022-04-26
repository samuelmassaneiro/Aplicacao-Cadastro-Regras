//@charset UTF-8
Ext.define('compliance.state.requests.LoadExcelSheet', {

    extend: 'compliance.state.Requests',
    
    requires: [
        'Ext.grid.selection.SpreadsheetModel',
        'Ext.grid.plugin.Clipboard',
    ],

    singleton: true,

    setObjectContextSynchronizer: function () {
        this.callParent(arguments);
        this.requestObject = {
            method: 'POST',
            timeout: 60000000,
            url: '/maestro/resources/compliance/loadsheet/',
            isUpload: true,
            headers: { 'Content-Type': 'multipart/form-data' },
            success: this.successHandler.bind(this),
        };
    },

    convertToJson(response) {
        let json = [];
        response = response.replace(/[{}]/g, '');
        for(let line of response.split(',')) {
            let values = line.split('=');
            json.push({
                maestroId: values[0],
                modelNumber: values[1]
            });
        }
        return json;
    },

    successHandler(response) {
        let oc = this.getObjectContextSynchronizer(),
            base64 = response.responseText;
        
        oc.fireEvent('maestroDataDump');
        
        Ext.Loader.loadScriptsSync([
            Ext.getResourcePath('js/FileSaver.js', null, 'maestro')
        ]);
        
        //Maestro.Util.downloadBase64File(base64, this.getFileName(response));
        //oc.executeServerRequest('checkInMemory');
    },

    getFileName(response) {
        let filename = response.getResponseHeader('content-disposition').split(';')[1];

        return filename.replace('filename=', '');
    },

    execute: function (file, pathUrl) {
        var objectSync = this.getObjectContextSynchronizer();
        if (this.getObjectContextSynchronizer().fireEvent('beforeMaestroDataDump') !== false && !objectSync.isRemoteCalling) {
            let fileReader = new FileReader();
            fileReader.onloadend = (event) => {
                if (event.target.readyState == FileReader.DONE) {
                    this.requestObject.binaryData = event.target.result;
                    var param = {'url': pathUrl};
                    this.requestObject.params = param;
                    Ext.Ajax.request(this.requestObject);
                }
            }
            fileReader.readAsArrayBuffer(file);
        }
    }

});
