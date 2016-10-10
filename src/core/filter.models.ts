namespace ddui {
    export interface FilterField {
        value?: any;
        displayName?: string;
        excludeTag?: boolean;
        valueFormatter?: (value) => any;
        properties?: string[];
    }

    export interface FilterModel {
        [index: string]: FilterField;
    }
}