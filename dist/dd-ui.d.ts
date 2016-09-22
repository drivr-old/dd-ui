



declare namespace ddui {
    interface FilterField {
        value?: any;
        displayName?: string;
        excludeTag?: boolean;
    }
    interface FilterModel {
        [index: string]: FilterField;
    }
}

declare namespace ddui {
    interface ListRow {
        $selected?: boolean;
    }
    interface ListConfig {
        url: string;
        id?: string;
        paging?: boolean;
        responseListName?: string;
        responseCountName?: string;
    }
    class DataList<T extends ListRow> {
        private $http;
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
        private responseListName;
        private responseCountName;
        private onListResponseSuccess;
        private onListResponseError;
        private initFilterFunc;
        constructor(config: ListConfig, $http: ng.IHttpService);
        onSuccess(callback: (list: T[], count: number) => void): void;
        onError(callback: (data: any) => void): void;
        setFilter(filterFunc: () => ddui.FilterModel): void;
        submitFilter(): ng.IPromise<void>;
        resetFilter(): void;
        fetchPage(page?: number): void;
        syncAll(): void;
        loadMore(): ng.IPromise<void>;
        hasMore(): boolean;
        selectAll(): void;
        deselectAll(): void;
        selectAllPages(): void;
        toggle(row: T): void;
        private updateList(filter);
        private ensureLimitAndSkip();
        private updateListCollection(items);
        private createDefaultFilter();
    }
    class DataListManager {
        private $http;
        constructor($http: ng.IHttpService);
        private listServiceHash;
        private defaultListId;
        init<T>(config: ListConfig): DataList<T>;
        get<T>(id?: string): DataList<T>;
        private validateInit(config);
        private validateGet(id);
    }
}




declare namespace ddui {
}


declare namespace ddui {
}

declare namespace ddui {
    class FilterHelper {
        static mergeStateParams(filter: FilterModel, $stateParams: any): void;
        static generateStateParams(filter: FilterModel): Object;
        static generateDynamicParams(filter: FilterModel, defaultParams?: Object): Object;
        static generateUrlParams(filter: FilterModel): string;
    }
}

declare namespace ddui {
}




declare var PHONE_REGEXP: RegExp;
declare var PHONE_COUNTRY_CODE_REGEXP: RegExp;
declare var PHONE_WO_COUNTRY_CODE_REGEXP: RegExp;


