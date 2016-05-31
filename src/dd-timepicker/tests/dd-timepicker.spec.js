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
        });
    });

    describe('Change model value', function () {

        it('apply parsed user input for model', function () {
            element = buildDirective($scope);

            changeInputValue(element, '8a');

            expect($scope.time).toEqual('08:00');
        });

        it('clear model if invalid time', function () {
            element = buildDirective($scope);

            changeInputValue(element, 'kepalas');

            expect($scope.time).toBeNull();
        });

        it('do not change model if not blured', function () {

            $scope.time = '10:15';
            element = buildDirective($scope);

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

    describe('Keyboard', function () {
        it('arrow up increase time', function () {

            $scope.time = '10:15';
            element = buildDirective($scope);

            triggerKeypress(element, 38);

            expect($scope.time).toBe('10:16');
        });

        it('arrow down decreaes time', function () {

            $scope.time = '10:15';
            element = buildDirective($scope);

            triggerKeypress(element, 40);

            expect($scope.time).toBe('10:14');
        });

        it('on enter should create time from current datetime if input is empty', function () {

            $scope.time = '';
            element = buildDirective($scope);

            triggerKeypress(element, 13);

            expect($scope.time).toBeDefined();
        });

        it('on enter not create time if input not empty', function () {

            $scope.time = '10:10';
            element = buildDirective($scope);

            triggerKeypress(element, 13);

            expect($scope.time).toBe('10:10');
        });
    });

    function buildDirective(scope) {
        var element = $compile(angular.element('<input id="time1" class="form-control" dd-timepicker type="text" ng-model="time" />'))($scope);
        $scope.$digest();
        return element;
    }

    function changeInputValue(el, value) {
        el.val(value);
        el.trigger($sniffer.hasEvent('input') ? 'input' : 'change');
        $scope.$digest();
        element.trigger('blur');
    }

    function triggerKeypress(el, keycode) {
        var e = angular.element.Event("keypress");
        e.which = keycode;
        el.trigger(e);
    }
});