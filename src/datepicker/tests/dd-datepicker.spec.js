describe('datetimepicker', function() {
	var $scope,
		$sniffer,
		$document,
		element;

	beforeEach(function() {
		module('dd.ui.datepicker');

		inject(function($rootScope, $compile, _$sniffer_, _$document_) {
			$scope = $rootScope.$new();
			$sniffer = _$sniffer_;
			$document = _$document_;

			element = $compile('<div dd-datepicker ng-model="date"></div>')($scope);
			element.appendTo($document[0].body);
			$scope.$digest();

		});
	});

	describe('Model change', function() {
		

		it('test1', function() {
			
            //changeInputValue(element, '2015-01-10');
            
			//expect(element.isolateScope()).toBe(0);
			//expect(element.isolateScope().time.getMinutes()).toBe(0);
		});
	});


	function changeInputValue(el, value) {
		el.val(value);
		el.trigger($sniffer.hasEvent('input') ? 'input' : 'change');
		$scope.$digest();
	}
});