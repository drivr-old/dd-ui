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
                var dirtyWatch;

                if (attrs.absolute) {
                    var actionBar = element[0].querySelector('.form-actions-bar');
                    actionBar.style.position = 'absolute';
                }

                if (attrs.parentContainer) {
                    var container = angular.element(document.getElementsByClassName(attrs.parentContainer));
                    dirtyWatch = scope.$watch('form.$dirty', function (newValue) {
                        if (newValue) {
                            container.addClass('form-actions-visible');
                        } else {
                            container.removeClass('form-actions-visible');
                        }
                    });
                }

                scope.$on('$destroy', function () {
                    if (dirtyWatch) {
                        dirtyWatch();
                    }
                });
            },
            restrict: 'E'
        };
    }
})();