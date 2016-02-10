
angular.module('dd.ui.timepicker', [])
    .directive('ddTimepicker', TimepickerDirective)
    .service('timeparserService', timeparserService);

var KEY_ENTER = 13, KEY_UP = 38, KEY_DOWN = 40;

TimepickerDirective.$inject = ['dateFilter', 'timeparserService'];
function TimepickerDirective(dateFilter, timeparserService) {

    var directive = {
        restrict: 'A',
        require: 'ngModel',
        replace: true,
        scope: {
            ngModel: '=',
            minuteStep: '=?',
            isDateType: '=?'
        },
        link: function (scope, element, attrs, ctrl) {

            var dateTime = scope.isDateType && scope.ngModel instanceof Date ? scope.ngModel : new Date();
            scope.minuteStep = scope.minuteStep || 1;

            ctrl.$viewChangeListeners.push(function () {
                scope.$eval(attrs.onChange);
            });
            
            //(view to model)
            ctrl.$parsers.push(function (value) {
                return timeparserService.toModel(value, scope.isDateType, dateTime);
            });
            
            //(model to view)
            ctrl.$formatters.push(function (value) {
                return timeparserService.toView(value);
            });

            element.on('keydown keypress', function (event) {
                if (event.which === KEY_ENTER && !ctrl.$modelValue) {
                    updateViewValue(timeparserService.getFormattedTime());
                    event.preventDefault();
                } else if (event.which === KEY_UP) {
                    updateViewValue(timeparserService.changeTime(scope.ngModel, scope.minuteStep));
                    event.preventDefault();
                } else if (event.which === KEY_DOWN) {
                    updateViewValue(timeparserService.changeTime(scope.ngModel, -scope.minuteStep));
                    event.preventDefault();
                }
            });

            element.on('blur', function toModelTime() {
                updateViewValue(timeparserService.toView(scope.ngModel));
            });

            function updateViewValue(value) {
                ctrl.$setViewValue(value);
                ctrl.$render();
                applyNgChange();
            }

            function applyNgChange() {
                if (scope.ngChange) {
                    scope.ngChange();
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
            parsedTime = parseDigitsTime(input, digitsPattern);
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
            dateTime.setHours(parseInt(tokens[0]));
            dateTime.setMinutes(parseInt(tokens[1]));
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

    function getTimeInfoFromString(inputTime, mode) {

        if (inputTime[0] === '0') {
            inputTime = inputTime.replace(/^0/, '');
        }

        var val = parseInt(inputTime),
            hours = 0,
            minutes = 0;
        
        //user enter only minutes (mm)
        if (inputTime[0] === '0') {
            minutes = parseInt(inputTime);
        }
        //user enter only hour (H)
        else if (val <= 24 && inputTime.length <= 2) {
            hours = val;
        }
        // user enter hour and minutes (H:mm)
        else if (val > 24 && val <= 999) {
            hours = parseInt(inputTime[0]);
            minutes = parseInt(inputTime.substr(1, 3));
        }
        // user enter hours and minutes (HH:mm)
        else if (val > 24 && val <= 9999) {
            hours = parseInt(inputTime.substr(0, 2));
            minutes = parseInt(inputTime.substr(2, 4));
        }

        if (mode === 'p') {
            hours += 12;
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
        return input.trim().toLowerCase().replace('.', '').replace(':', '');
    }

    function hourToString(hour) {
        return hour < 10 ? '0' + hour : hour.toString();
    }

    function minutesToString(minutes) {
        return minutes < 10 ? '0' + minutes : minutes.toString();
    }

    function timeInfoToString(timeInfo) {
        return hourToString(timeInfo.hours) + ':' + minutesToString(timeInfo.minutes);
    }
}
