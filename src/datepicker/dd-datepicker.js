angular.module('dd.ui.datepicker', [])
    .directive('ddDatepicker', DatepickerDirective)
    .service('datepickerService', datepickerService);


DatepickerDirective.$inject = ['datepickerService'];
function DatepickerDirective(datepickerService) {

    var directive = {
        restrict: 'A',
        require: 'ngModel',
        replace: true,
        scope: {
            ngModel: '='
        },
        link: function (scope, element, attrs, ngModel) {
            
            //(view to model)
            ngModel.$parsers.push(function (value) {
                return datepickerService.toModel(value);
            });
            // 
            // //(model to view)
            ngModel.$formatters.push(function (value) {
                return datepickerService.toView(value);
            });

        }
    };

    return directive;
}

function datepickerService() {
    var self = this;
    
    self.toModel = toModel;
    
    function toModel(input) {
        
    }
    
    //private
    
    function parseDate() {
        
    }
}