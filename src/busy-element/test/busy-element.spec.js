describe('busy-element', function () {
  var $scope,
    $compile,
    $timeout,
    wrapElement,
    element,
    busyElement,
    statusElement;

  beforeEach(module('dd.ui.busy-element'));
  beforeEach(module('template/busy-element/busy-element.html'));

  beforeEach(inject(function ($rootScope, _$compile_, _$timeout_) {
    $scope = $rootScope;
    $compile = _$compile_;
    $timeout = _$timeout_;
  }));

  beforeEach(function() {
    wrapElement = $compile('<div style="width: 50px; height: 30px; padding: 10px 5px 10px 5px"><busy-element busy="isBusy" status="status" timeout="timeout"></busy-element></div>')($scope);
    $scope.$digest();
    element = wrapElement.find('.be-container');
    busyElement = element.find('.be-overlay').first();
    statusElement = element.find('.be-overlay.be-animate');
  });

  describe('after init', function() {
    it('should set directive width and height according to parent element size with padding', function(){
      expect(busyElement.width()).toBe(60);
      expect(busyElement.height()).toBe(50);
      expect(element.css('margin-left')).toBe('-5px');
      expect(element.css('margin-top')).toBe('-10px');

      expect(busyElement.hasClass('ng-hide')).toBe(true);
      expect(statusElement.hasClass('ng-hide')).toBe(true);
    });
  });

  describe('status change', function() {
    beforeEach(function() {
      $scope.isBusy = true;
      $scope.$digest();
    });

    it('to busy should show busy element', function(){
      expect(busyElement.hasClass('ng-hide')).toBe(false);
      expect(statusElement.hasClass('ng-hide')).toBe(true);
    });

    it('from busy to success, should hide busy and show status', function(){
      $scope.status = 'success';
      $scope.$digest();

      expect(busyElement.hasClass('ng-hide')).toBe(true);
      expect(statusElement.hasClass('ng-hide')).toBe(false);
    });

    it('from busy to success, should blink with status element', function(){
      $scope.status = 'success';
      $scope.$digest();

      // not status element is shown (see prev. test)

      $timeout.flush();

      expect(busyElement.hasClass('ng-hide')).toBe(true);
      expect(statusElement.hasClass('ng-hide')).toBe(true);
    });

    it('from busy to success, should not blink if timeout set to 0', function(){
      $scope.status = 'success';
      $scope.timeout = 0;
      $scope.$digest();

      $timeout.flush();

      expect(busyElement.hasClass('ng-hide')).toBe(true);
      expect(statusElement.hasClass('ng-hide')).toBe(false);
    });
  });
});