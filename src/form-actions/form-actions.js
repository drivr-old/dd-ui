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

                if (attrs.appendTo) {
                    var appendToElement = document.querySelector(attrs.appendTo);
                    if (appendToElement === null) {
                        throw new Error('append-to element do not exsist');
                    }

                    var size = calculateAppendToElementSize(appendToElement);
                    var actionBar = element[0].querySelector('.fixed-form-actions-bar');
                    actionBar.style.transform = 'translateX('+ size +'%)';
                }
            },
            restrict: 'E'
        };
    }

    function calculateAppendToElementSize(appendToElement) {
        return 100 - appendToElement.offsetWidth * 100 / window.innerWidth;
    }
})();