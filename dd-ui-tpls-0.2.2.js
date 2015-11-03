/*
 * dd-ui
 * http://clickataxi.github.io/dd-ui/

 * Version: 0.2.2 - 2015-11-03
 * License: MIT
 */
angular.module("dd.ui", ["dd.ui.tpls", "dd.ui.busy-element","dd.ui.datetimepicker","dd.ui.lookup","dd.ui.validation.phone","dd.ui.validation.sameAs","dd.ui.validation"]);
angular.module("dd.ui.tpls", ["template/busy-element/busy-element.html","template/datetimepicker/datetimepicker.html","template/lookup/lookup.html"]);
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
                var container = attr.busyElement ? angular.element(attr.busyElement) : element.parent();
                var offset = container.offset();
                element.offset(offset);

                scope.width = container.innerWidth();
                scope.height = container.innerHeight();
                scope.marginLeft = container.css('padding-left');
                scope.marginTop = container.css('padding-top');
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
angular.module('dd.ui.lookup', ['ui.bootstrap'])
.directive('ddLookup', ['$http', '$timeout', function ($http, $timeout) {
    return {
        restrict: 'EA',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            url: '=',
            lookupParams: '=?',
            lookupFormat: '=?',
            ngDisabled: '=?',
            lookupOnSelect: '&'
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
                // if a model is assigned from code, it won't have a label. need to set it.
                if (modelValue && !modelValue.$label) {
                    modelValue.$label = $scope.getLabel(modelValue);
                }
                return modelValue;
            });

            /* --------------- scope functions --------------- */

            $scope.getItems = function(query) {
                var requestParams = $scope.lookupParams || {};
                requestParams.query = encodeURIComponent(query);
                requestParams.limit = 10;

                $scope.isBusy = true;
                return $http({ method: 'GET', url: $scope.url, params: requestParams })
                    .then(function (result) {
                        $scope.isBusy = false;
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
                if ($scope.lookupFormat) {
                    var map = $scope.lookupFormat.slice(1).map(function (value) {
                        return item[value];
                    });
                    label = formatString($scope.lookupFormat[0], map);
                } else {
                    label = item.name;
                }

                return label;
            };

            $scope.onSelect = function($item, $model, $label) {
                $model.$label = $label;
                ctrl.$setDirty(true);
                $timeout($scope.lookupOnSelect);
            };

            /* --------------- private functions --------------- */

            function formatString(format) {
                var formatted = format;
                var args = Array.prototype.concat.apply([], arguments).splice(1);
                for (var i = 0; i < args.length; i++) {
                    var regexp = new RegExp('\\{' + i + '\\}', 'gi');
                    formatted = formatted.replace(regexp, (args[i] || ''));
                }

                return formatted;
            }
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

angular.module("template/busy-element/busy-element.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/busy-element/busy-element.html",
    "<div class=\"be-container\" style=\"margin-left: -{{ marginLeft }}; margin-top: -{{ marginTop }}\">\n" +
    "<style>\n" +
    ".be-container {\n" +
    "    position: absolute;\n" +
    "    z-index: 1;\n" +
    "}\n" +
    "\n" +
    ".be-overlay {\n" +
    "    background-color: rgba(255, 255, 255, 0.7);\n" +
    "    text-align: center;\n" +
    "}\n" +
    "\n" +
    ".be-overlay.success {\n" +
    "    background-color: rgba(0, 128, 0, 0.15);\n" +
    "}\n" +
    "\n" +
    ".be-overlay.fail {\n" +
    "    background-color: rgba(128, 0, 0, 0.15);\n" +
    "}\n" +
    "\n" +
    ".be-animate {\n" +
    "    -webkit-transition:opacity 0.5s;\n" +
    "    transition:opacity 0.5s;\n" +
    "    opacity:1;\n" +
    "}\n" +
    "\n" +
    ".be-animate.ng-hide-add, .be-animate.ng-hide-remove {\n" +
    "    display: block !important;\n" +
    "}\n" +
    ".be-animate.ng-hide {\n" +
    "    opacity:0;\n" +
    "}\n" +
    "</style>\n" +
    "    <div class=\"be-overlay\" ng-show=\"busy\" style=\"width: {{ width }}px; height: {{ height }}px; line-height: {{ height }}px\">\n" +
    "        <img src=\"https://drivr.com/img/spinner.gif\" />\n" +
    "    </div>\n" +
    "    <div class=\"be-overlay be-animate\" ng-show=\"status\" ng-class=\"statusClass\" style=\"width: {{ width }}px; height: {{ height }}px\"></div>\n" +
    "</div>");
}]);

angular.module("template/datetimepicker/datetimepicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/datetimepicker/datetimepicker.html",
    "<div class=\"form-inline\">\n" +
    "	<div class=\"form-group timepicker-container\">\n" +
    "		<div timepicker\n" +
    "			ng-model=\"time\"\n" +
    "			ng-disabled=\"ngDisabled\"\n" +
    "			show-meridian=\"showMeridian\"\n" +
    "			minute-step=\"minuteStep\"\n" +
    "			ng-change=\"timeChange()\"\n" +
    "			show-spinners=\"showSpinners\">\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"form-group datepicker-container\">\n" +
    "		<input class=\"form-control datepicker-input\" type=\"text\" style=\"width: 100px\"\n" +
    "				datepicker-popup\n" +
    "				ng-click=\"open($event)\"\n" +
    "				ng-change=\"dateChange($event)\"\n" +
    "				is-open=\"opened\"\n" +
    "				ng-model=\"ngModel\"\n" +
    "				ng-disabled=\"ngDisabled\"				\n" +
    "				date-disabled=\"dateDisabled({date: date, mode: mode})\"\n" +
    "				close-text=\"Close\"\n" +
    "				show-weeks=\"showWeeks\" />\n" +
    "	</div>\n" +
    "</div>");
}]);

