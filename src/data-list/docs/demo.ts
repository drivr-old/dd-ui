interface DemoDataRow {
    id: string;
    name: string;
}

class DataListDemoCtrl {
    static $inject = ['$httpBackend', 'dataListManager'];
    constructor(private $httpBackend, private dataListManager: ddui.DataListManager) {
        this.createFakeApiResponse();
        this.initList();
    }

    dataList: ddui.DataList<DemoDataRow>;

    private initList() {
        var config: ddui.ListConfig = {
            url: '/api/test/'
        };

        this.dataList = this.dataListManager.init<DemoDataRow>(config);
        this.dataList.fetchPage();
    }

    private createFakeApiResponse() {
        this.$httpBackend.whenGET(function (url) { return url.startsWith('/api/test/'); }).respond(function (method, url) {
            var result = {
                items: [
                    { id: '1', name: 'Microsoft' },
                    { id: '2', name: 'Google' }
                ]
            };

            return [200, result];
        });
    }
}
angular.module('dd.ui.demo')
    .controller('DataListDemoCtrl', DataListDemoCtrl);