(function () {
    'use strict';

    angular.module('dd.ui.dd-datepicker', ['ui.bootstrap'])
        .constant('days', ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
        .directive('ddDatepicker', DatepickerDirective)
        .service('datepickerParserService', datepickerParserService);

    var KEY_ENTER = 13, KEY_UP = 38, KEY_DOWN = 40;

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
                showDayName: '=?',
                placeholder: '@?',
                popupPlacement: '@?'
            },
            link: function (scope, element, attrs, ctrl) {

                var input = angular.element(element.find('.display-input'));
                var canUpdateDisplayModel = true;
                var canExecuteNgModelChanges = true;

                scope.dayName = null;
                scope.dateFormat = attrs.dateFormat || 'yyyy-MM-dd';
                scope.useShortDateFormat = scope.dateFormat.length < 6;

                scope.calendarOpened = false;
                scope.openCalendar = openCalendar;

                ctrl.$formatters.push(function(value) {
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
                            updateDisplayModel(validatedDate);
                        }
                        syncBootstrapDateModel();
                    } else {
                        updateMainModel(null);
                        updateDisplayModel(null);
                    }
                }

                function parseUserInput() {
                    var parsedDate = datepickerParserService.parse(scope.displayModel, scope.dateFormat, scope.dateDisabled, ctrl.$modelValue);
                    setDate(parsedDate);
                }

                function changeDate(delta) {
                    var parsedDate = scope.displayModel ? datepickerParserService.parse(scope.displayModel, scope.dateFormat, scope.dateDisabled, ctrl.$modelValue) : new Date();
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
		
        function parse(input, format, dateDisabled, time) {
            var parsedDate = parseInternal(input, format);
            
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