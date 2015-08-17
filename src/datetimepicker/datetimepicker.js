angular.module('dd.ui.datetimepicker', ['ui.bootstrap'])

.directive('datetimepicker', ['$document', function ($document) {
			return {
				restrict : 'EA',
				require : 'ngModel',
				templateUrl : function (element, attrs) {
					return attrs.templateUrl || 'template/datetimepicker/datetimepicker.html';
				},
				scope : {
					ngModel : '=',
					minuteStep : '=?',
					showSpinners : '=?',
					showMeridian : '=?',
					ngDisabled : '=?',
					dateDisabled : '&'
				},

				link : function (scope, element) {
					var firstTimeAssign = true;
					//var timePickerElement = angular.element(element.children()[0]).children()[0];
					var timePickerElement = element.children().eq(0).children()[0];

					scope.$watch('ngModel', function (newTime) {
						// if a time element is focused, updating its model will cause hours/minutes to be formatted by padding with leading zeros
						if (!timePickerElement.contains($document[0].activeElement)) {
							if (newTime == null || newTime === '') { // if the newTime is not defined
								if (firstTimeAssign) { // if it's the first time we assign the time value
									// create a new default time where the hours, minutes, seconds and milliseconds are set to 0.
									newTime = new Date();
									newTime.setHours(0, 0, 0, 0);
								} else { // just leave the time unchanged
									return;
								}
							}

							// Update timepicker (watch on ng-model in timepicker does not use object equality),
							// also if the ngModel was not a Date, convert it to date
							newTime = new Date(newTime);

							scope.time = newTime; // change the time
							if (firstTimeAssign) {
								firstTimeAssign = false;
							}
						}
					}, true);

					scope.dateChange = function () {
						var time = scope.time;
						if (scope.ngModel) {
							scope.ngModel.setHours(time.getHours(), time.getMinutes(), 0, 0);
						}
					};

					scope.timeChange = function () {
						if (scope.ngModel && scope.time) {
							if (!(scope.ngModel instanceof Date)) {
								scope.ngModel = new Date(scope.ngModel);
							}
							scope.ngModel.setHours(scope.time.getHours(), scope.time.getMinutes(), 0, 0);
						}
					};

					scope.open = function ($event) {
						$event.preventDefault();
						$event.stopPropagation();
						scope.opened = true;
					};

					(function init() {
						if (scope.minuteStep === undefined) {
							scope.minuteStep = 1;
						}
						if (scope.showSpinners === undefined) {
							scope.showSpinners = true;
						}
					})();
				}
			};
		}
	]);
