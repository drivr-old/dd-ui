angular.module('dd.ui.arrow-key-nav', [])
.directive('ddArrowKeyNav', ['$document', function ($document) {
    return {
        restrict: 'EA',
        link: function ($scope, containerElement, attrs, ctrl) {
            var className = 'arrow-key-nav';

            containerElement.on('keydown', function(event) {
                if (attrs.arrowKeyModifier) {
                    if (!event[attrs.arrowKeyModifier.toLowerCase() + 'Key']) {
                        return;
                    }
                }

                if (event.keyCode === 38) { // key up
                    event.preventDefault();
                    navigateUp();
                } else if (event.keyCode === 40) { // key down
                    event.preventDefault();
                    navigateDown();
                }
            });

            function navigateUp() {
                var prevElement = getNextElement(true);
                if (prevElement) {
                    prevElement.focus();
                }
            }

            function navigateDown() {
                var nextElement = getNextElement();
                if (nextElement) {
                    nextElement.focus();
                }
            }

            function getNextElement(reverse = undefined) {
                var focusableElements = getFocusableElements();
                if (reverse) {
                    focusableElements.reverse();
                }

                var currentIndex = focusableElements ? focusableElements.indexOf($document[0].activeElement) : -1;
                if (currentIndex !== -1) {
                    var next = focusableElements.slice(currentIndex + 1).find(isNavigatableElement);

                    if (!next) {
                        next = focusableElements.slice(0, currentIndex).find(isNavigatableElement);
                    }

                    return next;
                }
            }

            function isNavigatableElement(element) {
                return $(element).hasClass(className);
            }

            function getFocusableElements() {
                return $(containerElement).find('*').filter(function(index, el) {
                    return isFocusable(el);
                }).toArray();
            }

            function isFocusable(element) {
                var jElement = $(element);
                var nodeName = element.nodeName.toLowerCase(),
                    tabIndex = jElement.attr('tabindex');
                
                return !element.disabled &&
                       jElement.attr('disabled') !== 'disabled' &&
                       !jElement.hasClass('disabled') &&
                       (/input|select|textarea|button|object/.test(nodeName) ?
                            true :
                            nodeName === 'a' || nodeName === 'area' ?
                                element.href || !isNaN(<any>tabIndex) :
                                !isNaN(<any>tabIndex)
                       ) &&
                       !jElement.is(':hidden');
            }
        }
    };
}]);