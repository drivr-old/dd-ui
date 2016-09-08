/*
 * dd-ui
 * http://clickataxi.github.io/dd-ui/

 * Version: 0.7.9 - 2016-08-18
 * License: MIT
 */angular.module("dd.ui", ["dd.ui.arrow-key-nav","dd.ui.busy-element","dd.ui.conversion","dd.ui.datetimepicker","dd.ui.dd-datepicker","dd.ui.dd-datetimepicker","dd.ui.dd-timepicker","dd.ui.form-actions","dd.ui.form-validation","dd.ui.lookup","dd.ui.validation.phone","dd.ui.validation.sameAs","dd.ui.validation"]);
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
                       !jElement.is(':hidden');
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
// copy-paste from https://gist.github.com/letanure/4a81adfbda16b52d25ed
(function () {
    'use strict';

    angular.module('dd.ui.conversion', [])
        .filter('localizedDistance', ['conversionService', function (conversionService) {
            return function (distance, unit, precision) {
                if (unit === 'm') {
                    if (conversionService.isMetric()) {
                        return distance + ' m';
                    }

                    return conversionService.convert(distance, 'm', 'yd', precision) + ' yd';
                }

                if (unit === 'km') {
                    if (conversionService.isMetric()) {
                        return distance + ' km';
                    }

                    return conversionService.convert(distance, 'km', 'mi', precision) + ' mi';
                }

                throw new Error('Unit ' + unit + ' conversion not supported');
            };
        }])
        .service('conversionService', [function () {
            var self = this;
            var unitSystem = 'metric';

            var units = ['km', 'm', 'cm', 'mm', 'nm', 'mi', 'yd', 'ft', 'in'];
            var factors = [1, 1000, 100000, 1000000, 1000000000000, 0.621371192237334, 1093.6132983377078745, 3280.8398950131236234, 39370.078740157485299];

            var conversionKey = {};

            initDistanceMap();

            self.setUnitSystem = function (value) {
                unitSystem = value;
            };

            self.isMetric = function () {
                return unitSystem === 'metric';
            };

            self.convert = function (distance, from, to, precision) {

                var result = distance * conversionKey[from][to];

                if (angular.isDefined(precision)) {
                    return parseFloat(result.toFixed(precision));
                }

                return result;
            };

            function initDistanceMap() {
                for (var k = 0; k < units.length; k++) {
                    conversionKey[units[k]] = {};
                }

                for (var i = 0; i < units.length; i++) {
                    for (var j = i; j < units.length; j++) {
                        var convFactor;

                        if (i === 0) {
                            convFactor = factors[j];
                        } else if (units[i] === units[j]) {
                            convFactor = 1;
                        } else {
                            convFactor = conversionKey[units[i]][units[0]] * conversionKey[units[0]][units[j]];
                        }

                        conversionKey[units[i]][units[j]] = convFactor;
                        conversionKey[units[j]][units[i]] = 1 / convFactor;
                    }
                }
            }
        }]);
})();
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
			dateDisabled: '&',
			popupPlacement: '@?'
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
        .service('datepickerParserService', datepickerParserService)
        .provider('datepickerConfig', datepickerConfigProvider);

    var KEY_ENTER = 13, KEY_UP = 38, KEY_DOWN = 40;

    DatepickerDirective.$inject = ['$timeout', 'dateFilter', 'datepickerParserService', 'days', 'datepickerConfig'];
    function DatepickerDirective($timeout, dateFilter, datepickerParserService, days, datepickerConfig) {

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
                ngRequired: '=?',
                dateDisabled: '&',
                showDayName: '=?',
                placeholder: '@?',
                popupPlacement: '@?'
            },
            link: function (scope, element, attrs, ctrl) {

                var input = angular.element(element.find('.display-input'));
                var canUpdateDisplayModel = true;
                var canExecuteNgModelChanges = true;

                scope.dayName = null;
                scope.dateFormat = attrs.dateFormat || datepickerConfig.dateFormat;
                scope.dateOptions = attrs.dateOptions || angular.copy(datepickerConfig.dateOptions);
                scope.useShortDateFormat = scope.dateFormat.length < 6;

                scope.dateOptions.dateDisabled = scope.dateDisabled;

                scope.calendarOpened = false;
                scope.openCalendar = openCalendar;
                scope.name = attrs.name;

                ctrl.$formatters.push(function (value) {
                    init(value);
                    return value;
                });

                scope.$watch('calendarOpened', function (newValue, oldValue) {
                    if (!newValue && oldValue) {
                        onCalendarClosed();
                        input.focus();
                    }
                });

                scope.$on('ddDatepicker:sync', function (event, args) {
                    scope.ngModel = args.model;
                });

                scope.$on('ddDatepicker:setDate', function (event, args) {
                    var validatedDate = datepickerParserService.validateWithDisabledDate(args.date, scope.dateDisabled);
                    setDate(validatedDate);
                    $timeout(updateDisplayModel, 0);
                });

                input.on('blur', function () {
                    if (isDateChanged()) {
                        parseUserInput();
                        updateDisplayModel();
                    }
                });

                input.on('keydown keypress', function (event) {
                    if (event.altKey) {
                        return;
                    } else if (event.which === KEY_ENTER && !scope.displayModel) {
                        changeDate(0);
                        event.preventDefault();
                    } else if (event.which === KEY_UP) {
                        changeDate(1);
                        event.preventDefault();
                    } else if (event.which === KEY_DOWN) {
                        changeDate(-1);
                        event.preventDefault();
                    }
                });

                function init(model) {
                    ctrl.$modelValue = model;
                    updateDisplayModel();
                    updateDayLabel();
                    syncBootstrapDateModel();
                }

                function isDateChanged() {
                    var inputVal = input.val();
                    if (!scope.ngModel && !inputVal) {
                        return false;
                    }

                    if (scope.ngModel && inputVal && dateFilter(scope.ngModel, scope.dateFormat) === inputVal) {
                        return false;
                    }

                    return true;
                }

                function onCalendarClosed() {
                    if (scope.bootstrapDateModel) {
                        var validatedDate = datepickerParserService.validateWithDisabledDate(scope.bootstrapDateModel, scope.dateDisabled);
                        updateMainModel(validatedDate);
                        if (canUpdateDisplayModel) {
                            updateDisplayModel(validatedDate);
                        }
                        syncBootstrapDateModel();
                    } else {
                        updateMainModel(null);
                        updateDisplayModel(null);
                    }
                }

                function parseUserInput() {
                    var parsedDate = datepickerParserService.parse(scope.displayModel, scope.dateFormat, scope.dateDisabled, ctrl.$modelValue);
                    setDate(parsedDate);
                }

                function changeDate(delta) {
                    var parsedDate = scope.displayModel ? datepickerParserService.parse(scope.displayModel, scope.dateFormat, scope.dateDisabled, ctrl.$modelValue) : new Date();
                    datepickerParserService.changeDate(parsedDate, delta);
                    var validatedDate = datepickerParserService.validateWithDisabledDate(parsedDate, scope.dateDisabled);
                    setDate(validatedDate);
                    $timeout(updateDisplayModel, 0);
                }

                function setDate(date) {
                    // chek if date is 'indvalid date' and make it null for consistency
                    if (!angular.isUndefined(date) && date !== null && isNaN(date.getDate())) {
                        date = null;
                    }

                    updateMainModel(date);
                    syncBootstrapDateModel();
                }

                function openCalendar($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    scope.calendarOpened = true;
                }

                function syncBootstrapDateModel() {
                    scope.bootstrapDateModel = angular.copy(ctrl.$modelValue);
                }

                function updateDisplayModel() {
                    canUpdateDisplayModel = true;
                    scope.displayModel = ctrl.$modelValue ? dateFilter(ctrl.$modelValue, scope.dateFormat) : null;
                }

                function updateMainModel(date) {
                    canExecuteNgModelChanges = false;
                    ctrl.$setViewValue(date);
                    ctrl.$render();
                    updateDayLabel();
                    $timeout(function () {
                        canExecuteNgModelChanges = true;
                    }, 100);
                }

                function updateDayLabel() {
                    if (scope.showDayName) {
                        if (!ctrl.$modelValue) {
                            scope.dayName = null;
                        } else {
                            scope.dayName = days[ctrl.$modelValue.getDay()];
                        }
                    }
                }
            }
        };

        return directive;
    }

    datepickerParserService.$inject = ['uibDateParser'];
    function datepickerParserService(uibDateParser) {
        var self = this;

        var mmDdPattern = /^(0?[1-9]|1[012])[-\/\s.]?(0?[1-9]|[12][0-9]|3[01])$/,
            mmDdFormatPattern = /(MM?)[-\/\s.](dd?)/,
            datePartsPattern = /^(\d\d?)[-\/\s.]?(\d\d?)$/;

        self.parse = parse;
        self.changeDate = changeDate;
        self.validateWithDisabledDate = validateWithDisabledDate;

        function parse(input, format, dateDisabled, time) {
            var parsedDate = parseInternal(input, format);

            if (!parsedDate) {
                return null;
            }
            if (dateDisabled) {
                parsedDate = validateWithDisabledDate(parsedDate, dateDisabled);
            }

            if (time && parsedDate) {
                parsedDate.setHours(time.getHours(), time.getMinutes(), 0, 0);
            }

            return parsedDate || null;
        }

        function changeDate(currentDate, delta) {
            if (!currentDate) {
                return;
            }

            var day = currentDate.getDate() + delta;
            currentDate.setDate(day);
        }

        function validateWithDisabledDate(parsedDate, dateDisabled) {
            var disabled = dateDisabled({ date: parsedDate, mode: 'day' });
            if (disabled) {
                return null;
            }

            return parsedDate;
        }

        // private

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

    function datepickerConfigProvider() {
        var config = {
            dateFormat: 'yyyy-MM-dd',
            dateOptions: {
                startingDay: 1
            }
        };

        this.setDateFormat = function (value) {
            config.dateFormat = value;
        };

        this.setDateOptions = function (dateOptions) {
            config.dateOptions = dateOptions;
        };

        this.$get = function () {
            return config;
        };
    }

})();
angular.module('dd.ui.dd-datetimepicker', ['ui.bootstrap'])
    .directive('ddDatetimepicker', ['$timeout', function ($timeout) {
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
                ngRequired: '=?',
                ngDisabled: '=?',                
                datepickerDisabled: '=?',
                dateDisabled: '&',                
                dateFormat: '@',
                showDayName: '=?',
                allowForwardDateAdjustment: '=?',
                datePlaceholder: '@?',
                timePlaceholder: '@?',
                popupPlacement: '@?'
            },
            link: function (scope, element, attrs, ctrl) {

                var timeChanged = false;
                var timepickerBlurEventFired = false;

                scope.time = null;
                scope.date = null;
                scope.name = attrs.name;
                
                ctrl.$formatters.push(function(value) {
                    init(value);
                    return value;
                });

                scope.$watch('date', function (newTime, oldTime) {
                    if (scope.ngModel !== newTime) {
                        updateMainModel();
                        setValidity();
                    }
                });

                scope.$watch('time', function (newTime, oldTime) {

                    if (scope.ngModel !== newTime) {
                        timeChanged = true;
                        
                        updateMainModel();
                        setValidity();
                        adjustDate(newTime, oldTime);

                        timepickerBlurEventFired = false;
                    }
                });

                scope.onTimeBlur = function () {
                    timepickerBlurEventFired = true;
                };

                function updateMainModel() {
                    
                    ensureDateTypes();
                    var model = angular.copy(scope.date);
                    if (model && scope.time) {
                        model.setHours(scope.time.getHours(), scope.time.getMinutes(), 0, 0);
                    }

                    ctrl.$setViewValue(model);
                }

                function init(model) {
                    ctrl.$modelValue = model;
                    scope.time = ctrl.$modelValue;
                    scope.date = ctrl.$modelValue;
                }

                function ensureDateTypes() {
                    if (scope.date && !(scope.date instanceof Date)) {
                        scope.date = new Date(scope.date);
                    }
                    if (scope.time && !(scope.time instanceof Date)) {
                        scope.time = new Date(scope.time);
                    }
                }

                function setValidity() {
                    if (scope.ngRequired && (!scope.time || !scope.date)) {
                        ctrl.$setValidity('required', false);
                    } else {
                        ctrl.$setValidity('required', true);
                    }
                }

                function adjustDate(newTime, oldTime) {
                    if (!newTime || !oldTime || !scope.ngModel || timepickerBlurEventFired) {
                        return;
                    }

                    newTime = new Date(newTime);
                    oldTime = new Date(oldTime);

                    var hoursDelta = newTime.getHours() - oldTime.getHours();

                    if (hoursDelta === -23) {
                        adjustDateByDay(1);
                    } else if (hoursDelta === 23) {
                        adjustDateByDay(-1);
                    }
                }

                function adjustDateByDay(delta) {
                    var dateToSet = new Date(scope.ngModel.getTime());
                    var day = dateToSet.getDate() + delta;
                    dateToSet.setDate(day);

                    scope.$broadcast('ddDatepicker:setDate', { date: dateToSet });

                    notifyAboutDatepickerChange();
                }

                function notifyAboutDatepickerChange() {
                    var datepickerElement = element.find('.datepicker-container .display-input');
                    datepickerElement.css('background-color', 'rgba(0, 128, 0, 0.15)');
                    $timeout(function () {
                        datepickerElement.css('background-color', '');
                    }, 500);
                }

                function syncDatepickerModel() {
                    scope.$broadcast('ddDatepicker:sync', { model: ctrl.$modelValue });
                }

                function sameDay(d1, d2) {
                    return d1.getYear() === d2.getYear() &&
                        d1.getMonth() === d2.getMonth() &&
                        d1.getDate() === d2.getDate();
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
    
    TimepickerDirective.$inject = ['$timeout', 'timeparserService'];
    function TimepickerDirective($timeout, timeparserService) {

        var directive = {
            restrict: 'A',
            require: 'ngModel',
            replace: true,
            scope: {
                ngModel: '=',
                onChange: '&',
                minuteStep: '=?',
                isDateType: '=?'
            },
            link: function (scope, element, attrs, ctrl) {
                
                var dateTime = scope.isDateType && scope.ngModel instanceof Date ? scope.ngModel : new Date();
                var canUpdateNgModel = false;
                var lastActionFromArrowKey = false;

                scope.minuteStep = scope.minuteStep || 1;

                ctrl.$parsers.push(function (value) {
                    value = canUpdateNgModel ? timeparserService.toModel(value, scope.isDateType, dateTime) : scope.ngModel;
                    canUpdateNgModel = false;
                    return value || null;
                });

                ctrl.$formatters.push(function (value) {
                    canUpdateNgModel = false;
                    return timeparserService.toView(value);
                });

                element.on('keydown keypress', function (event) {
                    if (event.altKey) {
                        return;
                    } else if (event.which === KEY_ENTER && !ctrl.$viewValue) {
                        updateModelOnKeypress(event, 0, timeparserService.getFormattedTime());
                    } else if (event.which === KEY_UP) {
                        updateModelOnKeypress(event, scope.minuteStep);
                    } else if (event.which === KEY_DOWN) {
                        updateModelOnKeypress(event, -scope.minuteStep);
                    }
                });

                element.on('blur', function toModelTime() {
                    if (isValueChanged()) {
                        canUpdateNgModel = true;
                        scope.ngModel = timeparserService.toModel(ctrl.$viewValue, scope.isDateType, dateTime);
                        updateViewValue(timeparserService.toView(scope.ngModel));
                        applyOnChange();
                    }

                    if (lastActionFromArrowKey) {
                        lastActionFromArrowKey = false;
                        applyOnChange();
                    }
                });

                function updateViewValue(value) {
                    ctrl.$setViewValue(value);
                    ctrl.$render();
                }

                function updateModelOnKeypress(event, delta, customDate) {
                    canUpdateNgModel = lastActionFromArrowKey = true;
                    updateViewValue(customDate || timeparserService.changeTime(scope.ngModel, delta));
                    event.preventDefault();
                }

                function isValueChanged() {
                    return ctrl.$viewValue !== timeparserService.toView(scope.ngModel);
                }
                
                function applyOnChange() {
                    if (scope.onChange) {
                        $timeout(scope.onChange);
                    }
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

            inputTime = inputTime.replace(/^0/, '');

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

            if (mode === 'p' && hours !== 12) {
                hours += 12;
            } else if (mode === 'a' && hours === 12) {
                hours = 0;
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

        function timePartToString(part) {
            return part < 10 ? '0' + part : part.toString();
        }

        function timeInfoToString(timeInfo) {
            return timePartToString(timeInfo.hours) + ':' + timePartToString(timeInfo.minutes);
        }
    }

})();
(function () {
    'use strict';

    angular
        .module('dd.ui.form-actions', [])
        .directive('formActions', formActions);

    function formActions() {
        return {
            require: '^form',
            transclude: true,
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || 'template/form-actions/form-actions.html';
            },
            link: function link(scope, element, attrs, formCtrl) {
                scope.form = formCtrl;

                if (attrs.absolute) {
                    var actionBar = element[0].querySelector('.form-actions-bar');
                    actionBar.style.position = 'absolute';
                }

                if (attrs.parentContainer) {
                    var container = angular.element(document.querySelector(attrs.parentContainer));
                    scope.$watch('form.$dirty', function (newValue) {
                        if (newValue) {
                            container.addClass('form-actions-visible');
                        } else {
                            container.removeClass('form-actions-visible');
                        }
                    });
                }
            },
            restrict: 'E'
        };
    }
})();
(function () {
    'use strict';

    angular
        .module('dd.ui.form-validation', [])
        .directive('showErrors', showErrors)
        .service('formValidationService', formValidationService);


    showErrors.$inject = ['$timeout'];

    function showErrors($timeout) {
        var linkFn = function (scope, el, attrs, formCtrl) {
            var blurred, inputNgEl, ngModelElement, ngModelCtrl;

            $timeout(function () {

                if (attrs.custom) {
                    initCustomWatches();
                } else {
                    initInputElementWatches();
                }

                function toggleClasses(invalid) {
                    el.toggleClass('has-error', invalid);
                }

                function initInputElementWatches() {
                    blurred = false;
                    inputNgEl = angular.element(findInputElement(el[0]));
                    ngModelElement = angular.element(el[0].querySelector('[ng-model][name]'));
                    ngModelCtrl = ngModelElement ? ngModelElement.controller('ngModel') : null;

                    if (!ngModelCtrl) {
                        throw new Error('show-errors input control element should have [ng-model] and [name]');
                    }

                    if (inputNgEl) {
                        inputNgEl.bind('blur', function () {
                            blurred = true;
                            return toggleClasses(ngModelCtrl.$invalid);
                        });
                    }

                    scope.$watch(function () {
                        return ngModelCtrl && ngModelCtrl.$invalid;
                    }, function (invalid) {
                        if (!blurred) {
                            return;
                        }
                        return toggleClasses(invalid);
                    });

                    scope.$on(formCtrl.$name + '-show-errors-check-validity', function () {
                        return toggleClasses(ngModelCtrl.$invalid);
                    });

                    scope.$on(formCtrl.$name + '-show-errors-reset', function () {
                        return $timeout(function () {
                            el.removeClass('has-error');
                            return blurred = false;
                        }, 0, false);
                    });
                }

                function initCustomWatches() {
                    scope.$watch(function () {
                        return attrs.showErrors;
                    }, function (options) {
                        if (angular.isDefined(options)) {
                            var invalid = scope.$eval(options);
                            return toggleClasses(invalid);
                        }
                    });
                }

                function findInputElement(group) {
                    return group.querySelector('input, textarea, select');
                }
            });
        };

        return {
            restrict: 'A',
            require: '^form',
            priority: -100,
            compile: function (elem, attrs) {
                if (!elem.hasClass('form-fields-group')) {
                    elem.addClass('form-fields-group');
                }
                return linkFn;
            }
        };
    }

    formValidationService.$inject = ['$rootScope'];
    function formValidationService($rootScope) {
        this.showErrors = function (formName) {
            $rootScope.$broadcast(formName + '-show-errors-check-validity');
        };

        this.hideErrors = function (formName) {
            $rootScope.$broadcast(formName + '-show-errors-reset');
        };
    }

})();
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
            var typeaheadNgModelCtrl = typeaheadInput.controller('ngModel');
            
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

            $scope.placeholder = attrs.placeholder;
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
                if($scope.url) {
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
                for(var group in grouped) {
                    if ({}.hasOwnProperty.call(grouped, group)) {
                        result = result.concat(grouped[group]);
                    }                    
                }
                return result;
            }
            
            function getHttpItems(query) {
                var requestParams = $scope.lookupParams || {};
                requestParams.query = query;
                
                if(angular.isUndefined(requestParams.limit)){
                    requestParams.limit = 10;
                }
                
                return $http({ method: 'GET', url: $scope.url, params: requestParams });                    
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
angular.module('dd.ui.dd-datepicker').run(function() {!angular.$$csp().noInlineStyle && angular.element(document).find('head').prepend('<style type="text/css"> .dd-datepicker .calendar-btn-with-day{border-radius:0;border-left:0;}.dd-datepicker .day-name-label{width:90px !important;font-size:12px;}.dd-datepicker input.short{width:70px;}.dd-datepicker input{width:105px;}</style>'); });
angular.module('dd.ui.dd-datetimepicker').run(function() {!angular.$$csp().noInlineStyle && angular.element(document).find('head').prepend('<style type="text/css">.dd-datetimepicker{display:inline-flex;}.dd-datetimepicker .timepicker-container{width:100px !important;}.dd-datetimepicker .timepicker-container input{border-bottom-right-radius:0;border-top-right-radius:0;border-right:0;}.dd-datetimepicker .datepicker-container input.short{width:70px !important;}.dd-datetimepicker .datepicker-container input{width:105px !important;border-bottom-left-radius:0;border-top-left-radius:0;}.has-error .dd-datetimepicker .calendar-btn-with-day{border-color:#a94442;}</style>'); });
angular.module('dd.ui.form-actions').run(function() {!angular.$$csp().noInlineStyle && angular.element(document).find('head').prepend('<style type="text/css">@keyframes formBarMoveIn{from{bottom:-100px;}to{bottom:0;}}@keyframes formBarMoveOut{from{bottom:0;}to{bottom:-100px;}}.form-actions-bar{position:fixed;left:0;bottom:0;background:#eee;border-top:1px solid #ddd;width:100%;padding:10px 5px;z-index:9999;animation:formBarMoveIn 0.3s ease-out;}.form-actions-bar.ng-hide{animation:formBarMoveOut 0.3s ease-out;}.form-actions-bar button{margin-right:10px;}</style>'); });
angular.module('dd.ui.form-validation').run(function() {!angular.$$csp().noInlineStyle && angular.element(document).find('head').prepend('<style type="text/css">.form-fields-group .field-error{display:none;margin-top:5px;margin-bottom:10px;color:#a94442}.form-fields-group.has-error .field-error{display:block;}</style>'); });
angular.module('dd.ui.lookup').run(function() {!angular.$$csp().noInlineStyle && angular.element(document).find('head').prepend('<style type="text/css">.lookup-container .input-group{width:100%;}.lookup-container .dropdown-menu{border:1px solid #ccc !important;border-top:none !important;font-size:11px;padding:1px !important;max-height:196px;overflow-y:scroll;overflow-x:hidden;width:100%;}.lookup-container input{background-color:#ffe;}.lookup-container .dropdown-menu > li > a{padding:5px;}.lookup-container .lookup-legend div,.lookup-clear div{width:16px;height:16px;display:inline-block;vertical-align:middle;}.lookup-container a.lookup-clear{outline:0}.lookup-container .lookup-no-results{position:absolute;background-color:#fff;z-index:100;padding:4px;width:100%;border:1px solid #ddd;margin-top:1px;top:100%;}.lookup-container .lookup-no-results span{color:#a94442;font-size:10px;}.lookup-container .lookup-legend .lookup-icon{background-image:url(./assets/img/magnifier-small.png);}.lookup-container .lookup-legend .spinner-icon{background-image:url(./assets/img/spinner.gif);background-size:16px;}.lookup-container .lookup-clear .clear-icon{background-image:url(./assets/img/cross-small-white.png);opacity:0.6;}.lookup-container .lookup-legend{position:absolute;right:6px;top:6px;z-index:5;}.lookup-container .lookup-clear{position:absolute;right:22px;top:6px;z-index:5;}.lookup-container .typeahead-group-header{font-weight:bold;padding:.2em .4em;}</style>'); });