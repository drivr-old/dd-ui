namespace ddui {
    export interface FilterField {
        value?: any;
        displayName?: string;
        excludeTag?: boolean;
    }

    export interface FilterModel {
        [index: string]: FilterField;
    }
}