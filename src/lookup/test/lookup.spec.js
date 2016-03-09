describe('Lookup tests.', function () {
    var element,
        input,
        $scope,
        $compile,
        $document,
        $httpBackend,
        $sniffer,
        $timeout;

    beforeEach(function () {
        module('dd.ui.lookup');
        module('template/lookup/lookup.html');

        inject(function ($rootScope, _$compile_, _$document_, $templateCache, _$httpBackend_, _$sniffer_, _$timeout_) {
            $scope = $rootScope;
            $compile = _$compile_;
            $document = _$document_;
            $httpBackend = _$httpBackend_;
            $sniffer = _$sniffer_;
            $timeout = _$timeout_;

            initDirective('<div dd-lookup ng-model="model" url="\'/api/drivers/lookup\'" lookup-params="lookupParams"></div>');
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('Parameters', function() {
        it('are added to the request.', function () {
            $scope.lookupParams = {};

            $httpBackend.expectGET('/api/drivers/lookup?limit=10&query=ab').respond(200);
            lookup('ab');
            
            $httpBackend.expectGET('/api/drivers/lookup?driverId=123&limit=10&query=ac').respond(200);
            $scope.lookupParams.driverId = '123';
            lookup('ac');
        });
        
        it('limit is overriden by passed value.', function () {
            $scope.lookupParams = {};

            $httpBackend.expectGET('/api/drivers/lookup?limit=10&query=ab').respond(200);
            lookup('ab');
            
            $httpBackend.expectGET('/api/drivers/lookup?limit=100&query=ac').respond(200);
            $scope.lookupParams.limit = 100;
            lookup('ac');
        });
    });

    describe('Select item', function () {
        var items = [{ id: 1 }, { id: 2, name: 'item 2' }];

        it('sets the model value.', function () {
            $httpBackend.expectGET('/api/drivers/lookup?limit=10&query=ab').respond(200, items);
            lookup('ab');

            selectItem(1);
            var expectedModel = angular.copy(items[1]);
            expect($scope.model).toEqual(expectedModel);
        });

        it('notifies via lookup-on-select attribute.', function () {
            initDirective('<div dd-lookup ng-model="model" url="\'/api/drivers/lookup\'" lookup-on-select=\"onSelect()\"></div>');

            var selected = false;
            $scope.onSelect = function () { selected = true; };

            $httpBackend.expectGET('/api/drivers/lookup?limit=10&query=ab').respond(200, items);
            lookup('ab');
            selectItem(1);
            $timeout.flush();

            expect(selected).toBeTruthy();
        });
    });

    describe('Lookup format', function () {
        it('sets a custom label.', function() {
            $scope.formatLabel = function(item) { return item.name + ' - ' + item.externalReference; };
            initDirective('<div dd-lookup ng-model="model" url="\'/api/drivers/lookup\'" lookup-format="formatLabel($item)"></div>');
            
            var items = [{ id: 1, name: 'driver 1', externalReference: '123' }, { id: 2, name: 'driver 2', externalReference: '321' }];
            $httpBackend.expectGET('/api/drivers/lookup?limit=10&query=ab').respond(200, items);
            lookup('ab');

            expect(getItemLabel(0)).toEqual('driver 1 - 123');
            expect(getItemLabel(1)).toEqual('driver 2 - 321');

            selectItem(0);
            expect(input.val()).toEqual('driver 1 - 123');
        });
    });

    describe('Clear button', function () {
        it('resets the model and input.', function () {
            $scope.model = { id: 1, name: 'driver' };
            $scope.$digest();

            expect(input.val()).toEqual('driver');

            element.find('.lookup-clear').click();

            expect($scope.model).toBeNull();
            expect(input.val()).toEqual('');
        });
    });

    describe('Spinner', function() {
        it('is shown while items are loading.', function() {
            $httpBackend.expectGET('/api/drivers/lookup?limit=10&query=ab').respond(200, [{}]);
            lookup('ab', true);

            var legend = element.find('.lookup-legend div');

            expect($(legend[0]).hasClass('ng-hide')).toBeTruthy();
            expect($(legend[1]).hasClass('ng-hide')).toBeFalsy();

            $httpBackend.flush();

            expect($(legend[0]).hasClass('ng-hide')).toBeFalsy();
            expect($(legend[1]).hasClass('ng-hide')).toBeTruthy();
        });
    });

    describe('No results label', function () {
        var label;

        beforeEach(function() {
            label = element.find('.lookup-no-results');
        });

        it('is shown when no results are available.', function() {
            $httpBackend.expectGET('/api/drivers/lookup?limit=10&query=ab').respond(200);
            lookup('ab');
            
            expect(label.is(':visible')).toBeTruthy();

            $httpBackend.expectGET('/api/drivers/lookup?limit=10&query=abc').respond(200, [{ name: 'result 1' }]);
            lookup('abc');
            
            expect(label.is(':visible')).toBeFalsy();
        });

        it('is cleared when clear button is pressed.', function() {
            $httpBackend.expectGET('/api/drivers/lookup?limit=10&query=ab').respond(200);
            lookup('ab');

            element.find('.lookup-clear').click();

            expect(label.is(':visible')).toBeFalsy();
        });
    });

    describe('ngDisabled', function () {
        beforeEach(function() {
            initDirective('<div dd-lookup ng-model="model" url="\'/api/drivers/lookup\'" ng-disabled="disabled"></div>');
        });

        it('disables the input.', function() {
            expect(input.attr('disabled')).toBe(undefined);

            $scope.disabled = true;
            $scope.$digest();

            expect(input.attr('disabled')).toBe('disabled');

            $scope.disabled = false;
            $scope.$digest();

            expect(input.attr('disabled')).toBe(undefined);
        });

        it('disables the clear button.', function () {
            $scope.model = {};
            $scope.disabled = true;
            $scope.$digest();

            var clearButton = element.find('.lookup-clear');
            expect(clearButton.hasClass('disabled')).toBeTruthy();
            clearButton.click();
            expect($scope.model).not.toBeNull();

            $scope.disabled = false;
            $scope.$digest();
            expect(clearButton.hasClass('disabled')).toBeFalsy();
            clearButton.click();
            expect($scope.model).toBeNull();
        });
    });

    describe('Placeholder', function() {
        it('is added if specified.', function() {
            expect(input.attr('placeholder')).toEqual('');

            initDirective('<div dd-lookup ng-model="model" url="\'/api/drivers/lookup\'" placeholder="Look up a driver"></div>');

            expect(input.attr('placeholder')).toEqual('Look up a driver');
        });
    });

    describe('Html addon', function() {
        it('is prepended to the input group if specified.', function() {
            expect(element.find('.input-group .input-group-addon').length).toBe(0);

            initDirective('<div dd-lookup ng-model="model" url="\'/api/drivers/lookup\'" lookup-addon="<span>Addon</span>"></div>');

            var addon = element.find('.input-group .input-group-addon span');
            expect(addon.html()).toEqual('Addon');
        });

        it('pushes the no-results label to the right by addon width.', function() {
            var label = element.find('.lookup-no-results');
            expect(label.css('margin-left')).toEqual('0px');

            initDirective('<div dd-lookup ng-model="model" url="\'/api/drivers/lookup\'" lookup-addon="<span>Addon</span>"></div>');

            var addon = element.find('.input-group-addon');
            label = element.find('.lookup-no-results');
            expect(label.css('margin-left')).toEqual(addon.outerWidth() + 'px');
        });

        it('shortens the width of dropdown menu by addon width.', function() {
            $timeout.flush();

            var dropdown = element.find('.dropdown-menu');
            expect(dropdown.css('width')).toEqual('100%');
            
            initDirective('<div dd-lookup ng-model="model" url="\'/api/drivers/lookup\'" lookup-addon="<span>Addon</span>"></div>');
            $timeout.flush();

            var addon = element.find('.input-group-addon');
            dropdown = element.find('.dropdown-menu');
            expect(dropdown.attr('style')).toContain('width: calc(100% - ' + addon.outerWidth() + 'px)');
        });
    });

    describe('Lookup response transform', function() {
        it('allows custom API response format.', function() {
            $scope.responseTransformer = function(response) { return response.items; };
            initDirective('<div dd-lookup ng-model="model" url="\'/api/drivers/lookup\'" lookup-response-transform="responseTransformer($response)"></div>');
            
            var response = { items: [{ id: 1, name: 'driver 1', externalReference: '123' }, { id: 2, name: 'driver 2', externalReference: '321' }] };
            $httpBackend.expectGET('/api/drivers/lookup?limit=10&query=ab').respond(200, response);
            lookup('ab');

            selectItem(1);
            var expectedModel = angular.copy(response.items[1]);
            expect($scope.model).toEqual(expectedModel);
        });
    });
    
    function initDirective(html) {
        element = $compile(html)($scope);
        element.appendTo($document[0].body);
        $scope.$digest();
        input = element.find('input');
    }

    function lookup(value, manualFlush) {
        input.val(value);
        input.trigger($sniffer.hasEvent('input') ? 'input' : 'change');
        $scope.$digest();
        if (!manualFlush) {
            $httpBackend.flush();
        }
    }

    function selectItem(index) {
        element.find('ul.dropdown-menu li:eq(' + index + ')').click();
    }

    function getItemLabel(index) {
        return element.find('ul.dropdown-menu li:eq(' + index + ') a').text();
    }
});