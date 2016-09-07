namespace ddui {
    export interface ListRow {
        $selected?: boolean;
    }

    export interface ListConfig {
        url: string;
        responseListName?: string;
        responseCountName?: string;
    }

    export class DataList<T extends ListRow> {

        id: string;
        list: T[];
        url: string;
        count: number;
        data: any;
        filter: any;
        areFiltersSet: boolean;
        forceListUpdate: boolean;
        selectedAllPages: boolean;
        isLoading: boolean;
        responseListName: string; //TODO add default
        responseCountName: string; //TODO add default

        onListResponseSuccess: any;
        onListResponseError: any;

        initFilterFunc: Function;
        filterScope: any;

        constructor(id: string, config: ListConfig, private $http: ng.IHttpService, private $timeout: ng.ITimeoutService, private $location: ng.ILocationService) {
            this.id = id;
            this.list = [];
            this.count = 0;
            this.data = null;   // will be assigned raw last response
            this.filter = {};
            this.areFiltersSet = false;
            this.forceListUpdate = false;
            this.selectedAllPages = false;
            this.isLoading = false;
            this.url = config.url;
            this.responseListName = config.responseListName;
            this.responseCountName = config.responseCountName;
        }

        onSuccess(callback: (list: T[], count: number) => void) {
            this.onListResponseSuccess = callback;
        }

        onError(callback: (data: any) => void) {
            this.onListResponseError = callback;
        }

        initFilter(initFilterFunc, forceListUpdate = false) {
            this.initFilterFunc = initFilterFunc;
            this.forceListUpdate = forceListUpdate;

            this.filter = this.initFilterFunc();
            if (typeof (this.filter) !== 'object') {
                throw new Error('initFilterFunc should return object with filter properties');
            }

            this.areFiltersSet = this.loadLocationParams(this.filter) > 0;

            this.updateList();

            return this;
        }

        submitFilter() {
            this.setLocationParams(this.filter);
            if (this.forceListUpdate) {
                return this.updateList();
            }
            return null;
        }

        resetFilter() {
            this.filter = this.initFilterFunc();
            this.setLocationParams(this.filter);
            if (this.forceListUpdate) {
                this.updateList();
            }
        }

        updateList(url = undefined) {
            const self = this;
            this.isLoading = true;

            if (typeof (this.filter.limit) === 'undefined') {
                this.filter.limit = 25;
            }

            if (typeof (this.filter.skip) === 'undefined') {
                this.filter.skip = 0;
            }

            const config = {
                params: this.filter
            };

            return this.$http.get(url || this.url, url ? {} : config)
                .success(data => {
                    self.data = data;
                    const arr = data[self.responseListName];
                    self.count = data[self.responseCountName];

                    if (!url && (self.filter.skip === 0)) {
                        self.list = arr;
                    } else {
                        for (let a = 0; a < arr.length; a++) {
                            self.list.push(arr[a]);
                        }
                    }

                    if (self.onListResponseSuccess) {
                        self.onListResponseSuccess(self.list, self.count);
                    }
                    self.isLoading = false;
                })
                .error(data => {
                    if (self.onListResponseError) {
                        self.onListResponseError(data);
                    }
                    self.isLoading = false;
                });
        }

        loadMore() {
            this.filter.skip += this.filter.limit;
            return this.updateList();
        }

        hasMore() {
            return this.list && this.list.length < this.count;
        }

        selectAll() {
            this.selectedAllPages = false;
            for (let a = 0; a < this.list.length; a++) {
                this.list[a].$selected = true;
            }
        }

        deselectAll() {
            this.selectedAllPages = false;
            for (let a = 0; a < this.list.length; a++) {
                this.list[a].$selected = false;
            }
        }

        selectAllPages() {
            this.selectAll();
            this.selectedAllPages = true;
        }

        toggle(obj) {
            this.selectedAllPages = false;
            if (obj.$selected) {
                obj.$selected = false;
            } else {
                obj.$selected = true;
            }
        }

        private loadLocationParams(filter) {
            var changedCount = 0;
            for (var param in filter) {
                if (filter.hasOwnProperty(param)) {
                    var val = this.$location.search()[param];
                    if (val) {
                        try {
                            filter[param] = JSON.parse(val);
                            if (DataList.isNumber(filter[param])) {
                                filter[param] = JSON.stringify(filter[param]);
                            }
                        } catch (e) {
                            var isoDatePattern = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;
                            if (isoDatePattern.test(val)) {
                                filter[param] = new Date(val);
                            } else {
                                filter[param] = val;
                            }
                        }
                        changedCount++;
                    }
                }
            }
            return changedCount;
        }

        private setLocationParams(filter) {
            var params = this.getFilterAsUrlParams(filter, true);
            for (var param in params) {
                if (params.hasOwnProperty(param)) {
                    var val = params[param];
                    if (val && param !== 'expand' && param !== 'skip' && param !== 'limit') {
                        this.$location.search(param, val);
                    } else {
                        this.$location.search(param, null);
                    }
                }
            }
        }

        private getFilterAsUrlParams(filter, addNulls) {
            var params = {};

            for (var param in filter) {
                if (filter.hasOwnProperty(param)) {
                    var val = filter[param];

                    if (val instanceof Array) {
                        val = val.join(',');
                    }
                    if (val && (DataList.isNumber(val) || val.length > 0)) {
                        params[param] = val;
                    } else if ((typeof val) === 'boolean') {
                        params[param] = val === true;
                    } else if (val instanceof Date) {
                        params[param] = val.toISOString();
                    } else if (val && (typeof val) === 'object') {
                        params[param] = JSON.stringify(val);
                    } else if (addNulls) {
                        params[param] = null;
                    }
                }
            }
            return params;
        }

        private static isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
    }

    export class DataListService {
        constructor(private $http: ng.IHttpService, private $timeout: ng.ITimeoutService, private $location: ng.ILocationService) { }

        listServiceHash: { [id: string]: any; } = {};

        init<T>(id: string, config: ListConfig): DataList<T> {
            if (typeof (this.listServiceHash[id]) !== 'undefined') {
                throw new Error(`List with id ${id} is already created`);
            } else {
                const listService = new DataList<T>(id, config, this.$http, this.$timeout, this.$location);
                this.listServiceHash[id] = listService;
                return listService;
            }
        }

        get<T>(id: string): DataList<T> {
            if (typeof (this.listServiceHash[id]) !== 'undefined') {
                return this.listServiceHash[id];
            } else {
                throw new Error(`List with id ${id} not found`);
            }
        }
    }

    angular.module('dd.ui.data-list', [])
        .service('dataListService', ['$http', '$timeout', '$location', ($http, $timeout, $location) => {
            return new DataListService($http, $timeout, $location);
        }]);
}