describe('conversion', function () {
  var $filter;

  beforeEach(function () {
    module('dd.ui.conversion');
    inject(function (_$filter_) {
      $filter = _$filter_;
    });
  });

  describe('distance', function () {
    it('converts m to km', function () {
      var distance = 1;
      var result = $filter('distance')(distance, "m", "km");
      expect(result).toEqual(0.001);
    });
    it('converts m to mi', function () {
      var distance = '1';
      var result = $filter('distance')(distance, "m", "mi");
      expect(result).toEqual(0.0006213711922373339);
    });
    it('converts m to yd', function () {
      var distance = '1';
      var result = $filter('distance')(distance, "m", "yd");
      expect(result).toEqual(1.0936132983377078);
    });
    it('converts mi to m', function () {
      var distance = '1';
      var result = $filter('distance')(distance, "mi", "m");
      expect(result).toEqual(1609.344);
    });
    it('converts yd to m', function () {
      var distance = '1';
      var result = $filter('distance')(distance, "yd", "m");
      expect(result).toEqual(0.9144);
    });
  });
});
