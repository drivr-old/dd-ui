interface TestRowItem extends ddui.ListRow {
    id?: string;
    name?: string;
}

describe('Data list tests', function () {
    var dataListManager: ddui.DataListManager,
        $httpBackend: ng.IHttpBackendService,
        $location,
        dataList: ddui.DataList<TestRowItem>,
        listConfig: ddui.ListConfig;

    beforeEach(() => {
        $location = jasmine.createSpyObj('$location', ['search']);

        angular.mock.module('dd.ui.data-list', ($provide) => {
            $provide.value('$location', $location);
        });

        inject((_dataListManager_, _$httpBackend_) => {
            dataListManager = _dataListManager_;
            $httpBackend = _$httpBackend_;

            listConfig = {
                url: '/api/test',
                responseListName: 'items',
                responseCountName: 'count',
            };
        });
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('Init list', () => {
        it('should init by default settings', () => {
            var obj = dataListManager.init<TestRowItem>(listConfig);
            expect(obj.id).toBe('DataList');
            expect(obj.url).toBe('/api/test');
        });

        it('should init by custom id', () => {
            listConfig.id = 'customId';
            var obj = dataListManager.init<TestRowItem>(listConfig);
            expect(obj.id).toBe('customId');
        });

        it('should throw error if config not specified', () => {
            var action = () => dataListManager.init<TestRowItem>(null);
            expect(action).toThrowError();
        });

        it('should throw error if config url is not specified', () => {
            listConfig.url = null;
            var action = () => dataListManager.init<TestRowItem>(listConfig);
            expect(action).toThrowError();
        });

        it('should throw error list is already created', () => {
            listConfig.id = 'customId';
            dataListManager.init<TestRowItem>(listConfig);
            var action = () => dataListManager.init<TestRowItem>(listConfig);
            expect(action).toThrowError();
        });
    });

    describe('Get list', () => {
        beforeEach(() => {
            dataList = dataListManager.init<TestRowItem>(listConfig);
        });

        it('should get list by default id', () => {
            var obj = dataListManager.get();
            expect(obj).toBe(dataList);
        });

        it('should throw error if list not defined', () => {
            var action = () => dataListManager.get('list2');
            expect(action).toThrowError();
        });
    });

    describe('Update list', () => {
        it('should load list data', function () {
            $httpBackend.expectGET('/api/test?limit=25&skip=0').respond(200, {
                items: [
                    { id: '1' }, { id: '2' }
                ],
                count: 5
            });
            dataList = dataListManager.init<TestRowItem>(listConfig);

            dataList.fetchPage();
            $httpBackend.flush();

            expect(dataList.rows.length).toBe(2);
            expect(dataList.rows[0].id).toBe('1');
            expect(dataList.rows[1].id).toBe('2');
        });

        it('should load next page', function () {
            $httpBackend.expectGET('/api/test?limit=25&skip=50').respond(200, {
                items: [
                    { id: '1' }, { id: '2' }
                ],
                count: 5
            });
            dataList = dataListManager.init<TestRowItem>(listConfig);

            dataList.fetchPage(3);
            $httpBackend.flush();

            expect(dataList.filter.skip).toBe(50);
            expect(dataList.filter.limit).toBe(25);
        });

        it('should call onsuccess callback if onSuccess is defined', function () {
            $httpBackend.expectGET('/api/test?limit=25&skip=0').respond(200, {
                items: [
                    { id: '1' }, { id: '2' }
                ],
                count: 5
            });
            dataList = dataListManager.init<TestRowItem>(listConfig);
            var onSuccess = jasmine.createSpy('onSuccess').and.callFake(() => { });

            dataList.fetchPage();
            dataList.onSuccess(onSuccess);
            $httpBackend.flush();

            expect(onSuccess).toHaveBeenCalledWith(dataList.rows, 5);
        });

        it('should call onError callback if onError is defined', function () {
            $httpBackend.expectGET('/api/test?limit=25&skip=0').respond(500, {});
            dataList = dataListManager.init<TestRowItem>(listConfig);
            var onError = jasmine.createSpy('onError').and.callFake(() => { });

            dataList.fetchPage();
            dataList.onError(onError);
            $httpBackend.flush();

            expect(onError).toHaveBeenCalled();
        });
    });

    describe('Sync all', () => {
        it('should reload all loaded data', () => {
            $httpBackend.expectGET('/api/test?limit=25&skip=0').respond(200, {
                items: [
                    { id: '1' }, { id: '2' }
                ],
                count: 5
            });
            dataList = dataListManager.init<TestRowItem>(listConfig);
            dataList.rows = [{}, {}, {}, {}, {}];

            dataList.syncAll();
            $httpBackend.flush();

            expect(dataList.filter.skip).toBe(0);
            expect(dataList.filter.limit).toBe(25);
        });
    });

    describe('Load more', function () {
        it('should add loaded items to current list', function () {
            dataList = dataListManager.init<TestRowItem>(listConfig);

            dataList.rows = [{ id: '1' }, { id: '2' }];
            $httpBackend.expectGET('/api/test?limit=25&skip=25').respond(200, {
                items: [
                    { id: '3' }, { id: '4' }
                ],
                count: 5
            });

            dataList.loadMore();
            $httpBackend.flush();

            expect(dataList.rows.length).toBe(4);
            expect(dataList.rows[0].id).toBe('1');
            expect(dataList.rows[1].id).toBe('2');
            expect(dataList.rows[2].id).toBe('3');
            expect(dataList.rows[3].id).toBe('4');
            expect(dataList.count).toBe(5);
        });
    });

    describe('Has more', function () {
        beforeEach(() => {
            dataList = dataListManager.init<TestRowItem>(listConfig);
        });

        it('should return false when items count equal to total count', function () {
            dataList.count = 2;
            dataList.rows = [{}, {}];
            expect(dataList.hasMore()).toBe(false);
        });
        it('should return true when items count is less than total count', function () {
            dataList.count = 3;
            dataList.rows = [{}, {}];
            expect(dataList.hasMore()).toBe(true);
        });
    });

    describe('Select all', function () {
        beforeEach(() => {
            dataList = dataListManager.init<TestRowItem>(listConfig);
        });

        afterEach(function () {
            dataList.selectAll();

            expect(dataList.rows[0].$selected).toBe(true);
            expect(dataList.rows[1].$selected).toBe(true);
        });

        it('should add $selected=true property to all objects', function () {
            dataList.rows = [{}, {}];
        });

        it('should set $selected=true property to all objects', function () {
            dataList.rows = [{ $selected: false }, { $selected: true }];
        });

        it('should set selectedAllPages to false', function () {
            dataList.rows = [{}, {}];
            dataList.selectedAllPages = true;

            dataList.selectAll();

            expect(dataList.selectedAllPages).toBe(false);
        });
    });

    describe('Deselect all', function () {
        beforeEach(() => {
            dataList = dataListManager.init<TestRowItem>(listConfig);
        });

        afterEach(function () {
            dataList.deselectAll();

            expect(dataList.rows[0].$selected).toBe(false);
            expect(dataList.rows[1].$selected).toBe(false);
            expect(dataList.selectedAllPages).toBe(false);
        });

        it('should add $selected=false property to all objects', function () {
            dataList.selectedAllPages = true;
            dataList.rows = [{}, {}];
        });

        it('should set $selected=false property to all objects', function () {
            dataList.rows = [{ $selected: false }, { $selected: true }];
        });
    });

    describe('Select all pages', function () {
        beforeEach(() => {
            dataList = dataListManager.init<TestRowItem>(listConfig);
        });

        afterEach(function () {
            dataList.selectAllPages();

            expect(dataList.rows[0].$selected).toBe(true);
            expect(dataList.rows[1].$selected).toBe(true);
            expect(dataList.selectedAllPages).toBe(true);
        });

        it('should add $selected=true property to all objects and selectedAllPages to true', function () {
            dataList.rows = [{}, {}];
        });
    });

    describe('Toggle selected', function () {
        beforeEach(() => {
            dataList = dataListManager.init<TestRowItem>(listConfig);
        });

        it('should add $selected=true property to object', function () {
            dataList.rows = [{}, {}];

            dataList.toggle(dataList.rows[1]);
            expect(dataList.rows[1].$selected).toBe(true);

            dataList.toggle(dataList.rows[1]);
            expect(dataList.rows[1].$selected).toBe(false);
        });

        it('should set selectedAllPages to false', function () {
            dataList.selectedAllPages = true;
            dataList.rows = [{}, {}];

            dataList.toggle(dataList.rows[1]);

            expect(dataList.selectedAllPages).toBe(false);
        });
    });

    describe('Set filter', () => {
        beforeEach(() => {
            dataList = dataListManager.init<TestRowItem>(listConfig);
            $location.search.and.callFake(() => {
                return {
                    name: 'Vasia'
                };
            });
        });

        it('should throw error if init filter func not return object', () => {
            var filter = () => { return 1; };

            var action = () => dataList.setFilter(filter);

            expect(action).toThrowError();
        });

        it('should extend default filter with custom filter', () => {
            var filter = () => {
                return { name: 'Vasia' };
            };

            dataList.setFilter(filter);

            expect(dataList.filter.name).toBe('Vasia');
            expect(dataList.filter.limit).toBe(25);
            expect(dataList.filter.skip).toBe(0);
        });

        it('should override limit and skip if provided', () => {
            var filter = () => {
                return { limit: 10, skip: 10 };
            };

            dataList.setFilter(filter);

            expect(dataList.filter.limit).toBe(10);
            expect(dataList.filter.skip).toBe(10);
        });
    });

    describe('Submit filter', () => {
        beforeEach(() => {
            dataList = dataListManager.init<TestRowItem>(listConfig);
            $location.search.and.callFake(() => {
                return {
                    data: '2016'
                };
            });
        });

        it('should submit filter and set location params', () => {
            $httpBackend.expectGET('/api/test?arr=1&arr=2&bool=true&date=2016-01-01T00:00:00.000Z&limit=25&name=Vasia&obj=%7B%22n%22:1%7D&skip=0').respond(200, { items: [] });
            spyOn(dataList, 'fetchPage').and.callThrough();

            dataList.setFilter(() => {
                return {
                    name: 'Vasia',
                    arr: [1, 2],
                    bool: true,
                    date: new Date('2016-01-01'),
                    obj: { n: 1 }
                };
            });
            dataList.submitFilter();
            $httpBackend.flush();
        });
    });

    describe('Reset filter', () => {
        beforeEach(() => {
            dataList = dataListManager.init<TestRowItem>(listConfig);
            $location.search.and.callFake(() => { return {}; });
        });

        it('should reset filter and update list', () => {
            $httpBackend.expectGET('/api/test?limit=25&skip=0').respond(200, { items: [] });
            spyOn(dataList, 'fetchPage').and.callThrough();

            dataList.filter.name = 'Vasia';
            dataList.resetFilter();
            $httpBackend.flush();
        });
    });
});