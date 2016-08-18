Our lookup, based on UI Bootstrap Typeahead directive.

### Lookup Settings ###

 * `ng-model`
 	:
 	The selected item.

 * `url`
    :
    Url of the endpoint to fetch data from. Response must be an array, otherwise a response transformer can be used.

 * `lookup-on-select`
 	:
 	An optional attribute that can be used to specify a callback for the select event.
     
 * `lookup-on-clear`
 	:
 	Can be used to specify a callback that is fired when lookup model is cleared.

 * `lookup-params`
 	_(Default: null)_ :
 	An optional object that holds url parameters for the API endpoint.

 * `template-url`
    _(Default: 'template/lookup/lookup.html')_ :
    Allows overriding of default template of the lookup.

 * `lookup-format`
    :
    An optional attribute that allows to specify a function that formats the item labels.

 * `placeholder`
    :
    Adds a placeholder attribute to the lookup input.

 * `required`
    :
    Adds a required attribute to the lookup input.

 * `lookup-response-transform`
    :
    An optional attribute that allows to specify a function that transforms response. Useful when response is not an array.
    
 * `lookup-data-provider`
    :
    Can be used instead of `url` to specify a function providing data.
    
 * `lookup-grouping`
    _(Default: 'group')_ :
    If set enables result grouping by exploiting provided model property.
    
 * `lookup-min-length`
    _(Default: `1`)_ :
    Minimal no of characters that needs to be entered before lookup kicks-in. Must be greater than or equal to 0.
    __IMPORTANT__: Must be an integer value to work correctly.
    
 * `lookup-input-class`
    :
    HTML class (or classes) to use on lookup input element.