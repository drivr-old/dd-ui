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
        it('should create pages selector', function () {
            var table = `<table dd-table>
                            <thead>
                                <tr>
                                    <th>
                                        <dd-pages-selector></<dd-pages-selector>
                                    </th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                         </table>`;

            var element = $compile(angular.element(table))($scope);
            $scope.$digest();

            expect(element.find('ul').hasClass('dropdown-menu')).toBe(true);
        });

        it('should create pages selector item', function () {
            var table = `<table dd-table>
                            <thead>
                                <tr>
                                    <th>
                                        <dd-pages-selector>
                                            <dd-pages-selector-item>Select all</dd-pages-selector-item>
                                        </<dd-pages-selector>
                                    </th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                         </table>`;

            var element = $compile(angular.element(table))($scope);
            $scope.$digest();

            expect(element.find('li').length).toBe(1);
        });
    });
});