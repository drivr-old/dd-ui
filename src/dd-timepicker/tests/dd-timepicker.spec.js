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

        describe('Arrow up', function () {
            it('increase time by one minute', function () {
                $scope.time = '10:15';
                element = buildDirective($scope);

                triggerKeypress(element, 38);

                expect(element.val()).toBe('10:16');
                expect($scope.time).toBe('10:16');
            });
        });

        describe('Arrow down', function () {
            it('decrease time by one minute', function () {
                $scope.time = '10:15';
                element = buildDirective($scope);

                triggerKeypress(element, 40);

                expect(element.val()).toBe('10:14');
                expect($scope.time).toBe('10:14');
            });
        });

        describe('Enter', function () {
            it('creates time from current datetime if input is empty', function () {

                $scope.time = '';
                element = buildDirective($scope);

                triggerKeypress(element, 13);

                expect($scope.time).toBeDefined();
            });

            it('doesnt creates time if input not empty', function () {

                $scope.time = '10:10';
                element = buildDirective($scope);

                triggerKeypress(element, 13);

                expect($scope.time).toBe('10:10');
            });
        });
    });

    describe('on-change callback', function () {
        it('is called when model is changed', function () {

            $scope.onChange = jasmine.createSpy('onChange');
            element = buildDirective($scope);

            changeInputValue(element, '8p');
            $timeout.flush();
            changeInputValue(element, '8p');
            $timeout.flush();

            expect($scope.onChange).toHaveBeenCalledTimes(2);
        });

        it('is called onces if model is changed to same value', function () {

            $scope.onChange = jasmine.createSpy('onChange');
            element = buildDirective($scope);

            changeInputValue(element, '10:00');
            $timeout.flush();
            changeInputValue(element, '10:00');

            expect($scope.onChange).toHaveBeenCalledTimes(1);
        });

        it('is not called if model changed from code', function () {

            $scope.onChange = jasmine.createSpy('onChange');
            $scope.time = '10:15';
            element = buildDirective($scope);

            $scope.time = '10:10';
            $scope.$digest();

            expect($scope.onChange).not.toHaveBeenCalled();
        });

        it('is called on arrow up when blur event fired', function () {

            $scope.onChange = jasmine.createSpy('onChange');
            $scope.time = '10:15';
            element = buildDirective($scope);

            triggerKeypress(element, 38);
            element.trigger('blur');
            $timeout.flush();

            expect($scope.onChange).toHaveBeenCalled();
        });

        it('is not called on arrow up when no blur event fired', function () {

            $scope.onChange = jasmine.createSpy('onChange');
            $scope.time = '10:15';
            element = buildDirective($scope);

            triggerKeypress(element, 38);

            expect($scope.onChange).not.toHaveBeenCalled();
        });
    });

    function buildDirective(scope) {
        var element = $compile(angular.element('<input id="time1" on-change="onChange()" class="form-control" dd-timepicker type="text" ng-model="time" />'))($scope);
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