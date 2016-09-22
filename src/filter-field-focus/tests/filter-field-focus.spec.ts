describe('Focus filter field directive tests', () => {
    var $scope: any,
        $timeout: ng.ITimeoutService,
        $compile: ng.ICompileService,
        $document: ng.IDocumentService,
        element: ng.IAugmentedJQuery;

    beforeEach(() => {
        angular.mock.module('dd.ui.filter-field-focus');

        // ReSharper disable InconsistentNaming
        inject((_$rootScope_, _$timeout_, _$compile_, _$document_) => {
            $scope = _$rootScope_.$new();
            $timeout = _$timeout_;
            $compile = _$compile_;
            $document = _$document_;
        });
        // ReSharper restore InconsistentNaming
    });

    afterEach(() => {
        $document.find('#focus-container').remove();
    });

    describe('Init', () => {
        it('should focus input if focus field is defined', () => {

            $scope.focusFieldName = 'name';
            var html = `<form filter-field-focus="{{focusFieldName}}">
                          <input id="name" type="text" ng-model="filter['name'].value" />
                        </form>`;

            initDirective(html);

            expect(element.find('input')[0] === document.activeElement).toBeTruthy();
        });

        it('should focus input if it is inside wrapper element', () => {

            $scope.focusFieldName = 'name';
            var html = `<form filter-field-focus="{{focusFieldName}}">
                          <div id="name"><input  type="text" ng-model="filter['name'].value" /></div>
                        </form>`;

            initDirective(html);

            expect(element.find('input')[0] === document.activeElement).toBeTruthy();
        });

        it('should focus select if it is inside wrapper element', () => {

            $scope.focusFieldName = 'name';
            var html = `<form filter-field-focus="{{focusFieldName}}">
                          <div id="name"><select ng-model="filter['name'].value"></select></div>
                        </form>`;

            initDirective(html);

            expect(element.find('select')[0] === document.activeElement).toBeTruthy();
        });

        it('should not focus input if focus field is not defined', () => {

            $scope.focusFieldName = undefined;
            var html = `<form filter-field-focus="{{focusFieldName}}">
                          <input id="name" type="text" ng-model="filter['name'].value" />
                        </form>`;

            initDirective(html);

            expect(element.find('input')[0] === document.activeElement).toBeFalsy();
        });
    });

    function initDirective(html: string) {
        element = $compile(`<div id="focus-container">${html}</div>`)($scope);
        element.appendTo($document[0]['body']);
        $scope.$digest();
    }
});