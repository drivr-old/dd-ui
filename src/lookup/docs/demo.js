angular.module('dd.ui.demo').controller('LookupDemoCtrl', ['$scope', '$http', '$httpBackend', function ($scope, $http, $httpBackend) {
    $scope.lastRequest = null;
    $scope.lookupParams = {
        currentVehicle: 'BMW'
    };

    // Fake backend
    $httpBackend.whenGET(function(url) { return url.startsWith('http://server/api/drivers'); }).respond(function(method, url) {
        var drivers = [
            { name: 'John', currentVehicle: 'BMW' },
            { name: 'Johnny', currentVehicle: 'Audi' }
        ];

        var params = getJsonFromUrl(url);
        if (params.currentVehicle) {
            drivers = drivers.filter(function(d) {
                return d.currentVehicle == params.currentVehicle;
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

    $scope.formatLabel = function(item) {
        return item.name + ' - ' + item.currentVehicle;
    };

    $scope.responseTransformer = function(response) {
        return response.items;
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