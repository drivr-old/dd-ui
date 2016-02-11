angular.module('dd.ui.dd-datetimepicker', ['ui.bootstrap'])
    .directive('ddDatetimepicker', ['$document', 'dateFilter', function ($document, dateFilter) {
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
                dateFormat: '@?'
            },
            link: function (scope, element, attrs, ctrl) {

                scope.dateChange = dateChange;
                scope.timeChange = timeChange;
                scope.dateFormat = scope.dateFormat || 'yyyy-MM-dd';
                
                initTime();

                scope.$watch('ngModel', function (value) {
                    if (scope.ngModel && scope.time) {
                        updateNgModelTime(scope.time);
                    }
                });
                
                function dateChange() {
                    if (scope.ngModel && scope.time) {
                        updateNgModelTime(scope.time);
                        updateViewValue(scope.ngModel);
                    }
                }

                function timeChange() {
                    if (scope.ngModel && scope.time) {
                        ensureDateTypes();
                        var newValue = new Date(scope.ngModel);
                        newValue.setHours(scope.time.getHours(), scope.time.getMinutes(), 0, 0);
                        updateNgModelTime(newValue);
                        updateViewValue(newValue);
                    }
                }

                function updateViewValue(value) {
                    ctrl.$setViewValue(value);
                    if (scope.ngChange) {
                        scope.ngChange();
                    }
                }

                function initTime() {
                    scope.time = angular.copy(scope.ngModel);
                    if (!scope.time) {
                        var time = new Date();
                        time.setHours(0, 0, 0, 0);
                        scope.time = time;
                    }
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
            }
        };
    }]);