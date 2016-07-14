angular.module('dd.ui.demo').controller('FormValidationsUxCtrl', ['$scope', 'formValidationService', function ($scope, formValidationService) {
    $scope.model = {};

    $scope.save = function () {
        if ($scope.form.$invalid) {
            formValidationService.showErrors($scope.form.$name);
        } else {
            $scope.form.$setPristine();
        }
    };

    $scope.cancel = function () {
        $scope.form.$setPristine();
        formValidationService.hideErrors($scope.form.$name);
    };

    $scope.items = [
        {
            id: 1,
            label: 'aLabel',
            subItem: null
        }, {
            id: 2,
            label: 'bLabel',
            subItem: { name: 'aSubItem' }
        }, {
            id: 3,
            label: 'cLabel',
            subItem: { name: 'bSubItem' }
        }];
}]);