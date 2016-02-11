describe('datetimepicker', function () {
    var $scope,
        $sniffer,
        $document,
        element,
        currentYear = new Date().getFullYear();

    beforeEach(function () {
        module('dd.ui.dd-datepicker');
        module('template/dd-datepicker/dd-datepicker.html');

        inject(function ($rootScope, $compile, _$sniffer_, _$document_) {
            $scope = $rootScope.$new();
            $sniffer = _$sniffer_;
            $document = _$document_;
            
            $scope.dateFormat = 'yyyy-MM-dd';
            element = $compile('<input dd-datepicker date-format="yyyy-MM-dd" ng-model="date" />')($scope);
            element.appendTo($document[0].body);
            $scope.$digest();

        });
    });

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