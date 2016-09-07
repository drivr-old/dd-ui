describe('validation phone', function () {
  var $scope,
    $compile,
    element;

  beforeEach(angular.mock.module('dd.ui.validation.phone'));

  beforeEach(inject(function ($rootScope, _$compile_) {
    $scope = $rootScope;
    $compile = _$compile_;
  }));

  describe('general phone', function(){
    beforeEach(function() {
       element = $compile('<form name="forma"><input type="text" name="phone" ng-model="phone" phone /></form>')($scope);
    });

    it('should mark valid empty', function(){
      $scope.phone = '';
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(false);
    });

    it('should mark valid when changed from invalid to empty', function(){
      $scope.phone = '+123';
      $scope.$digest();

      $scope.phone = '';
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(false);
    });

    it('should mark valid null', function(){
      $scope.phone = null;
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(false);
    });

    it('should mark valid 13 numbers starting with plus', function(){
      $scope.phone = '+1234567890123';
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(false);
      expect($scope.forma.phone.$error).toEqual({});
    });

    it('should mark invalid 13 numbers wo plus sign', function(){
      $scope.phone = '1234567890123';
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(true);
      expect($scope.forma.phone.$error.phone).toBe(true);
    });

    it('should mark invalid 9 numbers starting with plus', function(){
      $scope.phone = '+123456789';
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(true);
    });

    it('should mark invalid 15 numbers starting with plus', function(){
      $scope.phone = '+123456789012345';
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(true);
    });

    it('should mark invalid 13 numbers with one letter', function(){
      $scope.phone = '+1234567890123a';
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(true);
    });
  });

  describe('phoneCountryCode', function(){
    beforeEach(function() {
       element = $compile('<form name="forma"><input type="text" name="phone" ng-model="phone" phone-country-code /></form>')($scope);
    });

    it('should mark valid empty', function(){
      $scope.phone = '';
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(false);
    });

    it('should mark valid when changed from invalid to empty', function(){
      $scope.phone = 'aaa';
      $scope.$digest();

      $scope.phone = '';
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(false);
    });

    it('should mark valid null', function(){
      $scope.phone = null;
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(false);
    });

    it('should mark valid 3 numbers starting with plus', function(){
      $scope.phone = '+123';
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(false);
      expect($scope.forma.phone.$error).toEqual({});
    });

    it('should mark valid 1 number starting with plus', function(){
      $scope.phone = '+1';
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(false);
    });

    it('should mark invalid 3 numbers wo plus sign', function(){
      $scope.phone = '123';
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(true);
      expect($scope.forma.phone.$error.phoneCountryCode).toBe(true);
    });

    it('should mark invalid 4 numbers starting with plus', function(){
      $scope.phone = '+1234';
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(true);
    });

    it('should mark invalid 2 numbers with one letter', function(){
      $scope.phone = '+12a';
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(true);
    });
  });

  describe('phoneWoCountryCode', function(){
    beforeEach(function() {
      element = $compile('<form name="forma"><input type="text" name="phone" ng-model="phone" phone-wo-country-code /></form>')($scope);
    });

    it('should mark valid empty', function(){
      $scope.phone = '';
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(false);
    });

    it('should mark valid when changed from invalid to empty', function(){
      $scope.phone = 'aaa';
      $scope.$digest();

      $scope.phone = '';
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(false);
    });

    it('should mark valid null', function(){
      $scope.phone = null;
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(false);
    });

    it('should mark valid 7 numbers', function(){
      $scope.phone = '1234567';
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(false);
      expect($scope.forma.phone.$error).toEqual({});
    });

    it('should mark invalid 7 numbers with plus sign', function(){
      $scope.phone = '+1234567';
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(true);
      expect($scope.forma.phone.$error.phoneWoCountryCode).toBe(true);
    });

    it('should mark invalid 14 numbers', function(){
      $scope.phone = '12345678901234';
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(true);
    });

    it('should mark invalid 7 numbers with one letter', function(){
      $scope.phone = '1234567a';
      $scope.$digest();
      expect($scope.forma.phone.$invalid).toBe(true);
    });
  });
});
