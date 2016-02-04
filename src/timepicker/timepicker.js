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

    var amPmPattern = /^(\d+)(a|p)$/;

    function toModel(input) {

        if (amPmPattern.test(input)) {
            return parseAmPmTime(input, amPmPattern);
        }

        throw 'Invalid time';
    }

    function parseAmPmTime(input, pattern) {
        var tokens = tokenize(input, pattern),
            hour = parseInt(tokens[1]),
            mode = tokens[2];

        if (mode === 'a') {
            return hourToString(hour) + ':00';
        }

        if (mode === 'p') {
            return (hour + 12) + ':00';
        }

        throw 'Invalid am|pm time';
    }


    function tokenize(input, pattern) {
        return pattern.exec(input);
    }

    function hourToString(hour) {
        return hour < 10 ? '0' + hour : hour;
    }


    return {
        toModel: toModel
    };

}


