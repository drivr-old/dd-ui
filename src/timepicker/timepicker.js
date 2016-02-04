//TODO: remove comment after done
//  8a = 08:00 (If last character is a, the time is am) 
//  8p = 20:00 (If last character is p the time is pm)
//  815a / p = 08:15 / 20:15
//  8.15a = 08:15 / 20:15
//  8 = 08:00
//  815 = 08:15
//  8.15 = 08:15
//  8:15 = 08:15
//  08:15 = 08:15

angular.module('dd.ui.timepicker', [])
    .directive('ddTimepicker', TimepickerDirective)
    .factory('timeparserService', timeparserService);

function TimepickerDirective() {

    var directive = {
        restrict: 'A',
        require: 'ngModel',
        replace: true,
        scope: {
        },
        link: function (scope, element, attrs, ngModel) {

            if (!angular.isDefined(ngModel)) {
                return;
            }
            
            //format text going to user (model to view)
            ngModel.$formatters.push(function (value) {
                return value.toUpperCase();
            });

            //format text from the user (view to model)
            ngModel.$parsers.push(function (value) {
                return value.toLowerCase();
            });

        }
    };
    return directive;

}


function timeparserService() {

    var amPmPattern = /^(\d+)(a|p)$/,
        normalTimeFormat = /^([0-9]|0[0-9]|1[0-9]|2[0-3])[.:][0-5][0-9]$/,
        digitsPattern = /^[0-9]+$/; 

    //TODO: validation for invalid cases
    function toModel(input) {
        
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
