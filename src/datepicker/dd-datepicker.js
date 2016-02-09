angular.module('dd.ui.datepicker', ['ui.bootstrap'])
    .directive('ddDatepicker', DatepickerDirective);

function DatepickerDirective() {

    var directive = {
        restrict: 'A',
        require: 'ngModel',
        replace: true,
        templateUrl: function(element, attrs) {
			return attrs.templateUrl || 'template/datepicker/datepicker.html';
		},
        scope: {
            ngModel: '='
        },
        link: function (scope, element, attrs, ngModel) {
            
            //(view to model)
            ngModel.$parsers.push(function (value) {
                return value;
            });
            
            //(model to view)
            ngModel.$formatters.push(function (value) {
                return value;
            });
            
            scope.open = function($event) {
				$event.preventDefault();
				$event.stopPropagation();
				scope.opened = true;
			};

        }
    };

    return directive;
}
