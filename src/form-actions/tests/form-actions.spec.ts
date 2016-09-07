describe('Form actions bar tests.', function () {
    var $scope,
        $sniffer,
        $document,
        $timeout,
        $compile;

    beforeEach(function () {
        angular.mock.module('dd.ui.form-actions');
        angular.mock.module('template/form-actions/form-actions.html');

        inject(function ($rootScope, _$compile_, _$timeout_, _$sniffer_, _$document_) {
            $scope = $rootScope.$new();
            $sniffer = _$sniffer_;
            $timeout = _$timeout_;
            $document = _$document_;
            $compile = _$compile_;
        });
    });

    describe('Init', function () {
        it('compile and create form actions bar', function () {
            var element = $compile(angular.element('<form><form-actions></form-actions></form>'))($scope);
            $scope.$digest();
            expect(element.find('.form-actions-bar').length).toBe(1);
        });

        it('throw error if placed outside form', function () {
            var compile = $compile(angular.element('<form></form><form-actions></form-actions>'));
            $scope.$digest();
            expect(function() { return compile($scope); }).toThrowError();
        });
    });

    describe('Form action bar visibility', function () {
        it('show if form is dirty', function () {
            var element = $compile(angular.element('<form name="myForm"><input type="text" ng-model="name" /><form-actions></form-actions></form>'))($scope);
            $scope.$digest();

            var input = element.find('input');
            input.val('7');
            input.trigger('input');
            $scope.$digest();

            expect(element.find('.form-actions-bar').hasClass('ng-hide')).toBeFalsy();
        });

        it('hide if form is prestine', function () {
            var element = $compile(angular.element('<form name="myForm"><input type="text" ng-model="name" /><form-actions></form-actions></form>'))($scope);
            $scope.$digest();

            var input = element.find('input');
            input.val('7');
            input.trigger('input');
            $scope.myForm.$setPristine();
            $scope.$digest();

           expect(element.find('.form-actions-bar').hasClass('ng-hide')).toBeTruthy();
        });

        it('add class to parent container when form is dirty', function () {
            document.body.innerHTML += '<div class="container"></div>';
            var element = $compile(angular.element('<form name="myForm"><input type="text" ng-model="name" /><form-actions parent-container=".container"></form-actions></form>'))($scope);
            $scope.$digest();

            var input = element.find('input');
            input.val('7');
            input.trigger('input');
            $scope.$digest();

            expect(angular.element(document).find('.container').hasClass('form-actions-visible')).toBeTruthy();
        });
    });

    describe('Custom style', function () {
        it('set absolute position if abosulte attr is defined', function() {
            var element = $compile(angular.element('<form id="myForm"><form-actions absolute="true"></form-actions></form>'))($scope);
            $scope.$digest();
            expect(element.find('.form-actions-bar')[0].style.position).toBe('absolute');
        });
    });
});