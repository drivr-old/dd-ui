describe('timeparser-service', function () {

    var timeparserService, $scope;

    beforeEach(module('dd.ui.timepicker'));


    beforeEach(inject(function ($rootScope, _timeparserService_) {

        $scope = $rootScope;
        timeparserService = _timeparserService_;

    }));


    describe('parse with a or p', function () {
        beforeEach(function () {
            $scope.isBusy = true;
            $scope.$digest();
        });

        it('8a', function () {
            var input = '8a';

            var model = timeparserService.toModel(input);

            expect(model).toBe('08:00');
        });

        it('7p', function () {
            var input = '7p';

            var model = timeparserService.toModel(input);

            expect(model).toBe('19:00');
        });

        it('1p', function () {
            var input = '1p';

            var model = timeparserService.toModel(input);

            expect(model).toBe('13:00');
        });

        it('815a', function () {
            var input = '815a';

            var model = timeparserService.toModel(input);

            expect(model).toBe('08:15');
        });

        it('815p', function () {
            var input = '815p';

            var model = timeparserService.toModel(input);

            expect(model).toBe('20:15');
        });

    });

    describe('parse with . or : separator', function () {
        beforeEach(function () {
            $scope.isBusy = true;
            $scope.$digest();
        });

        it('8.15a', function () {
            var input = '8.15a';

            var model = timeparserService.toModel(input);

            expect(model).toBe('08:15');
        });

        it('8:15a', function () {
            var input = '8:15a';

            var model = timeparserService.toModel(input);

            expect(model).toBe('08:15');
        });

        it('08:15a', function () {
            var input = '8:15a';

            var model = timeparserService.toModel(input);

            expect(model).toBe('08:15');
        });

    });

    describe('parse simple cases', function () {
        beforeEach(function () {
            $scope.isBusy = true;
            $scope.$digest();
        });

        it('8', function () {
            var input = '8';

            var model = timeparserService.toModel(input);

            expect(model).toBe('08:00');
        });

        it('20', function () {
            var input = '20';

            var model = timeparserService.toModel(input);

            expect(model).toBe('20:00');
        });

        it('2015', function () {
            var input = '2015';

            var model = timeparserService.toModel(input);

            expect(model).toBe('20:15');
        });

        it('815', function () {
            var input = '815';

            var model = timeparserService.toModel(input);

            expect(model).toBe('08:15');
        });

        it('08:15', function () {
            var input = '08:15';

            var model = timeparserService.toModel(input);

            expect(model).toBe('08:15');
        });

        it('20:16', function () {
            var input = '20:15';

            var model = timeparserService.toModel(input);

            expect(model).toBe('20:15');
        });

    });

    describe('change time', function () {

        it('increase by one minute for am time', function () {
            var input = '08:15';

            var model = timeparserService.changeTime(input, 1);

            expect(model).toBe('08:16');
        });

        it('decrease by one minute for am time', function () {
            var input = '08:15';

            var model = timeparserService.changeTime(input, -1);

            expect(model).toBe('08:14');
        });

        it('increase by one minute', function () {
            var input = '20:15';

            var model = timeparserService.changeTime(input, 1);

            expect(model).toBe('20:16');
        });

        it('decrease by one minute', function () {
            var input = '20:15';

            var model = timeparserService.changeTime(input, -1);

            expect(model).toBe('20:14');
        });

        it('increase by one minute if hours = 0', function () {
            var input = '00:15';

            var model = timeparserService.changeTime(input, 1);

            expect(model).toBe('00:16');
        });

        it('decrease by one minute if hours = 0', function () {
            var input = '00:15';

            var model = timeparserService.changeTime(input, -1);

            expect(model).toBe('00:14');
        });

        it('increase hours to 21:00', function () {
            var input = '20:59';

            var model = timeparserService.changeTime(input, 1);

            expect(model).toBe('21:00');
        });

        it('decrease hours to 20:59', function () {
            var input = '21:00';

            var model = timeparserService.changeTime(input, -1);

            expect(model).toBe('20:59');
        });
        
        //some corner cases
        it('set to 23:59 from 00:00', function () {
            var input = '00:00';

            var model = timeparserService.changeTime(input, -1);

            expect(model).toBe('23:59');
        });

        it('set to 00:01 from 00:00', function () {
            var input = '00:00';

            var model = timeparserService.changeTime(input, 1);

            expect(model).toBe('00:01');
        });

        it('set to 00:00 from 23:59', function () {
            var input = '23:59';

            var model = timeparserService.changeTime(input, 1);

            expect(model).toBe('00:00');
        });

    });

});
