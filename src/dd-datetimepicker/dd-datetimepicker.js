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
                dateDisabled: '&',
                ngChange: '&?',
                dateFormat: '@'
            },
            link: function (scope, element, attrs, ctrl) {
                
                scope.dateChange = dateChange;
                scope.timeChange = timeChange;

                initTime();

                scope.$watch('ngModel', function (value) {
                    if (scope.ngModel && scope.time) {
                        updateNgModelTime(scope.time);
                    }
                });

                scope.$watch('time', function (newTime, oldTime) {
                    if(newTime && oldTime && scope.ngModel) {
                        updateDateIfNeeded(newTime, oldTime);
                    }
                });

                function dateChange() {
                    if (scope.ngModel && scope.time) {
                        updateNgModelTime(scope.time);
                        updateViewValue(scope.ngModel);
                    }
                    applyNgChange();
                }

                function timeChange() {
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
                
                function updateDateIfNeeded(newTime, oldTime) {
                    var hoursDelta = newTime.getHours() - oldTime.getHours();
                    var currentDate = scope.ngModel.getDate();
                    if (hoursDelta === -23) {
                        scope.ngModel.setDate(currentDate + 1);
                        notifyWithDatepickerChange();
                    } else if (hoursDelta === 23) {
                        scope.ngModel.setDate(currentDate - 1);
                        notifyWithDatepickerChange();
                    }
                }

                function notifyWithDatepickerChange() {
                    var datepicker = element.find('.datepicker-input.display-input');
                    updateDatepickerValue(datepicker);
                    datepicker.css('background-color','rgba(0, 128, 0, 0.15)');
                    $timeout(function() {
                        datepicker.css('background-color','rgba(0, 0, 0, 0)');
                    }, 500);
                }
                
                function updateDatepickerValue(element) {
                    var dateFormat = scope.dateFormat || 'yyyy-MM-dd';
                    element.val(dateFilter(scope.ngModel, dateFormat));
                }
            }
        };
    }]);