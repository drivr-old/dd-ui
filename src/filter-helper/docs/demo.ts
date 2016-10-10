
class FilterHelperCtrl {
    constructor() {
        this.filter = this.getDefaultFilter();

        console.log('Generate $stateParams', ddui.FilterHelper.generateStateParams(this.filter));
        console.log('Generate dynamic params', ddui.FilterHelper.generateDynamicParams(this.filter));
        console.log('Generate url params', ddui.FilterHelper.generateUrlParams(this.filter));
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