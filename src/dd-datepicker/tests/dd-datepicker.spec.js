describe('datetimepicker', function () {
    var $scope,
        $sniffer,
        $document,
        $compile,
        $timeout,
        element,
        currentYear = new Date().getFullYear();

    beforeEach(function () {
        module('dd.ui.dd-datepicker');
        module('template/dd-datepicker/dd-datepicker.html');

        inject(function ($rootScope, _$compile_, _$sniffer_, _$document_, _$timeout_) {
            $scope = $rootScope.$new();
            $sniffer = _$sniffer_;
            $document = _$document_;
            $compile = _$compile_;
            $timeout = _$timeout_;

            $scope.dateFormat = 'yyyy-MM-dd';
            element = compileElement($scope);
        });
    });

    function compileElement($scope) {
        var element = $compile('<input dd-datepicker date-format="{{dateFormat}}" date-disabled="dateDisabled(date, mode)" ng-model="date" />')($scope);
        element.appendTo($document[0].body);
        $scope.$digest();
        return element;
    }

    describe('Init', function () {
        it('set default values', function () {
            $scope.date = new Date('2016-02-09');

            var element = compileElement($scope);
            var elementScope = element.isolateScope();
            $timeout.flush();

            expect(elementScope.displayModel).toBeDefined();
            expect(elementScope.bootstrapDateModel).toBeDefined();
        });
    });

    describe('Parse date formats', function () {
        it('yyyy-MM-dd', function () {
            changeInputValue(element, '2016-02-09');
            expectDate(element, 2, 9);
        });

        it('MM/dd/yyyy', function () {
            $scope.dateFormat = 'MM/dd/yyyy';
            element = compileElement($scope);

            changeInputValue(element, '02/09/2016');
            expectDate(element, 2, 9);
        });
    });


    describe('Parse custom formats', function () {

        it('0812', function () {

            changeInputValue(element, '0812');
            expectDate(element, 8, 12);
        });

        it('08-12', function () {

            changeInputValue(element, '08-12');
            expectDate(element, 8, 12);
        });

        it('08 12', function () {

            changeInputValue(element, '08 12');
            expectDate(element, 8, 12);
        });

        it('08/12', function () {

            changeInputValue(element, '08/12');
            expectDate(element, 8, 12);
        });

        it('08.12', function () {

            changeInputValue(element, '08.12');
            expectDate(element, 8, 12);
        });

        it('8/12', function () {
            $scope.dateFormat = 'M/d';
            element = compileElement($scope);

            changeInputValue(element, '8/12');
            expectDate(element, 8, 12);
        });

        it('12/8', function () {
            $scope.dateFormat = 'd/M';
            element = compileElement($scope);

            changeInputValue(element, '12/8');
            expectDate(element, 8, 12);
        });
    });

    describe('Return null for invalid', function () {

        it('abcd', function () {
            changeInputValue(element, 'abcd');
            expect(element.isolateScope().ngModel).toBe(null);
        });

        it('9999', function () {
            changeInputValue(element, '9999');
            expect(element.isolateScope().ngModel).toBe(null);
        });

        it('10.50', function () {
            changeInputValue(element, '10.50');
            expect(element.isolateScope().ngModel).toBe(null);
        });
    });

    describe('Validate by dateDisabled', function () {
        it('return null if date disabled', function () {

            $scope.dateDisabled = function (date, mode) {
                var d = new Date('2016-08-30T15:00:00+00:00');
                d.setHours(0, 0, 0, 0);
                return mode === 'day' && date < d;
            };
            $scope.$digest();

            changeInputValue(element, '08-12');

            expect(element.isolateScope().ngModel).toBe(null);
        });

        it('return date if in range', function () {

            var d = new Date('2016-08-30T15:00:00+00:00');
            $scope.dateDisabled = function (date, mode) {
                d.setHours(0, 0, 0, 0);
                return mode === 'day' && date < d;
            };
            $scope.$digest();

            changeInputValue(element, '08-30');

            expect(element.isolateScope().ngModel.getTime()).toBe(d.getTime());
        });
    });

    describe('Arrow keys', function () {

        it('add one day on arrow key up click', function () {
            $scope.date = new Date('2016-08-25');
            $scope.$digest();

            var input = element.find('.display-input');
            var keyUpCode = 38;
            triggerKeyDown(input, keyUpCode);

            expect($scope.date.getDate()).toBe(26);
        });

        it('substract one day on arrow key down click', function () {
            $scope.date = new Date('2016-08-25');
            $scope.$digest();

            var input = element.find('.display-input');
            var keyDownCode = 40;
            triggerKeyDown(input, keyDownCode);

            expect($scope.date.getDate()).toBe(24);
        });

        it('dont change date if alt key clicked', function () {
            $scope.date = new Date('2016-08-25');
            $scope.$digest();

            var input = element.find('.display-input');
            var altKeyCode = 18;
            triggerKeyDown(input, altKeyCode);

            expect($scope.date.getDate()).toBe(25);
        });

        it('set current date on enter click if input is empty', function () {

            var input = element.find('.display-input');
            var enterKeyCode = 13;
            triggerKeyDown(input, enterKeyCode);

            expect($scope.date).toBeDefined();
        });

    });

    function expectDate(el, month, day) {
        var model = el.isolateScope().ngModel;
        expect(model.getFullYear()).toBe(currentYear);
        expect(model.getMonth() + 1).toBe(month);
        expect(model.getDate()).toBe(day);
    }

    function changeInputValue(el, value) {
        var input = el.find('input');
        input.val(value);
        input.trigger($sniffer.hasEvent('input') ? 'input' : 'change');
        input.trigger('blur');
        $timeout.flush();
    }

});