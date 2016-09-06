describe('datetimepicker', function() {
	var $scope,
		$sniffer,
		$document,
		element,
		datepickerElement,
		hourElement,
		minuteElement;

	beforeEach(function() {
		angular.mock.module('dd.ui.datetimepicker');
		angular.mock.module('template/datetimepicker/datetimepicker.html');

		inject(function($rootScope, $compile, _$sniffer_, _$document_) {
			$scope = $rootScope.$new();
			$sniffer = _$sniffer_;
			$document = _$document_;

			element = $compile('<div datetimepicker ng-change="change()" ng-model="dateTime"></div>')($scope);
			element.appendTo($document[0].body);
			$scope.$digest();

			datepickerElement = element.find('.datepicker-input');
			hourElement = element.find('[uib-timepicker] input:eq(0)');
			minuteElement = element.find('[uib-timepicker] input:eq(1)');
		});
	});

	describe('Model change', function() {
		it('initializes a default time value if it was never set.', function() {
			expect(element.isolateScope().time instanceof Date).toBeTruthy();
			expect(element.isolateScope().time.getHours()).toBe(0);
			expect(element.isolateScope().time.getMinutes()).toBe(0);
		});

		it('does not change the time value if model is empty and it is not the first change.', function() {
			$scope.dateTime = new Date('2015-08-30T16:00+00:00');
			$scope.$digest();

			var time = element.isolateScope().time;

			$scope.dateTime = '';
			$scope.$digest();

			expect(element.isolateScope().time).toEqual(time);
		});

		it('does nothing if timepicker element is active.', function() {
			hourElement[0].focus();

			$scope.$digest();

			$scope.dateTime = new Date('2015-08-30T16:00+00:00');
			$scope.$digest();

			expect(element.isolateScope().time.getHours()).toBe(0);
			expect(element.isolateScope().time.getMinutes()).toBe(0);
		});
	});

	describe('Date change', function() {
		it('keeps the time on model.', function() {
			changeInputValue(datepickerElement, '2015-08-30');
			changeInputValue(hourElement, '15');
			changeInputValue(minuteElement, '30');

			changeInputValue(datepickerElement, '2015-08-31');

			expect($scope.dateTime.getHours()).toEqual(15);
			expect($scope.dateTime.getMinutes()).toEqual(30);
		});

		it('notifies the controller via ng-change.', function() {
			var newDate = null;
			$scope.change = function() {
				newDate = $scope.dateTime;
			};

			var isoDate = '2015-08-31';
			changeInputValue(datepickerElement, isoDate);

			var expectedDate = new Date(isoDate);
			expectedDate.setHours(0, 0, 0, 0);
			expect(newDate).toEqual(expectedDate);
		});
	});

	describe('Time change', function() {
		it('merges date and time on model.', function() {
			$scope.dateTime = '2015-08-30T15:00:00+00:00';
			$scope.$digest();

			changeInputValue(minuteElement, '30');

			expect($scope.dateTime).toEqual(new Date('2015-08-30T15:30:00+00:00'));
		});

		it('notifies the controller via ng-change.', function() {
			var newDate = null;
			$scope.change = function() {
				newDate = $scope.dateTime;
			};

			changeInputValue(minuteElement, '30');

			expect(newDate.toISOString()).toContain(':30');
		});
	});

	describe('Open', function() {
		it('opens the datepicker and prevents further event propagation.', function() {
			var $event = jasmine.createSpyObj('$event', ['preventDefault', 'stopPropagation']);
			element.isolateScope().open($event);

			expect($event.preventDefault).toHaveBeenCalled();
			expect($event.stopPropagation).toHaveBeenCalled();
			expect(element.isolateScope().opened).toBeTruthy();
		});
	});

	describe('Init', function() {
		it('sets default values.', function() {
			expect(element.isolateScope().minuteStep).toBe(1);
			expect(element.isolateScope().showSpinners).toBeTruthy();
		});
	});

	function changeInputValue(el, value) {
		el.val(value);
		el.trigger($sniffer.hasEvent('input') ? 'input' : 'change');
		$scope.$digest();
	}
});