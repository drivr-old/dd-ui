describe('datetimepicker', function () {
    var $scope,
        $sniffer,
        $document,
        $compile,
        element,
        currentYear = new Date().getFullYear();

    beforeEach(function () {
        module('dd.ui.dd-datepicker');
        module('template/dd-datepicker/dd-datepicker.html');

        inject(function ($rootScope, _$compile_, _$sniffer_, _$document_) {
            $scope = $rootScope.$new();
            $sniffer = _$sniffer_;
            $document = _$document_;
            $compile = _$compile_;

            $scope.dateFormat = 'yyyy-MM-dd';
            element = compileElement($scope);
            element.appendTo($document[0].body);
            $scope.$digest();

        });
    });

    function compileElement($scope) {
        var element = $compile('<input dd-datepicker date-format="yyyy-MM-dd" date-disabled="dateDisabled(date, mode)" ng-model="date" />')($scope);
        element.appendTo($document[0].body);
        $scope.$digest();
        return element;
    }

    describe('Parse date formats', function () {
        it('2016-02-09', function () {
            changeInputValue(element, '2016-02-09');
            expectDate(element, 1, 9);
        });
    });


    describe('Parse custom formats', function () {

        it('0812', function () {

            changeInputValue(element, '0812');
            expectDate(element, 7, 12);
        });

        it('08-12', function () {

            changeInputValue(element, '08-12');
            expectDate(element, 7, 12);
        });

        it('08 12', function () {

            changeInputValue(element, '08 12');
            expectDate(element, 7, 12);
        });

        it('08/12', function () {

            changeInputValue(element, '08/12');
            expectDate(element, 7, 12);
        });
    });

    describe('Return null for invalid', function () {

        it('abcd', function () {
            changeInputValue(element, 'abcd');
            expect(element.isolateScope().ngModel).toBe('');
        });

        it('9999', function () {
            changeInputValue(element, '9999');
            expect(element.isolateScope().ngModel).toBe('');
        });

        it('10.50', function () {
            changeInputValue(element, '10.50');
            expect(element.isolateScope().ngModel).toBe('');
        });
    });

    describe('Validate by dateDisabled', function () {
        it('return null if date disabled', function () {
            
            $scope.dateDisabled = function (date, mode) {
                var d = new Date('2016-08-30T15:00:00+00:00');
                d.setHours(0, 0, 0, 0);
                return (mode === 'day' && date < d);
            };
            $scope.$digest();

            changeInputValue(element, '08-12');
            
            expect(element.isolateScope().ngModel).toBe('');
        });
        
        it('return date if in range', function () {
            
            var d = new Date('2016-08-30T15:00:00+00:00');
            $scope.dateDisabled = function (date, mode) {
                d.setHours(0, 0, 0, 0);
                return (mode === 'day' && date < d);
            };
            $scope.$digest();

            changeInputValue(element, '08-30');
            
            expect(element.isolateScope().ngModel.getTime()).toBe(d.getTime());
        });
    });

    function expectDate(el, month, day) {
        var model = el.isolateScope().ngModel;
        expect(model.getFullYear()).toBe(currentYear);
        expect(model.getMonth()).toBe(month);
        expect(model.getDate()).toBe(day);
    }

    function changeInputValue(el, value) {
        var input = el.find('input');
        input.val(value);
        input.trigger($sniffer.hasEvent('input') ? 'input' : 'change');
        $scope.$digest();
    }
});