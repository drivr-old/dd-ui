angular.module('dd.ui.lookup', ['ui.bootstrap'])
.directive('ddLookup', ['$http', '$timeout', '$q', function ($http, $timeout, $q) {
    return {
        restrict: 'EA',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            url: '=?',
            lookupParams: '=?',
            lookupFormat: '&',
            ngDisabled: '=?',
            placeholder: '@?',
            lookupOnSelect: '&',
            lookupOnClear: '&',
            lookupResponseTransform: '&',
            lookupDataProvider: '&',
            lookupGrouping: '=?',
            lookupMinLength: '=?'
        },
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || 'template/lookup/lookup.html';
        },
        link: function ($scope, element, attrs, ctrl) {
            $scope.isBusy = false;
            
            /* --------------- typeahead extension --------------- */
            
            var typeaheadInput = element.find('input');
            
            // clear no results on blur
            typeaheadInput.on('blur', function() {
               $scope.noResults = false; 
            });

            $scope.$watch('ngModel', function(newVal, oldVal) { 
                if (!newVal && oldVal) {
                    // clear no results label on input clear
                    $scope.noResults = false;
                    
                    // notify that lookup value has been cleared
                    $timeout($scope.lookupOnClear);
                }
            });
            
            /* --------------- read-only attributes --------------- */

            $scope.inputClass = attrs.lookupInputClass;

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

            /* --------------- scope functions --------------- */

            $scope.getItems = function(query) {
                var dataPromise = null;
                if ($scope.url) {
                    dataPromise = getHttpItems(query).then(function(response) { return response.data; });
                } else if ($scope.lookupDataProvider) {
                    dataPromise = $q.when($scope.lookupDataProvider({ $query: query }));
                }
                
                if (!dataPromise) {
                    return null;
                }
                
                $scope.isBusy = true;
                return dataPromise.then(function (result) {
                    $scope.isBusy = false;
                    ctrl.$setDirty(true);
                    
                    if (attrs.lookupResponseTransform) {
                        result = $scope.lookupResponseTransform({ $response: result });
                    }
                    
                    if (attrs.lookupGrouping) {
                        result = applyGrouping(result);    
                    }
                                                                                                    
                    return result;
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
            
            function applyGrouping(data) {
                var propertyName = $scope.lookupGrouping || 'group';
                var grouped = data ? data.reduce(function(prev, curr) {
                    curr.lookupGroup = curr[propertyName] || 'Other';
                    
                    if (!prev[curr.lookupGroup]) {
                        prev[curr.lookupGroup] = [];
                        curr.firstInGroup = true;
                    }

                    prev[curr.lookupGroup].push(curr);
                                        
                    return prev;
                }, {}) : null;
                
                var result = [];
                for (var group in grouped) {
                    if ({}.hasOwnProperty.call(grouped, group)) {
                        result = result.concat(grouped[group]);
                    }                    
                }
                return result;
            }
            
            function getHttpItems(query) {
                var requestParams = $scope.lookupParams || {};
                requestParams.query = query;
                
                if (angular.isUndefined(requestParams.limit)) {
                    requestParams.limit = 10;
                }
                
                return $http({ method: 'GET', url: $scope.url, params: requestParams });                    
            }
        }
    };
}]);
