describe('validation', function () {
    var $scope, $compile, element;
    beforeEach(angular.mock.module('dd.ui.validation.sameAs'));
    beforeEach(inject(function ($rootScope, _$compile_) {
        $scope = $rootScope;
        $compile = _$compile_;
    }));
    describe('same-as', function () {
        beforeEach(function () {
            var element = $compile('<form name="forma"><input type="text" name="password" ng-model="password" /><input type="text" name="confirmPassword" ng-model="confirmPassword" same-as="password" /></form>')($scope);
        });
        it('should mark valid empty', function () {
            $scope.password = '';
            $scope.confirmPassword = '';
            $scope.$digest();
            expect($scope.forma.confirmPassword.$invalid).toBe(false);
        });
        it('should mark valid null', function () {
            $scope.password = null;
            $scope.confirmPassword = '';
            $scope.$digest();
            expect($scope.forma.confirmPassword.$invalid).toBe(false);
        });
        it('should mark invalid when ethalon not empty', function () {
            $scope.password = 'a';
            $scope.confirmPassword = '';
            $scope.$digest();
            expect($scope.forma.confirmPassword.$invalid).toBe(true);
            expect($scope.forma.confirmPassword.$error.sameAs).toBe(true);
        });
        it('should mark valid when ethalon is same', function () {
            $scope.password = 'a';
            $scope.confirmPassword = 'a';
            $scope.$digest();
            expect($scope.forma.confirmPassword.$invalid).toBe(false);
            expect($scope.forma.confirmPassword.$error).toEqual({});
        });
        it('should mark invalid when ethalon is different', function () {
            $scope.password = 'b';
            $scope.confirmPassword = 'a';
            $scope.$digest();
            expect($scope.forma.confirmPassword.$invalid).toBe(true);
        });
        it('should mark invalid when ethalon is changed', function () {
            $scope.password = 'a';
            $scope.confirmPassword = 'a';
            $scope.$digest();
            $scope.password = 'b';
            $scope.$digest();
            expect($scope.forma.confirmPassword.$invalid).toBe(true);
        });
    });
});
