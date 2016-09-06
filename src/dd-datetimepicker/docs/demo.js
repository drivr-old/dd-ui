angular.module('dd.ui.demo').controller('DdDateTimePickerDemoCtrl', ['$scope', function ($scope) {
        $scope.dateTime = new Date();
        $scope.dateTime2 = new Date();
        $scope.formDateTime = new Date();
        $scope.date = new Date();
        $scope.time = '08:15';
        $scope.disabled = function (date, mode) {
            var d = new Date();
            d.setHours(0, 0, 0, 0);
            return mode === 'day' && date < d;
        };
        $scope.change = function () {
            console.log($scope.dateTime, 'changed');
        };
        $scope.setToNow = function () {
            console.log('setToNow');
            $scope.dateTime = new Date();
        };
        $scope.setToEmpty = function () {
            console.log('setToEmpty');
            $scope.dateTime = null;
        };
        $scope.formCancel = function () {
            $scope.form.$setPristine();
        };
    }]);
