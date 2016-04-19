angular.module('dd.ui.lookup', ['ui.bootstrap'])
.directive('ddLookup', ['$http', '$timeout', function ($http, $timeout) {
    return {
        restrict: 'EA',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            url: '=',
            lookupParams: '=?',
            lookupFormat: '&',
            ngDisabled: '=?',
            lookupOnSelect: '&',
            lookupResponseTransform: '&'
        },
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || 'template/lookup/lookup.html';
        },
        link: function ($scope, element, attrs, ctrl) {
            $scope.isBusy = false;
            
            /* --------------- read-only attributes --------------- */

            $scope.required = attrs.required;
            $scope.placeholder = attrs.placeholder;

            if (attrs.lookupAddon) {
                var addonContainer = angular.element('<span class="input-group-addon"></span>');
                addonContainer.append(angular.element(attrs.lookupAddon));
                var inputGroup = element.find('.input-group');
                inputGroup.prepend(addonContainer);

                var width = addonContainer.outerWidth();
                var noResults = element.find('.lookup-no-results');
                noResults.css('margin-left', width);

                $timeout(function() {
                    var dropdown = element.find('.dropdown-menu');
                    dropdown.css('width', 'calc(100% - ' + width + 'px)');
                });
            }

            /* --------------- ngModel pipeline --------------- */

            ctrl.$formatters.push(function (modelValue) {
                return modelValue;
            });

            /* --------------- scope functions --------------- */

            $scope.getItems = function(query) {
                var requestParams = $scope.lookupParams || {};
                requestParams.query = encodeURIComponent(query);
                
                if(angular.isUndefined(requestParams.limit)){
                    requestParams.limit = 10;
                }

                $scope.isBusy = true;
                return $http({ method: 'GET', url: $scope.url, params: requestParams })
                    .then(function (result) {
                        $scope.isBusy = false;
                        if (attrs.lookupResponseTransform) {
                            return $scope.lookupResponseTransform({ $response: result.data });
                        }
                        ctrl.$setDirty(true);
                        return result.data;
                    }, function () {
                        $scope.isBusy = false;
                    });
            };

            $scope.clear = function () {
                if ($scope.ngDisabled) {
                    return;
                }

                $scope.ngModel = null;
                element.find('input').val('');
                ctrl.$setDirty(true);
                $scope.noResults = false;
            };

            $scope.getLabel = function (item) {
                if (!item) {
                    return null;
                }

                var label;
                if (attrs.lookupFormat) {
                    label = $scope.lookupFormat({$item: item});
                } else {
                    label = item.name;
                }

                return label;
            };

            $scope.onSelect = function($item, $model, $label) {
                ctrl.$setDirty(true);
                $timeout($scope.lookupOnSelect);
            };
        }
    };
}]);
