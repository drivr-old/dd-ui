angular.module('dd.ui.dd-datetimepicker', ['ui.bootstrap'])
    .directive('ddDatetimepicker', ['$timeout', 'dateFilter', function ($timeout, dateFilter) {
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
                ngChange: '&?',
                dateFormat: '@',
                showDayName: '=?',
                allowForwardDateAdjustment: '=?'
            },
            link: function (scope, element, attrs, ctrl) {

                var timeChanged = false;
                var timepickerElement = element.find('.timepicker-container input');

                scope.time = null;
                scope.dateChange = dateChange;
                scope.timeChange = timeChange;
            
                initTime();
            
                scope.$watch('ngModel', function (value) {
                    if (scope.ngModel && scope.time) {
                        updateNgModelTime(scope.time);
                    }
                    setValidity();
                });

                scope.$watch('time', function (newTime, oldTime) {
                    setValidity();
                });

                timepickerElement.on('blur', function () {
                    jumpToNextDayIfPossible();
                });

                function dateChange() {
                    if (scope.ngModel && scope.time) {
                        updateNgModelTime(scope.time);
                        updateViewValue(scope.ngModel);
                    }
                    applyNgChange();
                }

                function timeChange() {
                    timeChanged = true;
                    if (scope.ngModel && scope.time) {
                        ensureDateTypes();
                        var newValue = new Date(scope.ngModel);
                        newValue.setHours(scope.time.getHours(), scope.time.getMinutes(), 0, 0);
                        updateNgModelTime(newValue);
                        updateViewValue(newValue);
                    }
                    applyNgChange();
                }

                function updateViewValue(value) {
                    ctrl.$setViewValue(value);
                }


                function initTime() {
                    scope.time = angular.copy(scope.ngModel);
                }

                function updateNgModelTime(time) {
                    ensureDateTypes();
                    scope.ngModel.setHours(time.getHours(), time.getMinutes(), 0, 0);
                }

                function ensureDateTypes() {
                    if (!(scope.ngModel instanceof Date)) {
                        scope.ngModel = new Date(scope.ngModel);
                    }
                    if (!(scope.time instanceof Date)) {
                        scope.time = new Date(scope.time);
                    }
                }

                function applyNgChange() {
                    if (scope.ngChange) {
                        scope.ngChange();
                    }
                }

                function setValidity() {
                    if (scope.ngRequired && (!scope.time || !scope.ngModel)) {
                        ctrl.$setValidity('required', false);
                    } else {
                        ctrl.$setValidity('required', true);
                    }
                }

                function jumpToNextDayIfPossible() {
                    if (!scope.ngModel || !scope.time) {
                        return;
                    }

                    var currentDate = scope.ngModel.getDate();
                    var canAddDay = canAddDayIfUserDecreaseTime();

                    if (canAddDay) {
                        scope.ngModel.setDate(currentDate + 1);
                        syncDatepickerModel();
                        notifyWithDatepickerChange();
                        _addDayExecuted = canAddDay;
                    }
                }

                var _addDayExecuted = false;
                function canAddDayIfUserDecreaseTime() {
                    return scope.allowForwardDateAdjustment && !_addDayExecuted && timeChanged && scope.ngModel.getTime() < new Date().getTime();
                }

                function notifyWithDatepickerChange() {
                    var datepickerElement = element.find('.datepicker-container .display-input');
                    datepickerElement.css('background-color', 'rgba(0, 128, 0, 0.15)');
                    $timeout(function () {
                        datepickerElement.css('background-color', '');
                    }, 500);
                }

                function syncDatepickerModel(element) {
                    scope.$broadcast('ddDatepicker:sync', { model: scope.ngModel });
                }

            }
        };
    }]);