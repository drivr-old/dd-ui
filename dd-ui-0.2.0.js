/*
 * dd-ui
 * http://clickataxi.github.io/dd-ui/

 * Version: 0.2.0 - 2015-09-07
 * License: MIT
 */
angular.module("dd.ui", ["dd.ui.busy-element","dd.ui.datetimepicker","dd.ui.validation.phone","dd.ui.validation.sameAs","dd.ui.validation"]);
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
angular.module('dd.ui.datetimepicker', ['ui.bootstrap'])

.directive('datetimepicker', ['$document', function($document) {
	return {
		restrict: 'EA',
		require: 'ngModel',
		templateUrl: function(element, attrs) {
			return attrs.templateUrl || 'template/datetimepicker/datetimepicker.html';
		},
		scope: {
			ngModel: '=',
			minuteStep: '=?',
			showSpinners: '=?',
			showMeridian: '=?',
			ngDisabled: '=?',
			dateDisabled: '&'
		},

		link: function(scope, element, attrs, ctrl) {
			var firstTimeAssign = true;
			var timePickerElement = element.children().eq(0).children()[0];

			// hook up a view change listener to fire ng-change
			ctrl.$viewChangeListeners.push(function() {
				scope.$eval(attrs.ngChange);
			});

			scope.$watch('ngModel', function(newTime) {
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
						if (!scope.ngModel) {
							scope.ngModel = new Date(newTime);
						}

						firstTimeAssign = false;
					}
				}
			}, true);

			scope.dateChange = function() {
				var time = scope.time;
				if (scope.ngModel) {
					scope.ngModel.setHours(time.getHours(), time.getMinutes(), 0, 0);
					ctrl.$setViewValue(scope.ngModel);
				}
			};

			scope.timeChange = function() {
				if (scope.ngModel && scope.time) {
					if (!(scope.ngModel instanceof Date)) {
						scope.ngModel = new Date(scope.ngModel);
					}
					var newValue = new Date(scope.ngModel);
					newValue.setHours(scope.time.getHours(), scope.time.getMinutes(), 0, 0);
					ctrl.$setViewValue(newValue);
				}
			};

			scope.open = function($event) {
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
}]);
var PHONE_REGEXP = /^\+\d{10,14}$/;
var PHONE_COUNTRY_CODE_REGEXP = /^\+\d{1,3}$/;
var PHONE_WO_COUNTRY_CODE_REGEXP = /^\d{7,13}$/;
angular.module('dd.ui.validation.phone', [])

// directive to validate phone number with country code
.directive('phone', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            ctrl.$parsers.unshift(validate);
            ctrl.$formatters.unshift(validate);

            function validate(viewValue) {
                if (!viewValue && viewValue !== '') {
                    return viewValue;
                }

                if (viewValue === '' || PHONE_REGEXP.test(viewValue)) {
                    ctrl.$setValidity('phone', true);
                } else {
                    ctrl.$setValidity('phone', false);
                }
                return viewValue;
            }
        }
    };
})

// directive to validate phone number country code only
.directive('phoneCountryCode', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            ctrl.$parsers.unshift(validate);
            ctrl.$formatters.unshift(validate);

            function validate(viewValue) {
                if (!viewValue && viewValue !== '') {
                    return viewValue;
                }

                if (viewValue === '' || PHONE_COUNTRY_CODE_REGEXP.test(viewValue)) {
                    ctrl.$setValidity('phoneCountryCode', true);
                } else {
                    ctrl.$setValidity('phoneCountryCode', false);
                }
                return viewValue;
            }
        }
    };
})

// directive to validate phone number without country code
.directive('phoneWoCountryCode', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            ctrl.$parsers.unshift(validate);
            ctrl.$formatters.unshift(validate);

            function validate(viewValue) {
                if (!viewValue && viewValue !== '') {
                    return viewValue;
                }

                if (viewValue === '' || PHONE_WO_COUNTRY_CODE_REGEXP.test(viewValue)) {
                    ctrl.$setValidity('phoneWoCountryCode', true);
                } else {
                    ctrl.$setValidity('phoneWoCountryCode', false);
                }
                return viewValue;
            }
        }
    };
});

// copy-paste from http://jsfiddle.net/jaredwilli/77NLB/

angular.module('dd.ui.validation.sameAs', [])

.directive('sameAs', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {

      ctrl.$parsers.unshift(validate);
      ctrl.$formatters.unshift(validate);

      scope.$watch('sameAs', function() {
        validate(ctrl.$modelValue);
      });

      function validate(viewValue) {
        var eth = scope.sameAs;

        if (!eth) {
          return viewValue;
        }

        if (viewValue === eth) {
          ctrl.$setValidity('sameAs', true);
          return viewValue;
        } else {
          ctrl.$setValidity('sameAs', false);
          return undefined;
        }
      }
    },
    scope: {
      sameAs: '='
    }
  };
});

angular.module('dd.ui.validation', ['dd.ui.validation.phone', 'dd.ui.validation.sameAs']);
