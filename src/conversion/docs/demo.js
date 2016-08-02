angular.module('dd.ui.demo').controller('ConversionDemoCtrl', function ($scope) {

    $scope.units = [
        { label: 'Meter', value: 'm' },
        { label: 'Kilometer', value: 'km' },
        { label: 'Centimeter', value: 'cm' },
        { label: 'Milimeter', value: 'mm' },
        { label: 'Nanometer', value: 'nm' },
        { label: 'Mile', value: 'mi' },
        { label: 'Yard', value: 'yd' },
        { label: 'Foot', value: 'ft' },
        { label: 'Inch', value: 'in' }
    ];

    $scope.convertFromUnit = "m";
    $scope.unitValue = 1;
});