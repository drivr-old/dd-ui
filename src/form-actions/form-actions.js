(function () {
    'use strict';
    angular
        .module('dd.ui.form-actions', [])
        .directive('formActions', formActions);
    function formActions() {
        return {
            require: '^form',
            transclude: true,
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || 'template/form-actions/form-actions.html';
            },
            link: function link(scope, element, attrs, formCtrl) {
                scope.form = formCtrl;
                if (attrs.absolute) {
                    var actionBar = element[0].querySelector('.form-actions-bar');
                    actionBar.style.position = 'absolute';
                }
                if (attrs.parentContainer) {
                    var container = angular.element(document.querySelector(attrs.parentContainer));
                    scope.$watch('form.$dirty', function (newValue) {
                        if (newValue) {
                            container.addClass('form-actions-visible');
                        }
                        else {
                            container.removeClass('form-actions-visible');
                        }
                    });
                }
            },
            restrict: 'E'
        };
    }
})();
