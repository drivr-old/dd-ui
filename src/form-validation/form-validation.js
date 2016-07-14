(function () {
    'use strict';

    angular
        .module('dd.ui.form-validation', [])
        .directive('showErrors', showErrors)
        .service('formValidationService', formValidationService);


    showErrors.$inject = ['$timeout'];

    function showErrors($timeout) {
        var linkFn = function (scope, el, attrs, formCtrl) {
            $timeout(function () {
                var blurred, inputEl, inputName, inputNgEl, options;
                blurred = false;
                options = scope.$eval(attrs.showErrors);
                inputEl = el[0].querySelector('[name]:not(div)');
                inputNgEl = angular.element(inputEl);
                inputName = inputNgEl.attr('name');

                if (!inputName) {
                    throw new Error('show-errors element has no child input elements with a \'name\' attribute');
                }

                inputNgEl.bind('blur', function () {
                    blurred = true;
                    return toggleClasses(formCtrl[inputName].$invalid);
                });

                scope.$watch(function () {
                    return formCtrl[inputName] && formCtrl[inputName].$invalid;
                }, function (invalid) {
                    if (!blurred) {
                        return;
                    }
                    return toggleClasses(invalid);
                });

                scope.$on(formCtrl.$name + '-show-errors-check-validity', function () {
                    return toggleClasses(formCtrl[inputName].$invalid);
                });

                scope.$on(formCtrl.$name + '-show-errors-reset', function () {
                    return $timeout(function () {
                        el.removeClass('has-error');
                        return blurred = false;
                    }, 0, false);
                });

                function toggleClasses(invalid) {
                    el.toggleClass('has-error', invalid);
                }
            });
        };

        return {
            restrict: 'A',
            require: '^form',
            priority: -100,
            compile: function (elem, attrs) {
                if (!elem.hasClass('form-group')) {
                    throw new Error('show-errors element does not have the \'form-group\' class');
                }
                return linkFn;
            }
        };
    }

    formValidationService.$inject = ['$rootScope'];
    function formValidationService($rootScope) {
        this.showErrors = function(formName) {
            $rootScope.$broadcast(formName + '-show-errors-check-validity');
        };

        this.hideErrors = function(formName) {
            $rootScope.$broadcast(formName + '-show-errors-reset');
        };
    }

})();