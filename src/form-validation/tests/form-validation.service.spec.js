describe('Form validation service tests', function () {

    var service,
        $scope;

    beforeEach(module('dd.ui.form-validation', function ($provide) {
        $scope = jasmine.createSpyObj('$rootScope', ['$broadcast']);
        $provide.value('$rootScope', $scope);
    }));

    beforeEach(inject(function ($rootScope, formValidationService) {
        service = formValidationService;
    }));

    it('broadcast event then showErrors is called', function () {
        service.showErrors('myForm');

        expect($scope.$broadcast).toHaveBeenCalledWith('myForm-show-errors-check-validity');
    });

    it('broadcast event then hideErrors is called', function () {

        service.hideErrors('myForm');

        expect($scope.$broadcast).toHaveBeenCalledWith('myForm-show-errors-reset');
    });

});