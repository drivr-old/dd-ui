angular.module('dd.ui.demo').controller('DateTimePickerDemoCtrl', ['$scope', function ($scope) {
	$scope.datetime = new Date();
	
	$scope.disabled = function (date, mode) {
        var d = new Date();
        d.setHours(0, 0, 0, 0);
        return (mode === 'day' && date < d);
    };
}]);