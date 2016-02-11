angular.module('dd.ui.demo').controller('DdDateTimePickerDemoCtrl', ['$scope', function ($scope) {
	$scope.dateTime = new Date();
	$scope.dateTime2 = new Date();
	
	$scope.disabled = function (date, mode) {
        var d = new Date();
        d.setHours(0, 0, 0, 0);
        return (mode === 'day' && date < d);
    };
    
    $scope.change = function() {
        console.log($scope.dateTime, 'changed');
    };
    
}]);