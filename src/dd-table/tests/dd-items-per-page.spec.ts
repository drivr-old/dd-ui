describe('dd-items-per-page tests.', function () {
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
        it('should add dropdown with pages select class', function () {
            var pagination = `<dd-items-per-page on-change="fetchPage()" limit="limit"></dd-items-per-page>`;

            var element = $compile(angular.element(pagination))($scope);
            $scope.$digest();

            expect(element.find('ul').hasClass('dropdown-menu')).toBe(true);
        });

        it('should call on-change event after page changes', function () {
            var pageChanged = jasmine.createSpy('pageChanged');
            pageChanged.and.callFake(() => {});
            $scope.pageChanged = pageChanged;
            var pagination = `<dd-items-per-page on-change="pageChanged()" limit="limit"></dd-items-per-page>`;

            var element = $compile(angular.element(pagination))($scope);
            $scope.$digest();
            element.find('.btn').click();
            element.find('a:first').click();
            $scope.$digest();
            
            expect(pageChanged).toHaveBeenCalled();
            expect($scope.limit).toBe(25);
        });
    });
});