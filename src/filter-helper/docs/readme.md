Filter helper can be used for filter tasks.
### methods ###
 * `mergeStateParams(filter: FilterModel, $stateParams): void`
 	:
 	Merge state params into current filter. Can be used to load state params on load.

 * `generateStateParams(filter: FilterModel): Object`
 	:
 	Generate state params from current filter. Can be used to navigate to state with passed params.

 * `generateDynamicParams(filter: FilterModel, defaultParams: Object = null): Object`
 	:
 	Generate state config params dynamic object so it can be used with filter.
	 
 * `generateUrlParams(filter: FilterModel): string`
 	:
 	Generate state config urls params so it can be used with filter.



	 
