angular.module('dd.ui.demo').controller('DatepickerDemoCtrl', function ($scope) {
    
    $scope.date = new Date();
    
    $scope.disabled = function (date, mode) {
        var d = new Date();
        d.setHours(0, 0, 0, 0);
        return (mode === 'day' && date < d);
    };
    
    $scope.change = function () {
        console.log($scope.date, 'changed');
    };
    
});