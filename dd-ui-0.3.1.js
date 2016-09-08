/*
 * dd-ui
 * http://clickataxi.github.io/dd-ui/

 * Version: 0.3.1 - 2016-02-22
 * License: MIT
 */angular.module("dd.ui", ["dd.ui.arrow-key-nav","dd.ui.busy-element","dd.ui.datetimepicker","dd.ui.dd-datepicker","dd.ui.dd-datetimepicker","dd.ui.dd-timepicker","dd.ui.lookup","dd.ui.validation.phone","dd.ui.validation.sameAs","dd.ui.validation"]);
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
                if (scope.status !== undefined) {
                    scope.busy = false;
                    scope.statusClass = scope.status;

                    if (scope.timeout !== 0) {
                        $timeout(function(){
                            scope.status = null;
                        }, scope.timeout ? scope.timeout : 500);
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
					if (!newTime) { // if the newTime is not defined
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
			}());
		}
	};
}]);
(function () {
    'use strict';

    angular.module('dd.ui.dd-datepicker', ['ui.bootstrap'])
        .constant('days', ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
        .directive('ddDatepicker', DatepickerDirective)
        .service('datepickerParserService', datepickerParserService);

    DatepickerDirective.$inject = ['$timeout', 'dateFilter', 'datepickerParserService', 'days'];
    function DatepickerDirective($timeout, dateFilter, datepickerParserService, days) {

        var directive = {
            restrict: 'EA',
            require: 'ngModel',
            replace: true,
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || 'template/dd-datepicker/dd-datepicker.html';
            },
            scope: {
                ngModel: '=',
                minuteStep: '=?',
                showSpinners: '=?',
                showMeridian: '=?',
                ngDisabled: '=?',
                dateDisabled: '&',
                ngChange: '&',
                showDayName: '=?'
            },
            link: function (scope, element, attrs, ctrl) {

                var input = angular.element(element.find('.display-input'));
                var canUpdateDisplayModel = true;
                var canExecuteNgModelChanges = true;

                scope.dayName = null;
                scope.dateFormat = attrs.dateFormat || 'yyyy-MM-dd';
                scope.useShortDateFormat = scope.dateFormat.length < 6;
                scope.parseUserInput = parseUserInput;
                scope.open = open;

                init();

                scope.$watch('boostrapDateModel', function (newValue, oldValue) {
                    if (newValue) {
                        updateMainModel(newValue);
                        if (canUpdateDisplayModel) {
                            updateDisplayModel(newValue);
                        }
                    }
                    updateDayLabel();
                });

                scope.$watch('ngModel', function () {
                    if (canExecuteNgModelChanges) {
                        updateDisplay();
                        updateDayLabel();
                    }
                });

                scope.$on('ddDatepicker:sync', function (event, args) {
                    scope.boostrapDateModel = args.model;
                });

                input.on('blur', function () {
                    scope.$apply(updateDisplay);
                });

                function parseUserInput() {
                    var parsedDate = datepickerParserService.parse(scope.displayModel, scope.dateFormat, scope.dateDisabled);
                    updateMainModel(parsedDate);
                    canUpdateDisplayModel = false;
                    updateBootstrapDateModel(ctrl.$modelValue);
                }

                function open($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    scope.opened = true;
                }

                function init() {
                    ctrl.$modelValue = angular.copy(scope.ngModel);
                    updateBootstrapDateModel(ctrl.$modelValue);
                }

                function updateBootstrapDateModel(date) {
                    scope.boostrapDateModel = angular.copy(date);
                }

                function updateDisplay() {
                    updateDisplayModel(ctrl.$modelValue);
                    canUpdateDisplayModel = true;
                }

                function updateDisplayModel(date) {
                    scope.displayModel = date ? dateFilter(date, scope.dateFormat) : null;
                }

                function updateMainModel(date) {
                    canExecuteNgModelChanges = false;
                    ctrl.$setViewValue(date);
                    ctrl.$render();
                    applyNgChange();
                    $timeout(function () {
                        canExecuteNgModelChanges = true;
                    }, 500);
                }

                function applyNgChange() {
                    if (scope.ngChange) {
                        $timeout(function () {
                            scope.ngChange();
                        });
                    }
                }

                function updateDayLabel() {
                    if (scope.showDayName) {
                        scope.dayName = getDayLabel();
                    }
                }

                function getDayLabel() {
                    if (!ctrl.$modelValue) {
                        return null;
                    }
                    return days[ctrl.$modelValue.getDay()];
                }
            }
        };

        return directive;
    }

    datepickerParserService.$inject = ['uibDateParser'];
    function datepickerParserService(uibDateParser) {
        var self = this;

        var mmDdPattern = /^(0?[1-9]|1[012])[-\/\s]?(0?[1-9]|[12][0-9]|3[01])$/,
            mmDdFormatPattern = /(MM)[-\/\s](dd)/,
            datePartsPattern = /(..)[-\/\s]?(..)/;

        self.parse = parse;

        function parse(input, format, dateDisabled) {
            var parsedDate = parseInternal(input, format);
            if (dateDisabled) {
                return validateWithDisabledDate(parsedDate, dateDisabled);
            }
            return parsedDate;
        }
    
        //private
    
        function parseInternal(input, format) {
            var useMmDdPattern = mmDdFormatPattern.test(format);

            if (!useMmDdPattern) {
                input = reversToMmDdFormat(input);
            }

            if (mmDdPattern.test(input)) {
                return buildNewDate(input);
            }

            return uibDateParser.parse(input, format);
        }

        function validateWithDisabledDate(parsedDate, dateDisabled) {
            var disabled = dateDisabled({ date: parsedDate, mode: 'day' });
            if (disabled) {
                return null;
            }
            return parsedDate;
        }

        function buildNewDate(input) {
            var tokens = tokenize(input),
                year = new Date().getFullYear(),
                month = parseInt(tokens[1], 10) - 1,
                day = parseInt(tokens[2], 10);

            return new Date(year, month, day);
        }

        function reversToMmDdFormat(input) {
            return input.replace(datePartsPattern, '$2-$1');
        }

        function tokenize(input) {
            return mmDdPattern.exec(input);
        }
    }

})();
angular.module('dd.ui.dd-datetimepicker', ['ui.bootstrap'])
    .directive('ddDatetimepicker', ['$timeout', 'dateFilter', function ($timeout, dateFilter) {
        return {
            restrict: 'EA',
            require: 'ngModel',
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || 'template/dd-datetimepicker/dd-datetimepicker.html';
            },
            scope: {
                ngModel: '=',
                minuteStep: '=?',
                showMeridian: '=?',
                ngDisabled: '=?',
                ngRequired: '=?',
                dateDisabled: '&',
                ngChange: '&?',
                dateFormat: '@',
                showDayName: '=?',
                allowForwardDateAdjustment: '=?'
            },
            link: function (scope, element, attrs, ctrl) {

                var timeChanged = false;
                var timepickerElement = element.find('.timepicker-container input');
                var canExecuteNgModelChanges = true;

                scope.time = null;
                scope.date = null;
                scope.dateChange = dateChange;
                scope.timeChange = timeChange;

                init();
                
                scope.$watch('ngModel', function (value) {
                    if (canExecuteNgModelChanges){
                        init();
                    }
                });

                scope.$watch('date', function (newTime, oldTime) {
                    setValidity();
                });

                scope.$watch('time', function (newTime, oldTime) {
                    setValidity();
                });

                timepickerElement.on('blur', function () {
                    jumpToNextDayIfPossible();
                });

                function dateChange() {
                    updateMainModel();
                    applyNgChange();
                }

                function timeChange() {
                    timeChanged = true;
                    updateMainModel();
                    applyNgChange();
                }

                function updateMainModel() {
                    canExecuteNgModelChanges = false;
                    ensureDateTypes();
                    
                    var model = angular.copy(scope.date);
                    if (model) {
                        if (scope.time) {
                            model.setHours(scope.time.getHours(), scope.time.getMinutes(), 0, 0);
                        } else {
                            model.setHours(0, 0, 0, 0);
                        }
                    }
                    ctrl.$setViewValue(model);
                    ctrl.$render();
                    
                    $timeout(function () {
                        canExecuteNgModelChanges = true;
                    }, 500);
                }

                function init() {
                    ctrl.$modelValue = angular.copy(scope.ngModel);
                    scope.time = angular.copy(ctrl.$modelValue);
                    scope.date = angular.copy(ctrl.$modelValue);
                }

                function ensureDateTypes() {
                    if (scope.date && !(scope.date instanceof Date)) {
                        scope.date = new Date(scope.date);
                    }
                    if (scope.time && !(scope.time instanceof Date)) {
                        scope.time = new Date(scope.time);
                    }
                }

                function applyNgChange() {
                    if (scope.ngChange) {
                        $timeout(function () {
                            scope.ngChange();
                        });
                    }
                }

                function setValidity() {
                    if (scope.ngRequired && (!scope.time || !scope.date)) {
                        ctrl.$setValidity('required', false);
                    } else {
                        ctrl.$setValidity('required', true);
                    }
                }

                function jumpToNextDayIfPossible() {
                    if (!scope.date || !scope.time) {
                        return;
                    }

                    var currentDate = scope.date.getDate();
                    var canAddDay = canAddDayIfUserDecreaseTime();

                    if (canAddDay) {
                        scope.date.setDate(currentDate + 1);
                        updateMainModel();
                        syncDatepickerModel();
                        notifyWithDatepickerChange();
                        _addDayExecuted = canAddDay;
                    }
                }

                var _addDayExecuted = false;
                function canAddDayIfUserDecreaseTime() {
                    return scope.allowForwardDateAdjustment && !_addDayExecuted && timeChanged && ctrl.$modelValue.getTime() < new Date().getTime();
                }

                function notifyWithDatepickerChange() {
                    var datepickerElement = element.find('.datepicker-container .display-input');
                    datepickerElement.css('background-color', 'rgba(0, 128, 0, 0.15)');
                    $timeout(function () {
                        datepickerElement.css('background-color', '');
                    }, 500);
                }

                function syncDatepickerModel(element) {
                    scope.$broadcast('ddDatepicker:sync', { model: ctrl.$modelValue });
                }

            }
        };
    }]);
