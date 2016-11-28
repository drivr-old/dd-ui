interface Window {
    triggerKeyDown(input, keyUpCode);
}
describe('datetimepicker', function () {
    var $scope,
        $sniffer,
        $document,
        $compile,
        $timeout,
        element,
        currentYear = new Date().getFullYear();

    beforeEach(function () {
        angular.mock.module('dd.ui.dd-datepicker');
        angular.mock.module('template/dd-datepicker/dd-datepicker.html');

        inject(function ($rootScope, _$compile_, _$sniffer_, _$document_, _$timeout_, $locale) {
            $scope = $rootScope.$new();
            $sniffer = _$sniffer_;
            $document = _$document_;
            $compile = _$compile_;
            $timeout = _$timeout_;

            $locale.DATETIME_FORMATS.FIRSTDAYOFWEEK = 1;
            
            $scope.dateFormat = 'yyyy-MM-dd';
            element = compileElement($scope);
        });
    });

    function compileElement($scope, html?) {
        html = html || '<input dd-datepicker show-day-name="true" date-format="{{dateFormat}}" date-disabled="dateDisabled(date, mode)" ng-model="date" />';
        var element = $compile(html)($scope);
        element.appendTo($document[0].body);
        $scope.$digest();
        return element;
    }

    describe('Init', function () {
        it('sets default values.', function () {
            $scope.date = new Date('2016-02-09T12:01:00+00:00');

            var element = compileElement($scope);
            var elementScope = element.isolateScope();
            $timeout.flush();

            expect(elementScope.displayModel).toBeDefined();
            expect(elementScope.bootstrapDateModel).toBeDefined();
        });

        it('throws an error if date-prediction value is invalid.', () => {
            expect(() => {
                compileElement($scope, '<input dd-datepicker ng-model="date" date-prediction="other" />');
            }).toThrow();               
        });
    });

    describe('On user input', () => {
        describe('full date', () => {
            it('parses ISO format.', () => {
                changeInputValue(element, '2016-02-09');
                expectDate(element, 2, 9);
            });

            it('parses specified format.', () => {
                $scope.dateFormat = 'MM/dd/yyyy';
                element = compileElement($scope);
                changeInputValue(element, '02/09/2016');
                expectDate(element, 2, 9);
            });
        });

        describe('short date', () => {
            it('parses MMdd.', () => {
                changeInputValue(element, '0812');
                expectDate(element, 8, 12);
            });

            it('parses MM-dd.', function () {
                changeInputValue(element, '08-12');
                expectDate(element, 8, 12);
            });

            it('parses MM dd.', function () {
                changeInputValue(element, '08 12');
                expectDate(element, 8, 12);
            });

            it('parses MM/dd.', function () {
                changeInputValue(element, '08/12');
                expectDate(element, 8, 12);
            });

            it('parses MM.dd.', function () {
                changeInputValue(element, '08.12');
                expectDate(element, 8, 12);
            });

            describe('with specified format', () => {
                it('parses M/d.', function () {
                    $scope.dateFormat = 'M/d';
                    element = compileElement($scope);

                    changeInputValue(element, '8/12');
                    expectDate(element, 8, 12);
                });

                it('parses d/M.', function () {
                    $scope.dateFormat = 'd/M';
                    element = compileElement($scope);

                    changeInputValue(element, '12/8');
                    expectDate(element, 8, 12);
                });
            });

            describe('with date-prediction="future"', () => {
                beforeEach(() => {
                    element = compileElement($scope, '<input dd-datepicker ng-model="date" date-prediction="future" />');
                    jasmine.clock().mockDate(new Date('2016-06-06T12:00:00'));
                });

                afterEach(() => {
                    jasmine.clock().uninstall();
                });

                it('parses future date.', () => {
                    changeInputValue(element, '0605');
                    expectDate(element, 6, 5, 2017);                    
                });  

                it('parses current date.', () => {
                    changeInputValue(element, '0606');
                    expectDate(element, 6, 6, 2016);
                });               
            });
        });
        
        describe('invalid date', () => {
            it('sets the model to null.', () => {
                changeInputValue(element, 'abcd');
                expect(element.isolateScope().ngModel).toBe(null);

                changeInputValue(element, '9999');
                expect(element.isolateScope().ngModel).toBe(null);

                changeInputValue(element, '10.50');
                expect(element.isolateScope().ngModel).toBe(null);
            });
        });

        describe('with date disabling logic', () => {
            let d = new Date('2016-08-30T15:00:00+00:00');
            d.setHours(0, 0, 0, 0);

            beforeEach(() => {
                $scope.dateDisabled = function (date, mode) {                    
                    return mode === 'day' && date < d;
                };
                $scope.$digest();
            });

            it('sets model to null if disabled.', function () {
                changeInputValue(element, '08-12');

                expect(element.isolateScope().ngModel).toBe(null);
            });

            it('sets model to date if not disabled.', function () {
                changeInputValue(element, '08-30');

                expect(element.isolateScope().ngModel.getTime()).toBe(d.getTime());
            });
        });
    });

    describe('Arrow keys', function () {

        it('add one day on arrow key up click', function () {
            $scope.date = new Date('2016-08-25');
            $scope.$digest();

            var input = element.find('.display-input');
            var keyUpCode = 38;
            window.triggerKeyDown(input, keyUpCode);

            expect($scope.date.getDate()).toBe(26);
        });

        it('substract one day on arrow key down click', function () {
            $scope.date = new Date('2016-08-25');
            $scope.$digest();

            var input = element.find('.display-input');
            var keyDownCode = 40;
            window.triggerKeyDown(input, keyDownCode);

            expect($scope.date.getDate()).toBe(24);
        });

        it('invalidate date on arrow key down click if date is to become invalid', function () {
            $scope.dateDisabled = function (date, mode) {
                var d = new Date('2016-08-25T15:00:00+00:00');
                d.setHours(0, 0, 0, 0);
                return mode === 'day' && date < d;
            };
            $scope.date = new Date('2016-08-25');
            $scope.$digest();

            var input = element.find('.display-input');
            var keyDownCode = 40;
            window.triggerKeyDown(input, keyDownCode);

            expect(element.isolateScope().ngModel).toBe(null);
        });

        it('dont change date if alt key clicked', function () {
            $scope.date = new Date('2016-08-25');
            $scope.$digest();

            var input = element.find('.display-input');
            var altKeyCode = 18;
            window.triggerKeyDown(input, altKeyCode);

            expect($scope.date.getDate()).toBe(25);
        });

        it('dont change initial time', function () {
            $scope.date = new Date('2016-08-25T12:01:00+00:00');
            $scope.$digest();

            var input = element.find('.display-input');
            var altKeyCode = 38;
            window.triggerKeyDown(input, altKeyCode);

            expectUtcTime($scope.date, 12, 1, 0);
        });

        it('set current date on enter click if input is empty', function () {
            var input = element.find('.display-input');
            var enterKeyCode = 13;
            window.triggerKeyDown(input, enterKeyCode);

            expect($scope.date).toBeDefined();
        });

    });

    describe('ddDatepicker:setDate event', function () {
        it('sets date if valid', function() {
            $scope.date = new Date('2016-08-25');
            $scope.$digest();

            $scope.$broadcast('ddDatepicker:setDate', { date: new Date('2016-08-26') });
            $scope.$digest();

            expect($scope.date.getDate()).toBe(26);
        });

        it('does not set date if date invalid', function () {
            $scope.date = new Date('2016-08-25');
            $scope.$digest();

            $scope.$broadcast('ddDatepicker:setDate', { date: new Date('invalid') });
            $scope.$digest();

            expect($scope.date).toBe(null);
        });

        it('does not set date if date is in disabled range', function () {
            $scope.dateDisabled = function (date, mode) {
                var d = new Date('2016-08-25T15:00:00+00:00');
                d.setHours(0, 0, 0, 0);
                return mode === 'day' && date < d;
            };

            $scope.date = new Date('2016-08-25');
            $scope.$digest();

            $scope.$broadcast('ddDatepicker:setDate', { date: new Date('2016-08-24') });
            $scope.$digest();

            expect($scope.date).toBe(null);
        });
    });
    
    describe('calendar popup', function() {
        it('should open calendar popup on btn click', function() {
            
            var elementScope = element.isolateScope();
            
            element.find('.open-calendar-btn').trigger('click');

            expect(elementScope.calendarOpened).toBe(true);
        });
        
        it('on clear should close calendar', function() {
            
            var elementScope = element.isolateScope();
            
            element.find('.open-calendar-btn').trigger('click');
            element.find('.uib-clear').trigger('click');
            
            expect(elementScope.calendarOpened).toBe(false);
        });
        
        it('set ngModel from popup selected value', function() {
            
            var elementScope = element.isolateScope();
            
            element.find('.open-calendar-btn').trigger('click');
            element.find('.btn.btn-default.btn-sm.active').trigger('click');
            $scope.$digest();

            expect(elementScope.calendarOpened).toBe(false);
            expect(elementScope.ngModel).toBeDefined();
        });
    });

    function expectDate(el, month, day, year?) {
        var model = el.isolateScope().ngModel;
        expect(model.getFullYear()).toBe(year || currentYear);
        expect(model.getMonth() + 1).toBe(month);
        expect(model.getDate()).toBe(day);
    }

    function expectUtcTime(model, hour, minute, second) {
        expect(model.getUTCHours()).toBe(hour);
        expect(model.getUTCMinutes()).toBe(minute);
        expect(model.getUTCSeconds()).toBe(second);
    }

    function changeInputValue(el, value) {
        var input = el.find('input');
        input.val(value);
        input.trigger($sniffer.hasEvent('input') ? 'input' : 'change');
        input.trigger('blur');
        $timeout.flush();
    }

});