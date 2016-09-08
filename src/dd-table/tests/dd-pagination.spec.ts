describe('dd-pagination tests.', function () {
    var $scope,
        $sniffer,
        $document,
        $timeout,
        $compile;

    beforeEach(function () {
        angular.mock.module('dd.ui.dd-table');

        inject(function ($rootScope, _$compile_, _$timeout_, _$sniffer_, _$document_) {
            $scope = $rootScope.$new();
            $sniffer = _$sniffer_;
            $timeout = _$timeout_;
            $document = _$document_;
            $compile = _$compile_;
        });
    });

    describe('Init', function () {
        it('should add dd-pagination class for uib-pagination', function () {
            var pagination = `<dd-pagination on-change="pageChanged()" total-items="dataList.count" current-page="dataList.page"></dd-pagination>`;

            var element = $compile(angular.element(pagination))($scope);
            $scope.$digest();

            expect(element.find('ul').hasClass('dd-pagination')).toBe(true);
        });

        it('should on-change event after page changes', function () {
            var pageChanged = jasmine.createSpy('pageChanged');
            pageChanged.and.callFake(() => {});
            $scope.pageChanged = pageChanged;
            var pagination = `<dd-pagination on-change="pageChanged()" total-items="count" current-page="page"></dd-pagination>`;

            $compile(angular.element(pagination))($scope);
            $scope.$digest();
            $scope.page = 2;
            $scope.$digest();
            
            expect(pageChanged).toHaveBeenCalled();
        });
    });
});