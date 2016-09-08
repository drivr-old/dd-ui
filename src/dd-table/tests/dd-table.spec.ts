describe('dd-table tests.', function () {
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
        it('should add table and dd-table class on table', function () {
            var table = `<table dd-table>
                            <thead></thead>
                            <tbody></tbody>
                         </table>`;

            var element = $compile(angular.element(table))($scope);
            $scope.$digest();
            
            expect(element.hasClass('table')).toBe(true);
        });
    });
});