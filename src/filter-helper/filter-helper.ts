namespace ddui {
    export class FilterHelper {
        static mergeFilterValues(filter: FilterModel, object: Object): void {
            for (let prop in filter) {
                if (filter.hasOwnProperty(prop) && typeof (object[prop]) !== 'undefined') {
                    filter[prop].value = object[prop];
                }
            }
        }

        static generateFilterObject(filter: FilterModel) {
            var params = {};
            for (let prop in filter) {
                if (filter.hasOwnProperty(prop) && this.isDefined(filter[prop].value)) {
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
                if (filter.hasOwnProperty(prop) && this.isDefined(filter[prop].value)) {
                    let field = filter[prop];
                    if (field.requestFormatter) {
                        params[prop] = field.requestFormatter(field.value);
                    } else if (field.value instanceof Array) {
                        params[prop] = field.value.map(x => x.id || x);
                    } else if (field.value instanceof Object && !(field.value instanceof Date)) {
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

        private static isDefined(value: any) {
            return value !== undefined && value !== null && value !== '';
        }
    }

    angular.module('dd.ui.filter-helper', []);
}
