function triggerKeyDown(element, keyCode) {
    var e = angular.element.Event('keydown');
    e.which = keyCode;
    element.trigger(e);
}