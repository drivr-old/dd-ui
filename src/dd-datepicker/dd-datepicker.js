(function () {
    'use strict';

    angular.module('dd.ui.dd-datepicker', ['ui.bootstrap'])
        .constant('days', ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
        .directive('ddDatepicker', DatepickerDirective)
        .service('datepickerParserService', datepickerParserService);

    var KEY_UP = 38, KEY_DOWN = 40;

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
                showDayName: '=?'
            },
            link: function (scope, element, attrs, ctrl) {

                var input = angular.element(element.find('.display-input'));
                var canUpdateDisplayModel = true;
                var canExecuteNgModelChanges = true;
                var canParseUserInput = false;

                scope.dayName = null;
                scope.dateFormat = attrs.dateFormat || 'yyyy-MM-dd';
                scope.useShortDateFormat = scope.dateFormat.length < 6;


                scope.calendarOpened = false;
                scope.openCalendar = openCalendar;

                init();

                scope.$watch('bootstrapDateModel', function (newValue, oldValue) {
                    if (newValue) {
                        updateMainModel(newValue);
                        if (canUpdateDisplayModel) {
                            updateDisplayModel(newValue);
                        }
                    }
                    updateDayLabel();
                });

                scope.$watch('ngModel', function (newValue, oldValue) {
                    if (!oldValue && !newValue) {
                        return;
                    }

                    if (canExecuteNgModelChanges) {
                        updateDisplayModel();
                        updateDayLabel();
                    }
                });

                scope.$watch('calendarOpened', function (newValue, oldValue) {
                    if (!newValue && oldValue) {
                        input.focus();
                    }
                });

                scope.$watch('displayModel', function (newValue, oldValue) {
                    canParseUserInput = newValue !== oldValue;
                });

                scope.$on('ddDatepicker:sync', function (event, args) {
                    scope.bootstrapDateModel = args.model;
                });

                input.on('blur', function () {
                    if (canParseUserInput) {
                        $timeout(function () {
                            parseUserInput();
                            updateDisplayModel();
                        }, 0);
                    }
                });

                input.on('keydown keypress', function (event) {
                    if (event.altKey) {
                        return;
                    } else if (event.which === KEY_UP) {
                        changeDate(1);
                        event.preventDefault();
                    } else if (event.which === KEY_DOWN) {
                        changeDate(-1);
                        event.preventDefault();
                    }
                });

                function parseUserInput() {
                    var parsedDate = datepickerParserService.parse(scope.displayModel, scope.dateFormat, scope.dateDisabled);
                    updateMainModel(parsedDate);
                    updateBootstrapDateModel(false);
                }

                function changeDate(delta) {
                    var parsedDate = datepickerParserService.parse(scope.displayModel, scope.dateFormat, scope.dateDisabled);
                    datepickerParserService.changeDate(parsedDate, delta);
                    updateMainModel(parsedDate);
                    updateBootstrapDateModel(false);
                    $timeout(updateDisplayModel, 0);
                }

                function openCalendar($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    scope.calendarOpened = true;
                }

                function init() {
                    ctrl.$modelValue = angular.copy(scope.ngModel);
                    updateBootstrapDateModel(true);
                }

                function updateBootstrapDateModel(allowUpdateDisplayModel) {
                    canUpdateDisplayModel = allowUpdateDisplayModel;
                    scope.bootstrapDateModel = angular.copy(ctrl.$modelValue);
                }

                function updateDisplayModel() {
                    canUpdateDisplayModel = true;
                    scope.displayModel = ctrl.$modelValue ? dateFilter(ctrl.$modelValue, scope.dateFormat) : null;
                }

                function updateMainModel(date) {
                    canExecuteNgModelChanges = false;
                    ctrl.$setViewValue(date);
                    ctrl.$render();
                    $timeout(function () {
                        canExecuteNgModelChanges = true;
                    }, 500);
                }

                function updateDayLabel() {
                    if (scope.showDayName) {
                        if (!ctrl.$modelValue) {
                            scope.dayName = null;
                        }
                        scope.dayName = days[ctrl.$modelValue.getDay()];
                    }
                }
            }
        };

        return directive;
    }

    datepickerParserService.$inject = ['uibDateParser'];
    function datepickerParserService(uibDateParser) {
        var self = this;

        var mmDdPattern = /^(0?[1-9]|1[012])[-\/\s]?(0?[1-9]|[12][0-9]|3[01])$/,
            mmDdFormatPattern = /(MM)[-\/\s](dd)/,
            datePartsPattern = /(..)[-\/\s]?(..)/;

        self.parse = parse;
        self.changeDate = changeDate;

        function parse(input, format, dateDisabled) {
            var parsedDate = parseInternal(input, format);
            if (dateDisabled) {
                parsedDate = validateWithDisabledDate(parsedDate, dateDisabled);
            }

            return parsedDate || null;
        }

        function changeDate(currentDate, delta) {
            if (!currentDate) {
                return;
            }

            var day = currentDate.getDate() + delta;
            currentDate.setDate(day);
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

            return uibDateParser.parse(input, format);
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