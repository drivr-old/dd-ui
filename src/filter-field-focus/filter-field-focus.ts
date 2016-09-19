namespace ddui {
    function filterFieldFocus(): ng.IDirective {
        return {
            restrict: 'A',
            link: (scope: any, element, attr) => {
                scope.$watch(() => attr.filterFieldFocus, (oldVal, newVal) => {
                    if (newVal) {
                        focusField(newVal);
                    }
                });

                function focusField(fieldName: string) {
                    let elements = document.querySelectorAll(`[ng-model*="${fieldName}"]`);
                    for (let i = 0; i < elements.length; i++) {
                        angular.element(elements[i]).focus();
                    }
                }
            }
        };
    }

    angular.module('dd.ui.filter-field-focus', []).directive('filterFieldFocus', filterFieldFocus);
}