describe('datetimepicker', function () {
    var $scope,
        $sniffer,
        $document,
        $compile,
        $timeout,
        element,
        datepickerElement,
        timepickerElement;

    beforeEach(function () {
        module('dd.ui.dd-datetimepicker');
        module('dd.ui.dd-datepicker');
        module('dd.ui.dd-timepicker');
        module('template/dd-datetimepicker/dd-datetimepicker.html');
        module('template/dd-datepicker/dd-datepicker.html');

        inject(function ($rootScope, _$compile_, _$sniffer_, _$document_, _$timeout_) {
            $scope = $rootScope.$new();
            $sniffer = _$sniffer_;
            $document = _$document_;
            $compile = _$compile_;
            $timeout = _$timeout_;

            element = compileElement($scope);

            datepickerElement = element.find('.datepicker-container input.datepicker-input');
            timepickerElement = element.find('.timepicker-container input.timepicker-input');
        });
    });

    describe('Model change', function () {

        it('does not change the time value if date set to empty', function () {
            $scope.dateTime = new Date('2015-08-30T16:00+00:00');
            $scope.$digest();

            var time = element.isolateScope().time;

            changeInputValue(datepickerElement, '');

            expect(element.isolateScope().time).toEqual(time);
        });

        it('does nothing if timepicker element is active.', function () {

            $scope.dateTime = new Date('2015-08-30T00:00+00:00');

            datepickerElement.focus();
            $scope.$digest();

            expect(element.isolateScope().ngModel).toBe($scope.dateTime);
        });

        it('set current date and time', function () {
            
            $scope.dateTime = null;
            $scope.$digest();

            $scope.dateTime = new Date('2015-08-30T15:00+00:00');
            $scope.$digest();

            expect(element.isolateScope().date.getTime()).toBe($scope.dateTime.getTime());
            expect(element.isolateScope().time.getTime()).toBe($scope.dateTime.getTime());
        });

        it('set empty date and time', function () {
            $scope.dateTime = new Date('2015-08-30T00:00+00:00');
            $scope.$digest();

            $scope.dateTime = null;
            $scope.$digest();

            expect(element.isolateScope().date).toBe(null);
            expect(element.isolateScope().time).toBe(null);
            expect(datepickerElement.val()).toBe('');
            expect(timepickerElement.val()).toBe('');
        });
    });

    describe('Date change', function () {

        it('notifies the controller via ng-change.', function () {
            var date = null;
            $scope.change = function () {
                date = new Date();
            };

            var isoDate = '2015-08-31';
            changeInputValue(datepickerElement, isoDate);

            expect(date).toBeDefined();
        });

        it('update ngModel after date change', function () {
            $scope.dateTime = null;
            $scope.$digest();

            var date = '2015-08-31';
            changeInputValue(datepickerElement, date);

            expect($scope.dateTime).toBeDefined();

        });
    });

    describe('Time change', function () {
        it('merges date and time on model.', function () {
            $scope.dateTime = new Date('2015-08-30T00:00:00+00:00');
            $scope.$digest();

            changeInputValue(timepickerElement, '15:30');
            timepickerElement.blur();

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

            changeInputValue(timepickerElement, '15:30');
            timepickerElement.blur();
            expect(newDate.toISOString()).toContain(':30');
        });
    });

    describe('Init', function () {
        it('sets default time and date from model.', function () {
            $scope.dateTime = new Date();
            var element = compileElement($scope);

            expect(element.isolateScope().time).toBeDefined();
            expect(element.isolateScope().date).toBeDefined();
        });
    });

    describe('Adjust date', function () {
        it('set next day if allowForwardDateAdjustment=true', function () {
 
            $scope.dateTime = new Date();
            $scope.allowForwardDateAdjustment = true;
            $scope.$digest();

            changeInputValue(timepickerElement, $scope.dateTime.getHours() - 1 +':30');
            timepickerElement.blur();

            var tomorrow = new Date();
            tomorrow.setDate(new Date().getDate() + 1);
            expect(element.isolateScope().ngModel.getDate()).toBe(tomorrow.getDate());
        });

        it('dont set next day allowForwardDateAdjustment=false', function () {
      
            $scope.dateTime = new Date('2015-08-30T15:00:00+00:00');
            $scope.allowForwardDateAdjustment = false;
            $scope.$digest();

            changeInputValue(timepickerElement, '08:30');
            timepickerElement.blur();

            expect(element.isolateScope().ngModel.getDate()).toBe(30);
        });
        
        it('23:59->00:01 = +1 day', function () {
    
            $scope.dateTime = new Date('2015-08-25T15:00:00+00:00');
            $scope.$digest();

            changeInputValue(timepickerElement, '23:59');
            timepickerElement.blur();
            changeInputValue(timepickerElement, '00:01');
            timepickerElement.blur();
            
            console.log($scope.dateTime);

            expect($scope.dateTime.getDate()).toBe(26);
        });
        
        it('00:01->23:59 = -1 day', function () {
  
            $scope.dateTime = new Date('2015-08-25T15:00:00+00:00');
            $scope.$digest();

            changeInputValue(timepickerElement, '00:01');
            timepickerElement.blur();
            changeInputValue(timepickerElement, '23:59');
            timepickerElement.blur();
            
            expect($scope.dateTime.getDate()).toBe(24);
        });
    });

    function changeInputValue(el, value) {
        el.val(value);
        el.trigger($sniffer.hasEvent('input') ? 'input' : 'change');
    }

    function compileElement($scope) {
        var element = $compile(angular.element('<div dd-datetimepicker ng-change="change()" allow-forward-date-adjustment="allowForwardDateAdjustment" ng-model="dateTime"></div>'))($scope);
        element.appendTo($document[0].body);
        $scope.$digest();
        return element;
    }

});