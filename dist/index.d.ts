



declare namespace ddui {
    interface FilterField {
        value?: any;
        /**
         * Default value which won't be displayed in filter tags
         */
        defaultValue?: any;
        /**
         * Filter tag display name
         */
        displayName?: string;
        excludeTag?: boolean;
        /**
         * Filter tag value formatter
         */
        valueFormatter?: (value) => any;
        /**
         * Filter request formatter
         */
        requestFormatter?: (value) => any;
        /**
         * Properties to keep when filtering. Used for request/url params
         */
        properties?: string[];
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
        static mergeFilterValues(filter: FilterModel, object: Object): void;
        static generateFilterObject(filter: FilterModel): {};
        static generateFilterRequest(filter: FilterModel): {};
        private static stripProperties(object, propertiesToKeep);
        private static isDefined(value);
    }
}

declare namespace ddui {
}




declare var PHONE_REGEXP: RegExp;
declare var PHONE_COUNTRY_CODE_REGEXP: RegExp;
declare var PHONE_WO_COUNTRY_CODE_REGEXP: RegExp;


