namespace ddui {
    export interface ListRow {
        $selected?: boolean;
    }

    export interface ListConfig {
        url: string;
        id?: string;
        paging?: boolean;
        responseListName?: string;
        responseCountName?: string;
    }

    export class DataList<T extends ListRow> {

        id: string;
        rows: T[];
        selectedRows: T[];
        url: string;
        count: number;
        data: any;
        filter: any;
        paging: boolean;
        selectedAllPages: boolean;
        isLoading: boolean;

        private responseListName: string;
        private responseCountName: string;
        private onListResponseSuccess: any;
        private onListResponseError: any;
        private initFilterFunc: Function;

        constructor(config: ListConfig, private $http: ng.IHttpService, private $location: ng.ILocationService) {
            this.id = config.id;
            this.rows = [];
            this.selectedRows = [];
            this.count = 0;
            this.data = null;   // will be assigned raw last response
            this.filter = { skip: 0, limit: 25 };
            this.paging = config.paging;
            this.selectedAllPages = false;
            this.isLoading = false;
            this.url = config.url;
            this.responseListName = config.responseListName || 'items';
            this.responseCountName = config.responseCountName || 'count';
            this.initFilterFunc = () => { return {}; };
        }

        onSuccess(callback: (list: T[], count: number) => void) {
            this.onListResponseSuccess = callback;
        }

        onError(callback: (data: any) => void) {
            this.onListResponseError = callback;
        }

        setFilter(filterFunc) {
            this.initFilterFunc = filterFunc;
            var filter = this.initFilterFunc();
            if (typeof (filter) !== 'object') {
                throw new Error('initFilterFunc should return object with filter properties');
            }

            angular.extend(this.filter, filter);
        }

        submitFilter() {
            this.setLocationParams(this.filter);
            return this.updateList();
        }

        resetFilter() {
            this.filter = this.initFilterFunc();
            this.setLocationParams(this.filter);
            this.updateList();
        }

        updateList() {
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

            return this.$http.get(this.url, config)
                .success(data => {
                    self.data = data;
                    self.count = data[self.responseCountName];
                    this.updateListCollection(data[self.responseListName]);

                    if (self.onListResponseSuccess) {
                        self.onListResponseSuccess(self.rows, self.count);
                    }
                })
                .error(data => {
                    if (self.onListResponseError) {
                        self.onListResponseError(data);
                    }
                }).finally(() => {
                     self.isLoading = false;
                });
        }

        loadMore() {
            this.filter.skip += this.filter.limit;
            return this.updateList();
        }

        hasMore() {
            return this.rows && this.rows.length < this.count;
        }

        selectAll() {
            this.selectedAllPages = false;
            for (let row of this.rows) {
                row.$selected = true;
                this.selectedRows.push(row);
            }
        }

        deselectAll() {
            this.selectedAllPages = false;
            for (let row of this.rows) {
                row.$selected = false;
                this.selectedRows = [];
            }
        }

        selectAllPages() {
            this.selectAll();
            this.selectedAllPages = true;
        }

        toggle(row: T) {
            this.selectedAllPages = false;
            row.$selected = !row.$selected;
            if (row.$selected) {
                this.selectedRows.push(row);
            } else {
                var selectedRowIndex = this.selectedRows.indexOf(row);
                this.selectedRows.splice(selectedRowIndex, 1);
            }
        }

        private updateListCollection(items: T[]) {
            if (this.filter.skip === 0 || this.paging) {
                this.rows = items;
            } else {
                for (let a = 0; a < items.length; a++) {
                    this.rows.push(items[a]);
                }
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
        constructor(private $http: ng.IHttpService, private $location: ng.ILocationService) { }

        private listServiceHash: { [id: string]: any; } = {};
        private defaultListId = 'DataList';

        init<T>(config: ListConfig): DataList<T> {
            config.id = config.id || this.defaultListId;
            this.validateInit(config);
            const listService = new DataList<T>(config, this.$http, this.$location);
            this.listServiceHash[config.id] = listService;
            return listService;
        }

        get<T>(id?: string): DataList<T> {
            id = id || this.defaultListId;
            this.validateGet(id);
            return this.listServiceHash[id];
        }

        private validateInit(config: ListConfig) {
            if (!config || !config.url) {
                throw new Error('List config url is required');
            }

            if (this.listServiceHash[config.id]) {
                throw new Error(`List with id ${config.id} is already created`);
            }
        }

        private validateGet(id: string) {
            if (!this.listServiceHash[id]) {
                throw new Error(`List with id ${id} not found`);
            }
        }
    }

    angular.module('dd.ui.data-list', [])
        .service('dataListService', ['$http', '$location', ($http, $location) => {
            return new DataListService($http, $location);
        }]);
}