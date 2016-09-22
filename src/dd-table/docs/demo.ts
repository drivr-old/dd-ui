
class TableDemoCtrl {
    static $inject = ['$httpBackend', 'dataListManager'];
    constructor(private $httpBackend, private dataListManager: ddui.DataListManager) {
        this.createFakeApiResponse();
        this.initList();
    }

    dataList: ddui.DataList<DemoDataRow>;

    pageChanged() {
        console.log('Page changed');
    }

    private initList() {
        var config: ddui.ListConfig = {
            id: 'tableDemo',
            url: '/api/table/',
            paging: true
        };

        this.dataList = this.dataListManager.init<DemoDataRow>(config);
        var filter: ddui.FilterModel = {
                'name': { value: 'My name' }
            };
        this.dataList.setFilter(() => filter);
        this.dataList.fetchPage();
    }

    private createFakeApiResponse() {
        this.$httpBackend.whenGET(function (url) { return url.startsWith('/api/table/'); }).respond(function (method, url) {
            var result = {
                items: [
                    {
                        'index': 0,
                        'isActive': false,
                        'balance': '$2,962.75',
                        'picture': 'http://placehold.it/32x32',
                        'age': 36,
                        'eyeColor': 'brown',
                        'name': 'Virgie Patrick'
                    },
                    {
                        'index': 1,
                        'isActive': true,
                        'balance': '$1,662.43',
                        'picture': 'http://placehold.it/32x32',
                        'age': 32,
                        'eyeColor': 'green',
                        'name': 'Burton Warren'
                    },
                    {
                        'index': 2,
                        'isActive': false,
                        'balance': '$3,988.63',
                        'picture': 'http://placehold.it/32x32',
                        'age': 27,
                        'eyeColor': 'brown',
                        'name': 'Mercedes Horne'
                    },
                    {
                        'index': 3,
                        'isActive': false,
                        'balance': '$3,914.68',
                        'picture': 'http://placehold.it/32x32',
                        'age': 21,
                        'eyeColor': 'brown',
                        'name': 'Harper Reilly'
                    },
                    {
                        'index': 4,
                        'isActive': true,
                        'balance': '$1,237.50',
                        'picture': 'http://placehold.it/32x32',
                        'age': 35,
                        'eyeColor': 'brown',
                        'name': 'Pierce Callahan'
                    }
                ],
                count: 300
            };

            return [200, result];
        });
    }
}

angular.module('dd.ui.demo')
    .controller('TableDemoCtrl', TableDemoCtrl);