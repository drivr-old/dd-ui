namespace ddui {
    export class FilterHelper {
        static mergeFilterValues(filter: FilterModel, object: Object): void {
            for (let prop in filter) {
                if (filter.hasOwnProperty(prop) && typeof (object[prop]) !== 'undefined') {
                    filter[prop].value = object[prop];
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

        static generateFilterObject(filter: FilterModel) {
            var params = {};
            for (let prop in filter) {
                if (filter.hasOwnProperty(prop) && filter[prop].value) {
                    let field = filter[prop];
                    if (field.value instanceof Array) {
                        field.value.forEach(x => this.stripProperties(x, field.properties));
                    } else {
                        this.stripProperties(field.value, field.properties);
                    }

                    params[prop] = field.value;
                }
            }
            return Object.keys(params).length ? params : null;
        }

        static generateFilterRequest(filter: FilterModel) {
            var params = {};
            for (let prop in filter) {
                if (filter.hasOwnProperty(prop) && filter[prop].value) {
                    let field = filter[prop];
                    if (field.requestFormatter) {
                        params[prop] = field.requestFormatter(field.value);
                    } else if (field.value instanceof Array) {
                        params[prop] = field.value.map(x => x.id || x).join(',');
                    } else if (field.value instanceof Object) {
                        params[prop] = field.value['id'];
                    } else {
                        params[prop] = field.value;
                    }
                }
            }
            return params;
        }

        private static stripProperties(object, propertiesToKeep) {
            if (propertiesToKeep) {
                Object.keys(object).forEach(key => {
                    if (propertiesToKeep.indexOf(key) < 0) {
                        delete object[key];
                    }
                });
            }
        }
    }

    angular.module('dd.ui.filter-helper', []);
}
