/*
 * dd-ui
 * http://clickataxi.github.io/dd-ui/

 * Version: 0.2.5 - 2016-02-09
 * License: MIT
 */
angular.module("dd.ui", ["dd.ui.tpls", "dd.ui.arrow-key-nav","dd.ui.busy-element","dd.ui.datetimepicker","dd.ui.lookup","dd.ui.timepicker","dd.ui.validation.phone","dd.ui.validation.sameAs","dd.ui.validation"]);
angular.module("dd.ui.tpls", ["template/busy-element/busy-element.html","template/datetimepicker/datetimepicker.html","template/lookup/lookup.html"]);
angular.module('dd.ui.arrow-key-nav', [])
.directive('ddArrowKeyNav', ['$document', function ($document) {
    return {
        restrict: 'EA',
        link: function ($scope, containerElement, attrs, ctrl) {
            var className = 'arrow-key-nav';

            containerElement.on('keydown', function(event) {
                if (attrs.arrowKeyModifier) {
                    if (!event[attrs.arrowKeyModifier.toLowerCase() + 'Key']) {
                        return;
                    }
                }

                if (event.keyCode === 38) { // key up
                    event.preventDefault();
                    navigateUp();
                } else if (event.keyCode === 40) { // key down
                    event.preventDefault();
                    navigateDown();
                }
            });

            function navigateUp() {
                var prevElement = getNextElement(true);
                if (prevElement) {
                    prevElement.focus();
                }
            }

            function navigateDown() {
                var nextElement = getNextElement();
                if (nextElement) {
                    nextElement.focus();
                }
            }

            function getNextElement(reverse) {
                var focusableElements = getFocusableElements();
                if (reverse) {
                    focusableElements.reverse();
                }

                var currentIndex = focusableElements ? focusableElements.indexOf($document[0].activeElement) : -1;
                if (currentIndex !== -1) {
                    var next = focusableElements.slice(currentIndex + 1).find(isNavigatableElement);

                    if (!next) {
                        next = focusableElements.slice(0, currentIndex).find(isNavigatableElement);
                    }

                    return next;
                }
            }

            function isNavigatableElement(element) {
                return $(element).hasClass(className);
            }

            function getFocusableElements() {
                return $(containerElement).find('*').filter(function(index, el) {
                    return isFocusable(el);
                }).toArray();
            }

            function isFocusable(element) {
                var jElement = $(element);
                var nodeName = element.nodeName.toLowerCase(),
                    tabIndex = jElement.attr('tabindex');
                
                return !element.disabled &&
                       jElement.attr('disabled') !== 'disabled' &&
                       !jElement.hasClass('disabled') &&
                       (/input|select|textarea|button|object/.test(nodeName) ?
                            true :
                            nodeName === 'a' || nodeName === 'area' ?
                                element.href || !isNaN(tabIndex) :
                                !isNaN(tabIndex)
                       ) &&
                       !jElement['area' === nodeName ? 'parents' : 'closest'](':hidden').length;
            }
        }
    };
}]);
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
                requestParams.limit = 10;

                $scope.isBusy = true;
                return $http({ method: 'GET', url: $scope.url, params: requestParams })
                    .then(function (result) {
                        $scope.isBusy = false;
                        if (attrs.lookupResponseTransform) {
                            return $scope.lookupResponseTransform({ $response: result.data });
                        }
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

angular.module('dd.ui.timepicker', [])
    .directive('ddTimepicker', TimepickerDirective)
    .service('timeparserService', timeparserService);

var KEY_ENTER = 13, KEY_UP = 38, KEY_DOWN = 40;

TimepickerDirective.$inject = ['timeparserService'];
function TimepickerDirective(timeparserService) {

    var directive = {
        restrict: 'A',
        require: 'ngModel',
        replace: true,
        scope: {
            ngModel: '='
        },
        link: function (scope, element, attrs, ngModel) {
            
            //(view to model)
            ngModel.$parsers.push(function (value) {
                return timeparserService.toModel(value);
            });
            
            //(model to view)
            ngModel.$formatters.push(function (value) {
                return timeparserService.toView(value);
            });

            element.bind('keydown keypress', function (event) {
                if (event.which === KEY_ENTER && !ngModel.$modelValue) {
                    updateViewValue(timeparserService.getFormattedTime());
                    event.preventDefault();
                } else if (event.which === KEY_UP) {
                    updateViewValue(timeparserService.changeTime(ngModel.$modelValue, 1));
                    event.preventDefault();
                } else if (event.which === KEY_DOWN) {
                    updateViewValue(timeparserService.changeTime(ngModel.$modelValue, -1));
                    event.preventDefault();
                }
            });

            element.bind('blur', function toModelTime() {
                updateViewValue(timeparserService.toModel(ngModel.$modelValue));
            });

            function updateViewValue(value) {
                ngModel.$setViewValue(value);
                ngModel.$render();
            }

        }
    };

    return directive;

}

function timeparserService() {
    var self = this;
    
    var amPmPattern = /^(\d+)(a|p)$/,
        normalTimePattern = /^([0-9]|0[0-9]|1[0-9]|2[0-3])[.:][0-5][0-9]$/,
        digitsPattern = /^[0-9]+$/;
        
    self.toModel = toModel;
    self.toView = toView;
    self.changeTime = changeTime;
    self.getFormattedTime = getFormattedTime;

    function toModel(input) {

        if (!input) {
            return null;
        }

        if (normalTimePattern.test(input)) {
            return parseNormalTime(input);
        }

        input = prepareInput(input);

        if (amPmPattern.test(input)) {
            var parsed1 = parseAmPmTime(input, amPmPattern);
            return validateParsedTime(parsed1);
        }

        if (digitsPattern.test(input)) {
            var parsed2 = parseDigitsTime(input, digitsPattern);
            return validateParsedTime(parsed2);
        }

        return null;
    }

    function toView(input) {
        if (input instanceof Date) {
            return getFormattedTime(input);
        }
        return input;
    }

    function changeTime(modelValue, delta) {
        var timeInfo = getTimeInfoFromString(prepareInput(modelValue));

        timeInfo.minutes += delta;
        if (timeInfo.minutes === 60 && timeInfo.hours < 23) {
            timeInfo.hours += 1;
            timeInfo.minutes = 0;
        } else if (timeInfo.minutes === 60 && timeInfo.hours === 23) {
            timeInfo.hours = 0;
            timeInfo.minutes = 0;
        } else if (timeInfo.minutes === -1 && timeInfo.hours > 0) {
            timeInfo.hours -= 1;
            timeInfo.minutes = 59;
        } else if (timeInfo.minutes === -1 && timeInfo.hours === 0) {
            timeInfo.hours = 23;
            timeInfo.minutes = 59;
        }
        return timeInfoToString(timeInfo);
    }
    
    function getFormattedTime(dateInstance) {
        var date = dateInstance || new Date();
        return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
    }
    
    //private

    function parseAmPmTime(input, pattern) {
        var tokens = tokenize(input, pattern),
            timeInfo = getTimeInfoFromString(tokens[1], tokens[2]);

        return timeInfoToString(timeInfo);
    }

    function parseDigitsTime(input) {
        var timeInfo = getTimeInfoFromString(input, null);
        return timeInfoToString(timeInfo);
    }

    function parseNormalTime(input) {
        input = prepareInput(input);
        var timeInfo = getTimeInfoFromString(input, null);
        return timeInfoToString(timeInfo);
    }

    function tokenize(input, pattern) {
        return pattern.exec(input);
    }

    function getTimeInfoFromString(inputTime, mode) {

        if (inputTime[0] === '0') {
            inputTime = inputTime.replace(/^0/, '');
        }

        var val = parseInt(inputTime),
            hours = 0,
            minutes = 0;
        
        //user enter only minutes (mm)
        if (inputTime[0] === '0') {
            minutes = parseInt(inputTime);
        }
        //user enter only hour (H)
        else if (val <= 24 && inputTime.length <= 2) {
            hours = val;
        }
        // user enter hour and minutes (H:mm)
        else if (val > 24 && val <= 999) {
            hours = parseInt(inputTime[0]);
            minutes = parseInt(inputTime.substr(1, 3));
        }
        // user enter hours and minutes (HH:mm)
        else if (val > 24 && val <= 9999) {
            hours = parseInt(inputTime.substr(0, 2));
            minutes = parseInt(inputTime.substr(2, 4));
        }

        if (mode === 'p') {
            hours += 12;
        }

        return {
            hours: hours,
            minutes: minutes
        };
    }
    
    function validateParsedTime(input) {
        if (normalTimePattern.test(input)) {
            return input;
        }
        return null;
    }

    function prepareInput(input) {
        return input.trim().toLowerCase().replace('.', '').replace(':', '');
    }

    function hourToString(hour) {
        return hour < 10 ? '0' + hour : hour.toString();
    }

    function minutesToString(minutes) {
        return minutes < 10 ? '0' + minutes : minutes.toString();
    }

    function timeInfoToString(timeInfo) {
        return hourToString(timeInfo.hours) + ':' + minutesToString(timeInfo.minutes);
    }
}

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
    ".lookup-container .lookup-no-results {\n" +
    "  position: absolute;\n" +
    "  background-color: #fff;\n" +
    "  z-index: 1;\n" +
    "  padding: 4px;\n" +
    "  width: 100%;\n" +
    "  border: 1px solid #ddd;\n" +
    "  margin-top: 1px;\n" +
    "  top: 100%;\n" +
    "}\n" +
    ".lookup-container .lookup-no-results span {\n" +
    "  color: #a94442;\n" +
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
    "    <div ng-show=\"noResults\" class=\"lookup-no-results\">\n" +
    "      <span class=\"detail\"><i class=\"glyphicon glyphicon-remove\"></i> No results found</span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);