angular.module("template/lookup/lookup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/lookup/lookup.html",
    "<style>\n" +
    ".lookup-container .input-group {\n" +
    "  width: 100%;\n" +
    "}\n" +
    ".lookup-container .dropdown-menu {\n" +
    "  border: 1px solid #ccc !important; \n" +
    "  border-top: none !important; \n" +
    "  font-size: 11px; \n" +
    "  padding: 1px !important; \n" +
    "  max-height: 196px; \n" +
    "  overflow-y: scroll; \n" +
    "  overflow-x: hidden; \n" +
    "  width: 100%;\n" +
    "}\n" +
    ".lookup-container input {\n" +
    "  background-color: #ffe;\n" +
    "}\n" +
    ".lookup-container .dropdown-menu > li > a {\n" +
    "  padding: 5px;\n" +
    "}\n" +
    ".lookup-container .lookup-legend div, .lookup-clear div {\n" +
    "  width: 16px;\n" +
    "  height: 16px;\n" +
    "  display: inline-block;\n" +
    "  vertical-align: middle;\n" +
    "}\n" +
    ".lookup-container a.lookup-clear {\n" +
    "  outline: 0\n" +
    "}\n" +
    ".lookup-container .lookup-no-results span {\n" +
    "  color: #999;\n" +
    "  font-size: 10px;\n" +
    "}\n" +
    ".lookup-container .lookup-legend .lookup-icon {\n" +
    "  background-image: url(./assets/img/magnifier-small.png);\n" +
    "}\n" +
    ".lookup-container .lookup-legend .spinner-icon {\n" +
    "  background-image: url(./assets/img/spinner.gif);\n" +
    "  background-size: 16px;\n" +
    "}\n" +
    ".lookup-container .lookup-clear .clear-icon {\n" +
    "  background-image: url(./assets/img/cross-small-white.png); \n" +
    "  opacity: 0.6;\n" +
    "}\n" +
    ".lookup-container .lookup-legend {\n" +
    "  position: absolute;\n" +
    "  right: 6px;\n" +
    "  top: 6px;\n" +
    "  z-index: 5;\n" +
    "}\n" +
    ".lookup-container .lookup-clear {\n" +
    "  position: absolute;\n" +
    "  right: 22px;\n" +
    "  top: 6px;\n" +
    "  z-index: 5;\n" +
    "}\n" +
    "</style>\n" +
    "\n" +
    "<div class=\"lookup-container\" ng-cloak>\n" +
    "  <div class=\"input-group\">\n" +
    "    <input type=\"text\"\n" +
    "           ng-model=\"ngModel\"\n" +
    "           autocomplete=\"off\"\n" +
    "           typeahead=\"d as getLabel(d) for d in getItems($viewValue)\"\n" +
    "           typeahead-on-select=\"onSelect($item, $model, $label)\"\n" +
    "           typeahead-editable=\"false\"\n" +
    "           typeahead-no-results=\"noResults\"\n" +
    "           ng-required=\"required\"\n" +
    "           ng-disabled=\"ngDisabled\"\n" +
    "           placeholder=\"{{placeholder}}\"\n" +
    "           class=\"form-control\" />\n" +
    "    <span class=\"lookup-legend\">\n" +
    "      <div class=\"lookup-icon\" ng-show=\"!isBusy\"></div>\n" +
    "      <div class=\"spinner-icon\" ng-show=\"isBusy\"></div>\n" +
    "    </span>\n" +
    "    <a class=\"lookup-clear\" ng-click=\"clear()\" tabindex=\"-1\" ng-class=\"{ 'disabled' : ngDisabled }\">\n" +
    "      <div class=\"clear-icon\" tooltip=\"Clear\" tooltip-append-to-body=\"true\"></div>\n" +
    "    </a>\n" +
    "  </div>\n" +
    "  <div ng-show=\"noResults\" class=\"lookup-no-results\">\n" +
    "    <span class=\"detail\"><i class=\"glyphicon glyphicon-remove\"></i> No results found</span>\n" +
    "  </div>\n" +
    "</div>");
}]);
