interface TestRowItem extends ddui.ListRow {
    id?: string;
    name?: string;
}

fdescribe('Data list tests', function () {
    var listService: ddui.DataListService,
        $httpBackend,
        dataList: ddui.DataList<TestRowItem>,
        onsuccess,
        successCalled,
        onerror,
        initFunc,
        called,
        filter,
        listConfig: ddui.ListConfig;

    beforeEach(angular.mock.module('dd.ui.data-list'));

    beforeEach(inject(function (_dataListService_, _$httpBackend_) {
        listService = _dataListService_;
        $httpBackend = _$httpBackend_;

        successCalled = false;
        onsuccess = function () { successCalled = true; };
        onerror = function () { };

        listConfig = {
            url: '/api/test',
            responseListName: 'items',
            responseCountName: 'count',
        };
        dataList = listService.init<TestRowItem>('test', listConfig);
        dataList.onSuccess(onsuccess);
        dataList.onError(onerror);

        initFilter();
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('listServiceFactory should return same object for same id', function () {
        var obj = listService.get('test');
        expect(obj).toBe(dataList);
    });

    describe('initList method', function () {
        it('should init list if not initialized', function () {
            expect(dataList.onListResponseSuccess).toBe(onsuccess);
            expect(dataList.onListResponseError).toBe(onerror);
            expect(dataList.url).toBe('/api/test');
            expect(dataList.responseListName).toBe('items');
            expect(dataList.responseCountName).toBe('count');
        });
    });

    describe('initFilter method', function () {
        it('should set filter params and request data', function () {
            expect(called).toBe(true);
            expect(dataList.filter).toBe(filter);

            expect(dataList.list.length).toBe(2);
            expect(dataList.count).toBe(5);
        });
    });

    describe('loadMore method', function () {
        it('should add loaded items to current list', function () {

            dataList.list = [{ id: '1' }, { id: '2' }];
            $httpBackend.expectGET('/api/test?limit=25&skip=25').respond(200, {
                items: [
                    { id: '3' }, { id: '4' }
                ],
                count: 5
            });

            dataList.loadMore();
            $httpBackend.flush();

            expect(successCalled).toBe(true);
            expect(dataList.list.length).toBe(4);
            expect(dataList.list[0].id).toBe('1');
            expect(dataList.list[1].id).toBe('2');
            expect(dataList.list[2].id).toBe('3');
            expect(dataList.list[3].id).toBe('4');
            expect(dataList.count).toBe(5);
        });
    });

    describe('hasMore method', function () {
        it('should return false when items count equal to total count', function () {
            dataList.count = 2;
            dataList.list = [{}, {}];
            expect(dataList.hasMore()).toBe(false);
        });
        it('should return true when items count is less than total count', function () {
            dataList.count = 3;
            dataList.list = [{}, {}];
            expect(dataList.hasMore()).toBe(true);
        });
    });

    describe('selectAll method', function () {
        afterEach(function () {
            dataList.selectAll();

            expect(dataList.list[0].$selected).toBe(true);
            expect(dataList.list[1].$selected).toBe(true);
        });

        it('should add $selected=true property to all objects', function () {
            dataList.list = [{}, {}];
        });

        it('should set $selected=true property to all objects', function () {
            dataList.list = [{ $selected: false }, { $selected: true }];
        });

        it('should set selectedAllPages to false', function () {
            dataList.selectedAllPages = true;
            dataList.selectAll();
            expect(dataList.selectedAllPages).toBe(false);
        });
    });

    describe('deselectAll method', function () {
        afterEach(function () {
            dataList.deselectAll();

            expect(dataList.list[0].$selected).toBe(false);
            expect(dataList.list[1].$selected).toBe(false);
            expect(dataList.selectedAllPages).toBe(false);
        });

        it('should add $selected=false property to all objects', function () {
            dataList.selectedAllPages = true;
            dataList.list = [{}, {}];
        });

        it('should set $selected=false property to all objects', function () {
            dataList.list = [{ $selected: false }, { $selected: true }];
        });
    });

    describe('selectAllPages method', function () {
        afterEach(function () {
            dataList.selectAllPages();

            expect(dataList.list[0].$selected).toBe(true);
            expect(dataList.list[1].$selected).toBe(true);
            expect(dataList.selectedAllPages).toBe(true);
        });

        it('should add $selected=true property to all objects and selectedAllPages to true', function () {
            dataList.list = [{}, {}];
        });
    });

    describe('toggle method', function () {
        it('should add $selected=true property to object', function () {
            dataList.list = [{}, {}];

            dataList.toggle(dataList.list[1]);
            expect(dataList.list[1].$selected).toBe(true);

            dataList.toggle(dataList.list[1]);
            expect(dataList.list[1].$selected).toBe(false);
        });

        it('should set selectedAllPages to false', function () {
            dataList.selectedAllPages = true;
            dataList.list = [{}, {}];

            dataList.toggle(dataList.list[1]);

            expect(dataList.selectedAllPages).toBe(false);
        });
    });

    function initFilter() {
        called = false;
        filter = {};
        initFunc = function () {
            called = true;
            return filter;
        };

        $httpBackend.expectGET('/api/test?limit=25&skip=0').respond(200, {
            items: [
                {}, {}
            ],
            count: 5
        });

        dataList.initFilter(initFunc);

        $httpBackend.flush();
    }
});