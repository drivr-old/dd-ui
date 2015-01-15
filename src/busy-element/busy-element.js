angular.module('dd.ui.busy-element', [])

.directive('busyElement', ['$parse', '$timeout', '$rootScope', function ($parse, $timeout, $rootScope) {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl:'template/busy-element/busy-element.html',
        scope: {
            busy: '=?',
            status: '=?',
            timeout: '=?'
        },
        link: function (scope, element, attr) {
          updateSize();

            scope.$watch('status', function() {
                updateSize();
                if (scope.status != null) {
                    scope.busy = false;
                    scope.statusClass = scope.status;

                    if (scope.timeout !== 0) {
                        $timeout(function(){
                            scope.status = null;
                        }, scope.timeout ? $scope.timeout : 500);
                    }
                }
            });

            function updateSize() {
                scope.width = element.parent().innerWidth();
                scope.height = element.parent().innerHeight();
                scope.marginLeft = element.parent().css('padding-left');
                scope.marginTop = element.parent().css('padding-top');
            }
        }
    };
}]);