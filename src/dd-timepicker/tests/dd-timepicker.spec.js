describe('ddTimepicker', function () {
    var $scope,
        $sniffer,
        $document,
        element;

    beforeEach(function () {
        module('dd.ui.dd-timepicker');

        inject(function ($rootScope, $compile, _$sniffer_, _$document_) {
            $scope = $rootScope.$new();
            $sniffer = _$sniffer_;
            $document = _$document_;

            element = $compile(angular.element('<input id="time1" class="form-control" dd-timepicker type="text" ng-model="time" />'))($scope);
            $scope.$digest();

        });
    });

    describe('Change model value', function () {

        it('apply parsed user input for model', function () {

            changeInputValue(element, '8a');

            var time = element.isolateScope().ngModel;

            expect(time).toEqual('08:00');
        });

        it('clear model if invalid time', function () {

            changeInputValue(element, 'kepalas');

            var time = element.isolateScope().ngModel;

            expect(time).toBeNull();
        });

    });


    function changeInputValue(el, value) {
        el.val(value);
        el.trigger($sniffer.hasEvent('input') ? 'input' : 'change');
        $scope.$digest();
    }
});