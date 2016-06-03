angular.module('dd.ui.dd-datetimepicker', ['ui.bootstrap'])
    .directive('ddDatetimepicker', ['$timeout', function ($timeout) {
        return {
            restrict: 'EA',
            require: 'ngModel',
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || 'template/dd-datetimepicker/dd-datetimepicker.html';
            },
            scope: {
                ngModel: '=',
                minuteStep: '=?',
                showMeridian: '=?',
                ngDisabled: '=?',
                ngRequired: '=?',
                dateDisabled: '&',
                dateFormat: '@',
                showDayName: '=?',
                allowForwardDateAdjustment: '=?',
                datePlaceholder: '@?',
                timePlaceholder: '@?',
                popupPlacement: '@?'
            },
            link: function (scope, element, attrs, ctrl) {

                var timeChanged = false;
                var timepickerBlurEventFired = false;

                scope.time = null;
                scope.date = null;
                
                ctrl.$formatters.push(function(value) {
                    init(value);
                    return value;
                });

                scope.$watch('date', function (newTime, oldTime) {
                    if (scope.ngModel !== newTime) {
                        updateMainModel();
                        setValidity();
                    }
                });

                scope.$watch('time', function (newTime, oldTime) {

                    if (scope.ngModel !== newTime) {
                        timeChanged = true;
                        
                        updateMainModel();
                        setValidity();
                        adjustDate(newTime, oldTime);

                        timepickerBlurEventFired = false;
                    }
                });

                scope.onTimeBlur = function () {
                    timepickerBlurEventFired = true;
                };

                function updateMainModel() {
                    
                    ensureDateTypes();
                    var model = angular.copy(scope.date);
                    if (model && scope.time) {
                        model.setHours(scope.time.getHours(), scope.time.getMinutes(), 0, 0);
                    }

                    ctrl.$setViewValue(model);
                }

                function init(model) {
                    ctrl.$modelValue = model;
                    scope.time = ctrl.$modelValue;
                    scope.date = ctrl.$modelValue;
                }

                function ensureDateTypes() {
                    if (scope.date && !(scope.date instanceof Date)) {
                        scope.date = new Date(scope.date);
                    }
                    if (scope.time && !(scope.time instanceof Date)) {
                        scope.time = new Date(scope.time);
                    }
                }

                function setValidity() {
                    if (scope.ngRequired && (!scope.time || !scope.date)) {
                        ctrl.$setValidity('required', false);
                    } else {
                        ctrl.$setValidity('required', true);
                    }
                }

                function adjustDate(newTime, oldTime) {
                    if (!newTime || !oldTime || !scope.ngModel || timepickerBlurEventFired) {
                        return;
                    }

                    newTime = new Date(newTime);
                    oldTime = new Date(oldTime);

                    var hoursDelta = newTime.getHours() - oldTime.getHours();

                    if (hoursDelta === -23) {
                        adjustDateByDay(1);
                    } else if (hoursDelta === 23) {
                        adjustDateByDay(-1);
                    }
                }

                function adjustDateByDay(delta) {
                    var dateToSet = new Date(scope.ngModel.getTime());
                    var day = dateToSet.getDate() + delta;
                    dateToSet.setDate(day);

                    scope.$broadcast('ddDatepicker:setDate', { date: dateToSet });

                    notifyAboutDatepickerChange();
                }

                function notifyAboutDatepickerChange() {
                    var datepickerElement = element.find('.datepicker-container .display-input');
                    datepickerElement.css('background-color', 'rgba(0, 128, 0, 0.15)');
                    $timeout(function () {
                        datepickerElement.css('background-color', '');
                    }, 500);
                }

                function syncDatepickerModel() {
                    scope.$broadcast('ddDatepicker:sync', { model: ctrl.$modelValue });
                }

                function sameDay(d1, d2) {
                    return d1.getYear() === d2.getYear() &&
                        d1.getMonth() === d2.getMonth() &&
                        d1.getDate() === d2.getDate();
                }
            }
        };
    }]);