(function () {
    'use strict';

    angular.module('dd.ui.dd-timepicker', [])
        .directive('ddTimepicker', TimepickerDirective)
        .service('timeparserService', timeparserService);

    var KEY_ENTER = 13, KEY_UP = 38, KEY_DOWN = 40;

    TimepickerDirective.$inject = ['dateFilter', 'timeparserService'];
    function TimepickerDirective(dateFilter, timeparserService) {

        var directive = {
            restrict: 'A',
            require: 'ngModel',
            replace: true,
            scope: {
                ngModel: '=',
                minuteStep: '=?',
                isDateType: '=?'
            },
            link: function (scope, element, attrs, ctrl) {

                var dateTime = scope.isDateType && scope.ngModel instanceof Date ? scope.ngModel : new Date();
                scope.minuteStep = scope.minuteStep || 1;

                ctrl.$viewChangeListeners.push(function () {
                    scope.$eval(attrs.ngChange);
                });
            
                //(view to model)
                ctrl.$parsers.push(function (value) {
                    return timeparserService.toModel(value, scope.isDateType, dateTime);
                });
            
                //(model to view)
                ctrl.$formatters.push(function (value) {
                    return timeparserService.toView(value);
                });

                element.on('keydown keypress', function (event) {
                    if (event.which === KEY_ENTER && !ctrl.$modelValue) {
                        updateViewValue(timeparserService.getFormattedTime());
                        event.preventDefault();
                    } else if (event.which === KEY_UP) {
                        updateViewValue(timeparserService.changeTime(scope.ngModel, scope.minuteStep));
                        event.preventDefault();
                    } else if (event.which === KEY_DOWN) {
                        updateViewValue(timeparserService.changeTime(scope.ngModel, -scope.minuteStep));
                        event.preventDefault();
                    }
                });

                element.on('blur', function toModelTime() {
                    updateViewValue(timeparserService.toView(scope.ngModel));
                });

                function updateViewValue(value) {
                    ctrl.$setViewValue(value);
                    ctrl.$render();
                }
            }
        };

        return directive;

    }

    timeparserService.$inject = ['dateFilter'];
    function timeparserService(dateFilter) {
        var self = this;

        var amPmPattern = /^(\d+)(a|p)$/,
            normalTimePattern = /^([0-9]|0[0-9]|1[0-9]|2[0-3])[.:][0-5][0-9]$/,
            digitsPattern = /^[0-9]+$/;

        self.toModel = toModel;
        self.toView = toView;
        self.changeTime = changeTime;
        self.getFormattedTime = getFormattedTime;

        function toModel(input, isDateModel, dateTime) {

            var parsedTime = null;

            if (!input) {
                return null;
            }

            if (normalTimePattern.test(input)) {
                parsedTime = parseNormalTime(input);
                return parsedTimeToModel(parsedTime, isDateModel, dateTime);
            }

            input = prepareInput(input);

            if (amPmPattern.test(input)) {
                parsedTime = parseAmPmTime(input, amPmPattern);
                return parsedTimeToModel(parsedTime, isDateModel, dateTime);
            }

            if (digitsPattern.test(input)) {
                parsedTime = parseDigitsTime(input, digitsPattern);
                return parsedTimeToModel(parsedTime, isDateModel, dateTime);
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

            var date = new Date();
            date.setHours(timeInfo.hours);
            date.setMinutes(timeInfo.minutes + delta);

            return dateFilter(date, 'HH:mm');
        }

        function getFormattedTime(dateInstance) {
            var date = dateInstance || new Date();
            return dateFilter(date, 'HH:mm');
        }
    
        //private
    
        function parsedTimeToModel(parsedTime, isDateModel, dateTime) {

            if (!parsedTime) {
                return null;
            }

            if (isDateModel) {
                var tokens = parsedTime.split(':');
                dateTime.setHours(parseInt(tokens[0], 10));
                dateTime.setMinutes(parseInt(tokens[1], 10));
                return new Date(dateTime);
            }

            return parsedTime;
        }

        function parseAmPmTime(input, pattern) {
            var tokens = tokenize(input, pattern),
                timeInfo = getTimeInfoFromString(tokens[1], tokens[2]);

            return validateParsedTime(timeInfoToString(timeInfo));
        }

        function parseDigitsTime(input) {
            var timeInfo = getTimeInfoFromString(input, null);
            return validateParsedTime(timeInfoToString(timeInfo));
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

            var val = parseInt(inputTime, 10),
                hours = 0,
                minutes = 0;
        
            //user enter only minutes (mm)
            if (inputTime[0] === '0') {
                minutes = parseInt(inputTime, 10);
            }
            //user enter only hour (H)
            else if (val <= 24 && inputTime.length <= 2) {
                hours = val;
            }
            // user enter hour and minutes (H:mm)
            else if (val > 24 && val <= 999) {
                hours = parseInt(inputTime[0], 10);
                minutes = parseInt(inputTime.substr(1, 3), 10);
            }
            // user enter hours and minutes (HH:mm)
            else if (val > 24 && val <= 9999) {
                hours = parseInt(inputTime.substr(0, 2), 10);
                minutes = parseInt(inputTime.substr(2, 4), 10);
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
            if (input instanceof Date) {
                input = dateFilter(input, 'HH:mm');
            }
            if (!input) {
                input = '00:00';
            }
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

})();
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
        }
        
        ctrl.$setValidity('sameAs', false);
        return undefined;
      }
    },
    scope: {
      sameAs: '='
    }
  };
});

