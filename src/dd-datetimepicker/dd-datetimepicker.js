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
                allowForwardDateAdjustment: '=?'
            },
            link: function (scope, element, attrs, ctrl) {

                var timeChanged = false;
                var canExecuteNgModelChanges = true;
                var timepickerBlurEventFired = false;

                scope.time = null;
                scope.date = null;

                scope.$watch('ngModel', function (value) {
                    if (canExecuteNgModelChanges) {
                        init();
                    }
                });

                scope.$watch('date', function (newTime, oldTime) {
                    updateMainModel();
                    setValidity();
                });

                scope.$watch('time', function (newTime, oldTime) {
                    timeChanged = true;
                    
                    updateMainModel();
                    setValidity();
                    adjustToNextDayIfPossible();
                    adjustDate(newTime, oldTime);
                    
                    timepickerBlurEventFired = false;
                });
                
                scope.onTimeBlur = function() {
                    timepickerBlurEventFired = true;
                };
                
                function updateMainModel() {
                    canExecuteNgModelChanges = false;
                    
                    ensureDateTypes();
                    var model = angular.copy(scope.date);
                    if (model && scope.time) {
                        model.setHours(scope.time.getHours(), scope.time.getMinutes(), 0, 0);
                    }

                    ctrl.$setViewValue(model);

                    $timeout(function () {
                        canExecuteNgModelChanges = true;
                    }, 100);
                }

                function init() {
                    ctrl.$modelValue = angular.copy(scope.ngModel);
                    scope.time = angular.copy(ctrl.$modelValue);
                    scope.date = angular.copy(ctrl.$modelValue);
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
                    var currentDate = scope.ngModel.getDate();
                    if (hoursDelta === -23) {
                        adjustDateByDay(currentDate + 1);
                    } else if (hoursDelta === 23) {
                        adjustDateByDay(currentDate - 1);
                    }
                    
                }

                function adjustDateByDay(day) {
                    scope.ngModel.setDate(day);
                    scope.date = angular.copy(scope.ngModel);
                    notifyAboutDatepickerChange();
                }

                function adjustToNextDayIfPossible() {
                    if (!scope.date || !scope.time) {
                        return;
                    }

                    var currentDate = scope.date.getDate();

                    if (canAddDayIfUserDecreaseTime()) {
                        scope.date.setDate(currentDate + 1);
                        updateMainModel();
                        syncDatepickerModel();
                        notifyAboutDatepickerChange();
                    }
                }

                function canAddDayIfUserDecreaseTime() {
                    var currentDate = new Date();
                    currentDate.setSeconds(0);
                    currentDate.setMilliseconds(0);

                    return scope.allowForwardDateAdjustment &&
                        sameDay(currentDate, ctrl.$modelValue) &&
                        timeChanged &&
                        ctrl.$modelValue.getTime() < currentDate.getTime();
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
                    return d1.getUTCFullYear() === d2.getUTCFullYear() &&
                        d1.getUTCMonth() === d2.getUTCMonth() &&
                        d1.getUTCDate() === d2.getUTCDate();
                }
            }
        };
    }]);