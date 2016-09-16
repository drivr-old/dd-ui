Filter tags can be used to show active filters

### options ###
 * `filter`
 	:
 	FilterModel object. Note that in order to update tags you need to create new filter object reference in order for component to trigger $onChanges hook. Use angular.copy for this.

 * `onSelect`
 	:
 	Called on tag select. Passes clicked tag fieldName.

 * `onRemove`
 	:
 	Called on tag remove. Passes clicked tag fieldName.

 * `onRemoveAll`
 	:
 	Called on remove all tags.


	 
