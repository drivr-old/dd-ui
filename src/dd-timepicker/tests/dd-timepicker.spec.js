describe('ddTimepicker', function () {
    var $scope,
        $sniffer,
        $document,
        $timeout,
        element;

    beforeEach(function () {
        module('dd.ui.dd-timepicker');

        inject(function ($rootScope, $compile, _$timeout_, _$sniffer_, _$document_) {
            $scope = $rootScope.$new();
            $sniffer = _$sniffer_;
            $timeout = _$timeout_;
            $document = _$document_;

            element = $compile(angular.element('<input id="time1" class="form-control" dd-timepicker type="text" ng-model="time" />'))($scope);
            $scope.$digest();

        });
    });

    describe('Change model value', function () {

        it('apply parsed user input for model', function () {

            changeInputValue(element, '8a');

            element.trigger('blur');
            $timeout.flush();

            expect($scope.time).toEqual('08:00');
        });

        it('clear model if invalid time', function () {

            changeInputValue(element, 'kepalas');

            element.trigger('blur');
            $timeout.flush();

            expect($scope.time).toBeNull();
        });

        it('do not change model if not blured', function () {
            
            $scope.time = '10:15';
            
            changeInputValue(element, '8p');

            expect($scope.time).toBe($scope.time);
        });

    });


    function changeInputValue(el, value) {
        el.val(value);
        el.trigger($sniffer.hasEvent('input') ? 'input' : 'change');
        $scope.$digest();
    }
});