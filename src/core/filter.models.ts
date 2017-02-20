namespace ddui {
    export interface FilterField {
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

    export interface FilterModel {
        [index: string]: FilterField;
    }
}