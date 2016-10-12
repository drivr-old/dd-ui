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
        page: number;
        data: any;
        filter: ddui.FilterModel;
        paging: boolean;
        selectedAllPages: boolean;
        isLoading: boolean;

        private responseListName: string;
        private responseCountName: string;
        private onListResponseSuccess: any;
        private onListResponseError: any;
        private initFilterFunc: () => ddui.FilterModel;

        constructor(config: ListConfig, private $http: ng.IHttpService) {
            this.id = config.id;
            this.rows = [];
            this.selectedRows = [];
            this.count = 0;
            this.page = 1;
            this.data = null;   // will be assigned raw last response
            this.paging = config.paging;
            this.selectedAllPages = false;
            this.isLoading = false;
            this.url = config.url;
            this.responseListName = config.responseListName || 'items';
            this.responseCountName = config.responseCountName || 'count';
            this.initFilterFunc = () => { return {}; };
            this.filter = this.createDefaultFilter();
        }

        onSuccess(callback: (list: T[], count: number) => void) {
            this.onListResponseSuccess = callback;
        }

        onError(callback: (data: any) => void) {
            this.onListResponseError = callback;
        }

        setFilter(filterFunc: () => ddui.FilterModel) {
            this.initFilterFunc = filterFunc;
            var filter = this.initFilterFunc();
            if (typeof (filter) !== 'object') {
                throw new Error('initFilterFunc should return object with filter properties');
            }

            angular.extend(this.filter, filter);
        }

        submitFilter() {
            return this.updateList(this.filter);
        }

        resetFilter() {
            this.filter = this.createDefaultFilter();
            if (this.initFilterFunc) {
                this.setFilter(this.initFilterFunc);
            }
            this.updateList(this.filter);
        }

        fetchPage(page: number = null) {
            if (page) {
                this.page = page;
            }

            this.filter['skip'].value = (this.page * this.filter['limit'].value) - this.filter['limit'].value;
            this.updateList(this.filter);
        }

        syncAll() {
            this.filter['skip'].value = 0;
            this.filter['limit'].value = this.rows.length > 0 ? Math.ceil(this.rows.length / this.filter['limit'].value) * this.filter['limit'].value : this.filter['limit'].value;
            this.updateList(this.filter);
        }

        loadMore() {
            this.filter['skip'].value += this.filter['limit'].value;
            return this.updateList(this.filter);
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

        private updateList(filter: ddui.FilterModel) {
            this.isLoading = true;

            this.ensureLimitAndSkip();

            const config = {
                params: ddui.FilterHelper.generateFilterRequest(filter)
            };

            return this.$http.get(this.url, config)
                .then(response => {
                    this.data = response.data;
                    this.count = this.data[this.responseCountName];
                    this.updateListCollection(this.data[this.responseListName]);

                    if (this.onListResponseSuccess) {
                        this.onListResponseSuccess(this.rows, this.count);
                    }
                })
                .catch(data => {
                    if (this.onListResponseError) {
                        this.onListResponseError(data);
                    }
                }).finally(() => {
                     this.isLoading = false;
                });
        }

        private ensureLimitAndSkip() {
            if (!angular.isDefined(this.filter['limit'].value)) {
                this.filter['limit'].value = 25;
            }

            if (!angular.isDefined(this.filter['skip'].value)) {
                this.filter['skip'].value = 0;
            }
        }

        private updateListCollection(items: T[]) {
            if (this.filter['skip'].value === 0 || this.paging) {
                this.rows = items;
            } else {
                for (let a = 0; a < items.length; a++) {
                    this.rows.push(items[a]);
                }
            }
        }

        private createDefaultFilter(): ddui.FilterModel {
            return { 
                'skip': { value: 0 }, 
                'limit': { value: 25}
            };
        }
    }

    export class DataListManager {
        constructor(private $http: ng.IHttpService) { }

        private listServiceHash: { [id: string]: any; } = {};
        private defaultListId = 'DataList';

        init<T>(config: ListConfig): DataList<T> {
            config.id = config.id || this.defaultListId;
            this.validateInit(config);
            const listService = new DataList<T>(config, this.$http);
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
        }

        private validateGet(id: string) {
            if (!this.listServiceHash[id]) {
                throw new Error(`List with id ${id} not found`);
            }
        }
    }

    angular.module('dd.ui.data-list', [])
        .service('dataListManager', ['$http', ($http) => {
            return new DataListManager($http);
        }]);
}