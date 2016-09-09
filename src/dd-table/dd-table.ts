namespace ddui {
    
    function ddTable(): ng.IDirective {
        return {
            restrict: 'A',
            scope: {
                ddTable: '='
            },
            bindToController: true,
            controllerAs: '$ctrl',
            controller: () => { },
            compile: (element, attr) => {
                element[0].classList.add('table');
                element[0].classList.add('dd-table');
                return () => {};
            }
        };
    }

    function ddPagination(): ng.IDirective {
        return {
            restrict: 'E',
            scope: {
                totalItems: '=',
                currentPage: '=',
                itemsPerPage: '=',
                onChange: '&'
            },
            template: `<ul uib-pagination
                           total-items="totalItems" 
                           ng-model="currentPage" 
                           items-per-page="itemsPerPage" 
                           class="dd-pagination pagination-sm" 
                           boundary-link-numbers="true">
                        </ul>`,
            link: (scope: any) => {
                scope.$watch('currentPage', (oldVal, newVal) => {
                    if (oldVal !== newVal) {
                        scope.onChange();
                    }
                });
            }
        };
    }

    function ddItemsPerPage(): ng.IDirective {
        return {
            restrict: 'E',
            scope: {
                limit: '=',
                onChange: '&'
            },
            template: `<div class="btn-group pull-right" uib-dropdown keyboard-nav>
                            <button id="btn-append-to-single-button" type="button" class="btn btn-default btn-sm" uib-dropdown-toggle>
                                Show {{limit}} results <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="btn-append-to-single-button">
                                <li ng-repeat="value in values" role="menuitem"><a ng-click="selectValue(value)" href="#">{{value}}</a></li>
                            </ul>
                        </div>`,
            link: (scope: any) => {
                scope.values = [scope.limit || 25, 50, 100];

                scope.selectValue = (value: number) => {
                    scope.limit = value;
                };

                scope.$watch('limit', (oldVal, newVal) => {
                    if (oldVal !== newVal) {
                        scope.onChange();
                    }
                });
            }
        };
    }

    function ddPagesSelector(): ng.IDirective {
        return {
            restrict: 'E',
            require: '^ddTable',
            transclude: true,
            replace: true,
            controller: () => { },
            template: `<div>
                            <div class="btn-group" uib-dropdown keyboard-nav>
                                <button uib-dropdown-toggle class="btn btn-default btn-xs"><span class="caret"></span></button>
                                <ul class="dropdown-menu" uib-dropdown-menu ng-transclude>
                                </ul>
                            </div>
                            <span class="rows-count">{{ddTable.selectedRows.length}}</span>
                       </div>`,
            link: (scope: any, element, attrs, ctrl) => {
                scope.ddTable = ctrl.ddTable;
            }
        };
    }

    function ddPagesSelectorItem(): ng.IDirective {
        return {
            restrict: 'E',
            require: '^ddPagesSelector',
            transclude: true,
            replace: true,
            scope: {
                onClick: '&'
            },
            template: `<li><a href="#" ng-click="onClick()" ng-transclude></a></li>`
        };
    }

    angular.module('dd.ui.dd-table', [])
        .directive('ddTable', ddTable)
        .directive('ddPagination', ddPagination)
        .directive('ddItemsPerPage', ddItemsPerPage)
        .directive('ddPagesSelector', ddPagesSelector)
        .directive('ddPagesSelectorItem', ddPagesSelectorItem);
}