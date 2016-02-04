
angular.module('dd.ui.timepicker', [])
    .directive('ddTimepicker', TimepickerDirective)
    .factory('timeparserService', timeparserService);


TimepickerDirective.$inject = ['timeparserService'];
function TimepickerDirective(timeparserService) {

    var directive = {
        restrict: 'A',
        require: 'ngModel',
        replace: true,
        scope: {
        },
        link: function (scope, element, attrs, ngModel) {
            
            //(view to model)
            ngModel.$parsers.push(function (value) {
                return timeparserService.toModel(value);
            });
            
            element.on('blur', toModelTime);
            
            function toModelTime() {
                ngModel.$setViewValue(timeparserService.toModel(ngModel.$modelValue));
                ngModel.$render();
            }
            
            //TODO: check about validations like min/max etc.

        }
    };
    
    return directive;

}

//TODO: grunt compile files in wrong order if this service will be putted in separate file. Need to fix this global issue
function timeparserService() {

    var amPmPattern = /^(\d+)(a|p)$/,
        normalTimeFormat = /^([0-9]|0[0-9]|1[0-9]|2[0-3])[.:][0-5][0-9]$/,
        digitsPattern = /^[0-9]+$/;

    //TODO: validation for invalid cases
    function toModel(input) {
        
        if(!input) {
            return null;
        }
        
        if (normalTimeFormat.test(input)){
            return input;
        }
        
        input = input.trim().toLowerCase().replace('.','').replace(':','');
        
        if (amPmPattern.test(input)) {
            return parseAmPmTime(input, amPmPattern);
        }
        
        if (digitsPattern.test(input)) {
            return parseDigitsTime(input, digitsPattern);
        }
        

        throw 'Invalid time, current val: '+input;
    }

    function parseAmPmTime(input, pattern) {
        var tokens = tokenize(input, pattern),
            timeInfo = getTimeInfoFromInputTokens(tokens[1], tokens[2]);

        return hourToString(timeInfo.hours) + ':' + minutesToString(timeInfo.minutes);
    }
    
    function parseDigitsTime(input) {
        var timeInfo = getTimeInfoFromInputTokens(input, null);
        return hourToString(timeInfo.hours) + ':' + minutesToString(timeInfo.minutes);
    }

    function tokenize(input, pattern) {
        return pattern.exec(input);
    }

    function getTimeInfoFromInputTokens(tokenPart, mode) {
        var val = parseInt(tokenPart),
            hours = 0,
            minutes = 0;

        if (val <= 24) {
            hours = val;
        } else if (val > 24 && val <= 999) {
            
            hours = parseInt(tokenPart[0]);
            minutes = parseInt(tokenPart.substr(1, 3));
            
        } else if (val > 24 && val <= 9999) {
            
            hours = parseInt(tokenPart.substr(0, 2));
            minutes = parseInt(tokenPart.substr(2, 4));
            
        }
        
        if (mode === 'p') {
            hours += 12;
        }
        
        return {
            hours: hours,
            minutes: minutes
        };
    }
    
    function hourToString(hour) {
        return hour < 10 ? '0' + hour : hour.toString();
    }
    
    function minutesToString(minutes) {
        return minutes < 10 ? '0' + minutes : minutes.toString();
    }

    return {
        toModel: toModel
    };

}
