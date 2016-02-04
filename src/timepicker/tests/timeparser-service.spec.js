describe('timeparser-service', function () {
    
  var timeparserService, $scope;
  
  beforeEach(module('dd.ui.timepicker'));
  

  beforeEach(inject(function ($rootScope, _timeparserService_) {
   
      $scope = $rootScope;
      timeparserService = _timeparserService_;
      
  }));


  describe('parse', function() {
      beforeEach(function () {
          $scope.isBusy = true;
          $scope.$digest();
      });

      it('8a', function() {
          var input = '8a';
          
          var model = timeparserService.toModel(input);
          
          expect(model).toBe('08:00');
      });
      
      it('7p', function() {
          var input = '7p';
          
          var model = timeparserService.toModel(input);
          
          expect(model).toBe('19:00');
      });
      
      it('1p', function() {
          var input = '1p';
          
          var model = timeparserService.toModel(input);
          
          expect(model).toBe('13:00');
      });

  });

});


//  8a = 08:00 (If last character is a, the time is am) 
//  8p = 20:00 (If last character is p the time is pm)
//  815a / p = 08:15 / 20:15
//  8.15a = 08:15 / 20:15
//  8 = 08:00
//  815 = 08:15
//  8.15 = 08:15
//  8:15 = 08:15
//  08:15 = 08:15