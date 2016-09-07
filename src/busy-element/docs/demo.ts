angular.module('dd.ui.demo').controller('BusyElementDemoCtrl', function ($scope, $timeout) {
	$scope.items = [
		{id: 'item1', status: ''},
		{id: 'item2', status: ''},
		{id: 'item3', status: ''}
	];

	$scope.updated = function(el) {

		if (el.status === '') {
			return;
		}

		// usually we enable isBusy before http request
		el.isBusy = true;

		$timeout(function() {
			// $timeout in this case replaces $http simulating response received
			el.responseStatus = el.status;
		}, 500);
	};
});