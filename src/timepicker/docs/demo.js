angular.module('dd.ui.demo').controller('TimepickerDemoCtrl', function ($scope, $timeout) {
	
    $scope.time = '12:20';
    $scope.time5minutesStep = '15:20';
    $scope.timeFromDate = new Date();
    
    $scope.change = function() {
        console.log($scope.time, 'changed');
    };
    
});