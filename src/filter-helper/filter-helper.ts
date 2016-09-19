namespace ddui {
    export class FilterHelper {
        static mergeStateParams(filter: FilterModel, $stateParams): void {
            for (let prop in filter) {
                if (filter.hasOwnProperty(prop) && typeof ($stateParams[prop]) !== 'undefined') {
                    filter[prop].value = $stateParams[prop];
                }
            }
        }

        static generateStateParams(filter: FilterModel): Object {
            var params = {};
            for (let prop in filter) {
                if (filter.hasOwnProperty(prop)) {
                    params[prop] = filter[prop].value;
                }
            }
            return params;
        }

        static generateDynamicParams(filter: FilterModel, defaultParams: Object = null): Object {
            var params = defaultParams || {};

            for (let prop in filter) {
                if (filter.hasOwnProperty(prop)) {
                    params[prop] = { dynamic: true };
                }
            }
            return params;
        }

        static generateUrlParams(filter: FilterModel): string {
            let url = '';
            for (let prop in filter) {
                if (filter.hasOwnProperty(prop)) {
                    if (url.length > 0) {
                        url += '&';
                    }
                    url += prop;
                }
            }
            return url;
        }
    }

    angular.module('dd.ui.filter-helper', []);
}
