describe('Directive show-errors tests.', function () {

    var element,
        $scope,
        $compile,
        $timeout;

    beforeEach(function () {
        module('dd.ui.form-validation');

        inject(function (_$compile_, _$rootScope_, _$timeout_) {
            $scope = _$rootScope_.$new();
            $compile = _$compile_;
            $timeout = _$timeout_;

        });
    });

    it('init element', function () {
        var element = initDirective($scope, $compile);
        expect(element).toBeDefined();
    });

    it('add has-error class if input is invalid', function () {

        $scope.input = null;
        var element = initDirective($scope, $compile);

        element.find('input').trigger('blur');

        expect(element.find('.form-group').hasClass('has-error')).toBeTruthy();
    });

    it('remove has-error class if input is become valid', function () {

        $scope.input = null;
        var element = initDirective($scope, $compile);

        element.find('input').trigger('blur');
        $scope.input = 'value';
        $scope.$digest();
        element.find('input').trigger('blur');

        expect(element.find('.form-group').hasClass('has-error')).toBeFalsy();
    });

    it('add has-error on event show-errors-check-validity', function () {

        $scope.input = null;
        var element = initDirective($scope, $compile);

        $scope.$broadcast('form-show-errors-check-validity');
        $scope.$digest();

        expect(element.find('.form-group').hasClass('has-error')).toBeTruthy();
    });

    it('remove has-error on event show-errors-reset', function () {

        $scope.input = null;
        var element = initDirective($scope, $compile);
        element.find('.form-group').addClass('has-error');

        $scope.$broadcast('form-show-errors-reset');
        $scope.$digest();
        $timeout.flush();

        expect(element.find('.form-group').hasClass('has-error')).toBeFalsy();
    });

    it('throw error if form-group do not have input', function () {
        var compile = $compile('<form><div class="form-group" show-errors></div></form>');

        $scope.$digest();

        expect(function () { 
             compile($scope);
             $timeout.flush();
        }).toThrowError();
    });

    it('throw error if element do not have form-group class', function () {
        expect(function () {
            $compile('<form><div class="form-group-wtf" show-errors><input name="name" /></div></form>');
        }).toThrowError();
    });

    function initDirective($scope, $compile) {
        var html = '<form name="form">' +
            '<div class="form-group" show-errors>' +
            '<label>Input name</label>' +
            '<input required type="text" name="input" ng-model="input" />' +
            '</div>' +
            '</form>';

        var compiled = angular.element($compile(html)($scope));
        $scope.$digest();
        $timeout.flush();
        return compiled;
    }

});