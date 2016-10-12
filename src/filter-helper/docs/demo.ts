
class FilterHelperCtrl {
    constructor() {
        this.filter = this.getDefaultFilter();

        console.log('generateFilterObject', ddui.FilterHelper.generateFilterObject(this.filter));
        console.log('generateFilterRequest', ddui.FilterHelper.generateFilterRequest(this.filter));
    }

    filter: ddui.FilterModel;

    getDefaultFilter(): ddui.FilterModel {
        return {
            'firstName': { value: 'Vasia' },
            'lastName': { value: 'Sprotauskas' },
            'customField': { displayName: 'Custom name', value: undefined },
            'object': {
                value: { id: 5, name: 'Vilnius' },
                valueFormatter: (value) => value.name
            },
        };
    }
}

angular.module('dd.ui.demo')
    .controller('FilterHelperCtrl', FilterHelperCtrl);