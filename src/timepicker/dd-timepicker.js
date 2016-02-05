
angular.module('dd.ui.timepicker', [])
    .directive('ddTimepicker', TimepickerDirective)
    .factory('timeparserService', timeparserService);

var KEY_ENTER = 13, KEY_UP = 38, KEY_DOWN = 40;

TimepickerDirective.$inject = ['timeparserService'];
function TimepickerDirective(timeparserService) {

    var directive = {
        restrict: 'A',
        require: 'ngModel',
        replace: true,
        scope: {
            ngModel:'='
        },
        link: function (scope, element, attrs, ngModel) {
            
            //(view to model)
            ngModel.$parsers.push(function (value) {
                return timeparserService.toModel(value);
            });
            
            //(model to view)
            ngModel.$formatters.push(function (value) {
                return timeparserService.toView(value);
            });

            element.bind('keydown keypress', function (event) {
                if (event.which === KEY_ENTER && !ngModel.$modelValue) {
                    updateViewValue(timeparserService.getFormattedTime());
                    event.preventDefault();
                } else if (event.which === KEY_UP) {
                    updateViewValue(timeparserService.changeTime(ngModel.$modelValue, 1));
                    event.preventDefault();
                } else if (event.which === KEY_DOWN) {
                    updateViewValue(timeparserService.changeTime(ngModel.$modelValue, -1));
                    event.preventDefault();
                }
            });

            element.bind('blur', function toModelTime() {
                updateViewValue(timeparserService.toModel(ngModel.$modelValue));
            });

            function updateViewValue(value) {
                ngModel.$setViewValue(value);
                ngModel.$render();
            }

        }
    };

    return directive;

}

//TODO: grunt compile files in wrong order if this service will be putted in separate file. Need to fix this global issue
function timeparserService() {

    var amPmPattern = /^(\d+)(a|p)$/,
        normalTimeFormat = /^([0-9]|0[0-9]|1[0-9]|2[0-3])[.:][0-5][0-9]$/,
        digitsPattern = /^[0-9]+$/;

    function toModel(input) {

        if (!input) {
            return null;
        }

        if (normalTimeFormat.test(input)) {
            return input.replace('.', ':');
        }

        input = prepareInput(input);

        if (amPmPattern.test(input)) {
            return parseAmPmTime(input, amPmPattern);
        }

        if (digitsPattern.test(input)) {
            return parseDigitsTime(input, digitsPattern);
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

        timeInfo.minutes += delta;
        if (timeInfo.minutes === 60 && timeInfo.hours < 23) {
            timeInfo.hours += 1;
            timeInfo.minutes = 0;
        } else if (timeInfo.minutes === 60 && timeInfo.hours === 23) {
            timeInfo.hours = 0;
            timeInfo.minutes = 0;
        } else if (timeInfo.minutes === -1 && timeInfo.hours > 0) {
            timeInfo.hours -= 1;
            timeInfo.minutes = 59;
        } else if (timeInfo.minutes === -1 && timeInfo.hours === 0) {
            timeInfo.hours = 23;
            timeInfo.minutes = 59;
        }
        return timeInfoToString(timeInfo);
    }
    
    //private

    function parseAmPmTime(input, pattern) {
        var tokens = tokenize(input, pattern),
            timeInfo = getTimeInfoFromString(tokens[1], tokens[2]);

        return timeInfoToString(timeInfo);
    }

    function parseDigitsTime(input) {
        var timeInfo = getTimeInfoFromString(input, null);
        return timeInfoToString(timeInfo);
    }

    function tokenize(input, pattern) {
        return pattern.exec(input);
    }
    
    function getTimeInfoFromString(inputTime, mode) {

        if (inputTime[0] === '0') {
            inputTime = inputTime.replace(/^0/,'');
        }

        var val = parseInt(inputTime),
            hours = 0,
            minutes = 0;
        
        //user enter only minutes (mm)
        if(inputTime[0] === '0') {
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
    
    function prepareInput(input) {
        return input.trim().toLowerCase().replace('.', '').replace(':', '');
    }

    function hourToString(hour) {
        return hour < 10 ? '0' + hour : hour.toString();
    }

    function minutesToString(minutes) {
        return minutes < 10 ? '0' + minutes : minutes.toString();
    }

    function getFormattedTime(dateInstance) {
        var date = dateInstance || new Date();
        return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
    }

    function timeInfoToString(timeInfo) {
        return hourToString(timeInfo.hours) + ':' + minutesToString(timeInfo.minutes);
    }

    return {
        toModel: toModel,
        toView: toView,
        getFormattedTime: getFormattedTime,
        changeTime: changeTime
    };
}
