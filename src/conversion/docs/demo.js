angular.module('dd.ui.demo').controller('ConversionDemoCtrl', ['$scope', 'conversionService', '$timeout', function ($scope, conversionService, $timeout) {

    $scope.unitSystems = [
        { label: 'Metric', value: 'metric' },
        { label: 'Imperial', value: 'imperial' }
    ];

    $scope.units = [
        { label: 'Meter', value: 'm' },
        { label: 'Kilometer', value: 'km' }
    ];

    $scope.unitSystem = 'metric';
    $scope.unitValue = 1;

    $scope.updateUnitSystem = function () {
        conversionService.setUnitSystem($scope.unitSystem);
        $scope.unitValue--;

        $timeout(function () {
            $scope.unitValue++;   
        });
    };
}]);