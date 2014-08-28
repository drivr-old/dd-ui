// copy-paste from http://jsfiddle.net/jaredwilli/77NLB/

angular.module('dd.ui.validation.sameAs', [])

.directive('sameAs', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {

      ctrl.$parsers.unshift(validate);
      ctrl.$formatters.unshift(validate);

      function validate(viewValue) {
        var eth = scope[attrs.sameAs];

        if (!eth) {
          return viewValue;
        }

        if (viewValue === eth) {
          ctrl.$setValidity('sameAs', true);
          return viewValue;
        } else {
          ctrl.$setValidity('sameAs', false);
          return undefined;
        }
      }
    }
  };
});