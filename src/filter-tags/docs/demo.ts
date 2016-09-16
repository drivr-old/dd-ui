
class FilterTagsCtrl {

    constructor() {
        this.filter = this.getDefaultFilter();
    }

    filter: ddui.FilterModel;
    selectedTag: ddui.FilterField;
    removedTag: ddui.FilterField;

    getDefaultFilter(): ddui.FilterModel {
        return {
            'firstName': { value: 'Vasia' },
            'lastName': { value: 'Sprotauskas' },
            'customField': { displayName: 'Custom name', value: undefined }
        };
    }

    addFilter() {
        var rand = new Date().getDate();
        this.filter[`customField`] = { value: rand };
        this.updateFilter();
    }

    onSelect(fieldName: string) {
        this.selectedTag = this.filter[fieldName];
        this.updateFilter();
    }

    onRemove(fieldName: string) {
        this.removedTag = this.filter[fieldName];
        this.filter[fieldName] = { value: undefined };
        this.updateFilter();
    }

    onRemoveAll() {
        this.filter['firstName'].value = undefined;
        this.filter['lastName'].value = undefined;
        this.filter['customField'].value = undefined;
        this.updateFilter();
    }

    resetToDefaultFilter() {
        this.filter = this.getDefaultFilter();
    }

    private updateFilter() {
        this.filter = angular.copy(this.filter); // this is needed to trigger component update
    }
}

angular.module('dd.ui.demo')
    .controller('FilterTagsCtrl', FilterTagsCtrl);