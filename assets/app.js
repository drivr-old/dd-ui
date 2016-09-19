angular.module('dd.ui.demo', ['dd.ui', 'plunker', 'ngTouch', 'ngAnimate', 'ngMockE2E'], ['$httpProvider',function($httpProvider){
  FastClick.attach(document.body);
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]).run(['$location', '$locale', function($location, $locale){
  //Allows us to navigate to the correct element on initialization
  if ($location.path() !== '' && $location.path() !== '/') {
    smoothScroll(document.getElementById($location.path().substring(1)), 500, function(el) {
      location.replace('#' + el.id);
    });
  }
  
  $locale.DATETIME_FORMATS.FIRSTDAYOFWEEK = 1;
  
}]);