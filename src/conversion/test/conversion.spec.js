describe('conversion', function () {
    var $filter, conversionService;
    beforeEach(function () {
        angular.mock.module('dd.ui.conversion');
        inject(function (_$filter_, _conversionService_) {
            $filter = _$filter_;
            conversionService = _conversionService_;
        });
    });
    describe('localizedDistance filter', function () {
        it('sets units to metric and returns the same m value', function () {
            conversionService.setUnitSystem('metric');
            var distance = 1;
            var result = $filter('localizedDistance')(distance, 'm');
            expect(result).toEqual('1 m');
        });
        it('sets units to imperial and throws exception as no valid conversion exists for mi', function () {
            conversionService.setUnitSystem('metric');
            var distance = 1;
            expect(function () { $filter('localizedDistance')(distance, 'mi'); }).toThrow(new Error('Unit mi conversion not supported'));
        });
        it('sets units to imperial and converts m to yd', function () {
            conversionService.setUnitSystem('imperial');
            var distance = 1;
            var result = $filter('localizedDistance')(distance, 'm');
            expect(result).toEqual('1.0936132983377078 yd');
        });
        it('sets units to imperial and converts m to yd with precision 1', function () {
            conversionService.setUnitSystem('imperial');
            var distance = 1;
            var result = $filter('localizedDistance')(distance, 'm', 2);
            expect(result).toEqual('1.09 yd');
        });
        it('sets units to imperial and converts m to yd with precision 0', function () {
            conversionService.setUnitSystem('imperial');
            var distance = 1;
            var result = $filter('localizedDistance')(distance, 'm', 0);
            expect(result).toEqual('1 yd');
        });
        it('sets units to imperial and converts km to mi', function () {
            conversionService.setUnitSystem('imperial');
            var distance = 1;
            var result = $filter('localizedDistance')(distance, 'km');
            expect(result).toEqual('0.621371192237334 mi');
        });
        it('sets units to imperial and converts km to mi with precision 2', function () {
            conversionService.setUnitSystem('imperial');
            var distance = 1;
            var result = $filter('localizedDistance')(distance, 'km', 2);
            expect(result).toEqual('0.62 mi');
        });
        it('sets units to imperial and converts km to mi with precision 0', function () {
            conversionService.setUnitSystem('imperial');
            var distance = 1;
            var result = $filter('localizedDistance')(distance, 'km', 0);
            expect(result).toEqual('1 mi');
        });
    });
    describe('conversionService', function () {
        it('converts m to km', function () {
            var distance = 1;
            var result = conversionService.convert(distance, 'm', 'km');
            expect(result).toEqual(0.001);
        });
        it('converts m to mi', function () {
            var distance = '1';
            var result = conversionService.convert(distance, "m", "mi");
            expect(result).toEqual(0.0006213711922373339);
        });
        it('converts m to yd', function () {
            var distance = '1';
            var result = conversionService.convert(distance, "m", "yd");
            expect(result).toEqual(1.0936132983377078);
        });
        it('converts m to yd with precision 0', function () {
            var distance = '1';
            var result = conversionService.convert(distance, "m", "yd", 0);
            expect(result).toEqual(1);
        });
        it('converts m to yd with precision 2', function () {
            var distance = '1';
            var result = conversionService.convert(distance, "m", "yd", 2);
            expect(result).toEqual(1.09);
        });
        it('converts mi to m', function () {
            var distance = '1';
            var result = conversionService.convert(distance, "mi", "m");
            expect(result).toEqual(1609.344);
        });
        it('converts yd to m', function () {
            var distance = '1';
            var result = conversionService.convert(distance, "yd", "m");
            expect(result).toEqual(0.9144);
        });
    });
});
