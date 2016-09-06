angular.module('dd.ui.demo').controller('FormActionsDemoCtrl', ['$scope', function ($scope) {
        $scope.model = {};
        $scope.save = function () {
            $scope.form.$setPristine();
        };
        $scope.cancel = function () {
            $scope.form.$setPristine();
        };
    }]);
