// copy-paste from https://gist.github.com/letanure/4a81adfbda16b52d25ed

angular.module('dd.ui.conversion', [])
    .filter('distance', function () {
        return function (distance, from, to, precision) {
            var units = ['km', 'm', 'cm', 'mm', 'nm', 'mi', 'yd', 'ft', 'in'];
            var factors = [1, 1000, 100000, 1000000, 1000000000000, 0.621371192237334, 1093.6132983377078745, 3280.8398950131236234, 39370.078740157485299];

            var conversionKey = {};

            for (var k = 0; k < units.length; k++) {
                conversionKey[units[k]] = {};
            }

            for (var i = 0; i < units.length; i++) {
                for (var j = i; j < units.length; j++) {
                    var convFactor;

                    if (i === 0) {
                        convFactor = factors[j];
                    } else if (units[i] === units[j]) {
                        convFactor = 1;
                    } else {
                        convFactor = conversionKey[units[i]][units[0]] * conversionKey[units[0]][units[j]];
                    }

                    conversionKey[units[i]][units[j]] = convFactor;
                    conversionKey[units[j]][units[i]] = 1 / convFactor;
                }
            }

            var result = distance * conversionKey[from][to];

            if (precision) {
                parseFloat(result.toFixed(precision));
            }

            return result;
        };
    });
