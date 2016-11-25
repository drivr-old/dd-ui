(function () {
    'use strict';

    angular.module('dd.ui.dd-datepicker', ['ui.bootstrap'])
        .constant('days', ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
        .directive('ddDatepicker', DatepickerDirective)
        .service('datepickerParserService', datepickerParserService)
        .provider('datepickerConfig', <any>datepickerConfigProvider);

    var KEY_ENTER = 13, KEY_UP = 38, KEY_DOWN = 40;

    DatepickerDirective.$inject = ['$timeout', 'dateFilter', 'datepickerParserService', 'days', 'datepickerConfig'];
    function DatepickerDirective($timeout, dateFilter, datepickerParserService, days, datepickerConfig) {

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
                ngRequired: '=?',
                dateDisabled: '&',
                showDayName: '=?',
                placeholder: '@?',
                popupPlacement: '@?'
            },
            link: function (scope, element, attrs, ctrl) {

                var input = angular.element(element.find('.display-input'));
                var canUpdateDisplayModel = true;
                var canExecuteNgModelChanges = true;
                var datePrediction = attrs.datePrediction || 'default';
                if (datePrediction !== 'default' && datePrediction !== 'future') {
                    throw new Error('date-prediction must be either "default" or "future".');
                }

                scope.dayName = null;
                scope.dateFormat = attrs.dateFormat || datepickerConfig.dateFormat;
                scope.dateOptions = attrs.dateOptions || angular.copy(datepickerConfig.dateOptions);
                scope.useShortDateFormat = scope.dateFormat.length < 6;

                scope.dateOptions.dateDisabled = scope.dateDisabled;

                scope.calendarOpened = false;
                scope.openCalendar = openCalendar;
                scope.name = attrs.name;

                ctrl.$formatters.push(function (value) {
                    init(value);
                    return value;
                });

                scope.$watch('calendarOpened', function (newValue, oldValue) {
                    if (!newValue && oldValue) {
                        onCalendarClosed();
                        input.focus();
                    }
                });

                scope.$on('ddDatepicker:sync', function (event, args) {
                    scope.ngModel = args.model;
                });

                scope.$on('ddDatepicker:setDate', function (event, args) {
                    var validatedDate = datepickerParserService.validateWithDisabledDate(args.date, scope.dateDisabled);
                    setDate(validatedDate);
                    $timeout(updateDisplayModel, 0);
                });

                input.on('blur', function () {
                    if (isDateChanged()) {
                        parseUserInput();
                        updateDisplayModel();
                    }
                });

                input.on('keydown keypress', function (event) {
                    if (event.altKey) {
                        return;
                    } else if (event.which === KEY_ENTER && !scope.displayModel) {
                        changeDate(0);
                        event.preventDefault();
                    } else if (event.which === KEY_UP) {
                        changeDate(1);
                        event.preventDefault();
                    } else if (event.which === KEY_DOWN) {
                        changeDate(-1);
                        event.preventDefault();
                    }
                });

                function init(model) {
                    ctrl.$modelValue = model;
                    updateDisplayModel();
                    updateDayLabel();
                    syncBootstrapDateModel();
                }

                function isDateChanged() {
                    var inputVal = input.val();
                    if (!scope.ngModel && !inputVal) {
                        return false;
                    }

                    if (scope.ngModel && inputVal && dateFilter(scope.ngModel, scope.dateFormat) === inputVal) {
                        return false;
                    }

                    return true;
                }

                function onCalendarClosed() {
                    if (scope.bootstrapDateModel) {
                        var validatedDate = datepickerParserService.validateWithDisabledDate(scope.bootstrapDateModel, scope.dateDisabled);
                        updateMainModel(validatedDate);
                        if (canUpdateDisplayModel) {
                            updateDisplayModel();
                        }
                        syncBootstrapDateModel();
                    } else {
                        updateMainModel(null);
                        updateDisplayModel();
                    }
                }

                function parseUserInput() {
                    var parsedDate = datepickerParserService.parse(scope.displayModel, scope.dateFormat, scope.dateDisabled, ctrl.$modelValue, datePrediction);
                    setDate(parsedDate);
                }

                function changeDate(delta) {
                    var parsedDate = scope.displayModel ? datepickerParserService.parse(scope.displayModel, scope.dateFormat, scope.dateDisabled, ctrl.$modelValue, datePrediction) : new Date();
                    datepickerParserService.changeDate(parsedDate, delta);
                    var validatedDate = datepickerParserService.validateWithDisabledDate(parsedDate, scope.dateDisabled);
                    setDate(validatedDate);
                    $timeout(updateDisplayModel, 0);
                }

                function setDate(date) {
                    // chek if date is 'indvalid date' and make it null for consistency
                    if (!angular.isUndefined(date) && date !== null && isNaN(date.getDate())) {
                        date = null;
                    }

                    updateMainModel(date);
                    syncBootstrapDateModel();
                }

                function openCalendar($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    scope.calendarOpened = true;
                }

                function syncBootstrapDateModel() {
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
                    updateDayLabel();
                    $timeout(function () {
                        canExecuteNgModelChanges = true;
                    }, 100);
                }

                function updateDayLabel() {
                    if (scope.showDayName) {
                        if (!ctrl.$modelValue) {
                            scope.dayName = null;
                        } else {
                            scope.dayName = days[ctrl.$modelValue.getDay()];
                        }
                    }
                }
            }
        };

        return directive;
    }

    datepickerParserService.$inject = ['uibDateParser'];
    function datepickerParserService(uibDateParser) {
        var self = this;

        var mmDdPattern = /^(0?[1-9]|1[012])[-\/\s.]?(0?[1-9]|[12][0-9]|3[01])$/,
            mmDdFormatPattern = /(MM?)[-\/\s.](dd?)/,
            datePartsPattern = /^(\d\d?)[-\/\s.]?(\d\d?)$/;

        self.parse = parse;
        self.changeDate = changeDate;
        self.validateWithDisabledDate = validateWithDisabledDate;

        function parse(input, format, dateDisabled, time, datePrediction) {
            var parsedDate = parseInternal(input, format, datePrediction);

            if (!parsedDate) {
                return null;
            }
            if (dateDisabled) {
                parsedDate = validateWithDisabledDate(parsedDate, dateDisabled);
            }

            if (time && parsedDate) {
                parsedDate.setHours(time.getHours(), time.getMinutes(), 0, 0);
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

        function validateWithDisabledDate(parsedDate, dateDisabled) {
            var disabled = dateDisabled({ date: parsedDate, mode: 'day' });
            if (disabled) {
                return null;
            }

            return parsedDate;
        }

        // private

        function parseInternal(input, format, datePrediction) {
            var useMmDdPattern = mmDdFormatPattern.test(format);

            if (!useMmDdPattern) {
                input = reversToMmDdFormat(input);
            }

            if (mmDdPattern.test(input)) {
                return buildNewDate(input, datePrediction);
            }

            return uibDateParser.parse(input, format);
        }

        function buildNewDate(input, datePrediction) {
            var tokens = tokenize(input);
            var year = new Date().getFullYear();
            var month = parseInt(tokens[1], 10) - 1;
            var day = parseInt(tokens[2], 10);

            var date = new Date(year, month, day);
            if (datePrediction === 'future' && date < new Date()) {
                date.setFullYear(++year);
            }

            return date;
        }

        function reversToMmDdFormat(input) {
            return input.replace(datePartsPattern, '$2-$1');
        }

        function tokenize(input) {
            return mmDdPattern.exec(input);
        }
    }

    function datepickerConfigProvider() {
        var config = {
            dateFormat: 'yyyy-MM-dd',
            dateOptions: {
                startingDay: 1
            }
        };

        this.setDateFormat = function (value) {
            config.dateFormat = value;
        };

        this.setDateOptions = function (dateOptions) {
            config.dateOptions = dateOptions;
        };

        this.$get = function () {
            return config;
        };
    }

})();