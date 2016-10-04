namespace ddui {
    filterFieldFocus.$inject = ['$timeout'];
    function filterFieldFocus($timeout: ng.ITimeoutService): ng.IDirective {
        return {
            restrict: 'A',
            link: (scope: any, element, attr) => {
                scope.$watch(() => attr.filterFieldFocus, (oldVal, newVal) => {
                    if (newVal) {
                        $timeout(() => {
                            focusField(newVal);
                        }, 100, false);
                    }
                });

                function focusField(fieldName: string) {
                    var inputTags = 'input,select,textarea';
                    var element = document.getElementById(fieldName);
                    var focusable;
                    if (inputTags.indexOf(element.tagName.toLowerCase()) > -1) {
                        focusable = angular.element(element);
                    } else {
                        focusable = element.querySelector('input,select,textarea');
                    }

                    if (focusable) {
                        angular.element(focusable).focus();
                    }
                }
            }
        };
    }

    angular.module('dd.ui.filter-field-focus', []).directive('filterFieldFocus', filterFieldFocus);
}