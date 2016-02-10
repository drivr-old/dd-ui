describe('datetimepicker', function () {
    var $scope,
        $sniffer,
        $document,
        element,
        datepickerElement,
        timepickerElement;

    beforeEach(function () {
        module('dd.ui.dd-datetimepicker');
        module('template/dd-datetimepicker/dd-datetimepicker.html');

        inject(function ($rootScope, $compile, _$sniffer_, _$document_) {
            $scope = $rootScope.$new();
            $sniffer = _$sniffer_;
            $document = _$document_;

            element = $compile('<div dd-datetimepicker ng-change="change()" ng-model="dateTime"></div>')($scope);
            element.appendTo($document[0].body);
            $scope.$digest();

            datepickerElement = element.find('.datepicker-container input');
            timepickerElement = element.find('.timepicker-container input');
        });
    });

    describe('Model change', function () {
        it('initializes a default time value if it was never set.', function () {
            expect(element.isolateScope().time instanceof Date).toBeTruthy();
            expect(element.isolateScope().time.getHours()).toBe(0);
            expect(element.isolateScope().time.getMinutes()).toBe(0);
        });

        it('does not change the time value if model is empty and it is not the first change.', function () {
            $scope.dateTime = new Date('2015-08-30T16:00+00:00');
            $scope.$digest();

            var time = element.isolateScope().time;

            $scope.dateTime = '';
            $scope.$digest();

            expect(element.isolateScope().time).toEqual(time);
        });

        it('does nothing if timepicker element is active.', function () {
            datepickerElement.focus();

            $scope.$digest();

            $scope.dateTime = new Date('2015-08-30T16:00+00:00');
            $scope.$digest();

            expect(element.isolateScope().time.getHours()).toBe(0);
            expect(element.isolateScope().time.getMinutes()).toBe(0);
        });
    });

    describe('Date change', function () {

        it('notifies the controller via ng-change.', function () {
            var newDate = null;
            $scope.change = function () {
                newDate = $scope.dateTime;
            };

            var isoDate = '2015-08-31';
            changeInputValue(datepickerElement, isoDate);

            var expectedDate = new Date(isoDate);
            expectedDate.setHours(0, 0, 0, 0);
            expect(newDate).toEqual(expectedDate);
        });
    });

    describe('Time change', function () {
        it('merges date and time on model.', function () {
            $scope.dateTime = new Date('2015-08-30T15:00:00+00:00');
            $scope.$digest();

            changeInputValue(timepickerElement, createTime(15, 30));

            expect($scope.dateTime).toEqual(new Date('2015-08-30T15:30:00+00:00'));
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
            $scope.$digest();

            expect(element.isolateScope().time.getTime()).toBe($scope.dateTime.getTime());
        });
    });

    function changeInputValue(el, value) {
        el.val(value);
        el.trigger($sniffer.hasEvent('input') ? 'input' : 'change');
        $scope.$digest();
    }

    function createTime(hours, minutes) {
        var date = new Date('2015-08-30T' + hours + ':' + minutes + ':00+00:00');
        return date;
    }

});