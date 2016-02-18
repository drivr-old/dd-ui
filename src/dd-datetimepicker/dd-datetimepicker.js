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
                showDayName: '=?'
            },
            link: function (scope, element, attrs, ctrl) {

                var timeChanged = false;
                var timepickerElement = element.find('.timepicker-container input');
                var canExecuteNgModelChanges = true;

                scope.time = null;
                scope.date = null;
                scope.dateChange = dateChange;
                scope.timeChange = timeChange;

                init();
                
                scope.$watch('ngModel', function (value) {
                    if (canExecuteNgModelChanges){
                        init();
                    }
                });

                scope.$watch('date', function (newTime, oldTime) {
                    setValidity();
                });

                scope.$watch('time', function (newTime, oldTime) {
                    setValidity();
                });

                timepickerElement.on('blur', function () {
                    jumpToNextDayIfPossible();
                });

                function dateChange() {
                    updateMainModel();
                    applyNgChange();
                }

                function timeChange() {
                    timeChanged = true;
                    updateMainModel();
                    applyNgChange();
                }

                function updateMainModel() {
                    canExecuteNgModelChanges = false;
                    ensureDateTypes();
                    
                    var model = angular.copy(scope.date);
                    if (model) {
                        if (scope.time) {
                            model.setHours(scope.time.getHours(), scope.time.getMinutes(), 0, 0);
                        } else {
                            model.setHours(0, 0, 0, 0);
                        }
                    }
                    ctrl.$setViewValue(model);
                    ctrl.$render();
                    
                    $timeout(function () {
                        canExecuteNgModelChanges = true;
                    }, 500);
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

                function applyNgChange() {
                    if (scope.ngChange) {
                        $timeout(function () {
                            scope.ngChange();
                        });
                    }
                }

                function setValidity() {
                    if (scope.ngRequired && (!scope.time || !scope.date)) {
                        ctrl.$setValidity('required', false);
                    } else {
                        ctrl.$setValidity('required', true);
                    }
                }

                function jumpToNextDayIfPossible() {
                    if (!scope.date || !scope.time) {
                        return;
                    }

                    var currentDate = scope.date.getDate();
                    var canAddDay = canAddDayIfUserDecreaseTime();

                    if (canAddDay) {
                        scope.date.setDate(currentDate + 1);
                        updateMainModel();
                        syncDatepickerModel();
                        notifyWithDatepickerChange();
                        _addDayExecuted = canAddDay;
                    }
                }

                var _addDayExecuted = false;
                function canAddDayIfUserDecreaseTime() {
                    return !_addDayExecuted && timeChanged && ctrl.$modelValue.getTime() < new Date().getTime();
                }

                function notifyWithDatepickerChange() {
                    var datepickerElement = element.find('.datepicker-container .display-input');
                    datepickerElement.css('background-color', 'rgba(0, 128, 0, 0.15)');
                    $timeout(function () {
                        datepickerElement.css('background-color', '');
                    }, 500);
                }

                function syncDatepickerModel(element) {
                    scope.$broadcast('ddDatepicker:sync', { model: ctrl.$modelValue });
                }

            }
        };
    }]);