(function () {
    'use strict';

    angular.module('dd.ui.dd-timepicker', [])
        .directive('ddTimepicker', TimepickerDirective)
        .service('timeparserService', timeparserService);

    var KEY_ENTER = 13, KEY_UP = 38, KEY_DOWN = 40;
    
    TimepickerDirective.$inject = ['$timeout', 'timeparserService'];
    function TimepickerDirective($timeout, timeparserService) {

        var directive = {
            restrict: 'A',
            require: 'ngModel',
            replace: true,
            scope: {
                ngModel: '=',
                onChange: '&',
                minuteStep: '=?',
                isDateType: '=?'
            },
            link: function (scope, element, attrs, ctrl) {
                
                var dateTime = scope.isDateType && scope.ngModel instanceof Date ? scope.ngModel : new Date();
                var canUpdateNgModel = false;
                var lastActionFromArrowKey = false;

                scope.minuteStep = scope.minuteStep || 1;

                ctrl.$parsers.push(function (value) {
                    value = canUpdateNgModel ? timeparserService.toModel(value, scope.isDateType, dateTime) : scope.ngModel;
                    canUpdateNgModel = false;
                    return value || null;
                });

                ctrl.$formatters.push(function (value) {
                    canUpdateNgModel = false;
                    return timeparserService.toView(value);
                });

                element.on('keydown keypress', function (event) {
                    if (event.altKey) {
                        return;
                    } else if (event.which === KEY_ENTER && !ctrl.$viewValue) {
                        updateModelOnKeypress(event, 0, timeparserService.getFormattedTime());
                    } else if (event.which === KEY_UP) {
                        updateModelOnKeypress(event, scope.minuteStep);
                    } else if (event.which === KEY_DOWN) {
                        updateModelOnKeypress(event, -scope.minuteStep);
                    }
                });

                element.on('blur', function toModelTime() {
                    if (isValueChanged()) {
                        canUpdateNgModel = true;
                        scope.ngModel = timeparserService.toModel(ctrl.$viewValue, scope.isDateType, dateTime);
                        updateViewValue(timeparserService.toView(scope.ngModel));
                        applyOnChange();
                    }

                    if (lastActionFromArrowKey) {
                        lastActionFromArrowKey = false;
                        applyOnChange();
                    }
                });

                function updateViewValue(value) {
                    ctrl.$setViewValue(value);
                    ctrl.$render();
                }

                function updateModelOnKeypress(event, delta, customDate = undefined) {
                    canUpdateNgModel = lastActionFromArrowKey = true;
                    updateViewValue(customDate || timeparserService.changeTime(scope.ngModel, delta));
                    event.preventDefault();
                }

                function isValueChanged() {
                    return ctrl.$viewValue !== timeparserService.toView(scope.ngModel);
                }
                
                function applyOnChange() {
                    if (scope.onChange) {
                        $timeout(scope.onChange);
                    }
                }
            }
        };

        return directive;

    }

    timeparserService.$inject = ['dateFilter'];
    function timeparserService(dateFilter) {
        var self = this;

        var amPmPattern = /^(\d+)(a|p)$/,
            normalTimePattern = /^([0-9]|0[0-9]|1[0-9]|2[0-3])[.:][0-5][0-9]$/,
            digitsPattern = /^[0-9]+$/;

        self.toModel = toModel;
        self.toView = toView;
        self.changeTime = changeTime;
        self.getFormattedTime = getFormattedTime;

        function toModel(input, isDateModel, dateTime) {

            var parsedTime = null;

            if (!input) {
                return null;
            }

            if (normalTimePattern.test(input)) {
                parsedTime = parseNormalTime(input);
                return parsedTimeToModel(parsedTime, isDateModel, dateTime);
            }

            input = prepareInput(input);

            if (amPmPattern.test(input)) {
                parsedTime = parseAmPmTime(input, amPmPattern);
                return parsedTimeToModel(parsedTime, isDateModel, dateTime);
            }

            if (digitsPattern.test(input)) {
                parsedTime = parseDigitsTime(input);
                return parsedTimeToModel(parsedTime, isDateModel, dateTime);
            }

            return null;
        }

        function toView(input) {
            if (input instanceof Date) {
                return getFormattedTime(input);
            }
            return input;
        }

        function changeTime(modelValue, delta) {
            var timeInfo = getTimeInfoFromString(prepareInput(modelValue));

            var date = new Date();
            date.setHours(timeInfo.hours);
            date.setMinutes(timeInfo.minutes + delta);

            return dateFilter(date, 'HH:mm');
        }

        function getFormattedTime(dateInstance) {
            var date = dateInstance || new Date();
            return dateFilter(date, 'HH:mm');
        }

        //private

        function parsedTimeToModel(parsedTime, isDateModel, dateTime) {

            if (!parsedTime) {
                return null;
            }

            if (isDateModel) {
                var tokens = parsedTime.split(':');
                dateTime.setHours(parseInt(tokens[0], 10));
                dateTime.setMinutes(parseInt(tokens[1], 10));
                return new Date(dateTime);
            }

            return parsedTime;
        }

        function parseAmPmTime(input, pattern) {
            var tokens = tokenize(input, pattern),
                timeInfo = getTimeInfoFromString(tokens[1], tokens[2]);

            return validateParsedTime(timeInfoToString(timeInfo));
        }

        function parseDigitsTime(input) {
            var timeInfo = getTimeInfoFromString(input, null);
            return validateParsedTime(timeInfoToString(timeInfo));
        }

        function parseNormalTime(input) {
            input = prepareInput(input);
            var timeInfo = getTimeInfoFromString(input, null);
            return timeInfoToString(timeInfo);
        }

        function tokenize(input, pattern) {
            return pattern.exec(input);
        }

        function getTimeInfoFromString(inputTime, mode = undefined) {

            inputTime = inputTime.replace(/^0/, '');

            var val = parseInt(inputTime, 10),
                hours = 0,
                minutes = 0;

            if (inputTime[0] === '0') { // user enter only minutes (mm)
                minutes = parseInt(inputTime, 10);
            } else if (val <= 24 && inputTime.length <= 2) { // user enter only hour (H)
                hours = val;
            } else if (val > 24 && val <= 999) { // user enter hour and minutes (H:mm)
                hours = parseInt(inputTime[0], 10);
                minutes = parseInt(inputTime.substr(1, 3), 10);
            } else if (val > 24 && val <= 9999) { // user enter hours and minutes (HH:mm)
                hours = parseInt(inputTime.substr(0, 2), 10);
                minutes = parseInt(inputTime.substr(2, 4), 10);
            }

            if (mode === 'p' && hours !== 12) {
                hours += 12;
            } else if (mode === 'a' && hours === 12) {
                hours = 0;
            }

            return {
                hours: hours,
                minutes: minutes
            };
        }

        function validateParsedTime(input) {
            if (normalTimePattern.test(input)) {
                return input;
            }
            return null;
        }

        function prepareInput(input) {
            if (input instanceof Date) {
                input = dateFilter(input, 'HH:mm');
            }
            if (!input) {
                input = '00:00';
            }
            return input.trim().toLowerCase().replace('.', '').replace(':', '');
        }

        function timePartToString(part) {
            return part < 10 ? '0' + part : part.toString();
        }

        function timeInfoToString(timeInfo) {
            return timePartToString(timeInfo.hours) + ':' + timePartToString(timeInfo.minutes);
        }
    }

})();