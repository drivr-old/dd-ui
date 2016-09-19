angular.module('dd.ui.demo').controller('DatepickerDemoCtrl', ['$scope', function ($scope) {
    
    $scope.date = new Date();
    
    $scope.disabled = function (date, mode) {
        var d = new Date();
        d.setHours(0, 0, 0, 0);
        return mode === 'day' && date < d;
    };
    
    $scope.change = function () {
        console.log($scope.date, 'changed');
    };
    
    $scope.setToNow = function() {
        console.log('setToNow');
        $scope.date = new Date();
    };
    
    $scope.setToEmpty = function() {
        console.log('setToEmpty');
        $scope.date = null;
    };
}])
.config(['datepickerConfigProvider', function (datepickerConfigProvider) {
    datepickerConfigProvider.setDateFormat('yyyy-MM-dd');
}]);