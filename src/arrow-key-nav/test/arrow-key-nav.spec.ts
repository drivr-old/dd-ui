describe('Lookup tests.', function () {
    var element,
        $scope,
        $compile,
        $document;

    beforeEach(function () {
        angular.mock.module('dd.ui.arrow-key-nav');

        inject(function ($rootScope, _$compile_, _$document_, _$sniffer_) {
            $scope = $rootScope;
            $compile = _$compile_;
            $document = _$document_;
        });
    });

    describe('Navigation', function() {
        describe('up', function() {
            beforeEach(function() {
                initDirective('<div dd-arrow-key-nav> \
                                    <input id="input1" class="arrow-key-nav" /> \
                                    <input id="input2" /> \
                                    <select id="select1" class="arrow-key-nav"></select> \
                                    <input id="input3" /> \
                                    <button id="button1" class="arrow-key-nav"></button> \
                                    <input id="input4" /> \
                                </div>');
            });

            it('focuses previous navigatable element.', function() {
                focusElement('input3');

                arrowUp();
                expect($document[0].activeElement.id).toBe('select1');

                arrowUp();
                expect($document[0].activeElement.id).toBe('input1');
            });

            it('focuses last navigatable element when navigation reaches the top.', function() {
                focusElement('input1');

                arrowUp();
                expect($document[0].activeElement.id).toBe('button1');
            });
        });

        describe('down', function() {
            beforeEach(function() {
                initDirective('<div dd-arrow-key-nav> \
                                    <input id="input1" class="arrow-key-nav" /> \
                                    <input id="input2" /> \
                                    <select id="select1" class="arrow-key-nav"></select> \
                                    <input id="input3" /> \
                                    <button id="button1" class="arrow-key-nav"></button> \
                                    <input id="input4" /> \
                                </div>');
            });

            it('focuses next navigatable element.', function() {
                focusElement('input2');

                arrowDown();
                expect($document[0].activeElement.id).toBe('select1');

                arrowDown();
                expect($document[0].activeElement.id).toBe('button1');
            });

            it('focuses first navigatable element when navigation reaches the bottom.', function() {
                focusElement('button1');

                arrowDown();
                expect($document[0].activeElement.id).toBe('input1');
            });
        });

        describe('on anchor element', function() {
            it('works if href attribute is present.', function() {
                initDirective('<div dd-arrow-key-nav> \
                                <a id="link1" class="arrow-key-nav">Link1</a> \
                                <a href="javascript:void(0)" id="link2" class="arrow-key-nav">Link2</a> \
                                <a href="javascript:void(0)" id="link3" class="arrow-key-nav">Link3</a> \
                            </div>');

                focusElement('link2');

                arrowUp();
                expect($document[0].activeElement.id).toBe('link3');

                arrowDown();
                expect($document[0].activeElement.id).toBe('link2');
            });

            it('works if tab index is present.', function() {
                initDirective('<div dd-arrow-key-nav> \
                                <a id="link1" class="arrow-key-nav">Link1</a> \
                                <a tabindex="0" id="link2" class="arrow-key-nav">Link2</a> \
                                <a tabindex="1" id="link3" class="arrow-key-nav">Link3</a> \
                            </div>');

                focusElement('link2');

                arrowUp();
                expect($document[0].activeElement.id).toBe('link3');

                arrowDown();
                expect($document[0].activeElement.id).toBe('link2');
            });

            it('does not work if link is disabled.', function() {
                initDirective('<div dd-arrow-key-nav> \
                                    <a disabled="disabled" id="link1" class="arrow-key-nav" href="javascript:void(0)">Link1</a> \
                                    <a id="link2" class="arrow-key-nav" href="javascript:void(0)">Link2</a> \
                                    <a id="link3" class="arrow-key-nav" href="javascript:void(0)">Link3</a> \
                                </div>');

                focusElement('link2');

                arrowUp();
                expect($document[0].activeElement.id).toBe('link3');

                arrowDown();
                expect($document[0].activeElement.id).toBe('link2');
            });
        });

        it('does not work on disabled elements.', function() {
            initDirective('<div dd-arrow-key-nav> \
                                <input disabled id="input1" class="arrow-key-nav" /> \
                                <input id="input2" class="arrow-key-nav" /> \
                                <input id="input3" class="arrow-key-nav" /> \
                            </div>');

            focusElement('input2');

            arrowUp();
            expect($document[0].activeElement.id).toBe('input3');

            arrowDown();
            expect($document[0].activeElement.id).toBe('input2');
        });

        it('does not work on hidden elements.', function() {
            initDirective('<div dd-arrow-key-nav> \
                                <div style="display: none"> \
                                    <input id="input1" class="arrow-key-nav" /> \
                                </div> \
                                <input id="input2" class="arrow-key-nav" /> \
                                <input style="display: none" id="input3" class="arrow-key-nav" /> \
                            </div>');

            focusElement('input2');

            arrowUp();
            expect($document[0].activeElement.id).toBe('input2');

            arrowDown();
            expect($document[0].activeElement.id).toBe('input2');
        });
    });

    describe('Key modifier option', function() {
        it('makes navigation trigger only when modifier key is pressed.', function() {
            initDirective('<div dd-arrow-key-nav arrow-key-modifier="alt"> \
                                <input id="input1" class="arrow-key-nav" /> \
                                <input id="input2" class="arrow-key-nav" /> \
                            </div>');

            focusElement('input1');
            arrowDown();
            expect($document[0].activeElement.id).toBe('input1');

            arrowDown('alt');
            expect($document[0].activeElement.id).toBe('input2');
        });
    });

    function arrowUp(modifier = undefined) {
        triggerKeyDown(38, modifier);
    }

    function arrowDown(modifier = undefined) {
        triggerKeyDown(40, modifier);
    }

    function triggerKeyDown(keyCode, modifier) {
        var e = $.Event('keydown');
        e.keyCode = keyCode;
        if (modifier) {
            e[modifier + 'Key'] = true;
        }
        $(element).trigger(e);
    }

    function focusElement(id) {
        element.find('#' + id).focus();
    }
    
    function initDirective(html) {
        element = $compile(html)($scope);
        element.appendTo($document[0].body);
        $scope.$digest();
    }
});