angular.module('dd.ui.validation', ['dd.ui.validation.phone', 'dd.ui.validation.sameAs']);
angular.module('dd.ui.busy-element').run(function() {!angular.$$csp().noInlineStyle && angular.element(document).find('head').prepend('<style type="text/css">.be-container{position:absolute;z-index:1;}.be-overlay{background-color:rgba(255,255,255,0.7);text-align:center;}.be-overlay.success{background-color:rgba(0,128,0,0.15);}.be-overlay.fail{background-color:rgba(128,0,0,0.15);}.be-animate{-webkit-transition:opacity 0.5s;transition:opacity 0.5s;opacity:1;}.be-animate.ng-hide-add,.be-animate.ng-hide-remove{display:block !important;}.be-animate.ng-hide{opacity:0;}</style>'); });
angular.module('dd.ui.dd-datepicker').run(function() {!angular.$$csp().noInlineStyle && angular.element(document).find('head').prepend('<style type="text/css"> .dd-datepicker .calendar-btn-with-day{border-radius:0;border-left:0;}.dd-datepicker .day-name-label{width:100px;}.dd-datepicker input.short{width:70px;}.dd-datepicker input{width:105px;}</style>'); });
angular.module('dd.ui.dd-datetimepicker').run(function() {!angular.$$csp().noInlineStyle && angular.element(document).find('head').prepend('<style type="text/css">.dd-datetimepicker{display:inline-flex;}.dd-datetimepicker .timepicker-container{width:100px !important;}.dd-datetimepicker .timepicker-container input{border-bottom-right-radius:0;border-top-right-radius:0;border-right:0;}.dd-datetimepicker .datepicker-container input.short{width:70px !important;}.dd-datetimepicker .datepicker-container input{width:105px !important;border-bottom-left-radius:0;border-top-left-radius:0;}</style>'); });
angular.module('dd.ui.lookup').run(function() {!angular.$$csp().noInlineStyle && angular.element(document).find('head').prepend('<style type="text/css">.lookup-container .input-group{width:100%;}.lookup-container .dropdown-menu{border:1px solid #ccc !important;border-top:none !important;font-size:11px;padding:1px !important;max-height:196px;overflow-y:scroll;overflow-x:hidden;width:100%;}.lookup-container input{background-color:#ffe;}.lookup-container .dropdown-menu > li > a{padding:5px;}.lookup-container .lookup-legend div,.lookup-clear div{width:16px;height:16px;display:inline-block;vertical-align:middle;}.lookup-container a.lookup-clear{outline:0}.lookup-container .lookup-no-results{position:absolute;background-color:#fff;z-index:1;padding:4px;width:100%;border:1px solid #ddd;margin-top:1px;top:100%;}.lookup-container .lookup-no-results span{color:#a94442;font-size:10px;}.lookup-container .lookup-legend .lookup-icon{background-image:url(./assets/img/magnifier-small.png);}.lookup-container .lookup-legend .spinner-icon{background-image:url(./assets/img/spinner.gif);background-size:16px;}.lookup-container .lookup-clear .clear-icon{background-image:url(./assets/img/cross-small-white.png);opacity:0.6;}.lookup-container .lookup-legend{position:absolute;right:6px;top:6px;z-index:5;}.lookup-container .lookup-clear{position:absolute;right:22px;top:6px;z-index:5;}</style>'); });