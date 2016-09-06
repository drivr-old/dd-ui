angular.module('dd.ui.demo').controller('LookupDemoCtrl', ['$scope', '$http', '$httpBackend', function ($scope, $http, $httpBackend) {
    $scope.lastRequest = null;
    $scope.lookupParams = {
        currentVehicle: 'BMW'
    };
    $scope.minLength = 0;
    
    // Fake backend
    $httpBackend.whenGET(function(url) { return url.startsWith('http://server/api/drivers'); }).respond(function(method, url) {
        var drivers = [
            { name: 'John', currentVehicle: 'BMW' },
            { name: 'Johnny', currentVehicle: 'Audi' }
        ];

        var params: any = getJsonFromUrl(url);
        if (params.currentVehicle) {
            drivers = drivers.filter(function(d) {
                return d.currentVehicle === params.currentVehicle;
            });
        }

        return [200, drivers];
    });

    $httpBackend.whenGET(function(url) { return url.startsWith('http://server/api/corporations'); }).respond(function(method, url) {
        var corporations = {
            items: [
                { name: 'Microsoft' },
                { name: 'Google' }
            ]
        };

        return [200, corporations];
    });

    $httpBackend.whenGET(function(url) { return url.startsWith('http://server/api/emptyList'); }).respond(function(method, url) {
        return [200, []];
    });

    $scope.formatLabel = function(item) {
        return item.name + ' - ' + item.currentVehicle;
    };

    $scope.responseTransformer = function(response) {
        return response.items;
    };
    
    $scope.getLookupData = function(query) {
        return [
                { name: 'Provider item 1' },
                { name: 'Provider item 2' }
            ];
    };
    
    $scope.getGroupedData = function(query) {
        return [
                { name: 'Item 1 in group 1', groupName: 'Group 1' },
                { name: 'Item 2 in group 2', groupName: 'Group 2' },
                { name: 'Item 3 in group 1', groupName: 'Group 1' },
                { name: 'Item 4 in group 3', groupName: 'Group 3' },
                { name: 'Item 5 in group 2', groupName: 'Group 2' },
                { name: 'Item 6' },
                { name: 'Item 7' }
            ];
    };

    function getJsonFromUrl(url) {
      var query = url.substr(url.indexOf('?') + 1);
      var result = {};
      query.split('&').forEach(function(part) {
        var item = part.split('=');
        result[item[0]] = decodeURIComponent(item[1]);
      });
      return result;
    }
}]);