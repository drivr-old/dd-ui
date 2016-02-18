(function () {
    'use strict';

    angular.module('dd.ui.dd-datepicker', ['ui.bootstrap'])
        .constant('days', ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
        .directive('ddDatepicker', DatepickerDirective)
        .service('datepickerParserService', datepickerParserService);

    DatepickerDirective.$inject = ['$timeout', 'dateFilter', 'datepickerParserService', 'days'];
    function DatepickerDirective($timeout, dateFilter, datepickerParserService, days) {

        var directive = {
            restrict: 'EA',
            require: 'ngModel',
            replace: true,
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || 'template/dd-datepicker/dd-datepicker.html';
            },
            scope: {
                ngModel: '=',
                minuteStep: '=?',
                showSpinners: '=?',
                showMeridian: '=?',
                ngDisabled: '=?',
                dateDisabled: '&',
                ngChange: '&',
                showDayName: '=?'
            },
            link: function (scope, element, attrs, ctrl) {

                var input = angular.element(element.find('.display-input'));
                var canUpdateDisplayModel = true;
                var canExecuteNgModelChanges = true;

                scope.dayName = null;
                scope.dateFormat = attrs.dateFormat || 'yyyy-MM-dd';
                scope.useShortDateFormat = scope.dateFormat.length < 6;
                scope.parseUserInput = parseUserInput;
                scope.open = open;

                init();

                scope.$watch('boostrapDateModel', function (newValue, oldValue) {
                    if (newValue) {
                        updateMainModel(newValue);
                        if (canUpdateDisplayModel) {
                            updateDisplayModel(newValue);
                        }
                        updateDayLabel();
                    }
                });

                scope.$watch('ngModel', function () {
                    if (canExecuteNgModelChanges) {
                        updateDisplay();
                        updateDayLabel();
                    }
                });

                scope.$on('ddDatepicker:sync', function (event, args) {
                    scope.boostrapDateModel = args.model;
                });

                input.on('blur', function () {
                    scope.$apply(updateDisplay);
                });

                function parseUserInput() {
                    var parsedDate = datepickerParserService.parse(scope.displayModel, scope.dateFormat, scope.dateDisabled);
                    updateMainModel(parsedDate);
                    canUpdateDisplayModel = false;
                    updateBootstrapDateModel(ctrl.$modelValue);
                }

                function open($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    scope.opened = true;
                }

                function init() {
                    ctrl.$modelValue = angular.copy(scope.ngModel);
                    updateBootstrapDateModel(ctrl.$modelValue);
                }

                function updateBootstrapDateModel(date) {
                    scope.boostrapDateModel = angular.copy(date);
                }

                function updateDisplay() {
                    updateDisplayModel(ctrl.$modelValue);
                    canUpdateDisplayModel = true;
                }

                function updateDisplayModel(date) {
                    scope.displayModel = date ? dateFilter(date, scope.dateFormat) : null;
                }

                function updateMainModel(date) {
                    canExecuteNgModelChanges = false;
                    ctrl.$setViewValue(date);
                    ctrl.$render();
                    applyNgChange();
                    $timeout(function () {
                        canExecuteNgModelChanges = true;
                    }, 500);
                }

                function applyNgChange() {
                    if (scope.ngChange) {
                        $timeout(function () {
                            scope.ngChange();
                        });
                    }
                }

                function updateDayLabel() {
                    if (scope.showDayName) {
                        scope.dayName = getDayLabel();
                    }
                }

                function getDayLabel() {
                    if (!ctrl.$modelValue) {
                        return null;
                    }
                    return days[ctrl.$modelValue.getDay()];
                }
            }
        };

        return directive;
    }

    datepickerParserService.$inject = ['dateParser'];
    function datepickerParserService(dateParser) {
        var self = this;

        var mmDdPattern = /^(0?[1-9]|1[012])[-\/\s]?(0?[1-9]|[12][0-9]|3[01])$/,
            mmDdFormatPattern = /(MM)[-\/\s](dd)/,
            datePartsPattern = /(..)[-\/\s]?(..)/;

        self.parse = parse;

        function parse(input, format, dateDisabled) {
            var parsedDate = parseInternal(input, format);
            if (dateDisabled) {
                return validateWithDisabledDate(parsedDate, dateDisabled);
            }
            return parsedDate;
        }
    
        //private
    
        function parseInternal(input, format) {
            var useMmDdPattern = mmDdFormatPattern.test(format);

            if (!useMmDdPattern) {
                input = reversToMmDdFormat(input);
            }

            if (mmDdPattern.test(input)) {
                return buildNewDate(input);
            }

            return dateParser.parse(input, format);
        }

        function validateWithDisabledDate(parsedDate, dateDisabled) {
            var disabled = dateDisabled({ date: parsedDate, mode: 'day' });
            if (disabled) {
                return null;
            }
            return parsedDate;
        }

        function buildNewDate(input) {
            var tokens = tokenize(input),
                year = new Date().getFullYear(),
                month = parseInt(tokens[1], 10) - 1,
                day = parseInt(tokens[2], 10);

            return new Date(year, month, day);
        }

        function reversToMmDdFormat(input) {
            return input.replace(datePartsPattern, '$2-$1');
        }

        function tokenize(input) {
            return mmDdPattern.exec(input);
        }
    }

})();