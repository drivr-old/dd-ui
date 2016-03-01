describe('ddTimepicker', function () {
    var $scope,
        $sniffer,
        $document,
        $timeout,
        $compile,
        element;

    beforeEach(function () {
        module('dd.ui.dd-timepicker');

        inject(function ($rootScope, _$compile_, _$timeout_, _$sniffer_, _$document_) {
            $scope = $rootScope.$new();
            $sniffer = _$sniffer_;
            $timeout = _$timeout_;
            $document = _$document_;
            $compile = _$compile_;

            element = $compile(angular.element('<input id="time1" class="form-control" dd-timepicker type="text" ng-model="time" />'))($scope);
            $scope.$digest();

        });
    });

    describe('Change model value', function () {

        it('apply parsed user input for model', function () {

            changeInputValue(element, '8a');

            expect($scope.time).toEqual('08:00');
        });

        it('clear model if invalid time', function () {

            changeInputValue(element, 'kepalas');
            
            expect($scope.time).toBeNull();
        });

        it('do not change model if not blured', function () {
            
            $scope.time = '10:15';
            
            changeInputValue(element, '8p');

            expect($scope.time).toBe($scope.time);
        });
        
        it('return model as Date if is-date-type="true"', function () {
            
            $scope.time = '10:15';
            element = $compile(angular.element('<input id="time1" is-date-type="true" class="form-control" dd-timepicker type="text" ng-model="time" />'))($scope);
            $scope.$digest();
            
            changeInputValue(element, '10:20');
            
            expect($scope.time instanceof Date).toBe(true);
            expect($scope.time.getHours()).toBe(10);
            expect($scope.time.getMinutes()).toBe(20);
        });

    });


    function changeInputValue(el, value) {
        el.val(value);
        el.trigger($sniffer.hasEvent('input') ? 'input' : 'change');
        $scope.$digest();
        element.trigger('blur');
    }
});