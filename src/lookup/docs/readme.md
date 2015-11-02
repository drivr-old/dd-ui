Our lookup, based on UI Bootstrap Typeahead directive.

### Lookup Settings ###

 * `ng-model`
 	:
 	The selected item.

 * `url`
    :
    Url of the endpoint to fetch data from.

 * `lookup-on-select`
 	:
 	An optional attribute that can be used to specify a callback for the select event.

 * `lookup-params`
 	_(Default: null)_ :
 	An optional object that holds url parameters for the API endpoint.

 * `template-url`
    _(Default: 'template/lookup/lookup.html') :
    Allows overriding of default template of the lookup.

 * `lookup-format`
    _(Default: ['{0}', 'name']) :
    Allows custom format of the item labels.

 * `placeholder`
    :
    Adds a placeholder attribute to the lookup input.

 * `required`
    :
    Adds a required attribute to the lookup input.