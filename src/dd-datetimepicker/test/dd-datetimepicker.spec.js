describe('datetimepicker', function () {
    var $scope,
        $sniffer,
        $document,
        $compile,
        element,
        datepickerElement,
        timepickerElement;

    beforeEach(function () {
        module('dd.ui.dd-datetimepicker');
        module('template/dd-datetimepicker/dd-datetimepicker.html');

        inject(function ($rootScope, _$compile_, _$sniffer_, _$document_) {
            $scope = $rootScope.$new();
            $sniffer = _$sniffer_;
            $document = _$document_;
            $compile = _$compile_;

            element = compileElement($scope);

            datepickerElement = element.find('.datepicker-container input');
            timepickerElement = element.find('.timepicker-container input.timepicker-input');
        });
    });

    describe('Model change', function () {

        it('does not change the time value if model is empty and it is not the first change.', function () {
            $scope.dateTime = new Date('2015-08-30T16:00+00:00');
            $scope.$digest();

            var time = element.isolateScope().time;

            $scope.dateTime = '';
            $scope.$digest();

            expect(element.isolateScope().time).toEqual(time);
        });

        it('does nothing if timepicker element is active.', function () {

            $scope.dateTime = new Date('2015-08-30T00:00+00:00');

            datepickerElement.focus();
            $scope.$digest();

            expect(element.isolateScope().ngModel).toBe($scope.dateTime);
        });
    });

    describe('Date change', function () {

        it('notifies the controller via ng-change.', function () {
            var date = null;
            $scope.change = function () {
                date = new Date();
            }

            var isoDate = '2015-08-31';
            changeInputValue(datepickerElement, isoDate);

            expect(date).toBeDefined();
        });
    });

    describe('Time change', function () {
        it('merges date and time on model.', function () {
            $scope.dateTime = new Date('2015-08-30T00:00:00+00:00');
            $scope.$digest();

            changeInputValue(timepickerElement, createTime(15, 30));

            expect($scope.dateTime.getHours()).toBe(15);
            expect($scope.dateTime.getMinutes()).toBe(30);
        });

        it('notifies the controller via ng-change.', function () {
            var newDate = null;
            $scope.dateTime = new Date();
            $scope.$digest();
            $scope.change = function () {
                newDate = $scope.dateTime;
            };

            changeInputValue(timepickerElement, createTime(15, 30));
            expect(newDate.toISOString()).toContain(':30');
        });
    });

    describe('Init', function () {
        it('sets default time from model.', function () {
            $scope.dateTime = new Date();
            var element = compileElement($scope);

            expect(element.isolateScope().time).toBeDefined();
        });
    });
    
    function changeInputValue(el, value) {
        el.val(value);
        el.trigger($sniffer.hasEvent('input') ? 'input' : 'change');
        $scope.$digest();
    }

    function createTime(hours, minutes) {
        var date = new Date('2015-08-30T15:00:00+00:00');
        date.setHours(hours, minutes, 0, 0);
        return date;
    }

    function compileElement($scope) {
        var element = $compile('<div dd-datetimepicker ng-change="change()" ng-model="dateTime"></div>')($scope);
        element.appendTo($document[0].body);
        $scope.$digest();
        return element;
    }

});