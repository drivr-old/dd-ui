angular.module('dd.ui.datetimepicker', ['ui.bootstrap'])
    .directive('datetimepicker', ['$document', function ($document) {
        return {
            restrict: 'EA',
            require: 'ngModel',
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || 'template/datetimepicker/datetimepicker.html';
            },
            scope: {
                ngModel: '=',
                minuteStep: '=?',
                showSpinners: '=?',
                showMeridian: '=?',
                ngDisabled: '=?',
                dateDisabled: '&',
                popupPlacement: '@?'
            },
            link: function (scope, element, attrs, ctrl) {
                var firstTimeAssign = true;
                var timePickerElement = element.children().eq(0).children()[0];
                // hook up a view change listener to fire ng-change
                ctrl.$viewChangeListeners.push(function () {
                    scope.$eval(attrs.ngChange);
                });
                scope.$watch('ngModel', function (newTime) {
                    // if a time element is focused, updating its model will cause hours/minutes to be formatted by padding with leading zeros
                    if (!timePickerElement.contains($document[0].activeElement)) {
                        if (!newTime) {
                            if (firstTimeAssign) {
                                // create a new default time where the hours, minutes, seconds and milliseconds are set to 0.
                                newTime = new Date();
                                newTime.setHours(0, 0, 0, 0);
                            }
                            else {
                                return;
                            }
                        }
                        // Update timepicker (watch on ng-model in timepicker does not use object equality),
                        // also if the ngModel was not a Date, convert it to date
                        newTime = new Date(newTime);
                        scope.time = newTime; // change the time
                        if (firstTimeAssign) {
                            if (!scope.ngModel) {
                                scope.ngModel = new Date(newTime);
                            }
                            firstTimeAssign = false;
                        }
                    }
                }, true);
                scope.dateChange = function () {
                    var time = scope.time;
                    if (scope.ngModel) {
                        scope.ngModel.setHours(time.getHours(), time.getMinutes(), 0, 0);
                        ctrl.$setViewValue(scope.ngModel);
                    }
                };
                scope.timeChange = function () {
                    if (scope.ngModel && scope.time) {
                        if (!(scope.ngModel instanceof Date)) {
                            scope.ngModel = new Date(scope.ngModel);
                        }
                        var newValue = new Date(scope.ngModel);
                        newValue.setHours(scope.time.getHours(), scope.time.getMinutes(), 0, 0);
                        ctrl.$setViewValue(newValue);
                    }
                };
                scope.open = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    scope.opened = true;
                };
                (function init() {
                    if (scope.minuteStep === undefined) {
                        scope.minuteStep = 1;
                    }
                    if (scope.showSpinners === undefined) {
                        scope.showSpinners = true;
                    }
                }());
            }
        };
    }]);
