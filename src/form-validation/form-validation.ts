(function () {
    'use strict';

    angular
        .module('dd.ui.form-validation', [])
        .directive('showErrors', showErrors)
        .service('formValidationService', formValidationService);


    showErrors.$inject = ['$timeout'];

    function showErrors($timeout) {
        var linkFn = function (scope, el, attrs, formCtrl) {
            var blurred, inputNgEl, ngModelElement, ngModelCtrl;

            $timeout(function () {

                if (attrs.custom) {
                    initCustomWatches();
                } else {
                    initInputElementWatches();
                }

                function toggleClasses(invalid) {
                    el.toggleClass('has-error', invalid);
                }

                function initInputElementWatches() {
                    blurred = false;
                    inputNgEl = angular.element(findInputElement(el[0]));
                    ngModelElement = angular.element(el[0].querySelector('[ng-model][name]'));
                    ngModelCtrl = ngModelElement ? ngModelElement.controller('ngModel') : null;

                    if (!ngModelCtrl) {
                        throw new Error('show-errors input control element should have [ng-model] and [name]');
                    }

                    if (inputNgEl) {
                        inputNgEl.bind('blur', function () {
                            blurred = true;
                            return toggleClasses(ngModelCtrl.$invalid);
                        });
                    }

                    scope.$watch(function () {
                        return ngModelCtrl && ngModelCtrl.$invalid;
                    }, function (invalid) {
                        if (!blurred) {
                            return;
                        }
                        return toggleClasses(invalid);
                    });

                    scope.$on(formCtrl.$name + '-show-errors-check-validity', function () {
                        return toggleClasses(ngModelCtrl.$invalid);
                    });

                    scope.$on(formCtrl.$name + '-show-errors-reset', function () {
                        return $timeout(function () {
                            el.removeClass('has-error');
                            return blurred = false;
                        }, 0, false);
                    });
                }

                function initCustomWatches() {
                    scope.$watch(function () {
                        return attrs.showErrors;
                    }, function (options) {
                        if (angular.isDefined(options)) {
                            var invalid = scope.$eval(options);
                            return toggleClasses(invalid);
                        }
                    });
                }

                function findInputElement(group) {
                    return group.querySelector('input, textarea, select');
                }
            });
        };

        return {
            restrict: 'A',
            require: '^form',
            priority: -100,
            compile: function (elem, attrs) {
                if (!elem.hasClass('form-fields-group')) {
                    elem.addClass('form-fields-group');
                }
                return linkFn;
            }
        };
    }

    formValidationService.$inject = ['$rootScope'];
    function formValidationService($rootScope) {
        this.showErrors = function (formName) {
            $rootScope.$broadcast(formName + '-show-errors-check-validity');
        };

        this.hideErrors = function (formName) {
            $rootScope.$broadcast(formName + '-show-errors-reset');
        };
    }

})();